// =========================================================
// ELIFSU GENÇ PORTFOLIO — RELATED PROJECTS & PROGRESSIVE SCROLL REVEAL
// Progressively loads more projects upon deliberate scroll gestures,
// preventing abrupt redirects and allowing intuitive browsing.
// =========================================================

(function() {
    'use strict';

    if (window.__portfolioRelatedProjectsInitialized) return;
    window.__portfolioRelatedProjectsInitialized = true;

    const ALL_PROJECTS_DATA = {
        'emek-museum': {
            id: 'emek-museum',
            num: '01',
            title: 'EMEK MUSEUM',
            year: '2026',
            question: 'How can we make this labour visible again?',
            img: '../../assets/emek-museum-wip.svg',
            url: '../emek-museum/',
            related: ['chronoclines', 'fire-escape-simulation', 'stray']
        },
        'stray': {
            id: 'stray',
            num: '02',
            title: 'STRAY',
            year: '2025',
            question: 'Is doing nothing doing something?',
            img: '../../assets/stray-project.png',
            url: '../stray/',
            related: ['the-earthen', 'you-were-here', 'emek-museum']
        },
        'you-were-here': {
            id: 'you-were-here',
            num: '03',
            title: 'YOU WERE HERE.',
            year: '2026',
            question: 'What remains of the movements we forget in the attention economy?',
            img: '../../assets/you-were-here-cover.png',
            url: '../you-were-here/',
            related: ['stray', 'fire-escape-simulation', 'ara-sira']
        },
        'chronoclines': {
            id: 'chronoclines',
            num: '04',
            title: 'CHRONOCLINES',
            year: '2025',
            question: 'Can a city exhibit itself?',
            img: '../../assets/chronoclines-cover.jpg',
            url: '../chronoclines/',
            related: ['emek-museum', 'millieu', 'fire-escape-simulation']
        },
        'millieu': {
            id: 'millieu',
            num: '05',
            title: 'MILLIEU',
            year: '2026',
            question: 'How does a culinary ritual shape a social atmosphere?',
            img: '../../assets/millieu-cover.png',
            url: '../millieu/',
            related: ['bajo-la-fresca', 'wood-weave', 'chronoclines']
        },
        'sprouting-garden': {
            id: 'sprouting-garden',
            num: '06',
            title: 'SPROUTING GARDEN',
            year: '2024',
            question: 'Can we build without displacing life?',
            img: '../../assets/sprouting-garden-cover.png',
            url: '../sprouting-garden/',
            related: ['bio-decay', 'bajo-la-fresca', 'the-earthen']
        },
        'bajo-la-fresca': {
            id: 'bajo-la-fresca',
            num: '07',
            title: 'BAJO LA FRESCA',
            year: '2026',
            question: 'How do you highlight beauty without stealing its spotlight?',
            img: '../../assets/bajo-la-fresca-hero.jpg',
            url: '../bajo-la-fresca/',
            related: ['wood-weave', 'sprouting-garden', 'millieu']
        },
        'wood-weave': {
            id: 'wood-weave',
            num: '08',
            title: 'WOOD WEAVE',
            year: '2024',
            question: 'When does waste become a place?',
            img: '../../assets/wood-weave-cover.png',
            url: '../wood-weave/',
            related: ['ara-sira', 'bajo-la-fresca', 'the-earthen']
        },
        'ara-sira': {
            id: 'ara-sira',
            num: '09',
            title: 'ARA-SIRA',
            year: '2024',
            question: 'Can one space hold both play and quiet?',
            img: '../../assets/ara-sira-cover.jpg?v=20261104-hq',
            url: '../ara-sira/',
            related: ['wood-weave', 'you-were-here', 'bajo-la-fresca']
        },
        'the-earthen': {
            id: 'the-earthen',
            num: '10',
            title: 'THE EARTHEN',
            year: '2026',
            question: 'Is there life because there is death?',
            img: '../../assets/the-earthen-cover.png',
            url: '../the-earthen/',
            related: ['stray', 'bio-decay', 'emek-museum']
        },
        'bio-decay': {
            id: 'bio-decay',
            num: '11',
            title: 'BIO-DECAY',
            year: '2025',
            question: 'How many microplastics can we eat in a day?',
            img: '../../assets/bio-decay-cover.png',
            url: '../bio-decay/',
            related: ['sprouting-garden', 'the-earthen', 'fire-escape-simulation']
        },
        'fire-escape-simulation': {
            id: 'fire-escape-simulation',
            num: '12',
            title: 'FIRE ESCAPE SIMULATION',
            year: '2026',
            question: 'Can you escape the fire?',
            img: '../../assets/fire-escape-wip.svg',
            url: '../fire-escape-simulation/',
            related: ['you-were-here', 'emek-museum', 'chronoclines']
        }
    };

    const CANONICAL_SLUG_ORDER = [
        'emek-museum', 'stray', 'you-were-here', 'chronoclines',
        'millieu', 'sprouting-garden', 'bajo-la-fresca', 'wood-weave',
        'ara-sira', 'the-earthen', 'bio-decay', 'fire-escape-simulation'
    ];

    function getCurrentSlug() {
        const path = window.location.pathname.replace(/\/index\.html$/, '').replace(/\/$/, '');
        const segments = path.split('/');
        const lastSegment = segments[segments.length - 1] || '';
        if (ALL_PROJECTS_DATA[lastSegment]) return lastSegment;

        for (const slug of Object.keys(ALL_PROJECTS_DATA)) {
            if (window.location.pathname.includes('/' + slug)) return slug;
        }
        return 'ara-sira';
    }

    function renderRelatedProjectsTile(p, isAnimated = false) {
        return `
            <article class="sq-cell sq-project-tile ${isAnimated ? 'is-revealed' : ''}" data-proj-id="${p.id}">
                <a href="${p.url}" class="sq-tile-link">
                    <div class="sq-img-box">
                        <img src="${p.img}" alt="${p.title}" class="sq-tile-img" loading="lazy">
                    </div>
                    <div class="sq-caption">
                        <p class="sq-question">${p.question}</p>
                        <div class="sq-title-bar">
                            <span class="sq-title">${p.num} &mdash; ${p.title}</span>
                            <span class="sq-year-tag">${p.year}</span>
                        </div>
                    </div>
                </a>
            </article>
        `;
    }

    function initRelatedProjects() {
        const currentSlug = getCurrentSlug();
        const currentData = ALL_PROJECTS_DATA[currentSlug];
        if (!currentData) return;

        if (document.getElementById('related-projects-section')) return;

        const mainContainer = document.querySelector('.project-page-container') || document.querySelector('main');
        if (!mainContainer) return;

        // Build the ordered list of all 11 other projects:
        // 1. First 3 are the curated related projects
        // 2. Next are remaining projects in canonical order
        const relatedSet = new Set(currentData.related || []);
        const firstBatch = Array.from(relatedSet).map(s => ALL_PROJECTS_DATA[s]).filter(Boolean);

        const remainingProjects = CANONICAL_SLUG_ORDER
            .filter(s => s !== currentSlug && !relatedSet.has(s))
            .map(s => ALL_PROJECTS_DATA[s])
            .filter(Boolean);

        // All 11 projects in presentation order
        const allOtherProjects = [...firstBatch, ...remainingProjects];
        
        // Initial state: show first 3
        let revealedCount = Math.min(3, allOtherProjects.length);

        const section = document.createElement('section');
        section.className = 'project-section related-projects-section';
        section.id = 'related-projects-section';

        section.innerHTML = `
            <div class="section-badge-header">
                <span class="sec-index">//</span>
                <span class="sec-title">RELATED PROJECTS // EXPLORE THE CONSTELLATION</span>
            </div>

            <div class="related-projects-grid" id="relatedProjectsGrid">
                ${allOtherProjects.slice(0, revealedCount).map(p => renderRelatedProjectsTile(p, false)).join('')}
            </div>

            <div class="scroll-to-all-zone" id="scrollToAllZone">
                <button type="button" class="scroll-to-all-pill" id="relatedScrollPill">
                    <span class="scroll-to-all-dot"></span>
                    <span class="scroll-to-all-text" id="relatedScrollText">SCROLL DOWN FOR MORE PROJECTS (${revealedCount}/${allOtherProjects.length})</span>
                    <span class="scroll-cue-progress-track">
                        <span class="scroll-cue-progress-bar" id="relatedProgressBar" style="width: 0%;"></span>
                    </span>
                    <span class="scroll-to-all-arrow">&darr;</span>
                </button>
            </div>
        `;

        const footerNav = mainContainer.querySelector('.footer-nav-btn')?.closest('div') ||
                          mainContainer.querySelector('.project-footer') ||
                          mainContainer.querySelector('footer');

        if (footerNav && footerNav.parentNode === mainContainer) {
            mainContainer.insertBefore(section, footerNav);
        } else {
            mainContainer.appendChild(section);
        }

        setupDeliberateScrollReveal(allOtherProjects, revealedCount);
    }

    function setupDeliberateScrollReveal(allOtherProjects, initialCount) {
        let currentCount = initialCount;
        const total = allOtherProjects.length;
        const gridEl = document.getElementById('relatedProjectsGrid');
        const pillEl = document.getElementById('relatedScrollPill');
        const textEl = document.getElementById('relatedScrollText');
        const progressEl = document.getElementById('relatedProgressBar');

        let scrollEffort = 0;
        const EFFORT_THRESHOLD = 320; // Requires multiple deliberate scroll actions to fill
        let lastScrollTime = 0;
        let isTransitioning = false;

        function updatePillState() {
            if (!pillEl || !textEl) return;

            if (currentCount < total) {
                textEl.textContent = `SCROLL DOWN FOR MORE PROJECTS (${currentCount}/${total})`;
                if (progressEl) {
                    const pct = Math.min(100, Math.round((scrollEffort / EFFORT_THRESHOLD) * 100));
                    progressEl.style.width = pct + '%';
                }
            } else {
                pillEl.classList.add('is-all-loaded');
                textEl.textContent = `ALL 12 STARS DISPLAYED • ENTER ALL PROJECTS`;
                if (progressEl) progressEl.style.width = '100%';
                const arrowEl = pillEl.querySelector('.scroll-to-all-arrow');
                if (arrowEl) arrowEl.innerHTML = '&rarr;';
            }
        }

        function revealNextBatch() {
            if (currentCount >= total || isTransitioning) return;
            isTransitioning = true;
            scrollEffort = 0;

            // Load next batch: 3 projects
            const nextCount = Math.min(total, currentCount + 3);
            const newProjects = allOtherProjects.slice(currentCount, nextCount);
            currentCount = nextCount;

            const tempContainer = document.createElement('div');
            tempContainer.innerHTML = newProjects.map(p => renderRelatedProjectsTile(p, true)).join('');

            while (tempContainer.firstElementChild) {
                gridEl.appendChild(tempContainer.firstElementChild);
            }

            updatePillState();

            setTimeout(() => {
                isTransitioning = false;
            }, 350);
        }

        function navigateToAllProjects() {
            if (isTransitioning) return;
            isTransitioning = true;

            try {
                sessionStorage.setItem('portfolio_return_tab', 'projects');
                sessionStorage.setItem('portfolio_return_origin', 'projects');
            } catch (_) {}

            if (textEl) textEl.textContent = 'ENTERING ALL PROJECTS...';
            if (pillEl) pillEl.classList.add('is-triggering');

            document.body.style.transition = 'opacity 0.26s ease';
            document.body.style.opacity = '0.5';

            setTimeout(() => {
                window.location.href = '../../#projects';
            }, 260);
        }

        // DELIBERATE SCROLL LISTENER:
        // Requires multiple scroll inputs when near the bottom of the page
        window.addEventListener('wheel', (e) => {
            const scrollBottom = window.innerHeight + window.scrollY;
            const docHeight = document.documentElement.scrollHeight;
            const isNearBottom = scrollBottom >= docHeight - 120;

            if (isNearBottom && e.deltaY > 0) {
                const now = Date.now();
                // Decay old effort if user paused for more than 1.4 seconds
                if (now - lastScrollTime > 1400) {
                    scrollEffort = 0;
                }
                lastScrollTime = now;

                // Add bounded delta
                scrollEffort += Math.min(100, Math.max(20, e.deltaY));

                if (currentCount < total) {
                    updatePillState();
                    if (scrollEffort >= EFFORT_THRESHOLD) {
                        revealNextBatch();
                    }
                } else {
                    // All are already loaded! If they deliberately scroll down multiple times past the end:
                    updatePillState();
                    if (scrollEffort >= EFFORT_THRESHOLD + 120) {
                        navigateToAllProjects();
                    }
                }
            } else if (e.deltaY < 0) {
                // Scrolling up resets the effort smoothly
                scrollEffort = Math.max(0, scrollEffort - 80);
                updatePillState();
            }
        }, { passive: true });

        // Touch handling on mobile
        let touchStartY = 0;
        window.addEventListener('touchstart', (e) => {
            if (e.touches && e.touches.length > 0) {
                touchStartY = e.touches[0].clientY;
            }
        }, { passive: true });

        window.addEventListener('touchmove', (e) => {
            const scrollBottom = window.innerHeight + window.scrollY;
            const docHeight = document.documentElement.scrollHeight;
            const isNearBottom = scrollBottom >= docHeight - 80;

            if (isNearBottom && e.touches && e.touches.length > 0) {
                const delta = touchStartY - e.touches[0].clientY;
                if (delta > 25) {
                    scrollEffort += delta;
                    touchStartY = e.touches[0].clientY;

                    if (currentCount < total) {
                        updatePillState();
                        if (scrollEffort >= EFFORT_THRESHOLD) {
                            revealNextBatch();
                        }
                    } else {
                        updatePillState();
                        if (scrollEffort >= EFFORT_THRESHOLD + 100) {
                            navigateToAllProjects();
                        }
                    }
                }
            }
        }, { passive: true });

        // Click on the pill to manually trigger next batch or navigate
        if (pillEl) {
            pillEl.addEventListener('click', (e) => {
                e.preventDefault();
                if (currentCount < total) {
                    revealNextBatch();
                } else {
                    navigateToAllProjects();
                }
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initRelatedProjects);
    } else {
        initRelatedProjects();
    }
})();
