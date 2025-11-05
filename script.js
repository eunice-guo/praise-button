// Praise Machine Button - JavaScript

// Initialize audio
const audio = new Audio('./assets/audio.mp3');

// Preload audio for faster playback
audio.preload = 'auto';

// Get button element
const button = document.querySelector('.praise-button');

// Handle audio loading errors
audio.addEventListener('error', (e) => {
    console.warn('Audio file not found or failed to load. Please add audio.mp3 to the assets folder.');
    console.warn('Download a free ding sound from: https://pixabay.com/sound-effects/search/ding/');
});

// Click handler function
function handleClick() {
    // 1. Play audio
    playAudio();

    // 2. Trigger glow/pulse animation
    triggerAnimation();

    // 3. Trigger vibration (mobile only)
    triggerVibration();
}

// Play audio with reset for rapid clicks
function playAudio() {
    try {
        // Reset audio to beginning for rapid replay support
        audio.currentTime = 0;

        // Play audio
        audio.play().catch(err => {
            console.warn('Audio playback failed:', err.message);
            console.warn('User interaction may be required before audio can play.');
        });
    } catch (err) {
        console.warn('Audio error:', err.message);
    }
}

// Trigger glow/pulse animation
function triggerAnimation() {
    // Remove class if it exists (for rapid clicks)
    button.classList.remove('glow');

    // Force reflow to restart animation
    void button.offsetWidth;

    // Add glow class
    button.classList.add('glow');

    // Remove class after animation completes
    setTimeout(() => {
        button.classList.remove('glow');
    }, 600); // Match animation duration in CSS
}

// Trigger vibration (mobile only)
function triggerVibration() {
    // Check if Vibration API is supported
    if ('vibrate' in navigator) {
        try {
            // Vibrate for 200ms
            navigator.vibrate(200);
        } catch (err) {
            console.warn('Vibration failed:', err.message);
        }
    }
}

// Add click event listener
button.addEventListener('click', handleClick);

// Optional: Add touch event for better mobile responsiveness
button.addEventListener('touchend', (e) => {
    e.preventDefault(); // Prevent double-firing with click event
    handleClick();
});

// Log ready state
console.log('Praise Machine Button initialized! 🎉');
console.log('Click the button for encouragement!');
