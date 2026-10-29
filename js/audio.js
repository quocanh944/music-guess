/**
 * AUDIO MANAGER (Progressive 3-Tier Byte-Range & Web Audio API Engine)
 *
 * Tier 1 (Instant ~36KB): Preloads first ~2.8s via HTTP Range / Stream slicing
 *        for zero-latency 0.1s, 0.5s, and 2.0s snippet playback in RAM.
 * Tier 2 (Background ~208KB): Silently preloads first ~16.5s in the background
 *        so 8.0s and 15.0s snippets are ready in RAM before the user skips.
 * Tier 3 (Full Track Web Audio Buffer): Decodes the full track in the background
 *        for 100% instant, glitch-free seeking (fast-forward/rewind) in the Reveal Modal.
 */
import { NgotSynthesizer } from './synth.js';

// At 96kbps (12KB/sec):
// 36KB = ~3.0 seconds (covers 0.1s, 0.5s, 2.0s snippets)
// 208KB = ~17.3 seconds (covers 8.0s and 15.0s snippets)
const TIER1_BYTES = 36 * 1024;
const TIER2_BYTES = 208 * 1024;

export class AudioManager {
  constructor() {
    this.synth = new NgotSynthesizer();
    this.audioCtx = null;
    this.offlineDecodeCtx = null;
    this.activeSource = null;
    this.activeGain = null;

    this.isPlaying = false;
    this.isFullTrackMode = false;
    this.currentDuration = 0;
    this.progressInterval = null;
    this.stopTimer = null;

    // Full-track modal playback state (for instant seek & pause/resume)
    this.fullTrackSong = null;
    this.fullTrackOffset = 0;       // Playback position (seconds) when started/paused
    this.fullTrackStartCtxTime = 0; // audioCtx.currentTime when playback started
    this.fullTrackDuration = 0;     // Total duration of full song
    this.fullTrackOnProgress = null;
    this.fullTrackOnEnd = null;
    this.seekGeneration = 0;

    // Cache of url -> { buffer, fullBuffer, maxDuration, tier1Promise, tier2Promise, fullPromise, failed }
    this.bufferCache = new Map();
  }

  /**
   * Lazily initializes or resumes the Web Audio API context (called on user gesture)
   */
  getAudioContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContextClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  /**
   * Returns a context suitable for decoding audio buffers in the background
   * without triggering browser autoplay warnings before the first user click.
   */
  getDecodeContext() {
    if (this.audioCtx) return this.audioCtx;
    if (!this.offlineDecodeCtx) {
      const OfflineCtx = window.OfflineAudioContext || window.webkitOfflineAudioContext;
      this.offlineDecodeCtx = new OfflineCtx(2, 1, 48000);
    }
    return this.offlineDecodeCtx;
  }

  /**
   * Fetches up to `maxBytes` of an MP3 file using both HTTP Range header
   * and ReadableStream byte-capping. Uses a distinct query param `?slice=`
   * so partial/aborted responses never collide with the full-file cache.
   */
  async fetchAudioSlice(url, maxBytes) {
    const controller = new AbortController();
    const sliceUrl = `${url}?slice=${maxBytes}`;
    const res = await fetch(sliceUrl, {
      headers: { Range: `bytes=0-${maxBytes - 1}` },
      signal: controller.signal
    });

    if (!res.ok && res.status !== 206) {
      throw new Error(`HTTP ${res.status}`);
    }

    const contentLength = parseInt(res.headers.get('content-length') || '0', 10);
    if (res.status === 206 && contentLength > 0 && contentLength <= maxBytes + 4096) {
      return await res.arrayBuffer();
    }

    if (res.body && res.body.getReader) {
      const reader = res.body.getReader();
      const chunks = [];
      let received = 0;

      while (received < maxBytes) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        received += value.byteLength;
        if (received >= maxBytes) {
          controller.abort();
          break;
        }
      }

      const combined = new Uint8Array(Math.min(received, maxBytes));
      let offset = 0;
      for (const chunk of chunks) {
        const remaining = combined.byteLength - offset;
        if (remaining <= 0) break;
        const slice = chunk.byteLength > remaining ? chunk.subarray(0, remaining) : chunk;
        combined.set(slice, offset);
        offset += slice.byteLength;
      }
      return combined.buffer;
    }

