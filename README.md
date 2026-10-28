# 🍬 Kẹo Con - Trò Chơi Đoán Nhạc Ngọt (Music Guessing Game)

Một trang web đoán nhạc dành riêng cho fandom **Kẹo Con** của ban nhạc **Ngọt**, lấy cảm hứng từ thử thách đoán nhạc 5 cấp độ (0.1s - 15s) thịnh hành trên TikTok / Heardle.

---

## ✨ Điểm Nổi Bật

1. **🔥 5 Vòng Thử Thách (Gauntlet)**:
   * **Easy (0.1s - 🟢 Xanh lá):** Những ca khúc quốc dân (*Em Dạo Này*, *Lần Cuối*, *Cho Tôi Đi Theo*, *Để Quên*, *Mấy Khi*).
   * **Medium (0.5s - 🟡 Vàng):** Các bài hit quen thuộc (*Cá Hồi*, *Kho Báu*, *Kẻ Thù*, *Em Có Chắc Không?*, *Thấy Chưa*...).
   * **Hard (2.0s - 🟠 Cam):** Nhạc cho fan cứng (*Mẩu Đối Thoại Ngắn*, *Chuyển Kênh*, *Hết Thời*, *Quan Điểm*...).
   * **Expert (8.0s - 🔴 Đỏ):** Những bài phối khí phức tạp (*Nứt*, *Sự Đầu Hàng*, *Đố Kỵ*, *Chào Hè*...).
   * **Impossible (15.0s - 🟣 Tím):** Những đoạn outro, demo và ca khúc kén người nghe (*Bản Giao Hưởng Số 5*, *Màu Đỏ*, *Mất Tích*...).

2. **🎶 Web Audio Synthesizer tích hợp sẵn**:
   * Game **hoàn toàn có thể chơi và phát âm thanh ngay lập tức** nhờ bộ giả lập guitar, piano, synth, funk keys của Web Audio API!
   * Hỗ trợ tự động tải file `.mp3` thực tế nếu đặt file vào thư mục `assets/audio/[ten-bai].mp3`.

3. **🔍 Tìm Kiếm Tiếng Việt Không Dấu Cực Nhanh**:
   * Nhập có dấu (*Lần Cuối*) hoặc không dấu (*lan cuoi*, *de quen*) đều tự động gợi ý chính xác cùng ảnh bìa album tương ứng.

4. **🏆 Đầy Đủ 4 Album & Đĩa Đơn Của Ngọt**:
   * *Ngọt.* (2016)
   * *Ng\`* (2017)
   * *3* (2019)
   * *Gieo* (2022)
   * Các đĩa đơn & EP (*Cho Em Đi Làm*, *Mùa Hè Hết*, *Kẹo*...)

5. **📋 Chia Sẻ Kết Quả**:
   * Tự động sinh emoji score card (🟩 🟨 🟧 🟥 🟪) để khoe bạn bè trên Facebook, Discord, Threads.

---

## 🚀 Cách Chạy Trực Tiếp

Dự án sử dụng **Option A (Zero-Build Modern Web)**, không cần cài đặt dependencies phức tạp:

```bash
# Trong thư mục dự án:
python3 -m http.server 3000
```

Mở trình duyệt tại: **`http://localhost:3000`**

---

## 📁 Cấu Trúc Dự Án

```
music-guess/
├── index.html           # Giao diện chính (Tailwind CSS, Glassmorphism, Responsive)
├── css/
│   └── style.css        # Hiệu ứng glow, vòng xoay radial timer, dark theme
├── js/
│   ├── songs.js         # Toàn bộ danh mục đĩa nhạc Ngọt (album, độ khó, trích đoạn)
│   ├── synth.js         # Bộ tổng hợp âm thanh Web Audio API (Guitar, Piano, Keys...)
│   ├── audio.js         # Quản lý phát nhạc siêu chính xác (0.1s -> 15s)
│   ├── search.js        # Thuật toán tìm kiếm tiếng Việt không dấu & fuzzy search
│   ├── game.js          # Logic trò chơi (Gauntlet, Heardle, Thống kê, Điểm số)
│   └── app.js           # Điều khiển giao diện & tương tác
└── assets/
    ├── covers/          # Ảnh bìa vector SVG cho 4 studio album và đĩa đơn
    └── audio/           # Thư mục chứa nhạc MP3 (tùy chọn)
```

---

## 🍬 Dành tặng cộng đồng Kẹo Con
*"Lần cuối, đi bên nhau cay đắng nhưng không đau..."*
