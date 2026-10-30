/**
 * GAME ENGINE
 * State management for Gauntlet (5 Levels), Heardle, and Free Play modes.
 */
import { SONGS, DIFFICULTY_LEVELS, SNIPPET_DURATIONS, getRandomSong, getSongById, getSongsByDifficulty } from './songs.js?v=20261030b';

export const GAME_MODES = {
  GAUNTLET: 'gauntlet',
  HEARDLE: 'heardle',
  FREEPLAY: 'freeplay'
};

const STATS_KEY = 'keocon_game_stats';

export class GameEngine {
  constructor() {
    this.mode = GAME_MODES.GAUNTLET;
    this.currentLevelIndex = 0; // 0 to 4 for Gauntlet
    this.currentStepIndex = 0;  // 0 to 4 for Snippet duration (0.1, 0.5, 2.0, 8.0, 15.0)
    this.currentSong = null;
    this.gauntletQueue = [];    // Pre-selected 5 songs for Gauntlet mode
    this.history = [];          // list of guesses in current round
    this.status = 'playing';    // 'playing' | 'won' | 'lost'
    this.gauntletResults = [];  // Array of 5 outcomes in gauntlet mode

    this.stats = this.loadStats();
  }

  loadStats() {
    try {
      const data = localStorage.getItem(STATS_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Could not load stats from localStorage:', e);
    }
    return {
      played: 0,
      won: 0,
      currentStreak: 0,
      maxStreak: 0,
      distribution: [0, 0, 0, 0, 0] // 0.1s, 0.5s, 2s, 8s, 15s
    };
  }

  saveStats() {
    try {
      localStorage.setItem(STATS_KEY, JSON.stringify(this.stats));
    } catch (e) {
      console.warn('Could not save stats to localStorage:', e);
    }
  }

  /**
   * Starts a brand new Gauntlet run (Levels 0 through 4)
   */
  startGauntlet() {
    this.mode = GAME_MODES.GAUNTLET;
    this.currentLevelIndex = 0;
    this.gauntletResults = [];
    this.gauntletQueue = DIFFICULTY_LEVELS.map(d => getRandomSong(d.id));
    this.loadLevelSong(0);
  }

  /**
   * Starts a single-song Heardle challenge
   */
  startHeardle(songId = null) {
    this.mode = GAME_MODES.HEARDLE;
    this.currentSong = songId ? getSongById(songId) : getRandomSong();
    this.currentStepIndex = 0;
    this.history = [];
    this.status = 'playing';
  }

  /**
   * Starts Free Play with a given difficulty
   */
  startFreePlay(difficulty = 'easy') {
    this.mode = GAME_MODES.FREEPLAY;
    this.currentSong = getRandomSong(difficulty);
    this.currentStepIndex = 0;
    this.history = [];
    this.status = 'playing';
  }

  loadLevelSong(levelIndex) {
    this.currentLevelIndex = levelIndex;
    const diff = DIFFICULTY_LEVELS[levelIndex].id;
    this.currentSong = (this.gauntletQueue && this.gauntletQueue[levelIndex]) || getRandomSong(diff);
    this.currentStepIndex = 0;
    this.history = [];
    this.status = 'playing';
  }

  getNextGauntletSong() {
    if (this.mode === GAME_MODES.GAUNTLET && this.currentLevelIndex < 4) {
      return this.gauntletQueue?.[this.currentLevelIndex + 1] || null;
    }
    return null;
  }

  getCurrentDuration() {
    return SNIPPET_DURATIONS[this.currentStepIndex];
  }

  getCurrentDifficulty() {
    if (this.mode === GAME_MODES.GAUNTLET) {
      return DIFFICULTY_LEVELS[this.currentLevelIndex];
    }
    const match = DIFFICULTY_LEVELS.find(d => d.id === this.currentSong.difficulty);
    return match || DIFFICULTY_LEVELS[0];
  }

  /**
   * Process a guess attempt
   */
  submitGuess(guessSongId) {
    if (this.status !== 'playing') return null;

    const isCorrect = guessSongId === this.currentSong.id;
    const duration = this.getCurrentDuration();

    this.history.push({
      guessId: guessSongId,
      stepIndex: this.currentStepIndex,
      duration,
      isCorrect,
      isSkip: false
    });

    if (isCorrect) {
      this.status = 'won';
      this.recordWin(this.currentStepIndex);

      if (this.mode === GAME_MODES.GAUNTLET) {
        this.gauntletResults.push({
          levelIndex: this.currentLevelIndex,
          song: this.currentSong,
          won: true,
          duration
        });
      }

      return { isCorrect: true, song: this.currentSong, duration };
    }

    // Wrong guess: advance step or lose
    if (this.currentStepIndex < SNIPPET_DURATIONS.length - 1) {
      this.currentStepIndex++;
      return { isCorrect: false, advanced: true, nextDuration: this.getCurrentDuration() };
    } else {
      // Reached 15s and still wrong
      this.status = 'lost';
      this.recordLoss();

      if (this.mode === GAME_MODES.GAUNTLET) {
        this.gauntletResults.push({
          levelIndex: this.currentLevelIndex,
          song: this.currentSong,
          won: false,
          duration
        });
      }

      return { isCorrect: false, advanced: false, lost: true, song: this.currentSong };
    }
  }

  /**
   * Skip to the next snippet duration
   */
  skip() {
    if (this.status !== 'playing') return null;

    const duration = this.getCurrentDuration();
    this.history.push({
      guessId: null,
      stepIndex: this.currentStepIndex,
      duration,
      isCorrect: false,
      isSkip: true
    });

    if (this.currentStepIndex < SNIPPET_DURATIONS.length - 1) {
      this.currentStepIndex++;
      return { advanced: true, nextDuration: this.getCurrentDuration() };
    } else {
      return { advanced: false, canGiveUp: true };
    }
  }

  /**
   * Give up on current song
   */
  giveUp() {
    if (this.status !== 'playing') return null;
    this.status = 'lost';
    this.recordLoss();

    if (this.mode === GAME_MODES.GAUNTLET) {
      this.gauntletResults.push({
        levelIndex: this.currentLevelIndex,
        song: this.currentSong,
        won: false,
        duration: this.getCurrentDuration()
      });
    }

    return { song: this.currentSong };
  }

  /**
   * Advances to next level in Gauntlet mode
   */
  nextGauntletLevel() {
    if (this.currentLevelIndex < 4) {
      this.loadLevelSong(this.currentLevelIndex + 1);
      return { finished: false, levelIndex: this.currentLevelIndex };
    } else {
      return { finished: true, results: this.gauntletResults };
    }
  }

  recordWin(stepIdx) {
    this.stats.played++;
    this.stats.won++;
    this.stats.currentStreak++;
    if (this.stats.currentStreak > this.stats.maxStreak) {
      this.stats.maxStreak = this.stats.currentStreak;
    }
    if (this.stats.distribution[stepIdx] !== undefined) {
      this.stats.distribution[stepIdx]++;
    }
    this.saveStats();
  }

  recordLoss() {
    this.stats.played++;
    this.stats.currentStreak = 0;
    this.saveStats();
  }

  /**
   * Generates shareable emoji card text
   */
  generateShareText() {
    const emojis = ['🟩', '🟨', '🟧', '🟥', '🟪'];
    const lines = [];

    if (this.mode === GAME_MODES.GAUNTLET) {
      lines.push(`🍬 Kẹo Con Gauntlet - Đoán Nhạc Ngọt!`);
      const wonCount = this.gauntletResults.filter(r => r.won).length;
      lines.push(`Thành tích: ${wonCount}/5 màn`);
      this.gauntletResults.forEach((res, i) => {
        const icon = res.won ? emojis[i] : '⬛';
        lines.push(`Lvl ${i + 1} (${DIFFICULTY_LEVELS[i].label.split(' ')[0]}): ${icon} ${res.won ? res.duration + 's' : 'Trượt'}`);
      });
    } else {
      lines.push(`🍬 Kẹo Con Heardle - Đoán Nhạc Ngọt!`);
      const icon = this.status === 'won' ? '🟩' : '⬛';
      lines.push(`Kết quả: ${icon} (${this.getCurrentDuration()}s)`);
    }

    lines.push(`Chơi ngay tại: https://keo-con.01112003.xyz`);
    return lines.join('\n');
  }
}
