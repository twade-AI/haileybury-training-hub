/* ============================================
   Haileybury Tech Tips Training Hub
   Main Application Script
   ============================================ */

(function () {
    'use strict';

    // --- Category Definitions ---
    const CATEGORIES = {
        'ai-tools': {
            title: 'AI Tools & Techniques',
            color: '#2a2b7c',
            icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a4 4 0 0 1 4 4v2h2a2 2 0 0 1 2 2v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-8a2 2 0 0 1 2-2h2V6a4 4 0 0 1 4-4z"/><circle cx="9" cy="14" r="1.5"/><circle cx="15" cy="14" r="1.5"/></svg>`
        },
        'google-workspace': {
            title: 'Google Workspace',
            color: '#009fe3',
            icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>`
        },
        'classroom-devices': {
            title: 'Classroom & Devices',
            color: '#009870',
            icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`
        },
        'pressreader-library': {
            title: 'PressReader & Library',
            color: '#ec6608',
            icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`
        },
        'support-reference': {
            title: 'Support & Reference',
            color: '#e6007e',
            icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`
        }
    };

    // --- Reading Category Groups ---
    const READING_GROUPS = {
        'policies': {
            title: 'Policies & Guidelines',
            icon: 'doc',
            matcher: (item) => item.tags && item.tags.some(t => ['policy', 'acceptable-use', 'guidelines', 'planning'].includes(t.toLowerCase()))
        },
        'ai-reference': {
            title: 'AI Reference Materials',
            icon: 'doc',
            matcher: (item) => item.tags && item.tags.some(t => ['ai', 'ai-scale', 'assessment'].includes(t.toLowerCase()))
        },
        'how-to-guides': {
            title: 'How-To Guides',
            icon: 'pdf',
            matcher: (item) => item.tags && item.tags.some(t => ['guide', 'how-to', 'setup', 'pressreader', 'sidecar'].includes(t.toLowerCase()))
        },
        'visual-resources': {
            title: 'Visual Resources & Diagrams',
            icon: 'image',
            matcher: (item) => item.type === 'image'
        }
    };

    // --- Welcome Tips ---
    const WELCOME_TIPS = [
        "Did you know? You can mark videos as watched to track your progress across all categories.",
        "Try using the search bar to quickly find training on any tool or topic.",
        "New to Haileybury tech? Check out the Start Here section for essential guides.",
        "Use Gemini in Google Workspace to draft emails, create slides, and more.",
        "Brisk can help you mark work faster with AI-powered feedback.",
        "PressReader gives you access to thousands of newspapers and magazines for free.",
        "NotebookLM can create flashcards, mind maps and audio overviews from your documents."
    ];

    // --- Filter Chip Definitions ---
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
    let currentView = 'home'; // 'home', 'category', 'search'
    let currentCategory = null;
    let activeFilter = 'all';
    let watchedItems = {};

    // --- DOM Elements ---
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    const dom = {
        darkModeToggle: $('#darkModeToggle'),
        heroSection: $('#heroSection'),
        heroStats: $('#heroStats'),
        welcomeBanner: $('#welcomeBanner'),
        welcomeText: $('#welcomeText'),
        welcomeDismiss: $('#welcomeDismiss'),
        searchInput: $('#searchInput'),
        searchClear: $('#searchClear'),
        filterChips: $('#filterChips'),
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
        widerReadingSection: $('#widerReadingSection'),
        readingList: $('#readingList'),
        progressSection: $('#progressSection'),
        progressGrid: $('#progressGrid'),
        videoModal: $('#videoModal'),
        modalTitle: $('#modalTitle'),
        modalClose: $('#modalClose'),
        videoContainer: $('#videoContainer'),
        modalMeta: $('#modalMeta'),
        modalWatchedCheckbox: $('#modalWatchedCheckbox')
    };

    // --- Init ---
    async function init() {
        loadWatchedState();
        initDarkMode();
        initWelcomeBanner();
        initSearch();
        initFilterChips();
        initModal();
        initRouting();

        try {
            const resp = await fetch('data/content.json');
            contentData = await resp.json();
            renderApp();
        } catch (err) {
            console.error('Failed to load content data:', err);
            dom.categoryGrid.innerHTML = '<div class="empty-state"><p>Unable to load training content. Please check that data/content.json exists.</p></div>';
        }
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
            localStorage.setItem('tt-dark-mode', !isDark);
        });
    }

    // --- Welcome Banner ---
    function initWelcomeBanner() {
        const dismissed = sessionStorage.getItem('tt-welcome-dismissed');
        if (dismissed) {
            dom.welcomeBanner.classList.add('hidden');
            return;
        }
        const tip = WELCOME_TIPS[Math.floor(Math.random() * WELCOME_TIPS.length)];
        dom.welcomeText.textContent = tip;
        dom.welcomeDismiss.addEventListener('click', () => {
            dom.welcomeBanner.classList.add('hidden');
            sessionStorage.setItem('tt-welcome-dismissed', 'true');
        });
    }

    // --- Search ---
    function initSearch() {
        let debounceTimer;
        dom.searchInput.addEventListener('input', () => {
            const query = dom.searchInput.value.trim();
            dom.searchClear.classList.toggle('visible', query.length > 0);
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                if (query.length >= 2) {
                    showSearchResults(query);
                } else if (query.length === 0) {
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
        dom.filterChips.innerHTML = FILTER_CHIPS.map(chip =>
            `<button class="filter-chip ${chip.className || ''} ${chip.id === 'all' ? 'active' : ''}" data-filter="${chip.id}">${chip.label}</button>`
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
            watchedItems = JSON.parse(localStorage.getItem('tt-watched') || '{}');
        } catch {
            watchedItems = {};
        }
    }

    function toggleWatched(id) {
        if (watchedItems[id]) {
            delete watchedItems[id];
        } else {
            watchedItems[id] = Date.now();
        }
        localStorage.setItem('tt-watched', JSON.stringify(watchedItems));
        renderCurrentView();
    }

    function isWatched(id) {
        return !!watchedItems[id];
    }

    // --- Filtering ---
    function filterContent(items) {
        if (activeFilter === 'all') return items;
        return items.filter(item => {
            switch (activeFilter) {
                case 'new': return isNew(item);
                case 'video': return item.type === 'video';
                case 'pdf': return item.type === 'pdf';
                case 'ai': return item.tags && item.tags.some(t => ['ai', 'gemini', 'brisk', 'notebooklm', 'chatgpt', 'gpt', 'perplexity', 'magicschool', 'diffit', 'cove'].includes(t.toLowerCase()));
                case 'google': return item.tags && item.tags.some(t => ['google', 'gmail', 'classroom', 'slides', 'docs', 'forms', 'calendar', 'workspace'].includes(t.toLowerCase()));
                case 'beginner': return item.difficulty === 'beginner';
                default: return true;
            }
        });
    }

    function isNew(item) {
        if (!item.dateAdded) return false;
        const added = new Date(item.dateAdded);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return added >= thirtyDaysAgo;
    }

    // --- Routing ---
    function initRouting() {
        window.addEventListener('hashchange', handleRoute);
        handleRoute();
    }

    function handleRoute() {
        const hash = window.location.hash.slice(1);
        if (hash.startsWith('category/')) {
            const cat = hash.replace('category/', '');
            showCategoryDetail(cat);
        } else if (hash.startsWith('search/')) {
            const query = decodeURIComponent(hash.replace('search/', ''));
            dom.searchInput.value = query;
            showSearchResults(query);
        } else {
            showHome();
        }
    }

    // --- Views ---
    function showHome() {
        currentView = 'home';
        currentCategory = null;
        dom.heroSection.style.display = '';
        dom.startHereSection.style.display = '';
        dom.categoriesSection.style.display = '';
        dom.categoryDetail.style.display = 'none';
        dom.searchResults.style.display = 'none';
        dom.widerReadingSection.style.display = '';
        dom.progressSection.style.display = '';
        if (window.location.hash) {
            history.pushState(null, '', window.location.pathname);
        }
    }

    function showCategoryDetail(categoryId) {
        if (!CATEGORIES[categoryId]) return showHome();
        currentView = 'category';
        currentCategory = categoryId;
        dom.heroSection.style.display = 'none';
        dom.startHereSection.style.display = 'none';
        dom.categoriesSection.style.display = 'none';
        dom.categoryDetail.style.display = '';
        dom.searchResults.style.display = 'none';
        dom.widerReadingSection.style.display = 'none';
        dom.progressSection.style.display = 'none';
        renderCategoryDetail(categoryId);
    }

    function showSearchResults(query) {
        currentView = 'search';
        dom.heroSection.style.display = 'none';
        dom.startHereSection.style.display = 'none';
        dom.categoriesSection.style.display = 'none';
        dom.categoryDetail.style.display = 'none';
        dom.searchResults.style.display = '';
        dom.widerReadingSection.style.display = 'none';
        dom.progressSection.style.display = 'none';
        renderSearchResults(query);
    }

    function renderCurrentView() {
        if (currentView === 'category' && currentCategory) {
            renderCategoryDetail(currentCategory);
        } else if (currentView === 'search') {
            renderSearchResults(dom.searchInput.value.trim());
        } else {
            renderApp();
        }
    }

    // --- Render App ---
    function renderApp() {
        renderHeroStats();
        renderFeatured();
        renderCategories();
        renderWiderReading();
        renderProgress();
    }

    // --- Render Hero Stats ---
    function renderHeroStats() {
        const videoCount = contentData.filter(i => i.type === 'video').length;
        const categoryCount = Object.keys(CATEGORIES).length;
        const readingCount = contentData.filter(i => i.type === 'pdf' || i.type === 'gdoc' || i.type === 'image').length;

        dom.heroStats.innerHTML = `
            <div class="hero-stat">
                <div class="hero-stat-value">${videoCount}</div>
                <div class="hero-stat-label">Videos</div>
            </div>
            <div class="hero-stat">
                <div class="hero-stat-value">${categoryCount}</div>
                <div class="hero-stat-label">Categories</div>
            </div>
            <div class="hero-stat">
                <div class="hero-stat-value">${readingCount}</div>
                <div class="hero-stat-label">Guides & Docs</div>
            </div>
        `;
    }

    // --- Render Featured ---
    function renderFeatured() {
        const featured = contentData.filter(item => item.featured);
        if (featured.length === 0) {
            dom.startHereSection.style.display = 'none';
            return;
        }
        dom.startHereSection.style.display = '';
        dom.featuredGrid.innerHTML = featured.map(item => renderContentCard(item)).join('');
        attachCardListeners(dom.featuredGrid);
    }

    // --- Render Categories ---
    function renderCategories() {
        dom.categoryGrid.innerHTML = Object.entries(CATEGORIES).map(([id, cat]) => {
            const items = contentData.filter(item => item.category === id);
            const watchedCount = items.filter(item => isWatched(item.id)).length;
            const progress = items.length > 0 ? Math.round((watchedCount / items.length) * 100) : 0;

            return `
                <div class="category-card" data-category="${id}" style="--cat-color: ${cat.color}">
                    <div class="category-card-icon">${cat.icon}</div>
                    <div class="category-card-title">${cat.title}</div>
                    <div class="category-card-count">${items.length} resource${items.length !== 1 ? 's' : ''}</div>
                    <div class="category-card-progress">
                        <div class="category-card-progress-bar" style="width: ${progress}%"></div>
                    </div>
                </div>
            `;
        }).join('');

        dom.categoryGrid.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', () => {
                const cat = card.dataset.category;
                window.location.hash = `category/${cat}`;
            });
        });
    }

    // --- Render Category Detail ---
    function renderCategoryDetail(categoryId) {
        const cat = CATEGORIES[categoryId];
        const items = filterContent(contentData.filter(item => item.category === categoryId));

        dom.categoryDetailHeader.innerHTML = `
            <h2 class="category-detail-title" style="color: ${cat.color}">${cat.title}</h2>
            <p class="category-detail-count">${items.length} resource${items.length !== 1 ? 's' : ''}</p>
        `;

        // Group series items
        const seriesMap = {};
        const standalone = [];

        items.forEach(item => {
            if (item.series) {
                if (!seriesMap[item.series]) seriesMap[item.series] = [];
                seriesMap[item.series].push(item);
            } else {
                standalone.push(item);
            }
        });

        // Sort series items by seriesOrder
        Object.values(seriesMap).forEach(series => {
            series.sort((a, b) => (a.seriesOrder || 0) - (b.seriesOrder || 0));
        });

        let html = '';

        // Render series cards
        Object.entries(seriesMap).forEach(([seriesName, seriesItems]) => {
            html += renderSeriesCard(seriesName, seriesItems, cat.color);
        });

        // Render standalone cards
        html += standalone.map(item => renderContentCard(item)).join('');

        if (html === '') {
            html = '<div class="empty-state"><p>No resources match the current filter.</p></div>';
        }

        dom.categoryContentGrid.innerHTML = html;
        attachCardListeners(dom.categoryContentGrid);
        attachSeriesListeners(dom.categoryContentGrid);
    }

    // --- Render Search Results ---
    function renderSearchResults(query) {
        const q = query.toLowerCase();
        const results = filterContent(contentData.filter(item => {
            const titleMatch = item.title.toLowerCase().includes(q);
            const descMatch = item.description && item.description.toLowerCase().includes(q);
            const tagMatch = item.tags && item.tags.some(t => t.toLowerCase().includes(q));
            return titleMatch || descMatch || tagMatch;
        }));

        dom.searchResultsTitle.textContent = `Search Results (${results.length})`;

        if (results.length === 0) {
            dom.searchResultsGrid.innerHTML = `<div class="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <p>No results found for "${query}"</p>
            </div>`;
            return;
        }

        dom.searchResultsGrid.innerHTML = results.map(item => renderContentCard(item)).join('');
        attachCardListeners(dom.searchResultsGrid);
    }

    // --- Render Wider Reading (Grouped) ---
    function renderWiderReading() {
        const readingItems = contentData.filter(item =>
            item.type === 'pdf' || item.type === 'gdoc' || item.type === 'image'
        );

        if (readingItems.length === 0) {
            dom.widerReadingSection.style.display = 'none';
            return;
        }

        // Group items by category
        const groups = {};
        readingItems.forEach(item => {
            const cat = CATEGORIES[item.category];
            const catTitle = cat ? cat.title : 'Other Resources';
            if (!groups[item.category]) {
                groups[item.category] = {
                    title: catTitle,
                    color: cat ? cat.color : '#9b1844',
                    items: []
                };
            }
            groups[item.category].items.push(item);
        });

        let html = '';

        Object.entries(groups).forEach(([catId, group]) => {
            const cat = CATEGORIES[catId];
            const iconSvg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`;

            html += `<div class="reading-group">`;
            html += `<h3 class="reading-group-title">
                <span class="reading-group-icon" style="background: color-mix(in srgb, ${group.color} 12%, transparent); color: ${group.color}">${iconSvg}</span>
                ${escapeHtml(group.title)}
            </h3>`;
            html += `<div class="reading-items-grid">`;

            group.items.forEach(item => {
                const iconClass = item.type === 'pdf' ? 'icon-pdf' : item.type === 'image' ? 'icon-image' : 'icon-doc';
                const icon = item.type === 'pdf'
                    ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`
                    : item.type === 'image'
                    ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`
                    : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`;

                const typeLabel = item.type === 'pdf' ? 'PDF Document' : item.type === 'image' ? 'Image' : 'Google Doc';

                html += `
                    <div class="reading-item" data-id="${item.id}" data-drive-id="${item.driveFileId}" data-type="${item.type}" data-title="${escapeAttr(item.title)}" style="--reading-color: ${group.color}">
                        <div class="reading-item-icon ${iconClass}">${icon}</div>
                        <div class="reading-item-body">
                            <div class="reading-item-title">${escapeHtml(item.title)}</div>
                            ${item.description ? `<div class="reading-item-desc">${escapeHtml(item.description)}</div>` : ''}
                            <div class="reading-item-type">${typeLabel}</div>
                        </div>
                        <div class="reading-item-arrow">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
                        </div>
                    </div>
                `;
            });

            html += `</div></div>`;
        });

        dom.readingList.innerHTML = html;

        dom.readingList.querySelectorAll('.reading-item').forEach(item => {
            item.addEventListener('click', () => {
                const driveId = item.dataset.driveId;
                const title = item.dataset.title;
                const type = item.dataset.type;
                if (type === 'gdoc') {
                    window.open(`https://docs.google.com/document/d/${driveId}/edit`, '_blank');
                } else {
                    openModal(item.dataset.id);
                }
            });
        });
    }

    // --- Render Progress ---
    function renderProgress() {
        const totalItems = contentData.filter(i => i.type === 'video').length;
        const totalWatched = contentData.filter(i => i.type === 'video' && isWatched(i.id)).length;
        const overallProgress = totalItems > 0 ? Math.round((totalWatched / totalItems) * 100) : 0;

        let html = `
            <div class="progress-card">
                <div class="progress-card-title">Overall Progress</div>
                <div class="progress-card-value">${overallProgress}%</div>
                <div class="progress-card-bar">
                    <div class="progress-card-bar-fill" style="width: ${overallProgress}%; background: var(--color-magenta)"></div>
                </div>
            </div>
        `;

        Object.entries(CATEGORIES).forEach(([id, cat]) => {
            const items = contentData.filter(i => i.category === id && i.type === 'video');
            const watched = items.filter(i => isWatched(i.id)).length;
            const progress = items.length > 0 ? Math.round((watched / items.length) * 100) : 0;
            html += `
                <div class="progress-card">
                    <div class="progress-card-title">${cat.title}</div>
                    <div class="progress-card-value">${watched}/${items.length}</div>
                    <div class="progress-card-bar">
                        <div class="progress-card-bar-fill" style="width: ${progress}%; background: ${cat.color}"></div>
                    </div>
                </div>
            `;
        });

        dom.progressGrid.innerHTML = html;
    }

    // --- Render Content Card ---
    function renderContentCard(item) {
        const cat = CATEGORIES[item.category] || {};
        const watched = isWatched(item.id);
        const newBadge = isNew(item) ? '<span class="thumb-badge-new">New</span>' : '';
        const typeBadge = `<span class="thumb-badge-type type-${item.type}">${item.type}</span>`;
        const durationBadge = item.duration ? `<span class="thumb-badge">${item.duration}</span>` : '';

        const placeholder = `<div class="content-card-thumb-placeholder" style="--cat-color: ${cat.color || '#9b1844'}">
            ${getTypeIcon(item.type)}
        </div>`;

        const difficultyBadge = item.difficulty
            ? `<span class="meta-badge difficulty-${item.difficulty}">${capitalize(item.difficulty)}</span>`
            : '';

        return `
            <div class="content-card" data-id="${item.id}" style="--cat-color: ${cat.color || '#9b1844'}">
                <div class="content-card-thumb" style="--cat-color: ${cat.color || '#9b1844'}">
                    ${placeholder}
                    ${newBadge}
                    ${typeBadge}
                    ${durationBadge}
                </div>
                <div class="content-card-body">
                    <div class="content-card-title">${escapeHtml(item.title)}</div>
                    ${item.description ? `<div class="content-card-desc">${escapeHtml(item.description)}</div>` : ''}
                    <div class="content-card-meta">
                        ${difficultyBadge}
                    </div>
                </div>
                <div class="content-card-footer">
                    <label class="watched-indicator ${watched ? 'is-watched' : ''}" onclick="event.stopPropagation()">
                        <input type="checkbox" ${watched ? 'checked' : ''} data-watched-id="${item.id}">
                        <span>${watched ? 'Watched' : 'Mark as watched'}</span>
                    </label>
                </div>
            </div>
        `;
    }

    // --- Render Series Card ---
    function renderSeriesCard(seriesName, items, color) {
        return `
            <div class="series-card" style="--cat-color: ${color}">
                <div class="series-card-header">
                    <div class="series-card-title">${escapeHtml(seriesName)}</div>
                    <div class="series-card-count">${items.length} video${items.length !== 1 ? 's' : ''} in this series</div>
                </div>
                ${items.map((item, i) => {
                    const watched = isWatched(item.id);
                    return `
                        <div class="series-item" data-id="${item.id}">
                            <div class="series-number">${i + 1}</div>
                            <div class="series-item-info">
                                <div class="series-item-title">${escapeHtml(item.title)}</div>
                                ${item.description ? `<div class="series-item-desc">${escapeHtml(item.description)}</div>` : ''}
                            </div>
                            ${watched ? `<div class="series-item-watched"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg></div>` : ''}
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    // --- Attach Listeners ---
    function attachCardListeners(container) {
        container.querySelectorAll('.content-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('.watched-indicator')) return;
                openModal(card.dataset.id);
            });
        });

        container.querySelectorAll('input[data-watched-id]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                e.stopPropagation();
                toggleWatched(checkbox.dataset.watchedId);
            });
        });
    }

    function attachSeriesListeners(container) {
        container.querySelectorAll('.series-item').forEach(item => {
            item.addEventListener('click', () => {
                openModal(item.dataset.id);
            });
        });
    }

    // --- Modal ---
    function initModal() {
        dom.modalClose.addEventListener('click', closeModal);
        dom.videoModal.addEventListener('click', (e) => {
            if (e.target === dom.videoModal) closeModal();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeModal();
        });
        dom.backButton.addEventListener('click', () => {
            window.location.hash = '';
            showHome();
        });
    }

    function openModal(itemId) {
        const item = contentData.find(i => i.id === itemId);
        if (!item) return;

        dom.modalTitle.textContent = item.title;

        // Set embed content
        if (item.type === 'gdoc') {
            dom.videoContainer.innerHTML = `<iframe src="https://docs.google.com/document/d/${item.driveFileId}/preview" allow="autoplay"></iframe>`;
        } else {
            dom.videoContainer.innerHTML = `<iframe src="https://drive.google.com/file/d/${item.driveFileId}/preview" allow="autoplay"></iframe>`;
        }

        // Meta info
        let metaHtml = '';
        if (item.description) {
            metaHtml += `<p class="modal-meta-desc">${escapeHtml(item.description)}</p>`;
        }
        if (item.tags && item.tags.length > 0) {
            metaHtml += `<div class="modal-meta-tags">${item.tags.map(t => `<span class="meta-badge">${escapeHtml(t)}</span>`).join('')}</div>`;
        }
        dom.modalMeta.innerHTML = metaHtml;

        // Watched checkbox
        dom.modalWatchedCheckbox.checked = isWatched(itemId);
        dom.modalWatchedCheckbox.onchange = () => {
            toggleWatched(itemId);
            dom.modalWatchedCheckbox.checked = isWatched(itemId);
        };

        dom.videoModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        dom.videoModal.classList.remove('active');
        dom.videoContainer.innerHTML = '';
        document.body.style.overflow = '';
    }

    // --- Utilities ---
    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function escapeAttr(str) {
        return str.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function getTypeIcon(type) {
        switch (type) {
            case 'video':
                return `<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
            case 'pdf':
                return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`;
            case 'image':
                return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`;
            case 'audio':
                return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`;
            case 'gdoc':
                return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`;
            default:
                return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
        }
    }

    // --- Launch ---
    document.addEventListener('DOMContentLoaded', init);
})();
