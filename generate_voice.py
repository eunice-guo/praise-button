# -*- coding: utf-8 -*-
import asyncio
import edge_tts

# Phrases to generate
phrases = [
    ("You did a great job!", "phrase1.mp3"),
    ("You are so amazing!", "phrase2.mp3"),
    ("So proud of you!", "phrase3.mp3"),
    ("Wow, you are a genius!", "phrase4.mp3")
]

# Voice: AvaNeural - Clear, professional, warm
# Rate: +10% (natural speaking pace, aligned with user's voice)
# Pitch: +3Hz (subtle warmth)
VOICE = "en-US-AvaNeural"
RATE = "+10%"
PITCH = "+3Hz"

async def generate_phrase(text, filename):
    communicate = edge_tts.Communicate(
        text,
        VOICE,
        rate=RATE,
        pitch=PITCH
    )
    await communicate.save(f"assets/{filename}")
    print(f"Generated: {filename} - '{text}'")

async def main():
    print("Generating encouragement phrases at natural pace...")
    print(f"Voice: {VOICE} (clear, professional, warm)")
    print(f"Rate: {RATE} (natural speaking speed), Pitch: {PITCH}\n")

    tasks = [generate_phrase(text, filename) for text, filename in phrases]
    await asyncio.gather(*tasks)

    print("\nAll phrases generated successfully!")

if __name__ == "__main__":
    asyncio.run(main())
