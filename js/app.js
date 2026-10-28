/**
 * MAIN APP CONTROLLER
 * Connects GameEngine, AudioManager, Search, and UI DOM elements.
 */
import { GameEngine, GAME_MODES } from './game.js';
import { AudioManager } from './audio.js';
import { searchSongs } from './search.js';
import { SONGS, ALBUMS, DIFFICULTY_LEVELS, SNIPPET_DURATIONS } from './songs.js';

// Initialize Core Subsystems
const game = new GameEngine();
const audio = new AudioManager();

// DOM Element References
const playBtn = document.getElementById('playBtn');
const playIcon = document.getElementById('playIcon');
const pauseIcon = document.getElementById('pauseIcon');
const playRingProgress = document.getElementById('playRingProgress');
const currentDurationBadge = document.getElementById('currentDurationBadge');
const audioModeLabel = document.getElementById('audioModeLabel');

const difficultyBar = document.getElementById('difficultyBar');
const diffBtns = document.querySelectorAll('.diff-btn');
const stepSegments = document.querySelectorAll('.step-segment');

const songSearchInput = document.getElementById('songSearchInput');
const clearSearchBtn = document.getElementById('clearSearchBtn');
const searchResultsList = document.getElementById('searchResultsList');
const guessBtn = document.getElementById('guessBtn');
const skipBtn = document.getElementById('skipBtn');
const skipBtnText = document.getElementById('skipBtnText');
const attemptsContainer = document.getElementById('attemptsContainer');

// Modals
const revealModal = document.getElementById('revealModal');
const resultBadge = document.getElementById('resultBadge');
const revealGlow = document.getElementById('revealGlow');
const revealCoverImg = document.getElementById('revealCoverImg');
const revealSongTitle = document.getElementById('revealSongTitle');
const revealAlbumInfo = document.getElementById('revealAlbumInfo');
const revealViewsBadge = document.getElementById('revealViewsBadge');
const revealLyricSnippet = document.getElementById('revealLyricSnippet');
const nextLevelBtn = document.getElementById('nextLevelBtn');
const shareResultBtn = document.getElementById('shareResultBtn');

const summaryModal = document.getElementById('summaryModal');
const summaryScoreText = document.getElementById('summaryScoreText');
const summaryLevelsList = document.getElementById('summaryLevelsList');
const restartGauntletBtn = document.getElementById('restartGauntletBtn');
const shareSummaryBtn = document.getElementById('shareSummaryBtn');

const helpModal = document.getElementById('helpModal');
const helpBtn = document.getElementById('helpBtn');
const closeHelpBtn = document.getElementById('closeHelpBtn');
const confirmHelpBtn = document.getElementById('confirmHelpBtn');

const statsModal = document.getElementById('statsModal');
const statsBtn = document.getElementById('statsBtn');
const closeStatsBtn = document.getElementById('closeStatsBtn');
const closeStatsConfirmBtn = document.getElementById('closeStatsConfirmBtn');
const statPlayed = document.getElementById('statPlayed');
const statWinRate = document.getElementById('statWinRate');
const statCurrentStreak = document.getElementById('statCurrentStreak');
const statMaxStreak = document.getElementById('statMaxStreak');

const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

// Mode Buttons
const modeGauntletBtn = document.getElementById('modeGauntletBtn');
const modeHeardleBtn = document.getElementById('modeHeardleBtn');
const modeFreeplayBtn = document.getElementById('modeFreeplayBtn');
const mobileGauntletBtn = document.getElementById('mobileGauntletBtn');
const mobileHeardleBtn = document.getElementById('mobileHeardleBtn');
const mobileFreeplayBtn = document.getElementById('mobileFreeplayBtn');

// SVG Ring Circumference
const RING_RADIUS = 64;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS; // ~402.12
playRingProgress.style.strokeDasharray = `${RING_CIRCUMFERENCE} ${RING_CIRCUMFERENCE}`;
playRingProgress.style.strokeDashoffset = RING_CIRCUMFERENCE;

let selectedSongId = null;

// ==========================================
// INITIALIZATION
// ==========================================
function init() {
  game.startGauntlet();
  renderGameStage();
  setupEventListeners();
}

