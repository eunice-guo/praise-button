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
    noFriends: {
        en: "No friends yet. Add friends to see their streaks!",
        zh: "还没有好友。添加好友查看他们的打卡记录！"
    },
    friendAdded: {
        en: "Friend added successfully!",
        zh: "好友添加成功！"
    },
    friendRemoved: {
        en: "Friend removed.",
        zh: "好友已删除。"
    },
    loginSuccess: {
        en: "Login successful!",
        zh: "登录成功！"
    },
    signupSuccess: {
        en: "Account created successfully!",
        zh: "账户创建成功！"
    },
    logoutSuccess: {
        en: "Logged out successfully!",
        zh: "登出成功！"
    },
    errorEmptyFields: {
        en: "Please fill in all fields.",
        zh: "请填写所有字段。"
    },
    errorUserExists: {
        en: "Username already exists.",
        zh: "用户名已存在。"
    },
    errorInvalidLogin: {
        en: "Invalid username or password.",
        zh: "用户名或密码错误。"
    }
};

// ============= STATE =============
let lastPlayedIndex = -1;
let currentLanguage = localStorage.getItem('language') || 'en';
let userTimezone = localStorage.getItem('timezone') || Intl.DateTimeFormat().resolvedOptions().timeZone;
let streakCount = parseInt(localStorage.getItem('streakCount')) || 0;
let lastCheckInDate = localStorage.getItem('lastCheckInDate') || '';
let bestStreak = parseInt(localStorage.getItem('bestStreak')) || 0;
let checkedInToday = false;
// Initialize calendar to current month/year in local timezone
const now = new Date();
let currentCalendarMonth = now.getMonth();
let currentCalendarYear = now.getFullYear();

// Check-in history (stored as array of date strings)
let checkInHistory = JSON.parse(localStorage.getItem('checkInHistory')) || [];

// Authentication state
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let allUsers = JSON.parse(localStorage.getItem('allUsers')) || [];

// Friends list (stored per user)
let friends = [];

// ============= DOM ELEMENTS =============
const button = document.querySelector('.praise-button');
const langSwitch = document.getElementById('langSwitch');
const timezoneSelect = document.getElementById('timezoneSelect');
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

// Friends elements
const friendUsernameInput = document.getElementById('friendUsernameInput');
const addFriendBtn = document.getElementById('addFriendBtn');
const friendsList = document.getElementById('friendsList');

// Auth elements
const authSection = document.getElementById('authSection');
const profileSection = document.getElementById('profileSection');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const showSignupLink = document.getElementById('showSignup');
const showLoginLink = document.getElementById('showLogin');

// Login form
const loginUsername = document.getElementById('loginUsername');
const loginPassword = document.getElementById('loginPassword');
const loginBtn = document.getElementById('loginBtn');

// Signup form
const signupUsername = document.getElementById('signupUsername');
const signupEmail = document.getElementById('signupEmail');
const signupPassword = document.getElementById('signupPassword');
const signupBtn = document.getElementById('signupBtn');

