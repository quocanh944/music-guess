/**
 * AUDIO MANAGER
 * Coordinates Web Audio snippet slicing, HTML5 Audio element fallback,
 * and high-frequency progress callbacks for the UI playhead ring.
 */
import { NgotSynthesizer } from './synth.js';

export class AudioManager {
  constructor() {
    this.synth = new NgotSynthesizer();
    this.audioElement = new Audio();
    this.isPlaying = false;
    this.currentDuration = 0;
    this.progressInterval = null;
    this.stopTimer = null;
    this.audioCache = new Map();
  }

  /**
   * Checks whether a remote/local audio file exists and is playable
   */
  async checkAudioFile(url) {
    if (this.audioCache.has(url)) {
      return this.audioCache.get(url);
    }
    try {
      const res = await fetch(url, { method: 'HEAD' });
      const ok = res.ok;
      this.audioCache.set(url, ok);
      return ok;
    } catch {
      this.audioCache.set(url, false);
      return false;
    }
  }

  /**
   * Plays a snippet of the song for exactly `duration` seconds
   */
  async playSnippet(song, duration, onProgress, onEnd) {
    this.stop();
    this.isPlaying = true;
    this.currentDuration = duration;

    const startTime = performance.now();
    const durationMs = duration * 1000;

    // Track smooth progress for the UI ring
    const updateProgress = () => {
      if (!this.isPlaying) return;
      const elapsed = performance.now() - startTime;
      const progress = Math.min(1.0, elapsed / durationMs);

      if (onProgress) {
        onProgress(progress, (elapsed / 1000).toFixed(1));
      }

      if (elapsed < durationMs) {
        this.progressInterval = requestAnimationFrame(updateProgress);
      }
    };
    this.progressInterval = requestAnimationFrame(updateProgress);

    // Attempt real audio file if available
    const hasFile = song.audioFile ? await this.checkAudioFile(song.audioFile) : false;

    if (hasFile) {
      try {
        this.audioElement.src = song.audioFile;
        this.audioElement.currentTime = 0;
        await this.audioElement.play();

        this.stopTimer = setTimeout(() => {
          this.stop();
          if (onEnd) onEnd();
        }, durationMs);
        return;
      } catch (err) {
        console.warn('Real audio playback failed, falling back to synthesizer:', err);
      }
    }

    // Synthesizer fallback for instant playability
    this.synth.playSongHook(song, duration, () => {
      this.isPlaying = false;
      if (this.progressInterval) cancelAnimationFrame(this.progressInterval);
      if (onProgress) onProgress(1.0, duration.toFixed(1));
      if (onEnd) onEnd();
    });
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
    try {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
    } catch (e) {
      // Audio element not initialized
    }
    this.synth.stop();
  }
}
