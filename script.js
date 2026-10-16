document.addEventListener('DOMContentLoaded', () => {
    // Strip trailing /index.html from URL bar so the URL is always clean (e.g. https://elifsugenc.github.io/ or /#constellation)
    if (window.location.pathname.endsWith('/index.html') || window.location.pathname.endsWith('index.html')) {
        const cleanPath = window.location.pathname.replace(/(^|\/)index\.html$/, '$1') || '/';
        history.replaceState(null, '', cleanPath + window.location.search + window.location.hash);
    }

    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const projectJumpBtn = document.querySelector('.go-to-projects');
    const cursorWrapper = document.getElementById('cursor-wrapper');
    const customCursor = document.getElementById('custom-cursor');

    // Remove all native browser tooltips (black boxes) across entire document
    function stripNativeTooltips() {
        document.querySelectorAll('[title]').forEach(el => el.removeAttribute('title'));
    }
    stripNativeTooltips();
    try {
        new MutationObserver((mutations) => {
            for (const m of mutations) {
                if (m.type === 'attributes' && m.attributeName === 'title' && m.target.hasAttribute('title')) {
                    m.target.removeAttribute('title');
                } else if (m.type === 'childList') {
                    m.target.querySelectorAll?.('[title]')?.forEach(el => el.removeAttribute('title'));
                }
            }
        }).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['title'] });
    } catch (_) {}

    // Custom Cursor & Project Preview tracking
    if (cursorWrapper && customCursor) {
        let cursorX = 0, cursorY = 0, cursorTicking = false;
        document.addEventListener('mousemove', (e) => {
            cursorX = e.clientX;
            cursorY = e.clientY;
            if (!cursorTicking) {
                requestAnimationFrame(() => {
                    cursorWrapper.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
                    cursorTicking = false;
                });
                cursorTicking = true;
            }
        }, { passive: true });

        // Helper to check if a target is an active spatial interactive element based on current observatory state
        function isSpatialInteractive(target) {
            if (!target) return false;
            const homeStage = document.getElementById('hq-constellation-sky');
            const state = (homeStage && homeStage.getAttribute('data-state')) || 'cluster';

            if (state === 'cluster') {
                // In cluster state, circular star cores, cluster-brand-node, merope, and control buttons are interactive:
                if (target.closest('.cs-caption-block, .cs-caption, .cs-orbit-ring')) {
                    return false;
                }
                return !!target.closest('.cs-core, .cluster-brand-node, #cluster-brand-node, #merope-star-node, .merope-star, .cluster-transition-btn, #hq-cluster-toggle-pill');
            } else {
                // In constellation state:
                // Exclude labels, headers, keywords, orbit rigs, and hidden cluster elements
                if (target.closest('.cluster-star-visual, .merope-cluster-view, .node-label, .node-header, .node-title, .node-keywords, .node-orbit-rig, .center-ring')) {
                    return false;
                }
                return !!target.closest('.constellation-map .node-visual, .constellation-map .node-hover-card, .constellation-map .c-axis-link, .constellation-map .c-corner-node, .constellation-map .relation-theme-badge, .cluster-brand-node, #cluster-brand-node, .constellation-design-approach-node, #constellation-design-approach-node, #merope-star-node, .merope-star');
            }
        }

        // Check if a target element is clickable/interactive across the entire portfolio
        function isClickable(target) {
            if (!target || target === document.body || target === document.documentElement) return false;
            if (isSpatialInteractive(target)) return true;

            const clickableAncestor = target.closest(
                'a, button, input, select, textarea, label, [role="button"], [role="link"], [tabindex]:not([tabindex="-1"]), ' +
                '.project-card, .radial-dot, .hq-card, .hq-star-node, .wwh-btn-learn, .wwh-btn, .wwh-reopen-circle, ' +
                '.tag, .tab-button, .dir-btn, .hq-view-btn, .m-tri-node-group, .m-tri-tag-group, .m-tri-center-group, .m-tri-edge-group, ' +
                '.m-lens-btn, .hq-explore-all-btn, .cluster-transition-btn, .hq-cluster-toggle-pill, .merope-close-btn, .merope-foot-cta, ' +
                '.cluster-state-btn, .merope-modal-backdrop, .c-axis-link, .c-corner-node, .relation-theme-badge, [data-cursor="question"], ' +
                '.portfolio-filter-item, .methodology-card, .wwh-modal-close'
            );
            if (clickableAncestor) return true;

            try {
                const comp = window.getComputedStyle(target);
                if (comp && (comp.cursor === 'pointer' || comp.cursor === 'help')) return true;
            } catch (_) {}

            return false;
        }

        // Add hover effect for clickable elements (pulsing / blinking question mark cursor)
        document.addEventListener('mouseover', (e) => {
            const spatial = isSpatialInteractive(e.target);
            if (spatial) {
                cursorWrapper.classList.add('cursor-spatial');
            } else {
                cursorWrapper.classList.remove('cursor-spatial');
            }

            if (spatial || isClickable(e.target)) {
                customCursor.classList.add('cursor-hover', 'cursor-question');
            } else {
                customCursor.classList.remove('cursor-hover', 'cursor-question', 'cursor-project');
            }
        });

        document.addEventListener('mouseout', (e) => {
            const rel = e.relatedTarget;
            if (!rel || (!isSpatialInteractive(rel) && !isClickable(rel))) {
                customCursor.classList.remove('cursor-hover', 'cursor-question', 'cursor-project');
                cursorWrapper.classList.remove('cursor-spatial');
            }
        });
    }

    // Architectural Project Cards Data Store
    const projectCards = Array.from(document.querySelectorAll('.project-card'));

    // =========================================================
    // PLEIADES / M45 & SPATIAL CONSTELLATION ASTRONOMICAL CONFIG
    // =========================================================
    const PLEIADES_CONFIG = {
        clusterMeta: {
            name: 'MESSIER 45 // PLEIADES CLUSTER',
            catalog: 'M45 / NGC 1432',
            constellation: 'TAURUS (THE BULL)',
            coordinates: 'RA 03h 47m 24s · DEC +24° 07′ 00″',
            distance: '444 LIGHT-YEARS (136 PC)',
            epoch: 'J2000.0'
        },
        stars: [
            {
                starId: 'alcyone',
                starName: 'Alcyone',
                bayer: 'η Tauri',
                mag: '2.87 mag',
                targetId: 'eg-center',
                title: 'ELIFSU GENÇ (EG.)',
                role: 'Practice Center · Spatial Inquiry',
                type: 'author',
                url: '#about',
                clusterX: 340,
                clusterY: 443,
                triangleX: 97,
                triangleY: 71,
                description: 'Practice nexus: Architectural research, critical spatial inquiry, and living archives.'
            },
            {
                starId: 'maia',
                starName: 'Maia',
                bayer: '20 Tauri',
                mag: '3.87 mag',
                targetId: 'emek-museum',
                projNum: '01',
                title: 'EMEK MUSEUM',
                type: 'project',
                clusterX: 537,
                clusterY: 330,
                triangleX: 380,
                triangleY: 250,
                description: 'Spatial justice & counter-monument spatializing hidden civic labor.'
            },
            {
                starId: 'electra',
                starName: 'Electra',
                bayer: '17 Tauri',
                mag: '3.72 mag',
                targetId: 'stray',
                projNum: '02',
                title: 'STRAY',
                type: 'project',
                clusterX: 651,
                clusterY: 439,
                triangleX: 560,
                triangleY: 160,
                description: 'Responsive urban feline sanctuary questioning non-human agency and temporal pauses.'
            },
            {
                starId: 'asterope',
                starName: 'Asterope',
                bayer: '21 Tauri',
                mag: '5.76 mag',
                targetId: 'you-were-here',
                projNum: '03',
                title: 'YOU WERE HERE.',
                type: 'project',
                clusterX: 528,
                clusterY: 250,
                triangleX: 690,
                triangleY: 380,
                description: 'Living participatory monument recording involuntary visitor cursor movements.'
            },
            {
                starId: 'taygeta',
                starName: 'Taygeta',
                bayer: '19 Tauri',
                mag: '4.30 mag',
                targetId: 'the-earthen',
                projNum: '10',
                title: 'THE EARTHEN',
                type: 'project',
                clusterX: 612,
                clusterY: 287,
                triangleX: 605,
                triangleY: 435,
                description: 'Unbaked soil burial vessel interrogating material impermanence and memory.'
            },
            {
                starId: 'celaeno',
                starName: 'Celaeno',
                bayer: '16 Tauri',
                mag: '5.45 mag',
                targetId: 'bio-decay',
                projNum: '11',
                title: 'BIO-DECAY',
                type: 'project',
                clusterX: 660,
                clusterY: 364,
                triangleX: 750,
                triangleY: 500,
                description: 'Circular biopolymers confronting petrochemical permanence.'
            },
            {
                starId: 'merope',
                starName: 'Merope',
                bayer: '23 Tauri',
                mag: '4.14 mag',
                targetId: 'merope-story',
                title: 'THE HIDDEN SISTER',
                role: 'Mythological & Practice Narrative',
                type: 'story',
                clusterX: 478,
                clusterY: 510,
                triangleX: 500,
                triangleY: 460,
                subtle: true,
                description: 'The seventh sister: mythological reflection on invisibility, presence, and relational cosmology.'
            }
        ],
        vertexAssociations: {
            'critical-inquiry': {
                name: 'CRITICAL INQUIRY',
                badge: 'APEX // VERTEX 01',
                projects: ['emek-museum', 'stray', 'you-were-here', 'fire-escape-simulation']
            },
            'contextual-research': {
                name: 'CONTEXTUAL RESEARCH',
                badge: 'BASE-LEFT // VERTEX 02',
                projects: ['chronoclines', 'millieu', 'bajo-la-fresca', 'wood-weave', 'ara-sira']
            },
            'experimental-thinking': {
                name: 'EXPERIMENTAL THINKING',
                badge: 'BASE-RIGHT // VERTEX 03',
                projects: ['sprouting-garden', 'the-earthen', 'bio-decay']
            }
        }
    };

    const PLEIADES_STARS_BY_TARGET = {};
    PLEIADES_CONFIG.stars.forEach(s => {
        PLEIADES_STARS_BY_TARGET[s.targetId] = s;
    });

    // =========================================================
    // INTERACTIVE SPATIAL CONSTELLATION — ALL 12 PROJECTS
    // =========================================================
    const CONSTELLATION_PROJECTS = [
        {
            id: 'emek-museum',
            num: '01',
            title: 'EMEK MUSEUM',
            question: 'How can we make this labour visible again?',
            keywords: ['Collective Memory', 'Narratives', 'Spatial Justice'],
            year: '2027',
            medium: 'Spatial Design',
            url: './projects/emek-museum/',
            img: './assets/emek-museum-wip.svg',
            color: '#38bdf8',
            colorRgb: '56, 189, 248',
            accent2: '#60a5fa',
            accent2Rgb: '96, 165, 250',
            darkBg: '#071524',
            darkBgRgb: '7, 21, 36',
            isAward: false,
            x: 380,
            y: 250,
            labelPos: 'left',
            cardDir: 'card-left',
            yearPos: 'year-top'
        },
        {
            id: 'stray',
            num: '02',
            title: 'STRAY',
            question: 'Is doing nothing doing something?',
            keywords: ['Presence', 'Traces', 'Participation'],
            year: '2025',
            medium: 'Interactive Installation',
            url: './projects/stray/',
            img: './assets/stray-project.png',
            color: '#10b981',
            colorRgb: '16, 185, 129',
            accent2: '#f43f5e',
            accent2Rgb: '244, 63, 94',
            darkBg: '#0a1812',
            darkBgRgb: '10, 24, 18',
            isAward: true,
            x: 560,
            y: 160,
            labelPos: 'right',
            cardDir: 'card-right',
            yearPos: 'year-top'
        },
        {
            id: 'you-were-here',
            num: '03',
            title: 'YOU WERE HERE.',
            question: 'What remains of the movements we forget?',
            keywords: ['Presence', 'Traces', 'Digital Archive'],
            year: '2026',
            medium: 'Digital Archive',
            url: './projects/you-were-here/',
            img: './assets/you-were-here-cover.png',
            color: '#22c55e',
            colorRgb: '34, 197, 94',
            accent2: '#38bdf8',
            accent2Rgb: '56, 189, 248',
            darkBg: '#07170e',
            darkBgRgb: '7, 23, 14',
            isAward: false,
            x: 690,
            y: 380,
            labelPos: 'right',
            cardDir: 'card-right',
            yearPos: 'year-top'
        },
        {
            id: 'chronoclines',
            num: '04',
            title: 'CHRONOCLINES',
            question: 'Can a city exhibit itself?',
            keywords: ['Time', 'Transformation', 'Memory'],
            year: '2025',
            medium: 'Generative Art',
            url: './projects/chronoclines/',
            img: './assets/chronoclines-cover.jpg',
            color: '#ea580c',
            colorRgb: '234, 88, 12',
            accent2: '#f59e0b',
            accent2Rgb: '245, 158, 11',
            darkBg: '#1a0e07',
            darkBgRgb: '26, 14, 7',
            isAward: false,
            x: 340,
            y: 405,
            labelPos: 'left',
            cardDir: 'card-left',
            yearPos: 'year-right'
        },
        {
            id: 'millieu',
            num: '05',
            title: 'MILLIEU',
            question: 'How does a culinary ritual shape a social atmosphere?',
            keywords: ['Culinary Interior', 'Spatial Branding', 'Amphitheatre'],
            year: '2026',
            medium: 'Culinary Interior',
            url: './projects/millieu/',
            img: './assets/millieu-cover.png',
            color: '#f43f5e',
            colorRgb: '244, 63, 94',
            accent2: '#fbbf24',
            accent2Rgb: '251, 191, 36',
            darkBg: '#19060e',
            darkBgRgb: '25, 6, 14',
            isAward: false,
            x: 315,
            y: 490,
            labelPos: 'left',
            cardDir: 'card-left',
            yearPos: 'year-left'
        },
        {
            id: 'sprouting-garden',
            num: '06',
            title: 'SPROUTING GARDEN',
            question: 'Can we build without displacing life?',
            keywords: ['Ecology', 'Living Architecture', 'Nonhuman'],
            year: '2024',
            medium: 'Bio-Materials',
            url: './projects/sprouting-garden/',
            img: './assets/sprouting-garden-cover.png',
            color: '#22c55e',
            colorRgb: '34, 197, 94',
            accent2: '#fbbf24',
            accent2Rgb: '251, 191, 36',
            darkBg: '#08170b',
            darkBgRgb: '8, 23, 11',
            isAward: true,
            x: 580,
            y: 270,
            labelPos: 'right',
            cardDir: 'card-right',
            yearPos: 'year-top'
        },
        {
            id: 'bajo-la-fresca',
            num: '07',
            title: 'BAJO LA FRESCA',
            question: 'How do you highlight beauty without stealing its spotlight?',
            keywords: ['Climatic Comfort', 'Ephemeral Space', 'Ecology'],
            year: '2026',
            medium: 'Spatial Installation',
            url: './projects/bajo-la-fresca/',
            img: './assets/bajo-la-fresca-hero.jpg',
            color: '#ea580c',
            colorRgb: '234, 88, 12',
            accent2: '#fbbf24',
            accent2Rgb: '251, 191, 36',
            darkBg: '#1a0d06',
            darkBgRgb: '26, 13, 6',
            isAward: false,
            x: 410,
            y: 595,
            labelPos: 'right',
            cardDir: 'card-right',
            yearPos: 'year-left'
        },
        {
            id: 'wood-weave',
            num: '08',
            title: 'WOOD WEAVE',
            question: 'When does waste become a place?',
            keywords: ['Waste Architecture', 'Community', 'Making'],
            year: '2024',
            medium: 'Spatial Design',
            url: './projects/wood-weave/',
            img: './assets/wood-weave-cover.png',
            color: '#d97706',
            colorRgb: '217, 119, 6',
            accent2: '#f59e0b',
            accent2Rgb: '245, 158, 11',
            darkBg: '#181006',
            darkBgRgb: '24, 16, 6',
            isAward: false,
            x: 595,
            y: 655,
            labelPos: 'right',
            cardDir: 'card-right',
            yearPos: 'year-top'
        },
        {
            id: 'ara-sira',
            num: '09',
            title: 'ARA-SIRA',
            question: 'Can one space hold both play and quiet?',
            keywords: ['Play', 'Community', 'Construction'],
            year: '2024',
            medium: 'Editorial Design',
            url: './projects/ara-sira/',
            img: './assets/ara-sira-cover.jpg',
            color: '#818cf8',
            colorRgb: '129, 140, 248',
            accent2: '#38bdf8',
            accent2Rgb: '56, 189, 248',
            darkBg: '#0f0f24',
            darkBgRgb: '15, 15, 36',
            isAward: false,
            x: 330,
            y: 655,
            labelPos: 'bottom',
            cardDir: 'card-left',
            yearPos: 'year-bottom'
        },
        {
            id: 'the-earthen',
            num: '10',
            title: 'THE EARTHEN',
            question: 'Is there death because there is life?',
            keywords: ['Matter & Mortality', 'Soil & Clay', 'Cyclical Time'],
            year: '2026',
            medium: 'Soil & Clay',
            url: './projects/the-earthen/',
            img: './assets/the-earthen-cover.png',
            color: '#c2410c',
            colorRgb: '194, 65, 12',
            accent2: '#d97706',
            accent2Rgb: '217, 119, 6',
            darkBg: '#170a04',
            darkBgRgb: '23, 10, 4',
            isAward: false,
            x: 605,
            y: 435,
            labelPos: 'bottom',
            cardDir: 'card-right',
            yearPos: 'year-top'
        },
        {
            id: 'bio-decay',
            num: '11',
            title: 'BIO-DECAY',
            question: 'How many microplastics can we eat in a day?',
            keywords: ['Time', 'Transformation', 'Microplastics'],
            year: '2025',
            medium: 'Bio-Materials',
            url: './projects/bio-decay/',
            img: './assets/bio-decay-cover.png',
            color: '#84cc16',
            colorRgb: '132, 204, 22',
            accent2: '#eab308',
            accent2Rgb: '234, 179, 8',
            darkBg: '#111804',
            darkBgRgb: '17, 24, 4',
            isAward: true,
            x: 750,
            y: 500,
            labelPos: 'right',
            cardDir: 'card-left',
            yearPos: 'year-bottom'
        },
        {
            id: 'fire-escape-simulation',
            num: '12',
            title: 'FIRE ESCAPE SIMULATION',
            titleDisplay: '<span class="title-line">FIRE&nbsp;ESCAPE</span><span class="title-line">SIMULATION</span>',
            question: 'Can you escape the fire?',
            keywords: ['Egress Dynamics', 'Simulation', 'Spatial Panic'],
            year: '2027',
            medium: 'Simulation',
            url: './projects/fire-escape-simulation/',
            img: './assets/work-in-progress.svg',
            color: '#ef4444',
            colorRgb: '239, 68, 68',
            accent2: '#f97316',
            accent2Rgb: '249, 115, 22',
            darkBg: '#1a0606',
            darkBgRgb: '26, 6, 6',
            isAward: false,
            x: 230,
            y: 600,
            labelPos: 'left',
            cardDir: 'card-right',
            yearPos: 'year-top'
        }
    ];

    // Secondary Conceptual Relationships with Architecturally Padded Badges
    const CONSTELLATION_RELATIONS = [
        {
            from: 'stray',
            to: 'you-were-here',
            themeLine1: 'PRESENCE · TRACES',
            themeLine2: 'PARTICIPATION',
            curve: 'M 560 160 Q 675 250 690 380',
            labelX: 650,
            labelY: 260,
            badgeW: 136,
            badgeH: 28
        },
        {
            from: 'chronoclines',
            to: 'bio-decay',
            themeLine1: 'TIME · MEMORY',
            themeLine2: 'TRANSFORMATION',
            curve: 'M 340 405 Q 525 610 750 500',
            labelX: 535,
            labelY: 525,
            badgeW: 104,
            badgeH: 26
        },
        {
            from: 'emek-museum',
            to: 'chronoclines',
            themeLine1: 'COLLECTIVE MEMORY',
            themeLine2: 'NARRATIVES',
            curve: 'M 380 250 Q 375 325 340 405',
            labelX: 370,
            labelY: 325,
            badgeW: 132,
            badgeH: 28
        },
        {
            from: 'sprouting-garden',
            to: 'bajo-la-fresca',
            themeLine1: 'ECOLOGY · NONHUMAN',
            themeLine2: 'RELATIONSHIPS',
            curve: 'M 580 270 Q 510 420 410 595',
            labelX: 495,
            labelY: 415,
            badgeW: 136,
            badgeH: 28
        },
        {
            from: 'wood-weave',
            to: 'ara-sira',
            themeLine1: 'MAKING · COMMUNITY',
            themeLine2: 'CONSTRUCTION',
            curve: 'M 595 655 Q 460 690 330 655',
            labelX: 460,
            labelY: 678,
            badgeW: 136,
            badgeH: 28
        }
    ];

    // Selected works for special indicators
    const SELECTED_TITLES = new Set([
        "THE EARTHEN",
        "EMEK MUSEUM",
        "BIO-DECAY",
        "STRAY",
        "YOU WERE HERE.",
        "YOU WERE HERE"
    ]);

    const SELECTED_PROJECT_IDS = new Set([
        'emek-museum',
        'stray',
        'the-earthen',
        'bio-decay',
        'you-were-here'
    ]);

    let hasEgIntroPulsed = false;
    let isTransitioning = false;
    let cornersPulseTimeout = null;
    let morphingEntranceTimeout = null;

    // Transition between Cluster (Pleiades M45) and Constellation (All 12 Projects)
    function setConstellationState(container, targetState, updateHash = true) {
        if (!container) return;
        const stage = container.querySelector('.constellation-stage') || container;
        const current = container.getAttribute('data-state');
        if (current === targetState || isTransitioning) return;

        isTransitioning = true;
        const isTargetConstellation = (targetState === 'constellation');
        const homeStage = document.getElementById('hq-constellation-sky');

        // Synchronize browser URL hash: clean root for cluster, #constellation for constellation
        if (updateHash) {
            if (isTargetConstellation) {
                if (window.location.hash !== '#constellation') {
                    history.pushState(null, '', '#constellation');
                }
            } else {
                if (window.location.hash === '#constellation' || window.location.hash === '#projects') {
                    history.pushState(null, '', window.location.pathname + window.location.search);
                }
            }
        }

        // Manage 3-corner gentle pulse emphasis (3-4 times on entering Constellation)
        if (cornersPulseTimeout) {
            clearTimeout(cornersPulseTimeout);
            cornersPulseTimeout = null;
        }
        container.classList.remove('corners-intro-pulsing');

        // Manage morphing entrance state
        if (morphingEntranceTimeout) {
            clearTimeout(morphingEntranceTimeout);
            morphingEntranceTimeout = null;
        }
        container.classList.remove('is-morphing-entrance');
        if (stage) stage.classList.remove('is-morphing-entrance');
        if (homeStage) homeStage.classList.remove('is-morphing-entrance');

        if (isTargetConstellation) {
            // Force a reflow to smoothly start the keyframe animation
            void container.offsetWidth;
            container.classList.add('corners-intro-pulsing', 'is-morphing-entrance');
            if (stage) stage.classList.add('is-morphing-entrance');
            if (homeStage) homeStage.classList.add('is-morphing-entrance');

            cornersPulseTimeout = setTimeout(() => {
                if (container) {
                    container.classList.remove('corners-intro-pulsing');
                }
            }, 4200);

            morphingEntranceTimeout = setTimeout(() => {
                if (container) container.classList.remove('is-morphing-entrance');
                if (stage) stage.classList.remove('is-morphing-entrance');
                if (homeStage) homeStage.classList.remove('is-morphing-entrance');
                morphingEntranceTimeout = null;
            }, 2700);
        }

        // Update state attributes on container and stage
        container.setAttribute('data-state', targetState);
        stage.setAttribute('data-state', targetState);

        if (homeStage) {
            homeStage.setAttribute('data-state', targetState);
        }

        // Update all transition button texts and icons
        document.querySelectorAll('.cluster-transition-btn, #hq-cluster-toggle-pill').forEach(btn => {
            const icon = btn.querySelector('.ctb-icon, .c-toggle-glyph');
            const label = btn.querySelector('.ctb-text, .c-toggle-label');
            if (isTargetConstellation) {
                if (icon) icon.innerHTML = '&#x2190;';
                if (label) label.textContent = 'BACK TO CLUSTER';
            } else {
                if (icon) icon.innerHTML = '&#x2726;';
                if (label) label.textContent = 'EXPLORE ALL PROJECTS ↗';
            }
        });

        // Update status label
        const statusLabel = document.getElementById('pleiades-status-label');
        if (statusLabel) {
            statusLabel.textContent = isTargetConstellation
                ? 'CONSTELLATION STATE • ALL 12 PROJECTS'
                : 'CLUSTER STATE • PLEIADES / M45 (7 STARS)';
        }

        // 1. Smoothly glide the 5 selected project stars
        const stageWidth = 1000;
        const stageHeight = 750;

        container.querySelectorAll('.constellation-node.is-cluster-star').forEach(node => {
            const targetX = isTargetConstellation
                ? parseFloat(node.getAttribute('data-triangle-x'))
                : parseFloat(node.getAttribute('data-cluster-x'));
            const targetY = isTargetConstellation
                ? parseFloat(node.getAttribute('data-triangle-y'))
                : parseFloat(node.getAttribute('data-cluster-y'));

            node.style.left = (targetX / stageWidth * 100).toFixed(2) + '%';
            node.style.top = (targetY / stageHeight * 100).toFixed(2) + '%';
        });

        // 2. Smoothly glide Alcyone / Logo Node (from Cluster Center to Top-Left in Constellation)
        const brandNode = container.querySelector('[id="cluster-brand-node"], [id="constellation-center-btn"]');
        if (brandNode) {
            const targetX = isTargetConstellation
                ? parseFloat(brandNode.getAttribute('data-triangle-x'))
                : parseFloat(brandNode.getAttribute('data-cluster-x'));
            const targetY = isTargetConstellation
                ? parseFloat(brandNode.getAttribute('data-triangle-y'))
                : parseFloat(brandNode.getAttribute('data-cluster-y'));

            brandNode.style.left = (targetX / stageWidth * 100).toFixed(2) + '%';
            brandNode.style.top = (targetY / stageHeight * 100).toFixed(2) + '%';
        }

        // 3. Smoothly glide Merope (The Hidden Sister -> Design Approach Center Barycenter)
        const meropeNode = container.querySelector('[id="merope-star-node"], .constellation-design-approach-node');
        if (meropeNode) {
            const targetX = isTargetConstellation
                ? parseFloat(meropeNode.getAttribute('data-triangle-x') || 500)
                : parseFloat(meropeNode.getAttribute('data-cluster-x') || 478);
            const targetY = isTargetConstellation
                ? parseFloat(meropeNode.getAttribute('data-triangle-y') || 460)
                : parseFloat(meropeNode.getAttribute('data-cluster-y') || 510);

            meropeNode.style.left = (targetX / stageWidth * 100).toFixed(2) + '%';
            meropeNode.style.top = (targetY / stageHeight * 100).toFixed(2) + '%';
        }

        // Unlock after transition duration (2600ms)
        setTimeout(() => {
            isTransitioning = false;
        }, 2600);
    }

    function toggleConstellationState(container) {
        if (!container) return;
        const current = container.getAttribute('data-state') || 'cluster';
        const target = (current === 'cluster') ? 'constellation' : 'cluster';
        setConstellationState(container, target);
    }

    window.togglePortfolioConstellationState = function() {
        const homeSky = document.getElementById('hq-constellation-sky');
        if (homeSky) {
            const mapEl = homeSky.querySelector('.constellation-map');
            if (mapEl) toggleConstellationState(mapEl);
        }
    };

    function renderConstellation(targetContainer = document.getElementById('pleiades-stage-mount'), initialState = 'cluster') {
        if (!targetContainer) return null;
        targetContainer.innerHTML = '';

        const stageWidth = 1000;
        const stageHeight = 750;
        const centerX = 500;
        const centerY = 460;

        const isClusterInitial = (initialState === 'cluster');

        const container = document.createElement('div');
        container.className = 'constellation-map';
        container.setAttribute('data-state', initialState);

        // Pre-build index of relations per project
        const relationsByProj = {};
        CONSTELLATION_RELATIONS.forEach((rel, rIdx) => {
            if (!relationsByProj[rel.from]) relationsByProj[rel.from] = [];
            if (!relationsByProj[rel.to]) relationsByProj[rel.to] = [];
            relationsByProj[rel.from].push({ ...rel, otherId: rel.to, rIdx });
            relationsByProj[rel.to].push({ ...rel, otherId: rel.from, rIdx });
        });

        // 1. Primary Radial Curves from EG. (500, 460) to each project
        let radialSvgPaths = '';
        CONSTELLATION_PROJECTS.forEach((p, idx) => {
            const dx = p.x - centerX;
            const dy = p.y - centerY;
            const len = Math.hypot(dx, dy) || 1;
            const mx = (centerX + p.x) / 2;
            const my = (centerY + p.y) / 2;
            const nx = -dy / len;
            const ny = dx / len;
            let cx = mx + nx * 20;
            let cy = my + ny * 20;
            if (p.id === 'chronoclines') {
                cx = mx - 10;
                cy = my - 20;
            }

            radialSvgPaths += `
                <path class="constellation-line radial-line" data-id="${p.id}" data-idx="${idx}"
                      d="M ${centerX} ${centerY} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${p.x} ${p.y}"
                      vector-effect="non-scaling-stroke" />
            `;
        });

        // 2. Secondary Conceptual Connection Curves
        let secondarySvgPaths = '';
        let relationLabelsHtml = '';
        CONSTELLATION_RELATIONS.forEach((rel, rIdx) => {
            secondarySvgPaths += `
                <path class="constellation-line secondary-line" data-ridx="${rIdx}" data-from="${rel.from}" data-to="${rel.to}"
                      d="${rel.curve}" vector-effect="non-scaling-stroke" />
            `;
            const badgeLeftPct = (rel.labelX / stageWidth * 100).toFixed(2);
            const badgeTopPct = (rel.labelY / stageHeight * 100).toFixed(2);
            relationLabelsHtml += `
                <div class="relation-theme-badge" data-ridx="${rIdx}" style="left: ${badgeLeftPct}%; top: ${badgeTopPct}%;">
                    <span class="theme-badge-line">${rel.themeLine1}</span>
                    <span class="theme-badge-line">${rel.themeLine2}</span>
                </div>
            `;
        });

        // 3. HTML Nodes for all 12 projects
        let nodesHtml = '';

        CONSTELLATION_PROJECTS.forEach((p, idx) => {
            const pleiadesStar = PLEIADES_STARS_BY_TARGET[p.id];
            const isClusterStar = !!pleiadesStar;
            const isSelected = SELECTED_PROJECT_IDS.has(p.id) || SELECTED_TITLES.has(p.title);
            const selectedClass = isSelected ? 'is-selected-work' : '';
            const clusterClass = isClusterStar ? 'is-cluster-star' : '';

            // Initial coordinates based on state
            const initX = (isClusterInitial && isClusterStar) ? pleiadesStar.clusterX : p.x;
            const initY = (isClusterInitial && isClusterStar) ? pleiadesStar.clusterY : p.y;
            const leftPct = (initX / stageWidth * 100).toFixed(2);
            const topPct = (initY / stageHeight * 100).toFixed(2);

            const keywordsHtml = p.keywords.join(' &middot; ');
            const keywordsUpper = p.keywords.join(' · ').toUpperCase();
            const cardSideClass = p.cardDir || ((p.x > 700) ? 'card-left' : 'card-right');

            const numLabelHtml = isSelected
                ? `<span class="node-star-badge">
                        <svg class="node-star-svg" viewBox="0 0 24 24" aria-hidden="true">
                            <polygon points="12,1.5 15.2,8.5 22.8,9.5 17.2,14.8 18.8,22.5 12,18.6 5.2,22.5 6.8,14.8 1.2,9.5 8.8,8.5"/>
                        </svg>
                        <span class="node-star-num">${p.num}</span>
                   </span><span class="node-num-dash">&mdash;</span>`
                : `<span class="node-num">${p.num} &mdash;</span>`;

            const cardTitleHtml = isSelected
                ? `<span class="card-star-badge">★</span> ${p.num} &mdash; ${p.title}`
                : `${p.num} &mdash; ${p.title}`;

            // Cluster star visual markup (if part of Pleiades M45)
            // Cluster star visual markup (if part of Pleiades M45)
            let clusterStarVisualHtml = '';
            if (isClusterStar) {
                clusterStarVisualHtml = `
                    <div class="cluster-star-visual" data-star-id="${pleiadesStar.starId}">
                        <div class="cs-orbit-ring ring-spin-slow"></div>
                        <div class="cs-orbit-ring ring-dashed"></div>
                        <div class="cs-core">
                            <span class="cs-symbol">&#x2726;</span>
                        </div>
                        <div class="cs-caption-block">
                            <span class="cs-project-name">${p.num} &mdash; ${p.title}</span>
                            <span class="cs-star-astronomy">${pleiadesStar.starName} &bull; ${pleiadesStar.bayer}</span>
                        </div>
                        <div class="cluster-star-pill">
                            <div class="csp-star">${pleiadesStar.starName} <span class="csp-bayer">&bull; ${pleiadesStar.bayer}</span></div>
                            <div class="csp-title">${p.num} ${p.title}</div>
                            <div class="csp-meta">${pleiadesStar.mag} &bull; ${p.medium}</div>
                        </div>
                    </div>
                `;
            }

            // Celestial star birth stagger delay
            const starDelay = isClusterStar ? '0s' : ((0.06 + (idx % 7) * 0.08).toFixed(2) + 's');
            const isAward = !!p.isAward;
            const awardClass = isAward ? 'is-award-winner' : '';

            nodesHtml += `
                <div class="constellation-node node-${p.labelPos} ${cardSideClass} ${selectedClass} ${clusterClass} ${awardClass}" data-id="${p.id}" data-idx="${idx}"
                     data-award="${isAward ? 'true' : 'false'}"
                     data-num="${p.num}" data-title="${p.title}" data-question="${p.question}"
                     data-medium="${p.medium}" data-year="${p.year}" data-url="${p.url}"
                     data-cluster-x="${isClusterStar ? pleiadesStar.clusterX : p.x}"
                     data-cluster-y="${isClusterStar ? pleiadesStar.clusterY : p.y}"
                     data-triangle-x="${p.x}"
                     data-triangle-y="${p.y}"
                     style="left: ${leftPct}%; top: ${topPct}%; --star-delay: ${starDelay}; animation-delay: ${(0.15 + idx * 0.05).toFixed(2)}s; --proj-color: ${p.color}; --proj-rgb: ${p.colorRgb}; --proj-accent2: ${p.accent2 || p.color}; --proj-accent2-rgb: ${p.accent2Rgb || p.colorRgb}; --proj-bg-dark: ${p.darkBg || '#030712'}; --proj-bg-rgb: ${p.darkBgRgb || '3, 7, 18'};">

                    ${clusterStarVisualHtml}

                    <!-- 1. Animated Orbital Constellation Rig -->
                    <div class="node-orbit-rig" aria-hidden="true">
                        <div class="orbit-circle orbit-ring-inner"></div>
                        <div class="orbit-circle orbit-ring-dashed"></div>
                        <div class="orbit-circle orbit-ring-outer">
                            <div class="orbit-sat sat-year-anchor"><span class="sat-point"></span></div>
                            <div class="orbit-sat sat-card-beacon"><span class="sat-point sat-glow"></span></div>
                            <div class="orbit-sat sat-bottom"><span class="sat-point"></span></div>
                            <div class="orbit-sat sat-top-tick"><span class="sat-point sat-tiny"></span></div>
                        </div>
                    </div>

                    <!-- 2. Floating Contextual Constellation Card -->
                    <div class="node-hover-card" style="--proj-color: ${p.color}; --proj-rgb: ${p.colorRgb}; --proj-accent2: ${p.accent2 || p.color}; --proj-accent2-rgb: ${p.accent2Rgb || p.colorRgb}; --proj-bg-dark: ${p.darkBg || '#030712'}; --proj-bg-rgb: ${p.darkBgRgb || '3, 7, 18'};">
                        <div class="card-pill-row">
                            <span class="card-year-tag">${p.year}</span>
                            ${isAward ? '<span class="card-award-pill">&#x2605; AWARD WINNER</span>' : ''}
                        </div>
                        <div class="card-top-row">
                            <span class="card-title-text">${cardTitleHtml}</span>
                            <span class="card-external-arrow">&#x2197;</span>
                        </div>
                        <div class="card-question-text">&ldquo;${p.question}&rdquo;</div>
                        <div class="card-concepts-text">${keywordsUpper}</div>
                        <div class="card-btn-row">
                            <a href="${p.url}" class="card-action-btn card-btn-preview">
                                PREVIEW&nbsp;&#x2197;
                            </a>
                            <a href="${p.url}" class="card-action-btn modal-open-standalone-btn card-btn-dedicated">
                                DEDICATED PAGE&nbsp;&#x2197;
                            </a>
                        </div>
                    </div>

                    <!-- 4. Core Architectural Artifact Image Circle -->
                    <a href="${p.url}" class="node-visual" aria-label="${p.title}">
                        <div class="visual-img" style="background-image: url('${p.img}');"></div>
                    </a>

                    <!-- 5. Default Architectural Label -->
                    <div class="node-label">
                        <div class="node-header">
                            ${numLabelHtml}
                            <span class="node-title">${p.titleDisplay || p.title}</span>
                        </div>
                        <div class="node-keywords">${keywordsHtml}</div>
                    </div>
                </div>
            `;
        });

        // 4. Merope (The Hidden Sister) / DESIGN APPROACH Morphing Node
        const meropeConfig = PLEIADES_STARS_BY_TARGET['merope-story'];
        const meropeInitX = isClusterInitial ? meropeConfig.clusterX : meropeConfig.triangleX;
        const meropeInitY = isClusterInitial ? meropeConfig.clusterY : meropeConfig.triangleY;
        const meropeLeftPct = (meropeInitX / stageWidth * 100).toFixed(2);
        const meropeTopPct = (meropeInitY / stageHeight * 100).toFixed(2);
        const meropeHtml = `
            <a href="#design-approach" class="merope-star constellation-design-approach-node" id="merope-star-node"
               data-id="merope"
               data-tab="design-approach"
               data-cluster-x="${meropeConfig.clusterX}"
               data-cluster-y="${meropeConfig.clusterY}"
               data-triangle-x="${meropeConfig.triangleX}"
               data-triangle-y="${meropeConfig.triangleY}"
               tabindex="0"
               role="button"
               aria-label="The Hidden Sister &bull; Design Approach"
               style="left: ${meropeLeftPct}%; top: ${meropeTopPct}%;">
                <div class="center-ring ring-outer"></div>
                <div class="center-ring ring-mid"></div>

                <!-- State A: The Hidden Sister in Cluster Mode -->
                <div class="merope-cluster-view">
                    <div class="cs-orbit-ring ring-dashed" style="width: 56px; height: 56px;"></div>
                    <div class="cs-core">
                        <span class="cs-symbol">&#x2726;</span>
                    </div>
                    <div class="cs-caption-block">
                        <span class="cs-project-name">The Hidden Sister</span>
                        <span class="cs-star-astronomy">Merope &bull; 23 Tauri</span>
                    </div>
                    <div class="cluster-star-pill">
                        <div class="csp-star">MEROPE <span class="csp-bayer">&bull; 23 Tauri</span></div>
                        <div class="csp-title">THE HIDDEN SISTER</div>
                        <div class="csp-meta">4.14 mag &bull; Click to read the narrative panel &rarr;</div>
                    </div>
                </div>

                <!-- State B: Design Approach in Constellation Mode -->
                <div class="merope-constellation-view">
                    <div class="c-approach-core">
                        <span class="c-approach-word">DESIGN</span>
                        <span class="c-approach-word">APPROACH</span>
                    </div>
                </div>
            </a>
        `;

        // 5. Alcyone / EG Center coordinates based on state
        const alcyoneConfig = PLEIADES_STARS_BY_TARGET['eg-center'];
        const egInitX = isClusterInitial ? alcyoneConfig.clusterX : alcyoneConfig.triangleX;
        const egInitY = isClusterInitial ? alcyoneConfig.clusterY : alcyoneConfig.triangleY;
        const egLeftPct = (egInitX / stageWidth * 100).toFixed(2);
        const egTopPct = (egInitY / stageHeight * 100).toFixed(2);

        container.innerHTML = `
            <div class="constellation-stage constellation-stage-core" data-state="${initialState}">
                <!-- Faint Architectural Background Watermark -->
                <div class="projects-watermark" class="constellation-watermark" aria-hidden="true">ASK A QUESTION</div>

                <!-- SVG Layer: Outer Ternary Frame, 3 Axes, Curves -->
                <svg class="constellation-svg" viewBox="0 0 ${stageWidth} ${stageHeight}" preserveAspectRatio="none">
                    <!-- Ambient Glow Layer -->
                    <polygon class="c-ternary-frame-glow" points="500,60 115,695 885,695" fill="none" vector-effect="non-scaling-stroke"/>
                    <line class="c-ternary-axis-glow" x1="500" y1="60" x2="500" y2="460" vector-effect="non-scaling-stroke"/>
                    <line class="c-ternary-axis-glow" x1="115" y1="695" x2="500" y2="460" vector-effect="non-scaling-stroke"/>
                    <line class="c-ternary-axis-glow" x1="885" y1="695" x2="500" y2="460" vector-effect="non-scaling-stroke"/>

                    <!-- Equilateral Ternary Outer Frame & 3 Axes -->
                    <polygon class="c-ternary-frame" points="500,60 115,695 885,695" fill="none" vector-effect="non-scaling-stroke"/>
                    <line class="c-ternary-axis" x1="500" y1="60" x2="500" y2="460" vector-effect="non-scaling-stroke"/>
                    <line class="c-ternary-axis" x1="115" y1="695" x2="500" y2="460" vector-effect="non-scaling-stroke"/>
                    <line class="c-ternary-axis" x1="885" y1="695" x2="500" y2="460" vector-effect="non-scaling-stroke"/>

                    <!-- Secondary Conceptual Curves -->
                    ${secondarySvgPaths}

                    <!-- Primary Radial Connectors from Design Approach -->
                    ${radialSvgPaths}
                </svg>

                <!-- Conceptual Relationship Theme Badges -->
                ${relationLabelsHtml}

                <!-- Alcyone Cluster Star / Brand Logo Node (Morphs to Top-Left in Constellation) -->
                <a href="#about" class="cluster-brand-node" id="cluster-brand-node"
                   data-cluster-x="${alcyoneConfig.clusterX}"
                   data-cluster-y="${alcyoneConfig.clusterY}"
                   data-triangle-x="${alcyoneConfig.triangleX}"
                   data-triangle-y="${alcyoneConfig.triangleY}"
                   aria-label="About Elifsu Genç — Alcyone &bull; &eta; Tauri"
                   style="left: ${egLeftPct}%; top: ${egTopPct}%;">
                    <div class="brand-cluster-circle">
                        <div class="center-ring ring-outer"></div>
                        <div class="center-ring ring-mid"></div>
                        <div class="brand-circle-core"></div>
                    </div>
                    <div class="brand-content">
                        <img src="./assets/logo-blue.gif" alt="Elifsu Genç Logo" class="brand-logo-gif" width="40" height="40">
                        <span class="brand-name-text">elifsu genc.</span>
                    </div>
                    <div class="cs-caption-block">
                        <span class="cs-project-name">About</span>
                        <span class="cs-star-astronomy">Alcyone &bull; &eta; Tauri</span>
                    </div>
                    <div class="cluster-star-pill">
                        <div class="csp-star">ALCYONE <span class="csp-bayer">&bull; &eta; Tauri</span></div>
                        <div class="csp-title">ABOUT // PRACTICE NEXUS</div>
                        <div class="csp-meta">2.87 mag &bull; Curriculum Vitae &bull; Manifesto &rarr;</div>
                    </div>
                </a>

                <!-- 3 Sector Corner Nodes (Vertices with Hover Emphasis) -->
                <a href="#design-approach" class="c-axis-link c-corner-node" data-vertex-key="critical-inquiry" data-tab="design-approach" aria-label="Methodology: Critical Inquiry" style="left: 50.00%; top: 8.00%;">
                    <div class="c-corner-ring-outer"></div>
                    <div class="c-corner-disc">
                        <span class="c-corner-text">CRITICAL</span>
                        <span class="c-corner-text">INQUIRY</span>
                    </div>
                </a>

                <a href="#design-approach" class="c-axis-link c-corner-node" data-vertex-key="contextual-research" data-tab="design-approach" aria-label="Methodology: Contextual Research" style="left: 11.50%; top: 92.67%;">
                    <div class="c-corner-ring-outer"></div>
                    <div class="c-corner-disc">
                        <span class="c-corner-text">CONTEXTUAL</span>
                        <span class="c-corner-text">RESEARCH</span>
                    </div>
                </a>

                <a href="#design-approach" class="c-axis-link c-corner-node" data-vertex-key="experimental-thinking" data-tab="design-approach" aria-label="Methodology: Experimental Thinking" style="left: 88.50%; top: 92.67%;">
                    <div class="c-corner-ring-outer"></div>
                    <div class="c-corner-disc">
                        <span class="c-corner-text">EXPERIMENTAL</span>
                        <span class="c-corner-text">THINKING</span>
                    </div>
                </a>

                <!-- Merope (The Hidden Sister) / DESIGN APPROACH Morphing Node -->
                ${meropeHtml}

                <!-- 12 Spatial Project Nodes -->
                ${nodesHtml}
            </div>
        `;

        targetContainer.appendChild(container);

        // --- Interaction Logic on Container ---
        const allNodes = container.querySelectorAll('.constellation-node');
        const allRadialLines = container.querySelectorAll('.radial-line');
        const allSecondaryLines = container.querySelectorAll('.secondary-line');
        const allRelationBadges = container.querySelectorAll('.relation-theme-badge');
        const approachNode = container.querySelector('#constellation-design-approach-node');
        const brandNodeEl = container.querySelector('#cluster-brand-node');
        const axisLinks = container.querySelectorAll('.c-axis-link');
        const meropeStar = container.querySelector('[id="merope-star-node"]');

        function resetConstellation() {
            container.classList.remove('has-hover', 'is-center-hovered', 'eg-intro-pulsing', 'is-vertex-hovered');
            allNodes.forEach(node => {
                node.classList.remove('is-hovered', 'is-dimmed', 'is-related', 'is-vertex-emphasized');
            });
            allRadialLines.forEach(line => line.classList.remove('active'));
            allSecondaryLines.forEach(line => line.classList.remove('active'));
            allRelationBadges.forEach(badge => badge.classList.remove('active'));

            const inquiryDisplay = document.getElementById('home-inquiry-display');
            if (inquiryDisplay) {
                inquiryDisplay.innerHTML = '&ldquo;HOVER A CONSTELLATION STAR OR PROJECT CARD TO TRACE ITS CORE SPATIAL QUESTION&rdquo;';
            }
            document.querySelectorAll('.hq-card').forEach(c => c.classList.remove('is-constellation-highlight'));
        }

        // Merope / Hidden Sister -> Design Approach Morphing Node
        if (meropeStar) {
            meropeStar.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const isCluster = container.getAttribute('data-state') === 'cluster';
                if (isCluster) {
                    openMeropeStoryModal();
                } else {
                    switchTab('design-approach');
                }
            });
        }

        // Alcyone Brand Node -> Navigate to About
        if (brandNodeEl) {
            brandNodeEl.addEventListener('click', (e) => {
                e.preventDefault();
                switchTab('about');
            });
        }

        // Clickable 3 Sector Headings -> Navigate to Methodology (ONLY in constellation state)
        axisLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                if (container.getAttribute('data-state') !== 'constellation') {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    return;
                }
                e.preventDefault();
                switchTab('design-approach');
            });
        });

        // SECTION 06: Vertex Hover Emphasis Behavior
        axisLinks.forEach(corner => {
            const vKey = corner.getAttribute('data-vertex-key');
            const assoc = PLEIADES_CONFIG.vertexAssociations[vKey];
            if (!assoc) return;

            corner.addEventListener('mouseenter', () => {
                if (container.getAttribute('data-state') !== 'constellation') return;
                if (cornersPulseTimeout) {
                    clearTimeout(cornersPulseTimeout);
                    cornersPulseTimeout = null;
                }
                container.classList.remove('corners-intro-pulsing');
                container.classList.add('is-vertex-hovered');
                const assocSet = new Set(assoc.projects);

                allNodes.forEach(node => {
                    const id = node.getAttribute('data-id');
                    if (assocSet.has(id)) {
                        node.classList.add('is-vertex-emphasized');
                        node.classList.remove('is-dimmed');
                    } else {
                        node.classList.add('is-dimmed');
                        node.classList.remove('is-vertex-emphasized');
                    }
                });
            });

            corner.addEventListener('mouseleave', () => {
                if (container.getAttribute('data-state') !== 'constellation') return;
                container.classList.remove('is-vertex-hovered');
                allNodes.forEach(node => {
                    node.classList.remove('is-vertex-emphasized', 'is-dimmed');
                });
            });
        });



        // Node hover & click interactions (strictly triggered by project photo sphere .node-visual)
        allNodes.forEach(node => {
            const projId = node.getAttribute('data-id');
            const projTitle = node.getAttribute('data-title');
            const projQuestion = node.getAttribute('data-question');
            const projMedium = node.getAttribute('data-medium') || '';
            const radialLine = container.querySelector(`.radial-line[data-id="${projId}"]`);
            const relations = relationsByProj[projId] || [];
            const nodeVisual = node.querySelector('.node-visual');
            const hoverCard = node.querySelector('.node-hover-card');

            function activateNodeHover() {
                if (container.getAttribute('data-state') !== 'constellation') return;
                container.classList.remove('eg-intro-pulsing');
                container.classList.add('has-hover');

                // 1. Highlight this node & radial line
                node.classList.add('is-hovered');
                if (radialLine) {
                    radialLine.classList.add('active');
                }

                // 2. Dim other nodes
                allNodes.forEach(other => {
                    if (other !== node) other.classList.add('is-dimmed');
                });

                // 3. Highlight connected relations in constellation state
                relations.forEach(rel => {
                    const secLine = container.querySelector(`.secondary-line[data-ridx="${rel.rIdx}"]`);
                    const secBadge = container.querySelector(`.relation-theme-badge[data-ridx="${rel.rIdx}"]`);
                    const relatedNode = container.querySelector(`.constellation-node[data-id="${rel.otherId}"]`);

                    if (secLine) secLine.classList.add('active');
                    if (secBadge) secBadge.classList.add('active');
                    if (relatedNode) {
                        relatedNode.classList.remove('is-dimmed');
                        relatedNode.classList.add('is-related');
                    }
                });

                // 4. Update inquiry bar display & highlight card in #hq-grid
                const inquiryDisplay = document.getElementById('home-inquiry-display');
                if (inquiryDisplay) {
                    inquiryDisplay.innerHTML = projQuestion ? 
                        `&ldquo;${projQuestion}&rdquo; &bull; <span style="color: var(--accent-color); font-weight: 700; font-family: monospace;">[${projTitle}${projMedium ? ' // ' + projMedium : ''}]</span>` : 
                        projTitle;
                }
                const correspondingCard = document.querySelector(`.hq-card[data-id="${projId}"]`);
                if (correspondingCard) {
                    correspondingCard.classList.add('is-constellation-highlight');
                }
            }

            // Only trigger hover when cursor enters the 66px project circle (.node-visual)
            if (nodeVisual) {
                nodeVisual.addEventListener('mouseenter', () => {
                    activateNodeHover();
                });

                nodeVisual.addEventListener('mouseleave', (e) => {
                    if (container.getAttribute('data-state') !== 'constellation') return;
                    // If moving into the open preview card, keep hover active
                    if (e.relatedTarget && hoverCard && (e.relatedTarget === hoverCard || hoverCard.contains(e.relatedTarget))) {
                        return;
                    }
                    resetConstellation();
                });
            }

            // Keep preview card interactive while hovering over it, reset when leaving both
            if (hoverCard) {
                hoverCard.addEventListener('mouseleave', (e) => {
                    if (container.getAttribute('data-state') !== 'constellation') return;
                    // If moving back to the visual circle, keep hover active
                    if (e.relatedTarget && nodeVisual && (e.relatedTarget === nodeVisual || nodeVisual.contains(e.relatedTarget))) {
                        return;
                    }
                    resetConstellation();
                });
            }

            // Safety cleanup when mouse leaves the node hierarchy entirely
            node.addEventListener('mouseleave', (e) => {
                if (container.getAttribute('data-state') !== 'constellation') return;
                if (e.relatedTarget && node.contains(e.relatedTarget)) return;
                resetConstellation();
            });

            // Direct click & hover on cluster star visual (cluster state)
            const clusterStarVis = node.querySelector('.cluster-star-visual');
            if (clusterStarVis) {
                const csCore = clusterStarVis.querySelector('.cs-core') || clusterStarVis;
                csCore.addEventListener('mouseenter', () => {
                    if (container.getAttribute('data-state') === 'cluster') {
                        node.classList.add('is-hovered');
                        const inquiryDisplay = document.getElementById('home-inquiry-display');
                        if (inquiryDisplay) {
                            inquiryDisplay.innerHTML = projQuestion ? 
                                `&ldquo;${projQuestion}&rdquo; &bull; <span style="color: var(--accent-color); font-weight: 700; font-family: monospace;">[${projTitle}${projMedium ? ' // ' + projMedium : ''}]</span>` : 
                                projTitle;
                        }
                    }
                });
                csCore.addEventListener('mouseleave', () => {
                    if (container.getAttribute('data-state') === 'cluster') {
                        node.classList.remove('is-hovered');
                        const inquiryDisplay = document.getElementById('home-inquiry-display');
                        if (inquiryDisplay) {
                            inquiryDisplay.innerHTML = '&ldquo;HOVER A CONSTELLATION STAR OR PROJECT CARD TO TRACE ITS CORE SPATIAL QUESTION&rdquo;';
                        }
                    }
                });
                clusterStarVis.addEventListener('click', (e) => {
                    const currentState = container.getAttribute('data-state');
                    if (currentState === 'cluster') {
                        e.preventDefault();
                        e.stopPropagation();
                        if (typeof window.openProjectModalBySlug === 'function') {
                            window.openProjectModalBySlug(projId);
                        }
                    }
                });
            }

            // Card or node click -> open project preview modal
            node.addEventListener('click', (e) => {
                const currentState = container.getAttribute('data-state');
                if (currentState === 'cluster') {
                    // In cluster mode, only allow clicks on actual .cluster-star-visual
                    if (!node.classList.contains('is-cluster-star') || !e.target.closest('.cluster-star-visual')) {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        return;
                    }
                }
                // If clicking an explicit dedicated link, let default handle it
                if (e.target.closest('.card-btn-dedicated')) return;
                e.preventDefault();
                if (typeof window.openProjectModalBySlug === 'function') {
                    window.openProjectModalBySlug(projId);
                }
            });
        });

        // Synchronize parent sky state, toggle buttons and status label if starting in constellation view
        if (!isClusterInitial) {
            const homeSky = document.getElementById('hq-constellation-sky');
            if (homeSky) homeSky.setAttribute('data-state', 'constellation');
            document.querySelectorAll('.cluster-transition-btn, #hq-cluster-toggle-pill').forEach(btn => {
                const icon = btn.querySelector('.ctb-icon, .c-toggle-glyph');
                const label = btn.querySelector('.ctb-text, .c-toggle-label');
                if (icon) icon.innerHTML = '&#x2190;';
                if (label) label.textContent = 'BACK TO CLUSTER';
            });
            const statusLabel = document.getElementById('pleiades-status-label');
            if (statusLabel) {
                statusLabel.textContent = 'CONSTELLATION STATE • ALL 12 PROJECTS';
            }
        }

        // Initial gentle pulse on first entrance if in constellation view
        if (!hasEgIntroPulsed && !isClusterInitial) {
            hasEgIntroPulsed = true;
            setTimeout(() => {
                if (container && !container.classList.contains('has-hover') && !container.classList.contains('is-center-hovered')) {
                    container.classList.add('eg-intro-pulsing');
                    setTimeout(() => {
                        if (container) container.classList.remove('eg-intro-pulsing');
                    }, 3850);
                }
            }, 600);
        }

        return container;
    }

    // Merope Story Modal Open & Close Functions
    function openMeropeStoryModal() {
        // Ensure project preview modal is closed so modals never overlap
        const pModal = document.getElementById('project-modal');
        if (pModal && !pModal.classList.contains('hidden')) {
            pModal.classList.add('hidden');
        }

        const modal = document.getElementById('merope-story-modal');
        if (modal) {
            modal.classList.remove('hidden');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            const card = modal.querySelector('.merope-modal-card');
            if (card) card.scrollTop = 0;
        }
    }

    function closeMeropeStoryModal() {
        const modal = document.getElementById('merope-story-modal');
        if (modal) {
            modal.classList.add('hidden');
            modal.setAttribute('aria-hidden', 'true');
            const pModal = document.getElementById('project-modal');
            if (!pModal || pModal.classList.contains('hidden')) {
                document.body.style.overflow = '';
            }
        }
    }

    window.openMeropeStoryModal = openMeropeStoryModal;
    window.closeMeropeStoryModal = closeMeropeStoryModal;

    // Direct event delegation for Merope clicks (ONLY in cluster state)
    document.addEventListener('click', (e) => {
        const stage = document.getElementById('hq-constellation-sky');
        const isCluster = !stage || stage.getAttribute('data-state') === 'cluster';
        const meropeTarget = e.target.closest('#merope-star-node, .merope-star, [data-id="merope"]');
        if (meropeTarget && isCluster) {
            e.preventDefault();
            e.stopPropagation();
            openMeropeStoryModal();
        }
    });

    const meropeCloseBtn = document.getElementById('merope-close-btn');
    if (meropeCloseBtn) meropeCloseBtn.addEventListener('click', closeMeropeStoryModal);

    const meropeBackdrop = document.getElementById('merope-modal-backdrop');
    if (meropeBackdrop) meropeBackdrop.addEventListener('click', closeMeropeStoryModal);

    const meropeExploreCta = document.getElementById('merope-explore-cta');
    if (meropeExploreCta) {
        meropeExploreCta.addEventListener('click', () => {
            closeMeropeStoryModal();
            const homeSky = document.getElementById('hq-constellation-sky');
            if (homeSky && homeSky.getAttribute('data-state') !== 'cluster') {
                const mapEl = homeSky.querySelector('.constellation-map');
                if (mapEl && typeof setConstellationState === 'function') {
                    setConstellationState(mapEl, 'cluster');
                }
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modal = document.getElementById('merope-story-modal');
            if (modal && !modal.classList.contains('hidden')) {
                closeMeropeStoryModal();
            }
        } else if (e.key === 'Enter' || e.key === ' ') {
            const activeEl = document.activeElement;
            if (activeEl && (activeEl.matches('#merope-star-node, .merope-star, [data-id="merope"]') || activeEl.closest('#merope-star-node, .merope-star, [data-id="merope"]'))) {
                e.preventDefault();
                openMeropeStoryModal();
            }
        }
    });

    // Wire up Transition Affordance Buttons
    const homeTransitionBtn = document.getElementById('cluster-transition-btn');
    const homeTogglePill = document.getElementById('hq-cluster-toggle-pill');
    const homeBottomCta = document.getElementById('hq-explore-bottom-cta');

    function handleStageToggleClick(e) {
        if (e) e.preventDefault();
        const homeSky = document.getElementById('hq-constellation-sky');
        if (homeSky) {
            const mapEl = homeSky.querySelector('.constellation-map');
            if (mapEl) toggleConstellationState(mapEl);
        }
    }

    if (homeTransitionBtn) homeTransitionBtn.addEventListener('click', handleStageToggleClick);
    if (homeTogglePill) homeTogglePill.addEventListener('click', handleStageToggleClick);
    if (homeBottomCta) {
        homeBottomCta.addEventListener('click', (e) => {
            e.preventDefault();
            const homeSky = document.getElementById('hq-constellation-sky');
            if (homeSky) {
                const mapEl = homeSky.querySelector('.constellation-map');
                if (mapEl) setConstellationState(mapEl, 'constellation');
                homeSky.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    }

    // Delayed cursor-following blue nebula: atmosphere only, never project/star positions.
    // Throttled to ~20 FPS (50ms) with cached stage dimensions to prevent forced layout recalculations.
    const atmosphericStage = document.getElementById('hq-constellation-sky');
    if (atmosphericStage && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        let lastNebulaTime = 0;
        let nebulaBounds = null;
        let pendingPointerEvent = null;
        let nebulaRaf = 0;
        const NEBULA_INTERVAL_MS = 50; // ~20 FPS throttle

        function updateNebulaBounds() {
            if (atmosphericStage) {
                nebulaBounds = atmosphericStage.getBoundingClientRect();
            }
        }
        window.addEventListener('resize', updateNebulaBounds, { passive: true });
        updateNebulaBounds();

        atmosphericStage.addEventListener('pointerenter', updateNebulaBounds, { passive: true });

        atmosphericStage.addEventListener('pointermove', (event) => {
            if (event.pointerType === 'touch') return;
            pendingPointerEvent = event;
            const now = performance.now();
            if (now - lastNebulaTime < NEBULA_INTERVAL_MS) return;
            lastNebulaTime = now;

            if (!nebulaRaf) {
                nebulaRaf = requestAnimationFrame(() => {
                    nebulaRaf = 0;
                    if (!pendingPointerEvent) return;
                    if (!nebulaBounds) updateNebulaBounds();
                    const b = nebulaBounds;
                    if (b && b.width && b.height) {
                        const x = ((pendingPointerEvent.clientX - b.left) / b.width - 0.5) * 48;
                        const y = ((pendingPointerEvent.clientY - b.top) / b.height - 0.5) * 36;
                        atmosphericStage.style.setProperty('--nebula-x', x.toFixed(1) + 'px');
                        atmosphericStage.style.setProperty('--nebula-y', y.toFixed(1) + 'px');
                    }
                });
            }
        }, { passive: true });

        atmosphericStage.addEventListener('pointerleave', () => {
            pendingPointerEvent = null;
            atmosphericStage.style.setProperty('--nebula-x', '0px');
            atmosphericStage.style.setProperty('--nebula-y', '0px');
        });
    }

    // Mount Pleiades Observatory Stage in #tab-main (Cluster View on Entry, or Constellation if requested by hash)
    const pleiadesMount = document.getElementById('pleiades-stage-mount');
    if (pleiadesMount) {
        const curHash = window.location.hash.replace('#', '').trim();
        const startInConstellation = (curHash === 'constellation' || curHash === 'projects' || curHash.startsWith('project-') || curHash.startsWith('modal-') || curHash.startsWith('card-'));
        renderConstellation(pleiadesMount, startInConstellation ? 'constellation' : 'cluster');
    }

    // --- SINGLE PAGE NAVIGATION ---
    const navBar = document.querySelector('.folder-tabs');

    function setActive(tabId) {
        tabButtons.forEach(btn => btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId));
    }

    let currentTabId = 'main';
    let previousTabId = 'main';

    // Helper to navigate to Constellation view on Main tab
    function goToProjects() {
        switchTab('main', false);
        const homeSky = document.getElementById('hq-constellation-sky');
        if (homeSky) {
            const mapEl = homeSky.querySelector('.constellation-map');
            if (mapEl) setConstellationState(mapEl, 'constellation', true);
            homeSky.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
    window.goToProjects = goToProjects;

    // --- PAGE NAVIGATION: each section is a separate full-screen page ---
    function switchTab(targetTabId, updateHash = true) {
        // There is no separate #projects page: project exploration lives directly in #tab-main
        if (targetTabId === 'projects') {
            switchTab('main', false);
            const homeSky = document.getElementById('hq-constellation-sky');
            if (homeSky) {
                const mapEl = homeSky.querySelector('.constellation-map');
                if (mapEl) setConstellationState(mapEl, 'constellation', updateHash);
            }
            if (updateHash) {
                history.replaceState(null, '', '#constellation');
            }
            return;
        }

        const target = document.getElementById(`tab-${targetTabId}`);
        if (!target) return;

        // Remember previous tab so [ BACK ] on About / Methodology returns to where the user came from
        if (currentTabId !== targetTabId && currentTabId !== 'about' && currentTabId !== 'design-approach') {
            previousTabId = currentTabId;
        }
        currentTabId = targetTabId;

        tabContents.forEach(c => c.classList.remove('active'));
        target.classList.add('active');
        setActive(targetTabId);
        document.body.classList.toggle('is-about-active', targetTabId === 'about');
        window.scrollTo({ top: 0, behavior: 'auto' });

        if (updateHash) {
            history.pushState(null, '', targetTabId === 'main' ? window.location.pathname : `#${targetTabId}`);
        }

        // Close project modal or merope story modal if open
        const pModal = document.getElementById('project-modal');
        if (pModal && !pModal.classList.contains('hidden')) {
            pModal.classList.add('hidden');
            document.body.style.overflow = '';
        }
        const mModal = document.getElementById('merope-story-modal');
        if (mModal && !mModal.classList.contains('hidden')) {
            closeMeropeStoryModal();
        }
    }

    function goBack() {
        switchTab(previousTabId || 'main');
    }
    window.goBack = goBack;
    window.goBackFromAbout = goBack;

    const aboutBackBtn = document.getElementById('about-back-btn');
    if (aboutBackBtn) {
        aboutBackBtn.addEventListener('click', (e) => {
            e.preventDefault();
            goBack();
        });
    }

    const approachBackBtn = document.getElementById('approach-back-btn');
    if (approachBackBtn) {
        approachBackBtn.addEventListener('click', (e) => {
            e.preventDefault();
            goBack();
        });
    }

    // CV Toolbar View Switcher / Smooth Scroll
    document.querySelectorAll('.cv-toolbar-nav .cv-tool-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const href = btn.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetEl = document.querySelector(href);
                if (targetEl) {
                    targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    document.querySelectorAll('.cv-toolbar-nav .cv-tool-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                }
            }
        });
    });

    window.goToPage = switchTab;

    tabButtons.forEach(button => {
        button.addEventListener('click', () => switchTab(button.getAttribute('data-tab')));
    });

    if (projectJumpBtn) {
        projectJumpBtn.addEventListener('click', () => switchTab(projectJumpBtn.getAttribute('data-target')));
    }

    document.addEventListener('click', (e) => {
        const spaceAbout = e.target.closest('#space-about-anchor, .space-about-anchor, #cluster-brand-node, .cluster-brand-node');
        if (spaceAbout) {
            e.preventDefault();
            switchTab('about');
            return;
        }

        const approachOrMerope = e.target.closest('#merope-star-node, .merope-star, #constellation-design-approach-node, .constellation-design-approach-node');
        if (approachOrMerope) {
            e.preventDefault();
            const homeSky = document.getElementById('hq-constellation-sky');
            const isCluster = !homeSky || homeSky.getAttribute('data-state') === 'cluster';
            if (isCluster) {
                openMeropeStoryModal();
            } else {
                switchTab('design-approach');
            }
            return;
        }
    });

    // Open the page matching the URL (e.g. index.html#archive, index.html#constellation, index.html#card-wood-weave) and support back/forward
    function openFromHash() {
        const hash = window.location.hash.replace('#', '').trim();
        
        // Handle return to a specific project modal over Constellation Map (e.g. #project-wood-weave, #modal-wood-weave, #card-wood-weave)
        if (hash.startsWith('project-') || hash.startsWith('modal-') || hash.startsWith('card-') || (hash && document.getElementById(`card-${hash}`))) {
            const slug = hash.replace(/^(project-|modal-|card-)/, '');
            
            // 1. Activate Main tab and ensure Constellation state is active
            switchTab('main', false);
            const homeSky = document.getElementById('hq-constellation-sky');
            if (homeSky) {
                const mapEl = homeSky.querySelector('.constellation-map');
                if (mapEl) setConstellationState(mapEl, 'constellation', false);
            }
            
            // 2. Open the project modal preview window with dedicated page button
            setTimeout(() => {
                if (typeof window.openProjectModalBySlug === 'function') {
                    window.openProjectModalBySlug(slug);
                }
            }, 100);
            return;
        }

        if (hash === 'constellation' || hash === 'projects') {
            switchTab('main', false);
            const homeSky = document.getElementById('hq-constellation-sky');
            if (homeSky) {
                const mapEl = homeSky.querySelector('.constellation-map');
                if (mapEl) setConstellationState(mapEl, 'constellation', false);
                setTimeout(() => {
                    homeSky.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 60);
            }
            if (hash === 'projects') {
                history.replaceState(null, '', '#constellation');
            }
            return;
        }

        const id = hash || 'main';
        switchTab(document.getElementById(`tab-${id}`) ? id : 'main', false);

        if (id === 'main') {
            const homeSky = document.getElementById('hq-constellation-sky');
            if (homeSky) {
                const mapEl = homeSky.querySelector('.constellation-map');
                if (mapEl && mapEl.getAttribute('data-state') === 'constellation') {
                    setConstellationState(mapEl, 'cluster', false);
                }
            }
        }
    }
    window.addEventListener('popstate', openFromHash);
    openFromHash();

    // Subtle border under the nav once the page is scrolled
    window.addEventListener('scroll', () => {
        if (navBar) navBar.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });

    // Keyboard accessibility for tabs
    const folderTabs = document.querySelector('.folder-tabs');
    if (folderTabs) {
        folderTabs.addEventListener('keydown', (e) => {
            const activeElement = document.activeElement;
            if (!activeElement.classList.contains('tab-button')) return;

            const tabsArray = Array.from(tabButtons);
            const index = tabsArray.indexOf(activeElement);

            let nextIndex;
            if (e.key === 'ArrowRight') {
                nextIndex = (index + 1) % tabsArray.length;
                tabsArray[nextIndex].focus();
            } else if (e.key === 'ArrowLeft') {
                nextIndex = (index - 1 + tabsArray.length) % tabsArray.length;
                tabsArray[nextIndex].focus();
            } else if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                activeElement.click();
            }
        });
    }
});

// --- HOME: CURATED SPATIAL SHOWCASE & CONSTELLATION INTERACTION ---
document.addEventListener('DOMContentLoaded', () => {
    const quadContainer = document.getElementById('home-selected-quad');
    const quadCards = document.querySelectorAll('.hq-card');
    const starNodes = document.querySelectorAll('.hq-star-node');
    const constellationLines = document.querySelectorAll('.hq-constellation-line');
    const viewButtons = document.querySelectorAll('.hq-view-btn');
    const inquiryDisplay = document.getElementById('home-inquiry-display');
    const matrixDisplay = document.getElementById('matrix-project-name');
    const defaultInquiry = '&ldquo;HOVER A CONSTELLATION STAR OR PROJECT CARD TO TRACE ITS CORE SPATIAL QUESTION&rdquo;';

    // Helper to highlight a project across star node, lines, and cards
    function highlightConstellationProject(id, title, question, medium) {
        // 1. Highlight star nodes in both observatory stage and legacy nodes
        const allNodes = document.querySelectorAll('.hq-star-node, .constellation-node');
        allNodes.forEach(node => {
            if (node.getAttribute('data-id') === id) {
                node.classList.add('is-hovered');
            } else {
                node.classList.remove('is-hovered');
            }
        });

        // 2. Highlight connected constellation lines
        const allLines = document.querySelectorAll('.hq-constellation-line, .rel-line');
        allLines.forEach(line => {
            const from = line.getAttribute('data-from');
            const to = line.getAttribute('data-to');
            if (from === id || to === id) {
                line.classList.add('is-active-line');
            } else {
                line.classList.remove('is-active-line');
            }
        });

        // 3. Highlight corresponding card
        quadCards.forEach(card => {
            if (card.getAttribute('data-id') === id) {
                card.classList.add('is-constellation-highlight');
            } else {
                card.classList.remove('is-constellation-highlight');
            }
        });

        // 4. Update inquiry displays
        if (inquiryDisplay) {
            inquiryDisplay.innerHTML = question ? 
                `&ldquo;${question}&rdquo; &bull; <span style="color: var(--accent-color); font-weight: 700; font-style: normal; font-family: monospace;">[${title}${medium ? ' // ' + medium : ''}]</span>` : 
                title;
        }
        if (matrixDisplay) {
            matrixDisplay.innerText = question ? `"${question}"` : title;
        }
    }

    function resetConstellationHighlight() {
        document.querySelectorAll('.hq-star-node, .constellation-node').forEach(n => n.classList.remove('is-hovered'));
        document.querySelectorAll('.hq-constellation-line, .rel-line').forEach(l => l.classList.remove('is-active-line'));
        quadCards.forEach(c => c.classList.remove('is-constellation-highlight'));
        if (inquiryDisplay) {
            inquiryDisplay.innerHTML = defaultInquiry;
        }
        if (matrixDisplay) {
            matrixDisplay.innerText = '&mdash; &mdash; &mdash;';
        }
    }

    // Star Nodes events
    starNodes.forEach(node => {
        const id = node.getAttribute('data-id');
        const question = node.getAttribute('data-question');
        const title = node.getAttribute('data-title');
        const medium = node.getAttribute('data-medium') || '';

        node.addEventListener('mouseenter', () => {
            highlightConstellationProject(id, title, question, medium);
        });

        node.addEventListener('mouseleave', () => {
            resetConstellationHighlight();
        });

        node.addEventListener('click', (e) => {
            e.preventDefault();
            if (typeof window.openProjectModalBySlug === 'function') {
                window.openProjectModalBySlug(id);
            } else {
                const targetCard = document.querySelector(`.hq-card[data-id="${id}"]`);
                if (targetCard) {
                    targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });
    });

    // Cards events
    quadCards.forEach(card => {
        const id = card.getAttribute('data-id');
        const question = card.getAttribute('data-question');
        const title = card.getAttribute('data-title');
        const medium = card.getAttribute('data-medium') || '';

        card.addEventListener('mouseenter', () => {
            highlightConstellationProject(id, title, question, medium);
        });

        card.addEventListener('mouseleave', () => {
            resetConstellationHighlight();
        });
    });

    // View mode tabs (Both, Sky, Cards)
    if (viewButtons.length > 0 && quadContainer) {
        viewButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                viewButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const mode = btn.getAttribute('data-mode') || 'both';
                quadContainer.setAttribute('data-active-mode', mode);
            });
        });
    }

    // Fallback for m-hit if present
    const hits = document.querySelectorAll('.m-hit');
    if (matrixDisplay && hits.length > 0) {
        hits.forEach(hit => {
            hit.addEventListener('mouseenter', () => {
                const q = hit.getAttribute('data-question');
                const t = hit.getAttribute('data-title');
                matrixDisplay.innerText = q ? `"${q}"` : t;
            });
            hit.addEventListener('mouseleave', () => {
                matrixDisplay.innerText = '— — —';
            });
        });
    }
});

