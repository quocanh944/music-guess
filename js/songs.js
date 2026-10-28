/**
 * NGỌT DISCOGRAPHY & SONG DATABASE
 * Sourced directly from Official YouTube Channel @Ngọt-o9k
 * Ranked by Official YouTube View Counts
 */
export const ALBUMS = {
  ngot2016: {
    id: 'ngot2016',
    name: 'Ngọt.',
    year: 2016,
    cover: 'assets/covers/ngot.jpg',
    color: '#22c55e',
    accentClass: 'text-green-400'
  },
  ngPrime2017: {
    id: 'ngPrime2017',
    name: 'Ng`',
    year: 2017,
    cover: 'assets/covers/ng-prime.jpg',
    color: '#eab308',
    accentClass: 'text-yellow-400'
  },
  album3_2019: {
    id: 'album3_2019',
    name: '3 (Tuyển Tập Nhạc Ngọt)',
    year: 2019,
    cover: 'assets/covers/album3.jpg',
    color: '#f97316',
    accentClass: 'text-orange-400'
  },
  gieo2022: {
    id: 'gieo2022',
    name: 'Gieo',
    year: 2022,
    cover: 'assets/covers/gieo.jpg',
    color: '#a855f7',
    accentClass: 'text-purple-400'
  },
  singles: {
    id: 'singles',
    name: 'Singles & EPs',
    year: '2015-2023',
    cover: 'assets/covers/singles.jpg',
    color: '#06b6d4',
    accentClass: 'text-cyan-400'
  }
};

export const DIFFICULTY_LEVELS = [
  {
    id: 'easy',
    label: 'Easy',
    subLabel: '>= 10M views',
    viewRange: '>= 10M views (Quốc dân)',
    color: '#22c55e',
    bgClass: 'bg-green-500/20',
    textClass: 'text-green-400',
    borderClass: 'border-green-500',
    timeLimit: 0.1
  },
  {
    id: 'medium',
    label: 'Medium',
    subLabel: '3M - 10M views',
    viewRange: '3M - 10M views (Hit lớn)',
    color: '#eab308',
    bgClass: 'bg-yellow-500/20',
    textClass: 'text-yellow-400',
    borderClass: 'border-yellow-500',
    timeLimit: 0.5
  },
  {
    id: 'hard',
    label: 'Hard',
    subLabel: '1M - 3M views',
    viewRange: '1M - 3M views (Kẹo Con)',
    color: '#f97316',
    bgClass: 'bg-orange-500/20',
    textClass: 'text-orange-400',
    borderClass: 'border-orange-500',
    timeLimit: 2.0
  },
  {
    id: 'expert',
    label: 'Expert',
    subLabel: '400K - 1M views',
    viewRange: '400K - 1M views (Fan cứng)',
    color: '#ef4444',
    bgClass: 'bg-red-500/20',
    textClass: 'text-red-400',
    borderClass: 'border-red-500',
    timeLimit: 8.0
  },
  {
    id: 'impossible',
    label: 'Impossible',
    subLabel: '< 400K views',
    viewRange: '< 400K views (Độc bản)',
    color: '#a855f7',
    bgClass: 'bg-purple-500/20',
    textClass: 'text-purple-400',
    borderClass: 'border-purple-500',
    timeLimit: 15.0
  }
];

export const SNIPPET_DURATIONS = [0.1, 0.5, 2.0, 8.0, 15.0];

