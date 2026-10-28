/**
 * NGỌT DISCOGRAPHY & SONG DATABASE
 * Categorized strictly by YouTube & Streaming View / Listen Counts
 */
export const ALBUMS = {
  ngot2016: {
    id: 'ngot2016',
    name: 'Ngọt.',
    year: 2016,
    cover: 'assets/covers/ngot.svg',
    color: '#22c55e',
    accentClass: 'text-green-400'
  },
  ngPrime2017: {
    id: 'ngPrime2017',
    name: 'Ng`',
    year: 2017,
    cover: 'assets/covers/ng-prime.svg',
    color: '#eab308',
    accentClass: 'text-yellow-400'
  },
  album3_2019: {
    id: 'album3_2019',
    name: '3 (Tuyển Tập Nhạc Ngọt)',
    year: 2019,
    cover: 'assets/covers/album3.svg',
    color: '#f97316',
    accentClass: 'text-orange-400'
  },
  gieo2022: {
    id: 'gieo2022',
    name: 'Gieo',
    year: 2022,
    cover: 'assets/covers/gieo.svg',
    color: '#a855f7',
    accentClass: 'text-purple-400'
  },
  singles: {
    id: 'singles',
    name: 'Singles & EPs',
    year: '2015-2023',
    cover: 'assets/covers/singles.svg',
    color: '#06b6d4',
    accentClass: 'text-cyan-400'
  }
};

export const DIFFICULTY_LEVELS = [
  {
    id: 'easy',
    label: 'Easy',
    subLabel: '> 10M lượt xem',
    viewRange: '10M - 50M+ views',
    color: '#22c55e',
    bgClass: 'bg-green-500/20',
    textClass: 'text-green-400',
    borderClass: 'border-green-500',
    timeLimit: 0.1
  },
  {
    id: 'medium',
    label: 'Medium',
    subLabel: '3M - 10M lượt xem',
    viewRange: '3M - 10M views',
    color: '#eab308',
    bgClass: 'bg-yellow-500/20',
    textClass: 'text-yellow-400',
    borderClass: 'border-yellow-500',
    timeLimit: 0.5
  },
  {
    id: 'hard',
    label: 'Hard',
    subLabel: '1M - 3M lượt xem',
    viewRange: '1M - 3M views',
    color: '#f97316',
    bgClass: 'bg-orange-500/20',
    textClass: 'text-orange-400',
    borderClass: 'border-orange-500',
    timeLimit: 2.0
  },
  {
    id: 'expert',
    label: 'Expert',
    subLabel: '300K - 1M lượt xem',
    viewRange: '300K - 1M views',
    color: '#ef4444',
    bgClass: 'bg-red-500/20',
    textClass: 'text-red-400',
    borderClass: 'border-red-500',
    timeLimit: 8.0
  },
  {
    id: 'impossible',
    label: 'Impossible',
    subLabel: '< 300K lượt xem',
    viewRange: '< 300K views',
    color: '#a855f7',
    bgClass: 'bg-purple-500/20',
    textClass: 'text-purple-400',
    borderClass: 'border-purple-500',
    timeLimit: 15.0
  }
];

export const SNIPPET_DURATIONS = [0.1, 0.5, 2.0, 8.0, 15.0];

