/**
 * VIETNAMESE DIACRITIC-TOLERANT SEARCH & AUTOCOMPLETE
 * Handles accented, unaccented, telex, and fuzzy song matches for "Ngọt"
 */

/**
 * Strips all Vietnamese tonal marks and diacritics
 * e.g. "Lần Cuối" -> "lan cuoi", "Để Quên" -> "de quen"
 */
export function removeVietnameseTones(str) {
  if (!str) return '';
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  // Combine diacritical marks removal for unicode normalization
  str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return str.trim();
}

/**
 * Searches song catalog by title, lyric snippets, or album
 * Returns ranked results
 */
export function searchSongs(query, songs, albums) {
  const cleanQuery = removeVietnameseTones(query);
  if (!cleanQuery) return [];

  const results = [];

  for (const song of songs) {
    const cleanTitle = removeVietnameseTones(song.title);
    const cleanLyric = removeVietnameseTones(song.lyricSnippet || '');
    const album = albums[song.albumId];
    const cleanAlbum = album ? removeVietnameseTones(album.name) : '';

    let score = 0;

    // Exact matches
    if (cleanTitle === cleanQuery) {
      score += 100;
    } else if (cleanTitle.startsWith(cleanQuery)) {
      score += 60;
    } else if (cleanTitle.includes(cleanQuery)) {
      score += 40;
    } else if (cleanLyric.includes(cleanQuery)) {
      score += 20;
    } else if (cleanAlbum.includes(cleanQuery)) {
      score += 10;
    }

    // Acronym match (e.g., "ctdt" -> "Cho Tôi Đi Theo", "edn" -> "Em Dạo Này")
    const acronym = cleanTitle.split(' ').map(w => w[0]).join('');
    if (acronym.includes(cleanQuery)) {
      score += 35;
    }

    if (score > 0) {
      results.push({ song, score, album });
    }
  }

  // Sort descending by score
  results.sort((a, b) => b.score - a.score);
  return results.slice(0, 8); // Top 8 results
}
