// Praise Machine Button - JavaScript

// Array of encouragement phrases
const phrases = [
    './assets/phrase1.mp3', // "You did a great job!"
    './assets/phrase2.mp3', // "You are so amazing!"
    './assets/phrase3.mp3', // "So proud of you!"
    './assets/phrase4.mp3'  // "Wow you are a genius!"
];

// Get button element
const button = document.querySelector('.praise-button');

// Click handler function
function handleClick() {
    // 1. Play random audio phrase
    playRandomPhrase();

    // 2. Trigger glow/pulse animation
    triggerAnimation();

    // 3. Trigger vibration (mobile only)
    triggerVibration();
}

// Play random encouragement phrase
function playRandomPhrase() {
    try {
        // Select random phrase
        const randomIndex = Math.floor(Math.random() * phrases.length);
        const selectedPhrase = phrases[randomIndex];

        // Create new audio object for selected phrase
        const audio = new Audio(selectedPhrase);

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
console.log(`Loaded ${phrases.length} encouragement phrases!`);
