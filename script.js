// Praise Machine Button - JavaScript

// ============= CONFIGURATION =============
const phrases = [
    './assets/phrase1.mp3',
    './assets/phrase2.mp3',
    './assets/phrase3.mp3',
    './assets/phrase4.mp3'
];

// Translations
const translations = {
    checkedIn: {
        en: "Checked in today ✓",
        zh: "今日已打卡 ✓"
    },
    clickToCheckIn: {
        en: "Click to check in!",
        zh: "点击打卡！"
    },
    milestone: {
        day3: {
            en: "3 days! Keep going! 💪",
            zh: "3天！继续加油！💪"
        },
        day7: {
            en: "Week achieved! 🎉",
            zh: "一周达成！🎉"
        },
        day30: {
            en: "30 days! Incredible! 🏆",
            zh: "30天成就！🏆"
        }
    }
};

// ============= STATE =============
let lastPlayedIndex = -1;
let currentLanguage = localStorage.getItem('language') || 'en';
let streakCount = parseInt(localStorage.getItem('streakCount')) || 0;
let lastCheckInDate = localStorage.getItem('lastCheckInDate') || '';
let bestStreak = parseInt(localStorage.getItem('bestStreak')) || 0;
let checkedInToday = false;

// ============= DOM ELEMENTS =============
const button = document.querySelector('.praise-button');
const langSwitch = document.getElementById('langSwitch');
const tagline = document.querySelector('.tagline');
const streakText = document.querySelector('.streak-text');
const streakFire = document.querySelector('.streak-fire');
const streakStatus = document.getElementById('streakStatus');
const streakBest = document.getElementById('streakBest');

// ============= INITIALIZATION =============
function init() {
    // Check streak status
    checkStreakStatus();

    // Apply language
    applyLanguage(currentLanguage);

    // Update display
    updateStreakDisplay();

    // Setup event listeners
    button.addEventListener('click', handleClick);
    button.addEventListener('touchend', (e) => {
        e.preventDefault();
        handleClick();
    });
    langSwitch.addEventListener('click', toggleLanguage);

    console.log('Praise Machine initialized! 🎉');
}

// ============= STREAK SYSTEM =============
function checkStreakStatus() {
    const today = getTodayDateString();

    if (lastCheckInDate === today) {
        // Already checked in today
        checkedInToday = true;
    } else if (lastCheckInDate === '') {
        // First time user
        streakCount = 0;
    } else {
        // Check if yesterday
        const lastDate = new Date(lastCheckInDate);
        const todayDate = new Date(today);
        const diffTime = todayDate - lastDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            // Consecutive day - ready to check in
            checkedInToday = false;
        } else {
            // Skipped day(s) - reset streak
            streakCount = 0;
            lastCheckInDate = '';
            localStorage.setItem('streakCount', '0');
            localStorage.setItem('lastCheckInDate', '');
            checkedInToday = false;
        }
    }
}

function performCheckIn() {
    if (checkedInToday) return;

    // Increment streak
    streakCount++;
    const today = getTodayDateString();
    lastCheckInDate = today;
    checkedInToday = true;

    // Update best streak
    if (streakCount > bestStreak) {
        bestStreak = streakCount;
        localStorage.setItem('bestStreak', bestStreak.toString());
    }

    // Save to localStorage
    localStorage.setItem('streakCount', streakCount.toString());
    localStorage.setItem('lastCheckInDate', lastCheckInDate);

    // Update display
    updateStreakDisplay();

    // Check for milestones
    checkMilestone();
}

function checkMilestone() {
    if (streakCount === 3) {
        showMilestoneMessage(translations.milestone.day3[currentLanguage]);
        createConfetti(15);
    } else if (streakCount === 7) {
        showMilestoneMessage(translations.milestone.day7[currentLanguage]);
        createConfetti(20);
    } else if (streakCount === 30) {
        showMilestoneMessage(translations.milestone.day30[currentLanguage]);
        createConfetti(30, true); // Gold confetti
    }
}

