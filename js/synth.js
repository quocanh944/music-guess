/**
 * WEB AUDIO SYNTHESIZER
 * Synthesizes iconic Ngọt riffs & instruments using Web Audio API oscillators,
 * filters, and envelopes. Guarantees 100% playable audio out of the box!
 */

const NOTE_FREQS = {
  'C3': 130.81, 'C#3': 138.59, 'D3': 146.83, 'Eb3': 155.56, 'E3': 164.81, 'F3': 174.61, 'F#3': 185.00, 'G3': 196.00, 'Ab3': 207.65, 'A3': 220.00, 'A#3': 233.08, 'Bb3': 233.08, 'B3': 246.94,
  'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'Eb4': 311.13, 'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'Ab4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'Bb4': 466.16, 'B4': 493.88,
  'C5': 523.25, 'C#5': 554.37, 'D5': 587.33, 'Eb5': 622.25, 'E5': 659.25, 'F5': 698.46, 'F#5': 739.99, 'G5': 783.99, 'G#5': 830.61, 'A5': 880.00, 'Bb5': 932.33, 'B5': 987.77
};

export class NgotSynthesizer {
  constructor() {
    this.ctx = null;
    this.activeNodes = [];
    this.stopTimer = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  stop() {
    if (this.stopTimer) {
      clearTimeout(this.stopTimer);
      this.stopTimer = null;
    }
    for (const node of this.activeNodes) {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (e) {
        // node already stopped
      }
    }
    this.activeNodes = [];
  }

  /**
   * Play a song hook for an exact duration (e.g. 0.1s, 0.5s, 2s, 8s, 15s)
   */
  playSongHook(song, maxDuration, onEnd) {
    this.init();
    this.stop();

    const hook = song.synthHook || {
      tempo: 120,
      melody: [{ note: 'A4', dur: 0.5 }, { note: 'C5', dur: 0.5 }, { note: 'E5', dur: 1.0 }],
      instrument: 'guitar'
    };

    const startTime = this.ctx.currentTime + 0.05;
    const beatSec = 60 / hook.tempo;
    let currentBeatTime = 0;

    // Master gain with smooth fade-in and cut
    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(0.7, startTime);
    // Smooth fade out at maxDuration
    const fadeStart = Math.max(0, maxDuration - 0.04);
    masterGain.gain.setValueAtTime(0.7, startTime + fadeStart);
    masterGain.gain.linearRampToValueAtTime(0.001, startTime + maxDuration);
    masterGain.connect(this.ctx.destination);
    this.activeNodes.push(masterGain);

    // Loop through notes until duration exceeds maxDuration
    let loop = 0;
    while (currentBeatTime < maxDuration + 2 && loop < 10) {
      for (const item of hook.melody) {
        const noteDuration = item.dur * beatSec;
        const noteStart = startTime + currentBeatTime;

        if (currentBeatTime >= maxDuration) break;

        const freq = NOTE_FREQS[item.note] || 440;
        this.triggerInstrumentNote(hook.instrument, freq, noteStart, noteDuration, masterGain);

        currentBeatTime += noteDuration;
      }
      loop++;
    }

    // Schedule stop and callback
    this.stopTimer = setTimeout(() => {
      this.stop();
      if (onEnd) onEnd();
    }, maxDuration * 1000);
  }

  triggerInstrumentNote(instrument, freq, startTime, duration, outputNode) {
    const osc = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();

    if (instrument === 'rockGuitar') {
      osc.type = 'sawtooth';
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, startTime);
      filter.frequency.exponentialRampToValueAtTime(600, startTime + duration);

      noteGain.gain.setValueAtTime(0.4, startTime);
      noteGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(filter);
      filter.connect(noteGain);
    } else if (instrument === 'funkyKeys') {
      osc.type = 'square';
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(900, startTime);
      filter.Q.value = 2.0;

      noteGain.gain.setValueAtTime(0.35, startTime);
      noteGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(filter);
      filter.connect(noteGain);
    } else if (instrument === 'bass') {
      osc.type = 'triangle';
      noteGain.gain.setValueAtTime(0.6, startTime);
      noteGain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
      osc.connect(noteGain);
    } else if (instrument === 'psychedelicSynth') {
      osc.type = 'sawtooth';
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2200, startTime);
      filter.frequency.linearRampToValueAtTime(300, startTime + duration);

      noteGain.gain.setValueAtTime(0.35, startTime);
      noteGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(filter);
      filter.connect(noteGain);
    } else {
      // Guitar / Piano
      osc.type = instrument === 'piano' ? 'sine' : 'triangle';
      noteGain.gain.setValueAtTime(0.5, startTime);
      noteGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      osc.connect(noteGain);
    }

    osc.frequency.setValueAtTime(freq, startTime);
    noteGain.connect(outputNode);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.1);
    this.activeNodes.push(osc);
  }
}
