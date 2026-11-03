// =========================================================
// ELIFSU GENÇ PORTFOLIO — RELATED PROJECTS & SEAMLESS SCROLL TO ALL PROJECTS
// Dynamically renders related projects in All Projects spatial tile format
// and seamlessly navigates to All Projects when user scrolls past them
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

    function renderRelatedProjectsTile(p) {
        return `
            <article class="sq-cell sq-project-tile" data-proj-id="${p.id}">
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

        // Ensure we don't inject twice
        if (document.getElementById('related-projects-section')) return;

        const mainContainer = document.querySelector('.project-page-container') || document.querySelector('main');
        if (!mainContainer) return;

        const relatedSlugs = currentData.related || [];
        const relatedItems = relatedSlugs.map(slug => ALL_PROJECTS_DATA[slug]).filter(Boolean);
        if (relatedItems.length === 0) return;

        const section = document.createElement('section');
        section.className = 'project-section related-projects-section';
        section.id = 'related-projects-section';

        section.innerHTML = `
            <div class="section-badge-header">
                <span class="sec-index">//</span>
                <span class="sec-title">RELATED PROJECTS // EXPLORE THE CONSTELLATION</span>
            </div>

            <div class="related-projects-grid">
                ${relatedItems.map(renderRelatedProjectsTile).join('')}
            </div>

            <div class="scroll-to-all-zone" id="scrollToAllZone">
                <a href="../../#projects" class="scroll-to-all-pill" id="scrollToAllBtn">
                    <span class="scroll-to-all-dot"></span>
                    <span class="scroll-to-all-text">SCROLL DOWN TO EXPLORE ALL PROJECTS</span>
                    <span class="scroll-to-all-arrow">&darr;</span>
                </a>
            </div>
        `;

        // Insert before footer nav or at end of main container
        const footerNav = mainContainer.querySelector('.footer-nav-btn')?.closest('div') ||
                          mainContainer.querySelector('.project-footer') ||
                          mainContainer.querySelector('footer');

        if (footerNav && footerNav.parentNode === mainContainer) {
            mainContainer.insertBefore(section, footerNav);
        } else {
            mainContainer.appendChild(section);
        }

        setupScrollToAllTrigger();
    }

    function setupScrollToAllTrigger() {
        let isRedirecting = false;
        let accumulatedDeltaY = 0;
        let lastWheelTime = 0;

        function navigateToAllProjects() {
            if (isRedirecting) return;
            isRedirecting = true;

            try {
                sessionStorage.setItem('portfolio_return_tab', 'projects');
                sessionStorage.setItem('portfolio_return_origin', 'projects');
            } catch (_) {}

            const pill = document.getElementById('scrollToAllBtn') || document.querySelector('.scroll-to-all-pill');
            if (pill) {
                pill.classList.add('is-triggering');
                const textEl = pill.querySelector('.scroll-to-all-text');
                if (textEl) textEl.textContent = 'ENTERING ALL PROJECTS...';
            }

            document.body.style.transition = 'opacity 0.24s ease';
            document.body.style.opacity = '0.5';

            setTimeout(() => {
                window.location.href = '../../#projects';
            }, 240);
        }

        // 1. Wheel event when user is already at the bottom of the page and continues scrolling down
        window.addEventListener('wheel', (e) => {
            if (isRedirecting) return;
            const scrollBottom = window.innerHeight + window.scrollY;
            const docHeight = document.documentElement.scrollHeight;

            if (scrollBottom >= docHeight - 40 && e.deltaY > 0) {
                accumulatedDeltaY += e.deltaY;
                const now = Date.now();
                if (accumulatedDeltaY > 80 || (now - lastWheelTime < 350 && accumulatedDeltaY > 35)) {
                    navigateToAllProjects();
                }
                lastWheelTime = now;
            } else {
                accumulatedDeltaY = 0;
            }
        }, { passive: true });

        // 2. Touch event for mobile swipe up when at bottom of page
        let touchStartY = 0;
        window.addEventListener('touchstart', (e) => {
            if (e.touches && e.touches.length > 0) {
                touchStartY = e.touches[0].clientY;
            }
        }, { passive: true });

        window.addEventListener('touchmove', (e) => {
            if (isRedirecting) return;
            const scrollBottom = window.innerHeight + window.scrollY;
            const docHeight = document.documentElement.scrollHeight;
            if (scrollBottom >= docHeight - 25 && e.touches && e.touches.length > 0) {
                const delta = touchStartY - e.touches[0].clientY;
                if (delta > 60) {
                    navigateToAllProjects();
                }
            }
        }, { passive: true });

        // 3. Keyboard navigation at bottom (ArrowDown / PageDown / Space)
        window.addEventListener('keydown', (e) => {
            if (isRedirecting) return;
            const scrollBottom = window.innerHeight + window.scrollY;
            const docHeight = document.documentElement.scrollHeight;
            if (scrollBottom >= docHeight - 20) {
                if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
                    navigateToAllProjects();
                }
            }
        });

        // 4. Click event on pill
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('#scrollToAllBtn, .scroll-to-all-pill');
            if (btn) {
                e.preventDefault();
                navigateToAllProjects();
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initRelatedProjects);
    } else {
        initRelatedProjects();
    }
})();