function showMilestoneMessage(message) {
    // Create floating message
    const msgEl = document.createElement('div');
    msgEl.textContent = message;
    msgEl.style.cssText = `
        position: fixed;
        top: 30%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 28px;
        font-weight: bold;
        color: #FF6B6B;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
        z-index: 2000;
        animation: milestone-fade 2s ease-out forwards;
        pointer-events: none;
    `;

    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes milestone-fade {
            0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
            20% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
            80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(msgEl);
    setTimeout(() => msgEl.remove(), 2000);
}

function updateStreakDisplay() {
    // Update streak count
    const template = streakText.getAttribute(`data-${currentLanguage}-template`);
    streakText.textContent = template.replace('{count}', streakCount);

    // Update fire emoji
    if (streakCount === 0) {
        streakFire.textContent = '';
    } else if (streakCount <= 2) {
        streakFire.textContent = '🔥';
    } else if (streakCount <= 6) {
        streakFire.textContent = '🔥🔥';
    } else if (streakCount < 30) {
        streakFire.textContent = '🔥🔥🔥';
    } else {
        streakFire.textContent = '🏆';
    }

    // Update status
    if (checkedInToday) {
        streakStatus.textContent = translations.checkedIn[currentLanguage];
        streakStatus.classList.add('checked-in');
    } else {
        streakStatus.textContent = translations.clickToCheckIn[currentLanguage];
        streakStatus.classList.remove('checked-in');
    }

    // Update best record
    const bestTemplate = streakBest.getAttribute(`data-${currentLanguage}-template`);
    streakBest.textContent = bestTemplate.replace('{count}', bestStreak);
}

function getTodayDateString() {
    const today = new Date();
    return today.toISOString().split('T')[0]; // YYYY-MM-DD
}

// ============= CONFETTI ANIMATION =============
function createConfetti(count, isGold = false) {
    const confettiEmojis = isGold
        ? ['🎊', '✨', '🌟', '💫', '🏆']
        : ['🎊', '🎉', '✨', '🌟', '💫'];

    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti-particle';
            confetti.textContent = confettiEmojis[Math.floor(Math.random() * confettiEmojis.length)];

            // Random horizontal position
            const xPos = Math.random() * window.innerWidth;
            confetti.style.left = `${xPos}px`;

            // Random delay for stagger effect
            confetti.style.animationDelay = `${Math.random() * 0.5}s`;

            document.body.appendChild(confetti);

            // Remove after animation
            setTimeout(() => confetti.remove(), 3500);
        }, i * 50); // Stagger spawn
    }
}

// ============= LANGUAGE SWITCHING =============
function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'zh' : 'en';
    localStorage.setItem('language', currentLanguage);
    applyLanguage(currentLanguage);
    updateStreakDisplay();
}

function applyLanguage(lang) {
    // Update language switch button
    const langOptions = langSwitch.querySelectorAll('.lang-option');
    langOptions.forEach(option => {
        if ((lang === 'en' && option.textContent === 'EN') ||
            (lang === 'zh' && option.textContent === '中文')) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });

    // Update tagline
    tagline.textContent = tagline.getAttribute(`data-${lang}`);
}

// ============= BUTTON CLICK HANDLER =============
function handleClick() {
    // 1. Perform check-in (if not already)
    performCheckIn();

    // 2. Play random audio phrase
    playRandomPhrase();

    // 3. Create star burst
    createStarBurst();

    // 4. Trigger glow animation
    triggerAnimation();

    // 5. Trigger vibration (mobile)
    triggerVibration();
}

// ============= STAR BURST EFFECT =============
function createStarBurst() {
    const starCount = Math.floor(Math.random() * 4) + 5;
    const buttonRect = button.getBoundingClientRect();
    const centerX = buttonRect.left + buttonRect.width / 2;
    const centerY = buttonRect.top + buttonRect.height / 2;

    for (let i = 0; i < starCount; i++) {
        createStar(centerX, centerY);
    }
}

function createStar(centerX, centerY) {
    const star = document.createElement('div');
    star.className = 'star-particle';
    star.textContent = '⭐';

    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 50 + 50;
    const endX = Math.cos(angle) * distance;
    const endY = Math.sin(angle) * distance;

    star.style.setProperty('--end-x', `${endX}px`);
    star.style.setProperty('--end-y', `${endY}px`);
    star.style.left = `${centerX}px`;
    star.style.top = `${centerY}px`;

    document.body.appendChild(star);
    setTimeout(() => star.remove(), 1000);
}

// ============= AUDIO PLAYBACK =============
function playRandomPhrase() {
    try {
        let randomIndex;
        if (phrases.length === 1) {
            randomIndex = 0;
        } else {
            do {
                randomIndex = Math.floor(Math.random() * phrases.length);
            } while (randomIndex === lastPlayedIndex);
        }

        lastPlayedIndex = randomIndex;
        const audio = new Audio(phrases[randomIndex]);
        audio.play().catch(err => console.warn('Audio playback failed:', err.message));
    } catch (err) {
        console.warn('Audio error:', err.message);
    }
}

// ============= ANIMATIONS =============
function triggerAnimation() {
    button.classList.remove('glow');
    void button.offsetWidth;
    button.classList.add('glow');
    setTimeout(() => button.classList.remove('glow'), 600);
}

function triggerVibration() {
    if ('vibrate' in navigator) {
        try {
            navigator.vibrate(200);
        } catch (err) {
            console.warn('Vibration failed:', err.message);
        }
    }
}

// ============= START =============
init();
