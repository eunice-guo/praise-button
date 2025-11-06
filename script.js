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
    },
    monthNames: {
        en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        zh: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
    },
    emptyGratitude: {
        en: "No gratitude entries yet. Start by writing what you're grateful for today!",
        zh: "还没有感恩记录。开始写下今天你感恩的事情吧！"
    },
    emptyFirelog: {
        en: "No achievements recorded yet. Share what you're proud of today!",
        zh: "还没有成就记录。分享今天让你骄傲的事情！"
    }
};

// ============= STATE =============
let lastPlayedIndex = -1;
let currentLanguage = localStorage.getItem('language') || 'en';
let streakCount = parseInt(localStorage.getItem('streakCount')) || 0;
let lastCheckInDate = localStorage.getItem('lastCheckInDate') || '';
let bestStreak = parseInt(localStorage.getItem('bestStreak')) || 0;
let checkedInToday = false;
let currentCalendarMonth = new Date().getMonth();
let currentCalendarYear = new Date().getFullYear();

// Check-in history (stored as array of date strings)
let checkInHistory = JSON.parse(localStorage.getItem('checkInHistory')) || [];

// Gratitude entries
let gratitudeEntries = JSON.parse(localStorage.getItem('gratitudeEntries')) || [];

// Fire log entries
let firelogEntries = JSON.parse(localStorage.getItem('firelogEntries')) || [];

// ============= DOM ELEMENTS =============
const button = document.querySelector('.praise-button');
const langSwitch = document.getElementById('langSwitch');
const tagline = document.querySelector('.tagline');
const streakText = document.querySelector('.streak-text');
const streakFire = document.querySelector('.streak-fire');
const streakStatus = document.getElementById('streakStatus');
const bestRecord = document.getElementById('bestRecord');

// Tab elements
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// Calendar elements
const calendarTitle = document.getElementById('calendarTitle');
const calendarGrid = document.getElementById('calendarGrid');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');

// Gratitude diary elements
const gratitudeInput = document.getElementById('gratitudeInput');
const saveGratitudeBtn = document.getElementById('saveGratitude');
const cancelGratitudeBtn = document.getElementById('cancelGratitude');
const gratitudeEntriesContainer = document.getElementById('gratitudeEntries');

// Fire log elements
const firelogInput = document.getElementById('firelogInput');
const saveFirelogBtn = document.getElementById('saveFirelog');
const cancelFirelogBtn = document.getElementById('cancelFirelog');
const firelogEntriesContainer = document.getElementById('firelogEntries');

// ============= INITIALIZATION =============
function init() {
    // Check streak status
    checkStreakStatus();

    // Apply language
    applyLanguage(currentLanguage);

    // Update display
    updateStreakDisplay();

    // Setup event listeners - Button tab
    button.addEventListener('click', handleClick);
    button.addEventListener('touchend', (e) => {
        e.preventDefault();
        handleClick();
    });
    langSwitch.addEventListener('click', toggleLanguage);

    // Setup event listeners - Tabs
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // Setup event listeners - Calendar
    prevMonthBtn.addEventListener('click', () => changeMonth(-1));
    nextMonthBtn.addEventListener('click', () => changeMonth(1));

    // Setup event listeners - Gratitude diary
    saveGratitudeBtn.addEventListener('click', saveGratitudeEntry);
    cancelGratitudeBtn.addEventListener('click', () => gratitudeInput.value = '');

    // Setup event listeners - Fire log
    saveFirelogBtn.addEventListener('click', saveFirelogEntry);
    cancelFirelogBtn.addEventListener('click', () => firelogInput.value = '');

    // Initialize calendar
    renderCalendar();

    // Initialize diary entries
    renderGratitudeEntries();
    renderFirelogEntries();

    console.log('Praise Machine initialized! 🎉');
}