export const SONGS = [
  // --- EASY (>= 10M Views) ---
  {
    id: 'cho-toi-lang-thang',
    ytId: 'gUr4qp6YGLs',
    title: 'Cho Tôi Lang Thang (ft. Đen)',
    albumId: 'singles',
    difficulty: 'easy',
    views: '36.0M',
    lyricSnippet: 'Cho tôi lang thang quên ngày tháng, cho tôi quên đi bao lo toan muộn phiền...',
    audioFile: 'assets/audio/cho-toi-lang-thang.mp3'
  },
  {
    id: 'lan-cuoi',
    ytId: 'kSjj0LlsqnI',
    title: 'Lần Cuối',
    albumId: 'ngPrime2017',
    difficulty: 'easy',
    views: '35.0M',
    lyricSnippet: 'Lần cuối, đi bên nhau cay đắng nhưng không đau...',
    audioFile: 'assets/audio/lan-cuoi.mp3'
  },
  {
    id: 'em-dao-nay',
    ytId: '-6s_eRHYqVM',
    title: 'Em Dạo Này',
    albumId: 'ngot2016',
    difficulty: 'easy',
    views: '23.0M',
    lyricSnippet: 'Em dạo này có còn xem phim một mình? Em dạo này có đồ ăn và shopping?...',
    audioFile: 'assets/audio/em-dao-nay.mp3'
  },
  {
    id: 'chuyen-kenh',
    ytId: 'ECZVU4x6Xq0',
    title: 'Chuyển Kênh',
    albumId: 'album3_2019',
    difficulty: 'easy',
    views: '15.0M',
    lyricSnippet: 'Chuyển kênh khác xem có gì vui, tivi đang chiếu phim hài...',
    audioFile: 'assets/audio/chuyen-kenh.mp3'
  },
  {
    id: 'thay-chua',
    ytId: '9mA7h1jfxc8',
    title: 'Thấy Chưa',
    albumId: 'gieo2022',
    difficulty: 'easy',
    views: '14.0M',
    lyricSnippet: 'Thấy chưa, tôi đã bảo rồi mà. Cuộc đời này như một chuyến đi xa...',
    audioFile: 'assets/audio/thay-chua.mp3'
  },
  {
    id: 'de-quen',
    ytId: 'W08NL1mchhs',
    title: 'Để Quên',
    albumId: 'album3_2019',
    difficulty: 'easy',
    views: '11.0M',
    lyricSnippet: 'Nắng qua hiên nhà, để quên ngày dài. Em nằm đây và tôi nằm đấy...',
    audioFile: 'assets/audio/de-quen.mp3'
  },

  // --- MEDIUM (3M - 10M Views) ---
  {
    id: 'het-thoi',
    ytId: 'yJbGCwT7Kms',
    title: 'Hết Thời',
    albumId: 'album3_2019',
    difficulty: 'medium',
    views: '8.8M',
    lyricSnippet: 'Tôi hết thời rồi các bạn ơi, hào quang xưa nay chỉ còn dĩ vãng...',
    audioFile: 'assets/audio/het-thoi.mp3'
  },
  {
    id: 'cho-toi-di-theo',
    ytId: 'U07kJZp5b1o',
    title: 'Cho Tôi Đi Theo',
    albumId: 'ngot2016',
    difficulty: 'medium',
    views: '7.7M',
    lyricSnippet: 'Cho tôi đi theo với, nơi anh đi về. Về nơi đẹp trời hơn, tràn đầy ước mơ...',
    audioFile: 'assets/audio/cho-toi-di-theo.mp3'
  },
  {
    id: 'cho',
    ytId: 'RkXStDkolwE',
    title: 'Cho',
    albumId: 'singles',
    difficulty: 'medium',
    views: '7.7M',
    lyricSnippet: 'Cho tôi một ly nước ấm, cho tôi một ngày bình yên...',
    audioFile: 'assets/audio/cho.mp3'
  },
  {
    id: 'dot',
    ytId: 'xvpverLphlo',
    title: 'Đốt',
    albumId: 'singles',
    difficulty: 'medium',
    views: '6.6M',
    lyricSnippet: 'Đốt hết những kỷ niệm cũ, đốt hết những bức thư tình...',
    audioFile: 'assets/audio/dot.mp3'
  },
  {
    id: 'xanh',
    ytId: '0YdgmKjUG-o',
    title: 'Xanh',
    albumId: 'ngot2016',
    difficulty: 'medium',
    views: '6.5M',
    lyricSnippet: 'Bầu trời hôm nay thật xanh, cây lá ngoài vườn thật xanh...',
    audioFile: 'assets/audio/xanh.mp3'
  },
  {
    id: 'ke-thu',
    ytId: '-b4qvyf_vNU',
    title: 'Kẻ Thù',
    albumId: 'ngPrime2017',
    difficulty: 'medium',
    views: '6.0M',
    lyricSnippet: 'Kẻ thù của tôi, hãy ngồi xuống đây cạn một ly này...',
    audioFile: 'assets/audio/ke-thu.mp3'
  },
  {
    id: 'em-trang-tri',
    ytId: 'KypuJGsZ8pQ',
    title: 'Em Trang Trí',
    albumId: 'gieo2022',
    difficulty: 'medium',
    views: '5.9M',
    lyricSnippet: 'Em trang trí căn phòng của em bằng những bông hoa nhỏ...',
    audioFile: 'assets/audio/em-trang-tri.mp3'
  },
  {
    id: 'may-khi',
    ytId: 'LvNEPB5x7T8',
    title: 'Mấy Khi',
    albumId: 'album3_2019',
    difficulty: 'medium',
    views: '5.8M',
    lyricSnippet: 'Mấy khi ta lại được ngồi đây, hát cho nhau nghe những câu chuyện đời...',
    audioFile: 'assets/audio/may-khi.mp3'
  },
  {
    id: 'nut',
    ytId: 'xG94wlZai1I',
    title: 'Nứt',
    albumId: 'album3_2019',
    difficulty: 'medium',
    views: '5.7M',
    lyricSnippet: 'Đôi chân đôi tay đôi mắt trái tim...',
    audioFile: 'assets/audio/nut.mp3'
  },
  {
    id: 'em-co-chac-khong',
    ytId: 'p8VDTNYyKbo',
    title: 'Em Có Chắc Không?',
    albumId: 'album3_2019',
    difficulty: 'medium',
    views: '4.7M',
    lyricSnippet: 'Em có chắc không khi nói yêu tôi? Trái tim bơ vơ lạc loài giữa biển khơi...',
    audioFile: 'assets/audio/em-co-chac-khong.mp3'
  },
  {
    id: 'chuyen-do-dang',
    ytId: 'o1RG7x4-WXM',
    title: 'Chuyện Dở Dang',
    albumId: 'singles',
    difficulty: 'medium',
    views: '4.1M',
    lyricSnippet: 'Những chuyện dở dang của tuổi trẻ, những ước mơ chưa thành...',
    audioFile: 'assets/audio/chuyen-do-dang.mp3'
  },
  {
    id: 'bartender',
    ytId: '1u0ygl9vJHI',
    title: 'Bartender',
    albumId: 'singles',
    difficulty: 'medium',
    views: '4.0M',
    lyricSnippet: 'Này chàng pha chế, cho tôi một ly rượu mạnh...',
    audioFile: 'assets/audio/bartender.mp3'
  },
  {
    id: 'hay-la',
    ytId: 'LecuZccoWBs',
    title: 'Hay Là',
    albumId: 'singles',
    difficulty: 'medium',
    views: '3.0M',
    lyricSnippet: 'Hay là ta cùng nhau đi đến một nơi thật xa...',
    audioFile: 'assets/audio/hay-la.mp3'
  },

  // --- HARD (1M - 3M Views) ---
  {
    id: 'mo-lam-ma',
    ytId: 'FBM70NaZuVI',
    title: 'Mơ Làm Ma (ft. Thỏ Trauma)',
    albumId: 'singles',
    difficulty: 'hard',
    views: '2.8M',
    lyricSnippet: 'Đêm nằm mơ thấy mình làm ma, bay lượn trên những mái nhà...',
    audioFile: 'assets/audio/mo-lam-ma.mp3'
  },
  {
    id: 'khong-lam-gi',
    ytId: 'mjpUWO5MuPg',
    title: 'Không Làm Gì',
    albumId: 'singles',
    difficulty: 'hard',
    views: '2.5M',
    lyricSnippet: 'Hôm nay tôi không làm gì cả, chỉ ngồi ngắm mây trôi...',
    audioFile: 'assets/audio/khong-lam-gi.mp3'
  },
  {
    id: 'mot-ngay-khong-mua',
    ytId: 'gQOFI4ATIOY',
    title: 'Một Ngày Không Mưa',
    albumId: 'ngPrime2017',
    difficulty: 'hard',
    views: '2.4M',
    lyricSnippet: 'Một ngày không mưa bầu trời trong xanh, ta dắt tay nhau qua từng con phố...',
    audioFile: 'assets/audio/mot-ngay-khong-mua.mp3'
  },
  {
    id: 'gia-vo',
    ytId: 'njv-aZKJnn8',
    title: 'Giả Vờ',
    albumId: 'album3_2019',
    difficulty: 'hard',
    views: '2.0M',
    lyricSnippet: 'Giả vờ như ta chưa từng quen, giả vờ như chưa từng yêu...',
    audioFile: 'assets/audio/gia-vo.mp3'
  },
  {
    id: 'tim-nguoi-nha',
    ytId: 'j-oB7Bbv4ig',
    title: 'Tìm Người Nhà',
    albumId: 'album3_2019',
    difficulty: 'hard',
    views: '2.0M',
    lyricSnippet: 'Tìm người nhà đi lạc giữa thành phố đông đúc...',
    audioFile: 'assets/audio/tim-nguoi-nha.mp3'
  },
  {
    id: 'meu-mao',
    ytId: 'KOBT2yACJvA',
    title: 'Mếu Máo (T.T)',
    albumId: 'album3_2019',
    difficulty: 'hard',
    views: '1.9M',
    lyricSnippet: 'Khuôn mặt mếu máo như đứa trẻ con...',
    audioFile: 'assets/audio/meu-mao.mp3'
  },
  {
    id: 'di-tru-dong',
    ytId: 'ZWY5WXssw_w',
    title: 'Đi Trú Đông',
    albumId: 'album3_2019',
    difficulty: 'hard',
    views: '1.6M',
    lyricSnippet: 'Mùa đông lạnh giá ta đi tìm hơi ấm...',
    audioFile: 'assets/audio/di-tru-dong.mp3'
  },
  {
    id: 'drama-queen',
    ytId: 'Vq2ShP3qC2M',
    title: 'Drama Queen',
    albumId: 'singles',
    difficulty: 'hard',
    views: '1.5M',
    lyricSnippet: 'Nữ hoàng của những vở kịch cuộc đời...',
    audioFile: 'assets/audio/drama-queen.mp3'
  },
  {
    id: 'thap-huong-hoa-vang',
    ytId: 'TjmZD0V8m0U',
    title: 'Thắp Hương Hoá Vàng',
    albumId: 'singles',
    difficulty: 'hard',
    views: '1.5M',
    lyricSnippet: 'Khói hương nghi ngút những ngày cuối năm...',
    audioFile: 'assets/audio/thap-huong-hoa-vang.mp3'
  },
  {
    id: 'vi-ai',
    ytId: 'GqIaese5_Ac',
    title: 'Vì Ai',
    albumId: 'singles',
    difficulty: 'hard',
    views: '1.4M',
    lyricSnippet: 'Vì ai ta thức trắng bao đêm, vì ai lệ rơi hoen bờ mi...',
    audioFile: 'assets/audio/vi-ai.mp3'
  },
  {
    id: 'chuong-bao-thuc',
    ytId: 'bWO-YOfQ2xs',
    title: 'Chuông Báo Thức',
    albumId: 'album3_2019',
    difficulty: 'hard',
    views: '1.3M',
    lyricSnippet: 'Sáng rồi chuông reo giục ta thức dậy...',
    audioFile: 'assets/audio/chuong-bao-thuc.mp3'
  },
  {
    id: 'mau-den-trang',
    ytId: '0VJZOF_SJKs',
    title: 'Màu (Đen Trắng)',
    albumId: 'album3_2019',
    difficulty: 'hard',
    views: '1.1M',
    lyricSnippet: 'Thế giới chỉ có hai màu đen và trắng...',
    audioFile: 'assets/audio/mau-den-trang.mp3'
  },
  {
    id: 'ca-hoi',
    ytId: 'by8l9xVxtfg',
    title: 'Cá Hồi',
    albumId: 'ngot2016',
    difficulty: 'hard',
    views: '1.0M',
    lyricSnippet: 'Bơi ngược dòng sông lên thượng nguồn, đi tìm nguồn gốc...',
    audioFile: 'assets/audio/ca-hoi.mp3'
  },

  // --- EXPERT (400K - 1M Views) ---
  {
    id: 'meo-hoang',
    ytId: 'DlZ0vjfmzV0',
    title: 'Mèo Hoang',
    albumId: 'ngPrime2017',
    difficulty: 'expert',
    views: '950K',
    lyricSnippet: 'Chú mèo hoang lang thang góc phố vắng...',
    audioFile: 'assets/audio/meo-hoang.mp3'
  },
  {
    id: 've-di-thien-duong',
    ytId: 'NmHHvnobW2k',
    title: 'Vé Đi Thiên Đường',
    albumId: 'album3_2019',
    difficulty: 'expert',
    views: '950K',
    lyricSnippet: 'Một tấm vé một chiều đi tới thiên đường...',
    audioFile: 'assets/audio/ve-di-thien-duong.mp3'
  },
  {
    id: 'be',
    ytId: 'jhs45JW53P8',
    title: '(Bé)',
    albumId: 'album3_2019',
    difficulty: 'expert',
    views: '807K',
    lyricSnippet: 'Bé con ơi ngủ ngoan trong nôi êm...',
    audioFile: 'assets/audio/be.mp3'
  },
  {
    id: 'be-cool',
    ytId: 'vsRS7oGqPTg',
    title: 'Be Cool',
    albumId: 'ngot2016',
    difficulty: 'expert',
    views: '742K',
    lyricSnippet: 'Just be cool, baby be cool...',
    audioFile: 'assets/audio/be-cool.mp3'
  },
  {
    id: 'kho-bau',
    ytId: 'XyPy4AWa9J0',
    title: 'Kho Báu',
    albumId: 'ngPrime2017',
    difficulty: 'expert',
    views: '731K',
    lyricSnippet: 'Kho báu chôn sâu dưới lòng đất đá...',
    audioFile: 'assets/audio/kho-bau.mp3'
  },
  {
    id: 'khap-xung-quanh',
    ytId: '4VKoHGN9FzU',
    title: 'Khắp Xung Quanh',
    albumId: 'ngot2016',
    difficulty: 'expert',
    views: '613K',
    lyricSnippet: 'Khắp xung quanh ta xe cộ ngược xuôi...',
    audioFile: 'assets/audio/khap-xung-quanh.mp3'
  },
  {
    id: 'du-bao-thoi-tiet',
    ytId: 'zVB61Ta9TMs',
    title: 'Dự Báo Thời Tiết',
    albumId: 'album3_2019',
    difficulty: 'expert',
    views: '440K',
    lyricSnippet: 'Sau đây là bản tin dự báo thời tiết...',
    audioFile: 'assets/audio/du-bao-thoi-tiet.mp3'
  },
  {
    id: 'xin-cho-toi',
    ytId: '9ZKA9xaMLac',
    title: 'Xin Cho Tôi',
    albumId: 'ngPrime2017',
    difficulty: 'expert',
    views: '421K',
    lyricSnippet: 'Xin cho tôi một lần được làm lại...',
    audioFile: 'assets/audio/xin-cho-toi.mp3'
  },

  // --- IMPOSSIBLE (< 400K Views) ---
  {
    id: 'a-oi',
    ytId: 'RTYSgSQGij8',
    title: 'À Ơi',
    albumId: 'ngot2016',
    difficulty: 'impossible',
    views: '356K',
    lyricSnippet: 'À ơi khúc ca ru con thời thơ ấu...',
    audioFile: 'assets/audio/a-oi.mp3'
  },
  {
    id: 'nhung-chuyen-phieu-luu',
    ytId: 'UBgulvgHPE4',
    title: 'Những Chuyến Phiêu Lưu',
    albumId: 'ngot2016',
    difficulty: 'impossible',
    views: '192K',
    lyricSnippet: 'Những chuyến phiêu lưu kỳ thú của tuổi thanh xuân...',
    audioFile: 'assets/audio/nhung-chuyen-phieu-luu.mp3'
  },
  {
    id: 'xanh-fingerstyle',
    ytId: 'cnwM6ujDrKI',
    title: 'Xanh (Fingerstyle)',
    albumId: 'singles',
    difficulty: 'impossible',
    views: '155K',
    lyricSnippet: 'Bản phối acoustic fingerstyle mộc mạc...',
    audioFile: 'assets/audio/xanh-fingerstyle.mp3'
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