// --- METHODOLOGY: TERNARY DIAGRAM & ACTIVE LENS INTERACTION ---
document.addEventListener('DOMContentLoaded', () => {
    const lensPanel = document.getElementById('methodology-lens');
    const lensStatus = document.getElementById('m-lens-status');
    const lensContent = document.getElementById('m-lens-content');
    const lensButtons = document.querySelectorAll('.m-lens-btn');
    const triNodes = document.querySelectorAll('.m-tri-node-group');
    const triCore = document.getElementById('m-tri-core');
    const triEdges = document.querySelectorAll('.m-tri-edge-group');

    if (!lensPanel || !lensContent) return;

    const LENS_DATA = {
        all: {
            mode: 'ACTIVE LENS // EG. PRACTICE SYNTHESIS',
            badge: 'EQUILIBRIUM BARYCENTER',
            title: 'CONTINUOUS SPATIAL SYNTHESIS LOOP',
            quote: '“Architecture is neither pure ideological critique nor indifferent physical construction: it is an epistemic feedback loop.”',
            desc: 'Rather than executing predetermined briefs, my architectural methodology operates through perpetual tension between ethical interrogation, physical matter, and site forensics. Every inquiry unearths dormant memories; every material prototype tests speculative justice; every spatial encounter invites the public to reconsider the ordinary.',
            flow: ['01. QUESTION', '02. EXCAVATE', '03. PROTOTYPE', '04. RETHINK'],
            footerLabel: 'ALL 8 CORE WORKS CONVERGE AT BARYCENTER',
            projects: []
        },
        v1: {
            mode: 'FOCUSED LENS // VERTEX 01: CRITICAL INQUIRY',
            badge: 'APEX COGNITIVE POLE',
            title: 'CRITICAL INQUIRY // DECONSTRUCTING THE FAMILIAR',
            quote: '“What is left unspoken? Whose perspectives are centered?”',
            desc: 'Architecture frequently operates as a tool of spatial obedience and institutional erasure. This pole approaches every spatial convention as a political contract to be deconstructed. By centering the dignity of overlooked Turkish workers and examining multi-species urban coexistence, it transforms architectural briefs into spaces of active resistance and memory.',
            flow: ['ETHICAL AUDIT', 'INSTITUTIONAL CRITIQUE', 'SPATIAL JUSTICE'],
            footerLabel: 'MANIFESTED PROJECTS:',
            projects: [
                { title: 'STRAY', url: './projects/stray/' },
                { title: 'EMEK MUSEUM', url: './projects/emek-museum/' }
            ]
        },
        v2: {
            mode: 'FOCUSED LENS // VERTEX 02: CONTEXTUAL RESEARCH',
            badge: 'BASE-LEFT COGNITIVE POLE',
            title: 'CONTEXTUAL RESEARCH // EXCAVATING MATERIAL MEMORY',
            quote: '“What does matter remember? What traces exist?”',
            desc: 'Context is never a passive backdrop or a static municipal zone; it is a live archive of microclimatic comfort, material wear, and historical strata. This pole investigates passive shade and ephemeral cooling in Andalusian patios, treats urban sedimentary transformations as an autonomous museum, and shapes social atmospheres through culinary communion.',
            flow: ['MICROCLIMATES', 'SEDIMENTARY LAYERS', 'EPHEMERAL CANOPIES'],
            footerLabel: 'MANIFESTED PROJECTS:',
            projects: [
                { title: 'BAJO LA FRESCA', url: './projects/bajo-la-fresca/' },
                { title: 'CHRONOCLINES', url: './projects/chronoclines/' },
                { title: 'MILLIEU', url: './projects/millieu/' }
            ]
        },
        v3: {
            mode: 'FOCUSED LENS // VERTEX 03: EXPERIMENTAL THINKING',
            badge: 'BASE-RIGHT COGNITIVE POLE',
            title: 'EXPERIMENTAL THINKING // SPECULATIVE EMBODIMENT & MATTER',
            quote: '“How do we make hidden systemic crises tangible?”',
            desc: 'Theoretical inquiry achieves its true ethical resonance when tested against physical matter, bodily touch, and temporal mortality. This pole explores bio-fabricated microplastic decay cycles connecting planetary toxicity to our food, sculpts raw soil & fired clay vessels investigating mortality, and crafts digital archives tracking ephemeral human gestures.',
            flow: ['BIOMATERIAL CYCLES', 'SOIL & CLAY TECTONICS', 'DIGITAL FORENSICS'],
            footerLabel: 'MANIFESTED PROJECTS:',
            projects: [
                { title: 'BIO-DECAY', url: './projects/bio-decay/' },
                { title: 'THE EARTHEN', url: './projects/the-earthen/' },
                { title: 'YOU WERE HERE.', url: './projects/you-were-here/' }
            ]
        },
        'edge-left': {
            mode: 'DIALECTICAL TENSION // LEFT AXIS',
            badge: 'INQUIRY × CONTEXT TENSION',
            title: 'INSTITUTIONAL CRITIQUE × MATERIAL FORENSICS',
            quote: '“How does ethical resistance anchor itself in the sedimentary memory of site?”',
            desc: 'Bridging Critical Inquiry and Contextual Research: Interrogating who built the city while excavating physical strata of stone, pavement, and labor wear. Theory meets forensic fieldwork.',
            flow: ['DECONSTRUCT BRIEF', '⇄', 'EXCAVATE STRATA'],
            footerLabel: 'BRIDGE WORKS:',
            projects: [
                { title: 'EMEK MUSEUM', url: './projects/emek-museum/' },
                { title: 'CHRONOCLINES', url: './projects/chronoclines/' }
            ]
        },
        'edge-right': {
            mode: 'DIALECTICAL TENSION // RIGHT AXIS',
            badge: 'INQUIRY × EXPERIMENT TENSION',
            title: 'SPECULATIVE EMBODIMENT × BIOPOLITICS',
            quote: '“How do abstract systemic crises translate into living physical vulnerability?”',
            desc: 'Bridging Critical Inquiry and Experimental Thinking: Connecting planetary pollution and societal control directly to the vulnerable human body through decaying biomaterials and interactive public installations.',
            flow: ['ETHICAL AUDIT', '⇄', 'BIOMATERIAL PROTOTYPE'],
            footerLabel: 'BRIDGE WORKS:',
            projects: [
                { title: 'STRAY', url: './projects/stray/' },
                { title: 'BIO-DECAY', url: './projects/bio-decay/' }
            ]
        },
        'edge-bottom': {
            mode: 'DIALECTICAL TENSION // BASE AXIS',
            badge: 'CONTEXT × EXPERIMENT TENSION',
            title: 'CLIMATIC MEMORY × TECTONIC PROTOTYPING',
            quote: '“How does physical matter respond to time, temperature, and cyclical decay?”',
            desc: 'Bridging Contextual Research and Experimental Thinking: Testing natural microclimates, earth and raw clay vessels, and atmospheric canopies against real material degradation and weathering.',
            flow: ['SITE SENSITIVITY', '⇄', 'TECTONIC PROTOTYPE'],
            footerLabel: 'BRIDGE WORKS:',
            projects: [
                { title: 'BAJO LA FRESCA', url: './projects/bajo-la-fresca/' },
                { title: 'THE EARTHEN', url: './projects/the-earthen/' }
            ]
        }
    };

    let currentSelectedPole = 'all';

    function renderLens(poleKey) {
        const data = LENS_DATA[poleKey] || LENS_DATA.all;
        
        // Update header status
        if (lensStatus) lensStatus.textContent = data.mode;
        
        // Update container highlight classes
        lensPanel.classList.remove('highlight-v1', 'highlight-v2', 'highlight-v3');
        if (poleKey === 'v1') lensPanel.classList.add('highlight-v1');
        else if (poleKey === 'v2') lensPanel.classList.add('highlight-v2');
        else if (poleKey === 'v3') lensPanel.classList.add('highlight-v3');

        // Update button active states
        lensButtons.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-pole') === poleKey);
        });

        // Update SVG node focus
        triNodes.forEach(node => {
            node.classList.toggle('is-focused', node.getAttribute('data-pole') === poleKey);
        });

        // Build project pills HTML
        let projHtml = '';
        if (data.projects && data.projects.length > 0) {
            projHtml = data.projects.map(p => `<a href="${p.url}" class="m-lens-proj-pill">${p.title} &nearr;</a>`).join(' ');
        }

        // Build flow pills HTML
        let flowHtml = data.flow.map((step, idx) => {
            return step === '⇄' 
                ? `<span class="m-flow-sep">&harr;</span>`
                : (idx > 0 && data.flow[idx - 1] !== '⇄' 
                    ? `<span class="m-flow-sep">&rarr;</span><span class="m-flow-step">${step}</span>` 
                    : `<span class="m-flow-step">${step}</span>`);
        }).join('');

        lensContent.innerHTML = `
            <div class="m-lens-card-inner">
                <div class="m-lens-meta-row">
                    <span class="m-lens-badge">${data.badge}</span>
                    <h3 class="m-lens-title">${data.title}</h3>
                </div>
                <p class="m-lens-quote">${data.quote}</p>
                <p class="m-lens-desc">${data.desc}</p>
                <div class="m-lens-footer-row">
                    <div class="m-lens-flow-pills">${flowHtml}</div>
                    <div class="m-lens-tag-list">
                        <span class="m-lens-tag-label">${data.footerLabel}</span>
                        ${projHtml}
                    </div>
                </div>
            </div>
        `;
    }

    // Switcher buttons click
    lensButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            currentSelectedPole = btn.getAttribute('data-pole');
            renderLens(currentSelectedPole);
        });
    });

    // SVG Vertices hover and click
    triNodes.forEach(node => {
        const pole = node.getAttribute('data-pole');
        node.addEventListener('mouseenter', () => {
            renderLens(pole);
        });
        node.addEventListener('mouseleave', () => {
            renderLens(currentSelectedPole);
        });
        node.addEventListener('click', (e) => {
            if (!e.target.closest('.m-tri-tag-group')) {
                currentSelectedPole = pole;
                renderLens(currentSelectedPole);
            }
        });
    });

    // SVG Core hover and click
    if (triCore) {
        triCore.addEventListener('mouseenter', () => {
            renderLens('all');
        });
        triCore.addEventListener('mouseleave', () => {
            renderLens(currentSelectedPole);
        });
        triCore.addEventListener('click', () => {
            currentSelectedPole = 'all';
            renderLens('all');
        });
    }

    // SVG Tension Edges hover
    triEdges.forEach(edge => {
        const edgeId = 'edge-' + edge.getAttribute('data-edge');
        edge.addEventListener('mouseenter', () => {
            renderLens(edgeId);
        });
        edge.addEventListener('mouseleave', () => {
            renderLens(currentSelectedPole);
        });
    });
});