// Profile elements
const profileUsername = document.getElementById('profileUsername');
const profileEmail = document.getElementById('profileEmail');
const profileStreak = document.getElementById('profileStreak');
const profileBestStreak = document.getElementById('profileBestStreak');
const logoutBtn = document.getElementById('logoutBtn');

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
    
    // Setup timezone selector
    if (timezoneSelect) {
        // Set saved timezone or detect
        const savedTimezone = localStorage.getItem('timezone');
        if (savedTimezone) {
            timezoneSelect.value = savedTimezone;
        } else {
            // Try to detect EST
            const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
            if (tz.includes('New_York') || tz.includes('Eastern')) {
                timezoneSelect.value = 'America/New_York';
            } else {
                timezoneSelect.value = 'auto';
            }
        }
        timezoneSelect.addEventListener('change', handleTimezoneChange);
    }

    // Setup event listeners - Tabs
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // Setup event listeners - Calendar
    prevMonthBtn.addEventListener('click', () => changeMonth(-1));
    nextMonthBtn.addEventListener('click', () => changeMonth(1));

    // Setup event listeners - Friends
    addFriendBtn.addEventListener('click', addFriend);
    friendUsernameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addFriend();
    });

    // Setup event listeners - Auth
    showSignupLink.addEventListener('click', (e) => {
        e.preventDefault();
        toggleAuthForms('signup');
    });
    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        toggleAuthForms('login');
    });
    loginBtn.addEventListener('click', handleLogin);
    signupBtn.addEventListener('click', handleSignup);
    logoutBtn.addEventListener('click', handleLogout);

    // Add enter key support for login
    loginPassword.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleLogin();
    });

    // Add enter key support for signup
    signupPassword.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSignup();
    });

    // Initialize calendar
    renderCalendar();

    // Initialize weekday labels with spans (only once)
    const weekdayDivs = document.querySelectorAll('.calendar-weekdays > div');
    weekdayDivs.forEach(div => {
        const text = div.getAttribute(`data-${currentLanguage}`);
        if (text) {
            let textSpan = div.querySelector('span');
            if (textSpan) {
                textSpan.textContent = text;
            }
        }
    });

    // Initialize tab buttons with spans
    updateTabLanguage();

    // Initialize auth state
    updateAuthUI();

    // Load friends if logged in
    if (currentUser) {
        loadFriends();
        renderFriends();
    }

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
    // Refresh check-in history from localStorage to ensure we have the latest data
    checkInHistory = JSON.parse(localStorage.getItem('checkInHistory')) || [];

    // Update title
    const monthName = translations.monthNames[currentLanguage][currentCalendarMonth];
    calendarTitle.textContent = `${monthName} ${currentCalendarYear}`;

    // Clear grid
    calendarGrid.innerHTML = '';

    // Get first day of month and total days (using local timezone)
    const firstDay = new Date(currentCalendarYear, currentCalendarMonth, 1).getDay();
    const daysInMonth = new Date(currentCalendarYear, currentCalendarMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentCalendarYear, currentCalendarMonth, 0).getDate();

    // Get today's date in local timezone
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
        const dateStr = getDateInTimezone(currentCalendarYear, currentCalendarMonth, day);
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

    // Create a wrapper for day number to ensure it stays in place
    const numberWrapper = document.createElement('div');
    numberWrapper.className = 'day-number-wrapper';
    
    const numberEl = document.createElement('div');
    numberEl.className = 'day-number';
    numberEl.textContent = dayNum;
    numberWrapper.appendChild(numberEl);
    dayEl.appendChild(numberWrapper);

    if (isCheckedIn && !isOtherMonth) {
        const fireEl = document.createElement('div');
        fireEl.className = 'day-fire';
        fireEl.textContent = '🔥';
        dayEl.appendChild(fireEl);
    }

    return dayEl;
}

// ============= AUTHENTICATION =============
function toggleAuthForms(form) {
    if (form === 'signup') {
        loginForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
    } else {
        signupForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    }
}

function handleLogin() {
    const username = loginUsername.value.trim();
    const password = loginPassword.value.trim();

    if (!username || !password) {
        alert(translations.errorEmptyFields[currentLanguage]);
        return;
    }

    // Find user
    const user = allUsers.find(u => u.username === username && u.password === password);

    if (!user) {
        alert(translations.errorInvalidLogin[currentLanguage]);
        return;
    }

    // Login successful
    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    // Load user's data
    streakCount = currentUser.streakCount || 0;
    bestStreak = currentUser.bestStreak || 0;
    lastCheckInDate = currentUser.lastCheckInDate || '';
    checkInHistory = currentUser.checkInHistory || [];

    // Update localStorage with user data
    localStorage.setItem('streakCount', streakCount.toString());
    localStorage.setItem('bestStreak', bestStreak.toString());
    localStorage.setItem('lastCheckInDate', lastCheckInDate);
    localStorage.setItem('checkInHistory', JSON.stringify(checkInHistory));

    // Update UI
    checkStreakStatus();
    updateStreakDisplay();
    updateAuthUI();
    loadFriends();
    renderFriends();
    renderCalendar();

    // Clear form
    loginUsername.value = '';
    loginPassword.value = '';

    alert(translations.loginSuccess[currentLanguage]);
}

