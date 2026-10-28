#!/usr/bin/env python3
"""
Downloads ~25s audio snippets of Ngọt songs for the Kẹo Con guessing game.
Uses yt-dlp to fetch the intro of each track in compact 96kbps MP3 format.
"""
import os
import subprocess
import sys

SONG_QUERIES = [
    # Easy
    ("em-dao-nay", "Ngot Em Dao Nay Official Audio"),
    ("lan-cuoi", "Ngot Lan Cuoi Official Audio"),
    ("cho-toi-di-theo", "Ngot Cho Toi Di Theo Official Audio"),
    ("de-quen", "Ngot De Quen Official Audio"),
    ("may-khi", "Ngot May Khi Official Audio"),

    # Medium
    ("ca-hoi", "Ngot Ca Hoi Official Audio"),
    ("kho-bau", "Ngot Kho Bau Official Audio"),
    ("ke-thu", "Ngot Ke Thu Official Audio"),
    ("em-co-chac-khong", "Ngot Em Co Chac Khong Official Audio"),
    ("thay-chua", "Ngot Thay Chua Official Audio"),
    ("em-trang-tri", "Ngot Em Trang Tri Official Audio"),

    # Hard
    ("mau-doi-thoai-ngan", "Ngot Mau Doi Thoai Ngan Official Audio"),
    ("chuyen-kenh", "Ngot Chuyen Kenh Official Audio"),
    ("het-thoi", "Ngot Het Thoi Official Audio"),
    ("quan-diem", "Ngot Quan Diem Official Audio"),
    ("ru-con-bang-ngua-go", "Ngot Ru Con Bang Ngua Go Official Audio"),
    ("cho-em-di-lam", "Ngot Cho Em Di Lam Official Audio"),

    # Expert
    ("nut", "Ngot Nut Official Audio"),
    ("su-dau-hang", "Ngot Su Dau Hang Official Audio"),
    ("do-ky", "Ngot Do Ky Official Audio"),
    ("gieo", "Ngot Gieo Official Audio"),
    ("chao-he", "Ngot Chao He Official Audio"),

    # Impossible
    ("ban-giao-huong-so-5", "Ngot Ban Giao Huong So 5 Official Audio"),
    ("mau-do-khong-bao-gio", "Ngot Mau Do Khong Bao Gio Official Audio"),
    ("chuong-bao-dong-2", "Ngot Chuong Bao Dong Official Audio"),
    ("mat-tich", "Ngot Mat Tich Official Audio"),
    ("keo", "Ngot Keo Official Audio")
]

OUTPUT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "assets", "audio"))
os.makedirs(OUTPUT_DIR, exist_ok=True)

def download_snippet(song_id, query):
    out_path = os.path.join(OUTPUT_DIR, f"{song_id}.mp3")
    if os.path.exists(out_path) and os.path.getsize(out_path) > 10000:
        print(f"✓ Already exists: {song_id}")
        return True

    print(f"\n▶ Downloading: {song_id} ({query})...")
    # yt-dlp command downloading first 25 seconds as 96k mp3
    cmd = [
        "yt-dlp",
        f"ytsearch1:{query}",
        "-x",
        "--audio-format", "mp3",
        "--audio-quality", "96K",
        "--download-sections", "*00:00-00:25",
        "--force-overwrites",
        "-o", os.path.join(OUTPUT_DIR, f"{song_id}.%(ext)s")
    ]

    res = subprocess.run(cmd)
    if res.returncode == 0 and os.path.exists(out_path):
        print(f"✓ Successfully downloaded: {song_id} ({os.path.getsize(out_path)} bytes)")
        return True
    else:
        print(f"✗ Failed to download: {song_id}")
        return False

def main():
    print(f"Target directory: {OUTPUT_DIR}")
    success_count = 0
    for song_id, query in SONG_QUERIES:
        if download_snippet(song_id, query):
            success_count += 1

    print(f"\n==========================================")
    print(f"Finished: {success_count}/{len(SONG_QUERIES)} songs downloaded.")
    print(f"==========================================")

if __name__ == "__main__":
    main()
