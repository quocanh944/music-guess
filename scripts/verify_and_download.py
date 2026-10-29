import json
import subprocess
import os
import sys

AUDIO_DIR = "/home/quocanh/Projects/music-guess/assets/audio"
os.makedirs(AUDIO_DIR, exist_ok=True)

from sync_official_channel import OFFICIAL_TRACKS

print(f"Total official tracks to verify and download: {len(OFFICIAL_TRACKS)}")