function handleSignup() {
    const username = signupUsername.value.trim();
    const email = signupEmail.value.trim();
    const password = signupPassword.value.trim();

    if (!username || !email || !password) {
        alert(translations.errorEmptyFields[currentLanguage]);
        return;
    }

    // Check if username exists
    if (allUsers.find(u => u.username === username)) {
        alert(translations.errorUserExists[currentLanguage]);
        return;
    }

    // Create new user
    const newUser = {
        username: username,
        email: email,
        password: password,
        streakCount: 0,
        bestStreak: 0,
        lastCheckInDate: '',
        checkInHistory: [],
        friends: []
    };

    allUsers.push(newUser);
    localStorage.setItem('allUsers', JSON.stringify(allUsers));

    // Auto login
    currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    // Reset streak data to new user's data
    streakCount = 0;
    bestStreak = 0;
    lastCheckInDate = '';
    checkInHistory = [];
    localStorage.setItem('streakCount', '0');
    localStorage.setItem('bestStreak', '0');
    localStorage.setItem('lastCheckInDate', '');
    localStorage.setItem('checkInHistory', JSON.stringify([]));

    // Update UI
    updateStreakDisplay();
    updateAuthUI();
    loadFriends();
    renderFriends();
    renderCalendar();

    // Clear form
    signupUsername.value = '';
    signupEmail.value = '';
    signupPassword.value = '';

    alert(translations.signupSuccess[currentLanguage]);
}

function handleLogout() {
    if (!confirm(currentLanguage === 'en' ? 'Are you sure you want to logout?' : '确定要登出吗？')) {
        return;
    }

    // Save current user data before logout
    if (currentUser) {
        currentUser.streakCount = streakCount;
        currentUser.bestStreak = bestStreak;
        currentUser.lastCheckInDate = lastCheckInDate;
        currentUser.checkInHistory = checkInHistory;
        currentUser.friends = friends;

        // Update user in allUsers array
        const userIndex = allUsers.findIndex(u => u.username === currentUser.username);
        if (userIndex !== -1) {
            allUsers[userIndex] = currentUser;
            localStorage.setItem('allUsers', JSON.stringify(allUsers));
        }
    }

    // Clear current user
    currentUser = null;
    localStorage.removeItem('currentUser');

    // Reset to guest mode
    streakCount = parseInt(localStorage.getItem('guestStreakCount')) || 0;
    bestStreak = parseInt(localStorage.getItem('guestBestStreak')) || 0;
    lastCheckInDate = localStorage.getItem('guestLastCheckInDate') || '';
    checkInHistory = JSON.parse(localStorage.getItem('guestCheckInHistory')) || [];
    friends = [];

    // Update localStorage
    localStorage.setItem('streakCount', streakCount.toString());
    localStorage.setItem('bestStreak', bestStreak.toString());
    localStorage.setItem('lastCheckInDate', lastCheckInDate);
    localStorage.setItem('checkInHistory', JSON.stringify(checkInHistory));

    // Update UI
    checkStreakStatus();
    updateStreakDisplay();
    updateAuthUI();
    renderFriends();
    renderCalendar();

    alert(translations.logoutSuccess[currentLanguage]);
}

function updateAuthUI() {
    if (currentUser) {
        // Show profile, hide auth forms
        authSection.classList.add('hidden');
        profileSection.classList.remove('hidden');

        // Update profile info
        profileUsername.textContent = currentUser.username;
        profileEmail.textContent = currentUser.email;

        const streakTemplate = profileStreak.getAttribute(`data-${currentLanguage}-template`) || '{count} days';
        const bestTemplate = profileBestStreak.getAttribute(`data-${currentLanguage}-template`) || '{count} days';

        profileStreak.textContent = streakTemplate.replace('{count}', streakCount);
        profileBestStreak.textContent = bestTemplate.replace('{count}', bestStreak);
    } else {
        // Show auth forms, hide profile
        authSection.classList.remove('hidden');
        profileSection.classList.add('hidden');

        // Show login form by default
        loginForm.classList.remove('hidden');
        signupForm.classList.add('hidden');
    }
}