// --- PROJECT MODAL INTERACTION ---
document.addEventListener('DOMContentLoaded', () => {
    const projectModal = document.getElementById('project-modal');
    const modalClose = document.getElementById('modal-close');
    
    if (projectModal && modalClose) {
        // Close modal
        modalClose.addEventListener('click', () => {
            projectModal.classList.add('hidden');
            document.body.style.overflow = '';
            if (window.location.hash.startsWith('#project-') || window.location.hash.startsWith('#modal-') || window.location.hash.startsWith('#card-') || window.location.hash === '#projects') {
                history.replaceState(null, '', '#constellation');
            }
        });

        function openProjectModalBySlug(slug) {
            if (!slug || !projectModal) return;
            slug = slug.replace(/^(project-|modal-|card-)/, '').trim();
            window.lastOpenedProjectSlug = slug;

            // Try to find the master project card in the Projects tab to get full data
            let masterCard = document.querySelector(`.project-card[href*="${slug}"]`) || document.getElementById(`card-${slug}`);
            
            let projectData = null;
            if (typeof CONSTELLATION_PROJECTS !== 'undefined') {
                projectData = CONSTELLATION_PROJECTS.find(p => p.id === slug || (p.url && p.url.includes(slug)));
            } else if (typeof allConstellationProjects !== 'undefined') {
                projectData = allConstellationProjects.find(p => p.id === slug || p.url.includes(slug));
            }

            const num = masterCard ? masterCard.getAttribute('data-num') : (projectData ? projectData.num : '00');
            const title = masterCard ? masterCard.getAttribute('data-title') : (projectData ? projectData.title : 'TITLE');
            const question = masterCard ? masterCard.getAttribute('data-question') : (projectData ? projectData.question : 'Question?');
            const medium = masterCard ? masterCard.getAttribute('data-medium') : (projectData ? projectData.medium : 'Medium');
            const year = masterCard ? masterCard.getAttribute('data-year') : (projectData ? projectData.year : 'Year');

            if (projectData) {
                if (projectData.color) {
                    projectModal.style.setProperty('--proj-color', projectData.color);
                    projectModal.style.setProperty('--proj-rgb', projectData.colorRgb);
                }
                if (projectData.accent2) {
                    projectModal.style.setProperty('--proj-accent2', projectData.accent2);
                    projectModal.style.setProperty('--proj-accent2-rgb', projectData.accent2Rgb);
                } else {
                    projectModal.style.setProperty('--proj-accent2', projectData.color || '#38bdf8');
                    projectModal.style.setProperty('--proj-accent2-rgb', projectData.colorRgb || '56, 189, 248');
                }
                if (projectData.darkBg) {
                    projectModal.style.setProperty('--proj-bg-dark', projectData.darkBg);
                    projectModal.style.setProperty('--proj-bg-rgb', projectData.darkBgRgb);
                }
                projectModal.setAttribute('data-project', projectData.id);
                projectModal.setAttribute('data-award', projectData.isAward ? 'true' : 'false');
            } else {
                projectModal.removeAttribute('data-project');
                projectModal.removeAttribute('data-award');
                projectModal.style.removeProperty('--proj-color');
                projectModal.style.removeProperty('--proj-rgb');
                projectModal.style.removeProperty('--proj-accent2');
                projectModal.style.removeProperty('--proj-accent2-rgb');
                projectModal.style.removeProperty('--proj-bg-dark');
                projectModal.style.removeProperty('--proj-bg-rgb');
            }

            document.getElementById('modal-num').innerText = num || '00';
            document.getElementById('modal-title').innerText = title || 'TITLE';
            document.getElementById('modal-question').innerText = question || 'Question?';
            document.getElementById('modal-medium').innerText = medium || 'Medium';
            document.getElementById('modal-year').innerText = year || 'Year';

            const modalTag = document.getElementById('modal-tag');
            const modalAwardPill = document.getElementById('modal-award-pill');
            const awardProjects = new Set(['bio-decay', 'stray', 'sprouting-garden']);
            const isAwardProject = awardProjects.has(slug) || (projectData && !!projectData.isAward);

            if (modalAwardPill) {
                if (isAwardProject) {
                    modalAwardPill.classList.remove('hidden');
                } else {
                    modalAwardPill.classList.add('hidden');
                }
            }

            if (modalTag) {
                if (isAwardProject) {
                    modalTag.innerText = 'AWARD WINNER';
                    modalTag.className = 'modal-tag tag-award';
                } else if (slug === 'emek-museum') {
                    modalTag.innerText = 'RESEARCH IN PROGRESS';
                    modalTag.className = 'modal-tag tag-ongoing';
                } else if (slug === 'you-were-here') {
                    modalTag.innerText = 'LIVE PARTICIPATORY ARCHIVE';
                    modalTag.className = 'modal-tag tag-ongoing';
                } else {
                    modalTag.innerText = '';
                    modalTag.className = 'modal-tag hidden';
                }
            }

            const cardImg = masterCard ? masterCard.querySelector('.card-img') : null;
            const modalHero = document.getElementById('modal-hero');
            if (modalHero) {
                if (slug === 'you-were-here') {
                    modalHero.style.backgroundSize = 'contain';
                    modalHero.style.backgroundRepeat = 'no-repeat';
                    modalHero.style.backgroundPosition = 'center';
                    modalHero.style.backgroundColor = '#fafbfc';

                    let liveUrl = null;
                    if (window.YouWereHereTracker && typeof window.YouWereHereTracker.getLivingPalimpsestDataURL === 'function') {
                        liveUrl = window.YouWereHereTracker.getLivingPalimpsestDataURL(1200, 750);
                    }
                    if (liveUrl) {
                        modalHero.style.backgroundImage = `url("${liveUrl}")`;
                    } else if (cardImg && cardImg.style.backgroundImage) {
                        modalHero.style.backgroundImage = cardImg.style.backgroundImage;
                    } else {
                        modalHero.style.backgroundImage = `url("./assets/you-were-here-cover.png")`;
                    }

                    let badge = modalHero.querySelector('.m-living-hero-badge');
                    if (!badge) {
                        badge = document.createElement('div');
                        badge.className = 'm-living-hero-badge';
                        modalHero.appendChild(badge);
                    }
                    const tracesList = (window.YouWereHereTracker && window.YouWereHereTracker.getCachedTraces && window.YouWereHereTracker.getCachedTraces()) || [];
                    const count = tracesList.length > 0 ? tracesList.length : 47;
                    badge.innerHTML = `<span class="live-pulse-dot"></span> LIVING PALIMPSEST &bull; ${count} TRACES OVERLAYED (REAL-TIME)`;
                } else {
                    modalHero.style.backgroundSize = '';
                    modalHero.style.backgroundRepeat = '';
                    modalHero.style.backgroundPosition = '';
                    modalHero.style.backgroundColor = '';
                    const oldBadge = modalHero.querySelector('.m-living-hero-badge');
                    if (oldBadge) oldBadge.remove();

                    if (cardImg && cardImg.style.backgroundImage) {
                        modalHero.style.backgroundImage = cardImg.style.backgroundImage;
                    } else if (projectData && projectData.img) {
                        modalHero.style.backgroundImage = `url("${projectData.img}")`;
                    } else {
                        modalHero.style.backgroundImage = 'none';
                    }
                }
            }

                    // Rich Project Content Injection
                    const modalTextContainer = projectModal.querySelector('.modal-text');
                    if (modalTextContainer) {
                        if (slug === 'sprouting-garden') {
                            modalTextContainer.innerHTML = `
                                <div class="modal-project-body">
                                    <div class="m-specs-row">
                                        <div class="m-spec-item"><span class="m-lbl">STUDIO</span><span class="m-val">Rituals of Otherworldly &bull; Fall 2023–24</span></div>
                                        <div class="m-spec-item"><span class="m-lbl">AWARDS</span><span class="m-val">★ MEF Dean's Award &bull; 1st Year (Best Projects)</span></div>
                                        <div class="m-spec-item"><span class="m-lbl">INSTRUCTOR</span><span class="m-val">İrem Korkmaz</span></div>
                                        <div class="m-spec-item"><span class="m-lbl">LOCATION</span><span class="m-val">Kuzguncuk Bostanı, Üsküdar / İstanbul</span></div>
                                        <div class="m-spec-item"><span class="m-lbl">TYPOLOGY</span><span class="m-val">Public Food Architecture &bull; Waffle Timber</span></div>
                                    </div>

                                    <div class="m-action-bar">
                                        <a href="./projects/sprouting-garden/" class="m-action-btn m-btn-primary modal-open-standalone-btn">
                                            <span>OPEN DEDICATED FULL PROJECT PAGE ↗</span>
                                        </a>
                                        <a href="./projects/sprouting-garden/assets/sprouting-garden-booklet.pdf" target="_blank" class="m-action-btn m-btn-secondary modal-open-standalone-btn">
                                            <span>VIEW PROCESS BOOKLET (PDF) ↗</span>
                                        </a>
                                    </div>

                                    <div class="m-quotes-grid">
                                        <div class="m-quote-box">
                                            <span class="m-quote-mark">&ldquo;</span>
                                            <p><strong>The user is not only human.</strong> Making a space where trees, beans, and humans can live and grow together.</p>
                                        </div>
                                        <div class="m-quote-box">
                                            <span class="m-quote-mark">&ldquo;</span>
                                            <p><strong>How to settle down without chopping the trees down?</strong> The timber waffle envelope curves organically around existing canopies.</p>
                                        </div>
                                        <div class="m-quote-box">
                                            <span class="m-quote-mark">&ldquo;</span>
                                            <p><strong>Hide everything, but don't hide anything.</strong> Public services shape themselves seamlessly out of the structural ribs.</p>
                                        </div>
                                    </div>

                                    <div class="m-statement-block">
                                        <div class="m-lang-toggle">
                                            <button type="button" class="m-lang-btn active" onclick="toggleModalLang('en')">ENGLISH STATEMENT</button>
                                            <button type="button" class="m-lang-btn" onclick="toggleModalLang('tr')">TÜRKÇE AÇIKLAMA</button>
                                        </div>
                                        <div id="m-desc-en" class="m-desc-pane active">
                                            <p><strong>Sprouting Garden</strong> is situated in a public park beside the historical Kuzguncuk Bostanı in Üsküdar, Istanbul. Its primary objective is to forge a shared-use community pavilion dedicated to cultivating, preparing, and serving a specialty culinary dish crafted from native bean varieties specifically adapted to Kuzguncuk’s microclimate.</p>
                                            <p>Designed to weave gracefully into the park without severing the historical foot-traffic between adjacent streets (+18.00m to +22.50m), the pavilion is constructed entirely from wood with an open, perforated waffle structure. This porous skin provides climbing beans with an organic trellis while honoring the height and spread of mature park trees.</p>
                                        </div>
                                        <div id="m-desc-tr" class="m-desc-pane">
                                            <p><strong>Sprouting Garden</strong>, İstanbul'un Üsküdar ilçesinde, tarihi Kuzguncuk Bostanı'na komşu bir park alanında yer almaktadır. Projenin ana konusu, Kuzguncuk Bostanı'nda yetişen ve bölgenin iklimine uygun yerel fasulye çeşitlerinden yapılan özel bir ritüel yemeğinin hazırlanması, servis edilmesi ve yetiştirilmesi süreçlerini destekleyen ortak bir kamusal yapı tasarlamaktır.</p>
                                            <p>Yapı, iki sokak arasındaki yaya geçirgenliğini koparmamak ve doğal çevreyle uyum içinde olmak için ahşaptan, boşluklu bir waffle strüktür olarak kurgulanmıştır. Açık ve gözenekli yapısı fasulyelerin sarmaşıklarına dikey tırmanma alanı sağlarken, parktaki mevcut ağaçların boyutlarına saygı göstererek etraflarından kıvrılır.</p>
                                        </div>
                                    </div>

                                    <div class="m-gallery-section">
                                        <h3 class="m-sec-title">STRUCTURAL & CULINARY DIAGRAMS</h3>
                                        <div class="m-gallery-grid">
                                            <div class="m-gal-card">
                                                <img src="./projects/sprouting-garden/assets/diagram-exploded-axonometric.jpg" alt="Exploded Axonometric">
                                                <div class="m-gal-caption">EXPLODED AXONOMETRIC &bull; Waffle canopy, bridge plate, sub-structure & nested services</div>
                                            </div>
                                            <div class="m-gal-card">
                                                <img src="./projects/sprouting-garden/assets/diagram-culinary-ritual.jpg" alt="Culinary Ritual">
                                                <div class="m-gal-caption">SPROUTING PLATE PREPARATION &bull; 11-day seed to dish cyclical ritual</div>
                                            </div>
                                            <div class="m-gal-card">
                                                <img src="./projects/sprouting-garden/assets/drawing-site-plan.jpg" alt="1/200 Site Plan">
                                                <div class="m-gal-caption">1/200 SITE PLAN &bull; Kuzguncuk Bostanı & street permeability</div>
                                            </div>
                                            <div class="m-gal-card">
                                                <img src="./projects/sprouting-garden/assets/drawing-sections.jpg" alt="1/100 Sections">
                                                <div class="m-gal-caption">1/100 SECTIONS AA' & BB' &bull; Topographic relationship & tree preservation</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="m-boards-strip">
                                        <div class="m-boards-text">
                                            <h4>FULL EXHIBITION BOARDS & BOOKLET &bull; DEAN'S AWARD</h4>
                                            <p>Access the complete 1/100 level plans, structural waffle joinery, atmosphere collages, and process booklet selected for the MEF University Dean's Awards (1st Year Category).</p>
                                        </div>
                                        <a href="./projects/sprouting-garden/" class="m-btn-pill modal-open-standalone-btn">VIEW FULL PROJECT SHEET ↗</a>
                                    </div>
                                </div>
                            `;
                        } else if (slug === 'wood-weave') {
                            modalTextContainer.innerHTML = `
                                <div class="modal-project-body">
                                    <div class="m-specs-row">
                                        <div class="m-spec-item"><span class="m-lbl">STUDIO</span><span class="m-val">Spatial Design &bull; 2024</span></div>
                                        <div class="m-spec-item"><span class="m-lbl">LOCATION</span><span class="m-val">Historic Bazaar District, Bursa / Türkiye</span></div>
                                        <div class="m-spec-item"><span class="m-lbl">TYPOLOGY</span><span class="m-val">Community Upcycling Hub &bull; Covered Arcade</span></div>
                                        <div class="m-spec-item"><span class="m-lbl">PRIMARY MEDIUM</span><span class="m-val">Modular Timber Beams (2-Meter Units)</span></div>
                                    </div>

                                    <div class="m-action-bar">
                                        <a href="./projects/wood-weave/" class="m-action-btn m-btn-primary modal-open-standalone-btn">
                                            <span>OPEN DEDICATED FULL PROJECT PAGE ↗</span>
                                        </a>
                                        <a href="./projects/wood-weave/#boards" class="m-action-btn m-btn-secondary modal-open-standalone-btn">
                                            <span>VIEW FULL JURY BOARDS & POSTERS ↗</span>
                                        </a>
                                    </div>

                                    <div class="m-quotes-grid">
                                        <div class="m-quote-box">
                                            <span class="m-quote-mark">&ldquo;</span>
                                            <p><strong>When does waste become a place?</strong> Transforming discarded market produce crates and organic surplus into building blocks of community life.</p>
                                        </div>
                                        <div class="m-quote-box">
                                            <span class="m-quote-mark">&ldquo;</span>
                                            <p><strong>Modular 2-Meter Interlocking Logic:</strong> Interlocking timber beams assemble without irreversible wet joints, creating spaces for personal display.</p>
                                        </div>
                                        <div class="m-quote-box">
                                            <span class="m-quote-mark">&ldquo;</span>
                                            <p><strong>Living Collectively with Less Waste:</strong> Every Thursday morning, students gather the market's surplus and repurpose materials through hands-on making.</p>
                                        </div>
                                    </div>

                                    <div class="m-statement-block">
                                        <div class="m-lang-toggle">
                                            <button type="button" class="m-lang-btn active" onclick="toggleModalLang('en')">ENGLISH STATEMENT</button>
                                            <button type="button" class="m-lang-btn" onclick="toggleModalLang('tr')">TÜRKÇE AÇIKLAMA</button>
                                        </div>
                                        <div id="m-desc-en" class="m-desc-pane active">
                                            <p><strong>WOOD WEAVE</strong> is formed by interlocking wooden pieces, each two meters in length, creating flexible spatial intervals between them. This design provides a generative civic space where individuals can showcase and display their creations, while offering local bazaar vendors and pedestrians the opportunity to personalize their own territories within the space.</p>
                                            <p>Situated directly beside the historic market in Bursa, students and neighbors gather every Thursday morning following Wednesday's market day to collect leftover wooden fruit crates and agricultural surplus. Throughout the week, they experiment with wood joinery, botanical drying, textile sewing, and sculpting, discovering how to repurpose waste into functional community architecture.</p>
                                        </div>
                                        <div id="m-desc-tr" class="m-desc-pane">
                                            <p><strong>WOOD WEAVE</strong>, her biri iki metre uzunluğunda birbirine kenetlenen ahşap parçalardan meydana gelmekte ve aralarında zengin mekânsal boşluklar üretmektedir. Bu kurgu, kullanıcıların kendi üretimlerini sergileyebilecekleri ortak bir zemin sağlarken, Bursa Tarihi Çarşısı'nı kullanan esnafa ve mahalle sakinlerine mekân içinde kendi kişiselleştirilmiş alanlarını kurma özgürlüğü tanır.</p>
                                            <p>Bursa'daki tarihi pazar alanının hemen bitişiğinde yer alan projede öğrenciler ve mahalle sakinleri, Çarşamba günleri kurulan pazarın ardından Perşembe sabahları atık ahşap meyve kasalarını ve sebze-meyve fazlalıklarını toplar. Hafta boyunca atölyelerde bu malzemeler kurutma, dikiş, yontu ve strüktürel eklemlenme teknikleriyle yeni mekân bileşenlerine dönüştürülür.</p>
                                        </div>
                                    </div>

                                    <div class="m-gallery-section">
                                        <h3 class="m-sec-title">ARCHITECTURAL DRAWINGS & PROCESS</h3>
                                        <div class="m-gallery-grid">
                                            <div class="m-gal-card">
                                                <img src="./projects/wood-weave/assets/sheet_detail_1.jpg" alt="1/200 Axonometric Overview">
                                                <div class="m-gal-caption">1/200 AXONOMETRIC OVERVIEW &bull; Interlocking timber structure weaving through Bursa alleyway</div>
                                            </div>
                                            <div class="m-gal-card">
                                                <img src="./projects/wood-weave/assets/section-dd.jpg" alt="1/100 Section DD'">
                                                <div class="m-gal-caption">1/100 SECTION DD' &bull; Hanging stepped timber ceiling with display niches and street passage</div>
                                            </div>
                                            <div class="m-gal-card">
                                                <img src="./projects/wood-weave/assets/sheet_detail_5.jpg" alt="Upcycling Storyboard">
                                                <div class="m-gal-caption">UPCYCLING STORYBOARD &bull; Thursday market collection, workshop crafting & exhibition display</div>
                                            </div>
                                            <div class="m-gal-card">
                                                <img src="./projects/wood-weave/assets/sections-aa-bb.jpg" alt="1/500 Sections A'A & B'B">
                                                <div class="m-gal-caption">1/500 SECTIONS A'A & B'B &bull; Bursa historic vaults, urban profile & diurnal solar trajectory</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="m-boards-strip">
                                        <div class="m-boards-text">
                                            <h4>COMPLETE JURY BOARDS &amp; HIGH-RES POSTERS</h4>
                                            <p>Access full 1/100 floor plans, 1/200 elevations, demographic analysis, and 9933&times;18000px exhibition posters on the dedicated project page.</p>
                                        </div>
                                        <a href="./projects/wood-weave/" class="m-btn-pill modal-open-standalone-btn">VIEW FULL PROJECT SHEET ↗</a>
                                    </div>
                                </div>
                            `;
                        } else if (slug === 'bio-decay') {
                            modalTextContainer.innerHTML = `
                                <div class="modal-project-body">
                                    <div class="m-specs-row">
                                        <div class="m-spec-item"><span class="m-lbl">STUDIO</span><span class="m-val">INT 202 Design Studio &bull; MEF University (2025)</span></div>
                                        <div class="m-spec-item"><span class="m-lbl">AWARDS</span><span class="m-val">im2025 2nd Place &bull; MEF Dean's Award</span></div>
                                        <div class="m-spec-item"><span class="m-lbl">LOCATION</span><span class="m-val">Milli Reasürans Passage, Nişantaşı / İstanbul</span></div>
                                        <div class="m-spec-item"><span class="m-lbl">TYPOLOGY</span><span class="m-val">Living Organic Archive &bull; Bio-Lab &bull; Amphitheatre</span></div>
                                        <div class="m-spec-item"><span class="m-lbl">PRIMARY MEDIUM</span><span class="m-val">Food Waste Biopolymers &bull; Wire Grid Frame</span></div>
                                    </div>

                                    <div class="m-action-bar">
                                        <a href="./projects/bio-decay/" class="m-action-btn m-btn-primary modal-open-standalone-btn">
                                            <span>OPEN DEDICATED FULL PROJECT PAGE ↗</span>
                                        </a>
                                    </div>

                                    <div class="m-quotes-grid">
                                        <div class="m-quote-box">
                                            <span class="m-quote-mark">&ldquo;</span>
                                            <p><strong>The space is never finished — it is always in progress.</strong> The archive accepts decay as part of its life; bioplastics slowly lose transparency, darken, and harden.</p>
                                        </div>
                                        <div class="m-quote-box">
                                            <span class="m-quote-mark">&ldquo;</span>
                                            <p><strong>How many microplastics can we eat in a day?</strong> Inverting toxic synthetic accumulation into an architectural bio-refinery fueled by restaurant waste.</p>
                                        </div>
                                        <div class="m-quote-box">
                                            <span class="m-quote-mark">&ldquo;</span>
                                            <p><strong>Permanent Skeleton vs. Ephemeral Skin:</strong> Steel wire grid acts as a skeleton, while biopolymer panels rot, crack, and are continuously replaced by visitors.</p>
                                        </div>
                                    </div>

                                    <div class="m-statement-block">
                                        <div class="m-lang-toggle">
                                            <button type="button" class="m-lang-btn active" onclick="toggleModalLang('en')">ENGLISH STATEMENT</button>
                                            <button type="button" class="m-lang-btn" onclick="toggleModalLang('tr')">TÜRKÇE AÇIKLAMA</button>
                                        </div>
                                        <div id="m-desc-en" class="m-desc-pane active">
                                            <p><strong>Bio-Decay</strong> began with a provocative inquiry into everyday consumption: <em>“How many microplastics can we eat in a day?”</em> Rather than passively enduring synthetic accumulation, the project develops an active architectural archive situated in the iconic Milli Reasürans passage in Nişantaşı, Istanbul.</p>
                                            <p>The building operates as an open circular bio-refinery, harvesting organic waste (fruit peels, starch residues, coffee grounds, and vegetables) from neighboring restaurants and transforming them into functional biopolymer skins. The bioplastics undergo a dynamic lifecycle of physical decay across 6+ weeks—shifting from pliable 10–30% clarity, through matte stiffening at 50%, to brittle 70–90% amber opacity. At its core, a stepped public amphitheatre provides a civic gathering space shaded by transforming biopolymer canopies.</p>
                                        </div>
                                        <div id="m-desc-tr" class="m-desc-pane">
                                            <p><strong>Bio-Decay</strong>, gündelik tüketimin görünmeyen maddelerine dair kışkırtıcı bir soruyla başladı: <em>“Günde ne kadar mikroplastik yiyebiliriz?”</em> Proje, sentetik birikimi pasifçe izlemek yerine, İstanbul Nişantaşı'ndaki Milli Reasürans Çarşısı'nda yaşayan bir organik atık arşivi ve biyoplastik laboratuvarı önerir.</p>
                                            <p>Yapı, çevredeki restoran ve kafelerden toplanan organik atıkları (meyve kabukları, nişasta tortuları, kahve ve sebzeler) yerinde işleyen döngüsel bir kentsel biyo-rafineri gibi çalışır. Üretilen biyoplastik paneller 6 haftayı aşkın bir sürede 4 aşamalı bir bozunma döngüsünden geçer: %10–30 arası şeffaf ve esnek durumdan, matlaşan ara evreye ve %70–90 arası kehribar rengi, kırılgan son evreye ulaşır. Bozulan paneller toplanıp yeniden pişirilirken, ziyaretçiler yeni paneller asarak yapım sürecini hiç bitmeyen kolektif bir eyleme dönüştürür.</p>
                                        </div>
                                    </div>

                                    <div class="m-gallery-section">
                                        <h3 class="m-sec-title">ARCHITECTURAL DRAWINGS &amp; MATERIAL PROCESS</h3>
                                        <div class="m-gallery-grid">
                                            <div class="m-gal-card">
                                                <img src="./projects/bio-decay/assets/crop-section-perspective-3d.png" alt="3D Section Perspective">
                                                <div class="m-gal-caption">3D SECTION PERSPECTIVE &bull; Stepped amphitheatre, suspended bioplastic canopies &amp; labs</div>
                                            </div>
                                            <div class="m-gal-card">
                                                <img src="./projects/bio-decay/assets/crop-exploded-axonometric.png" alt="Exploded Axonometric">
                                                <div class="m-gal-caption">EXPLODED AXONOMETRIC &bull; Wire grid skeleton, public waste triage chute &amp; workshops</div>
                                            </div>
                                            <div class="m-gal-card">
                                                <img src="./projects/bio-decay/assets/crop-recipes-flowchart.png" alt="Bioplastic Chemistry Matrix">
                                                <div class="m-gal-caption">BIOPLASTIC RECIPES &bull; Sugar, cellulose, protein &amp; starch fabrication stations</div>
                                            </div>
                                            <div class="m-gal-card">
                                                <img src="./projects/bio-decay/assets/crop-decay-stages-physical.png" alt="Empirical Decay Timeline">
                                                <div class="m-gal-caption">EMPIRICAL DECAY TRACKING &bull; Newly prepared green &rarr; dried amber &rarr; decayed disc</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="m-boards-strip">
                                        <div class="m-boards-text">
                                            <h4>COMPLETE JURY BOARDS &amp; HIGH-RES POSTERS</h4>
                                            <p>Access all 4 master presentation sheets awarded 2nd Place in im2025 National Awards, with 1/100 plans, 1/20 details, and material recipes.</p>
                                        </div>
                                        <a href="./projects/bio-decay/" class="m-btn-pill modal-open-standalone-btn">VIEW FULL PROJECT SHEET ↗</a>
                                    </div>
                                </div>
                            `;
                        } else if (slug === 'stray') {
                            modalTextContainer.innerHTML = `
                                <div class="modal-project-body">
                                    <div class="m-specs-row">
                                        <div class="m-spec-item"><span class="m-lbl">STUDIO</span><span class="m-val">INT 201 Interior Design Studio I &bull; MEF University (2025)</span></div>
                                        <div class="m-spec-item"><span class="m-lbl">AWARDS</span><span class="m-val">★ im2025 National Awards Honorary Mention</span></div>
                                        <div class="m-spec-item"><span class="m-lbl">LOCATION</span><span class="m-val">Moda Seaside, Kadıköy / İstanbul</span></div>
                                        <div class="m-spec-item"><span class="m-lbl">TYPOLOGY</span><span class="m-val">Urban Interior &bull; Psychogeographical Sanctuary &bull; Interactive Ramp</span></div>
                                    </div>

                                    <div class="m-action-bar">
                                        <a href="./projects/stray/" class="m-action-btn m-btn-primary modal-open-standalone-btn" style="background: var(--proj-color, #10b981); border-color: var(--proj-color, #10b981);">
                                            <span>OPEN DEDICATED FULL PROJECT PAGE ↗</span>
                                        </a>
                                        <a href="./projects/stray/#boards" class="m-action-btn m-btn-secondary modal-open-standalone-btn" style="color: var(--proj-accent2, #f43f5e); border-color: rgba(var(--proj-accent2-rgb, 244, 63, 94), 0.45); background: rgba(var(--proj-accent2-rgb, 244, 63, 94), 0.1);">
                                            <span>VIEW COMPETITION JURY PANELS ↗</span>
                                        </a>
                                    </div>

                                    <div class="m-quotes-grid">
                                        <div class="m-quote-box">
                                            <span class="m-quote-mark">&ldquo;</span>
                                            <p><strong>Is doing nothing doing something?</strong> In the frantic rhythm of modern city life, the deliberate act of doing nothing becomes a radical spatial and psychological stance.</p>
                                        </div>
                                        <div class="m-quote-box">
                                            <span class="m-quote-mark">&ldquo;</span>
                                            <p><strong>The Flâneur & The Stray Cat:</strong> Wandering off the beaten path without a predetermined goal, uncovering hidden emotions, collective memory, and unplanned encounters.</p>
                                        </div>
                                        <div class="m-quote-box">
                                            <span class="m-quote-mark">&ldquo;</span>
                                            <p><strong>An Urban Sanctuary for Drifting:</strong> Rotating surfaces invite people to mark, draw, and reflect as they ascend a continuous diagonal ramp from Moda beach to The Dark Room.</p>
                                        </div>
                                    </div>

                                    <div class="m-statement-block">
                                        <div class="m-lang-toggle">
                                            <button type="button" class="m-lang-btn active" onclick="toggleModalLang('en')">ENGLISH STATEMENT</button>
                                            <button type="button" class="m-lang-btn" onclick="toggleModalLang('tr')">TÜRKÇE AÇIKLAMA</button>
                                        </div>
                                        <div id="m-desc-en" class="m-desc-pane active">
                                            <p><strong>STRAY</strong> investigates the boundaries between purposelessness and presence in contemporary urban life. Grounded in 19th-century theories of the <em>Flâneur</em>, Situationist <em>dérive</em> (psychogeography), and the <em>Slow City</em> philosophy, the project questions the utilitarian tyranny of efficiency: <em>“Is doing nothing doing something?”</em> and <em>“Is it laziness to do (nothing)?”</em></p>
                                            <p>Situated along the coastal tree canopy of Moda, Kadıköy, the building acts as an open urban interior where pedestrians naturally drift inward from the seaside promenade. A continuous multi-level ramp weaves through a series of transformative zones—from semi-outdoor frontyards framed by magenta mesh lattices, to active mark-making surfaces where visitors leave tangible traces of their thoughts, to flexible moveable-wall workshops, culminating in the contemplative sensory silence of <em>The Dark Room</em>.</p>
                                        </div>
                                        <div id="m-desc-tr" class="m-desc-pane">
                                            <p><strong>STRAY</strong>, çağdaş kent yaşamında amaçsızlık ile varoluş arasındaki sınırları araştıran bir mekânsal sorgulamadır. 19. yüzyılın <em>Flâneur</em> kavramından, Sitüasyonist <em>dérive</em> (psikocoğrafya) pratiklerinden ve <em>Sakin Şehir (Slow City)</em> felsefesinden beslenen proje, faydacı üretkenlik baskısını tersyüz eder: <em>“Hiçbir şey yapmamak bir şey yapmak mıdır?”</em> ve <em>“Aylaklık tembellik midir?”</em></p>
                                            <p>Kadıköy Moda Sahili boyunca uzanan ağaç dokusunun arkasında konumlanan yapı, yayaların sahil hattından içeriye kendiliğinden sürüklendiği (straying) bir kentsel iç mekan gibi kurgulanmıştır. Sürekli bir rampa omurgası, pembe metal ızgaralarla filtrelenen yarı açık avlulardan, ziyaretçilerin çizimler ve izler bıraktığı etkileşimli yüzeylere, hareketli duvarlarla dönüşen atölyelere ve en üstte duyusal bir içe dönüş sunan <em>Karanlık Oda'ya (The Dark Room)</em> kadar uzanan kesintisiz bir deneyim sunar.</p>
                                        </div>
                                    </div>

                                    <div class="m-gallery-section">
                                        <h3 class="m-sec-title">ARCHITECTURAL DRAWINGS, SECTIONS &amp; RENDERS</h3>
                                        <div class="m-gallery-grid">
                                            <div class="m-gal-card">
                                                <img src="./projects/stray/assets/axonometric_section_3d.jpg" alt="3D Isometric Perspective Section">
                                                <div class="m-gal-caption">3D PERSPECTIVE SECTION &bull; Triple-height void, continuous ramp journey, workshop &amp; Dark Room</div>
                                            </div>
                                            <div class="m-gal-card">
                                                <img src="./projects/stray/assets/b1_crop_exploded_axonometric.jpg" alt="Exploded Axonometric Drawing">
                                                <div class="m-gal-caption">EXPLODED AXONOMETRIC &bull; Concrete frame, magenta mesh screens, vertical circulation &amp; seaside threshold</div>
                                            </div>
                                            <div class="m-gal-card">
                                                <img src="./projects/stray/assets/perspective_ramp_interior.jpg" alt="The Ramp Interior Mark-Making Experience">
                                                <div class="m-gal-caption">THE RAMP EXPERIENCE (VIEW Q) &bull; Rotating interactive surfaces where visitors leave traces and drawings</div>
                                            </div>
                                            <div class="m-gal-card">
                                                <img src="./projects/stray/assets/render_the_dark_room.jpg" alt="The Dark Room">
                                                <div class="m-gal-caption">THE DARK ROOM (VIEW E) &bull; Sensory stillness lit only by morning sun and passing silhouettes</div>
                                            </div>
                                            <div class="m-gal-card">
                                                <img src="./projects/stray/assets/render_the_workshop_area.jpg" alt="The Workshop Area">
                                                <div class="m-gal-caption">THE WORKSHOP AREA (VIEW F) &bull; Double-height flexible studio with exposed magenta timber ceiling</div>
                                            </div>
                                            <div class="m-gal-card">
                                                <img src="./projects/stray/assets/render_the_ramp.jpg" alt="The Ramp Seaside Approach">
                                                <div class="m-gal-caption">SEASIDE APPROACH (VIEW A) &bull; Moda coastline trees filtering the entrance threshold</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="m-boards-strip">
                                        <div class="m-boards-text">
                                            <h4>COMPLETE JURY PRESENTATION BOARDS</h4>
                                            <p>Access all 3 master presentation boards awarded Honorary Mention in im2025 National Awards, with 1/100 plans, 1/50 sections, and moveable wall details.</p>
                                        </div>
                                        <a href="./projects/stray/" class="m-btn-pill modal-open-standalone-btn">VIEW FULL PROJECT SHEET ↗</a>
                                    </div>
                                </div>
                            `;
                        } else if (slug === 'emek-museum') {
                            modalTextContainer.innerHTML = `
                                <div class="modal-project-body">
                                    <div class="m-specs-row">
                                        <div class="m-spec-item"><span class="m-lbl">STUDIO / INITIATIVE</span><span class="m-val">Spatial Design &bull; Research (2027 Ongoing)</span></div>
                                        <div class="m-spec-item"><span class="m-lbl">TYPOLOGY</span><span class="m-val">Counter-Monument &bull; Living Labor Archive</span></div>
                                        <div class="m-spec-item"><span class="m-lbl">GEOGRAPHY</span><span class="m-val">Türkiye</span></div>
                                        <div class="m-spec-item"><span class="m-lbl">CENTRAL INQUIRY</span><span class="m-val">Labour Memorialization &bull; Spatial Justice</span></div>
                                    </div>

                                    <div class="m-action-bar">
                                        <a href="./projects/emek-museum/" class="m-action-btn m-btn-primary modal-open-standalone-btn">
                                            <span>OPEN DEDICATED FULL PROJECT PAGE ↗</span>
                                        </a>
                                        <div style="display: inline-flex; align-items: center; gap: 8px; padding: 10px 16px; background: rgba(37, 99, 235, 0.08); border: 1px solid rgba(37, 99, 235, 0.25); border-radius: 6px; font-family: monospace; font-size: 0.76rem; font-weight: 700; color: var(--accent-color);">
                                            <span style="width: 8px; height: 8px; border-radius: 50%; background: var(--accent-color); box-shadow: 0 0 8px rgba(37,99,235,0.8);"></span>
                                            <span>CONCEPT &amp; SPATIAL RESEARCH IN PROGRESS</span>
                                        </div>
                                    </div>

                                    <div class="m-quotes-grid">
                                        <div class="m-quote-box">
                                            <span class="m-quote-mark">&ldquo;</span>
                                            <p><strong>Work-related accidents remain a persistent reality</strong>, particularly in Türkiye. Yet when workers lose their lives, the public narrative often ends with the accident itself.</p>
                                        </div>
                                        <div class="m-quote-box">
                                            <span class="m-quote-mark">&ldquo;</span>
                                            <p><strong>Emek Museum asks:</strong> How can we make this labour visible again?</p>
                                        </div>
                                        <div class="m-quote-box">
                                            <span class="m-quote-mark">&ldquo;</span>
                                            <p><strong>Their labour, the time they gave,</strong> and the lives shaped through their work gradually disappear from view.</p>
                                        </div>
                                    </div>

                                    <div class="m-statement-block">
                                        <div class="m-lang-toggle">
                                            <button type="button" class="m-lang-btn active" onclick="toggleModalLang('en')">ENGLISH STATEMENT</button>
                                            <button type="button" class="m-lang-btn" onclick="toggleModalLang('tr')">TÜRKÇE AÇIKLAMA</button>
                                        </div>
                                        <div id="m-desc-en" class="m-desc-pane active">
                                            <p>Work-related accidents remain a persistent reality, particularly in Türkiye. Yet when workers lose their lives, the public narrative often ends with the accident itself—their labour, the time they gave, and the lives shaped through their work gradually disappear from view.</p>
                                            <p style="font-size: 1.18rem; font-weight: 700; color: var(--text-color); margin: 8px 0; border-left: 3px solid var(--accent-color); padding-left: 14px;">Emek Museum asks: how can we make this labour visible again?</p>
                                            <p style="font-family: monospace; font-size: 0.85rem; font-weight: 600; color: var(--accent-color); letter-spacing: 0.05em; margin-top: 10px;">More from this project soon.</p>
                                        </div>
                                        <div id="m-desc-tr" class="m-desc-pane">
                                            <p>İş cinayetleri ve iş kazaları, özellikle Türkiye'de süregelen yakıcı bir gerçeklik olmaya devam ediyor. Ancak emekçiler yaşamlarını yitirdiğinde, kamusal anlatı çoğunlukla kazanın kendisiyle son buluyor—onların emeği, verdikleri zaman ve emekleriyle biçimlenen yaşamlar ise zamanla görünmezleşiyor.</p>
                                            <p style="font-size: 1.18rem; font-weight: 700; color: var(--text-color); margin: 8px 0; border-left: 3px solid var(--accent-color); padding-left: 14px;">Emek Museum soruyor: bu emeği yeniden nasıl görünür kılabiliriz?</p>
                                            <p style="font-family: monospace; font-size: 0.85rem; font-weight: 600; color: var(--accent-color); letter-spacing: 0.05em; margin-top: 10px;">Çok yakında bu projeden daha fazlası.</p>
                                        </div>
                                    </div>

                                    <div class="m-gallery-section">
                                        <h3 class="m-sec-title">RESEARCH CANVAS &amp; DRAFTING BLUEPRINT</h3>
                                        <div class="m-gallery-grid" style="grid-template-columns: 1fr;">
                                            <div class="m-gal-card">
                                                <img src="./assets/emek-museum-wip.svg" alt="Emek Museum Drafting Blueprint" style="max-height: 380px; object-fit: contain; background: #f8fafc;">
                                                <div class="m-gal-caption">RESEARCH &amp; DRAFTING SHEET &bull; Ongoing concept, spatial mapping &amp; memorial archive (2027)</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="m-boards-strip">
                                        <div class="m-boards-text">
                                            <h4>DEDICATED RESEARCH &amp; MANIFESTO SHEET</h4>
                                            <p>Access the full curatorial statement, theoretical framework, and inquiry on the dedicated project page.</p>
                                        </div>
                                        <a href="./projects/emek-museum/" class="m-btn-pill modal-open-standalone-btn">VIEW FULL PROJECT SHEET ↗</a>
                                    </div>
                                </div>
                            `;
                        } else if (slug === 'the-earthen') {
                            modalTextContainer.innerHTML = `
                                <div class="modal-project-body">
                                    <div class="m-specs-row">
                                        <div class="m-spec-item"><span class="m-lbl">STUDIO / INITIATIVE</span><span class="m-val">Spatial Design Studio (2026)</span></div>
                                        <div class="m-spec-item"><span class="m-lbl">TYPOLOGY</span><span class="m-val">Cyclical Earth Architecture &bull; Bio-Creation Lab &bull; Mud Baths</span></div>
                                        <div class="m-spec-item"><span class="m-lbl">MEDIUM</span><span class="m-val">Soil &amp; Clay &bull; Fiberglass &bull; Structural Tubes</span></div>
                                        <div class="m-spec-item"><span class="m-lbl">CENTRAL INQUIRY</span><span class="m-val">“to decay is to begin again — Is there death because there is life?”</span></div>
                                    </div>

                                    <div class="m-action-bar">
                                        <a href="./projects/the-earthen/" class="m-action-btn m-btn-primary modal-open-standalone-btn">
                                            <span>OPEN DEDICATED FULL PROJECT PAGE ↗</span>
                                        </a>
                                    </div>

                                    <div class="m-quotes-grid">
                                        <div class="m-quote-box">
                                            <span class="m-quote-mark">&ldquo;</span>
                                            <p><strong>Life and death are inseparable aspects of existence.</strong> Death is not an ultimate end, but a transformation that allows new life to emerge.</p>
                                        </div>
                                        <div class="m-quote-box">
                                            <span class="m-quote-mark">&ldquo;</span>
                                            <p><strong>The Earthen asks:</strong> Is there death because there is life? To decay is to begin again.</p>
                                        </div>
                                        <div class="m-quote-box">
                                            <span class="m-quote-mark">&ldquo;</span>
                                            <p><strong>We promote fatigue, failures, and losses</strong> as an opening to appreciate growth, tactile presence, and natural renewal.</p>
                                        </div>
                                    </div>

                                    <div class="m-statement-block">
                                        <div class="m-lang-toggle">
                                            <button type="button" class="m-lang-btn active" onclick="toggleModalLang('en')">ENGLISH STATEMENT</button>
                                            <button type="button" class="m-lang-btn" onclick="toggleModalLang('tr')">TÜRKÇE AÇIKLAMA</button>
                                        </div>
                                        <div id="m-desc-en" class="m-desc-pane active">
                                            <p><strong>The Earthen</strong> approaches architecture as a closed-loop living metabolism that embraces decay as the fertile origin of new life. Structured upon a vertical cycle of matter—from subterranean liquid mud-bathing and soaking pools, up to radial shaping workshops in the Material Creator Lab, and crowning in a +6.00m terrace garden where decomposed matter regenerates living soil.</p>
                                            <p>Functional curved metal tubes weave through the entire volume, serving simultaneously as primary structural columns, interior furniture (benches, tables, dividers), and vertical pipelines transporting harvested seeds, clay slurry, and water between levels. Translucent fiberglass envelopes diffuse harsh urban light into a warm, contemplative glow.</p>
                                        </div>
                                        <div id="m-desc-tr" class="m-desc-pane">
                                            <p><strong>The Earthen</strong>, mimariyi çözünmeyi yeni yaşamın doğurgan başlangıcı olarak kucaklayan kapalı devre bir metabolizma olarak ele alır. Maddenin dikey dönüşüm döngüsü üzerine kurgulanmıştır: en alttaki sıvı çamur banyolarından başlayıp, zemin kattaki radyal yoğurma ve şekillendirme atölyelerine, oradan da ayrışan organik maddenin toprağı beslediği +6.00m çatı teras bahçesine uzanır.</p>
                                            <p>Çok işlevli metal boru ağı; taşıyıcı strüktür, mobilya ve tohum/çamur/su taşıyan düşey tesisat kanalları olarak tüm yapıyı canlı bir dolaşım sistemiyle birbirine bağlar. Dıştaki yarı saydam fiberglas kabuk, sert kentsel ışığı süzerek iç mekânda meditatif ve sıcak bir atmosfer yaratır.</p>
                                        </div>
                                    </div>

                                    <div class="m-gallery-section">
                                        <h3 class="m-sec-title">ARCHITECTURAL DRAWINGS &amp; SPATIAL PROCESS</h3>
                                        <div class="m-gallery-grid">
                                            <div class="m-gal-card">
                                                <img src="./projects/the-earthen/assets/render-atrium.jpg" alt="Central Atrium">
                                                <div class="m-gal-caption">CENTRAL MONUMENTAL ATRIUM &bull; Translucent fiberglass skin, double-height core &amp; rammed earth seating</div>
                                            </div>
                                            <div class="m-gal-card">
                                                <img src="./projects/the-earthen/assets/render-earth-workshop.jpg" alt="Earth Workshop">
                                                <div class="m-gal-caption">KNEADING &amp; SHAPING LAB &bull; Circular clay bins, potter wheels and tactile forming tables</div>
                                            </div>
                                            <div class="m-gal-card">
                                                <img src="./projects/the-earthen/assets/render-portal-bath.jpg" alt="Mud Bath Portal">
                                                <div class="m-gal-caption">RAMMED EARTH PORTAL &bull; Mineral mud immersion pool draped in living ivy &amp; pipe columns</div>
                                            </div>
                                            <div class="m-gal-card">
                                                <img src="./projects/the-earthen/assets/diagram-exploded-axonometric.jpg" alt="Exploded Axonometric">
                                                <div class="m-gal-caption">EXPLODED AXONOMETRIC &bull; Roof slab, fiberglass skin, tube ring, soil walls &amp; base</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="m-boards-strip">
                                        <div class="m-boards-text">
                                            <h4>COMPLETE ARCHITECTURAL JURY BOARDS (5 MASTER SHEETS)</h4>
                                            <p>Explore all 5 comprehensive presentation sheets with 1/50 plans, building sections, 1/20 partial sections, and 1/5 joinery details.</p>
                                        </div>
                                        <a href="./projects/the-earthen/" class="m-btn-pill modal-open-standalone-btn">VIEW FULL PROJECT SHEET ↗</a>
                                    </div>
                                </div>
                            `;
                        } else if (slug === 'bajo-la-fresca') {
                            modalTextContainer.innerHTML = `
                                <div class="modal-project-body">
                                    <div class="m-specs-row">
                                        <div class="m-spec-item"><span class="m-lbl">INITIATIVE</span><span class="m-val">AA Visiting School Córdoba &bull; MuDD Architects</span></div>
                                        <div class="m-spec-item"><span class="m-lbl">LOCATION</span><span class="m-val">Patio San Basilio 44 &bull; Córdoba, Spain</span></div>
                                        <div class="m-spec-item"><span class="m-lbl">COLLABORATORS</span><span class="m-val">Sara Serés Béjar &bull; Özgün Ege Bilgiç &bull; Elifsu Genç</span></div>
                                        <div class="m-spec-item"><span class="m-lbl">TYPOLOGY</span><span class="m-val">Ephemeral Spatial Installation &bull; Microclimate Canopy</span></div>
                                        <div class="m-spec-item"><span class="m-lbl">MEDIUM</span><span class="m-val">Pleated Textile &bull; Gradient-Dyed Cotton &bull; Citrus Oils</span></div>
                                        <div class="m-spec-item"><span class="m-lbl">CENTRAL INQUIRY</span><span class="m-val">“How do you highlight beauty without stealing its spotlight?”</span></div>
                                    </div>

                                    <div class="m-action-bar">
                                        <a href="./projects/bajo-la-fresca/" class="m-action-btn m-btn-primary modal-open-standalone-btn">
                                            <span>OPEN DEDICATED FULL PROJECT PAGE ↗</span>
                                        </a>
                                    </div>

                                    <div class="m-quotes-grid">
                                        <div class="m-quote-box">
                                            <span class="m-quote-mark">&ldquo;</span>
                                            <p><strong>Bajo la Fresca (/ˈbaxo la ˈfɾeska/):</strong> Rooted in the Spanish tradition of sitting outside in the evening cool to relax, converse, and celebrate neighborhood life.</p>
                                        </div>
                                        <div class="m-quote-box">
                                            <span class="m-quote-mark">&ldquo;</span>
                                            <p><strong>Overcoming Spatial Limits:</strong> Expanding the patio’s cooling vegetation into the aerial volume above without occupying scarce courtyard ground.</p>
                                        </div>
                                        <div class="m-quote-box">
                                            <span class="m-quote-mark">&ldquo;</span>
                                            <p><strong>Olfactory Architecture:</strong> Dyed cotton petals infused with real orange and lemon peels, releasing citrus aromas and natural mosquito defense.</p>
                                        </div>
                                    </div>

                                    <div class="m-statement-block">
                                        <div class="m-lang-toggle">
                                            <button type="button" class="m-lang-btn active" onclick="toggleModalLang('en')">ENGLISH STATEMENT</button>
                                            <button type="button" class="m-lang-btn" onclick="toggleModalLang('tr')">TÜRKÇE AÇIKLAMA</button>
                                        </div>
                                        <div id="m-desc-en" class="m-desc-pane active">
                                            <p><strong>Bajo la Fresca</strong> is a contextual research and ephemeral spatial installation realized in Patio San Basilio 44 during the celebrated Fiesta de los Patios in Córdoba, Spain. Exploring the socio-climatic ritual of <em>tomar el fresco</em> (gathering outside in the evening cool), the project reinterprets the UNESCO-recognized courtyard as an atmospheric sanctuary of coexistence.</p>
                                            <p>To overcome the strict ground and wall limitations of the historic courtyard, the installation suspends an undulating, lightweight pleated canopy that carries gradient-dyed cotton petals infused with fresh Andalusian orange and lemon peels alongside natural citronella essence. As convective evening breezes circulate, the suspended pouches sway gently, diffusing pleasant citrus notes and creating a sensory microclimatic refuge for neighbors and visitors below.</p>
                                        </div>
                                        <div id="m-desc-tr" class="m-desc-pane">
                                            <p><strong>Bajo la Fresca</strong>, Córdoba’nın dünyaca ünlü tarihi avlu şenlikleri (Fiesta de los Patios) sırasında Patio San Basilio 44 avlusunda hayata geçirilen bağlamsal bir araştırma ve mekânsal yerleştirmedir. Proje, akşam serinliğinde kapı önüne veya avluya çıkıp komşularla sohbet etme geleneği olan <em>tomar el fresco</em> ritüelini merkeze alır.</p>
                                            <p>Tarihi avludaki dar zemin ve duvar kısıtlarını aşmak amacıyla avlunun gökyüzü boşluğuna dalgalı kumaş kıvrımlarından oluşan asılı bir gölgelik yerleştirilmiştir. Begonvil ve narenciye tonlarında degrade boyanmış pamuk liflerine emdirilen taze portakal-limon kabukları ve doğal sivrisinek kovucu esanslar, akşam esintileriyle avluya yayılarak altındaki ziyaretçilere ferahlatıcı bir mikroklimatik sığınak sunar.</p>
                                        </div>
                                    </div>

                                    <div class="m-gallery-section">
                                        <h3 class="m-sec-title">INSTALLATION VIEWS &amp; MATERIAL PROCESS</h3>
                                        <div class="m-gallery-grid">
                                            <div class="m-gal-card">
                                                <img src="./projects/bajo-la-fresca/assets/bajo-la-fresca-courtyard-wide.jpg" alt="Patio San Basilio 44 Wide View">
                                                <div class="m-gal-caption">PATIO SAN BASILIO 44 &bull; Canopy suspended between whitewashed walls, clay tiles &amp; bougainvillea</div>
                                            </div>
                                            <div class="m-gal-card">
                                                <img src="./projects/bajo-la-fresca/assets/bajo-la-fresca-canopy-vertical.jpg" alt="Skyward Canopy Perspective">
                                                <div class="m-gal-caption">SKYWARD PERSPECTIVE &bull; Gradient pleated waves and hanging pouches under the Andalusian sky</div>
                                            </div>
                                            <div class="m-gal-card">
                                                <img src="./projects/bajo-la-fresca/assets/installation-hanging-scent-canopy.jpg" alt="Hanging Scent Canopies">
                                                <div class="m-gal-caption">SCENT POUCHES &bull; Suspended sachets carrying citrus-infused cotton swaying in convection currents</div>
                                            </div>
                                            <div class="m-gal-card">
                                                <img src="./projects/bajo-la-fresca/assets/process-workshop-canopy-table.jpg" alt="Studio Assembly">
                                                <div class="m-gal-caption">PARAMETRIC PLEATS &bull; Assembling the stamped wave canopy strips on the studio workbench</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="m-boards-strip">
                                        <div class="m-boards-text">
                                            <h4>COMPLETE RESEARCH &amp; PROCESS ARCHIVE (12 SLIDES)</h4>
                                            <p>Explore the full presentation archive detailing historical patio competition timelines, climate vs. microclimate diagrams, and scent extraction.</p>
                                        </div>
                                        <a href="./projects/bajo-la-fresca/" class="m-btn-pill modal-open-standalone-btn">VIEW FULL PROJECT SHEET ↗</a>
                                    </div>
                                </div>
                            `;
                        } else if (slug === 'millieu') {
                            modalTextContainer.innerHTML = `
                                <div class="modal-project-body">
                                    <div class="m-specs-row">
                                        <div class="m-spec-item"><span class="m-lbl">LOCATION</span><span class="m-val">Yeldeğirmeni, Kadıköy / İstanbul</span></div>
                                        <div class="m-spec-item"><span class="m-lbl">TYPOLOGY</span><span class="m-val">Culinary Interior &bull; Social Amphitheatre &bull; Spatial Branding</span></div>
                                        <div class="m-spec-item"><span class="m-lbl">MEDIUM</span><span class="m-val">Burgundy Steel &bull; Marble &bull; Oak Plywood &bull; Terrazzo</span></div>
                                        <div class="m-spec-item"><span class="m-lbl">CENTRAL INQUIRY</span><span class="m-val">“How does a culinary ritual shape a social atmosphere?”</span></div>
                                    </div>

                                    <div class="m-action-bar">
                                        <a href="./projects/millieu/" class="m-action-btn m-btn-primary modal-open-standalone-btn">
                                            <span>OPEN DEDICATED FULL PROJECT PAGE ↗</span>
                                        </a>
                                    </div>

                                    <div class="m-quotes-grid">
                                        <div class="m-quote-box">
                                            <span class="m-quote-mark">&ldquo;</span>
                                            <p><strong>Milieu (/mɪl'ju:/):</strong> A person's social environment or atmosphere. Rooted in Yeldeğirmeni's historical windmill and grain milling heritage.</p>
                                        </div>
                                        <div class="m-quote-box">
                                            <span class="m-quote-mark">&ldquo;</span>
                                            <p><strong>Quiche as Circular Architecture:</strong> Translating the radial geometry of quiche and windmill blades into custom furniture, lighting, and stepped amphitheater platforms.</p>
                                        </div>
                                        <div class="m-quote-box">
                                            <span class="m-quote-mark">&ldquo;</span>
                                            <p><strong>Diagonal Threshold:</strong> Guiding kinetic street flows from the tramway corridor directly into a double-height civic dining interior.</p>
                                        </div>
                                    </div>

                                    <div class="m-statement-block">
                                        <div class="m-lang-toggle">
                                            <button type="button" class="m-lang-btn active" onclick="toggleModalLang('en')">ENGLISH STATEMENT</button>
                                            <button type="button" class="m-lang-btn" onclick="toggleModalLang('tr')">TÜRKÇE AÇIKLAMA</button>
                                        </div>
                                        <div id="m-desc-en" class="m-desc-pane active">
                                            <p><strong>Millieu</strong> (/mɪl'ju:/) explores the intersection of culinary ritual, neighborhood memory, and interior architecture in Kadıköy’s historic Yeldeğirmeni district. Defined as <em>a person’s social environment or atmosphere</em>, the project reinterprets the historical heritage of Yeldeğirmeni—where coastal winds once powered windmills transforming grain into flour—into a contemporary social hub centered around the craft of quiche.</p>
                                            <p>Quiche functions as a circular architectural diagram of communal sharing. The geometric dialogue between windmill blades, the sliced pastry wedge, and the letterform <em>M</em> generates the entire spatial language: from custom triangular table bases and arched lighting brackets to an expansive stepped amphitheater framed by burgundy tubular steel pergolas.</p>
                                        </div>
                                        <div id="m-desc-tr" class="m-desc-pane">
                                            <p><strong>Millieu</strong> (/mɪl'ju:/), Kadıköy Yeldeğirmeni’nin köklü mahalle hafızası ile gastronomi ritüelini iç mimari bir deneyimde buluşturan bir mekânsal tasarımdır. Etimolojik olarak <em>kişinin içinde bulunduğu toplumsal çevre veya atmosfer</em> anlamına gelen "milieu" kavramı; geçmişte yel değirmenleriyle buğdayın una dönüştüğü bu tarihi semtte, kiş (quiche) pişirme ve paylaşma eylemi etrafında yeni bir kentsel buluşma alanına dönüşür.</p>
                                            <p>Kiş, yuvarlak bütününden dilimlenerek paylaşılan formuyla projenin temel mekânsal şemasına ilham verir. Yel değirmeni kanatları, kiş dilimi ve "M" harfinin geometrik kesişimi; özel tasarım üçgen masa ayaklarından kemerli aydınlatmalara, bordo çelik konstrüksiyonlu amfi basamaklarından özel ambalaj ve menü tasarımına kadar tüm mekân tektoniğini şekillendirir.</p>
                                        </div>
                                    </div>

                                    <div class="m-gallery-section">
                                        <h3 class="m-sec-title">ARCHITECTURAL RENDERS &amp; SPATIAL PROCESS</h3>
                                        <div class="m-gallery-grid">
                                            <div class="m-gal-card">
                                                <img src="./projects/millieu/assets/crop-sheet5-render-view-x-hall.jpg" alt="Communal Dining Hall (View X)">
                                                <div class="m-gal-caption">COMMUNAL DINING HALL (VIEW X) &bull; Double-height dining commons under clerestory daylight &amp; burgundy arch lighting</div>
                                            </div>
                                            <div class="m-gal-card">
                                                <img src="./projects/millieu/assets/crop-sheet2-render-view-l-amphitheater.jpg" alt="Amphitheatre Glow (View L)">
                                                <div class="m-gal-caption">AMPHITHEATRE GLOW (VIEW L) &bull; Stepped seating under industrial steel roof trusses with under-step illumination</div>
                                            </div>
                                            <div class="m-gal-card">
                                                <img src="./projects/millieu/assets/crop-sheet3-render-view-w-communal-table.jpg" alt="Open Bakery (View W)">
                                                <div class="m-gal-caption">OPEN BAKERY (VIEW W) &bull; Service counter with quiche display, central table &amp; diagonal circulation</div>
                                            </div>
                                            <div class="m-gal-card">
                                                <img src="./projects/millieu/assets/crop-sheet4-axonometric-section-cutaway.jpg" alt="Isometric Cutaway">
                                                <div class="m-gal-caption">ISOMETRIC CUTAWAY &bull; Inhabitable amphitheater landscape, red steel pergolas &amp; booths</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="m-boards-strip">
                                        <div class="m-boards-text">
                                            <h4>COMPLETE ARCHITECTURAL JURY BOARDS (5 MASTER SHEETS)</h4>
                                            <p>Explore all 5 comprehensive presentation sheets with 1/50 plans, building sections, 1/20 joinery details, and spatial branding.</p>
                                        </div>
                                        <a href="./projects/millieu/" class="m-btn-pill modal-open-standalone-btn">VIEW FULL PROJECT SHEET ↗</a>
                                    </div>
                                </div>
                            `;
                        } else if (slug === 'you-were-here') {
                            modalTextContainer.innerHTML = `
                                <div class="modal-project-body">
                                    <div class="m-specs-row">
                                        <div class="m-spec-item"><span class="m-lbl">FIELD</span><span class="m-val">Digital Cartography &bull; Spatial Telemetry</span></div>
                                        <div class="m-spec-item"><span class="m-lbl">SCALE</span><span class="m-val">Global Coordinate Space &bull; Infinite Superposition</span></div>
                                        <div class="m-spec-item"><span class="m-lbl">DATABASE</span><span class="m-val">Cloud Firebase Firestore &bull; Atomic Preserved Traces</span></div>
                                        <div class="m-spec-item"><span class="m-lbl">ARTIFACT ENGINE</span><span class="m-val">HTML5 Canvas PNG Vector-Raster Renderings (1:1)</span></div>
                                        <div class="m-spec-item"><span class="m-lbl">AUTHOR / YEAR</span><span class="m-val">Elifsu Genç &bull; 2026</span></div>
                                    </div>

                                    <div class="m-action-bar">
                                        <a href="./projects/you-were-here/" class="m-action-btn m-btn-primary modal-open-standalone-btn">
                                            <span>OPEN DEDICATED FULL PROJECT PAGE ↗</span>
                                        </a>
                                        <div style="display: inline-flex; align-items: center; gap: 8px; padding: 10px 16px; background: rgba(37, 99, 235, 0.08); border: 1px solid rgba(37, 99, 235, 0.25); border-radius: 6px; font-family: monospace; font-size: 0.76rem; font-weight: 700; color: var(--accent-color);">
                                            <span style="width: 8px; height: 8px; border-radius: 50%; background: #22c55e; box-shadow: 0 0 8px #22c55e; animation: wwhPulseDot 1.8s infinite ease-in-out;"></span>
                                            <span>LIVE PARTICIPATORY TELEMETRY ACTIVE</span>
                                        </div>
                                    </div>

                                    <div class="m-quotes-grid">
                                        <div class="m-quote-box">
                                            <span class="m-quote-mark">&ldquo;</span>
                                            <p><strong>What remains of the movements we forget?</strong> Digital presence as an ephemeral, irreversible spatial memory.</p>
                                        </div>
                                        <div class="m-quote-box">
                                            <span class="m-quote-mark">&ldquo;</span>
                                            <p><strong>Involuntary Kinetic Choreography:</strong> Micro-hesitations of a cursor over text, sweeping arches between links, and pauses where contemplation precedes action.</p>
                                        </div>
                                        <div class="m-quote-box">
                                            <span class="m-quote-mark">&ldquo;</span>
                                            <p><strong>A Participatory Palimpsest:</strong> Every visit is assigned an atomic sequential registry number (TRACE_0001...) and permanently etched into a collective topological cloud.</p>
                                        </div>
                                    </div>

                                    <div class="m-statement-block">
                                        <div class="m-lang-toggle">
                                            <button type="button" class="m-lang-btn active" onclick="toggleModalLang('en')">ENGLISH STATEMENT</button>
                                            <button type="button" class="m-lang-btn" onclick="toggleModalLang('tr')">TÜRKÇE AÇIKLAMA</button>
                                        </div>
                                        <div id="m-desc-en" class="m-desc-pane active">
                                            <p><strong>YOU WERE HERE.</strong> transforms the entire portfolio website into an active topological sensorium. When a visitor grants consent, their involuntary cursor gestures are recorded across the viewport as normalized coordinate vectors. Kinetic velocities are inverted into line stroke weights, while cognitive hesitations bloom into translucent cerulean halos.</p>
                                            <p style="font-size: 1.18rem; font-weight: 700; color: var(--text-color); margin: 8px 0; border-left: 3px solid var(--accent-color); padding-left: 14px;">Can an anonymous trace possess the weight of physical presence? Can a cursor line become an architectural memory?</p>
                                            <p>Rather than surveillance, this is an open participatory monument: a persistent Cloud Firebase Firestore archive preserving both past and live traces, generating lightweight 1:1 PNG vector-raster artifacts, and superimposing all journeys into a living collective palimpsest.</p>
                                        </div>
                                        <div id="m-desc-tr" class="m-desc-pane">
                                            <p><strong>YOU WERE HERE.</strong>, tüm portfolyo web sitesini duyarlı bir mekânsal yüzeye dönüştürür. Ziyaretçi rıza verdiğinde, ekran üzerindeki tüm istemsiz imleç hareketleri normalize edilmiş koordinat vektörleri olarak kaydedilir. Hareket hızları ters orantılı çizgi kalınlıklarına dönüşürken, okuma ve düşünme duraklamaları yarı saydam mavi hâleler olarak çiçek açar.</p>
                                            <p style="font-size: 1.18rem; font-weight: 700; color: var(--text-color); margin: 8px 0; border-left: 3px solid var(--accent-color); padding-left: 14px;">Anonim bir imleç çizgisi fiziksel bir izin ağırlığına sahip olabilir mi? Dijital bir hat mekânsal bir belleğe dönüşebilir mi?</p>
                                            <p>Bu sistem bir gözetleme mekanizması değil; katılımcı bir açık anıttır: geçmiş ve canlı tüm izleri Cloud Firebase Firestore üzerinde koruyan, hafif 1:1 PNG artefaktları üreten ve tüm ziyaretleri canlı bir kolektif dijital tortuda buluşturan bir bellek deneyi.</p>
                                        </div>
                                    </div>

                                    <div class="m-gallery-section">
                                        <h3 class="m-sec-title">COLLECTIVE MEMORY OVERLAY &amp; TELEMETRY ARTIFACT</h3>
                                        <div class="m-gallery-grid" style="grid-template-columns: 1fr;">
                                            <div class="m-gal-card">
                                                <img id="modal-palimpsest-img" src="./assets/you-were-here-cover.png" alt="YOU WERE HERE — Collective Palimpsest Cartography" style="max-height: 480px; width: 100%; object-fit: contain; background: #fafbfc; border-radius: 4px;">
                                                <div class="m-gal-caption">COLLECTIVE PALIMPSEST &bull; Superimposed trajectories, velocity line weights and dwell halos of historical visitors</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="m-boards-strip">
                                        <div class="m-boards-text">
                                            <h4>DEDICATED INTERACTIVE ARCHIVE &amp; TRACE DIRECTORY</h4>
                                            <p>Experience the live collective memory canvas, browse and filter individual registered traces (TRACE_0001...), and download 1:1 trace artifacts as high-resolution PNGs.</p>
                                        </div>
                                        <a href="./projects/you-were-here/" class="m-btn-pill modal-open-standalone-btn">VIEW FULL PROJECT SHEET &amp; ARCHIVE ↗</a>
                                    </div>
                                </div>
                            `;
                            // Trigger immediate living palimpsest update for the open modal
                            setTimeout(() => {
                                if (window.YouWereHereTracker && typeof window.YouWereHereTracker.updateLivingPalimpsests === 'function') {
                                    window.YouWereHereTracker.updateLivingPalimpsests();
                                }
                            }, 40);
                        } else {
                            modalTextContainer.innerHTML = `
                                <p>Here you can dive deep into the details of the project. This is a full in-page preview that maintains the portfolio's architectural directory interface without navigating to a blank page.</p>
                                <p>Further images, texts, and diagrams will be dynamically loaded here.</p>
                            `;
                        }
                    }
                    
                    // Close Merope story modal if open to prevent any dual modal stacking
                    const mModal = document.getElementById('merope-story-modal');
                    if (mModal && !mModal.classList.contains('hidden')) {
                        mModal.classList.add('hidden');
                        mModal.setAttribute('aria-hidden', 'true');
                    }

                    // Show modal
                    projectModal.classList.remove('hidden');
                    
                    // Reset scroll to top
                    const scrollArea = projectModal.querySelector('.modal-scroll-area');
                    if (scrollArea) scrollArea.scrollTop = 0;
                    
                    // Lock background scrolling
        }
        window.openProjectModalBySlug = openProjectModalBySlug;

        // Intercept any link going to a project
        document.body.addEventListener('click', (e) => {
            // Allow direct navigation if clicking standalone page link inside modal
            if (e.target.closest('.modal-open-standalone-btn')) {
                return;
            }

            const link = e.target.closest('a[href*="./projects/"]');
            if (link) {
                // If this link is inside the constellation stage while in cluster state,
                // only allow it if the user directly clicked a valid cluster star visual
                const stage = link.closest('#hq-constellation-sky, .pleiades-observatory-stage');
                if (stage && stage.getAttribute('data-state') === 'cluster') {
                    if (!e.target.closest('.cluster-star-visual')) {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        return;
                    }
                }

                e.preventDefault();
                const href = link.getAttribute('href');
                const slug = href.split('/').filter(Boolean).pop();
                openProjectModalBySlug(slug);
            }
        });

        // Ensure clicking standalone page links updates history for seamless browser back button return
        projectModal.addEventListener('click', (e) => {
            const standaloneBtn = e.target.closest('.modal-open-standalone-btn');
            if (standaloneBtn && window.lastOpenedProjectSlug) {
                history.replaceState(null, '', '#project-' + window.lastOpenedProjectSlug);
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !projectModal.classList.contains('hidden')) {
                modalClose.click();
            }
        });

        // Check if page opened with a project hash
        function checkHashAndOpenModal() {
            const curHash = window.location.hash.replace('#', '').trim();
            if (curHash.startsWith('project-') || curHash.startsWith('modal-') || curHash.startsWith('card-')) {
                const initSlug = curHash.replace(/^(project-|modal-|card-)/, '');
                openProjectModalBySlug(initSlug);
            }
        }

        setTimeout(checkHashAndOpenModal, 80);
        window.addEventListener('hashchange', checkHashAndOpenModal);
    }
});

// Global language toggle for project modal
window.toggleModalLang = function(lang) {
    const btns = document.querySelectorAll('.m-lang-btn');
    const panes = document.querySelectorAll('.m-desc-pane');
    btns.forEach(b => b.classList.remove('active'));
    panes.forEach(p => p.classList.remove('active'));
    if (lang === 'tr') {
        if (btns[1]) btns[1].classList.add('active');
        const trPane = document.getElementById('m-desc-tr');
        if (trPane) trPane.classList.add('active');
    } else {
        if (btns[0]) btns[0].classList.add('active');
        const enPane = document.getElementById('m-desc-en');
        if (enPane) enPane.classList.add('active');
    }
};