// ==========================================
// RENDER & UI UPDATES
// ==========================================
function renderGameStage() {
  audio.stop();
  resetPlayhead();

  const currentDiff = game.getCurrentDifficulty();
  const currentDuration = game.getCurrentDuration();

  // Update Difficulty tabs
  diffBtns.forEach((btn, idx) => {
    btn.className = 'diff-btn flex-1 py-1.5 px-1 text-center rounded-xl transition-all duration-300';
    if (idx === game.currentLevelIndex) {
      btn.style.backgroundColor = currentDiff.color;
      btn.style.color = '#000';
      btn.style.boxShadow = `0 4px 15px ${currentDiff.color}40`;
    } else {
      btn.style.backgroundColor = 'transparent';
      btn.style.color = '#94a3b8';
      btn.style.boxShadow = 'none';
    }
  });

  // Update Play Button Colors
  playBtn.style.backgroundColor = currentDiff.color;
  playRingProgress.style.stroke = currentDiff.color;
  currentDurationBadge.style.color = currentDiff.color;
  currentDurationBadge.style.borderColor = `${currentDiff.color}50`;
  currentDurationBadge.textContent = `${currentDuration}s`;

  // Update Progress Segments
  stepSegments.forEach((segment, idx) => {
    if (idx <= game.currentStepIndex) {
      segment.style.backgroundColor = currentDiff.color;
      segment.style.opacity = '1';
    } else {
      segment.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
      segment.style.opacity = '0.5';
    }
  });

  // Update Skip Button
  if (game.currentStepIndex < SNIPPET_DURATIONS.length - 1) {
    const nextDur = SNIPPET_DURATIONS[game.currentStepIndex + 1];
    skipBtnText.textContent = `Bỏ qua (+${nextDur}s)`;
    skipBtn.className = 'flex-1 py-3.5 px-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-bold text-sm flex items-center justify-center space-x-2 transition-all';
  } else {
    skipBtnText.textContent = 'Bỏ cuộc (Chịu thua)';
    skipBtn.className = 'flex-1 py-3.5 px-4 rounded-2xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-400 font-bold text-sm flex items-center justify-center space-x-2 transition-all';
  }

  // Clear inputs and search results
  songSearchInput.value = '';
  clearSearchBtn.classList.add('hidden');
  searchResultsList.classList.add('hidden');
  selectedSongId = null;
  guessBtn.disabled = true;

  // Render previous attempts
  renderAttempts();
}

function renderAttempts() {
  attemptsContainer.innerHTML = '';
  game.history.forEach(item => {
    const row = document.createElement('div');
    row.className = 'w-full p-2.5 rounded-xl border flex items-center justify-between text-xs font-semibold';

    if (item.isCorrect) {
      row.className += ' bg-green-500/20 border-green-500/50 text-green-400';
      row.innerHTML = `
        <span class="flex items-center space-x-2">
          <span>✅</span>
          <span>${game.currentSong.title}</span>
        </span>
        <span class="font-mono text-[11px]">${item.duration}s</span>
      `;
    } else if (item.isSkip) {
      row.className += ' bg-white/5 border-white/10 text-slate-400';
      row.innerHTML = `
        <span class="flex items-center space-x-2">
          <span>⏭️</span>
          <span>Đã bỏ qua đoạn này</span>
        </span>
        <span class="font-mono text-[11px]">${item.duration}s</span>
      `;
    } else {
      const guessedSong = SONGS.find(s => s.id === item.guessId);
      row.className += ' bg-red-500/15 border-red-500/40 text-red-400';
      row.innerHTML = `
        <span class="flex items-center space-x-2">
          <span>❌</span>
          <span>${guessedSong ? guessedSong.title : 'Đoán sai'}</span>
        </span>
        <span class="font-mono text-[11px]">${item.duration}s</span>
      `;
    }

    attemptsContainer.appendChild(row);
  });
}

function resetPlayhead() {
  playIcon.classList.remove('hidden');
  pauseIcon.classList.add('hidden');
  playRingProgress.style.strokeDashoffset = RING_CIRCUMFERENCE;
}

