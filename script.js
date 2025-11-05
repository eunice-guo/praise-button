// Praise Machine Button - JavaScript

// Array of encouragement phrases
const phrases = [
    './assets/phrase1.mp3', // "You did a great job!"
    './assets/phrase2.mp3', // "You are so amazing!"
    './assets/phrase3.mp3', // "So proud of you!"
    './assets/phrase4.mp3'  // "Wow you are a genius!"
];

// Track last played phrase to avoid repetition
let lastPlayedIndex = -1;

// Get button element
const button = document.querySelector('.praise-button');

// Click handler function
function handleClick() {
    // 1. Play random audio phrase (different from last)
    playRandomPhrase();

    // 2. Trigger star particles burst
    createStarBurst();

    // 3. Trigger glow/pulse animation
    triggerAnimation();

    // 4. Trigger vibration (mobile only)
    triggerVibration();
}

// Create star particles burst effect
function createStarBurst() {
    // Number of stars to create (5-8)
    const starCount = Math.floor(Math.random() * 4) + 5; // Random between 5-8

    // Get button position and center point
    const buttonRect = button.getBoundingClientRect();
    const centerX = buttonRect.left + buttonRect.width / 2;
    const centerY = buttonRect.top + buttonRect.height / 2;

    for (let i = 0; i < starCount; i++) {
        createStar(centerX, centerY);
    }
}

// Create individual star particle
function createStar(centerX, centerY) {
    const star = document.createElement('div');
    star.className = 'star-particle';
    star.textContent = '⭐';

    // Random angle for spread (0-360 degrees)
    const angle = Math.random() * Math.PI * 2;

    // Random distance (50-100px)
    const distance = Math.random() * 50 + 50;

    // Calculate end position
    const endX = Math.cos(angle) * distance;
    const endY = Math.sin(angle) * distance;

    // Set CSS custom properties for animation
    star.style.setProperty('--end-x', `${endX}px`);
    star.style.setProperty('--end-y', `${endY}px`);

    // Position star at button center (relative to viewport)
    star.style.left = `${centerX}px`;
    star.style.top = `${centerY}px`;

    // Add to page
    document.body.appendChild(star);

    // Remove star after animation completes (1 second)
    setTimeout(() => {
        star.remove();
    }, 1000);
}

// Play random encouragement phrase (no repeats)
function playRandomPhrase() {
    try {
        let randomIndex;

        // If there's only one phrase, just play it
        if (phrases.length === 1) {
            randomIndex = 0;
        } else {
            // Keep selecting until we get a different phrase
            do {
                randomIndex = Math.floor(Math.random() * phrases.length);
            } while (randomIndex === lastPlayedIndex);
        }

        // Update last played index
        lastPlayedIndex = randomIndex;

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
console.log(`Loaded ${phrases.length} encouragement phrases (no repeats)!`);
