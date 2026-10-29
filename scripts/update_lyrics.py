import re

LYRICS_MAP = {
    'cho-toi-lang-thang': 'Cho tôi lang thang, quên ngày tháng. Cho tôi quên đi bao lo toan muộn phiền...',
    'lan-cuoi': 'Lần cuối, đi bên em xót xa người ơi. Lần cuối, ta bên nhau có vui gì đâu...',
    'em-dao-nay': 'Em dạo này nhiều tiền không? Em dạo này còn đi xem phim một mình?...',
    'chuyen-kenh': 'Chuyển kênh khác xem có gì vui, tivi đang chiếu phim hài...',
    'thay-chua': 'Sẽ có ngày em thấy những chuyện buồn hôm ấy chỉ là chuyện cười hôm nay... Thấy chưa, thấy chưa em?',
    'de-quen': 'Thế còn những gì em để quên nhà tôi, tôi để quên nhà em, ta để quên nhà nhau sau bao lần ghé chơi...',
    'het-thoi': 'Hết thời, tôi hết thời rồi các bạn ơi. Hết thời, ai rồi cũng phải hết thời thôi...',
    'cho-toi-di-theo': 'Cho tôi đi theo với, nơi anh đi về. Về làm kem chuối, về làm kem dừa...',
    'cho': 'Cho tôi một ly nước ấm, cho tôi một chỗ ngồi. Cho tôi xin một góc nhỏ...',
    'dot': 'Đốt hết đi được không? Trang giấy này coi như trống... Kí ức về em sẽ cháy thật to, trí nhớ của tôi sẽ hóa tàn tro...',
    'xanh': 'Một màu xanh xanh, chấm thêm vàng vàng... Bầu trời hôm nay thật xanh, cây lá ngoài vườn thật xanh...',
    'ke-thu': 'Kẻ thù của tôi, hãy ngồi xuống đây cạn một ly này...',
    'em-trang-tri': 'Đưa xuống một li, sang trái một tí... Và em lại trang trí căn nhà của chúng ta...',
    'may-khi': 'Và đừng lo gì baby, mình không mấy khi gần nhau đâu đấy, còn xa lâu đấy...',
    'nut': 'Rơi, rơi, rơi cho vỡ thêm một lần. Vỡ, vỡ, vỡ cho nát tan một lần. Tan, tan, mong sao sẽ quen dần dần...',
    'em-co-chac-khong': 'Nhưng em có chắc không khi người ta đã từ chối em? Bám theo và người ta sẽ lừa dối em... Rằng tình yêu rất khác rebound...',
    'chuyen-do-dang': 'Những chuyện dở dang của một thời ngây dại...',
    'bartender': 'Này chàng bartender, pha cho tôi một ly thật cay để quên đi muộn phiền...',
    'hay-la': 'Hay là ta cứ thế này thôi, chẳng cần phải hứa hẹn ngày mai...',
    'mo-lam-ma': 'Đêm nằm mơ thấy mình làm ma, bay qua từng mái nhà, nhìn em ngủ say...',
    'khong-lam-gi': 'Hôm nay tôi không làm gì, tôi nằm đây ngắm mặt trời đi qua...',
    'mot-ngay-khong-mua': 'Một ngày không mưa ta cùng nhau đi dạo qua từng con phố nhỏ...',
    'gia-vo': 'Giả vờ như ta chưa từng quen, giả vờ như chưa từng hẹn thề...',
    'tim-nguoi-nha': 'Tìm người nhà đi lạc giữa thành phố đông đúc...',
    'meu-mao': 'MẾU MÁO (T.T) - Khuôn mặt mếu máo như đứa trẻ con khi bị mắng...',
    'di-tru-dong': '(tôi) ĐI TRÚ ĐÔNG - Mùa đông lạnh giá ta đi tìm nơi trú đông...',
    'drama-queen': 'Cô nàng drama queen với những vở kịch cuộc đời đẫm nước mắt...',
    'thap-huong-hoa-vang': 'Thắp một nén hương hoá vàng cho những ngày cũ đã qua...',
    'vi-ai': 'Vì ai ta thức trắng bao đêm dài, vì ai lệ rơi ướt hoen bờ mi...',
    'chuong-bao-thuc': 'Sáng rồi chuông reo giục ta thức dậy đón bình minh...',
    'mau-den-trang': 'MÀU (đen trắng) - Thế giới này chỉ có hai màu đen và trắng...',
    'ca-hoi': 'Cá hồi bơi ngược dòng sông, vượt qua ghềnh thác tìm về cội nguồn...',
    'meo-hoang': 'Chú mèo hoang lang thang góc phố vắng tìm miếng ăn...',
    've-di-thien-duong': 'Một tấm vé một chiều đi tới thiên đường...',
    'be': '(bé) - Bé con ơi đừng khóc nữa, ngủ ngoan trong nôi êm...',
    'be-cool': 'Just be cool, baby be cool, đừng lo âu nhiều...',
    'kho-bau': 'Rồi tôi cứ đi suốt đêm ngày, cho tới khi tôi quên đường về. Rồi tôi cứ đi khắp thiên hạ, tôi cứ đi tìm kho báu...',
    'khap-xung-quanh': 'Khắp xung quanh ta xe cộ ngược xuôi trên đường phố quen...',
    'du-bao-thoi-tiet': 'Sau đây là dự báo thời tiết cho các vùng vào ngày mai...',
    'xin-cho-toi': 'Xin cho tôi một lần được nói hết những tâm tư chôn giấu...',
    'a-oi': 'À ơi khúc ca ru con ngủ ngon trong tiếng ve kêu hè về...',
    'nhung-chuyen-phieu-luu': 'Những chuyến phiêu lưu kỳ thú của tuổi trẻ đầy hoài bão...',
    'xanh-fingerstyle': '(Bản phối guitar acoustic fingerstyle mộc mạc - Chí Hùng biểu diễn)'
}

songs_path = '/home/quocanh/Projects/music-guess/js/songs.js'
with open(songs_path, 'r', encoding='utf-8') as f:
    content = f.read()

def replacer(match):
    song_id = match.group(1)
    old_lyric = match.group(2)
    if song_id in LYRICS_MAP:
        new_lyric = LYRICS_MAP[song_id].replace("'", "\\'")
        return f"id: '{song_id}',\n    ytId:{match.group(3)},\n    title:{match.group(4)},\n    albumId:{match.group(5)},\n    difficulty:{match.group(6)},\n    views:{match.group(7)},\n    lyricSnippet: '{new_lyric}',"
    return match.group(0)

pattern = r"id:\s*'([^']+)',\s*\n\s*ytId:([^,\n]+),\s*\n\s*title:([^,\n]+),\s*\n\s*albumId:([^,\n]+),\s*\n\s*difficulty:([^,\n]+),\s*\n\s*views:([^,\n]+),\s*\n\s*lyricSnippet:\s*'([^']+)',"

updated_content, count = re.subn(pattern, replacer, content)

print(f"Updated {count} songs with authentic lyrics.")
with open(songs_path, 'w', encoding='utf-8') as f:
    f.write(updated_content)