// ============= FRIENDS MANAGEMENT =============
function loadFriends() {
    if (currentUser) {
        friends = currentUser.friends || [];
    } else {
        friends = [];
    }
}

function addFriend() {
    const friendUsername = friendUsernameInput.value.trim();

    if (!friendUsername) {
        alert(translations.errorEmptyFields[currentLanguage]);
        return;
    }

    if (!currentUser) {
        alert(currentLanguage === 'en' ? 'Please login to add friends.' : '请先登录以添加好友。');
        return;
    }

    if (friendUsername === currentUser.username) {
        alert(currentLanguage === 'en' ? 'You cannot add yourself as a friend.' : '不能添加自己为好友。');
        return;
    }

    // Check if friend exists
    const friendUser = allUsers.find(u => u.username === friendUsername);
    if (!friendUser) {
        alert(currentLanguage === 'en' ? 'User not found.' : '用户不存在。');
        return;
    }

    // Check if already friends
    if (friends.find(f => f.username === friendUsername)) {
        alert(currentLanguage === 'en' ? 'Already friends!' : '已经是好友了！');
        return;
    }

    // Add friend
    friends.push({
        username: friendUser.username,
        streakCount: friendUser.streakCount || 0,
        bestStreak: friendUser.bestStreak || 0
    });

    // Save to current user and localStorage
    currentUser.friends = friends;
    const userIndex = allUsers.findIndex(u => u.username === currentUser.username);
    if (userIndex !== -1) {
        allUsers[userIndex] = currentUser;
        localStorage.setItem('allUsers', JSON.stringify(allUsers));
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }

    friendUsernameInput.value = '';
    renderFriends();
    alert(translations.friendAdded[currentLanguage]);
}

function removeFriend(friendUsername) {
    if (!confirm(currentLanguage === 'en' ? `Remove ${friendUsername}?` : `删除好友 ${friendUsername}？`)) {
        return;
    }

    friends = friends.filter(f => f.username !== friendUsername);

    // Save to current user and localStorage
    if (currentUser) {
        currentUser.friends = friends;
        const userIndex = allUsers.findIndex(u => u.username === currentUser.username);
        if (userIndex !== -1) {
            allUsers[userIndex] = currentUser;
            localStorage.setItem('allUsers', JSON.stringify(allUsers));
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        }
    }

    renderFriends();
    alert(translations.friendRemoved[currentLanguage]);
}

function renderFriends() {
    if (!currentUser || friends.length === 0) {
        friendsList.innerHTML = `
            <div class="empty-state">
                ${translations.noFriends[currentLanguage]}
            </div>
        `;
        return;
    }

    friendsList.innerHTML = '';

    friends.forEach(friend => {
        const friendCard = document.createElement('div');
        friendCard.className = 'friend-card';

        const streakText = currentLanguage === 'en'
            ? `${friend.streakCount} day streak 🔥`
            : `连续 ${friend.streakCount} 天 🔥`;
        const bestText = currentLanguage === 'en'
            ? `Best: ${friend.bestStreak}`
            : `最佳: ${friend.bestStreak}`;

        friendCard.innerHTML = `
            <div class="friend-info">
                <div class="friend-name">${friend.username}</div>
                <div class="friend-streak">${streakText} • ${bestText}</div>
            </div>
            <div class="friend-actions">
                <button class="friend-action-btn remove" data-username="${friend.username}">
                    ${currentLanguage === 'en' ? 'Remove' : '删除'}
                </button>
            </div>
        `;

        // Add remove listener
        const removeBtn = friendCard.querySelector('.friend-action-btn.remove');
        removeBtn.addEventListener('click', () => removeFriend(friend.username));

        friendsList.appendChild(friendCard);
    });
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

    // Re-render calendar if calendar tab is active
    const calendarTab = document.getElementById('calendar-tab');
    if (calendarTab && calendarTab.classList.contains('active')) {
        renderCalendar();
    }

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
    // Update streak count - ensure text is wrapped
    const template = streakText.getAttribute(`data-${currentLanguage}-template`);
    streakText.textContent = template.replace('{count}', streakCount);

    // Update fire emoji - ONE fire per day
    if (streakCount === 0) {
        streakFire.textContent = '';
    } else {
        streakFire.textContent = '🔥';
    }

    // Update status - ensure text is wrapped
    if (checkedInToday) {
        streakStatus.textContent = translations.checkedIn[currentLanguage];
        streakStatus.classList.add('checked-in');
    } else {
        streakStatus.textContent = translations.clickToCheckIn[currentLanguage];
        streakStatus.classList.remove('checked-in');
    }

    // Update best record - ensure text is wrapped
    const bestTemplate = bestRecord.getAttribute(`data-${currentLanguage}-template`);
    bestRecord.textContent = bestTemplate.replace('{count}', bestStreak);
}

