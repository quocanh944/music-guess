/**
 * AUDIO MANAGER (Progressive 3-Tier Byte-Range & Web Audio API Engine)
 *
 * Tier 1 (Instant ~36KB): Preloads first ~2.8s via HTTP Range / Stream slicing
 *        for zero-latency 0.1s, 0.5s, and 2.0s snippet playback in RAM.
 * Tier 2 (Background ~208KB): Silently preloads first ~16.5s in the background
 *        so 8.0s and 15.0s snippets are ready in RAM before the user skips.
 * Tier 3 (Full Track Stream): Streams the full MP3 via HTML5 Audio element
 *        only when the reveal modal opens at the end of the round.
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
    this.activeSource = null;
    this.activeGain = null;

    // HTML5 Audio element used strictly for Tier 3 (full-song streaming in Reveal Modal)
    this.audioElement = new Audio();
    this.audioElement.preload = 'metadata';

    this.isPlaying = false;
    this.currentDuration = 0;
    this.progressInterval = null;
    this.stopTimer = null;

    // Cache of url -> { buffer, maxDuration, tier1Promise, tier2Promise }
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
   * and ReadableStream byte-capping (so even servers ignoring Range won't download the full 3MB file).
   */
  async fetchAudioSlice(url, maxBytes) {
    const controller = new AbortController();
    try {
      const res = await fetch(url, {
        headers: { Range: `bytes=0-${maxBytes - 1}` },
        signal: controller.signal
      });

      if (!res.ok && res.status !== 206) {
        throw new Error(`HTTP ${res.status}`);
      }

      // If the server returned 206 Partial Content with exact range, read arrayBuffer directly
      const contentLength = parseInt(res.headers.get('content-length') || '0', 10);
      if (res.status === 206 && contentLength > 0 && contentLength <= maxBytes + 4096) {
        return await res.arrayBuffer();
      }

      // Otherwise (e.g. 200 OK full stream), read chunks up to maxBytes and abort connection early
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
    } catch (err) {
      if (err.name === 'AbortError') {
        throw err;
      }
      throw err;
    }
  }

  /**
   * Decodes a partial MP3 ArrayBuffer into a Web Audio API AudioBuffer
   */
  async decodeSlice(url, maxBytes) {
    const arrayBuffer = await this.fetchAudioSlice(url, maxBytes);
    const ctx = this.getDecodeContext();
    // Copy buffer in case decodeAudioData detaches it
    const copy = arrayBuffer.slice(0);
    return await ctx.decodeAudioData(copy);
  }

  /**
   * Preloads a song using the 2-stage progressive strategy:
   * 1. Tier 1 (36KB ~ 2.8s) immediately for 0.1s / 0.5s / 2.0s.
   * 2. Tier 2 (208KB ~ 16.5s) in the background for 8.0s / 15.0s.
   * 3. Optional: Tier 1 preload for the next level's song.
   */
  preloadSong(song, nextSong = null) {
    if (!song || !song.audioFile) return null;
    const url = song.audioFile;

    let entry = this.bufferCache.get(url);
    if (!entry) {
      entry = {
        buffer: null,
        maxDuration: 0,
        tier1Promise: null,
        tier2Promise: null,
        failed: false
      };
      this.bufferCache.set(url, entry);
    }

    // Start Tier 1 (36KB) immediately if not started
    if (!entry.tier1Promise) {
      entry.tier1Promise = this.decodeSlice(url, TIER1_BYTES)
        .then(audioBuffer => {
          // Only set if Tier 2 hasn't already populated a longer buffer
          if (!entry.buffer || audioBuffer.duration > entry.maxDuration) {
            entry.buffer = audioBuffer;
            entry.maxDuration = audioBuffer.duration;
          }
          // Automatically kick off Tier 2 (208KB) in background
          this.ensureTier2(url);

          // Also preload Tier 1 of the next Gauntlet level song in background
          if (nextSong && nextSong.audioFile) {
            this.preloadTier1Only(nextSong);
          }
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

    const entry = {
      buffer: null,
      maxDuration: 0,
      tier1Promise: null,
      tier2Promise: null,
      failed: false
    };
    this.bufferCache.set(url, entry);

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
    let entry = this.bufferCache.get(url);
    if (!entry) {
      entry = { buffer: null, maxDuration: 0, tier1Promise: null, tier2Promise: null, failed: false };
      this.bufferCache.set(url, entry);
    }
    if (!entry.tier2Promise) {
      entry.tier2Promise = this.decodeSlice(url, TIER2_BYTES)
        .then(audioBuffer => {
          entry.buffer = audioBuffer;
          entry.maxDuration = audioBuffer.duration;
          return audioBuffer;
        })
        .catch(err => {
          console.warn('Tier 2 preload failed:', err);
          entry.failed = true;
          return null;
        });
    }
    return entry.tier2Promise;
  }

  /**
   * Plays a snippet of the song for `duration` seconds using sample-accurate Web Audio API
   */
  async playSnippet(song, duration, onProgress, onEnd, onLoadingChange) {
    this.stop();
    this.isPlaying = true;
    this.currentDuration = duration;

    const ctx = this.getAudioContext();
    if (ctx.state === 'suspended') {
      await ctx.resume().catch(() => {});
    }

    let targetBuffer = null;

    if (song && song.audioFile) {
      const entry = this.preloadSong(song);

      // Check if existing decoded buffer in RAM is already long enough
      if (entry && entry.buffer && entry.maxDuration >= duration) {
        targetBuffer = entry.buffer;
      } else if (entry && !entry.failed) {
        // Notify UI that we are waiting for the small chunk to finish loading
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

    // If user clicked stop while waiting for network chunk, abort playback
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

        // Micro fade-out (8ms) at the very end to avoid any speaker click on 0.1s cut
        const fadeTime = Math.min(0.008, playDur * 0.2);
        gainNode.gain.setValueAtTime(1.0, now);
        gainNode.gain.setValueAtTime(1.0, Math.max(now, now + playDur - fadeTime));
        gainNode.gain.linearRampToValueAtTime(0.0001, now + playDur);

        this.activeSource = source;
        this.activeGain = gainNode;

        // Start sample-accurate playback from 0.0s for `playDur` seconds
        source.start(now, 0, playDur);

        // Start UI progress loop synchronized with hardware audio clock
        const startPerf = performance.now();
        const durationMs = duration * 1000;

        const updateProgress = () => {
          if (!this.isPlaying) return;
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
          if (!this.isPlaying) return;
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
   * Tier 3: Streams the full audio track progressively for the Reveal Modal
   */
  async playFullTrack(song, onProgress, onEnd) {
    this.stop();
    this.isPlaying = true;

    if (song && song.audioFile) {
      try {
        // Avoid resetting src if already loaded for the same song
        if (!this.audioElement.src || !this.audioElement.src.endsWith(song.audioFile)) {
          this.audioElement.src = song.audioFile;
        }
        this.audioElement.currentTime = 0;
        await this.audioElement.play();

        const updateTrack = () => {
          if (!this.isPlaying || this.audioElement.paused) return;
          const cur = this.audioElement.currentTime;
          const dur = this.audioElement.duration || 200;
          const prog = Math.min(1.0, cur / dur);
          if (onProgress) onProgress(prog, cur, dur);
          if (cur < dur) {
            this.progressInterval = requestAnimationFrame(updateTrack);
          }
        };
        this.progressInterval = requestAnimationFrame(updateTrack);

        this.audioElement.onended = () => {
          this.isPlaying = false;
          if (onEnd) onEnd();
        };
        return;
      } catch (err) {
        console.warn('Full track streaming playback failed:', err);
      }
    }

    // Fallback to 15s snippet
    this.playSnippet(song, 15.0, onProgress, onEnd);
  }

  seek(fraction) {
    if (this.audioElement && this.audioElement.duration) {
      this.audioElement.currentTime = fraction * this.audioElement.duration;
    }
  }

  stop() {
    this.isPlaying = false;
    if (this.progressInterval) {
      cancelAnimationFrame(this.progressInterval);
      this.progressInterval = null;
    }
    if (this.stopTimer) {
      clearTimeout(this.stopTimer);
      this.stopTimer = null;
    }
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
    try {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
    } catch (e) {}
    this.synth.stop();
  }
}
