import sys
sys.path.insert(0, './piper_tts_lib')

from pydub import AudioSegment
from pydub.silence import split_on_silence
import os

# Load the audio file
print("Loading audio file...")
audio = AudioSegment.from_file("assets/great.m4a")

# Split audio on silence
print("Detecting silence and splitting...")
chunks = split_on_silence(
    audio,
    min_silence_len=500,  # minimum silence length in ms
    silence_thresh=-40,   # silence threshold in dB
    keep_silence=100      # keep 100ms of silence at edges
)

print(f"Found {len(chunks)} phrases!")

# Export each chunk as MP3
output_dir = "assets"
for i, chunk in enumerate(chunks, 1):
    filename = f"{output_dir}/phrase{i}.mp3"
    chunk.export(filename, format="mp3")
    print(f"Exported: {filename} ({len(chunk)/1000:.2f}s)")

print("\nDone! All phrases exported.")
