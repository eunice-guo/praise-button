# Praise Machine Button 夸夸机器按钮

A simple, encouraging web button with glassmorphism design, sound effects, and haptic feedback.

## Features

✅ Beautiful glassmorphism button design
✅ Warm gradient background (peach → pink → orange)
✅ Click triggers:
  - Encouraging sound effect
  - Glow/pulse animation
  - Vibration feedback (mobile only)
✅ Fully responsive (mobile + desktop)
✅ No frameworks required (vanilla HTML/CSS/JS)

## Setup Instructions

### 1. Get the Audio File

**Option A: Download from Pixabay (Recommended)**
1. Visit: https://pixabay.com/sound-effects/search/ding/
2. Search for a cheerful "ding" or "notification" sound
3. Download as MP3 (choose sounds under 500KB)
4. Rename to `audio.mp3`
5. Place in the `assets/` folder

**Option B: Download from Freesound**
1. Visit: https://freesound.org/
2. Search: "ding encouragement" or "success chime"
3. Download free MP3
4. Rename to `audio.mp3`
5. Place in the `assets/` folder

**Option C: Use your own audio**
- Any MP3 file works
- Recommended: <500KB, 1-2 seconds duration
- Place as `assets/audio.mp3`

### 2. Test Locally

Simply open `index.html` in a web browser:
- Double-click `index.html`, or
- Right-click → "Open with" → Browser

### 3. Deploy Online

**Netlify (Easiest):**
1. Create account at https://netlify.com
2. Drag the entire `praise-button` folder into Netlify
3. Get your live URL

**Vercel:**
1. Create account at https://vercel.com
2. Install Vercel CLI: `npm install -g vercel`
3. In project folder: `vercel`
4. Follow prompts

## File Structure

```
praise-button/
├── index.html          # Main HTML structure
├── style.css           # Styling and animations
├── script.js           # Button functionality
├── README.md           # This file
└── assets/
    └── audio.mp3       # Sound effect (you need to add this)
```

## Browser Compatibility

- ✅ Chrome (latest 2 versions)
- ✅ Safari (latest 2 versions)
- ✅ Firefox (latest 2 versions)
- ✅ iOS Safari (mobile)
- ✅ Android Chrome (mobile)

## Technical Details

- **Audio**: MP3 format, plays on each click
- **Animation**: CSS glow/pulse effect (600ms)
- **Vibration**: 200ms (mobile only, uses Vibration API)
- **Responsive**: 320px - 1920px screen width

## Troubleshooting

**Audio not playing?**
- Ensure `audio.mp3` exists in `assets/` folder
- Check browser console for errors
- Some browsers require user interaction before playing audio

**Button not visible?**
- Check if CSS file is loaded
- Try a different browser

**No vibration on mobile?**
- Only works on mobile devices
- Some browsers/devices don't support Vibration API

## Next Steps (Future Versions)

- [ ] Check-in/tracking functionality
- [ ] Daily streak counter
- [ ] Multiple encouragement sounds
- [ ] Customizable themes

## License

Free to use and modify for personal projects!

---

Made with ❤️ for self-encouragement
