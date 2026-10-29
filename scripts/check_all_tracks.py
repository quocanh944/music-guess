import subprocess
import json
import os
from sync_official_channel import OFFICIAL_TRACKS

NGOT_CHANNEL_ID = "UCuKWFCkVDNzcFy5JGeJFrOw"

results = []
for t in OFFICIAL_TRACKS:
    yt_id = t["yt_id"]
    cmd = [
        "yt-dlp",
        "--print", "%(id)s | %(title)s | %(channel)s | %(channel_id)s | %(duration)s",
        f"https://www.youtube.com/watch?v={yt_id}"
    ]
    try:
        proc = subprocess.run(cmd, capture_output=True, text=True, check=True)
        out = proc.stdout.strip()
        parts = [p.strip() for p in out.split("|")]
        is_official = (parts[3] == NGOT_CHANNEL_ID)
        results.append({
            "id": t["id"],
            "yt_id": yt_id,
            "title": t["title"],
            "yt_title": parts[1] if len(parts) > 1 else "",
            "channel": parts[2] if len(parts) > 2 else "",
            "channel_id": parts[3] if len(parts) > 3 else "",
            "duration": int(parts[4]) if len(parts) > 4 and parts[4].isdigit() else 0,
            "is_official": is_official
        })
        status_icon = "✓" if is_official else "⚠"
        print(f"{status_icon} [{t['id']}] {t['title']} -> {parts[1]} ({parts[2]}) - {parts[4]}s")
    except Exception as e:
        print(f"✗ [{t['id']}] Failed to fetch info: {e}")

with open("/home/quocanh/Projects/music-guess/scripts/track_verification.json", "w") as f:
    json.dump(results, f, indent=2)

print("\nDone checking all tracks.")