    return await res.arrayBuffer();
  }

  /**
   * Decodes a partial MP3 ArrayBuffer into a Web Audio API AudioBuffer
   */
  async decodeSlice(url, maxBytes) {
    const arrayBuffer = await this.fetchAudioSlice(url, maxBytes);
    const ctx = this.getDecodeContext();
    const copy = arrayBuffer.slice(0);
    return await ctx.decodeAudioData(copy);
  }

  /**
   * Fetches and decodes the entire MP3 file into an AudioBuffer for instant seeking
   */
  async decodeFullFile(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const arrayBuffer = await res.arrayBuffer();
    const ctx = this.getDecodeContext();
    const copy = arrayBuffer.slice(0);
    return await ctx.decodeAudioData(copy);
  }

  getOrCreateEntry(url) {
    let entry = this.bufferCache.get(url);
    if (!entry) {
      entry = {
        buffer: null,
        fullBuffer: null,
        maxDuration: 0,
        tier1Promise: null,
        tier2Promise: null,
        fullPromise: null,
        failed: false
      };
      this.bufferCache.set(url, entry);
    }
    return entry;
  }

  /**
   * Preloads a song using the 3-stage progressive strategy:
   * 1. Tier 1 (36KB ~ 2.8s) immediately for 0.1s / 0.5s / 2.0s.
   * 2. Tier 2 (208KB ~ 16.5s) in the background for 8.0s / 15.0s.
   * 3. Tier 3 (Full Track) in the background after Tier 2 for instant modal seeking.
   */
  preloadSong(song, nextSong = null) {
    if (!song || !song.audioFile) return null;
    const url = song.audioFile;
    const entry = this.getOrCreateEntry(url);

    if (!entry.tier1Promise) {
      entry.tier1Promise = this.decodeSlice(url, TIER1_BYTES)
        .then(audioBuffer => {
          if (!entry.buffer || audioBuffer.duration > entry.maxDuration) {
            entry.buffer = audioBuffer;
            entry.maxDuration = audioBuffer.duration;
          }
          // Kick off Tier 2 (208KB) in background
          this.ensureTier2(url).then(() => {
            // Once 16.5s intro is ready, preload Tier 1 of next level + full track in background
            if (nextSong && nextSong.audioFile) {
              this.preloadTier1Only(nextSong);
            }
            this.ensureFullBuffer(url);
          });
          return audioBuffer;
        })
        .catch(err => {
          console.warn('Tier 1 preload failed, trying Tier 2:', err);
          return this.ensureTier2(url);
        });
    } else if (!entry.tier2Promise) {
      this.ensureTier2(url);
    }

    return entry;
  }

  /**
   * Preloads only Tier 1 (36KB) for an upcoming song
   */
  preloadTier1Only(song) {
    if (!song || !song.audioFile) return;
    const url = song.audioFile;
    if (this.bufferCache.has(url)) return;

    const entry = this.getOrCreateEntry(url);
    entry.tier1Promise = this.decodeSlice(url, TIER1_BYTES)
      .then(audioBuffer => {
        if (!entry.buffer || audioBuffer.duration > entry.maxDuration) {
          entry.buffer = audioBuffer;
          entry.maxDuration = audioBuffer.duration;
        }
        return audioBuffer;
      })
      .catch(() => {});
  }

  /**
   * Ensures the 16.5s Tier 2 intro buffer (208KB) is loaded in background
   */
  ensureTier2(url) {
    const entry = this.getOrCreateEntry(url);
    if (!entry.tier2Promise) {
      entry.tier2Promise = this.decodeSlice(url, TIER2_BYTES)
        .then(audioBuffer => {
          if (!entry.fullBuffer && audioBuffer.duration > entry.maxDuration) {
            entry.buffer = audioBuffer;
            entry.maxDuration = audioBuffer.duration;
          }
          return audioBuffer;
        })
        .catch(err => {
          console.warn('Tier 2 preload failed:', err);
          return null;
        });
    }
    return entry.tier2Promise;
  }

  /**
   * Ensures the full song AudioBuffer is decoded for instant modal seeking
   */
  ensureFullBuffer(url) {
    const entry = this.getOrCreateEntry(url);
    if (!entry.fullPromise) {
      entry.fullPromise = this.decodeFullFile(url)
        .then(fullAudioBuffer => {
          entry.fullBuffer = fullAudioBuffer;
          entry.buffer = fullAudioBuffer;
          entry.maxDuration = fullAudioBuffer.duration;
          return fullAudioBuffer;
        })
        .catch(err => {
          console.warn('Full buffer decode failed:', err);
          return null;
        });
    }
    return entry.fullPromise;
  }

  /**
   * Plays a snippet of the song for `duration` seconds using sample-accurate Web Audio API
   */
  async playSnippet(song, duration, onProgress, onEnd, onLoadingChange) {
    this.stop();
    this.isPlaying = true;
    this.isFullTrackMode = false;
    this.currentDuration = duration;

    const ctx = this.getAudioContext();
    if (ctx.state === 'suspended') {
      await ctx.resume().catch(() => {});
    }

    let targetBuffer = null;

    if (song && song.audioFile) {
      const entry = this.preloadSong(song);

      if (entry && entry.buffer && entry.maxDuration >= duration) {
        targetBuffer = entry.buffer;
      } else if (entry && !entry.failed) {
        if (onLoadingChange) onLoadingChange(true);
        try {
          if (duration <= 2.1 && entry.tier1Promise) {
            await entry.tier1Promise;
          } else {
            await this.ensureTier2(song.audioFile);
          }
          if (entry.buffer) {
            targetBuffer = entry.buffer;
          }
        } catch (e) {
          console.warn('Audio buffer wait error:', e);
        }
        if (onLoadingChange) onLoadingChange(false);
      }
    }

    if (!this.isPlaying) return;

    if (targetBuffer) {
      try {
        const source = ctx.createBufferSource();
        const gainNode = ctx.createGain();

        source.buffer = targetBuffer;
        source.connect(gainNode);
        gainNode.connect(ctx.destination);

        const now = ctx.currentTime;
        const playDur = Math.min(duration, targetBuffer.duration);

        const fadeTime = Math.min(0.008, playDur * 0.2);
        gainNode.gain.setValueAtTime(1.0, now);
        gainNode.gain.setValueAtTime(1.0, Math.max(now, now + playDur - fadeTime));
        gainNode.gain.linearRampToValueAtTime(0.0001, now + playDur);

        this.activeSource = source;
        this.activeGain = gainNode;

        source.start(now, 0, playDur);

        const startPerf = performance.now();
        const durationMs = duration * 1000;

        const updateProgress = () => {
          if (!this.isPlaying || this.isFullTrackMode) return;
          const elapsed = performance.now() - startPerf;
          const progress = Math.min(1.0, elapsed / durationMs);

          if (onProgress) {
            onProgress(progress, (Math.min(elapsed, durationMs) / 1000).toFixed(1));
          }

          if (elapsed < durationMs) {
            this.progressInterval = requestAnimationFrame(updateProgress);
          }
        };
        this.progressInterval = requestAnimationFrame(updateProgress);

        source.onended = () => {
          if (!this.isPlaying || this.isFullTrackMode) return;
          this.isPlaying = false;
          this.activeSource = null;
          this.activeGain = null;
          if (this.progressInterval) {
            cancelAnimationFrame(this.progressInterval);
            this.progressInterval = null;
          }
          if (onProgress) onProgress(1.0, duration.toFixed(1));
          if (onEnd) onEnd();
        };

        return;
      } catch (err) {
        console.warn('Web Audio API snippet playback failed, falling back to synthesizer:', err);
      }
    }

    // Synthesizer fallback if network is completely offline
    const startPerf = performance.now();
    const durationMs = duration * 1000;
    const updateSynthProgress = () => {
      if (!this.isPlaying) return;
      const elapsed = performance.now() - startPerf;
      const progress = Math.min(1.0, elapsed / durationMs);
      if (onProgress) onProgress(progress, (elapsed / 1000).toFixed(1));
      if (elapsed < durationMs) {
        this.progressInterval = requestAnimationFrame(updateSynthProgress);
      }
    };
    this.progressInterval = requestAnimationFrame(updateSynthProgress);

    this.synth.playSongHook(song, duration, () => {
      this.isPlaying = false;
      if (this.progressInterval) cancelAnimationFrame(this.progressInterval);
      if (onProgress) onProgress(1.0, duration.toFixed(1));
      if (onEnd) onEnd();
    });
  }

  /**
   * Returns current playback timestamp in seconds for the modal full-track player
   */
  getCurrentFullTime() {
    if (!this.isPlaying || !this.isFullTrackMode || !this.audioCtx) {
      return this.fullTrackOffset;
    }
    const elapsed = Math.max(0, this.audioCtx.currentTime - this.fullTrackStartCtxTime);
    return Math.min(this.fullTrackDuration || 300, this.fullTrackOffset + elapsed);
  }

  /**
   * Starts or resumes a Web Audio buffer source at `offsetSec` for full-track modal playback
   */
  startBufferAtOffset(buffer, offsetSec) {
    this.stopActiveSourceOnly();

    const ctx = this.getAudioContext();
    const clampedOffset = Math.max(0, Math.min(offsetSec, buffer.duration - 0.05));

    const source = ctx.createBufferSource();
    const gainNode = ctx.createGain();
    source.buffer = buffer;
    source.connect(gainNode);
    gainNode.connect(ctx.destination);

    this.activeSource = source;
    this.activeGain = gainNode;
    this.fullTrackOffset = clampedOffset;
    this.fullTrackStartCtxTime = ctx.currentTime;
    this.fullTrackDuration = buffer.duration;

    const myGen = ++this.seekGeneration;
    source.start(0, clampedOffset);

    if (this.progressInterval) {
      cancelAnimationFrame(this.progressInterval);
    }

    const updateTrack = () => {
      if (!this.isPlaying || !this.isFullTrackMode || this.seekGeneration !== myGen) return;
      const cur = this.getCurrentFullTime();
      const dur = this.fullTrackDuration || buffer.duration;
      const prog = Math.min(1.0, cur / dur);
      if (this.fullTrackOnProgress) {
        this.fullTrackOnProgress(prog, cur, dur);
      }
      if (cur < dur) {
        this.progressInterval = requestAnimationFrame(updateTrack);
      }
    };
    this.progressInterval = requestAnimationFrame(updateTrack);

    source.onended = () => {
      if (!this.isPlaying || !this.isFullTrackMode || this.seekGeneration !== myGen) return;
      const cur = this.getCurrentFullTime();
      if (cur >= this.fullTrackDuration - 0.25) {
        this.isPlaying = false;
        this.fullTrackOffset = 0;
        if (this.fullTrackOnEnd) this.fullTrackOnEnd();
      }
    };
  }

  /**
   * Tier 3: Plays the full track in the Reveal Modal using Web Audio API
   * so seeking (fast-forward / rewind) is 100% instant and never resets to 0:00.
   */
  async playFullTrack(song, onProgress, onEnd, resumeFromPaused = false) {
    const isSameSong = this.fullTrackSong && song && this.fullTrackSong.id === song.id;
    const startOffset = (resumeFromPaused && isSameSong && this.fullTrackOffset > 0)
      ? this.fullTrackOffset
      : 0;

    this.stopActiveSourceOnly();
    if (this.progressInterval) {
      cancelAnimationFrame(this.progressInterval);
      this.progressInterval = null;
    }

    this.isPlaying = true;
    this.isFullTrackMode = true;
    this.fullTrackSong = song;
    this.fullTrackOffset = startOffset;
    this.fullTrackOnProgress = onProgress;
    this.fullTrackOnEnd = onEnd;

    const ctx = this.getAudioContext();
    if (ctx.state === 'suspended') {
      await ctx.resume().catch(() => {});
    }

    if (song && song.audioFile) {
      const entry = this.preloadSong(song);
      const fullPromise = this.ensureFullBuffer(song.audioFile);

      // If full buffer is already decoded in RAM, play immediately from `startOffset`
      if (entry.fullBuffer) {
        this.startBufferAtOffset(entry.fullBuffer, startOffset);
        return;
      }

      // If Tier 1/2 partial buffer is available and covers `startOffset`, start immediately
      // and seamlessly swap to `fullBuffer` as soon as it finishes decoding!
      if (entry.buffer && startOffset < entry.buffer.duration - 0.5) {
        this.startBufferAtOffset(entry.buffer, startOffset);

        fullPromise.then(fullBuf => {
          if (!fullBuf || !this.isPlaying || !this.isFullTrackMode || this.fullTrackSong?.id !== song.id) return;
          // Seamlessly upgrade to full buffer at the exact current playback position
          const currentPos = this.getCurrentFullTime();
          this.startBufferAtOffset(fullBuf, currentPos);
        });
        return;
      }

      // Otherwise await full buffer and play from `startOffset`
      const fullBuf = await fullPromise;
      if (!this.isPlaying || !this.isFullTrackMode) return;
      if (fullBuf) {
        this.startBufferAtOffset(fullBuf, startOffset);
        return;
      }
    }

    // Fallback to 15s snippet
    this.playSnippet(song, 15.0, onProgress, onEnd);
  }

  /**
   * Pauses modal full-track playback while preserving current timestamp
   */
  pauseFullTrack() {
    if (this.isFullTrackMode && this.isPlaying) {
      this.fullTrackOffset = this.getCurrentFullTime();
    }
    this.isPlaying = false;
    this.stopActiveSourceOnly();
    if (this.progressInterval) {
      cancelAnimationFrame(this.progressInterval);
      this.progressInterval = null;
    }
  }

  /**
   * Instant, sample-accurate seek to `fraction` (0.0 -> 1.0) of the full track
   */
  async seek(fraction) {
    const clamped = Math.max(0, Math.min(0.999, fraction));
    const song = this.fullTrackSong;
    if (!song || !song.audioFile) return;

    const entry = this.getOrCreateEntry(song.audioFile);

    // If full buffer isn't decoded yet, await it so we know exact full duration and can seek anywhere
    let targetBuffer = entry.fullBuffer;
    if (!targetBuffer) {
      targetBuffer = await this.ensureFullBuffer(song.audioFile);
    }
    if (!targetBuffer) {
      targetBuffer = entry.buffer;
    }
    if (!targetBuffer) return;

    const dur = targetBuffer.duration;
    const targetSec = clamped * dur;
    this.fullTrackDuration = dur;
    this.fullTrackOffset = targetSec;

    // Immediately update UI bar & time text even if paused
    if (this.fullTrackOnProgress) {
      this.fullTrackOnProgress(clamped, targetSec, dur);
    }

    // If currently playing in modal, immediately jump audio playback to `targetSec`
    if (this.isPlaying && this.isFullTrackMode) {
      this.startBufferAtOffset(targetBuffer, targetSec);
    }
  }

  stopActiveSourceOnly() {
    if (this.activeSource) {
      try {
        this.activeSource.onended = null;
        this.activeSource.stop();
        this.activeSource.disconnect();
      } catch (e) {}
      this.activeSource = null;
    }
    if (this.activeGain) {
      try {
        this.activeGain.disconnect();
      } catch (e) {}
      this.activeGain = null;
    }
  }

  stop() {
    this.isPlaying = false;
    this.isFullTrackMode = false;
    this.fullTrackOffset = 0;
    if (this.progressInterval) {
      cancelAnimationFrame(this.progressInterval);
      this.progressInterval = null;
    }
    if (this.stopTimer) {
      clearTimeout(this.stopTimer);
      this.stopTimer = null;
    }
    this.stopActiveSourceOnly();
    this.synth.stop();
  }
}
