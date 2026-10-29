#!/usr/bin/env python3
"""
Downloads FULL audio directly from official YouTube video IDs from channel @Ngọt-o9k.
Trims only leading silence at 0.0s so snippets start on the first musical note,
while preserving the FULL track for end-game playback.
"""
import os
import subprocess
import sys
import tempfile
from sync_official_channel import OFFICIAL_TRACKS

AUDIO_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "assets", "audio"))
os.makedirs(AUDIO_DIR, exist_ok=True)

print(f"Total tracks to download & process: {len(OFFICIAL_TRACKS)}")

success_count = 0
failed_tracks = []

for idx, track in enumerate(OFFICIAL_TRACKS, 1):
    song_id = track["id"]
    yt_id = track["yt_id"]
    title = track["title"]
    final_path = os.path.join(AUDIO_DIR, f"{song_id}.mp3")

    print(f"\n[{idx}/{len(OFFICIAL_TRACKS)}] Processing: {title} (ID: {yt_id})")

    with tempfile.TemporaryDirectory() as tmpdir:
        raw_mp3 = os.path.join(tmpdir, "raw.mp3")

        # 1. Download full audio from exact YouTube ID
        cmd_dl = [
            "yt-dlp",
            f"https://www.youtube.com/watch?v={yt_id}",
            "-x",
            "--audio-format", "mp3",
            "--audio-quality", "96K",
            "--force-overwrites",
            "-o", raw_mp3
        ]

        dl_res = subprocess.run(cmd_dl, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE, text=True)
        if dl_res.returncode != 0 or not os.path.exists(raw_mp3):
            print(f"  ✗ Failed downloading {song_id} ({yt_id}): {dl_res.stderr[-200:]}")
            failed_tracks.append((song_id, yt_id, "download error"))
            continue

        # 2. Trim leading silence using ffmpeg so 0.0s is the exact first note
        cmd_trim = [
            "ffmpeg", "-y",
            "-i", raw_mp3,
            "-af", "silenceremove=start_periods=1:start_duration=0.001:start_threshold=-25dB",
            "-b:a", "96k",
            final_path
        ]

        trim_res = subprocess.run(cmd_trim, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE, text=True)
        if trim_res.returncode != 0 or not os.path.exists(final_path):
            print(f"  ✗ Failed ffmpeg trim for {song_id}")
            failed_tracks.append((song_id, yt_id, "trim error"))
            continue

        # Check duration of final file
        dur_cmd = ["ffprobe", "-i", final_path, "-show_entries", "format=duration", "-v", "quiet", "-of", "csv=p=0"]
        dur = subprocess.check_output(dur_cmd, text=True).strip()
        size_kb = os.path.getsize(final_path) // 1024
        print(f"  ✓ Saved: {song_id}.mp3 | Duration: {float(dur):.1f}s | Size: {size_kb}KB")
        success_count += 1

print("\n" + "="*50)
print(f"COMPLETED: {success_count}/{len(OFFICIAL_TRACKS)} tracks updated.")
if failed_tracks:
    print(f"FAILED ({len(failed_tracks)}): {failed_tracks}")
else:
    print("ALL 43 TRACKS SUCCESSFULLY DOWNLOADED FROM OFFICIAL IDS & TRIMMED!")