// ==========================================
// AUDIO PLAYBACK HANDLERS
// ==========================================
function toggleAudio() {
  if (audio.isPlaying) {
    audio.stop();
    resetPlayhead();
    audioModeLabel.textContent = 'Tạm dừng. Bấm để nghe lại';
    return;
  }

  playIcon.classList.add('hidden');
  pauseIcon.classList.remove('hidden');
  audioModeLabel.textContent = 'Đang phát đoạn nhạc...';

  const duration = game.getCurrentDuration();

  audio.playSnippet(
    game.currentSong,
    duration,
    (progress, currentSec) => {
      // Update SVG circle stroke offset
      const offset = RING_CIRCUMFERENCE - (progress * RING_CIRCUMFERENCE);
      playRingProgress.style.strokeDashoffset = offset;
      currentDurationBadge.textContent = `${currentSec}s`;
    },
    () => {
      // Completed playback
      resetPlayhead();
      currentDurationBadge.textContent = `${duration}s`;
      audioModeLabel.textContent = 'Nghe lại hoặc chọn câu trả lời';
    }
  );
}

// ==========================================
// GAME ACTION HANDLERS
// ==========================================
function handleGuess() {
  if (!selectedSongId) return;

  const result = game.submitGuess(selectedSongId);
  if (!result) return;

  if (result.isCorrect) {
    // Win round!
    audio.stop();
    triggerConfetti();
    showRevealModal(true, result.song, result.duration);
  } else if (result.lost) {
    // Lost round
    audio.stop();
    showRevealModal(false, result.song, game.getCurrentDuration());
  } else {
    // Wrong guess, advanced to next duration
    renderGameStage();
    // Play short wrong bump sound
    songSearchInput.classList.add('ring-2', 'ring-red-500');
    setTimeout(() => songSearchInput.classList.remove('ring-2', 'ring-red-500'), 500);
  }
}

function handleSkip() {
  if (game.currentStepIndex >= SNIPPET_DURATIONS.length - 1) {
    // Give up
    const res = game.giveUp();
    if (res) {
      audio.stop();
      showRevealModal(false, res.song, 15.0);
    }
    return;
  }

  game.skip();
  renderGameStage();
}

function showRevealModal(won, song, duration) {
  const album = ALBUMS[song.albumId] || ALBUMS.ngot2016;

  revealCoverImg.src = album.cover;
  revealSongTitle.textContent = song.title;
  revealAlbumInfo.textContent = `Album: ${album.name} (${album.year})`;
  revealViewsBadge.textContent = `👁️ ${song.views || 'N/A'} lượt nghe`;
  revealLyricSnippet.textContent = `"${song.lyricSnippet}"`;

  if (won) {
    resultBadge.className = 'px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase bg-green-500 text-black shadow-lg shadow-green-500/30';
    resultBadge.textContent = `CHÍNH XÁC! ĐOÁN TRONG ${duration}s`;
    revealGlow.className = 'absolute -top-20 w-56 h-56 rounded-full bg-green-500/30 blur-3xl pointer-events-none';
  } else {
    resultBadge.className = 'px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase bg-red-500 text-white shadow-lg shadow-red-500/30';
    resultBadge.textContent = `RẤT TIẾC! ĐÂY LÀ BÀI HÁT...`;
    revealGlow.className = 'absolute -top-20 w-56 h-56 rounded-full bg-red-500/30 blur-3xl pointer-events-none';
  }

  if (game.mode === GAME_MODES.GAUNTLET) {
    if (game.currentLevelIndex < 4) {
      nextLevelBtn.textContent = `Màn Tiếp Theo (Màn ${game.currentLevelIndex + 2}/5) ➜`;
    } else {
      nextLevelBtn.textContent = `Xem Tổng Kết 5 Màn 🏆`;
    }
  } else {
    nextLevelBtn.textContent = `Chơi Bài Tiếp Theo ➜`;
  }

  revealModal.classList.remove('hidden');
}

function handleNextLevel() {
  revealModal.classList.add('hidden');

  if (game.mode === GAME_MODES.GAUNTLET) {
    const res = game.nextGauntletLevel();
    if (res.finished) {
      showSummaryModal(res.results);
    } else {
      renderGameStage();
    }
  } else {
    game.startHeardle();
    renderGameStage();
  }
}

