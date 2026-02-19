/* ============================================
   Gamification Engine
   XP, Levels, Streaks, Achievements
   ============================================ */

const Gamification = (function () {
    'use strict';

    const STORAGE_KEY = 'tt-gamification';

    // --- XP & Level Configuration ---
    const XP_REWARDS = {
        watchVideo: 25,
        readDocument: 15,
        completeSeries: 100,
        completeCategory: 250,
        firstWatch: 50,       // bonus for very first item
        dailyLogin: 10,
        streak3: 30,
        streak7: 75,
        streak14: 150,
        streak30: 300,
    };

    const LEVELS = [
        { level: 1, title: 'Newcomer', xpRequired: 0, icon: '🌱' },
        { level: 2, title: 'Explorer', xpRequired: 100, icon: '🔍' },
        { level: 3, title: 'Learner', xpRequired: 250, icon: '📖' },
        { level: 4, title: 'Practitioner', xpRequired: 500, icon: '⚡' },
        { level: 5, title: 'Enthusiast', xpRequired: 850, icon: '🚀' },
        { level: 6, title: 'Specialist', xpRequired: 1300, icon: '🎯' },
        { level: 7, title: 'Expert', xpRequired: 1900, icon: '💎' },
        { level: 8, title: 'Champion', xpRequired: 2700, icon: '🏆' },
        { level: 9, title: 'Master', xpRequired: 3800, icon: '👑' },
        { level: 10, title: 'Legend', xpRequired: 5000, icon: '🌟' },
    ];

    // --- Achievement Definitions ---
    const ACHIEVEMENTS = [
        // Getting started
        { id: 'first-steps', title: 'First Steps', description: 'Watch your first training video', icon: '👣', category: 'getting-started', check: (s) => s.totalWatched >= 1 },
        { id: 'curious-mind', title: 'Curious Mind', description: 'Watch 5 training resources', icon: '🧠', category: 'getting-started', check: (s) => s.totalWatched >= 5 },
        { id: 'dedicated-learner', title: 'Dedicated Learner', description: 'Watch 15 training resources', icon: '📚', category: 'getting-started', check: (s) => s.totalWatched >= 15 },
        { id: 'knowledge-seeker', title: 'Knowledge Seeker', description: 'Watch 30 training resources', icon: '🔬', category: 'getting-started', check: (s) => s.totalWatched >= 30 },
        { id: 'completionist', title: 'Completionist', description: 'Watch every single resource', icon: '🏅', category: 'getting-started', check: (s, d) => s.totalWatched >= d.totalResources },

        // Categories
        { id: 'google-guru', title: 'Google Guru', description: 'Complete all Google Workspace resources', icon: '🟦', category: 'categories', check: (s) => s.categoriesCompleted && s.categoriesCompleted['google-workspace'] },
        { id: 'ai-pioneer', title: 'AI Pioneer', description: 'Complete all AI Tools resources', icon: '🤖', category: 'categories', check: (s) => s.categoriesCompleted && s.categoriesCompleted['ai-tools'] },
        { id: 'apple-ace', title: 'Apple Ace', description: 'Complete all Apple Classroom resources', icon: '🍎', category: 'categories', check: (s) => s.categoriesCompleted && s.categoriesCompleted['apple-classroom'] },
        { id: 'well-rounded', title: 'Well Rounded', description: 'Complete resources in 4 different categories', icon: '🎨', category: 'categories', check: (s) => s.categoriesStarted >= 4 },
        { id: 'jack-of-all', title: 'Jack of All Trades', description: 'Complete at least 1 resource in every category', icon: '🃏', category: 'categories', check: (s) => s.categoriesStarted >= 8 },

        // Series
        { id: 'series-starter', title: 'Series Starter', description: 'Complete your first video series', icon: '📺', category: 'series', check: (s) => s.seriesCompleted >= 1 },
        { id: 'binge-watcher', title: 'Binge Watcher', description: 'Complete 3 video series', icon: '🍿', category: 'series', check: (s) => s.seriesCompleted >= 3 },
        { id: 'series-master', title: 'Series Master', description: 'Complete 6 video series', icon: '🎬', category: 'series', check: (s) => s.seriesCompleted >= 6 },

        // Streaks
        { id: 'day-1', title: 'Day One', description: 'Start your learning streak', icon: '🔥', category: 'streaks', check: (s) => s.currentStreak >= 1 },
        { id: 'hot-streak', title: 'Hot Streak', description: 'Maintain a 3-day learning streak', icon: '🔥', category: 'streaks', check: (s) => s.currentStreak >= 3 },
        { id: 'on-fire', title: 'On Fire!', description: 'Maintain a 7-day learning streak', icon: '💥', category: 'streaks', check: (s) => s.currentStreak >= 7 },
        { id: 'unstoppable', title: 'Unstoppable', description: 'Maintain a 14-day learning streak', icon: '⚡', category: 'streaks', check: (s) => s.currentStreak >= 14 },
        { id: 'legendary-streak', title: 'Legendary Streak', description: 'Maintain a 30-day learning streak', icon: '👑', category: 'streaks', check: (s) => s.currentStreak >= 30 },

        // Special
        { id: 'night-owl', title: 'Night Owl', description: 'Watch a resource after 9pm', icon: '🦉', category: 'special', check: (s) => s.nightOwl },
        { id: 'early-bird', title: 'Early Bird', description: 'Watch a resource before 7am', icon: '🐦', category: 'special', check: (s) => s.earlyBird },
        { id: 'explorer', title: 'Explorer', description: 'Use the search feature 5 times', icon: '🗺️', category: 'special', check: (s) => s.searchCount >= 5 },
        { id: 'dark-side', title: 'Dark Side', description: 'Toggle dark mode', icon: '🌙', category: 'special', check: (s) => s.usedDarkMode },
    ];

    // --- State ---
    let state = {
        xp: 0,
        level: 1,
        currentStreak: 0,
        longestStreak: 0,
        lastActiveDate: null,
        totalWatched: 0,
        categoriesStarted: 0,
        categoriesCompleted: {},
        seriesCompleted: 0,
        searchCount: 0,
        usedDarkMode: false,
        nightOwl: false,
        earlyBird: false,
        unlockedAchievements: {},
        xpHistory: [],
    };

    let listeners = [];

    // --- Persistence ---
    function load() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                state = { ...state, ...parsed };
            }
        } catch (e) {
            console.warn('Gamification: could not load state', e);
        }
    }

    function save() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (e) {
            console.warn('Gamification: could not save state', e);
        }
    }

    // --- Core Methods ---
    function addXP(amount, reason) {
        const oldLevel = getLevel();
        state.xp += amount;
        const newLevel = getLevel();
        save();

        emit('xp-gained', { amount, reason, totalXP: state.xp });

        if (newLevel.level > oldLevel.level) {
            emit('level-up', { oldLevel, newLevel });
        }
    }

    function getLevel() {
        let current = LEVELS[0];
        for (const lvl of LEVELS) {
            if (state.xp >= lvl.xpRequired) current = lvl;
            else break;
        }
        return current;
    }

    function getNextLevel() {
        const current = getLevel();
        const idx = LEVELS.findIndex(l => l.level === current.level);
        return idx < LEVELS.length - 1 ? LEVELS[idx + 1] : null;
    }

    function getXPProgress() {
        const current = getLevel();
        const next = getNextLevel();
        if (!next) return { current: state.xp, needed: state.xp, percentage: 100 };
        const progressInLevel = state.xp - current.xpRequired;
        const levelRange = next.xpRequired - current.xpRequired;
        return {
            current: progressInLevel,
            needed: levelRange,
            percentage: Math.round((progressInLevel / levelRange) * 100)
        };
    }

    // --- Streak Management ---
    function updateStreak() {
        const today = new Date().toISOString().split('T')[0];
        if (state.lastActiveDate === today) return; // Already logged today

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (state.lastActiveDate === yesterdayStr) {
            state.currentStreak += 1;
        } else if (state.lastActiveDate !== today) {
            state.currentStreak = 1;
        }

        state.lastActiveDate = today;
        if (state.currentStreak > state.longestStreak) {
            state.longestStreak = state.currentStreak;
        }

        // Streak milestone XP
        if (state.currentStreak === 3) addXP(XP_REWARDS.streak3, '3-day streak bonus');
        if (state.currentStreak === 7) addXP(XP_REWARDS.streak7, '7-day streak bonus');
        if (state.currentStreak === 14) addXP(XP_REWARDS.streak14, '14-day streak bonus');
        if (state.currentStreak === 30) addXP(XP_REWARDS.streak30, '30-day streak bonus');

        save();
        emit('streak-updated', { streak: state.currentStreak });
    }

    function checkDailyLogin() {
        const today = new Date().toISOString().split('T')[0];
        if (state.lastActiveDate !== today) {
            addXP(XP_REWARDS.dailyLogin, 'Daily login bonus');
            updateStreak();
        }
    }

    // --- Event System ---
    function on(event, callback) {
        listeners.push({ event, callback });
    }

    function emit(event, data) {
        listeners.filter(l => l.event === event).forEach(l => l.callback(data));
    }

    // --- Achievement Checking ---
    function checkAchievements(contentData) {
        const totalResources = contentData ? contentData.length : 999;
        const newlyUnlocked = [];

        for (const achievement of ACHIEVEMENTS) {
            if (state.unlockedAchievements[achievement.id]) continue;
            if (achievement.check(state, { totalResources })) {
                state.unlockedAchievements[achievement.id] = Date.now();
                newlyUnlocked.push(achievement);
            }
        }

        if (newlyUnlocked.length) {
            save();
            newlyUnlocked.forEach(a => emit('achievement-unlocked', a));
        }

        return newlyUnlocked;
    }

    // --- Public Action Methods ---
    function onItemWatched(itemId, item, contentData, allWatched) {
        const hour = new Date().getHours();
        if (hour >= 21) state.nightOwl = true;
        if (hour < 7) state.earlyBird = true;

        const wasFirstEver = state.totalWatched === 0;
        state.totalWatched = Object.keys(allWatched).length;

        // XP for watching
        if (item.type === 'video') {
            addXP(XP_REWARDS.watchVideo, `Watched: ${item.title}`);
        } else {
            addXP(XP_REWARDS.readDocument, `Read: ${item.title}`);
        }

        if (wasFirstEver) {
            addXP(XP_REWARDS.firstWatch, 'First resource bonus!');
        }

        // Check category completion
        if (contentData) {
            const catItems = contentData.filter(i => i.category === item.category);
            const catWatched = catItems.filter(i => allWatched[i.id]).length;
            if (catWatched >= catItems.length && catItems.length > 0) {
                if (!state.categoriesCompleted[item.category]) {
                    state.categoriesCompleted[item.category] = true;
                    addXP(XP_REWARDS.completeCategory, `Completed category: ${item.category}`);
                    emit('category-completed', { category: item.category });
                }
            }

            // Count categories started
            const catMap = {};
            contentData.forEach(i => {
                if (allWatched[i.id]) catMap[i.category] = true;
            });
            state.categoriesStarted = Object.keys(catMap).length;

            // Check series completion
            if (item.series) {
                const seriesItems = contentData.filter(i => i.series === item.series);
                const seriesWatched = seriesItems.filter(i => allWatched[i.id]).length;
                if (seriesWatched >= seriesItems.length && seriesItems.length > 1) {
                    addXP(XP_REWARDS.completeSeries, `Completed series: ${item.series}`);
                    // Count total series completed
                    const allSeries = {};
                    contentData.forEach(i => { if (i.series) allSeries[i.series] = true; });
                    let completedCount = 0;
                    Object.keys(allSeries).forEach(s => {
                        const si = contentData.filter(i => i.series === s);
                        if (si.every(i => allWatched[i.id])) completedCount++;
                    });
                    state.seriesCompleted = completedCount;
                }
            }
        }

        updateStreak();
        save();
        checkAchievements(contentData);
    }

    function onItemUnwatched(itemId, contentData, allWatched) {
        state.totalWatched = Object.keys(allWatched).length;
        // Recalculate categories
        if (contentData) {
            const catMap = {};
            contentData.forEach(i => {
                if (allWatched[i.id]) catMap[i.category] = true;
            });
            state.categoriesStarted = Object.keys(catMap).length;
        }
        save();
    }

    function onSearch() {
        state.searchCount = (state.searchCount || 0) + 1;
        save();
        checkAchievements();
    }

    function onDarkModeToggle() {
        state.usedDarkMode = true;
        save();
        checkAchievements();
    }

    // --- Getters ---
    function getState() { return { ...state }; }
    function getAchievements() { return ACHIEVEMENTS; }
    function getLevels() { return LEVELS; }
    function getXPRewards() { return XP_REWARDS; }

    // --- Init ---
    function init() {
        load();
        checkDailyLogin();
    }

    return {
        init,
        on,
        addXP,
        getLevel,
        getNextLevel,
        getXPProgress,
        getState,
        getAchievements,
        getLevels,
        getXPRewards,
        checkAchievements,
        onItemWatched,
        onItemUnwatched,
        onSearch,
        onDarkModeToggle,
        updateStreak,
    };
})();
