// =========================================================
// ELIFSU GENÇ PORTFOLIO — RELATED PROJECTS & MORE PROJECTS PROGRESSIVE SCROLL
// Distinct Related Projects Block with relation phrases on top,
// separate MORE PROJECTS section with visible spatial square grid (All Projects style).
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
            isCluster: true
        },
        'stray': {
            id: 'stray',
            num: '02',
            title: 'STRAY',
            year: '2025',
            question: 'Is doing nothing doing something?',
            img: '../../assets/stray-project.png',
            url: '../stray/',
            isCluster: true
        },
        'you-were-here': {
            id: 'you-were-here',
            num: '03',
            title: 'YOU WERE HERE.',
            year: '2026',
            question: 'What remains of the movements we forget in the attention economy?',
            img: '../../assets/you-were-here-cover.png',
            url: '../you-were-here/',
            isCluster: false
        },
        'chronoclines': {
            id: 'chronoclines',
            num: '04',
            title: 'CHRONOCLINES',
            year: '2025',
            question: 'Can a city exhibit itself?',
            img: '../../assets/chronoclines-cover.jpg',
            url: '../chronoclines/',
            isCluster: false
        },
        'millieu': {
            id: 'millieu',
            num: '05',
            title: 'MILLIEU',
            year: '2026',
            question: 'How does a culinary ritual shape a social atmosphere?',
            img: '../../assets/millieu-cover.png',
            url: '../millieu/',
            isCluster: false
        },
        'sprouting-garden': {
            id: 'sprouting-garden',
            num: '06',
            title: 'SPROUTING GARDEN',
            year: '2024',
            question: 'How can architecture nourish instead of consume?',
            img: '../../assets/sprouting-garden-cover.png',
            url: '../sprouting-garden/',
            isCluster: false
        },
        'bajo-la-fresca': {
            id: 'bajo-la-fresca',
            num: '07',
            title: 'BAJO LA FRESCA',
            year: '2025',
            question: 'How can we design a microclimate of care in extreme heat?',
            img: '../../assets/bajo-la-fresca-hero.jpg',
            url: '../bajo-la-fresca/',
            isCluster: true
        },
        'wood-weave': {
            id: 'wood-weave',
            num: '08',
            title: 'WOOD WEAVE',
            year: '2024',
            question: 'How can rigid timber learn to bend like cloth?',
            img: '../../assets/wood-weave-cover.png',
            url: '../wood-weave/',
            isCluster: true
        },
        'ara-sira': {
            id: 'ara-sira',
            num: '09',
            title: 'ARA SIRA',
            year: '2024',
            question: 'How can schoolyard furniture transform childhood play and pause?',
            img: '../../assets/ara-sira-cover.jpg?v=20261104-hq',
            url: '../ara-sira/',
            isCluster: true
        },
        'the-earthen': {
            id: 'the-earthen',
            num: '10',
            title: 'THE EARTHEN',
            year: '2024',
            question: 'How can soil be both structure and skin?',
            img: '../../assets/the-earthen-cover.png',
            url: '../the-earthen/',
            isCluster: true
        },
        'bio-decay': {
            id: 'bio-decay',
            num: '11',
            title: 'BIO DECAY',
            year: '2025',
            question: 'What if buildings were designed to rot gracefully?',
            img: '../../assets/bio-decay-cover.png',
            url: '../bio-decay/',
            isCluster: true
        },
        'fire-escape-simulation': {
            id: 'fire-escape-simulation',
            num: '12',
            title: 'FIRE ESCAPE SIMULATION',
            year: '2024',
            question: 'How do bodies navigate panic in architectural thresholds?',
            img: '../../assets/fire-escape-wip.svg',
            url: '../fire-escape-simulation/',
            isCluster: false
        }
    };

    // Curated 3 related projects per project with authentic thematic relation phrases
    const PROJECT_RELATIONS_MAP = {
        'emek-museum': [
            { id: 'chronoclines', phrase: 'CIVIC ARCHIVE · URBAN MEMORY' },
            { id: 'fire-escape-simulation', phrase: 'DISASTER IS NEVER NATURAL' },
            { id: 'stray', phrase: 'INVISIBLE URBAN RHYTHMS' }
        ],
        'stray': [
            { id: 'the-earthen', phrase: 'CARE · PAUSE · NONHUMAN AGENCY' },
            { id: 'you-were-here', phrase: 'PRESENCE · TRACES · PARTICIPATION' },
            { id: 'emek-museum', phrase: 'INVISIBLE URBAN RHYTHMS' }
        ],
        'you-were-here': [
            { id: 'stray', phrase: 'PRESENCE · TRACES · PARTICIPATION' },
            { id: 'ara-sira', phrase: 'PARTICIPATORY MEMORY' },
            { id: 'fire-escape-simulation', phrase: 'SPATIAL FLOW & ATTENTION' }
        ],
        'chronoclines': [
            { id: 'emek-museum', phrase: 'CIVIC ARCHIVE · URBAN MEMORY' },
            { id: 'millieu', phrase: 'TEMPORAL THRESHOLDS' },
            { id: 'fire-escape-simulation', phrase: 'URBAN FLOWS & THRESHOLDS' }
        ],
        'millieu': [
            { id: 'bajo-la-fresca', phrase: 'SPATIAL ATMOSPHERE & RITUAL' },
            { id: 'wood-weave', phrase: 'TACTILE MATERIAL INTERIOR' },
            { id: 'chronoclines', phrase: 'TEMPORAL THRESHOLDS' }
        ],
        'sprouting-garden': [
            { id: 'bio-decay', phrase: 'BIO-MATERIALS · ECOLOGICAL CYCLES' },
            { id: 'bajo-la-fresca', phrase: 'CLIMATIC COMFORT · LIVING ECOLOGIES' },
            { id: 'the-earthen', phrase: 'LIVING ECOSYSTEMS & SOIL' }
        ],
        'bio-decay': [
            { id: 'sprouting-garden', phrase: 'BIO-MATERIALS · ECOLOGICAL CYCLES' },
            { id: 'the-earthen', phrase: 'EARTH CYCLES · MATERIAL DECAY' },
            { id: 'fire-escape-simulation', phrase: 'TEMPORAL URGENCY' }
        ],
        'the-earthen': [
            { id: 'stray', phrase: 'CARE · PAUSE · NONHUMAN AGENCY' },
            { id: 'bio-decay', phrase: 'EARTH CYCLES · MATERIAL DECAY' },
            { id: 'fire-escape-simulation', phrase: 'BODILY THRESHOLDS' }
        ],
        'wood-weave': [
            { id: 'ara-sira', phrase: 'MAKING · COMMUNITY · CONSTRUCTION' },
            { id: 'bajo-la-fresca', phrase: 'TACTILE PAVILION CRAFT' },
            { id: 'millieu', phrase: 'TACTILE MATERIAL JOINERY' }
        ],
        'ara-sira': [
            { id: 'wood-weave', phrase: 'MAKING · COMMUNITY · CONSTRUCTION' },
            { id: 'you-were-here', phrase: 'PARTICIPATORY MEMORY' },
            { id: 'bajo-la-fresca', phrase: 'TACTILE PAVILION CRAFT' }
        ],
        'bajo-la-fresca': [
            { id: 'wood-weave', phrase: 'TACTILE PAVILION CRAFT' },
            { id: 'sprouting-garden', phrase: 'CLIMATIC COMFORT · LIVING ECOLOGIES' },
            { id: 'ara-sira', phrase: 'PAVILION STRUCTURE · SHADE & COMMUNITY' }
        ],
        'fire-escape-simulation': [
            { id: 'emek-museum', phrase: 'DISASTER IS NEVER NATURAL' },
            { id: 'chronoclines', phrase: 'URBAN FLOWS & THRESHOLDS' },
            { id: 'the-earthen', phrase: 'BODILY THRESHOLDS' }
        ]
    };

    const CANONICAL_SLUG_ORDER = [
        'emek-museum', 'stray', 'you-were-here', 'chronoclines',
        'millieu', 'sprouting-garden', 'bajo-la-fresca', 'wood-weave',
        'ara-sira', 'the-earthen', 'bio-decay', 'fire-escape-simulation'
    ];

    function getCurrentSlug() {
        const path = window.location.pathname.replace(/\/index\.html$/, '').replace(/\/$/, '');
        const segments = path.split('/').filter(Boolean);
        return segments[segments.length - 1] || 'ara-sira';
    }

    // Render Related Project tile (with thematic relation phrase above)
    function renderRelatedProjectTile(p, phrase) {
        const starMeta = p.isCluster
            ? `<span class="sq-star-tag">&#x2726; UNSEEN STAR</span>`
            : `<span class="sq-year-tag">${p.year}</span>`;

        return `
            <article class="sq-cell sq-project-tile sq-related-tile" data-proj-id="${p.id}">
                <a href="${p.url}" class="sq-tile-link">
                    <div class="sq-relation-phrase-wrap">
                        <span class="sq-relation-phrase">✦ ${phrase}</span>
                    </div>
                    <div class="sq-img-box">
                        <img src="${p.img}" alt="${p.title}" class="sq-tile-img" loading="lazy">
                    </div>
                    <div class="sq-caption">
                        <p class="sq-question">${p.question}</p>
                        <div class="sq-title-bar">
                            <span class="sq-title">${p.num} &mdash; ${p.title}</span>
                            ${starMeta}
                        </div>
                    </div>
                </a>
            </article>
        `;
    }

    // Render More Projects tile (All Projects spatial square grid style)
    function renderMoreProjectTile(p, isAnimated = false) {
        const starMeta = p.isCluster
            ? `<span class="sq-star-tag">&#x2726; UNSEEN STAR</span>`
            : `<span class="sq-year-tag">${p.year}</span>`;

        return `
            <article class="sq-cell sq-project-tile sq-more-tile ${isAnimated ? 'is-revealed' : ''}" data-proj-id="${p.id}">
                <a href="${p.url}" class="sq-tile-link">
                    <div class="sq-img-box">
                        <img src="${p.img}" alt="${p.title}" class="sq-tile-img" loading="lazy">
                    </div>
                    <div class="sq-caption">
                        <p class="sq-question">${p.question}</p>
                        <div class="sq-title-bar">
                            <span class="sq-title">${p.num} &mdash; ${p.title}</span>
                            ${starMeta}
                        </div>
                    </div>
                </a>
            </article>
        `;
    }

    function initBottomNavigationArea() {
        const currentSlug = getCurrentSlug();
        const currentData = ALL_PROJECTS_DATA[currentSlug];
        if (!currentData) return;

        if (document.getElementById('project-bottom-navigation-area')) return;

        const mainContainer = document.querySelector('.project-page-container') || document.querySelector('main');
        if (!mainContainer) return;

        // 1. Curated Related Projects (exactly 3)
        const curatedRelations = PROJECT_RELATIONS_MAP[currentSlug] || [];
        const relatedSet = new Set(curatedRelations.map(r => r.id));

        // 2. Remaining 8 projects for MORE PROJECTS (canonical sequence)
        const moreProjects = CANONICAL_SLUG_ORDER
            .filter(s => s !== currentSlug && !relatedSet.has(s))
            .map(s => ALL_PROJECTS_DATA[s])
            .filter(Boolean);

        // Initial visible count in More Projects: 3 projects already visible!
        const initialMoreCount = Math.min(3, moreProjects.length);
        const initialMoreBatch = moreProjects.slice(0, initialMoreCount);

        const container = document.createElement('section');
        container.className = 'project-bottom-navigation-area';
        container.id = 'project-bottom-navigation-area';

        container.innerHTML = `
            <!-- BLOCK 1: RELATED PROJECTS -->
            <div class="bottom-nav-block related-projects-block">
                <div class="section-badge-header">
                    <span class="sec-index">//</span>
                    <span class="sec-title">RELATED PROJECTS</span>
                </div>
                <p class="section-sub-label">Direct thematic and conceptual resonances with this project</p>

                <!-- 3 Curated Related Projects with Thematic Phrases -->
                <div class="spatial-square-grid related-projects-square-grid" id="relatedProjectsGrid">
                    ${curatedRelations.map(rel => {
                        const p = ALL_PROJECTS_DATA[rel.id];
                        return p ? renderRelatedProjectTile(p, rel.phrase) : '';
                    }).join('')}
                </div>
            </div>

            <!-- ARCHITECTURAL SEPARATOR -->
            <div class="bottom-nav-separator" aria-hidden="true">
                <div class="sep-line"></div>
                <div class="sep-badge">&#x2726; EXPLORE FURTHER &#x2726;</div>
                <div class="sep-line"></div>
            </div>

            <!-- BLOCK 2: MORE PROJECTS (All Projects Grid Style) -->
            <div class="bottom-nav-block more-projects-block" id="moreProjectsBlock">
                <div class="section-badge-header">
                    <span class="sec-index">//</span>
                    <span class="sec-title">MORE PROJECTS</span>
                </div>
                <p class="section-sub-label">Further stars across the spatial archive &mdash; scroll down to reveal more</p>

                <!-- More Projects Grid: Initial 3 loaded, remaining loaded on scroll -->
                <div class="spatial-square-grid more-projects-square-grid" id="moreProjectsGrid">
                    ${initialMoreBatch.map(p => renderMoreProjectTile(p, false)).join('')}
                </div>

                <!-- Progressive Deliberate Scroll Cue Pill -->
                <div class="scroll-to-all-zone" id="scrollToAllZone">
                    <button type="button" class="scroll-to-all-pill" id="relatedScrollPill">
                        <span class="scroll-to-all-dot"></span>
                        <span class="scroll-to-all-text" id="relatedScrollText">SCROLL DOWN FOR MORE PROJECTS (${initialMoreCount}/${moreProjects.length})</span>
                        <span class="scroll-cue-progress-track">
                            <span class="scroll-cue-progress-bar" id="relatedProgressBar" style="width: ${(initialMoreCount / moreProjects.length) * 100}%;"></span>
                        </span>
                        <span class="scroll-to-all-arrow">&darr;</span>
                    </button>
                </div>
            </div>
        `;

        mainContainer.appendChild(container);
        setupDeliberateMoreProjectsReveal(moreProjects, initialMoreCount);
    }

    function setupDeliberateMoreProjectsReveal(moreProjects, initialCount) {
        let revealedMoreCount = initialCount;
        const totalMoreCount = moreProjects.length; // 8
        const moreGridEl = document.getElementById('moreProjectsGrid');
        const pillEl = document.getElementById('relatedScrollPill');
        const textEl = document.getElementById('relatedScrollText');
        const progressBar = document.getElementById('relatedProgressBar');
        const arrowEl = pillEl ? pillEl.querySelector('.scroll-to-all-arrow') : null;

        const EFFORT_THRESHOLD = 260;
        let accumulatedEffort = 0;
        let decayTimer = null;
        let isRevealing = false;
        let isTransitioning = false;

        function updatePillState() {
            if (!textEl || !progressBar) return;
            const progress = (revealedMoreCount / totalMoreCount) * 100;
            progressBar.style.width = `${progress}%`;

            if (revealedMoreCount < totalMoreCount) {
                textEl.textContent = `SCROLL DOWN FOR MORE PROJECTS (${revealedMoreCount}/${totalMoreCount})`;
                if (arrowEl) arrowEl.innerHTML = '&darr;';
            } else {
                textEl.textContent = `ALL 12 STARS DISPLAYED • ENTER ALL PROJECTS`;
                if (arrowEl) arrowEl.innerHTML = '&rarr;';
                if (pillEl) pillEl.classList.add('is-complete');
            }
        }

        function revealNextBatch() {
            if (isRevealing || isTransitioning) return;
            if (revealedMoreCount >= totalMoreCount) {
                navigateToAllProjects();
                return;
            }

            isRevealing = true;
            // Batches: next 3, then remainder
            const batchSize = Math.min(3, totalMoreCount - revealedMoreCount);
            const nextProjects = moreProjects.slice(revealedMoreCount, revealedMoreCount + batchSize);

            const tempContainer = document.createElement('div');
            tempContainer.innerHTML = nextProjects.map(p => renderMoreProjectTile(p, true)).join('');

            const newCards = Array.from(tempContainer.children);
            newCards.forEach((card, idx) => {
                card.style.animationDelay = `${idx * 80}ms`;
                moreGridEl.appendChild(card);
            });

            revealedMoreCount += batchSize;
            updatePillState();

            setTimeout(() => {
                accumulatedEffort = 0;
                isRevealing = false;
            }, 600);
        }

        function navigateToAllProjects() {
            if (isTransitioning) return;
            isTransitioning = true;
            if (pillEl) pillEl.classList.add('is-launching');

            const overlay = document.createElement('div');
            overlay.className = 'page-transition-portal-overlay';
            document.body.appendChild(overlay);

            requestAnimationFrame(() => {
                overlay.classList.add('is-active');
            });

            setTimeout(() => {
                window.location.href = '../../#projects';
            }, 450);
        }

        if (pillEl) {
            pillEl.addEventListener('click', () => {
                if (revealedMoreCount < totalMoreCount) {
                    revealNextBatch();
                } else {
                    navigateToAllProjects();
                }
            });
        }

        function onScrollAttempt(deltaY) {
            if (deltaY <= 0 || isRevealing || isTransitioning) return;

            const scrollY = window.pageYOffset || document.documentElement.scrollTop;
            const windowHeight = window.innerHeight;
            const docHeight = document.documentElement.scrollHeight;
            const distFromBottom = docHeight - (scrollY + windowHeight);

            // Within 400px of page bottom
            if (distFromBottom > 400) return;

            accumulatedEffort += Math.min(deltaY, 140);

            if (progressBar && revealedMoreCount < totalMoreCount) {
                const subProgress = Math.min(100, (accumulatedEffort / EFFORT_THRESHOLD) * 100);
                const baseProgress = (revealedMoreCount / totalMoreCount) * 100;
                const totalProgress = baseProgress + (subProgress * (Math.min(3, totalMoreCount - revealedMoreCount) / totalMoreCount));
                progressBar.style.width = `${totalProgress}%`;
            }

            clearTimeout(decayTimer);
            decayTimer = setTimeout(() => {
                accumulatedEffort = 0;
                updatePillState();
            }, 1200);

            if (accumulatedEffort >= EFFORT_THRESHOLD) {
                clearTimeout(decayTimer);
                accumulatedEffort = 0;
                revealNextBatch();
            }
        }

        window.addEventListener('wheel', (e) => {
            if (e.deltaY > 0) {
                onScrollAttempt(e.deltaY);
            }
        }, { passive: true });

        let touchStartY = 0;
        window.addEventListener('touchstart', (e) => {
            if (e.touches && e.touches.length > 0) {
                touchStartY = e.touches[0].clientY;
            }
        }, { passive: true });

        window.addEventListener('touchmove', (e) => {
            if (e.touches && e.touches.length > 0) {
                const currentY = e.touches[0].clientY;
                const deltaY = touchStartY - currentY;
                if (deltaY > 20) {
                    onScrollAttempt(deltaY * 1.5);
                    touchStartY = currentY;
                }
            }
        }, { passive: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBottomNavigationArea);
    } else {
        initBottomNavigationArea();
    }
})();