function showSummaryModal(results) {
  const wonCount = results.filter(r => r.won).length;
  summaryScoreText.textContent = `Bạn đã chinh phục ${wonCount}/5 màn nhạc Ngọt!`;

  summaryLevelsList.innerHTML = '';
  results.forEach((res, i) => {
    const diff = DIFFICULTY_LEVELS[i];
    const album = ALBUMS[res.song.albumId] || ALBUMS.ngot2016;

    const row = document.createElement('div');
    row.className = 'p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-xs';
    row.innerHTML = `
      <div class="flex items-center space-x-3">
        <span class="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-black" style="background-color: ${diff.color}">
          ${i + 1}
        </span>
        <div>
          <div class="font-bold text-white">${res.song.title}</div>
          <div class="text-[11px] text-slate-400">${album.name}</div>
        </div>
      </div>
      <div class="font-bold font-mono ${res.won ? 'text-green-400' : 'text-red-400'}">
        ${res.won ? `✅ ${res.duration}s` : '❌ Bỏ lỡ'}
      </div>
    `;
    summaryLevelsList.appendChild(row);
  });

  if (wonCount >= 4) triggerConfetti();
  summaryModal.classList.remove('hidden');
}

// ==========================================
// SEARCH & AUTOCOMPLETE
// ==========================================
function handleSearchInput(e) {
  const query = e.target.value.trim();

  if (query.length > 0) {
    clearSearchBtn.classList.remove('hidden');
  } else {
    clearSearchBtn.classList.add('hidden');
  }

  if (query.length < 1) {
    searchResultsList.classList.add('hidden');
    searchResultsList.innerHTML = '';
    return;
  }

  const results = searchSongs(query, SONGS, ALBUMS);

  if (results.length === 0) {
    searchResultsList.innerHTML = `
      <div class="p-4 text-center text-xs text-slate-400">
        Không tìm thấy bài hát nào của Ngọt phù hợp.
      </div>
    `;
    searchResultsList.classList.remove('hidden');
    return;
  }

  searchResultsList.innerHTML = '';
  results.forEach(({ song, album }) => {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'w-full p-3 text-left hover:bg-white/10 flex items-center space-x-3 border-b border-white/5 transition-colors focus:bg-white/10 focus:outline-none';
    item.innerHTML = `
      <div class="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 bg-white/10 border border-white/10">
        <img src="${album.cover}" alt="${album.name}" class="w-full h-full object-cover"/>
      </div>
      <div class="flex-1 min-w-0">
        <div class="font-bold text-sm text-white truncate">${song.title}</div>
        <div class="text-[11px] text-slate-400 truncate">${album.name} (${album.year}) • 👁️ ${song.views || ''}</div>
      </div>
      <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase" style="background-color: ${album.color}25; color: ${album.color}">
        ${song.difficulty}
      </span>
    `;

    item.addEventListener('click', () => {
      selectSong(song);
    });

    searchResultsList.appendChild(item);
  });

  searchResultsList.classList.remove('hidden');
}

function selectSong(song) {
  selectedSongId = song.id;
  songSearchInput.value = song.title;
  searchResultsList.classList.add('hidden');
  guessBtn.disabled = false;
  guessBtn.focus();
}

// ==========================================
// STATS & MODALS
// ==========================================
function updateStatsDisplay() {
  const stats = game.stats;
  statPlayed.textContent = stats.played;
  const rate = stats.played > 0 ? Math.round((stats.won / stats.played) * 100) : 0;
  statWinRate.textContent = `${rate}%`;
  statCurrentStreak.textContent = stats.currentStreak;
  statMaxStreak.textContent = stats.maxStreak;
}

function showToast(msg) {
  toastMessage.textContent = msg;
  toast.classList.remove('opacity-0', 'pointer-events-none');
  setTimeout(() => {
    toast.classList.add('opacity-0', 'pointer-events-none');
  }, 2400);
}

function triggerConfetti() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  }
}