export const SONGS = [
  // --- EASY (Mega Hits: > 10M - 50M+ Views) ---
  {
    id: 'em-dao-nay',
    title: 'Em Dạo Này',
    albumId: 'ngot2016',
    difficulty: 'easy',
    views: '48.2M',
    lyricSnippet: 'Em dạo này có còn xem phim một mình? Em dạo này có đồ ăn và shopping?...',
    audioFile: 'assets/audio/em-dao-nay.mp3',
    synthHook: {
      tempo: 116,
      melody: [
        { note: 'E4', dur: 0.25 }, { note: 'G#4', dur: 0.25 }, { note: 'B4', dur: 0.5 },
        { note: 'A4', dur: 0.5 }, { note: 'G#4', dur: 0.5 }, { note: 'F#4', dur: 0.5 },
        { note: 'E4', dur: 1.0 }, { note: 'B3', dur: 0.5 }, { note: 'E4', dur: 1.0 }
      ],
      instrument: 'guitar'
    }
  },
  {
    id: 'lan-cuoi',
    title: 'Lần Cuối',
    albumId: 'ngPrime2017',
    difficulty: 'easy',
    views: '34.5M',
    lyricSnippet: 'Lần cuối, đi bên nhau cay đắng nhưng không đau. Bước hụt một bước ngã vào vực sâu...',
    audioFile: 'assets/audio/lan-cuoi.mp3',
    synthHook: {
      tempo: 84,
      melody: [
        { note: 'C4', dur: 0.5 }, { note: 'E4', dur: 0.5 }, { note: 'G4', dur: 0.5 },
        { note: 'A4', dur: 0.75 }, { note: 'G4', dur: 0.25 }, { note: 'E4', dur: 0.5 },
        { note: 'D4', dur: 1.0 }, { note: 'C4', dur: 1.5 }
      ],
      instrument: 'piano'
    }
  },
  {
    id: 'cho-toi-di-theo',
    title: 'Cho Tôi Đi Theo',
    albumId: 'ngot2016',
    difficulty: 'easy',
    views: '29.1M',
    lyricSnippet: 'Cho tôi đi theo với, nơi anh đi về. Về nơi đẹp trời hơn, tràn đầy ước mơ...',
    audioFile: 'assets/audio/cho-toi-di-theo.mp3',
    synthHook: {
      tempo: 128,
      melody: [
        { note: 'D4', dur: 0.25 }, { note: 'F#4', dur: 0.25 }, { note: 'A4', dur: 0.5 },
        { note: 'B4', dur: 0.5 }, { note: 'A4', dur: 0.5 }, { note: 'F#4', dur: 0.5 },
        { note: 'E4', dur: 0.5 }, { note: 'D4', dur: 1.0 }
      ],
      instrument: 'rockGuitar'
    }
  },
  {
    id: 'de-quen',
    title: 'Để Quên',
    albumId: 'album3_2019',
    difficulty: 'easy',
    views: '16.8M',
    lyricSnippet: 'Nắng qua hiên nhà, để quên ngày dài. Em nằm đây và tôi nằm đấy...',
    audioFile: 'assets/audio/de-quen.mp3',
    synthHook: {
      tempo: 104,
      melody: [
        { note: 'F4', dur: 0.25 }, { note: 'A4', dur: 0.25 }, { note: 'C5', dur: 0.5 },
        { note: 'Bb4', dur: 0.5 }, { note: 'A4', dur: 0.25 }, { note: 'G4', dur: 0.5 },
        { note: 'F4', dur: 1.0 }
      ],
      instrument: 'funkyKeys'
    }
  },
  {
    id: 'may-khi',
    title: 'Mấy Khi',
    albumId: 'album3_2019',
    difficulty: 'easy',
    views: '11.4M',
    lyricSnippet: 'Mấy khi ta lại được ngồi đây, hát cho nhau nghe những câu chuyện đời...',
    audioFile: 'assets/audio/may-khi.mp3',
    synthHook: {
      tempo: 96,
      melody: [
        { note: 'G4', dur: 0.5 }, { note: 'B4', dur: 0.5 }, { note: 'D5', dur: 0.5 },
        { note: 'C5', dur: 0.5 }, { note: 'B4', dur: 0.5 }, { note: 'A4', dur: 0.5 },
        { note: 'G4', dur: 1.0 }
      ],
      instrument: 'guitar'
    }
  },

  // --- MEDIUM (Popular Hits: 3M - 10M Views) ---
  {
    id: 'ca-hoi',
    title: 'Cá Hồi',
    albumId: 'ngot2016',
    difficulty: 'medium',
    views: '8.7M',
    lyricSnippet: 'Bơi ngược dòng sông lên thượng nguồn, đi tìm nguồn gốc...',
    audioFile: 'assets/audio/ca-hoi.mp3',
    synthHook: {
      tempo: 120,
      melody: [
        { note: 'E3', dur: 0.25 }, { note: 'E3', dur: 0.25 }, { note: 'G3', dur: 0.25 },
        { note: 'A3', dur: 0.5 }, { note: 'B3', dur: 0.25 }, { note: 'D4', dur: 0.5 }
      ],
      instrument: 'bass'
    }
  },
  {
    id: 'kho-bau',
    title: 'Kho Báu',
    albumId: 'ngPrime2017',
    difficulty: 'medium',
    views: '7.2M',
    lyricSnippet: 'Kho báu chôn sâu dưới lòng đất đá, người đời tranh nhau xới tìm...',
    audioFile: 'assets/audio/kho-bau.mp3',
    synthHook: {
      tempo: 108,
      melody: [
        { note: 'A3', dur: 0.5 }, { note: 'C4', dur: 0.5 }, { note: 'E4', dur: 0.5 },
        { note: 'D4', dur: 0.5 }, { note: 'C4', dur: 0.5 }, { note: 'A3', dur: 1.0 }
      ],
      instrument: 'rockGuitar'
    }
  },
  {
    id: 'ke-thu',
    title: 'Kẻ Thù',
    albumId: 'ngPrime2017',
    difficulty: 'medium',
    views: '6.5M',
    lyricSnippet: 'Kẻ thù của tôi, hãy ngồi xuống đây cạn một ly này...',
    audioFile: 'assets/audio/ke-thu.mp3',
    synthHook: {
      tempo: 130,
      melody: [
        { note: 'F#4', dur: 0.25 }, { note: 'A4', dur: 0.25 }, { note: 'F#4', dur: 0.25 },
        { note: 'E4', dur: 0.5 }, { note: 'D4', dur: 0.5 }, { note: 'F#4', dur: 1.0 }
      ],
      instrument: 'rockGuitar'
    }
  },
  {
    id: 'em-co-chac-khong',
    title: 'Em Có Chắc Không?',
    albumId: 'album3_2019',
    difficulty: 'medium',
    views: '5.8M',
    lyricSnippet: 'Em có chắc không khi nói yêu tôi? Trái tim bơ vơ lạc loài giữa biển khơi...',
    audioFile: 'assets/audio/em-co-chac-khong.mp3',
    synthHook: {
      tempo: 112,
      melody: [
        { note: 'Bb4', dur: 0.25 }, { note: 'D5', dur: 0.25 }, { note: 'F5', dur: 0.5 },
        { note: 'Eb5', dur: 0.5 }, { note: 'D5', dur: 0.5 }, { note: 'C5', dur: 1.0 }
      ],
      instrument: 'funkyKeys'
    }
  },
  {
    id: 'thay-chua',
    title: 'Thấy Chưa',
    albumId: 'gieo2022',
    difficulty: 'medium',
    views: '5.1M',
    lyricSnippet: 'Thấy chưa, tôi đã bảo rồi mà. Cuộc đời này như một chuyến đi xa...',
    audioFile: 'assets/audio/thay-chua.mp3',
    synthHook: {
      tempo: 90,
      melody: [
        { note: 'D4', dur: 0.5 }, { note: 'G4', dur: 0.5 }, { note: 'F#4', dur: 0.5 },
        { note: 'E4', dur: 0.5 }, { note: 'D4', dur: 1.0 }
      ],
      instrument: 'piano'
    }
  },
  {
    id: 'em-trang-tri',
    title: 'Em Trang Trí',
    albumId: 'gieo2022',
    difficulty: 'medium',
    views: '4.3M',
    lyricSnippet: 'Em trang trí căn phòng của em bằng những bông hoa nhỏ...',
    audioFile: 'assets/audio/em-trang-tri.mp3',
    synthHook: {
      tempo: 100,
      melody: [
        { note: 'C4', dur: 0.25 }, { note: 'E4', dur: 0.25 }, { note: 'G4', dur: 0.5 },
        { note: 'B4', dur: 0.5 }, { note: 'C5', dur: 1.0 }
      ],
      instrument: 'funkyKeys'
    }
  },
  {
    id: 'khap-xung-quanh',
    title: 'Khắp Xung Quanh',
    albumId: 'ngot2016',
    difficulty: 'medium',
    views: '3.9M',
    lyricSnippet: 'Khắp xung quanh ta xe cộ ngược xuôi, người người hối hả...',
    audioFile: 'assets/audio/khap-xung-quanh.mp3',
    synthHook: {
      tempo: 124,
      melody: [
        { note: 'A3', dur: 0.25 }, { note: 'C4', dur: 0.25 }, { note: 'E4', dur: 0.5 },
        { note: 'G4', dur: 0.5 }, { note: 'A4', dur: 1.0 }
      ],
      instrument: 'rockGuitar'
    }
  },
  {
    id: 'be-cool',
    title: 'Be Cool',
    albumId: 'ngot2016',
    difficulty: 'medium',
    views: '3.2M',
    lyricSnippet: 'Just be cool, baby be cool. Cuộc sống xô bồ xin đừng cáu gắt...',
    audioFile: 'assets/audio/be-cool.mp3',
    synthHook: {
      tempo: 110,
      melody: [
        { note: 'G4', dur: 0.25 }, { note: 'A#4', dur: 0.25 }, { note: 'C5', dur: 0.5 },
        { note: 'D5', dur: 0.5 }, { note: 'C5', dur: 0.5 }
      ],
      instrument: 'funkyKeys'
    }
  },

  // --- HARD (Fan Favorites: 1M - 3M Views) ---
  {
    id: 'mau-doi-thoai-ngan',
    title: 'Mẩu Đối Thoại Ngắn',
    albumId: 'ngPrime2017',
    difficulty: 'hard',
    views: '2.6M',
    lyricSnippet: 'Ta chào nhau chưa? Ừ thì ta chào nhau rồi...',
    audioFile: 'assets/audio/mau-doi-thoai-ngan.mp3',
    synthHook: {
      tempo: 98,
      melody: [
        { note: 'C4', dur: 0.5 }, { note: 'F4', dur: 0.5 }, { note: 'E4', dur: 0.5 },
        { note: 'D4', dur: 0.5 }, { note: 'C4', dur: 1.0 }
      ],
      instrument: 'piano'
    }
  },
  {
    id: 'chuyen-kenh',
    title: 'Chuyển Kênh',
    albumId: 'album3_2019',
    difficulty: 'hard',
    views: '2.2M',
    lyricSnippet: 'Chuyển kênh khác xem có gì vui, tivi đang chiếu phim hài...',
    audioFile: 'assets/audio/chuyen-kenh.mp3',
    synthHook: {
      tempo: 132,
      melody: [
        { note: 'B3', dur: 0.25 }, { note: 'D4', dur: 0.25 }, { note: 'F#4', dur: 0.5 },
        { note: 'A4', dur: 0.5 }, { note: 'G4', dur: 0.5 }
      ],
      instrument: 'rockGuitar'
    }
  },
  {
    id: 'het-thoi',
    title: 'Hết Thời',
    albumId: 'album3_2019',
    difficulty: 'hard',
    views: '1.9M',
    lyricSnippet: 'Tôi hết thời rồi các bạn ơi, hào quang xưa nay chỉ còn dĩ vãng...',
    audioFile: 'assets/audio/het-thoi.mp3',
    synthHook: {
      tempo: 105,
      melody: [
        { note: 'A3', dur: 0.5 }, { note: 'D4', dur: 0.5 }, { note: 'C#4', dur: 0.5 },
        { note: 'B3', dur: 0.5 }, { note: 'A3', dur: 1.0 }
      ],
      instrument: 'piano'
    }
  },
  {
    id: 'ru-con-bang-ngua-go',
    title: 'Ru Con Bằng Ngựa Gỗ',
    albumId: 'album3_2019',
    difficulty: 'hard',
    views: '1.6M',
    lyricSnippet: 'Ngựa gỗ ru con ngủ say, ngày mai con lớn con bay khắp trời...',
    audioFile: 'assets/audio/ru-con-bang-ngua-go.mp3',
    synthHook: {
      tempo: 80,
      melody: [
        { note: 'E4', dur: 0.5 }, { note: 'G4', dur: 0.5 }, { note: 'A4', dur: 0.5 },
        { note: 'B4', dur: 1.0 }, { note: 'A4', dur: 0.5 }, { note: 'G4', dur: 1.0 }
      ],
      instrument: 'guitar'
    }
  },
  {
    id: 'quan-diem',
    title: 'Quan Điểm',
    albumId: 'ngot2016',
    difficulty: 'hard',
    views: '1.7M',
    lyricSnippet: 'Mỗi người một quan điểm, ai đúng ai sai đâu cần chứng minh...',
    audioFile: 'assets/audio/quan-diem.mp3',
    synthHook: {
      tempo: 118,
      melody: [
        { note: 'D4', dur: 0.25 }, { note: 'F4', dur: 0.25 }, { note: 'G4', dur: 0.5 },
        { note: 'A4', dur: 0.5 }, { note: 'D5', dur: 0.5 }
      ],
      instrument: 'rockGuitar'
    }
  },
  {
    id: 'cho-em-di-lam',
    title: 'Cho Em Đi Làm',
    albumId: 'singles',
    difficulty: 'hard',
    views: '1.4M',
    lyricSnippet: 'Cho em đi làm kiếm tiền mua sữa, cho em đi làm nuôi sống ước mơ...',
    audioFile: 'assets/audio/cho-em-di-lam.mp3',
    synthHook: {
      tempo: 115,
      melody: [
        { note: 'F4', dur: 0.25 }, { note: 'G4', dur: 0.25 }, { note: 'A4', dur: 0.5 },
        { note: 'C5', dur: 0.5 }, { note: 'D5', dur: 1.0 }
      ],
      instrument: 'funkyKeys'
    }
  },

  // --- EXPERT (Deep Cuts: 300K - 1M Views) ---
  {
    id: 'nut',
    title: 'Nứt',
    albumId: 'album3_2019',
    difficulty: 'expert',
    views: '840K',
    lyricSnippet: 'Vết nứt trên tường, vết nứt trong tâm trí người nghệ sĩ...',
    audioFile: 'assets/audio/nut.mp3',
    synthHook: {
      tempo: 140,
      melody: [
        { note: 'E3', dur: 0.25 }, { note: 'B3', dur: 0.25 }, { note: 'E4', dur: 0.25 },
        { note: 'G4', dur: 0.5 }, { note: 'F#4', dur: 0.5 }, { note: 'E4', dur: 0.5 }
      ],
      instrument: 'rockGuitar'
    }
  },
  {
    id: 'su-dau-hang',
    title: 'Sự Đầu Hàng',
    albumId: 'album3_2019',
    difficulty: 'expert',
    views: '710K',
    lyricSnippet: 'Tôi xin đầu hàng trước vẻ đẹp của tự nhiên, trước sự đổi thay của thời gian...',
    audioFile: 'assets/audio/su-dau-hang.mp3',
    synthHook: {
      tempo: 82,
      melody: [
        { note: 'Ab3', dur: 0.5 }, { note: 'C4', dur: 0.5 }, { note: 'Eb4', dur: 0.5 },
        { note: 'F4', dur: 0.75 }, { note: 'Eb4', dur: 0.25 }, { note: 'C4', dur: 1.0 }
      ],
      instrument: 'piano'
    }
  },
  {
    id: 'do-ky',
    title: 'Đố Kỵ',
    albumId: 'ngPrime2017',
    difficulty: 'expert',
    views: '620K',
    lyricSnippet: 'Lòng đố kỵ gặm nhấm tâm can người ta từng ngày...',
    audioFile: 'assets/audio/do-ky.mp3',
    synthHook: {
      tempo: 135,
      melody: [
        { note: 'B3', dur: 0.25 }, { note: 'D4', dur: 0.25 }, { note: 'F#4', dur: 0.25 },
        { note: 'A4', dur: 0.25 }, { note: 'C5', dur: 0.5 }, { note: 'B4', dur: 0.5 }
      ],
      instrument: 'rockGuitar'
    }
  },
  {
    id: 'gieo',
    title: 'Gieo',
    albumId: 'gieo2022',
    difficulty: 'expert',
    views: '580K',
    lyricSnippet: 'Gieo một hạt mầm xuống mảnh đất khô cằn, đợi ngày đơm hoa kết trái...',
    audioFile: 'assets/audio/gieo.mp3',
    synthHook: {
      tempo: 102,
      melody: [
        { note: 'A3', dur: 0.5 }, { note: 'E4', dur: 0.5 }, { note: 'G4', dur: 0.5 },
        { note: 'F#4', dur: 0.5 }, { note: 'E4', dur: 1.0 }
      ],
      instrument: 'psychedelicSynth'
    }
  },
  {
    id: 'chao-he',
    title: 'Chào Hè',
    albumId: 'gieo2022',
    difficulty: 'expert',
    views: '460K',
    lyricSnippet: 'Chào mùa hè rực rỡ, tiếng ve kêu râm ran trên cành phượng vĩ...',
    audioFile: 'assets/audio/chao-he.mp3',
    synthHook: {
      tempo: 114,
      melody: [
        { note: 'C4', dur: 0.25 }, { note: 'F4', dur: 0.25 }, { note: 'A4', dur: 0.5 },
        { note: 'Bb4', dur: 0.5 }, { note: 'C5', dur: 0.5 }
      ],
      instrument: 'funkyKeys'
    }
  },

  // --- IMPOSSIBLE (Avant-garde / Outros: < 300K Views) ---
  {
    id: 'mau-do-khong-bao-gio',
    title: 'Màu Đỏ (Không Bao Giờ)',
    albumId: 'album3_2019',
    difficulty: 'impossible',
    views: '240K',
    lyricSnippet: 'Màu đỏ của máu, màu đỏ của hoàng hôn không bao giờ tàn phai...',
    audioFile: 'assets/audio/mau-do-khong-bao-gio.mp3',
    synthHook: {
      tempo: 76,
      melody: [
        { note: 'C#3', dur: 0.75 }, { note: 'G#3', dur: 0.5 }, { note: 'C#4', dur: 0.75 },
        { note: 'F4', dur: 1.0 }, { note: 'E4', dur: 0.5 }
      ],
      instrument: 'psychedelicSynth'
    }
  },
  {
    id: 'chuong-bao-dong-2',
    title: 'Chuông Báo Động (Phần 2)',
    albumId: 'album3_2019',
    difficulty: 'impossible',
    views: '190K',
    lyricSnippet: 'Ting ting chuông reo giật mình tỉnh giấc...',
    audioFile: 'assets/audio/chuong-bao-dong-2.mp3',
    synthHook: {
      tempo: 160,
      melody: [
        { note: 'F#4', dur: 0.1 }, { note: 'F#4', dur: 0.1 }, { note: 'F#4', dur: 0.1 },
        { note: 'A4', dur: 0.2 }, { note: 'C5', dur: 0.2 }, { note: 'F#4', dur: 0.2 }
      ],
      instrument: 'psychedelicSynth'
    }
  },
  {
    id: 'ban-giao-huong-so-5',
    title: 'Bản Giao Hưởng Số 5',
    albumId: 'gieo2022',
    difficulty: 'impossible',
    views: '165K',
    lyricSnippet: 'Từng nốt nhạc giao hưởng hòa quyện trong không gian tĩnh mịch...',
    audioFile: 'assets/audio/ban-giao-huong-so-5.mp3',
    synthHook: {
      tempo: 120,
      melody: [
        { note: 'G4', dur: 0.15 }, { note: 'G4', dur: 0.15 }, { note: 'G4', dur: 0.15 },
        { note: 'Eb4', dur: 0.8 }, { note: 'F4', dur: 0.15 }, { note: 'F4', dur: 0.15 },
        { note: 'F4', dur: 0.15 }, { note: 'D4', dur: 0.8 }
      ],
      instrument: 'rockGuitar'
    }
  },
  {
    id: 'mat-tich',
    title: 'Mất Tích',
    albumId: 'gieo2022',
    difficulty: 'impossible',
    views: '140K',
    lyricSnippet: 'Một người vừa mất tích không để lại dấu vết...',
    audioFile: 'assets/audio/mat-tich.mp3',
    synthHook: {
      tempo: 110,
      melody: [
        { note: 'D3', dur: 0.25 }, { note: 'F3', dur: 0.25 }, { note: 'Ab3', dur: 0.5 },
        { note: 'B3', dur: 0.5 }, { note: 'D4', dur: 0.5 }
      ],
      instrument: 'bass'
    }
  },
  {
    id: 'keo',
    title: 'Kẹo',
    albumId: 'singles',
    difficulty: 'impossible',
    views: '115K',
    lyricSnippet: 'Ngọt như kẹo bông, tuổi thơ êm đềm trôi theo dòng sông...',
    audioFile: 'assets/audio/keo.mp3',
    synthHook: {
      tempo: 100,
      melody: [
        { note: 'C5', dur: 0.25 }, { note: 'A4', dur: 0.25 }, { note: 'F4', dur: 0.25 },
        { note: 'D4', dur: 0.5 }, { note: 'C4', dur: 1.0 }
      ],
      instrument: 'funkyKeys'
    }
  }
];

export function getSongsByDifficulty(diff) {
  return SONGS.filter(s => s.difficulty === diff);
}

export function getRandomSong(diff = null) {
  const pool = diff ? getSongsByDifficulty(diff) : SONGS;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function getSongById(id) {
  return SONGS.find(s => s.id === id);
}