function getTodayDateString() {
    // Get date in selected timezone
    const timezone = timezoneSelect ? timezoneSelect.value : 'auto';
    
    if (timezone === 'auto' || !timezone) {
        // Use local timezone
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    } else {
        // Use selected timezone
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
        const parts = formatter.formatToParts(now);
        const year = parts.find(p => p.type === 'year').value;
        const month = parts.find(p => p.type === 'month').value;
        const day = parts.find(p => p.type === 'day').value;
        return `${year}-${month}-${day}`;
    }
}

function handleTimezoneChange() {
    const selectedTimezone = timezoneSelect.value;
    localStorage.setItem('timezone', selectedTimezone);
    userTimezone = selectedTimezone;
    
    // Re-render calendar and update streak status with new timezone
    checkStreakStatus();
    updateStreakDisplay();
    renderCalendar();
}

function getDateInTimezone(year, month, day) {
    // Create date in user's local timezone
    const date = new Date(year, month, day);
    const yearStr = date.getFullYear();
    const monthStr = String(date.getMonth() + 1).padStart(2, '0');
    const dayStr = String(date.getDate()).padStart(2, '0');
    return `${yearStr}-${monthStr}-${dayStr}`;
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

    // Re-render UI components with new language
    renderCalendar();
    renderFriends();
    updateAuthUI();

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
        if (text && !el.classList.contains('tab-btn') && !el.classList.contains('tagline-text')) {
            // For button elements, wrap text in a span
            if (el.tagName === 'BUTTON' && (el.classList.contains('auth-btn') || el.classList.contains('friend-btn'))) {
                let btnTextClass = el.classList.contains('auth-btn') ? 'auth-btn-text' : 'friend-btn-text';
                let btnText = el.querySelector(`.${btnTextClass}`);
                if (!btnText) {
                    btnText = document.createElement('span');
                    btnText.className = btnTextClass;
                    el.appendChild(btnText);
                }
                btnText.textContent = text;
            } else {
                el.textContent = text;
            }
        } else if (text && el.classList.contains('tagline-text')) {
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
            // Wrap text in a span to maintain consistent sizing
            let textSpan = btn.querySelector('.tab-btn-text');
            if (!textSpan) {
                textSpan = document.createElement('span');
                textSpan.className = 'tab-btn-text';
                btn.appendChild(textSpan);
            }
            textSpan.textContent = text;
        }
    });
}

function updateWeekdayLabels() {
    const weekdayDivs = document.querySelectorAll('.calendar-weekdays > div');
    weekdayDivs.forEach(div => {
        const text = div.getAttribute(`data-${currentLanguage}`);
        if (text) {
            // Get or create span, but only update text once
            let textSpan = div.querySelector('span');
            if (!textSpan) {
                textSpan = document.createElement('span');
                div.appendChild(textSpan);
            }
            // Only update if text is different to avoid duplication
            if (textSpan.textContent !== text) {
                textSpan.textContent = text;
            }
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
