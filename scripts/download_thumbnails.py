#!/usr/bin/env python3
"""
Downloads the official YouTube video thumbnails from @Ngọt-o9k
for every song in the catalog.
"""
import os
import urllib.request
import re
import ast

THUMB_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "assets", "thumbnails"))
os.makedirs(THUMB_DIR, exist_ok=True)

with open(os.path.join(os.path.dirname(__file__), "sync_official_channel.py")) as f:
    content = f.read()

m = re.search(r"OFFICIAL_TRACKS\s*=\s*(\[.*?\]\n)", content, re.DOTALL)
if not m:
    print("Could not find OFFICIAL_TRACKS")
    exit(1)

tracks = ast.literal_eval(m.group(1))
print(f"Downloading thumbnails for {len(tracks)} songs...")

success = 0
for t in tracks:
    sid = t["id"]
    ytid = t["yt_id"]
    out_path = os.path.join(THUMB_DIR, f"{sid}.jpg")

    if os.path.exists(out_path) and os.path.getsize(out_path) > 5000:
        print(f"✓ Exists: {sid}.jpg")
        success += 1
        continue

    # Try hqdefault.jpg
    url = f"https://i.ytimg.com/vi/{ytid}/hqdefault.jpg"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req) as resp, open(out_path, "wb") as f:
            f.write(resp.read())
        print(f"✓ Downloaded thumbnail: {sid}.jpg ({os.path.getsize(out_path)} bytes)")
        success += 1
    except Exception as e:
        # Fallback to mqdefault
        try:
            url_mq = f"https://i.ytimg.com/vi/{ytid}/mqdefault.jpg"
            req_mq = urllib.request.Request(url_mq, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req_mq) as resp, open(out_path, "wb") as f:
                f.write(resp.read())
            print(f"✓ Downloaded fallback: {sid}.jpg")
            success += 1
        except Exception as e2:
            print(f"✗ Failed {sid}: {e2}")

print(f"\nDone! {success}/{len(tracks)} thumbnails downloaded.")