// ============= TAB SWITCHING =============
function switchTab(tabName) {
    // Update tab buttons
    tabButtons.forEach(btn => {
        if (btn.dataset.tab === tabName) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Update tab content
    tabContents.forEach(content => {
        if (content.id === `${tabName}-tab`) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });

    // If switching to calendar, re-render it
    if (tabName === 'calendar') {
        renderCalendar();
    }
}

// ============= CALENDAR FUNCTIONS =============
function changeMonth(delta) {
    currentCalendarMonth += delta;

    if (currentCalendarMonth < 0) {
        currentCalendarMonth = 11;
        currentCalendarYear--;
    } else if (currentCalendarMonth > 11) {
        currentCalendarMonth = 0;
        currentCalendarYear++;
    }

    renderCalendar();
}

function renderCalendar() {
    // Update title
    const monthName = translations.monthNames[currentLanguage][currentCalendarMonth];
    calendarTitle.textContent = `${monthName} ${currentCalendarYear}`;

    // Clear grid
    calendarGrid.innerHTML = '';

    // Get first day of month and total days
    const firstDay = new Date(currentCalendarYear, currentCalendarMonth, 1).getDay();
    const daysInMonth = new Date(currentCalendarYear, currentCalendarMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentCalendarYear, currentCalendarMonth, 0).getDate();

    const today = new Date();
    const todayStr = getTodayDateString();

    // Add previous month's trailing days
    for (let i = firstDay - 1; i >= 0; i--) {
        const dayNum = daysInPrevMonth - i;
        const dayEl = createCalendarDay(dayNum, true, null);
        calendarGrid.appendChild(dayEl);
    }

    // Add current month's days
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${currentCalendarYear}-${String(currentCalendarMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const isToday = dateStr === todayStr;
        const isCheckedIn = checkInHistory.includes(dateStr);
        const dayEl = createCalendarDay(day, false, dateStr, isToday, isCheckedIn);
        calendarGrid.appendChild(dayEl);
    }

    // Add next month's leading days to complete the grid
    const totalCells = calendarGrid.children.length;
    const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
    for (let i = 1; i <= remainingCells; i++) {
        const dayEl = createCalendarDay(i, true, null);
        calendarGrid.appendChild(dayEl);
    }
}

function createCalendarDay(dayNum, isOtherMonth, dateStr, isToday = false, isCheckedIn = false) {
    const dayEl = document.createElement('div');
    dayEl.className = 'calendar-day';

    if (isOtherMonth) {
        dayEl.classList.add('other-month');
    }
    if (isToday) {
        dayEl.classList.add('today');
    }
    if (isCheckedIn) {
        dayEl.classList.add('checked-in');
    }

    const numberEl = document.createElement('div');
    numberEl.className = 'day-number';
    numberEl.textContent = dayNum;
    dayEl.appendChild(numberEl);

    if (isCheckedIn && !isOtherMonth) {
        const fireEl = document.createElement('div');
        fireEl.className = 'day-fire';
        fireEl.textContent = '🔥';
        dayEl.appendChild(fireEl);
    }

    return dayEl;
}

// ============= GRATITUDE DIARY =============
function saveGratitudeEntry() {
    const text = gratitudeInput.value.trim();
    if (!text) return;

    const entry = {
        id: Date.now(),
        date: new Date().toISOString(),
        text: text
    };

    gratitudeEntries.unshift(entry); // Add to beginning
    localStorage.setItem('gratitudeEntries', JSON.stringify(gratitudeEntries));

    gratitudeInput.value = '';
    renderGratitudeEntries();
}

function renderGratitudeEntries() {
    if (gratitudeEntries.length === 0) {
        gratitudeEntriesContainer.innerHTML = `
            <div class="empty-state">
                ${translations.emptyGratitude[currentLanguage]}
            </div>
        `;
        return;
    }

    gratitudeEntriesContainer.innerHTML = '';

    gratitudeEntries.forEach(entry => {
        const card = createEntryCard(entry, 'gratitude');
        gratitudeEntriesContainer.appendChild(card);
    });
}

function deleteGratitudeEntry(id) {
    gratitudeEntries = gratitudeEntries.filter(e => e.id !== id);
    localStorage.setItem('gratitudeEntries', JSON.stringify(gratitudeEntries));
    renderGratitudeEntries();
}

// ============= FIRE LOG =============
function saveFirelogEntry() {
    const text = firelogInput.value.trim();
    if (!text) return;

    const entry = {
        id: Date.now(),
        date: new Date().toISOString(),
        text: text
    };

    firelogEntries.unshift(entry); // Add to beginning
    localStorage.setItem('firelogEntries', JSON.stringify(firelogEntries));

    firelogInput.value = '';
    renderFirelogEntries();
}

function renderFirelogEntries() {
    if (firelogEntries.length === 0) {
        firelogEntriesContainer.innerHTML = `
            <div class="empty-state">
                ${translations.emptyFirelog[currentLanguage]}
            </div>
        `;
        return;
    }

    firelogEntriesContainer.innerHTML = '';

    firelogEntries.forEach(entry => {
        const card = createEntryCard(entry, 'firelog');
        firelogEntriesContainer.appendChild(card);
    });
}

function deleteFirelogEntry(id) {
    firelogEntries = firelogEntries.filter(e => e.id !== id);
    localStorage.setItem('firelogEntries', JSON.stringify(firelogEntries));
    renderFirelogEntries();
}

// ============= SHARED ENTRY CARD =============
function createEntryCard(entry, type) {
    const card = document.createElement('div');
    card.className = 'entry-card';

    const date = new Date(entry.date);
    const dateStr = formatDate(date);

    card.innerHTML = `
        <div class="entry-date">📅 ${dateStr}</div>
        <div class="entry-text">${escapeHtml(entry.text)}</div>
        <div class="entry-actions">
            <button class="entry-action-btn delete" data-id="${entry.id}" data-type="${type}">
                ${currentLanguage === 'en' ? 'Delete' : '删除'}
            </button>
        </div>
    `;

    // Add delete listener
    const deleteBtn = card.querySelector('.entry-action-btn.delete');
    deleteBtn.addEventListener('click', () => {
        if (type === 'gratitude') {
            deleteGratitudeEntry(entry.id);
        } else {
            deleteFirelogEntry(entry.id);
        }
    });

    return card;
}

function formatDate(date) {
    if (currentLanguage === 'en') {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    } else {
        return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
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

    // Add to check-in history
    if (!checkInHistory.includes(today)) {
        checkInHistory.push(today);
        localStorage.setItem('checkInHistory', JSON.stringify(checkInHistory));
    }

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

    // Update fire emoji - ONE fire per day
    if (streakCount === 0) {
        streakFire.textContent = '';
    } else {
        streakFire.textContent = '🔥';
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
    const bestTemplate = bestRecord.getAttribute(`data-${currentLanguage}-template`);
    bestRecord.textContent = bestTemplate.replace('{count}', bestStreak);
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

    // Re-render calendar and diaries with new language
    renderCalendar();
    renderGratitudeEntries();
    renderFirelogEntries();

    // Update tab buttons
    updateTabLanguage();

    // Update weekday labels
    updateWeekdayLabels();
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

    // Update all elements with data-en/data-zh attributes
    document.querySelectorAll('[data-en]').forEach(el => {
        const text = el.getAttribute(`data-${lang}`);
        if (text && !el.classList.contains('tab-btn')) {
            el.textContent = text;
        }
    });

    // Update placeholders
    document.querySelectorAll('[data-placeholder-en]').forEach(el => {
        el.placeholder = el.getAttribute(`data-placeholder-${lang}`);
    });
}

function updateTabLanguage() {
    tabButtons.forEach(btn => {
        const text = btn.getAttribute(`data-${currentLanguage}`);
        if (text) {
            btn.textContent = text;
        }
    });
}

function updateWeekdayLabels() {
    const weekdayDivs = document.querySelectorAll('.calendar-weekdays > div');
    weekdayDivs.forEach(div => {
        const text = div.getAttribute(`data-${currentLanguage}`);
        if (text) {
            div.textContent = text;
        }
    });
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
