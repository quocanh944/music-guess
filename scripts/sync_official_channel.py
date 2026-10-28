#!/usr/bin/env python3
"""
Syncs official tracks directly from Ngọt's official YouTube channel (@Ngọt-o9k).
Downloads 25s intro snippets, trims leading silence with ffmpeg, and ensures
immediate 0.0s sound playback.
"""
import os
import subprocess
import json

AUDIO_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "assets", "audio"))
os.makedirs(AUDIO_DIR, exist_ok=True)

# Tracks directly mapped from official channel @Ngọt-o9k
OFFICIAL_TRACKS = [
    # --- EASY (>= 10M views) ---
    {"id": "cho-toi-lang-thang", "title": "Cho Tôi Lang Thang (ft. Đen)", "yt_id": "gUr4qp6YGLs", "views": "36M", "diff": "easy", "album": "singles", "year": 2017},
    {"id": "lan-cuoi", "title": "Lần Cuối", "yt_id": "kSjj0LlsqnI", "views": "35M", "diff": "easy", "album": "ngPrime2017", "year": 2017},
    {"id": "em-dao-nay", "title": "Em Dạo Này", "yt_id": "-6s_eRHYqVM", "views": "23M", "diff": "easy", "album": "ngot2016", "year": 2016},
    {"id": "chuyen-kenh", "title": "Chuyển Kênh", "yt_id": "ECZVU4x6Xq0", "views": "15M", "diff": "easy", "album": "album3_2019", "year": 2019},
    {"id": "thay-chua", "title": "Thấy Chưa", "yt_id": "9mA7h1jfxc8", "views": "14M", "diff": "easy", "album": "gieo2022", "year": 2022},
    {"id": "de-quen", "title": "Để Quên", "yt_id": "W08NL1mchhs", "views": "11M", "diff": "easy", "album": "album3_2019", "year": 2019},

    # --- MEDIUM (3M - 10M views) ---
    {"id": "het-thoi", "title": "Hết Thời", "yt_id": "yJbGCwT7Kms", "views": "8.8M", "diff": "medium", "album": "album3_2019", "year": 2019},
    {"id": "cho-toi-di-theo", "title": "Cho Tôi Đi Theo", "yt_id": "U07kJZp5b1o", "views": "7.7M", "diff": "medium", "album": "ngot2016", "year": 2016},
    {"id": "cho", "title": "Cho", "yt_id": "RkXStDkolwE", "views": "7.7M", "diff": "medium", "album": "singles", "year": 2016},
    {"id": "dot", "title": "Đốt", "yt_id": "xvpverLphlo", "views": "6.6M", "diff": "medium", "album": "singles", "year": 2020},
    {"id": "xanh", "title": "Xanh", "yt_id": "0YdgmKjUG-o", "views": "6.5M", "diff": "medium", "album": "ngot2016", "year": 2016},
    {"id": "ke-thu", "title": "Kẻ Thù", "yt_id": "-b4qvyf_vNU", "views": "6.0M", "diff": "medium", "album": "ngPrime2017", "year": 2017},
    {"id": "em-trang-tri", "title": "Em Trang Trí", "yt_id": "KypuJGsZ8pQ", "views": "5.9M", "diff": "medium", "album": "gieo2022", "year": 2022},
    {"id": "may-khi", "title": "Mấy Khi", "yt_id": "LvNEPB5x7T8", "views": "5.8M", "diff": "medium", "album": "album3_2019", "year": 2019},
    {"id": "nut", "title": "Nứt", "yt_id": "xG94wlZai1I", "views": "5.7M", "diff": "medium", "album": "album3_2019", "year": 2019},
    {"id": "em-co-chac-khong", "title": "Em Có Chắc Không?", "yt_id": "p8VDTNYyKbo", "views": "4.7M", "diff": "medium", "album": "album3_2019", "year": 2019},
    {"id": "chuyen-do-dang", "title": "Chuyện Dở Dang", "yt_id": "o1RG7x4-WXM", "views": "4.1M", "diff": "medium", "album": "singles", "year": 2023},
    {"id": "bartender", "title": "Bartender", "yt_id": "1u0ygl9vJHI", "views": "4.0M", "diff": "medium", "album": "singles", "year": 2018},
    {"id": "hay-la", "title": "Hay Là", "yt_id": "LecuZccoWBs", "views": "3.0M", "diff": "medium", "album": "singles", "year": 2023},

    # --- HARD (1M - 3M views) ---
    {"id": "mo-lam-ma", "title": "Mơ Làm Ma (ft. Thỏ Trauma)", "yt_id": "FBM70NaZuVI", "views": "2.8M", "diff": "hard", "album": "singles", "year": 2023},
    {"id": "khong-lam-gi", "title": "Không Làm Gì", "yt_id": "mjpUWO5MuPg", "views": "2.5M", "diff": "hard", "album": "singles", "year": 2016},
    {"id": "mot-ngay-khong-mua", "title": "Một Ngày Không Mưa", "yt_id": "gQOFI4ATIOY", "views": "2.4M", "diff": "hard", "album": "ngPrime2017", "year": 2017},
    {"id": "gia-vo", "title": "Giả Vờ", "yt_id": "njv-aZKJnn8", "views": "2.0M", "diff": "hard", "album": "album3_2019", "year": 2019},
    {"id": "tim-nguoi-nha", "title": "Tìm Người Nhà", "yt_id": "j-oB7Bbv4ig", "views": "2.0M", "diff": "hard", "album": "album3_2019", "year": 2019},
    {"id": "meu-mao", "title": "Mếu Máo (T.T)", "yt_id": "KOBT2yACJvA", "views": "1.9M", "diff": "hard", "album": "album3_2019", "year": 2019},
    {"id": "di-tru-dong", "title": "Đi Trú Đông", "yt_id": "ZWY5WXssw_w", "views": "1.6M", "diff": "hard", "album": "album3_2019", "year": 2019},
    {"id": "drama-queen", "title": "Drama Queen", "yt_id": "Vq2ShP3qC2M", "views": "1.5M", "diff": "hard", "album": "singles", "year": 2016},
    {"id": "thap-huong-hoa-vang", "title": "Thắp Hương Hoá Vàng", "yt_id": "TjmZD0V8m0U", "views": "1.5M", "diff": "hard", "album": "singles", "year": 2023},
    {"id": "vi-ai", "title": "Vì Ai", "yt_id": "GqIaese5_Ac", "views": "1.4M", "diff": "hard", "album": "singles", "year": 2016},
    {"id": "chuong-bao-thuc", "title": "Chuông Báo Thức", "yt_id": "bWO-YOfQ2xs", "views": "1.3M", "diff": "hard", "album": "album3_2019", "year": 2019},
    {"id": "mau-den-trang", "title": "Màu (Đen Trắng)", "yt_id": "0VJZOF_SJKs", "views": "1.1M", "diff": "hard", "album": "album3_2019", "year": 2019},
    {"id": "ca-hoi", "title": "Cá Hồi", "yt_id": "by8l9xVxtfg", "views": "1.0M", "diff": "hard", "album": "ngot2016", "year": 2016},

    # --- EXPERT (400K - 1M views) ---
    {"id": "meo-hoang", "title": "Mèo Hoang", "yt_id": "DlZ0vjfmzV0", "views": "950K", "diff": "expert", "album": "ngPrime2017", "year": 2017},
    {"id": "ve-di-thien-duong", "title": "Vé Đi Thiên Đường", "yt_id": "NmHHvnobW2k", "views": "950K", "diff": "expert", "album": "album3_2019", "year": 2019},
    {"id": "be", "title": "(Bé)", "yt_id": "jhs45JW53P8", "views": "807K", "diff": "expert", "album": "album3_2019", "year": 2019},
    {"id": "be-cool", "title": "Be Cool", "yt_id": "vsRS7oGqPTg", "views": "742K", "diff": "expert", "album": "ngot2016", "year": 2016},
    {"id": "kho-bau", "title": "Kho Báu", "yt_id": "XyPy4AWa9J0", "views": "731K", "diff": "expert", "album": "ngPrime2017", "year": 2017},
    {"id": "khap-xung-quanh", "title": "Khắp Xung Quanh", "yt_id": "4VKoHGN9FzU", "views": "613K", "diff": "expert", "album": "ngot2016", "year": 2016},
    {"id": "du-bao-thoi-tiet", "title": "Dự Báo Thời Tiết", "yt_id": "zVB61Ta9TMs", "views": "440K", "diff": "expert", "album": "album3_2019", "year": 2019},
    {"id": "xin-cho-toi", "title": "Xin Cho Tôi", "yt_id": "9ZKA9xaMLac", "views": "421K", "diff": "expert", "album": "ngPrime2017", "year": 2017},

    # --- IMPOSSIBLE (< 400K views) ---
    {"id": "a-oi", "title": "À Ơi", "yt_id": "RTYSgSQGij8", "views": "356K", "diff": "impossible", "album": "ngot2016", "year": 2016},
    {"id": "nhung-chuyen-phieu-luu", "title": "Những Chuyến Phiêu Lưu", "yt_id": "UBgulvgHPE4", "views": "192K", "diff": "impossible", "album": "ngot2016", "year": 2016},
    {"id": "xanh-fingerstyle", "title": "Xanh (Fingerstyle)", "yt_id": "cnwM6ujDrKI", "views": "155K", "diff": "impossible", "album": "singles", "year": 2016}
]

