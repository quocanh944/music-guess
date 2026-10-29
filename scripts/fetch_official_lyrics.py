import json
import subprocess
import re
import os
import sys

sys.path.append('/home/quocanh/Projects/music-guess/scripts')
from sync_official_channel import OFFICIAL_TRACKS

OUTPUT_FILE = '/home/quocanh/Projects/music-guess/scripts/official_lyrics.json'

lyrics_data = {}
if os.path.exists(OUTPUT_FILE):
    with open(OUTPUT_FILE) as f:
        lyrics_data = json.load(f)

for idx, t in enumerate(OFFICIAL_TRACKS, 1):
    song_id = t["id"]
    yt_id = t["yt_id"]
    if song_id in lyrics_data and lyrics_data[song_id].get("description"):
        continue
    
    print(f"[{idx}/{len(OFFICIAL_TRACKS)}] Fetching description for {t['title']} ({yt_id})...")
    cmd = ["yt-dlp", "--print", "%(description)s", f"https://www.youtube.com/watch?v={yt_id}"]
    try:
        res = subprocess.run(cmd, capture_output=True, text=True, check=True)
        desc = res.stdout.strip()
        lyrics_data[song_id] = {
            "title": t["title"],
            "yt_id": yt_id,
            "description": desc
        }
    except Exception as e:
        print(f"  ✗ Error for {song_id}: {e}")

with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(lyrics_data, f, ensure_ascii=False, indent=2)

print(f"\nDone! Saved descriptions for {len(lyrics_data)} songs.")
