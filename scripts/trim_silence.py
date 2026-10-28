#!/usr/bin/env python3
"""
Trims leading silence from all Ngọt MP3 audio snippets using ffmpeg.
Ensures that the first 0.1s contains the actual first musical transient/note!
"""
import glob
import os
import subprocess

AUDIO_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "assets", "audio"))

def trim_silence(filepath):
    filename = os.path.basename(filepath)
    temp_path = filepath + ".tmp.mp3"

    # silenceremove filter: removes initial silence below -35dB
    cmd = [
        "ffmpeg", "-y",
        "-i", filepath,
        "-af", "silenceremove=start_periods=1:start_duration=0.02:start_threshold=-35dB",
        "-c:a", "libmp3lame",
        "-b:a", "96k",
        temp_path
    ]

    res = subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE, text=True)
    if res.returncode == 0 and os.path.exists(temp_path) and os.path.getsize(temp_path) > 5000:
        os.replace(temp_path, filepath)
        print(f"✓ Trimmed leading silence: {filename}")
        return True
    else:
        if os.path.exists(temp_path):
            os.remove(temp_path)
        print(f"⚠ Could not trim {filename}, keeping original.")
        return False

def verify_first_transient(filepath):
    # Check silence at the beginning
    cmd = [
        "ffmpeg",
        "-i", filepath,
        "-af", "silencedetect=noise=-35dB:d=0.05",
        "-f", "null", "-"
    ]
    res = subprocess.run(cmd, stderr=subprocess.PIPE, text=True)
    has_leading_silence = False
    for line in res.stderr.splitlines():
        if "silence_start: 0" in line:
            has_leading_silence = True
            break
    return not has_leading_silence

def main():
    mp3_files = sorted(glob.glob(os.path.join(AUDIO_DIR, "*.mp3")))
    print(f"Found {len(mp3_files)} MP3 files in {AUDIO_DIR}")

    trimmed_count = 0
    for f in mp3_files:
        if trim_silence(f):
            trimmed_count += 1

    print("\nVerifying all files start immediately with music:")
    all_clean = True
    for f in mp3_files:
        name = os.path.basename(f)
        starts_with_music = verify_first_transient(f)
        status = "🎵 Starts immediately" if starts_with_music else "⚠ Has quiet lead-in"
        print(f"  {name:30} : {status}")
        if not starts_with_music:
            all_clean = False

    print("\n" + "="*50)
    print(f"Done! {trimmed_count}/{len(mp3_files)} files processed.")
    if all_clean:
        print("All songs now guarantee audible sound in the first 0.1s!")
    print("="*50)

if __name__ == "__main__":
    main()
