/* ============================================
   Haileybury Tech Tips Training Hub
   Main Application Script — v3
   Gamification Edition
   ============================================ */

(function () {
    'use strict';

    // --- Category Definitions ---
    const CATEGORIES = {
        'essential-reading': {
            title: 'Essential Reading',
            color: '#9b1844',
            icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`
        },
        'apple-classroom': {
            title: 'Apple Classroom',
            color: '#009870',
            icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`
        },
        'google-workspace': {
            title: 'Google Workspace',
            color: '#009fe3',
            icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>`
        },
        'ai-tools': {
            title: 'AI Tools',
            color: '#2a2b7c',
            icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a4 4 0 0 1 4 4v2h2a2 2 0 0 1 2 2v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-8a2 2 0 0 1 2-2h2V6a4 4 0 0 1 4-4z"/><circle cx="9" cy="14" r="1.5"/><circle cx="15" cy="14" r="1.5"/></svg>`
        },
        'general-tips': {
            title: 'General Tips',
            color: '#ec6608',
            icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`
        },
        'learning-resource-hub': {
            title: 'Learning Resource Hub',
            color: '#7c3aed',
            icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`
        },
        'reading': {
            title: 'Reading',
            color: '#e6007e',
            icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`
        },
        'pupil-tech-tips': {
            title: 'Pupil Tech Tips',
            color: '#0d9488',
            icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`
        }
    };

    // --- Learning Paths ---
    const LEARNING_PATHS = [
        {
            id: 'getting-started',
            title: 'Getting Started',
            description: 'Everything you need for your first week with Haileybury tech',
            icon: '🚀',
            color: '#9b1844',
            xpReward: 150,
            steps: [
                'apps-for-tasks-2526',
                'learning-resource-hub-intro',
                'gc-customisation-and-notifications',
                'google-classroom-assignment-codes',
                'gemini-revision-prompts'
            ]
        },
        {
            id: 'google-classroom-master',
            title: 'Google Classroom Mastery',
            description: 'From setup to advanced features, become a Classroom pro',
            icon: '🎓',
            color: '#009fe3',
            xpReward: 200,
            steps: [
                'gc-customisation-and-notifications',
                'gc-classroom-sharing-link',
                'gc-mark-work-as-missing',
                'gc-comment-banks',
                'gc-creating-a-rubric',
                'gc-weighted-marks',
                'gc-creating-a-practice-set'
            ]
        },
        {
            id: 'ai-explorer',
            title: 'AI Explorer',
            description: 'Discover how AI tools can transform your teaching workflow',
            icon: '🤖',
            color: '#2a2b7c',
            xpReward: 200,
            steps: [
                'gemini-and-google-workspace',
                'brisk-pro-marking-example',
                'brisk-activities',
                'notebooklm-overview',
                'perplexity-overview',
                'deep-research-gemini'
            ]
        },
        {
            id: 'marking-feedback',
            title: 'Marking & Feedback',
            description: 'Speed up marking and give better feedback with these tools',
            icon: '✅',
            color: '#009870',
            xpReward: 175,
            steps: [
                'gc-comment-banks',
                'gc-creating-a-rubric',
                'gc-using-rubrics-part-2',
                'gc-checking-for-plagiarism',
                'brisk-pro-marking-example',
                'answering-exam-papers'
            ]
        }
    ];

    // --- Welcome Tips ---
    const WELCOME_TIPS = [
        "Did you know? You can mark videos as watched to track your progress across all categories.",
        "Try using the search bar to quickly find training on any tool or topic.",
        "New to Haileybury tech? Check out the Start Here section for essential guides.",
        "Use Gemini in Google Workspace to draft emails, create slides, and more.",
        "Brisk can help you mark work faster with AI-powered feedback.",
        "PressReader gives you access to thousands of newspapers and magazines for free.",
        "NotebookLM can create flashcards, mind maps and audio overviews from your documents.",
        "Check out the Pupil Tech Tips section for resources to share with students.",
        "Watch resources to earn XP and level up! Can you reach Legend status?",
        "Build a daily streak by watching at least one resource per day!",
        "Follow Learning Paths for guided step-by-step skill building.",
        "Unlock achievements by exploring different categories and completing series!"
    ];

    // --- Filter Chips ---
    const FILTER_CHIPS = [
        { id: 'all', label: 'All' },
        { id: 'new', label: 'New', className: 'chip-new' },
        { id: 'video', label: 'Videos' },
        { id: 'pdf', label: 'PDFs' },
        { id: 'ai', label: 'AI' },
        { id: 'google', label: 'Google' },
        { id: 'beginner', label: 'Beginner' }
    ];

    // --- State ---
    let contentData = [];
    let currentView = 'home';
    let currentCategory = null;
    let activeFilter = 'all';
    let watchedItems = {};
    let savedItems = {};

    // --- DOM ---
    const $ = (sel) => document.querySelector(sel);

    const dom = {
        darkModeToggle: $('#darkModeToggle'),
        heroSection: $('#heroSection'),
        heroStats: $('#heroStats'),
        heroLevelBadge: $('#heroLevelBadge'),
        heroLevelIcon: $('#heroLevelIcon'),
        heroLevelTitle: $('#heroLevelTitle'),
        heroParticles: $('#heroParticles'),
        welcomeBanner: $('#welcomeBanner'),
        welcomeText: $('#welcomeText'),
        welcomeDismiss: $('#welcomeDismiss'),
        searchInput: $('#searchInput'),
        searchClear: $('#searchClear'),
        filterChips: $('#filterChips'),
        votdSection: $('#votdSection'),
        votdCard: $('#votdCard'),
        votdPreview: $('#votdPreview'),
        votdTitle: $('#votdTitle'),
        votdDesc: $('#votdDesc'),
        votdPlayBtn: $('#votdPlayBtn'),
        essentialCta: $('#essentialCta'),
        essentialCtaBtn: $('#essentialCtaBtn'),
        learningPathsSection: $('#learningPathsSection'),
        learningPathsGrid: $('#learningPathsGrid'),
        startHereSection: $('#startHereSection'),
        featuredGrid: $('#featuredGrid'),
        categoriesSection: $('#categoriesSection'),
        categoryGrid: $('#categoryGrid'),
        categoryDetail: $('#categoryDetail'),
        backButton: $('#backButton'),
        categoryDetailHeader: $('#categoryDetailHeader'),
        categoryContentGrid: $('#categoryContentGrid'),
        searchResults: $('#searchResults'),
        searchResultsTitle: $('#searchResultsTitle'),
        searchResultsGrid: $('#searchResultsGrid'),
        achievementsSection: $('#achievementsSection'),
        achievementsBackButton: $('#achievementsBackButton'),
        achievementsProfile: $('#achievementsProfile'),
        achievementsGrid: $('#achievementsGrid'),
        achievementsBtn: $('#achievementsBtn'),
        achievementsBadge: $('#achievementsBadge'),
        widerReadingSection: $('#widerReadingSection'),
        readingList: $('#readingList'),
        progressSection: $('#progressSection'),
        progressGrid: $('#progressGrid'),
        videoModal: $('#videoModal'),
        modalTitle: $('#modalTitle'),
        modalClose: $('#modalClose'),
        videoContainer: $('#videoContainer'),
        modalMeta: $('#modalMeta'),
        modalWatchedCheckbox: $('#modalWatchedCheckbox'),
        modalXPHint: $('#modalXPHint'),
        headerLevel: $('#headerLevel'),
        headerXPFill: $('#headerXPFill'),
        headerXPAmount: $('#headerXPAmount'),
        headerStreak: $('#headerStreak'),
        streakCount: $('#streakCount'),
        toastContainer: $('#toastContainer'),
        recentlyWatchedSection: $('#recentlyWatchedSection'),
        recentlyWatchedGrid: $('#recentlyWatchedGrid'),
        whatsNewSection: $('#whatsNewSection'),
        whatsNewGrid: $('#whatsNewGrid'),
        savedSection: $('#savedSection'),
        savedGrid: $('#savedGrid'),
        savedBackButton: $('#savedBackButton'),
        mobileNav: $('#mobileNav'),
    };

    // --- Init ---
    async function init() {
        loadWatchedState();
        loadSavedState();
        initDarkMode();
        initWelcomeBanner();
        initSearch();
        initFilterChips();
        initModal();
        initEssentialCta();
        initRouting();
        initGamification();
        initHeroParticles();
        initKeyboardShortcuts();
        initMobileNav();
        Effects.init();

        try {
            const resp = await fetch('data/content.json');
            contentData = await resp.json();
            renderApp();
            Gamification.checkAchievements(contentData);
            updateGamificationUI();
            Effects.refreshScrollReveal();
        } catch (err) {
            console.error('Failed to load content data:', err);
            dom.categoryGrid.innerHTML = '<div class="empty-state"><p>Unable to load training content. Please check that data/content.json exists.</p></div>';
        }
    }

    // --- Gamification Integration ---
    function initGamification() {
        Gamification.init();

        // Listen for events
        Gamification.on('achievement-unlocked', (achievement) => {
            showToast({
                type: 'achievement',
                icon: achievement.icon,
                title: 'Achievement Unlocked!',
                desc: `${achievement.title} — ${achievement.description}`,
            });
            Confetti.miniCelebrate(window.innerWidth - 60, 60);
            updateGamificationUI();
        });

        Gamification.on('level-up', (data) => {
            showToast({
                type: 'levelup',
                icon: data.newLevel.icon,
                title: `Level Up! You're now Level ${data.newLevel.level}`,
                desc: data.newLevel.title,
            });
            Confetti.celebrate();
            updateGamificationUI();
        });

        Gamification.on('xp-gained', (data) => {
            updateGamificationUI();
        });

        Gamification.on('streak-updated', () => {
            updateGamificationUI();
        });

        // Achievements button
        dom.achievementsBtn.addEventListener('click', () => {
            window.location.hash = 'achievements';
        });

        updateGamificationUI();
    }

    function updateGamificationUI() {
        const level = Gamification.getLevel();
        const progress = Gamification.getXPProgress();
        const state = Gamification.getState();

        // Header XP
        dom.headerLevel.textContent = `Lv ${level.level}`;
        dom.headerXPFill.style.width = `${progress.percentage}%`;
        dom.headerXPAmount.textContent = `${state.xp} XP`;

        // Header streak
        dom.streakCount.textContent = state.currentStreak;
        if (state.currentStreak > 0) {
            dom.headerStreak.classList.add('has-streak');
        } else {
            dom.headerStreak.classList.remove('has-streak');
        }

        // Achievements badge
        const unlockedCount = Object.keys(state.unlockedAchievements).length;
        dom.achievementsBadge.textContent = unlockedCount;

        // Hero level badge
        if (dom.heroLevelIcon) dom.heroLevelIcon.textContent = level.icon;
        if (dom.heroLevelTitle) dom.heroLevelTitle.textContent = `Level ${level.level} — ${level.title}`;
    }

    // --- Hero Particles ---
    function initHeroParticles() {
        if (!dom.heroParticles) return;
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'hero-particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.width = (2 + Math.random() * 4) + 'px';
            particle.style.height = particle.style.width;
            particle.style.animationDuration = (8 + Math.random() * 12) + 's';
            particle.style.animationDelay = (Math.random() * 10) + 's';
            particle.style.opacity = (0.2 + Math.random() * 0.4);
            dom.heroParticles.appendChild(particle);
        }
    }

    // --- Toast Notifications ---
    function showToast({ type, icon, title, desc, xp }) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type || 'default'}`;
        toast.innerHTML = `
            <div class="toast-icon">${icon || '🎉'}</div>
            <div class="toast-body">
                <div class="toast-title">${esc(title)}</div>
                ${desc ? `<div class="toast-desc">${esc(desc)}</div>` : ''}
                ${xp ? `<div class="toast-xp"><span class="toast-xp-badge">+${xp} XP</span></div>` : ''}
            </div>
        `;

        toast.addEventListener('click', () => {
            toast.classList.add('toast-exit');
            setTimeout(() => toast.remove(), 300);
        });

        dom.toastContainer.appendChild(toast);

        // Auto remove
        setTimeout(() => {
            if (toast.parentNode) {
                toast.classList.add('toast-exit');
                setTimeout(() => toast.remove(), 300);
            }
        }, 5000);
    }

    // --- Floating XP Animation ---
    function showFloatingXP(x, y, amount) {
        const el = document.createElement('div');
        el.className = 'xp-float';
        el.textContent = `+${amount} XP`;
        el.style.left = x + 'px';
        el.style.top = y + 'px';
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 1500);
    }

    // --- Essential Reading CTA ---
    function initEssentialCta() {
        dom.essentialCtaBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            window.location.hash = 'category/essential-reading';
        });
        dom.essentialCta.addEventListener('click', () => {
            window.location.hash = 'category/essential-reading';
        });
    }

    // --- Video of the Day ---
    function getVideoOfTheDay() {
        const videos = contentData.filter(i => i.type === 'video' && i.driveFileId);
        if (!videos.length) return null;
        const today = new Date();
        const daysSinceEpoch = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
        const seed = ((daysSinceEpoch * 2654435761) >>> 0) % videos.length;
        return videos[seed];
    }

    function renderVideoOfTheDay() {
        const votd = getVideoOfTheDay();
        if (!votd) {
            dom.votdSection.style.display = 'none';
            return;
        }

        const thumbUrl = getThumbnailUrl(votd);
        dom.votdPreview.innerHTML = `
            ${thumbUrl ? `<img class="votd-thumb-img" src="${thumbUrl}" alt="${escAttr(votd.title)}" onerror="this.style.display='none'">` : ''}
            <div class="votd-preview-play">
                <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            </div>
        `;

        dom.votdTitle.textContent = votd.title;
        dom.votdDesc.textContent = votd.description || 'Explore today\'s highlighted training video.';

        const playHandler = () => openModal(votd.id);
        dom.votdPlayBtn.addEventListener('click', playHandler);
        dom.votdPreview.addEventListener('click', playHandler);
    }

    // --- Dark Mode ---
    function initDarkMode() {
        const saved = localStorage.getItem('tt-dark-mode');
        if (saved === 'true' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
        dom.darkModeToggle.addEventListener('click', () => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
            localStorage.setItem('tt-dark-mode', String(!isDark));
            Gamification.onDarkModeToggle();
        });
    }

    // --- Welcome Banner ---
    function initWelcomeBanner() {
        if (sessionStorage.getItem('tt-welcome-dismissed')) {
            dom.welcomeBanner.classList.add('hidden');
            return;
        }
        dom.welcomeText.textContent = WELCOME_TIPS[Math.floor(Math.random() * WELCOME_TIPS.length)];
        dom.welcomeDismiss.addEventListener('click', () => {
            dom.welcomeBanner.classList.add('hidden');
            sessionStorage.setItem('tt-welcome-dismissed', 'true');
        });
    }

    // --- Search ---
    function initSearch() {
        let timer;
        dom.searchInput.addEventListener('input', () => {
            const q = dom.searchInput.value.trim();
            dom.searchClear.classList.toggle('visible', q.length > 0);
            clearTimeout(timer);
            timer = setTimeout(() => {
                if (q.length >= 2) {
                    showSearchResults(q);
                    Gamification.onSearch();
                } else if (q.length === 0) {
                    showHome();
                }
            }, 250);
        });
        dom.searchClear.addEventListener('click', () => {
            dom.searchInput.value = '';
            dom.searchClear.classList.remove('visible');
            showHome();
        });
    }

    // --- Filter Chips ---
    function initFilterChips() {
        dom.filterChips.innerHTML = FILTER_CHIPS.map(c =>
            `<button class="filter-chip ${c.className || ''} ${c.id === 'all' ? 'active' : ''}" data-filter="${c.id}">${c.label}</button>`
        ).join('');

        dom.filterChips.addEventListener('click', (e) => {
            const chip = e.target.closest('.filter-chip');
            if (!chip) return;
            dom.filterChips.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            activeFilter = chip.dataset.filter;
            renderCurrentView();
        });
    }

    // --- Watched State ---
    function loadWatchedState() {
        try {
            const stored = localStorage.getItem('tt-watched');
            watchedItems = stored ? JSON.parse(stored) : {};
        } catch {
            watchedItems = {};
        }
    }

    function saveWatchedState() {
        try {
            localStorage.setItem('tt-watched', JSON.stringify(watchedItems));
        } catch (e) {
            console.warn('Could not save watched state:', e);
        }
    }

    function toggleWatched(id, e) {
        if (e) { e.stopPropagation(); e.preventDefault(); }

        const item = contentData.find(i => i.id === id);
        const wasWatched = !!watchedItems[id];

        if (wasWatched) {
            delete watchedItems[id];
        } else {
            watchedItems[id] = Date.now();
        }
        saveWatchedState();

        // Gamification
        if (!wasWatched && item) {
            Gamification.onItemWatched(id, item, contentData, watchedItems);

            // Show floating XP near the clicked element
            if (e && e.target) {
                const rect = e.target.getBoundingClientRect();
                const xpAmount = item.type === 'video' ? 25 : 15;
                showFloatingXP(rect.left + rect.width / 2, rect.top, xpAmount);
            }

            // Mini confetti burst
            if (e && e.target) {
                const rect = e.target.getBoundingClientRect();
                Confetti.miniCelebrate(rect.left + rect.width / 2, rect.top + rect.height / 2);
            }
        } else if (wasWatched) {
            Gamification.onItemUnwatched(id, contentData, watchedItems);
        }

        // Update UI in place
        document.querySelectorAll(`[data-watched-id="${id}"]`).forEach(cb => {
            cb.checked = isWatched(id);
            const label = cb.closest('.watched-indicator');
            if (label) {
                label.classList.toggle('is-watched', isWatched(id));
                const span = label.querySelector('span');
                if (span) span.textContent = isWatched(id) ? 'Watched' : 'Mark as watched';
            }
        });

        document.querySelectorAll(`.series-item[data-id="${id}"] .series-item-watched`).forEach(el => {
            el.style.display = isWatched(id) ? '' : 'none';
        });

        renderProgress();
        renderCategories();
        renderLearningPaths();
        updateGamificationUI();
    }

    function isWatched(id) {
        return !!watchedItems[id];
    }

    // --- Saved/Bookmark State ---
    function loadSavedState() {
        try {
            const stored = localStorage.getItem('tt-saved');
            savedItems = stored ? JSON.parse(stored) : {};
        } catch {
            savedItems = {};
        }
    }

    function saveSavedState() {
        try {
            localStorage.setItem('tt-saved', JSON.stringify(savedItems));
        } catch (e) {
            console.warn('Could not save bookmarks:', e);
        }
    }

    function toggleSaved(id, e) {
        if (e) { e.stopPropagation(); e.preventDefault(); }
        if (savedItems[id]) {
            delete savedItems[id];
        } else {
            savedItems[id] = Date.now();
        }
        saveSavedState();
        // Update all save buttons for this item
        document.querySelectorAll(`[data-save-id="${id}"]`).forEach(btn => {
            const isSaved = !!savedItems[id];
            btn.classList.toggle('is-saved', isSaved);
            const span = btn.querySelector('span');
            if (span) span.textContent = isSaved ? 'Saved' : 'Save';
        });
    }

    function isSaved(id) {
        return !!savedItems[id];
    }

    // --- Filtering ---
    function filterContent(items) {
        if (activeFilter === 'all') return items;
        return items.filter(item => {
            switch (activeFilter) {
                case 'new': return isNew(item);
                case 'video': return item.type === 'video';
                case 'pdf': return item.type === 'pdf';
                case 'ai': return item.tags && item.tags.some(t => ['ai', 'gemini', 'brisk', 'notebooklm', 'chatgpt', 'perplexity', 'magicschool', 'diffit', 'cove', 'comet', 'napkin', 'gamma', 'deep-research'].includes(t.toLowerCase()));
                case 'google': return item.tags && item.tags.some(t => ['google', 'gmail', 'classroom', 'slides', 'docs', 'forms', 'calendar', 'workspace', 'gemini'].includes(t.toLowerCase()));
                case 'beginner': return item.difficulty === 'beginner';
                default: return true;
            }
        });
    }

    function isNew(item) {
        if (!item.dateAdded) return false;
        const added = new Date(item.dateAdded);
        const ago = new Date();
        ago.setDate(ago.getDate() - 60);
        return added >= ago;
    }

    // --- Keyboard Shortcuts ---
    function initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Don't trigger shortcuts when typing in an input
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            if (e.key === '/' || e.key === 's') {
                e.preventDefault();
                dom.searchInput.focus();
            }
            if (e.key === 'h') {
                window.location.hash = '';
                showHome();
            }
        });
    }

    // --- Mobile Navigation ---
    function initMobileNav() {
        dom.mobileNav.querySelectorAll('.mobile-nav-item').forEach(btn => {
            btn.addEventListener('click', () => {
                const nav = btn.dataset.nav;
                if (nav === 'home') { window.location.hash = ''; showHome(); }
                else if (nav === 'search') { dom.searchInput.focus(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
                else if (nav === 'saved') { window.location.hash = 'saved'; }
                else if (nav === 'achievements') { window.location.hash = 'achievements'; }
            });
        });
    }

    function updateMobileNav() {
        dom.mobileNav.querySelectorAll('.mobile-nav-item').forEach(btn => {
            const nav = btn.dataset.nav;
            const isActive = (nav === 'home' && currentView === 'home') ||
                (nav === 'search' && currentView === 'search') ||
                (nav === 'saved' && currentView === 'saved') ||
                (nav === 'achievements' && currentView === 'achievements');
            btn.classList.toggle('active', isActive);
        });
    }

    // --- Routing ---
    let isFirstRoute = true;

    function initRouting() {
        window.addEventListener('hashchange', handleRoute);
        handleRoute();
    }

    function handleRoute() {
        const hash = window.location.hash.slice(1);
        const navigate = (fn) => isFirstRoute ? fn() : transitionView(fn);

        if (hash.startsWith('category/')) {
            navigate(() => showCategoryDetail(hash.replace('category/', '')));
        } else if (hash.startsWith('search/')) {
            const q = decodeURIComponent(hash.replace('search/', ''));
            dom.searchInput.value = q;
            navigate(() => showSearchResults(q));
        } else if (hash === 'achievements') {
            navigate(() => showAchievements());
        } else if (hash === 'saved') {
            navigate(() => showSaved());
        } else {
            navigate(() => showHome());
        }
        isFirstRoute = false;
    }

    function transitionView(callback) {
        const main = document.querySelector('.main-content');
        main.classList.add('view-transition-out');
        setTimeout(() => {
            callback();
            main.classList.remove('view-transition-out');
            window.scrollTo({ top: 0 });
        }, 150);
    }

    // --- Views ---
    function showHome() {
        currentView = 'home';
        currentCategory = null;
        dom.heroSection.style.display = '';
        dom.votdSection.style.display = '';
        dom.essentialCta.style.display = '';
        dom.learningPathsSection.style.display = '';
        dom.startHereSection.style.display = '';
        dom.categoriesSection.style.display = '';
        dom.categoryDetail.style.display = 'none';
        dom.searchResults.style.display = 'none';
        dom.achievementsSection.style.display = 'none';
        dom.savedSection.style.display = 'none';
        dom.widerReadingSection.style.display = '';
        dom.progressSection.style.display = '';
        dom.recentlyWatchedSection.style.display = '';
        dom.whatsNewSection.style.display = '';
        renderRecentlyWatched();
        renderWhatsNew();
        if (window.location.hash) history.pushState(null, '', window.location.pathname);
        updateMobileNav();
    }

    function showCategoryDetail(catId) {
        if (!CATEGORIES[catId]) return showHome();
        currentView = 'category';
        currentCategory = catId;
        dom.heroSection.style.display = 'none';
        dom.votdSection.style.display = 'none';
        dom.essentialCta.style.display = 'none';
        dom.learningPathsSection.style.display = 'none';
        dom.startHereSection.style.display = 'none';
        dom.categoriesSection.style.display = 'none';
        dom.categoryDetail.style.display = '';
        dom.searchResults.style.display = 'none';
        dom.achievementsSection.style.display = 'none';
        dom.savedSection.style.display = 'none';
        dom.widerReadingSection.style.display = 'none';
        dom.progressSection.style.display = 'none';
        dom.recentlyWatchedSection.style.display = 'none';
        dom.whatsNewSection.style.display = 'none';
        renderCategoryDetail(catId);
        updateMobileNav();
    }

    function showSearchResults(query) {
        currentView = 'search';
        dom.heroSection.style.display = 'none';
        dom.votdSection.style.display = 'none';
        dom.essentialCta.style.display = 'none';
        dom.learningPathsSection.style.display = 'none';
        dom.startHereSection.style.display = 'none';
        dom.categoriesSection.style.display = 'none';
        dom.categoryDetail.style.display = 'none';
        dom.searchResults.style.display = '';
        dom.achievementsSection.style.display = 'none';
        dom.savedSection.style.display = 'none';
        dom.widerReadingSection.style.display = 'none';
        dom.progressSection.style.display = 'none';
        dom.recentlyWatchedSection.style.display = 'none';
        dom.whatsNewSection.style.display = 'none';
        renderSearchResults(query);
        updateMobileNav();
    }

    function showAchievements() {
        currentView = 'achievements';
        dom.heroSection.style.display = 'none';
        dom.votdSection.style.display = 'none';
        dom.essentialCta.style.display = 'none';
        dom.learningPathsSection.style.display = 'none';
        dom.startHereSection.style.display = 'none';
        dom.categoriesSection.style.display = 'none';
        dom.categoryDetail.style.display = 'none';
        dom.searchResults.style.display = 'none';
        dom.achievementsSection.style.display = '';
        dom.savedSection.style.display = 'none';
        dom.widerReadingSection.style.display = 'none';
        dom.progressSection.style.display = 'none';
        dom.recentlyWatchedSection.style.display = 'none';
        dom.whatsNewSection.style.display = 'none';
        renderAchievements();
        updateMobileNav();
    }

    function showSaved() {
        currentView = 'saved';
        dom.heroSection.style.display = 'none';
        dom.votdSection.style.display = 'none';
        dom.essentialCta.style.display = 'none';
        dom.learningPathsSection.style.display = 'none';
        dom.startHereSection.style.display = 'none';
        dom.categoriesSection.style.display = 'none';
        dom.categoryDetail.style.display = 'none';
        dom.searchResults.style.display = 'none';
        dom.achievementsSection.style.display = 'none';
        dom.savedSection.style.display = '';
        dom.widerReadingSection.style.display = 'none';
        dom.progressSection.style.display = 'none';
        dom.recentlyWatchedSection.style.display = 'none';
        dom.whatsNewSection.style.display = 'none';
        renderSaved();
        updateMobileNav();
    }

    function renderCurrentView() {
        if (currentView === 'category' && currentCategory) renderCategoryDetail(currentCategory);
        else if (currentView === 'search') renderSearchResults(dom.searchInput.value.trim());
        else if (currentView === 'achievements') renderAchievements();
        else if (currentView === 'saved') renderSaved();
        else renderApp();
    }

    // --- Render App ---
    function renderApp() {
        renderHeroStats();
        renderRecentlyWatched(); // Continue Watching
        renderWhatsNew();        // What's New
        renderFeatured();        // Start Here — top of content
        renderVideoOfTheDay();   // VOTD — after featured
        renderLearningPaths();   // Learning Paths
        renderCategories();      // Browse by Category
        renderWiderReading();    // Wider Reading docs
        renderProgress();        // Your Progress summary
        Effects.refreshScrollReveal();
    }

    // --- Recently Watched ---
    function renderRecentlyWatched() {
        // Get watched items sorted by most recently watched
        const recentIds = Object.entries(watchedItems)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 6)
            .map(([id]) => id);
        const recentItems = recentIds.map(id => contentData.find(i => i.id === id)).filter(Boolean);

        if (!recentItems.length) {
            dom.recentlyWatchedSection.style.display = 'none';
            return;
        }
        dom.recentlyWatchedSection.style.display = '';
        dom.recentlyWatchedGrid.innerHTML = recentItems.map(i => renderContentCard(i)).join('');
        attachCardListeners(dom.recentlyWatchedGrid);
        attachSaveListeners(dom.recentlyWatchedGrid);
    }

    // --- What's New ---
    function renderWhatsNew() {
        const newItems = contentData
            .filter(i => isNew(i))
            .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
            .slice(0, 8);

        if (!newItems.length) {
            dom.whatsNewSection.style.display = 'none';
            return;
        }
        dom.whatsNewSection.style.display = '';
        dom.whatsNewGrid.innerHTML = newItems.map(i => renderContentCard(i)).join('');
        attachCardListeners(dom.whatsNewGrid);
        attachSaveListeners(dom.whatsNewGrid);
    }

    // --- Saved Items ---
    function renderSaved() {
        const savedIds = Object.entries(savedItems)
            .sort((a, b) => b[1] - a[1])
            .map(([id]) => id);
        const items = savedIds.map(id => contentData.find(i => i.id === id)).filter(Boolean);

        if (!items.length) {
            dom.savedGrid.innerHTML = '<div class="empty-state"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg><p>No saved resources yet. Click the bookmark icon on any resource to save it for later.</p></div>';
            return;
        }
        dom.savedGrid.innerHTML = items.map(i => renderContentCard(i)).join('');
        attachCardListeners(dom.savedGrid);
        attachSaveListeners(dom.savedGrid);

        dom.savedBackButton.onclick = () => {
            window.location.hash = '';
            showHome();
        };
    }

    // --- Hero Stats ---
    function renderHeroStats() {
        const videos = contentData.filter(i => i.type === 'video').length;
        const cats = Object.keys(CATEGORIES).length;
        const watched = Object.keys(watchedItems).length;

        dom.heroStats.innerHTML = `
            <div class="hero-stat"><div class="hero-stat-value counter-animate">${videos}</div><div class="hero-stat-label">Videos</div></div>
            <div class="hero-stat"><div class="hero-stat-value counter-animate">${cats}</div><div class="hero-stat-label">Categories</div></div>
            <div class="hero-stat"><div class="hero-stat-value counter-animate">${watched}</div><div class="hero-stat-label">Completed</div></div>
        `;
        Effects.animateCounters();
    }

    // --- Learning Paths ---
    function renderLearningPaths() {
        dom.learningPathsGrid.innerHTML = LEARNING_PATHS.map(path => {
            const steps = path.steps.map(id => contentData.find(i => i.id === id)).filter(Boolean);
            const completed = steps.filter(s => isWatched(s.id)).length;
            const pct = steps.length > 0 ? Math.round((completed / steps.length) * 100) : 0;
            const isComplete = completed === steps.length && steps.length > 0;

            return `
                <div class="learning-path-card" style="--path-color: ${path.color}">
                    <div class="learning-path-header">
                        <div class="learning-path-icon">${path.icon}</div>
                        <div class="learning-path-title">${esc(path.title)}</div>
                        <div class="learning-path-desc">${esc(path.description)}</div>
                    </div>
                    <div class="learning-path-progress">
                        <div class="learning-path-progress-bar">
                            <div class="learning-path-progress-fill" style="width:${pct}%"></div>
                        </div>
                        <div class="learning-path-progress-label">
                            <span>${completed}/${steps.length} completed</span>
                            <span>${isComplete ? 'Complete!' : pct + '%'}</span>
                        </div>
                    </div>
                    <div class="learning-path-steps">
                        ${steps.map((step, i) => {
                            const done = isWatched(step.id);
                            const isCurrent = !done && (i === 0 || isWatched(steps[i-1]?.id));
                            return `
                                <div class="learning-path-step ${done ? 'completed' : ''} ${isCurrent ? 'current' : ''}" data-id="${step.id}">
                                    <div class="learning-path-step-dot">${done ? '&#10003;' : i + 1}</div>
                                    <div class="learning-path-step-title">${esc(step.title)}</div>
                                </div>`;
                        }).join('')}
                    </div>
                    <div class="learning-path-xp">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        ${path.xpReward} XP for completion
                    </div>
                </div>`;
        }).join('');

        // Attach click handlers to steps
        dom.learningPathsGrid.querySelectorAll('.learning-path-step').forEach(el => {
            el.addEventListener('click', () => openModal(el.dataset.id));
        });
    }

    // --- Featured ---
    function renderFeatured() {
        const featured = contentData.filter(i => i.featured);
        if (!featured.length) { dom.startHereSection.style.display = 'none'; return; }
        dom.startHereSection.style.display = '';
        dom.featuredGrid.innerHTML = featured.map(i => renderContentCard(i)).join('');
        attachCardListeners(dom.featuredGrid);
        attachSaveListeners(dom.featuredGrid);
    }

    // --- Categories ---
    function renderCategories() {
        dom.categoryGrid.innerHTML = Object.entries(CATEGORIES).map(([id, cat]) => {
            const items = contentData.filter(i => i.category === id);
            const watched = items.filter(i => isWatched(i.id)).length;
            const pct = items.length > 0 ? Math.round((watched / items.length) * 100) : 0;
            const isComplete = pct === 100 && items.length > 0;

            return `
                <div class="category-card ${isComplete ? 'category-complete' : ''}" data-category="${id}" style="--cat-color: ${cat.color}">
                    <div class="category-card-icon">${cat.icon}</div>
                    <div class="category-card-title">${cat.title}</div>
                    <div class="category-card-count">${items.length} resource${items.length !== 1 ? 's' : ''}${isComplete ? ' &#10003;' : ''}</div>
                    <div class="category-card-progress">
                        <div class="category-card-progress-bar" style="width: ${pct}%"></div>
                    </div>
                </div>
            `;
        }).join('');

        dom.categoryGrid.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', () => { window.location.hash = `category/${card.dataset.category}`; });
        });
    }

    // --- Category Detail ---
    function renderCategoryDetail(catId) {
        const cat = CATEGORIES[catId];
        const allCatItems = contentData.filter(i => i.category === catId);
        const items = filterContent(allCatItems);
        const watchedCount = allCatItems.filter(i => isWatched(i.id)).length;
        const pct = allCatItems.length > 0 ? Math.round((watchedCount / allCatItems.length) * 100) : 0;

        dom.categoryDetailHeader.innerHTML = `
            <div class="category-detail-banner" style="--cat-color: ${cat.color}">
                <div class="category-detail-banner-icon">${cat.icon}</div>
                <div class="category-detail-banner-info">
                    <div class="category-detail-banner-title">${cat.title}</div>
                    <div class="category-detail-banner-count">${allCatItems.length} resource${allCatItems.length !== 1 ? 's' : ''} &middot; ${watchedCount} completed</div>
                    <div class="category-detail-banner-progress">
                        <div class="category-detail-banner-progress-fill" style="width:${pct}%"></div>
                    </div>
                </div>
            </div>
        `;

        const seriesMap = {};
        const standalone = [];
        items.forEach(i => {
            if (i.series) {
                if (!seriesMap[i.series]) seriesMap[i.series] = [];
                seriesMap[i.series].push(i);
            } else {
                standalone.push(i);
            }
        });
        Object.values(seriesMap).forEach(s => s.sort((a, b) => (a.seriesOrder || 0) - (b.seriesOrder || 0)));

        let html = '';
        Object.entries(seriesMap).forEach(([name, items]) => { html += renderSeriesCard(name, items, cat.color); });
        html += standalone.map(i => renderContentCard(i)).join('');
        if (!html) html = '<div class="empty-state"><p>No resources match the current filter.</p></div>';

        dom.categoryContentGrid.innerHTML = html;
        attachCardListeners(dom.categoryContentGrid);
        attachSaveListeners(dom.categoryContentGrid);
        attachSeriesListeners(dom.categoryContentGrid);
    }

    // --- Search Results ---
    function renderSearchResults(query) {
        const q = query.toLowerCase();
        const results = filterContent(contentData.filter(i => {
            return i.title.toLowerCase().includes(q) ||
                (i.description && i.description.toLowerCase().includes(q)) ||
                (i.tags && i.tags.some(t => t.toLowerCase().includes(q)));
        }));

        dom.searchResultsTitle.textContent = `Search Results (${results.length})`;
        if (!results.length) {
            dom.searchResultsGrid.innerHTML = `<div class="empty-state"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg><p>No results for "${esc(query)}"</p></div>`;
            return;
        }
        dom.searchResultsGrid.innerHTML = results.map(i => renderContentCard(i)).join('');
        attachCardListeners(dom.searchResultsGrid);
        attachSaveListeners(dom.searchResultsGrid);
    }

    // --- Achievements Panel ---
    function renderAchievements() {
        const level = Gamification.getLevel();
        const nextLevel = Gamification.getNextLevel();
        const progress = Gamification.getXPProgress();
        const state = Gamification.getState();
        const allAchievements = Gamification.getAchievements();
        const unlockedCount = Object.keys(state.unlockedAchievements).length;

        // Profile card
        dom.achievementsProfile.innerHTML = `
            <div class="achievements-level-icon">${level.icon}</div>
            <div class="achievements-level-info">
                <div class="achievements-level-title">Level ${level.level} — ${level.title}</div>
                <div class="achievements-level-subtitle">${state.xp} XP earned${nextLevel ? ` · ${nextLevel.xpRequired - state.xp} XP to Level ${nextLevel.level}` : ' · Max level!'}</div>
                <div class="achievements-xp-bar">
                    <div class="achievements-xp-fill" style="width:${progress.percentage}%"></div>
                </div>
                <div class="achievements-xp-label">
                    <span>${progress.current} / ${progress.needed} XP</span>
                    <span>${progress.percentage}%</span>
                </div>
            </div>
            <div class="achievements-stats">
                <div><div class="achievements-stat-value">${unlockedCount}</div><div class="achievements-stat-label">Unlocked</div></div>
                <div><div class="achievements-stat-value">${state.currentStreak}</div><div class="achievements-stat-label">Streak</div></div>
                <div><div class="achievements-stat-value">${state.longestStreak}</div><div class="achievements-stat-label">Best</div></div>
            </div>
        `;

        // Group by category
        const groups = {};
        allAchievements.forEach(a => {
            if (!groups[a.category]) groups[a.category] = [];
            groups[a.category].push(a);
        });

        const categoryTitles = {
            'getting-started': 'Getting Started',
            'categories': 'Category Mastery',
            'series': 'Series',
            'streaks': 'Streaks',
            'special': 'Special',
        };

        let html = '';
        Object.entries(groups).forEach(([catId, achievements]) => {
            html += `<div class="achievement-category-title">${categoryTitles[catId] || catId}</div>`;
            html += achievements.map(a => {
                const unlocked = !!state.unlockedAchievements[a.id];
                const date = unlocked ? new Date(state.unlockedAchievements[a.id]).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
                return `
                    <div class="achievement-card ${unlocked ? 'unlocked' : 'locked'}">
                        <div class="achievement-icon">${a.icon}</div>
                        <div class="achievement-info">
                            <div class="achievement-title">${esc(a.title)}</div>
                            <div class="achievement-desc">${esc(a.description)}</div>
                            ${unlocked ? `<div class="achievement-date">Unlocked ${date}</div>` : ''}
                        </div>
                    </div>`;
            }).join('');
        });

        dom.achievementsGrid.innerHTML = html;

        // Back button
        dom.achievementsBackButton.onclick = () => {
            window.location.hash = '';
            showHome();
        };
    }

    // --- Wider Reading ---
    function renderWiderReading() {
        const items = contentData.filter(i => ['pdf', 'gdoc', 'image'].includes(i.type));
        if (!items.length) { dom.widerReadingSection.style.display = 'none'; return; }

        const groups = {};
        items.forEach(i => {
            const cat = CATEGORIES[i.category];
            if (!groups[i.category]) groups[i.category] = { title: cat ? cat.title : 'Other', color: cat ? cat.color : '#9b1844', items: [] };
            groups[i.category].items.push(i);
        });

        let html = '';
        Object.entries(groups).forEach(([catId, group]) => {
            const iconSvg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`;

            html += `<div class="reading-group">`;
            html += `<h3 class="reading-group-title"><span class="reading-group-icon" style="background: color-mix(in srgb, ${group.color} 12%, transparent); color: ${group.color}">${iconSvg}</span>${esc(group.title)}</h3>`;
            html += `<div class="reading-items-grid">`;

            group.items.forEach(i => {
                const iconClass = i.type === 'pdf' ? 'icon-pdf' : i.type === 'image' ? 'icon-image' : 'icon-doc';
                const icon = i.type === 'pdf'
                    ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`
                    : i.type === 'image'
                    ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`
                    : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`;
                const typeLabel = i.type === 'pdf' ? 'PDF' : i.type === 'image' ? 'Image' : 'Google Doc';

                html += `
                    <div class="reading-item" data-id="${i.id}" data-drive-id="${i.driveFileId || ''}" data-type="${i.type}" data-title="${escAttr(i.title)}" style="--reading-color: ${group.color}">
                        <div class="reading-item-icon ${iconClass}">${icon}</div>
                        <div class="reading-item-body">
                            <div class="reading-item-title">${esc(i.title)}</div>
                            ${i.description ? `<div class="reading-item-desc">${esc(i.description)}</div>` : ''}
                            <div class="reading-item-type">${typeLabel}</div>
                        </div>
                        <div class="reading-item-arrow"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg></div>
                    </div>`;
            });
            html += `</div></div>`;
        });

        dom.readingList.innerHTML = html;
        dom.readingList.querySelectorAll('.reading-item').forEach(el => {
            el.addEventListener('click', () => {
                const type = el.dataset.type;
                const driveId = el.dataset.driveId;
                if (type === 'gdoc') window.open(`https://docs.google.com/document/d/${driveId}/edit`, '_blank');
                else if (driveId) openModal(el.dataset.id);
            });
        });
    }

    // --- Progress ---
    function renderProgress() {
        const allVideos = contentData.filter(i => i.type === 'video');
        const allWatched = allVideos.filter(i => isWatched(i.id)).length;
        const pct = allVideos.length > 0 ? Math.round((allWatched / allVideos.length) * 100) : 0;

        let html = `
            <div class="progress-card">
                <div class="progress-card-title">Overall</div>
                <div class="progress-card-value">${pct}%</div>
                <div class="progress-card-bar"><div class="progress-card-bar-fill" style="width:${pct}%;background:var(--color-magenta)"></div></div>
            </div>`;

        Object.entries(CATEGORIES).forEach(([id, cat]) => {
            const vids = contentData.filter(i => i.category === id && i.type === 'video');
            if (!vids.length) return;
            const w = vids.filter(i => isWatched(i.id)).length;
            const p = Math.round((w / vids.length) * 100);
            html += `
                <div class="progress-card">
                    <div class="progress-card-title">${cat.title}</div>
                    <div class="progress-card-value">${w}/${vids.length}</div>
                    <div class="progress-card-bar"><div class="progress-card-bar-fill" style="width:${p}%;background:${cat.color}"></div></div>
                </div>`;
        });

        dom.progressGrid.innerHTML = html;
    }

    // --- Thumbnail URL ---
    function getThumbnailUrl(item) {
        if (!item.driveFileId) return '';
        // Google Drive provides thumbnail images for files
        if (item.type === 'video') {
            return `https://drive.google.com/thumbnail?id=${item.driveFileId}&sz=w640`;
        }
        if (item.type === 'pdf' || item.type === 'image') {
            return `https://drive.google.com/thumbnail?id=${item.driveFileId}&sz=w640`;
        }
        return '';
    }

    // --- Content Card ---
    function renderContentCard(item) {
        const cat = CATEGORIES[item.category] || {};
        const watched = isWatched(item.id);
        const newBadge = isNew(item) ? '<span class="thumb-badge-new">New</span>' : '';
        const typeBadge = `<span class="thumb-badge-type type-${item.type}">${item.type}</span>`;
        const diffBadge = item.difficulty ? `<span class="meta-badge difficulty-${item.difficulty}">${cap(item.difficulty)}</span>` : '';
        const catBadge = cat.title ? `<span class="meta-badge">${cat.title}</span>` : '';
        const thumbUrl = getThumbnailUrl(item);

        // Build thumbnail: real image with fallback to placeholder
        const thumbContent = thumbUrl
            ? `<img class="content-card-thumb-img" src="${thumbUrl}" alt="${escAttr(item.title)}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
               <div class="content-card-thumb-placeholder" style="display:none;--cat-color: ${cat.color || '#9b1844'}">${typeIcon(item.type)}</div>`
            : `<div class="content-card-thumb-placeholder" style="--cat-color: ${cat.color || '#9b1844'}">${typeIcon(item.type)}</div>`;

        return `
            <div class="content-card tilt-card" data-id="${item.id}" style="--cat-color: ${cat.color || '#9b1844'}">
                <div class="content-card-thumb">
                    ${thumbContent}
                    ${newBadge}${typeBadge}
                    ${watched ? '<span class="thumb-badge-watched">&#10003;</span>' : ''}
                </div>
                <div class="content-card-body">
                    <div class="content-card-title">${esc(item.title)}</div>
                    ${item.description ? `<div class="content-card-desc">${esc(item.description)}</div>` : ''}
                    <div class="content-card-meta">${diffBadge}${catBadge}</div>
                </div>
                <div class="content-card-footer">
                    <label class="watched-indicator ${watched ? 'is-watched' : ''}" onclick="event.stopPropagation()">
                        <input type="checkbox" ${watched ? 'checked' : ''} data-watched-id="${item.id}">
                        <span>${watched ? 'Watched' : 'Mark as watched'}</span>
                    </label>
                    <button class="save-button ${isSaved(item.id) ? 'is-saved' : ''}" data-save-id="${item.id}" onclick="event.stopPropagation()">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                        <span>${isSaved(item.id) ? 'Saved' : 'Save'}</span>
                    </button>
                </div>
            </div>`;
    }

    // --- Series Card ---
    function renderSeriesCard(name, items, color) {
        const totalWatched = items.filter(i => isWatched(i.id)).length;
        const pct = items.length > 0 ? Math.round((totalWatched / items.length) * 100) : 0;

        return `
            <div class="series-card" style="--cat-color: ${color}">
                <div class="series-card-header">
                    <div class="series-card-title">${esc(name)}</div>
                    <div class="series-card-count">${items.length} video${items.length !== 1 ? 's' : ''} in this series · ${totalWatched}/${items.length} watched</div>
                    <div class="series-progress"><div class="series-progress-fill" style="width:${pct}%;background:${color}"></div></div>
                </div>
                ${items.map((item, i) => {
                    const w = isWatched(item.id);
                    const thumbUrl = getThumbnailUrl(item);
                    return `
                        <div class="series-item ${w ? 'series-item-done' : ''}" data-id="${item.id}">
                            <div class="series-number">${w ? '&#10003;' : i + 1}</div>
                            ${thumbUrl ? `<img class="series-item-thumb" src="${thumbUrl}" alt="" loading="lazy" onerror="this.style.display='none'">` : ''}
                            <div class="series-item-info">
                                <div class="series-item-title">${esc(item.title)}</div>
                                ${item.description ? `<div class="series-item-desc">${esc(item.description)}</div>` : ''}
                            </div>
                            <div class="series-item-watched" style="${w ? '' : 'display:none'}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg></div>
                        </div>`;
                }).join('')}
            </div>`;
    }

    // --- Listeners ---
    function attachCardListeners(container) {
        container.querySelectorAll('.content-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('.watched-indicator')) return;
                openModal(card.dataset.id);
            });
        });
        container.querySelectorAll('input[data-watched-id]').forEach(cb => {
            cb.addEventListener('change', (e) => { toggleWatched(cb.dataset.watchedId, e); });
        });
    }

    function attachSaveListeners(container) {
        container.querySelectorAll('.save-button[data-save-id]').forEach(btn => {
            btn.addEventListener('click', (e) => { toggleSaved(btn.dataset.saveId, e); });
        });
    }

    function attachSeriesListeners(container) {
        container.querySelectorAll('.series-item').forEach(el => {
            el.addEventListener('click', () => { openModal(el.dataset.id); });
        });
    }

    // --- Modal ---
    function initModal() {
        dom.modalClose.addEventListener('click', closeModal);
        dom.videoModal.addEventListener('click', (e) => { if (e.target === dom.videoModal) closeModal(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
        dom.backButton.addEventListener('click', () => { window.location.hash = ''; showHome(); });
    }

    function openModal(itemId) {
        const item = contentData.find(i => i.id === itemId);
        if (!item) return;

        dom.modalTitle.textContent = item.title;

        if (item.type === 'gdoc') {
            dom.videoContainer.innerHTML = `<iframe src="https://docs.google.com/document/d/${item.driveFileId}/preview" allow="autoplay"></iframe>`;
        } else if (item.driveFileId) {
            dom.videoContainer.innerHTML = `<iframe src="https://drive.google.com/file/d/${item.driveFileId}/preview" allow="autoplay"></iframe>`;
        } else {
            dom.videoContainer.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#999;position:absolute;inset:0">Content not available for preview</div>`;
        }

        let meta = '';
        if (item.description) meta += `<p class="modal-meta-desc">${esc(item.description)}</p>`;
        if (item.tags && item.tags.length) meta += `<div class="modal-meta-tags">${item.tags.map(t => `<span class="meta-badge">${esc(t)}</span>`).join('')}</div>`;
        dom.modalMeta.innerHTML = meta;

        // XP hint
        const xpAmount = item.type === 'video' ? 25 : 15;
        dom.modalXPHint.innerHTML = isWatched(itemId)
            ? '<span style="color:var(--color-green);font-size:0.82rem;font-weight:600">&#10003; Completed</span>'
            : `<span class="xp-sparkle">+${xpAmount} XP</span>`;

        dom.modalWatchedCheckbox.checked = isWatched(itemId);
        dom.modalWatchedCheckbox.onchange = (e) => {
            toggleWatched(itemId, e);
            dom.modalWatchedCheckbox.checked = isWatched(itemId);
            dom.modalXPHint.innerHTML = isWatched(itemId)
                ? '<span style="color:var(--color-green);font-size:0.82rem;font-weight:600">&#10003; Completed</span>'
                : `<span class="xp-sparkle">+${xpAmount} XP</span>`;
        };

        dom.videoModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        dom.videoModal.classList.remove('active');
        dom.videoContainer.innerHTML = '';
        document.body.style.overflow = '';
    }

    // --- Utils ---
    function esc(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
    function escAttr(s) { return s.replace(/"/g, '&quot;').replace(/'/g, '&#39;'); }
    function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

    function typeIcon(type) {
        const icons = {
            video: `<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>`,
            pdf: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`,
            image: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,
            audio: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
            gdoc: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`
        };
        return icons[type] || icons.pdf;
    }

    // --- Launch ---
    document.addEventListener('DOMContentLoaded', init);
})();