def download_and_trim(track):
    song_id = track["id"]
    yt_id = track["yt_id"]
    out_path = os.path.join(AUDIO_DIR, f"{song_id}.mp3")

    # If already exists and verified, skip download
    if os.path.exists(out_path) and os.path.getsize(out_path) > 10000:
        print(f"✓ Already present: {song_id}")
        return True

    print(f"\n▶ Downloading {track['title']} ({yt_id})...")
    raw_path = os.path.join(AUDIO_DIR, f"{song_id}_raw.mp3")

    cmd_dl = [
        "yt-dlp",
        f"https://www.youtube.com/watch?v={yt_id}",
        "-x",
        "--audio-format", "mp3",
        "--audio-quality", "96K",
        "--download-sections", "*00:00-00:25",
        "--force-overwrites",
        "-o", raw_path
    ]

    res = subprocess.run(cmd_dl, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE, text=True)
    if res.returncode != 0 or not os.path.exists(raw_path):
        print(f"✗ Failed yt-dlp: {song_id}")
        return False

    # Trim leading silence with ffmpeg
    cmd_trim = [
        "ffmpeg", "-y",
        "-i", raw_path,
        "-af", "silenceremove=start_periods=1:start_duration=0.001:start_threshold=-25dB",
        "-c:a", "libmp3lame",
        "-b:a", "96k",
        out_path
    ]
    subprocess.run(cmd_trim, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    if os.path.exists(raw_path):
        os.remove(raw_path)

    print(f"✓ Trimmed & ready: {song_id} ({os.path.getsize(out_path)} bytes)")
    return True

def main():
    print(f"Processing {len(OFFICIAL_TRACKS)} official tracks from @Ngọt-o9k...")
    success = 0
    for t in OFFICIAL_TRACKS:
        if download_and_trim(t):
            success += 1
    print(f"\nCompleted: {success}/{len(OFFICIAL_TRACKS)} songs processed.")

if __name__ == "__main__":
    main()