// ==========================================
// EVENT LISTENERS
// ==========================================
function setupEventListeners() {
  // Audio Play
  playBtn.addEventListener('click', toggleAudio);

  // Search
  songSearchInput.addEventListener('input', handleSearchInput);
  clearSearchBtn.addEventListener('click', () => {
    songSearchInput.value = '';
    clearSearchBtn.classList.add('hidden');
    searchResultsList.classList.add('hidden');
    selectedSongId = null;
    guessBtn.disabled = true;
    songSearchInput.focus();
  });

  // Guess & Skip
  guessBtn.addEventListener('click', handleGuess);
  skipBtn.addEventListener('click', handleSkip);

  // Next level / Gauntlet controls
  nextLevelBtn.addEventListener('click', handleNextLevel);
  restartGauntletBtn.addEventListener('click', () => {
    summaryModal.classList.add('hidden');
    game.startGauntlet();
    renderGameStage();
  });

  // Share buttons
  shareResultBtn.addEventListener('click', () => {
    const text = game.generateShareText();
    navigator.clipboard.writeText(text).then(() => {
      showToast('Đã sao chép kết quả Kẹo Con!');
    }).catch(() => {
      showToast('Không thể sao chép kết quả');
    });
  });

  shareSummaryBtn.addEventListener('click', () => {
    const text = game.generateShareText();
    navigator.clipboard.writeText(text).then(() => {
      showToast('Đã sao chép tổng kết 5 màn!');
    });
  });

  // Modes
  const setMode = (mode) => {
    [modeGauntletBtn, mobileGauntletBtn].forEach(b => b.className = 'px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white transition-all');
    [modeHeardleBtn, mobileHeardleBtn].forEach(b => b.className = 'px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white transition-all');
    [modeFreeplayBtn, mobileFreeplayBtn].forEach(b => b.className = 'px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white transition-all');

    if (mode === GAME_MODES.GAUNTLET) {
      [modeGauntletBtn, mobileGauntletBtn].forEach(b => b.className = 'px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-500 text-black shadow-sm');
      game.startGauntlet();
    } else if (mode === GAME_MODES.HEARDLE) {
      [modeHeardleBtn, mobileHeardleBtn].forEach(b => b.className = 'px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-500 text-black shadow-sm');
      game.startHeardle();
    } else {
      [modeFreeplayBtn, mobileFreeplayBtn].forEach(b => b.className = 'px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-500 text-black shadow-sm');
      game.startFreePlay('easy');
    }
    renderGameStage();
  };

  modeGauntletBtn.addEventListener('click', () => setMode(GAME_MODES.GAUNTLET));
  mobileGauntletBtn.addEventListener('click', () => setMode(GAME_MODES.GAUNTLET));
  modeHeardleBtn.addEventListener('click', () => setMode(GAME_MODES.HEARDLE));
  mobileHeardleBtn.addEventListener('click', () => setMode(GAME_MODES.HEARDLE));
  modeFreeplayBtn.addEventListener('click', () => setMode(GAME_MODES.FREEPLAY));
  mobileFreeplayBtn.addEventListener('click', () => setMode(GAME_MODES.FREEPLAY));

  // Difficulty Pills (clickable in Freeplay or Gauntlet)
  diffBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const diffIdx = parseInt(btn.dataset.diff, 10);
      if (game.mode === GAME_MODES.GAUNTLET) {
        game.loadLevelSong(diffIdx);
      } else {
        game.startFreePlay(DIFFICULTY_LEVELS[diffIdx].id);
      }
      renderGameStage();
    });
  });

  // Help Modal
  helpBtn.addEventListener('click', () => helpModal.classList.remove('hidden'));
  closeHelpBtn.addEventListener('click', () => helpModal.classList.add('hidden'));
  confirmHelpBtn.addEventListener('click', () => helpModal.classList.add('hidden'));

  // Stats Modal
  statsBtn.addEventListener('click', () => {
    updateStatsDisplay();
    statsModal.classList.remove('hidden');
  });
  closeStatsBtn.addEventListener('click', () => statsModal.classList.add('hidden'));
  closeStatsConfirmBtn.addEventListener('click', () => statsModal.classList.add('hidden'));

  // Global Keyboard Shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.target === songSearchInput) {
      if (e.key === 'Enter' && selectedSongId) {
        e.preventDefault();
        handleGuess();
      } else if (e.key === 'Escape') {
        searchResultsList.classList.add('hidden');
      }
      return;
    }

    if (e.code === 'Space') {
      e.preventDefault();
      toggleAudio();
    } else if (e.key === 'Escape') {
      helpModal.classList.add('hidden');
      statsModal.classList.add('hidden');
      searchResultsList.classList.add('hidden');
    }
  });

  // Close dropdown on click outside
  document.addEventListener('click', (e) => {
    if (!songSearchInput.contains(e.target) && !searchResultsList.contains(e.target)) {
      searchResultsList.classList.add('hidden');
    }
  });
}

// Start app
init();
