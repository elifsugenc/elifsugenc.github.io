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
                if (target.closest('.cluster-star-visual, .merope-cluster-view, .node-label, .node-header, .node-title, .node-keywords, .node-orbit-rig, .center-ring, .relation-theme-badge')) {
                    return false;
                }
                return !!target.closest('.constellation-map .node-visual, .constellation-map .node-hover-card, .constellation-map .c-axis-link, .constellation-map .c-corner-node, .cluster-brand-node, #cluster-brand-node, .constellation-design-approach-node, #constellation-design-approach-node, #merope-star-node, .merope-star, .cluster-transition-btn, #hq-cluster-toggle-pill');
            }
        }

        // Check if a target element is clickable/interactive across the entire portfolio
        function isClickable(target) {
            if (!target || target === document.body || target === document.documentElement) return false;
            if (isSpatialInteractive(target)) return true;

            // When hovering over tags, keep cursor as plain blue dot (do not turn into question mark)
            if (target.closest('.archive-tag-btn, .archive-project-btn, .a-tag, .a-project-pill, .archive-pill, .archive-tag-list, .archive-filter-track-wrap, .archive-filter-row, .archive-filter-bar, .archive-entry-tags, .tag, .detail-tag, .filter-chip, [data-cursor="dot"]')) {
                return false;
            }

            const clickableAncestor = target.closest(
                'a, button, input, select, textarea, label, summary, details, [role="button"], [role="link"], [tabindex]:not([tabindex="-1"]), ' +
                '.project-card, .radial-dot, .hq-card, .hq-star-node, .wwh-btn-learn, .wwh-btn, .wwh-reopen-circle, ' +
                '.tag, .tab-button, .dir-btn, .hq-view-btn, .m-tri-node-group, .m-tri-tag-group, .m-tri-center-group, .m-tri-edge-group, ' +
                '.m-lens-btn, .hq-explore-all-btn, .cluster-transition-btn, .hq-cluster-toggle-pill, .merope-close-btn, .merope-foot-cta, ' +
                '.cluster-state-btn, .merope-modal-backdrop, .c-axis-link, .c-corner-node, .relation-theme-badge, [data-cursor="question"], ' +
                '.portfolio-filter-item, .methodology-card, .wwh-modal-close, .modal-close, .cluster-brand-node, .merope-star, ' +
                '.c-approach-core, .center-core, #constellation-center-btn, .constellation-center, .cs-core, .node-visual, .card-external-arrow, ' +
                '.filter-chip, .contact-link, .back-btn, .jump-btn, .prev-proj, .next-proj, .close-detail, .detail-tag, ' +
                '.m-lang-btn, .c-axis-hit, .card-action-btn, [onclick], [data-tab], [data-id], [data-pole], [data-target]'
            );
            if (clickableAncestor) return true;

            return false;
        }

        // Helper to check if element is an image or image container
        function isImage(target) {
            if (!target || target === document.body || target === document.documentElement) return false;
            return !!target.closest(
                'img:not(.brand-logo-gif):not([src*="favicon"]), ' +
                '.modal-img-wrap, .zoomable-image-container, ' +
                '.image-lightbox, .lightbox-overlay, .lightbox-modal, #universal-lightbox, ' +
                '.lightbox-content-box, .lightbox-img-wrapper, #lightbox-img, .lightbox-img'
            );
        }

        // Add hover effect for clickable elements and images
        document.addEventListener('mouseover', (e) => {
            if (!e.target) return;

            if (isImage(e.target)) {
                customCursor.classList.remove('cursor-hover', 'cursor-question', 'cursor-project');
                customCursor.classList.add('cursor-img-hover');
                cursorWrapper.classList.remove('cursor-spatial');
                return;
            } else {
                customCursor.classList.remove('cursor-img-hover');
            }

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
            if (!rel || !isImage(rel)) {
                customCursor.classList.remove('cursor-img-hover');
            }
            if (!rel || (!isSpatialInteractive(rel) && !isClickable(rel))) {
                customCursor.classList.remove('cursor-hover', 'cursor-question', 'cursor-project');
                cursorWrapper.classList.remove('cursor-spatial');
            }
        });

        document.addEventListener('mouseleave', () => {
            cursorWrapper.style.opacity = '0';
        });

        document.addEventListener('mouseenter', () => {
            cursorWrapper.style.opacity = '1';
        });

        // Prevent native HTML5 drag ghosting and OS copy plus (+) cursor
        window.addEventListener('dragstart', (e) => {
            e.preventDefault();
            return false;
        }, { passive: false });
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
                clusterX: 280,
                clusterY: 435,
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
                clusterX: 520,
                clusterY: 345,
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
                clusterX: 710,
                clusterY: 455,
                triangleX: 560,
                triangleY: 160,
                description: 'Responsive urban feline sanctuary questioning non-human agency and temporal pauses.'
            },
            {
                starId: 'asterope',
                starName: 'Asterope',
                bayer: '21 Tauri',
                mag: '5.76 mag',
                targetId: 'fire-escape-simulation',
                projNum: '12',
                title: 'FIRE ESCAPE SIMULATION',
                type: 'project',
                clusterX: 525,
                clusterY: 215,
                triangleX: 230,
                triangleY: 600,
                description: 'Spatial panic, egress dynamics & agent-based evacuation simulation.'
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
                clusterX: 645,
                clusterY: 260,
                triangleX: 605,
                triangleY: 435,
                description: 'Tactile soil & mud sanctuary linking earth’s regenerative cycles to human physical and spiritual wellbeing.'
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
                clusterX: 720,
                clusterY: 345,
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
                role: '&Uuml;lker &amp; Methodology Core',
                type: 'story',
                clusterX: 470,
                clusterY: 515,
                triangleX: 500,
                triangleY: 460,
                subtle: true,
                description: 'While only six or seven stars of the Pleiades are typically visible to the naked eye, the cluster actually contains over a thousand stars.'
            }
        ],
        vertexAssociations: {
            'critical-inquiry': {
                name: 'CRITICAL INQUIRY',
                badge: 'APEX // VERTEX 01',
                projects: ['emek-museum', 'stray', 'sprouting-garden']
            },
            'contextual-research': {
                name: 'CONTEXTUAL RESEARCH',
                badge: 'BASE-LEFT // VERTEX 02',
                projects: ['chronoclines', 'millieu', 'bajo-la-fresca', 'ara-sira', 'fire-escape-simulation']
            },
            'experimental-thinking': {
                name: 'EXPERIMENTAL THINKING',
                badge: 'BASE-RIGHT // VERTEX 03',
                projects: ['wood-weave', 'the-earthen', 'bio-decay']
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
            year: '2026',
            medium: 'Design',
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
            question: 'Is there life because there is death?',
            keywords: ['Earth & Wellbeing', 'Soil Cycles', 'Tactile Grounding'],
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
            year: '2026',
            medium: 'Simulation',
            url: './projects/fire-escape-simulation/',
            img: './assets/fire-escape-wip.svg',
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

    // Secondary Conceptual Relationships (Curated 1-to-1 Thematic Connections)
    const CONSTELLATION_RELATIONS = [
        {
            from: 'emek-museum',
            to: 'fire-escape-simulation',
            themeLine1: 'DISASTER IS',
            themeLine2: 'NEVER NATURAL',
            curve: 'M 380 250 Q 280 410 230 600',
            labelX: 280,
            labelY: 418,
            badgeW: 140,
            badgeH: 28
        },
        {
            from: 'stray',
            to: 'the-earthen',
            themeLine1: 'CARE · PAUSE',
            themeLine2: 'NONHUMAN AGENCY',
            curve: 'M 560 160 Q 640 290 605 435',
            labelX: 620,
            labelY: 290,
            badgeW: 136,
            badgeH: 28
        },
        {
            from: 'sprouting-garden',
            to: 'bio-decay',
            themeLine1: 'BIO-MATERIALS',
            themeLine2: 'ECOLOGICAL CYCLES',
            curve: 'M 580 270 Q 695 375 750 500',
            labelX: 695,
            labelY: 375,
            badgeW: 136,
            badgeH: 28
        },
        {
            from: 'sprouting-garden',
            to: 'bajo-la-fresca',
            themeLine1: 'CLIMATIC COMFORT',
            themeLine2: 'LIVING ECOLOGIES',
            curve: 'M 580 270 Q 470 410 410 595',
            labelX: 475,
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
        "FIRE ESCAPE SIMULATION"
    ]);

    const SELECTED_PROJECT_IDS = new Set([
        'emek-museum',
        'stray',
        'the-earthen',
        'bio-decay',
        'fire-escape-simulation'
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
        if (typeof setActive === 'function' && currentTabId === 'main') {
            setActive(isTargetConstellation ? 'projects' : 'main');
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
                if (label) label.textContent = 'EXPLORE CONSTELLATION ↗';
            }
        });

        // Update status label
        const statusLabel = document.getElementById('pleiades-status-label');
        if (statusLabel) {
            statusLabel.textContent = isTargetConstellation
                ? 'CONSTELLATION STATE • ALL PROJECTS'
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
                : parseFloat(meropeNode.getAttribute('data-cluster-x') || 470);
            const targetY = isTargetConstellation
                ? parseFloat(meropeNode.getAttribute('data-triangle-y') || 460)
                : parseFloat(meropeNode.getAttribute('data-cluster-y') || 515);

            meropeNode.style.left = (targetX / stageWidth * 100).toFixed(2) + '%';
            meropeNode.style.top = (targetY / stageHeight * 100).toFixed(2) + '%';
        }

        // Unlock after transition duration (350ms to keep button instantly responsive)
        setTimeout(() => {
            isTransitioning = false;
        }, 350);
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

    // =========================================================
    // ORIGIN TRACKING & SAFE RETURN ACROSS ALL PORTFOLIO TABS
    // =========================================================
    function getPortfolioCurrentOrigin() {
        const curTab = window.currentTabId || (typeof currentTabId !== 'undefined' ? currentTabId : 'main') || 'main';
        if (curTab === 'main') {
            const homeSky = document.getElementById('hq-constellation-sky');
            const isConstellation = homeSky && homeSky.getAttribute('data-state') === 'constellation';
            const hash = (window.location.hash || '').replace(/^#/, '').trim();
            if (isConstellation || hash === 'constellation' || hash === 'projects') {
                return 'constellation';
            }
            return 'cluster';
        }
        return curTab;
    }
    window.getPortfolioCurrentOrigin = getPortfolioCurrentOrigin;

    function savePortfolioReturnState() {
        try {
            const origin = getPortfolioCurrentOrigin();
            const scrollY = window.scrollY || window.pageYOffset || 0;
            const tab = (origin === 'constellation' || origin === 'cluster') ? 'main' : origin;
            const state = (origin === 'constellation') ? 'constellation' : 'cluster';

            sessionStorage.setItem('portfolio_return_scroll', String(scrollY));
            sessionStorage.setItem('portfolio_return_tab', tab);
            sessionStorage.setItem('portfolio_return_state', state);
            sessionStorage.setItem('portfolio_return_origin', origin);

            let returnUrl = window.location.href.split('#')[0];
            if (origin === 'constellation') {
                returnUrl += '#constellation';
            } else if (origin !== 'cluster') {
                returnUrl += '#' + origin;
            }
            sessionStorage.setItem('portfolio_return_url', returnUrl);
            sessionStorage.setItem('portfolio_return_active', 'true');
        } catch (err) {}
    }
    window.savePortfolioReturnState = savePortfolioReturnState;

    function navigateToProject(targetHref) {
        if (!targetHref) return;
        savePortfolioReturnState();

        let url = targetHref;
        if (!url.includes('/')) {
            url = './projects/' + url + '/';
        }

        window.location.href = url;
    }
    window.navigateToProject = navigateToProject;

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
                            <a href="${p.url}" class="card-action-btn card-btn-dedicated" style="flex: 1; width: 100%; text-align: center; justify-content: center;">
                                VIEW PROJECT&nbsp;&#x2197;
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
                        <div class="csp-meta">&Uuml;lker &bull; Design Methodology &rarr;</div>
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
        // Calculates Euclidean distance from each project to the 3 corner vertices
        // and illuminates the projects closest to each respective corner
        const CORNER_COORDINATES = {
            'critical-inquiry': { x: 500, y: 60 },
            'contextual-research': { x: 115, y: 695 },
            'experimental-thinking': { x: 885, y: 695 }
        };

        const projectsByClosestCorner = {
            'critical-inquiry': new Set(),
            'contextual-research': new Set(),
            'experimental-thinking': new Set()
        };

        CONSTELLATION_PROJECTS.forEach(p => {
            let closestKey = null;
            let minDist = Infinity;
            for (const [key, pt] of Object.entries(CORNER_COORDINATES)) {
                const dist = Math.hypot(p.x - pt.x, p.y - pt.y);
                if (dist < minDist) {
                    minDist = dist;
                    closestKey = key;
                }
            }
            if (closestKey && projectsByClosestCorner[closestKey]) {
                projectsByClosestCorner[closestKey].add(p.id);
            }
        });

        // Synchronize PLEIADES_CONFIG.vertexAssociations with calculated closest sets
        Object.keys(projectsByClosestCorner).forEach(key => {
            if (PLEIADES_CONFIG.vertexAssociations && PLEIADES_CONFIG.vertexAssociations[key]) {
                PLEIADES_CONFIG.vertexAssociations[key].projects = Array.from(projectsByClosestCorner[key]);
            }
        });

        axisLinks.forEach(corner => {
            const vKey = corner.getAttribute('data-vertex-key');
            const targetProjects = projectsByClosestCorner[vKey] || (PLEIADES_CONFIG.vertexAssociations[vKey] ? new Set(PLEIADES_CONFIG.vertexAssociations[vKey].projects) : new Set());
            const assoc = PLEIADES_CONFIG.vertexAssociations[vKey];

            corner.addEventListener('mouseenter', () => {
                if (container.getAttribute('data-state') !== 'constellation') return;
                if (cornersPulseTimeout) {
                    clearTimeout(cornersPulseTimeout);
                    cornersPulseTimeout = null;
                }
                container.classList.remove('corners-intro-pulsing');
                container.classList.add('is-vertex-hovered');

                allNodes.forEach(node => {
                    const id = node.getAttribute('data-id');
                    if (targetProjects.has(id)) {
                        node.classList.add('is-vertex-emphasized');
                        node.classList.remove('is-dimmed');
                    } else {
                        node.classList.add('is-dimmed');
                        node.classList.remove('is-vertex-emphasized');
                    }
                });

                const inquiryDisplay = document.getElementById('home-inquiry-display');
                if (inquiryDisplay && assoc) {
                    inquiryDisplay.innerHTML = `&ldquo;${assoc.name} &bull; ${assoc.badge}&rdquo;`;
                }
            });

            corner.addEventListener('mouseleave', () => {
                if (container.getAttribute('data-state') !== 'constellation') return;
                container.classList.remove('is-vertex-hovered');
                allNodes.forEach(node => {
                    node.classList.remove('is-vertex-emphasized', 'is-dimmed');
                });
                const inquiryDisplay = document.getElementById('home-inquiry-display');
                if (inquiryDisplay) {
                    inquiryDisplay.innerHTML = '&ldquo;HOVER A CONSTELLATION STAR OR PROJECT CARD TO TRACE ITS CORE SPATIAL QUESTION&rdquo;';
                }
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
                const activeRelations = relations;
                activeRelations.forEach(rel => {
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
                        navigateToProject(projId);
                    }
                });
            }

            // Card or node click -> navigate directly to dedicated project page
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
                e.preventDefault();
                navigateToProject(projId);
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
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        const homeSky = document.getElementById('hq-constellation-sky');
        if (homeSky) {
            const mapEl = homeSky.querySelector('.constellation-map');
            if (mapEl) toggleConstellationState(mapEl);
        }
    }

    if (homeTransitionBtn) homeTransitionBtn.addEventListener('click', handleStageToggleClick);
    if (homeTogglePill) homeTogglePill.addEventListener('click', handleStageToggleClick);

    // Global document-level click delegation to ensure transition clicks are never lost
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.cluster-transition-btn, #hq-cluster-toggle-pill');
        if (btn) {
            handleStageToggleClick(e);
        }
    });
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
        const curHash = window.location.hash.replace(/^#/, '').trim();
        const portfolioProjectSlugs = ['emek-museum', 'stray', 'you-were-here', 'chronoclines', 'millieu', 'sprouting-garden', 'bajo-la-fresca', 'wood-weave', 'ara-sira', 'the-earthen', 'bio-decay', 'fire-escape-simulation'];
        const savedOrigin = sessionStorage.getItem('portfolio_return_origin');
        const savedState = sessionStorage.getItem('portfolio_return_state');
        const startInConstellation = (curHash === 'constellation' || curHash === 'projects' || curHash.startsWith('project-') || curHash.startsWith('modal-') || curHash.startsWith('card-') || portfolioProjectSlugs.includes(curHash) || savedOrigin === 'constellation' || savedState === 'constellation');
        renderConstellation(pleiadesMount, startInConstellation ? 'constellation' : 'cluster');
    }

    // --- SINGLE PAGE NAVIGATION ---
    const navBar = document.querySelector('.folder-tabs');

    function setActive(tabId) {
        tabButtons.forEach(btn => {
            const bTab = btn.getAttribute('data-tab');
            if (tabId === 'projects' || tabId === 'constellation') {
                btn.classList.toggle('active', bTab === 'projects' || bTab === 'constellation');
            } else if (tabId === 'main') {
                btn.classList.toggle('active', bTab === 'main');
            } else {
                btn.classList.toggle('active', bTab === tabId);
            }
        });
    }

    let currentTabId = 'main';
    window.currentTabId = 'main';
    let pageHistory = ['main'];
    let lastBackTimestamp = 0;

    // Helper to navigate to Projects / Constellation view on Main tab
    function goToProjects() {
        switchTab('main', false);
        const epAnchor = document.getElementById('ep-projects-anchor') || document.getElementById('ep-projects-stage');
        if (epAnchor) {
            setActive('projects');
            history.replaceState(null, '', '#projects');
            epAnchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
            return;
        }
        const homeSky = document.getElementById('hq-constellation-sky');
        if (homeSky) {
            const mapEl = homeSky.querySelector('.constellation-map');
            if (mapEl) setConstellationState(mapEl, 'constellation', true);
            homeSky.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
    window.goToProjects = goToProjects;

    // --- PAGE NAVIGATION: each section is a separate full-screen page ---
    function switchTab(targetTabId, updateHash = true, isBack = false) {
        // There is no separate #projects page: project exploration lives directly in #tab-main
        if (targetTabId === 'projects') {
            switchTab('main', false);
            const epAnchor = document.getElementById('ep-projects-anchor') || document.getElementById('ep-projects-stage');
            if (epAnchor) {
                setActive('projects');
                if (updateHash) {
                    history.replaceState(null, '', '#projects');
                }
                setTimeout(() => {
                    epAnchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 40);
                return;
            }
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

        // Maintain resilient navigation history stack
        if (isBack) {
            // Stack was already popped by goBack()
        } else if (!updateHash) {
            // Direct hash / popstate navigation
            if (targetTabId === 'main') {
                pageHistory = ['main'];
            } else if (pageHistory.includes(targetTabId)) {
                pageHistory = pageHistory.slice(0, pageHistory.lastIndexOf(targetTabId) + 1);
            } else {
                pageHistory.push(targetTabId);
            }
        } else {
            // Forward user action (click tab, link, etc.)
            if (targetTabId === 'main') {
                pageHistory = ['main'];
            } else if (targetTabId === 'about') {
                // If navigating to about, prune any trailing design-approach to avoid back button trap
                while (pageHistory.length > 1 && pageHistory[pageHistory.length - 1] === 'design-approach') {
                    pageHistory.pop();
                }
                if (pageHistory[pageHistory.length - 1] !== 'about') {
                    pageHistory.push('about');
                }
            } else {
                if (pageHistory[pageHistory.length - 1] !== targetTabId) {
                    pageHistory.push(targetTabId);
                }
            }
        }
        currentTabId = targetTabId;
        window.currentTabId = targetTabId;

        tabContents.forEach(c => c.classList.remove('active'));
        target.classList.add('active');
        if (targetTabId === 'main') {
            const homeSky = document.getElementById('hq-constellation-sky');
            const isConstellation = homeSky && homeSky.getAttribute('data-state') === 'constellation';
            setActive(isConstellation ? 'projects' : 'main');
        } else {
            setActive(targetTabId);
        }
        document.body.classList.toggle('is-about-active', targetTabId === 'about');
        if (!sessionStorage.getItem('portfolio_return_active')) {
            window.scrollTo({ top: 0, behavior: 'auto' });
        }

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
        const now = Date.now();
        if (now - lastBackTimestamp < 250) return;
        lastBackTimestamp = now;

        // Pop current page off history stack if it's currently on top
        if (pageHistory.length > 0 && pageHistory[pageHistory.length - 1] === currentTabId) {
            pageHistory.pop();
        }

        // If we are navigating back from 'about', ensure we never loop back into 'design-approach'
        if (currentTabId === 'about') {
            while (pageHistory.length > 0 && pageHistory[pageHistory.length - 1] === 'design-approach') {
                pageHistory.pop();
            }
        }

        const targetTab = (pageHistory.length > 0) ? pageHistory[pageHistory.length - 1] : 'main';
        if (!pageHistory.length) {
            pageHistory = ['main'];
        }

        switchTab(targetTab, true, true);
    }
    window.goBack = goBack;
    window.goBackFromAbout = goBack;
    window.setPreviousTab = function(tabId) {
        // Kept for backward compatibility
        if (tabId && !pageHistory.includes(tabId)) {
            pageHistory.unshift(tabId);
        }
    };

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

    const archiveBackBtn = document.getElementById('archive-back-btn');
    if (archiveBackBtn) {
        archiveBackBtn.addEventListener('click', (e) => {
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
        button.addEventListener('click', (e) => {
            const tabId = button.getAttribute('data-tab');
            if (tabId === 'main') {
                if (currentTabId === 'main') {
                    const homeSky = document.getElementById('hq-constellation-sky');
                    if (homeSky) {
                        const mapEl = homeSky.querySelector('.constellation-map');
                        if (mapEl && mapEl.getAttribute('data-state') === 'constellation') {
                            setConstellationState(mapEl, 'cluster', true);
                        }
                        homeSky.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    } else {
                        history.replaceState(null, '', window.location.pathname);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                } else {
                    switchTab('main');
                    const homeSky = document.getElementById('hq-constellation-sky');
                    if (homeSky) {
                        const mapEl = homeSky.querySelector('.constellation-map');
                        if (mapEl && mapEl.getAttribute('data-state') === 'constellation') {
                            setConstellationState(mapEl, 'cluster', false);
                        }
                    }
                }
                setActive('main');
                return;
            }
            if (tabId === 'projects' || tabId === 'constellation') {
                e.preventDefault();
                goToProjects();
                return;
            }
            switchTab(tabId);
        });
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

    // Open the page matching the URL (e.g. index.html#archive, index.html#constellation, index.html#stray) and support back/forward
    function openFromHash() {
        let hash = window.location.hash.replace('#', '').trim();
        const savedTab = sessionStorage.getItem('portfolio_return_tab');
        const savedOrigin = sessionStorage.getItem('portfolio_return_origin');
        const projectSlugs = ['emek-museum', 'stray', 'you-were-here', 'chronoclines', 'millieu', 'sprouting-garden', 'bajo-la-fresca', 'wood-weave', 'ara-sira', 'the-earthen', 'bio-decay', 'fire-escape-simulation'];
        
        // Handle direct navigation to a specific project (e.g. #stray, #project-wood-weave, #card-wood-weave)
        if (projectSlugs.includes(hash) || hash.startsWith('project-') || hash.startsWith('modal-') || hash.startsWith('card-') || (hash && document.getElementById(`card-${hash}`))) {
            const slug = hash.replace(/^(project-|modal-|card-)/, '');
            navigateToProject(slug);
            return;
        }

        // If modal was open and user navigated back to a non-project hash, close modal
        const pModal = document.getElementById('project-modal');
        if (pModal && !pModal.classList.contains('hidden')) {
            pModal.classList.add('hidden');
            document.body.style.overflow = '';
        }

        // If URL has no hash but we are returning from a project, restore saved origin/tab
        if (!hash) {
            if (savedOrigin === 'constellation') {
                hash = 'constellation';
            } else if (savedTab && savedTab !== 'main') {
                hash = savedTab;
            }
        }

        if (hash === 'constellation' || hash === 'projects') {
            switchTab('main', false);
            const epAnchor = document.getElementById('ep-projects-anchor') || document.getElementById('ep-projects-stage');
            const homeSky = document.getElementById('hq-constellation-sky');
            if (epAnchor) {
                if (!sessionStorage.getItem('portfolio_return_active')) {
                    setTimeout(() => {
                        epAnchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 60);
                }
            } else if (homeSky) {
                const mapEl = homeSky.querySelector('.constellation-map');
                if (mapEl) setConstellationState(mapEl, 'constellation', false);
                if (!sessionStorage.getItem('portfolio_return_active')) {
                    setTimeout(() => {
                        homeSky.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 60);
                }
            }
            setActive('projects');
            return;
        }

        const id = hash || 'main';
        switchTab(document.getElementById(`tab-${id}`) ? id : 'main', false);

        if (id === 'main') {
            const homeSky = document.getElementById('hq-constellation-sky');
            if (homeSky) {
                const mapEl = homeSky.querySelector('.constellation-map');
                if (!sessionStorage.getItem('portfolio_return_active')) {
                    if (mapEl && mapEl.getAttribute('data-state') === 'constellation') {
                        setConstellationState(mapEl, 'cluster', false);
                    }
                }
                const curState = homeSky.getAttribute('data-state') || 'cluster';
                setActive(curState === 'constellation' ? 'projects' : 'main');
            }
        }
    }

    function restorePortfolioReturnPosition() {
        try {
            const isActive = sessionStorage.getItem('portfolio_return_active');
            const savedScroll = sessionStorage.getItem('portfolio_return_scroll');
            const savedState = sessionStorage.getItem('portfolio_return_state');
            const savedTab = sessionStorage.getItem('portfolio_return_tab');
            const savedOrigin = sessionStorage.getItem('portfolio_return_origin');

            if (isActive || savedOrigin) {
                const targetY = savedScroll !== null ? parseInt(savedScroll, 10) : 0;
                const effectiveTab = (savedOrigin === 'constellation') ? 'main' : (savedTab || 'main');

                if (effectiveTab && document.getElementById(`tab-${effectiveTab}`)) {
                    switchTab(effectiveTab, false);
                }

                if (savedOrigin === 'constellation' || savedState === 'constellation') {
                    const homeSky = document.getElementById('hq-constellation-sky');
                    if (homeSky) {
                        const mapEl = homeSky.querySelector('.constellation-map');
                        if (mapEl) setConstellationState(mapEl, 'constellation', false);
                    }
                    setActive('projects');
                }

                if (!isNaN(targetY)) {
                    window.scrollTo({ top: targetY, behavior: 'auto' });
                    requestAnimationFrame(() => {
                        window.scrollTo({ top: targetY, behavior: 'auto' });
                    });
                }

                setTimeout(() => {
                    if (!isNaN(targetY)) {
                        window.scrollTo({ top: targetY, behavior: 'auto' });
                    }
                    sessionStorage.removeItem('portfolio_return_active');
                    sessionStorage.removeItem('portfolio_return_scroll');
                    sessionStorage.removeItem('portfolio_return_state');
                    sessionStorage.removeItem('portfolio_return_tab');
                    sessionStorage.removeItem('portfolio_return_origin');
                    sessionStorage.removeItem('portfolio_return_url');
                }, 100);
            }
        } catch (err) {}
    }

    window.addEventListener('popstate', () => {
        openFromHash();
        restorePortfolioReturnPosition();
    });
    window.addEventListener('pageshow', restorePortfolioReturnPosition);
    openFromHash();
    restorePortfolioReturnPosition();

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

// --- METHODOLOGY: ARCHITECTURAL RESEARCH APPROACH INTERACTION ---
document.addEventListener('DOMContentLoaded', () => {
    const synthesisNode = document.querySelector('.arch-diag-synthesis');
    if (synthesisNode) {
        synthesisNode.style.cursor = 'pointer';
        synthesisNode.addEventListener('click', (e) => {
            if (e.target.closest('a')) return;
            if (typeof openMeropeStoryModal === 'function') {
                openMeropeStoryModal();
            }
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
            badge: 'BARYCENTER // DYNAMIC SYNTHESIS',
            title: 'CONTINUOUS SPATIAL SYNTHESIS LOOP',
            quote: '“Architecture is an investigative feedback loop between ethical inquiry, site forensics, and unconventional spatial speculation.”',
            desc: 'Rather than executing predetermined briefs, projects dismantle assumptions, unearth dormant site memories, and prototype strange, provocative futures. All 12 constellation projects converge at this barycentric core.',
            flow: ['01. QUESTION', '02. EXCAVATE', '03. SPECULATE', '04. RETHINK'],
            footerLabel: 'BARYCENTRIC CORE // THE HIDDEN SISTER:',
            projects: [
                { title: 'THE HIDDEN SISTER (MEROPE)', url: '#design-approach' }
            ]
        },
        v1: {
            mode: 'FOCUSED LENS // VERTEX 01: CRITICAL INQUIRY',
            badge: 'APEX // VERTEX 01',
            title: 'CRITICAL INQUIRY // DECONSTRUCTING NORMS',
            quote: '“Whose labor, presence, and daily rituals does monumental architecture erase?”',
            desc: 'Transforms spatial design into an instrument of resistance. Challenges institutional dogma, centers forgotten civic labor, and investigates multispecies urban coexistence.',
            flow: ['ETHICAL AUDIT', 'INSTITUTIONAL CRITIQUE', 'SPATIAL JUSTICE'],
            footerLabel: 'MAPPED CONSTELLATION PROJECTS:',
            projects: [
                { title: '01. EMEK MUSEUM', url: './projects/emek-museum/' },
                { title: '02. STRAY', url: './projects/stray/' },
                { title: '04. SPROUTING GARDEN', url: './projects/sprouting-garden/' }
            ]
        },
        v2: {
            mode: 'FOCUSED LENS // VERTEX 02: CONTEXTUAL RESEARCH',
            badge: 'BASE-LEFT // VERTEX 02',
            title: 'CONTEXTUAL RESEARCH // MATERIAL MEMORY',
            quote: '“What does physical site, stone, and microclimate remember over time?”',
            desc: 'Treats context not as an empty plot, but as an unwritten physical archive of microclimatic comfort, stone wear, and historical urban strata.',
            flow: ['MICROCLIMATES', 'SEDIMENTARY LAYERS', 'EPHEMERAL ATMOSPHERES'],
            footerLabel: 'MAPPED CONSTELLATION PROJECTS:',
            projects: [
                { title: '03. CHRONOCLINES', url: './projects/chronoclines/' },
                { title: '05. MILLIEU', url: './projects/millieu/' },
                { title: '07. BAJO LA FRESCA', url: './projects/bajo-la-fresca/' },
                { title: '09. ARA SIRA', url: './projects/ara-sira/' },
                { title: '12. FIRE ESCAPE SIM', url: './projects/fire-escape-simulation/' }
            ]
        },
        v3: {
            mode: 'FOCUSED LENS // VERTEX 03: EXPERIMENTAL THINKING',
            badge: 'BASE-RIGHT // VERTEX 03',
            title: 'EXPERIMENTAL THINKING // STRANGE & UNCONVENTIONAL SOLUTIONS',
            quote: '“Why reproduce familiar formulas when space can propose strange, unexpected alternatives?”',
            desc: 'Rather than defaulting to standard architectural remedies, Experimental Thinking generates strange, provocative, and radically different proposals. By challenging accepted problem-solving dogmas, projects invent unorthodox spatial rituals, speculative systems, and unpredicted scenarios.',
            flow: ['REJECT FAMILIAR FIXES', 'STRANGE SPECULATION', 'UNORTHODOX PROPOSALS'],
            footerLabel: 'MAPPED CONSTELLATION PROJECTS:',
            projects: [
                { title: '10. THE EARTHEN', url: './projects/the-earthen/' },
                { title: '11. BIO-DECAY', url: './projects/bio-decay/' },
                { title: '08. WOOD WEAVE', url: './projects/wood-weave/' },
                { title: '12. FIRE ESCAPE SIM', url: './projects/fire-escape-simulation/' }
            ]
        },
        'edge-left': {
            mode: 'DIALECTICAL TENSION // LEFT AXIS',
            badge: 'AXIS 01 // INQUIRY &times; CONTEXT',
            title: 'SPATIAL JUSTICE &times; POLITICAL ECOLOGY OF SURVIVAL',
            quote: '“Disaster is never natural: how do built thresholds and labor conditions construct catastrophe?”',
            desc: 'Connecting workplace fatality memorials with high-rise fire evacuation simulations—interrogating how spatial design and institutional neglect construct disaster.',
            flow: ['LABOUR AUDIT', '⇄', 'EGRESS DYNAMICS'],
            footerLabel: 'BRIDGE WORKS:',
            projects: [
                { title: 'EMEK MUSEUM', url: './projects/emek-museum/' },
                { title: 'FIRE ESCAPE SIMULATION', url: './projects/fire-escape-simulation/' }
            ]
        },
        'edge-right': {
            mode: 'DIALECTICAL TENSION // RIGHT AXIS',
            badge: 'AXIS 02 // INQUIRY &times; STRANGE SPECULATION',
            title: 'SPATIAL JUSTICE &times; STRANGE SPECULATION',
            quote: '“How do critical ethics spark radically unexpected and provocative alternatives?”',
            desc: 'Connecting institutional critique and spatial justice with strange, speculative design alternatives that challenge conventional architectural recipes.',
            flow: ['ETHICAL AUDIT', '⇄', 'RADICAL SPECULATION'],
            footerLabel: 'BRIDGE WORKS:',
            projects: [
                { title: 'STRAY', url: './projects/stray/' },
                { title: 'BIO-DECAY', url: './projects/bio-decay/' }
            ]
        },
        'edge-bottom': {
            mode: 'DIALECTICAL TENSION // BASE AXIS',
            badge: 'AXIS 03 // CONTEXT &times; UNORTHODOX ALTERNATIVES',
            title: 'SITE MEMORY &times; UNORTHODOX ALTERNATIVES',
            quote: '“How does deep site excavation generate surprising, unpredicted solutions?”',
            desc: 'Historical microclimates, forgotten site layers, and vernacular traces repurposed to produce strange, unconventional spatial interventions rather than standard architectural forms.',
            flow: ['SITE SENSITIVITY', '⇄', 'UNORTHODOX PROPOSAL'],
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
        const portfolioProjectSlugs = ['emek-museum', 'stray', 'you-were-here', 'chronoclines', 'millieu', 'sprouting-garden', 'bajo-la-fresca', 'wood-weave', 'ara-sira', 'the-earthen', 'bio-decay', 'fire-escape-simulation'];

        // Centralized Bilingual Project Statements for Concise Previews
        const PROJECT_PREVIEW_STATEMENTS = {
            'emek-museum': {
                en: `
                    <p>Work-related accidents remain a persistent reality, particularly in Türkiye. Yet when workers lose their lives, the public narrative often ends with the accident itself—their labour, the time they gave, and the lives shaped through their work gradually disappear from view.</p>
                    <p style="font-size: 1.15rem; font-weight: 700; color: #0f172a; margin: 10px 0; border-left: 3px solid var(--proj-color, #2563eb); padding-left: 14px;">Emek Museum asks: how can we make this labour visible again?</p>
                    <p style="font-family: monospace; font-size: 0.82rem; font-weight: 600; color: var(--proj-color, #2563eb); letter-spacing: 0.05em;">Spatial research &amp; counter-monument initiative in progress.</p>
                `,
                tr: `
                    <p>İş cinayetleri ve iş kazaları, özellikle Türkiye'de süregelen yakıcı bir gerçeklik olmaya devam ediyor. Ancak emekçiler yaşamlarını yitirdiğinde, kamusal anlatı çoğunlukla kazanın kendisiyle son buluyor—onların emeği, verdikleri zaman ve emekleriyle biçimlenen yaşamlar ise zamanla görünmezleşiyor.</p>
                    <p style="font-size: 1.15rem; font-weight: 700; color: #0f172a; margin: 10px 0; border-left: 3px solid var(--proj-color, #2563eb); padding-left: 14px;">Emek Museum soruyor: bu emeği yeniden nasıl görünür kılabiliriz?</p>
                    <p style="font-family: monospace; font-size: 0.82rem; font-weight: 600; color: var(--proj-color, #2563eb); letter-spacing: 0.05em;">Mekânsal araştırma ve karşı-anıt inisiyatifi geliştirilme aşamasındadır.</p>
                `
            },
            'stray': {
                en: `
                    <p><strong>STRAY</strong> investigates the boundaries between purposelessness and presence in contemporary urban life. Grounded in 19th-century theories of the <em>Flâneur</em>, Situationist <em>dérive</em> (psychogeography), and the <em>Slow City</em> philosophy, the project questions the utilitarian tyranny of efficiency: <em>“Is doing nothing doing something?”</em> and <em>“Is it laziness to do (nothing)?”</em></p>
                    <p>Situated along the coastal tree canopy of Moda, Kadıköy, the building acts as an open urban interior where pedestrians naturally drift inward from the seaside promenade. A continuous multi-level ramp weaves through a series of transformative zones—from semi-outdoor frontyards framed by magenta mesh lattices, to active mark-making surfaces where visitors leave tangible traces of their thoughts, to flexible moveable-wall workshops, culminating in the contemplative sensory silence of <em>The Dark Room</em>.</p>
                `,
                tr: `
                    <p><strong>STRAY</strong>, çağdaş kent yaşamında amaçsızlık ile varoluş arasındaki sınırları araştıran bir mekânsal sorgulamadır. 19. yüzyılın <em>Flâneur</em> kavramından, Sitüasyonist <em>dérive</em> (psikocoğrafya) pratiklerinden ve <em>Sakin Şehir (Slow City)</em> felsefesinden beslenen proje, faydacı üretkenlik baskısını tersyüz eder: <em>“Hiçbir şey yapmamak bir şey yapmak mıdır?”</em> ve <em>“Aylaklık tembellik midir?”</em></p>
                    <p>Kadıköy Moda Sahili boyunca uzanan ağaç dokusunun arkasında konumlanan yapı, yayaların sahil hattından içeriye kendiliğinden sürüklendiği bir kentsel iç mekan gibi kurgulanmıştır. Sürekli bir rampa omurgası, pembe metal ızgaralarla filtrelenen yarı açık avlulardan, ziyaretçilerin çizimler ve izler bıraktığı etkileşimli yüzeylere, hareketli duvarlarla dönüşen atölyelere ve en üstte duyusal bir içe dönüş sunan <em>Karanlık Oda'ya (The Dark Room)</em> kadar uzanan kesintisiz bir deneyim sunar.</p>
                `
            },
            'you-were-here': {
                en: `
                    <p><strong>YOU WERE HERE.</strong> transforms the entire portfolio website into an active topological sensorium. When a visitor grants consent, their involuntary cursor gestures are recorded across the viewport as normalized coordinate vectors. Kinetic velocities are inverted into line stroke weights, while cognitive hesitations bloom into translucent cerulean halos.</p>
                    <p style="font-size: 1.15rem; font-weight: 700; color: #0f172a; margin: 10px 0; border-left: 3px solid var(--proj-color, #22c55e); padding-left: 14px;">Can an anonymous trace possess the weight of physical presence? Can a cursor line become an architectural memory?</p>
                    <p>Rather than surveillance, this is an open participatory monument: a persistent Cloud Firebase Firestore archive preserving both past and live traces, generating lightweight 1:1 PNG vector-raster artifacts, and superimposing all journeys into a living collective palimpsest.</p>
                `,
                tr: `
                    <p><strong>YOU WERE HERE.</strong>, tüm portfolyo web sitesini duyarlı bir mekânsal yüzeye dönüştürür. Ziyaretçi rıza verdiğinde, ekran üzerindeki tüm istemsiz imleç hareketleri normalize edilmiş koordinat vektörleri olarak kaydedilir. Hareket hızları ters orantılı çizgi kalınlıklarına dönüşürken, okuma ve düşünme duraklamaları yarı saydam mavi hâleler olarak çiçek açar.</p>
                    <p style="font-size: 1.15rem; font-weight: 700; color: #0f172a; margin: 10px 0; border-left: 3px solid var(--proj-color, #22c55e); padding-left: 14px;">Anonim bir imleç çizgisi fiziksel bir izin ağırlığına sahip olabilir mi? Dijital bir hat mekânsal bir belleğe dönüşebilir mi?</p>
                    <p>Bu sistem bir gözetleme mekanizması değil; katılımcı bir açık anıttır: geçmiş ve canlı tüm izleri Cloud Firebase Firestore üzerinde koruyan, hafif 1:1 PNG artefaktları üreten ve tüm ziyaretleri canlı bir kolektif dijital tortuda buluşturan bir bellek deneyi.</p>
                `
            },
            'chronoclines': {
                en: `
                    <p><strong>CHRONOCLINES</strong> interrogates how an urban territory registers and exhibits its own temporal transformations. Investigating algorithmic stratification and digital forensics, the project translates historical topographical sedimentations, spatial layers, and collective memory into generative cartographic artifacts.</p>
                    <p style="font-size: 1.15rem; font-weight: 700; color: #0f172a; margin: 10px 0; border-left: 3px solid var(--proj-color, #ea580c); padding-left: 14px;">Can a city exhibit itself?</p>
                    <p>By superimposing historical strata and contemporary urban flows, Chronoclines questions whether architectural representation can function not merely as a static blueprint, but as an evolving geological and societal clock.</p>
                `,
                tr: `
                    <p><strong>CHRONOCLINES</strong>, kentsel bir coğrafyanın kendi zamansal dönüşümlerini nasıl kaydettiğini ve sergilediğini sorgular. Algoritmik katmanlaşma ve dijital adli mimarlık tekniklerini araştıran proje; kentin tarihsel topoğrafik tortularını, mekânsal katmanlarını ve kolektif hafızasını üretken kartografik artefaktlara dönüştürür.</p>
                    <p style="font-size: 1.15rem; font-weight: 700; color: #0f172a; margin: 10px 0; border-left: 3px solid var(--proj-color, #ea580c); padding-left: 14px;">Bir kent kendi kendini sergileyebilir mi?</p>
                    <p>Tarihsel katmanlar ile çağdaş kentsel akışları üst üste bindiren Chronoclines, mimari temsilin yalnızca durağan bir plan değil, yaşayan jeolojik ve toplumsal bir saat olarak çalışıp çalışamayacağını tartışır.</p>
                `
            },
            'millieu': {
                en: `
                    <p><strong>Millieu</strong> (/mɪl'ju:/) explores the intersection of culinary ritual, neighborhood memory, and interior architecture in Kadıköy’s historic Yeldeğirmeni district. Defined as <em>a person’s social environment or atmosphere</em>, the project reinterprets the historical heritage of Yeldeğirmeni—where coastal winds once powered windmills transforming grain into flour—into a contemporary social hub centered around the craft of quiche.</p>
                    <p>Quiche functions as a circular architectural diagram of communal sharing. The geometric dialogue between windmill blades, the sliced pastry wedge, and the letterform <em>M</em> generates the entire spatial language: from custom triangular table bases and arched lighting brackets to an expansive stepped amphitheater framed by burgundy tubular steel pergolas.</p>
                `,
                tr: `
                    <p><strong>Millieu</strong> (/mɪl'ju:/), Kadıköy Yeldeğirmeni’nin köklü mahalle hafızası ile gastronomi ritüelini iç mimari bir deneyimde buluşturan bir mekânsal tasarımdır. Etimolojik olarak <em>kişinin içinde bulunduğu toplumsal çevre veya atmosfer</em> anlamına gelen "milieu" kavramı; geçmişte yel değirmenleriyle buğdayın una dönüştüğü bu tarihi semtte, kiş (quiche) pişirme ve paylaşma eylemi etrafında yeni bir kentsel buluşma alanına dönüşür.</p>
                    <p>Kiş, yuvarlak bütününden dilimlenerek paylaşılan formuyla projenin temel mekânsal şemasına ilham verir. Yel değirmeni kanatları, kiş dilimi ve "M" harfinin geometrik kesişimi; özel tasarım üçgen masa ayaklarından kemerli aydınlatmalara, bordo çelik konstrüksiyonlu amfi basamaklarından özel ambalaj ve menü tasarımına kadar tüm mekân tektoniğini şekillendirir.</p>
                `
            },
            'sprouting-garden': {
                en: `
                    <p><strong>Sprouting Garden</strong> is situated in a public park beside the historical Kuzguncuk Bostanı in Üsküdar, Istanbul. Its primary objective is to forge a shared-use community pavilion dedicated to cultivating, preparing, and serving a specialty culinary dish crafted from native bean varieties specifically adapted to Kuzguncuk’s microclimate.</p>
                    <p>Designed to weave gracefully into the park without severing the historical foot-traffic between adjacent streets (+18.00m to +22.50m), the pavilion is constructed entirely from wood with an open, perforated waffle structure. This porous skin provides climbing beans with an organic trellis while honoring the height and spread of mature park trees.</p>
                `,
                tr: `
                    <p><strong>Sprouting Garden</strong>, İstanbul'un Üsküdar ilçesinde, tarihi Kuzguncuk Bostanı'na komşu bir park alanında yer almaktadır. Projenin ana konusu, Kuzguncuk Bostanı'nda yetişen ve bölgenin iklimine uygun yerel fasulye çeşitlerinden yapılan özel bir ritüel yemeğinin hazırlanması, servis edilmesi ve yetiştirilmesi süreçlerini destekleyen ortak bir kamusal yapı tasarlamaktır.</p>
                    <p>Yapı, iki sokak arasındaki yaya geçirgenliğini koparmamak ve doğal çevreyle uyum içinde olmak için ahşaptan, boşluklu bir waffle strüktür olarak kurgulanmıştır. Açık ve gözenekli yapısı fasulyelerin sarmaşıklarına dikey tırmanma alanı sağlarken, parktaki mevcut ağaçların boyutlarına saygı göstererek etraflarından kıvrılır.</p>
                `
            },
            'bajo-la-fresca': {
                en: `
                    <p><strong>Bajo la Fresca</strong> is a contextual research and ephemeral spatial installation realized in Patio San Basilio 44 during the celebrated Fiesta de los Patios in Córdoba, Spain. Exploring the socio-climatic ritual of <em>tomar el fresco</em> (gathering outside in the evening cool), the project reinterprets the UNESCO-recognized courtyard as an atmospheric sanctuary of coexistence.</p>
                    <p>To overcome the strict ground and wall limitations of the historic courtyard, the installation suspends an undulating, lightweight pleated canopy that carries gradient-dyed cotton petals infused with fresh Andalusian orange and lemon peels alongside natural citronella essence. As convective evening breezes circulate, the suspended pouches sway gently, diffusing pleasant citrus notes and creating a sensory microclimatic refuge for neighbors and visitors below.</p>
                `,
                tr: `
                    <p><strong>Bajo la Fresca</strong>, Córdoba’nın dünyaca ünlü tarihi avlu şenlikleri (Fiesta de los Patios) sırasında Patio San Basilio 44 avlusunda hayata geçirilen bağlamsal bir araştırma ve mekânsal yerleştirmedir. Proje, akşam serinliğinde kapı önüne veya avluya çıkıp komşularla sohbet etme geleneği olan <em>tomar el fresco</em> ritüelini merkeze alır.</p>
                    <p>Tarihi avludaki dar zemin ve duvar kısıtlarını aşmak amacıyla avlunun gökyüzü boşluğuna dalgalı kumaş kıvrımlarından oluşan asılı bir gölgelik yerleştirilmiştir. Begonvil ve narenciye tonlarında degrade boyanmış pamuk liflerine emdirilen taze portakal-limon kabukları ve doğal sivrisinek kovucu esanslar, akşam esintileriyle avluya yayılarak altındaki ziyaretçilere ferahlatıcı bir mikroklimatik sığınak sunar.</p>
                `
            },
            'wood-weave': {
                en: `
                    <p><strong>WOOD WEAVE</strong> is formed by interlocking wooden pieces, each two meters in length, creating flexible spatial intervals between them. This design provides a generative civic space where individuals can showcase and display their creations, while offering local bazaar vendors and pedestrians the opportunity to personalize their own territories within the space.</p>
                    <p>Situated directly beside the historic market in Bursa, students and neighbors gather every Thursday morning following Wednesday's market day to collect leftover wooden fruit crates and agricultural surplus. Throughout the week, they experiment with wood joinery, botanical drying, textile sewing, and sculpting, discovering how to repurpose waste into functional community architecture.</p>
                `,
                tr: `
                    <p><strong>WOOD WEAVE</strong>, her biri iki metre uzunluğunda birbirine kenetlenen ahşap parçalardan meydana gelmekte ve aralarında zengin mekânsal boşluklar üretmektedir. Bu kurgu, kullanıcıların kendi üretimlerini sergileyebilecekleri ortak bir zemin sağlarken, Bursa Tarihi Çarşısı'nı kullanan esnafa ve mahalle sakinlerine mekân içinde kendi kişiselleştirilmiş alanlarını kurma özgürlüğü tanır.</p>
                    <p>Bursa'daki tarihi pazar alanının hemen bitişiğinde yer alan projede öğrenciler ve mahalle sakinleri, Çarşamba günleri kurulan pazarın ardından Perşembe sabahları atık ahşap meyve kasalarını ve sebze-meyve fazlalıklarını toplar. Hafta boyunca atölyelerde bu malzemeler kurutma, dikiş, yontu ve strüktürel eklemlenme teknikleriyle yeni mekân bileşenlerine dönüştürülür.</p>
                `
            },
            'ara-sira': {
                en: `
                    <p><strong>ARA-SIRA</strong> investigates dual-state spatial dynamics, collective play, and quiet contemplation within community architecture. Exploring how a single envelope can transition between energetic shared activity and introverted solitude, the project utilizes flexible furniture systems and tactile thresholds.</p>
                    <p style="font-size: 1.15rem; font-weight: 700; color: #0f172a; margin: 10px 0; border-left: 3px solid var(--proj-color, #818cf8); padding-left: 14px;">Can one space hold both play and quiet?</p>
                    <p>Through an editorial format and tactile full-scale mockups, Ara-Sıra demonstrates how modular timber and acoustic boundaries negotiate conflicting civic desires without resorting to permanent physical separation.</p>
                `,
                tr: `
                    <p><strong>ARA-SIRA</strong>, topluluk mekânlarında çift kutuplu mekânsal dinamikleri, kolektif oyun ve sessiz tefekkür hallerini araştırır. Tek bir mekân zarfının enerjik ortak faaliyetler ile içe dönük dinginlik arasında nasıl geçiş yapabileceğini esnek donatılar ve duyusal eşikler aracılığıyla inceler.</p>
                    <p style="font-size: 1.15rem; font-weight: 700; color: #0f172a; margin: 10px 0; border-left: 3px solid var(--proj-color, #818cf8); padding-left: 14px;">Bir mekân hem oyunu hem sessizliği aynı anda barındırabilir mi?</p>
                    <p>Editoryal bir yayın formatı ve birebir ölçekli prototipler üzerinden proje; modüler ahşap ve akustik sınırların, kalıcı duvarlara gerek kalmaksızın zıt kamusal beklentileri nasıl uzlaştırabileceğini ortaya koyar.</p>
                `
            },
            'the-earthen': {
                en: `
                    <p><strong>The Earthen</strong> is a healing sanctuary designed to cultivate physical and spiritual wellbeing through tactile connection with soil and clay. Likening the regenerative cycles of the earth—resting, decomposing, and blooming—to the natural rhythms of human life, it offers urbanites a restorative grounding space.</p>
                    <p>The architecture unfolds along a vertical wellbeing journey: subterranean mineral mud-bathing pools for physical release, radial clay-shaping workshops in the Material Creator Lab, and a rooftop living terrace garden. Curved conduits weave through the structure, circulating living water, slurry, and seeds across all levels.</p>
                `,
                tr: `
                    <p><strong>The Earthen</strong>, toprak ve kille kurulan dokunsal temas üzerinden fiziksel ve ruhsal esenlik (wellbeing) kazandıran bir iyileşme mekânıdır. Toprağın dinlenme, arınma ve yeniden canlanma döngülerini insan yaşamındaki iniş çıkışlar ve yenilenme süreçleriyle buluşturur.</p>
                    <p>Mekân dikey bir iyileşme rotası sunar: bedensel rahatlama sağlayan mineral çamur havuzları, zemin kattaki radyal kil şekillendirme atölyeleri ve en üstteki canlı teras bahçesi. Çok işlevli boru ağı ise su, tohum ve çamur dolaşımını sağlayarak yapıyı yaşayan bir metabolizmaya dönüştürür.</p>
                `
            },
            'bio-decay': {
                en: `
                    <p><strong>BIO-DECAY</strong> investigates non-petrochemical material life cycles within an urban interior, confronting the insidious presence of synthetic microplastics in daily consumption. Situated in the historic Milli Reasürans Passage in Nişantaşı, Istanbul, the project establishes a living organic archive, bio-materials laboratory, and public amphitheater fueled by local restaurant food waste.</p>
                    <p>Structured with a permanent steel wire grid skeleton, the architecture accepts decomposition as an intrinsic material quality: food-waste biopolymer panels soften, darken, and biodegrade over time, inviting visitors to harvest, cast, and replace degrading tiles in an unending cycle of civic renewal.</p>
                `,
                tr: `
                    <p><strong>BIO-DECAY</strong>, kentsel bir iç mekânda petrokimyasal olmayan malzeme yaşam döngülerini ve günlük tüketimimizdeki mikroplastik tehdidini araştırır. İstanbul Nişantaşı’ndaki tarihi Milli Reasürans Pasajı’nda konumlanan proje; çevre restoranların gıda atıklarıyla beslenen yaşayan organik bir arşiv, biyo-malzeme laboratuvarı ve kamusal amfi kurgular.</p>
                    <p>Kalıcı bir çelik hasır iskelet üzerine inşa edilen yapı, çözünmeyi mimarinin doğal bir parçası olarak kabul eder: atık gıdalardan üretilen biyo-plastik paneller zamanla renk değiştirir, kararır ve yavaşça ayrışır; ziyaretçiler kendi ürettikleri yeni panelleri eskileriyle değiştirerek yapıyı yaşayan bir döngüde tutar.</p>
                `
            },
            'fire-escape-simulation': {
                en: `
                    <p><strong>FIRE ESCAPE SIMULATION</strong> is a computational behavioral inquiry and spatial simulation investigating emergency crowd dynamics, exit route choices, and spatial panic under hazardous conditions.</p>
                    <p style="font-size: 1.15rem; font-weight: 700; color: #0f172a; margin: 10px 0; border-left: 3px solid var(--proj-color, #ef4444); padding-left: 14px;">Can you escape the fire?</p>
                    <p>By modeling individual agent behaviors, visibility occlusions, bottlenecks, and speed variations during emergency egress, the simulation interrogates whether conventional fire exit codes truly account for psychological hesitation and collective spatial instincts.</p>
                `,
                tr: `
                    <p><strong>FIRE ESCAPE SIMULATION</strong>, acil durum tahliye dinamiklerini, kaçış rotası tercihlerini ve tehlike anındaki mekânsal paniği araştıran hesaplamalı bir simülasyon ve davranış modelidir.</p>
                    <p style="font-size: 1.15rem; font-weight: 700; color: #0f172a; margin: 10px 0; border-left: 3px solid var(--proj-color, #ef4444); padding-left: 14px;">Yangından kaçabilir misin?</p>
                    <p>Bireysel etmen (agent) davranışlarını, duman ve görüş engellerini, darboğazları ve tahliye hızlarını simüle eden çalışma; standart yangın kaçış yönetmeliklerinin insan psikolojisindeki tereddüt ve kolektif içgüdüleri ne kadar doğru öngörebildiğini sorgular.</p>
                `
            }
        };

        // Close modal and revert URL hash to #constellation
        function closeProjectModal() {
            projectModal.classList.add('hidden');
            document.body.style.overflow = '';
            const curHash = window.location.hash.replace(/^#/, '').trim();
            if (portfolioProjectSlugs.includes(curHash) || curHash.startsWith('project-') || curHash.startsWith('modal-') || curHash.startsWith('card-') || curHash === 'projects') {
                history.replaceState(null, '', '#constellation');
            }
        }
        window.closeProjectModal = closeProjectModal;
        modalClose.addEventListener('click', closeProjectModal);

        function openProjectModalBySlug(slug, updateHash = true) {
            if (!slug) return;
            slug = slug.replace(/^(project-|modal-|card-)/, '').trim();
            navigateToProject(slug);
        }
        window.openProjectModalBySlug = openProjectModalBySlug;

        // Intercept any link going to a project - direct navigation to dedicated page with origin tracking
        document.body.addEventListener('click', (e) => {
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
                if (href) {
                    navigateToProject(href);
                }
            }
        });

        // Ensure clicking standalone page links updates history for seamless browser back button return
        projectModal.addEventListener('click', (e) => {
            const standaloneBtn = e.target.closest('.modal-open-standalone-btn');
            if (standaloneBtn && window.lastOpenedProjectSlug) {
                history.replaceState(null, '', '#' + window.lastOpenedProjectSlug);
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !projectModal.classList.contains('hidden')) {
                closeProjectModal();
            }
        });

        // Check if page opened with a project hash or back/forward triggered hash
        function checkHashAndOpenModal() {
            const curHash = window.location.hash.replace(/^#/, '').trim();
            if (portfolioProjectSlugs.includes(curHash) || curHash.startsWith('project-') || curHash.startsWith('modal-') || curHash.startsWith('card-')) {
                const initSlug = curHash.replace(/^(project-|modal-|card-)/, '');
                window.location.href = './projects/' + initSlug + '/';
            } else {
                if (!projectModal.classList.contains('hidden')) {
                    projectModal.classList.add('hidden');
                    document.body.style.overflow = '';
                }
            }
        }

        setTimeout(checkHashAndOpenModal, 80);
        window.addEventListener('hashchange', checkHashAndOpenModal);
        window.addEventListener('popstate', checkHashAndOpenModal);
    }

    // --- ARCHIVE QUESTIONS & INTERNAL MONOLOGUE FEED ---
    function initArchiveFeed() {
        const feedContainer = document.getElementById('archive-questions-feed');
        if (!feedContainer || !window.ARCHIVE_QUESTIONS) return;

        const searchInput = document.getElementById('archive-search-input');
        const clearBtn = document.getElementById('archive-search-clear');
        const countBadge = document.getElementById('archive-count-badge');
        const statCount = document.getElementById('archive-stat-count');

        // Multi-select state:
        const activeFilters = new Set();   // active tag slugs
        const activeProjects = new Set();  // active project IDs
        let searchQuery = '';

        function toggleTag(tag) {
            if (tag === 'all') {
                activeFilters.clear();
            } else {
                if (activeFilters.has(tag)) {
                    activeFilters.delete(tag);
                } else {
                    activeFilters.add(tag);
                }
            }
            render();
        }

        function toggleProject(projectId) {
            if (projectId === 'all') {
                activeProjects.clear();
            } else {
                if (activeProjects.has(projectId)) {
                    activeProjects.delete(projectId);
                } else {
                    activeProjects.add(projectId);
                }
            }
            render();
        }

        function render() {
            // Update tag buttons state
            const tagButtons = document.querySelectorAll('#archive-filter-pills .archive-tag-btn, .archive-pill');
            const isAllTags = (activeFilters.size === 0);
            tagButtons.forEach(btn => {
                const f = btn.getAttribute('data-filter');
                if (f === 'all') {
                    btn.classList.toggle('active', isAllTags);
                } else {
                    btn.classList.toggle('active', activeFilters.has(f));
                }
            });

            // Update project buttons state
            const projectButtons = document.querySelectorAll('#archive-filter-projects .archive-project-btn');
            const isAllProjects = (activeProjects.size === 0);
            projectButtons.forEach(btn => {
                const p = btn.getAttribute('data-project-filter');
                if (p === 'all') {
                    btn.classList.toggle('active', isAllProjects);
                } else {
                    btn.classList.toggle('active', activeProjects.has(p));
                }
            });

            const query = searchQuery.trim().toLowerCase();
            let list = window.ARCHIVE_QUESTIONS;

            // 1. Tag filter logic
            if (activeFilters.size === 1) {
                const single = Array.from(activeFilters)[0];
                list = list.filter(item => item.tags && item.tags.includes(single));
            } else if (activeFilters.size >= 2) {
                const filterArr = Array.from(activeFilters);
                const exactMatches = list.filter(item =>
                    item.tags && filterArr.every(t => item.tags.includes(t))
                );
                if (exactMatches.length > 0) {
                    list = exactMatches;
                } else {
                    list = list.filter(item =>
                        item.tags && filterArr.some(t => item.tags.includes(t))
                    );
                }
            }

            // 2. Project filter logic
            if (activeProjects.size > 0) {
                list = list.filter(item =>
                    item.relatedProject && activeProjects.has(item.relatedProject.id)
                );
            }

            // 3. Text search query
            if (query) {
                list = list.filter(item =>
                    (item.question && item.question.toLowerCase().includes(query)) ||
                    (item.reflection && item.reflection.toLowerCase().includes(query)) ||
                    (item.tags && item.tags.some(t => t.toLowerCase().includes(query))) ||
                    (item.relatedProject && item.relatedProject.title.toLowerCase().includes(query))
                );
            }

            // Topbar badge & counter stats
            if (countBadge) {
                let badgeParts = [];
                if (activeFilters.size > 0) {
                    badgeParts.push(Array.from(activeFilters).map(t => `#${t.toUpperCase()}`).join(' + '));
                }
                if (activeProjects.size > 0) {
                    const projNames = Array.from(activeProjects).map(pid => {
                        const item = window.ARCHIVE_QUESTIONS.find(q => q.relatedProject && q.relatedProject.id === pid);
                        return item ? item.relatedProject.title : pid.toUpperCase();
                    });
                    badgeParts.push(`PROJ: ${projNames.join(' + ')}`);
                }

                if (badgeParts.length === 0) {
                    countBadge.textContent = `${list.length} INQUIRIES \u2022 ALL`;
                } else {
                    countBadge.textContent = `${list.length} INQUIRIES \u2022 ${badgeParts.join(' \u2022 ')}`;
                }
            }
            if (statCount) {
                statCount.textContent = list.length < 10 ? `0${list.length}` : `${list.length}`;
            }

            // Empty state
            if (list.length === 0) {
                feedContainer.innerHTML = `
                    <div class="archive-empty-feed">
                        <p class="a-empty-title">No inquiries match the selected filter combination.</p>
                        <button type="button" class="archive-reset-filter-btn" id="archive-reset-btn">[ RESET ALL FILTERS ]</button>
                    </div>
                `;
                const resetBtn = document.getElementById('archive-reset-btn');
                if (resetBtn) {
                    resetBtn.addEventListener('click', () => {
                        activeFilters.clear();
                        activeProjects.clear();
                        searchQuery = '';
                        if (searchInput) searchInput.value = '';
                        if (clearBtn) clearBtn.classList.add('hidden');
                        render();
                    });
                }
                return;
            }

            // Question cards
            feedContainer.innerHTML = list.map(item => {
                const tagsHtml = (item.tags || []).map(t => {
                    const isTagActive = activeFilters.has(t);
                    return `<button type="button" class="a-tag ${isTagActive ? 'active' : ''}" data-tag="${t}"><span class="a-tag-sq"></span>#${t}</button>`;
                }).join(' ');
                const timeHtml = item.time ? `<span class="a-time-sep">&bull;</span><span class="a-time-clock">${item.time}</span>` : '';

                const projectPillHtml = item.relatedProject
                    ? `<button type="button" class="a-project-pill ${activeProjects.has(item.relatedProject.id) ? 'active' : ''}" data-project-filter="${item.relatedProject.id}">PROJ: ${item.relatedProject.title}</button>`
                    : '';

                const questionHtml = item.relatedProject && item.relatedProject.url
                    ? `<a href="${item.relatedProject.url}" class="archive-entry-question is-linked" data-cursor="question" data-project-id="${item.relatedProject.id}">&ldquo;${item.question}&rdquo;</a>`
                    : `<p class="archive-entry-question">&ldquo;${item.question}&rdquo;</p>`;

                return `
                    <article class="archive-entry-card" data-archive-id="${item.id}">
                        <div class="archive-entry-meta">
                            <div class="archive-entry-timestamp">
                                <span class="a-time-date">${item.date}</span>
                                ${timeHtml}
                                ${projectPillHtml}
                            </div>
                            <div class="archive-entry-tags">
                                ${tagsHtml}
                            </div>
                        </div>
                        <div class="archive-entry-body">
                            ${questionHtml}
                        </div>
                    </article>
                `;
            }).join('');

            // Clickable questions navigate directly without animation, preserving archive return state
            feedContainer.querySelectorAll('.archive-entry-question.is-linked').forEach(linkEl => {
                linkEl.addEventListener('click', (e) => {
                    if (e.ctrlKey || e.metaKey || e.shiftKey || e.button === 1) return;
                    const href = linkEl.getAttribute('href');
                    if (href) {
                        e.preventDefault();
                        try {
                            sessionStorage.setItem('portfolio_return_url', window.location.pathname + '#archive');
                            sessionStorage.setItem('portfolio_return_active', 'true');
                        } catch (_) {}
                        window.location.href = href;
                    }
                });
            });

            // Card project pills filter by that project
            feedContainer.querySelectorAll('.a-project-pill').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const pid = btn.getAttribute('data-project-filter');
                    if (pid) {
                        toggleProject(pid);
                    }
                });
            });

            // Card inline tags toggle tag filter
            feedContainer.querySelectorAll('.a-tag').forEach(tagBtn => {
                tagBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const tag = tagBtn.getAttribute('data-tag');
                    if (tag) {
                        toggleTag(tag);
                    }
                });
            });
        }

        // Attach click listeners to tag filter buttons
        const tagFilterButtons = document.querySelectorAll('#archive-filter-pills .archive-tag-btn, .archive-pill');
        tagFilterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const tag = btn.getAttribute('data-filter') || 'all';
                toggleTag(tag);
            });
        });

        // Attach click listeners to project filter buttons
        const projectFilterButtons = document.querySelectorAll('#archive-filter-projects .archive-project-btn');
        projectFilterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const projId = btn.getAttribute('data-project-filter') || 'all';
                toggleProject(projId);
            });
        });

        // Search input
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                searchQuery = e.target.value;
                if (clearBtn) {
                    clearBtn.classList.toggle('hidden', searchQuery.length === 0);
                }
                render();
            });
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                searchQuery = '';
                if (searchInput) searchInput.value = '';
                clearBtn.classList.add('hidden');
                render();
            });
        }

        // Interactive Horizontal Drift for Filter Tracks
        function initArchiveFilterTrackDrift() {
            const trackWraps = document.querySelectorAll('.archive-filter-track-wrap');
            if (!trackWraps.length) return;

            trackWraps.forEach(wrap => {
                let currentScroll = wrap.scrollLeft;
                let targetScroll = wrap.scrollLeft;
                let isHovered = false;
                let rafId = null;

                function updateMask() {
                    const maxScroll = wrap.scrollWidth - wrap.clientWidth;
                    if (maxScroll <= 2) {
                        wrap.classList.add('no-overflow');
                        wrap.classList.remove('has-overflow', 'has-scroll-left', 'at-scroll-end');
                        return;
                    }
                    wrap.classList.remove('no-overflow');
                    wrap.classList.add('has-overflow');

                    if (wrap.scrollLeft > 6) {
                        wrap.classList.add('has-scroll-left');
                    } else {
                        wrap.classList.remove('has-scroll-left');
                    }

                    if (wrap.scrollLeft >= maxScroll - 6) {
                        wrap.classList.add('at-scroll-end');
                    } else {
                        wrap.classList.remove('at-scroll-end');
                    }
                }

                function step() {
                    const maxScroll = wrap.scrollWidth - wrap.clientWidth;
                    if (maxScroll > 0) {
                        const diff = targetScroll - currentScroll;
                        if (Math.abs(diff) > 0.35) {
                            currentScroll += diff * 0.085;
                            wrap.scrollLeft = currentScroll;
                            updateMask();
                            rafId = requestAnimationFrame(step);
                        } else {
                            currentScroll = targetScroll;
                            wrap.scrollLeft = currentScroll;
                            updateMask();
                            rafId = null;
                        }
                    } else {
                        rafId = null;
                        updateMask();
                    }
                }

                function requestStep() {
                    if (!rafId) {
                        rafId = requestAnimationFrame(step);
                    }
                }

                // Panoramic tracking: mouse moves right -> tags glide left to reveal further items
                wrap.addEventListener('mousemove', (e) => {
                    const maxScroll = wrap.scrollWidth - wrap.clientWidth;
                    if (maxScroll <= 0) return;

                    const rect = wrap.getBoundingClientRect();
                    const relX = e.clientX - rect.left;
                    
                    const edgeBuffer = 32;
                    const effectiveWidth = Math.max(1, rect.width - (edgeBuffer * 2));
                    const clampedX = Math.max(0, Math.min(effectiveWidth, relX - edgeBuffer));
                    const ratio = clampedX / effectiveWidth;

                    targetScroll = ratio * maxScroll;
                    requestStep();
                });

                wrap.addEventListener('mouseenter', () => {
                    isHovered = true;
                    currentScroll = wrap.scrollLeft;
                });

                wrap.addEventListener('mouseleave', () => {
                    isHovered = false;
                });

                // Mouse wheel horizontal scrolling
                wrap.addEventListener('wheel', (e) => {
                    const maxScroll = wrap.scrollWidth - wrap.clientWidth;
                    if (maxScroll <= 0) return;

                    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
                    if (Math.abs(delta) > 0) {
                        e.preventDefault();
                        targetScroll = Math.max(0, Math.min(maxScroll, targetScroll + (delta * 0.8)));
                        requestStep();
                    }
                }, { passive: false });

                // Native scroll synchronization
                wrap.addEventListener('scroll', () => {
                    if (!isHovered && !rafId) {
                        currentScroll = wrap.scrollLeft;
                        targetScroll = wrap.scrollLeft;
                        updateMask();
                    }
                }, { passive: true });

                if (window.ResizeObserver) {
                    const ro = new ResizeObserver(() => {
                        updateMask();
                    });
                    ro.observe(wrap);
                }

                updateMask();
                window.addEventListener('resize', () => {
                    const maxScroll = wrap.scrollWidth - wrap.clientWidth;
                    targetScroll = Math.min(targetScroll, Math.max(0, maxScroll));
                    updateMask();
                });

                document.addEventListener('visibilitychange', () => {
                    if (!document.hidden) updateMask();
                });
            });
        }

        render();
        initArchiveFilterTrackDrift();
    }

    initArchiveFeed();
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



// =========================================================
// UNIVERSAL FULLSCREEN IMAGE LIGHTBOX FOR WEBSITE
// Minimalist architectural viewer, dark translucent overlay, click anywhere to close
// =========================================================
(function() {
    let lastLightboxOpenedTime = 0;

    function ensureUniversalLightbox() {
        let modal = document.querySelector(
            '.lightbox-overlay, .image-lightbox, .lightbox-modal, #image-lightbox, #lightbox, #lightbox-modal, #universal-lightbox'
        );
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'universal-lightbox';
            modal.className = 'lightbox-overlay';
            modal.innerHTML = `
                <div class="lightbox-img-wrapper">
                    <img id="lightbox-img" src="" alt="Enlarged view">
                </div>
            `;
            document.body.appendChild(modal);
        }
        return modal;
    }

    function closeAnyActiveLightbox() {
        const activeModals = document.querySelectorAll(
            '.lightbox-overlay.active, .image-lightbox.active, .lightbox-modal.active, #image-lightbox.active, #lightbox.active, #lightbox-modal.active, #universal-lightbox.active'
        );
        let closed = false;
        activeModals.forEach(modal => {
            modal.classList.remove('active');
            const img = modal.querySelector('img');
            if (img) img.src = '';
            closed = true;
        });
        if (closed) {
            document.body.style.overflow = '';
        }
        return closed;
    }

    window.openUniversalFullscreenImage = function(src) {
        if (!src) return;
        const modal = ensureUniversalLightbox();
        const img = modal.querySelector('img');
        if (img) img.src = src;
        modal.classList.remove('hidden');
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        lastLightboxOpenedTime = Date.now();
    };

    // Capture-phase click delegator:
    // 1. If lightbox is open: clicking ANYWHERE closes it!
    // 2. If lightbox is closed: clicking ANY content image opens it full screen!
    document.addEventListener('click', function(e) {
        const activeModal = document.querySelector(
            '.lightbox-overlay.active, .image-lightbox.active, .lightbox-modal.active, #image-lightbox.active, #lightbox.active, #lightbox-modal.active, #universal-lightbox.active'
        );
        if (activeModal) {
            if (Date.now() - lastLightboxOpenedTime < 180) return;
            e.preventDefault();
            e.stopPropagation();
            closeAnyActiveLightbox();
            return;
        }

        const clickedImg = e.target.closest('img:not(.brand-logo-gif):not(#lightbox-img):not(.lightbox-img):not([src*="favicon"]):not(.ep-no-auto-lightbox)');
        if (clickedImg) {
            const fullSrc = clickedImg.getAttribute('data-full-src') || clickedImg.currentSrc || clickedImg.src || clickedImg.getAttribute('src');
            if (fullSrc) {
                e.preventDefault();
                e.stopPropagation();
                window.openUniversalFullscreenImage(fullSrc);
            }
        }
    }, true);

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAnyActiveLightbox();
        }
    });
})();


// =========================================================================
// EDITORIAL PROJECT-FOCUSED PORTFOLIO ENGINE (yeni-layout01)
// Re-centers the 12 projects as the main characters while preserving
// 100% of project data, assets, bilingual statements, and the Ülker (M45)
// conceptual cluster foundation.
// =========================================================================
document.addEventListener('DOMContentLoaded', () => {
    const stageEl = document.getElementById('ep-projects-stage');
    if (!stageEl) return;

    const EDITORIAL_PORTFOLIO_PROJECTS = [
        {
            id: 'stray',
            num: '02',
            title: 'STRAY',
            subtitle: 'Urban Sanctuary for Purposelessness, Drift & Presence',
            year: '2025',
            location: 'Moda Coast, Kadıköy, Istanbul',
            studio: 'Architectural Design Studio VII',
            typology: 'Public Cultural Building & Urban Interior',
            medium: 'Architectural Design · Interactive Spatial Systems',
            question: 'Is doing nothing doing something?',
            subQuestion: 'Is it laziness to do (nothing)?',
            summary: 'Situated along the coastal tree canopy of Moda, Kadıköy, STRAY challenges the utilitarian tyranny of urban efficiency. Grounded in 19th-century theories of the Flâneur, Situationist dérive (psychogeography), and the Slow City movement, the building operates as an open urban interior where pedestrians naturally drift inward from the seaside promenade along a continuous multi-level ramp—moving from magenta-mesh frontyards and mark-making surfaces to moveable-wall studios and the sensory stillness of The Dark Room.',
            disciplines: [
                'Architectural Design',
                'Spatial Design',
                'Interactive & Simulation',
                'Experimental Design'
            ],
            keywords: ['Presence', 'Traces', 'Participation', 'Psychogeography', 'Flâneur'],
            pole: 'critical-inquiry',
            poleLabel: 'Critical Inquiry',
            isClusterCore: true,
            star: {
                name: 'Electra',
                bayer: '17 Tauri',
                mag: '3.72 mag',
                role: 'Ülker Core Star · Presence & Drift'
            },
            awards: [
                '★ Archisearch Portfolio Challenge 2025 — Top 15 Selection'
            ],
            presentationStyle: 'architectural-gallery',
            url: './projects/stray/',
            color: '#10b981',
            heroImg: './assets/stray-project.png',
            heroCaption: 'Perspective Section & Coastal Drift Sequence — Moda, Kadıköy',
            gallery: [
                {
                    src: './assets/stray-project.png',
                    label: 'Hero Section',
                    caption: 'STRAY — Continuous Ramp Spine & Coastal Canopy Integration'
                },
                {
                    src: './projects/stray/assets/axonometric_section_3d.jpg',
                    label: '3D Axonometric',
                    caption: 'Exploded Spatial Axonometric — Programmatic Drift & Structural Grid'
                },
                {
                    src: './projects/stray/assets/render_the_frontyard_1.jpg',
                    label: 'The Frontyard',
                    caption: 'Semi-Outdoor Frontyard Framed by Magenta Mesh Lattices'
                },
                {
                    src: './projects/stray/assets/render_the_ramp.jpg',
                    label: 'The Ramp',
                    caption: 'Continuous Multi-Level Ramp & Interactive Mark-Making Surfaces'
                },
                {
                    src: './projects/stray/assets/render_the_dark_room.jpg',
                    label: 'The Dark Room',
                    caption: 'Contemplative Sensory Silence at the Culmination of the Drift'
                },
                {
                    src: './projects/stray/assets/section_aa_longitudinal_100.jpg',
                    label: 'Section A-A',
                    caption: 'Longitudinal Architectural Section (1:100) — Topographical Continuity'
                }
            ],
            researchStrands: [
                { label: 'Theoretical Grounding', value: 'Flâneur · Situationist Dérive · Slow City' },
                { label: 'Spatial Tectonics', value: 'Continuous Ramp Spine · Moveable Partitions · Mark-Making Walls' },
                { label: 'Key Drawings & Assets', value: '3 Full Presentation Boards · 1:50 / 1:100 Plans & Sections · 6 Interior Renders' }
            ],
            relatedIds: ['the-earthen', 'you-were-here', 'bio-decay']
        },
        {
            id: 'the-earthen',
            num: '10',
            title: 'THE EARTHEN',
            subtitle: 'Tactile Soil & Clay Sanctuary for Regenerative Urban Wellbeing',
            year: '2026',
            location: 'Istanbul',
            studio: 'Architectural & Spatial Design Studio',
            typology: 'Healing Sanctuary, Material Lab & Mud Bathhouse',
            medium: 'Architectural Design · Soil & Clay Tectonics',
            question: 'Is there life because there is death?',
            subQuestion: 'How can earth’s cycles of decomposition and renewal ground human wellbeing?',
            summary: 'The Earthen is a healing sanctuary designed to cultivate physical and spiritual wellbeing through direct tactile contact with soil, water, and clay. Likening the regenerative cycles of the earth—resting, decomposing, and blooming—to the rhythms of human life, the architecture unfolds along a vertical journey: subterranean mineral mud-bathing pools for physical release, radial clay-shaping workshops in the Material Creator Lab, and a rooftop living terrace connected by a metabolic network of water, slurry, and seed conduits.',
            disciplines: [
                'Architectural Design',
                'Spatial Design',
                'Bio-Material & Ecological',
                'Experimental Design'
            ],
            keywords: ['Earth & Wellbeing', 'Soil Cycles', 'Tactile Grounding', 'Regenerative Metabolism'],
            pole: 'experimental-thinking',
            poleLabel: 'Experimental Thinking',
            isClusterCore: true,
            star: {
                name: 'Taygeta',
                bayer: '19 Tauri',
                mag: '4.30 mag',
                role: 'Ülker Core Star · Tactile Soil & Renewal'
            },
            awards: [
                '★ Terraviva Render Award 2025 — Finalist'
            ],
            presentationStyle: 'architectural-gallery',
            url: './projects/the-earthen/',
            color: '#c2410c',
            heroImg: './assets/the-earthen-cover.png',
            heroCaption: 'The Earthen — Subterranean Mud Sanctuary & Living Conduit Metabolism',
            gallery: [
                {
                    src: './assets/the-earthen-cover.png',
                    label: 'Sanctuary View',
                    caption: 'The Earthen — Atmospheric Section & Tactile Earth Interior'
                },
                {
                    src: './projects/the-earthen/assets/diagram-exploded-axonometric.jpg',
                    label: 'Axonometric',
                    caption: 'Exploded Axonometric — Vertical Wellbeing Route & Conduit Network'
                },
                {
                    src: './projects/the-earthen/assets/render-portal-bath.jpg',
                    label: 'Mineral Mud Bath',
                    caption: 'Subterranean Mineral Mud-Bathing Pools for Sensory Grounding'
                },
                {
                    src: './projects/the-earthen/assets/render-earth-workshop.jpg',
                    label: 'Material Lab',
                    caption: 'Radial Clay-Shaping Workshops in the Material Creator Lab'
                },
                {
                    src: './projects/the-earthen/assets/render-terrace-canopy.jpg',
                    label: 'Living Terrace',
                    caption: 'Rooftop Living Terrace & Seed/Water Conduit Canopy'
                },
                {
                    src: './projects/the-earthen/assets/drawings-building-sections.jpg',
                    label: 'Building Sections',
                    caption: 'Architectural Sections & Metabolic Program Cycle'
                }
            ],
            researchStrands: [
                { label: 'Core Inquiry', value: 'Metabolic Soil Cycles · Decomposition as Regeneration' },
                { label: 'Vertical Program', value: 'Subterranean Mud Baths → Material Creator Lab → Rooftop Living Terrace' },
                { label: 'Key Drawings & Assets', value: '5 Architectural Sheets · Exploded Axonometric · Section & Plan Set' }
            ],
            relatedIds: ['stray', 'bajo-la-fresca', 'bio-decay']
        },
        {
            id: 'bio-decay',
            num: '11',
            title: 'BIO-DECAY',
            subtitle: 'Circular Biopolymer Archive & Living Material Laboratory',
            year: '2025',
            location: 'Milli Reasürans Passage, Nişantaşı, Istanbul',
            studio: 'Interior & Material Research Studio',
            typology: 'Bio-Materials Lab, Living Archive & Public Amphitheater',
            medium: 'Bio-Material & Ecological · Spatial Design',
            question: 'How many microplastics can we eat in a day?',
            subQuestion: 'What happens when architecture embraces programmed decomposition instead of petrochemical permanence?',
            summary: 'Situated in the historic Milli Reasürans Passage in Nişantaşı, BIO-DECAY confronts the invisible omnipresence of synthetic microplastics in everyday life. Structured around a permanent steel wire grid skeleton, the intervention establishes an organic archive, bio-materials fabrication lab, and civic amphitheater fueled by local restaurant food waste. Biopolymer panels cast from citrus peels, coffee grounds, and algae soften, darken, and biodegrade over time—inviting visitors to harvest, cast, and replace tiles in an ongoing cycle of material renewal.',
            disciplines: [
                'Bio-Material & Ecological',
                'Spatial Design',
                'Exhibition Design',
                'Experimental Design'
            ],
            keywords: ['Time', 'Transformation', 'Microplastics', 'Circular Biopolymers', 'Food Waste'],
            pole: 'experimental-thinking',
            poleLabel: 'Experimental Thinking',
            isClusterCore: true,
            star: {
                name: 'Celaeno',
                bayer: '16 Tauri',
                mag: '5.45 mag',
                role: 'Ülker Core Star · Circular Biopolymers'
            },
            awards: [
                '★ Biodesign Challenge 2025 — High Commendation'
            ],
            presentationStyle: 'architectural-gallery',
            url: './projects/bio-decay/',
            color: '#65a30d',
            heroImg: './assets/bio-decay-cover.png',
            heroCaption: 'BIO-DECAY — Steel Wire Grid Tectonics & Biopolymer Panel Lifecycle in Milli Reasürans Passage',
            gallery: [
                {
                    src: './assets/bio-decay-cover.png',
                    label: 'Hero Section',
                    caption: 'BIO-DECAY — Living Biopolymer Archive & Steel Grid Skeleton'
                },
                {
                    src: './projects/bio-decay/assets/crop-decay-stages-physical.png',
                    label: 'Material Samples',
                    caption: 'Physical Biopolymer Samples & Programmed Temporal Decay Stages'
                },
                {
                    src: './projects/bio-decay/assets/crop-exploded-axonometric.png',
                    label: 'Axonometric',
                    caption: 'Exploded Axonometric — Passage Integration, Lab & Amphitheater'
                },
                {
                    src: './projects/bio-decay/assets/crop-recipes-flowchart.png',
                    label: 'Waste Flowchart',
                    caption: 'Food-Waste Harvesting & Biopolymer Recipe Matrix'
                },
                {
                    src: './projects/bio-decay/assets/crop-render-view-a.png',
                    label: 'Interior View',
                    caption: 'Organic Archive & Modular Biopolymer Tile Replacement System'
                },
                {
                    src: './projects/bio-decay/assets/crop-detail-plan-section-1-50.png',
                    label: '1:50 Details',
                    caption: '1:50 Plan, Section & 1:20 Drying Rack Tectonic Detail'
                }
            ],
            researchStrands: [
                { label: 'Material Fabrication', value: 'Food-Waste Biopolymers · Physical Decay Testing · 1:20 Tectonic Details' },
                { label: 'Civic Ecology', value: 'Local Restaurant Waste Harvesting → On-Site Casting → Living Archive' },
                { label: 'Key Drawings & Assets', value: '4 Full Presentation Boards + PDFs · Physical Material Matrix · 1:50 / 1:20 Drawings' }
            ],
            relatedIds: ['sprouting-garden', 'the-earthen', 'stray']
        },
        {
            id: 'millieu',
            num: '05',
            title: 'MILLIEU',
            subtitle: 'Culinary Ritual, Spatial Branding & Neighborhood Memory in Yeldeğirmeni',
            year: '2026',
            location: 'Yeldeğirmeni, Kadıköy, Istanbul',
            studio: 'Interior Architecture & Spatial Branding Studio',
            typology: 'Culinary Interior, Bakery-Bistro & Social Amphitheater',
            medium: 'Spatial Design · Visual Communication · Custom Furniture',
            question: 'How does a culinary ritual shape a social atmosphere?',
            subQuestion: 'How can the historical memory of Yeldeğirmeni’s windmills translate into tectonic and graphic identity?',
            summary: 'Millieu (/mɪl\'ju:/) explores the intersection of culinary ritual, neighborhood memory, and interior architecture in Kadıköy’s historic Yeldeğirmeni ("Windmill") district. Reinterpreting the district’s grain-to-flour heritage through the communal ritual of baking and slicing quiche, the project translates the geometric intersection of windmill blades, pastry wedges, and the letterform "M" into a cohesive spatial and visual language—spanning burgundy tubular steel pergolas, a stepped social amphitheater, custom triangular furniture joinery, packaging, and typography.',
            disciplines: [
                'Spatial Design',
                'Architectural Design',
                'Visual Communication',
                'Exhibition Design'
            ],
            keywords: ['Culinary Interior', 'Spatial Branding', 'Amphitheatre', 'Custom Joinery', 'Yeldeğirmeni'],
            pole: 'contextual-research',
            poleLabel: 'Contextual Research',
            isClusterCore: false,
            star: null,
            awards: [],
            presentationStyle: 'architectural-gallery',
            url: './projects/millieu/',
            color: '#e11d48',
            heroImg: './assets/millieu-cover.png',
            heroCaption: 'Millieu — Stepped Social Amphitheater & Burgundy Steel Tectonics in Yeldeğirmeni',
            gallery: [
                {
                    src: './assets/millieu-cover.png',
                    label: 'Interior Hero',
                    caption: 'Millieu — Main Dining Hall & Burgundy Tubular Steel Structure'
                },
                {
                    src: './projects/millieu/assets/crop-sheet4-axonometric-section-cutaway.jpg',
                    label: 'Cutaway Axon',
                    caption: 'Axonometric Section Cutaway — Spatial Sequence & Mezzanine'
                },
                {
                    src: './projects/millieu/assets/crop-sheet1-branding-packaging-menu.jpg',
                    label: 'Spatial Branding',
                    caption: 'Visual Identity, Wedge Packaging System & Editorial Menu Design'
                },
                {
                    src: './projects/millieu/assets/crop-sheet2-render-view-l-amphitheater.jpg',
                    label: 'Amphitheater',
                    caption: 'Stepped Social Amphitheater for Communal Gathering'
                },
                {
                    src: './projects/millieu/assets/crop-sheet4-custom-furniture-lighting.jpg',
                    label: 'Custom Furniture',
                    caption: 'Custom Triangular Table Bases, Arched Lighting & Joinery Details'
                },
                {
                    src: './projects/millieu/assets/crop-sheet3-section-aa-transverse.jpg',
                    label: 'Section & Plan',
                    caption: 'Transverse Architectural Section A-A & Material Palette'
                }
            ],
            researchStrands: [
                { label: 'Contextual Translation', value: 'Yeldeğirmeni Windmill History × Quiche Wedge Geometry × "M" Grid' },
                { label: 'Cross-Disciplinary Scope', value: 'Interior Architecture · Custom Steel/Timber Furniture · Brand & Packaging System' },
                { label: 'Key Drawings & Assets', value: '5 Comprehensive Design Sheets · 1:50 Plans & Reflected Ceiling · Joinery Details' }
            ],
            relatedIds: ['bajo-la-fresca', 'sprouting-garden', 'ara-sira']
        },
        {
            id: 'bajo-la-fresca',
            num: '07',
            title: 'BAJO LA FRESCA',
            subtitle: 'Ephemeral Olfactory & Microclimatic Courtyard Installation in Córdoba',
            year: '2026',
            location: 'Patio San Basilio 44, Córdoba, Spain',
            studio: 'International Workshop & Realized Spatial Installation',
            typology: 'Ephemeral Courtyard Installation & Sensory Microclimate',
            medium: 'Spatial Installation · Bio-Sensory Textiles',
            question: 'How do you highlight beauty without stealing its spotlight?',
            subQuestion: 'How can a lightweight overhead intervention honor a UNESCO historic courtyard while reviving the evening ritual of tomar el fresco?',
            summary: 'Realized in Patio San Basilio 44 during the Fiesta de los Patios in Córdoba, Spain, Bajo la Fresca investigates the Andalusian socio-climatic ritual of tomar el fresco (gathering outdoors in the evening cool). Respecting strict heritage constraints on the historic walls and pebble floor, the installation suspends an undulating pleated canopy carrying gradient-dyed cotton petals infused with dried Andalusian orange and lemon peels and natural citronella—diffusing gentle citrus notes on evening convective breezes.',
            disciplines: [
                'Spatial Design',
                'Exhibition Design',
                'Bio-Material & Ecological',
                'Experimental Design'
            ],
            keywords: ['Climatic Comfort', 'Ephemeral Space', 'Ecology', 'Córdoba Patios', 'Olfactory Design'],
            pole: 'contextual-research',
            poleLabel: 'Contextual Research',
            isClusterCore: false,
            star: null,
            awards: [
                '✦ Realized 1:1 Installation — Fiesta de los Patios, Córdoba, Spain'
            ],
            presentationStyle: 'architectural-gallery',
            url: './projects/bajo-la-fresca/',
            color: '#ea580c',
            heroImg: './assets/bajo-la-fresca-hero.jpg',
            heroCaption: 'Bajo la Fresca — Realized Suspended Canopy in Patio San Basilio 44, Córdoba',
            gallery: [
                {
                    src: './assets/bajo-la-fresca-hero.jpg',
                    label: 'Courtyard View',
                    caption: 'Installed Pleated Canopy in Patio San Basilio 44, Córdoba'
                },
                {
                    src: './projects/bajo-la-fresca/assets/installation-hanging-scent-canopy.jpg',
                    label: 'Canopy Detail',
                    caption: 'Undulating Cotton Canopy Infused with Andalusian Citrus Peels & Citronella'
                },
                {
                    src: './projects/bajo-la-fresca/assets/concept-gradient-dot-matrix.jpg',
                    label: 'Color Matrix',
                    caption: 'Bougainvillea & Citrus Botanical Gradient Matrix'
                },
                {
                    src: './projects/bajo-la-fresca/assets/process-frayed-cotton-petals-tray.jpg',
                    label: 'Material Process',
                    caption: 'Hand-Dyed Cotton Petals & Botanical Infusion Fabrication'
                },
                {
                    src: './projects/bajo-la-fresca/assets/installation-patio-wide-team.jpg',
                    label: '1:1 Fabrication',
                    caption: 'On-Site Assembly & Community Gathering in Patio San Basilio 44'
                },
                {
                    src: './projects/bajo-la-fresca/assets/slide-04-tomar-el-fresco-community.jpg',
                    label: 'Tomar el Fresco',
                    caption: 'Socio-Climatic Research on the Evening Courtyard Ritual'
                }
            ],
            researchStrands: [
                { label: 'Heritage Sensitivity', value: 'Zero-Footprint Suspended Rigging in UNESCO Courtyard (1923)' },
                { label: 'Sensory Tectonics', value: 'Natural Dye Gradients · Citrus Peel & Citronella Olfactory Diffusion' },
                { label: 'Key Documentation', value: '30+ Fabrication, Site Forensics & Realized Installation Photographs' }
            ],
            relatedIds: ['sprouting-garden', 'the-earthen', 'millieu']
        },
        {
            id: 'sprouting-garden',
            num: '06',
            title: 'SPROUTING GARDEN',
            subtitle: 'Porous Timber Waffle Pavilion & Living Bean Trellis by Kuzguncuk Bostanı',
            year: '2024',
            location: 'Kuzguncuk, Üsküdar, Istanbul',
            studio: 'Architectural Design Studio',
            typology: 'Community Culinary Pavilion & Urban Agriculture Trellis',
            medium: 'Architectural Design · Timber Tectonics · Ecology',
            question: 'Can we build without displacing life?',
            subQuestion: 'How can a community pavilion cultivate, cook, and share native Kuzguncuk beans while weaving around existing trees and footpaths?',
            summary: 'Situated in a sloped public park beside the historic Kuzguncuk Bostanı in Üsküdar, Sprouting Garden is a shared-use community pavilion dedicated to cultivating, preparing, and serving a ritual culinary dish made from native bean varieties adapted to Kuzguncuk’s microclimate. Built as an open, perforated timber waffle structure bridging a 4.5-meter topographical shift (+18.00m to +22.50m), its porous skin acts as a living trellis for climbing bean vines while curving respectfully around mature park trees.',
            disciplines: [
                'Architectural Design',
                'Bio-Material & Ecological',
                'Spatial Design'
            ],
            keywords: ['Ecology', 'Living Architecture', 'Nonhuman', 'Timber Waffle', 'Kuzguncuk Bostanı'],
            pole: 'critical-inquiry',
            poleLabel: 'Critical Inquiry',
            isClusterCore: false,
            star: null,
            awards: [],
            presentationStyle: 'architectural-gallery',
            url: './projects/sprouting-garden/',
            color: '#16a34a',
            heroImg: './assets/sprouting-garden-cover.png',
            heroCaption: 'Sprouting Garden — Perforated Timber Waffle Pavilion & Living Bean Trellis in Kuzguncuk',
            gallery: [
                {
                    src: './assets/sprouting-garden-cover.png',
                    label: 'Atmosphere',
                    caption: 'Sprouting Garden — Porous Timber Pavilion Integrated with Park Canopy'
                },
                {
                    src: './projects/sprouting-garden/assets/diagram-exploded-axonometric.jpg',
                    label: 'Axonometric',
                    caption: 'Exploded Axonometric — Timber Waffle Grid & Climbing Bean Envelope'
                },
                {
                    src: './projects/sprouting-garden/assets/photo-physical-models.jpg',
                    label: 'Physical Model',
                    caption: 'Handcrafted Structural Timber Waffle & Topographical Site Model'
                },
                {
                    src: './projects/sprouting-garden/assets/diagram-culinary-ritual.jpg',
                    label: 'Culinary Cycle',
                    caption: 'Seed-to-Table Ritual: Cultivating, Harvesting, Cooking & Composting'
                },
                {
                    src: './projects/sprouting-garden/assets/drawing-sections.jpg',
                    label: 'Sections',
                    caption: 'Architectural Sections Bridging +18.00m to +22.50m Street Levels'
                },
                {
                    src: './projects/sprouting-garden/assets/drawing-floor-plans.jpg',
                    label: 'Floor Plans',
                    caption: 'Floor Plans — Permeable Pedestrian Passage & Communal Kitchen'
                }
            ],
            researchStrands: [
                { label: 'Non-Displacing Siting', value: 'Preserves All Existing Mature Trees & Street-to-Street Footpaths' },
                { label: 'Living Envelope', value: 'Perforated Timber Waffle Structure Serving as Seasonal Bean Trellis' },
                { label: 'Key Drawings & Assets', value: '2 Full Presentation Sheets · Physical Basswood Models · Ecological Diagrams' }
            ],
            relatedIds: ['bio-decay', 'bajo-la-fresca', 'wood-weave']
        },
        {
            id: 'wood-weave',
            num: '08',
            title: 'WOOD WEAVE',
            subtitle: 'Interlocking Market-Waste Timber Pavilion & Civic Workshop in Bursa',
            year: '2024',
            location: 'Historic Market District, Bursa',
            studio: 'Architectural & Participatory Design Studio',
            typology: 'Modular Civic Pavilion & Upcycling Workshop',
            medium: 'Spatial Design · Waste Architecture · Timber Joinery',
            question: 'When does waste become a place?',
            subQuestion: 'How can discarded market crates and agricultural surplus be woven into a customizable civic commons?',
            summary: 'Located beside the historic bazaar in Bursa, WOOD WEAVE transforms post-market waste into a participatory civic structure. Every Thursday morning following Wednesday’s bazaar, students and residents gather discarded wooden fruit crates and agricultural surplus—experimenting with interlocking 2-meter timber joinery, botanical drying, textile sewing, and sculpting to build a porous framework where vendors and neighbors can claim, adapt, and exhibit their own spatial territories.',
            disciplines: [
                'Architectural Design',
                'Spatial Design',
                'Bio-Material & Ecological',
                'Exhibition Design'
            ],
            keywords: ['Waste Architecture', 'Community', 'Making', 'Modular Timber', 'Bursa Bazaar'],
            pole: 'experimental-thinking',
            poleLabel: 'Experimental Thinking',
            isClusterCore: false,
            star: null,
            awards: [],
            presentationStyle: 'architectural-gallery',
            url: './projects/wood-weave/',
            color: '#d97706',
            heroImg: './assets/wood-weave-cover.png',
            heroCaption: 'WOOD WEAVE — Interlocking 2-Meter Timber Modules & Civic Exhibition Commons',
            gallery: [
                {
                    src: './assets/wood-weave-cover.png',
                    label: 'Pavilion View',
                    caption: 'WOOD WEAVE — Interlocking Timber Framework & Market Integration'
                },
                {
                    src: './projects/wood-weave/assets/sections-aa-bb.jpg',
                    label: 'Sections A-A / B-B',
                    caption: 'Architectural Sections Showing Multi-Level Exhibition & Workshop Zones'
                },
                {
                    src: './projects/wood-weave/assets/bubble-diagram.jpg',
                    label: 'Program Logic',
                    caption: 'Spatial Program & Post-Bazaar Upcycling Workflow Diagram'
                },
                {
                    src: './projects/wood-weave/assets/sheet_detail_3.jpg',
                    label: 'Tectonic Detail',
                    caption: 'Interlocking 2m Timber Module & Crate Repurposing Details'
                },
                {
                    src: './projects/wood-weave/assets/wood-weave-board-1.jpg',
                    label: 'Board 01',
                    caption: 'Full Architectural Presentation Board 01 — Site & Tectonic Strategy'
                },
                {
                    src: './projects/wood-weave/assets/wood-weave-board-2.jpg',
                    label: 'Board 02',
                    caption: 'Full Architectural Presentation Board 02 — Plans, Sections & Details'
                }
            ],
            researchStrands: [
                { label: 'Temporal Materiality', value: 'Wednesday Market Day → Thursday Crate Harvesting → Weekly Fabrication' },
                { label: 'Structural System', value: 'Interlocking 2.00m Timber Elements Creating Adaptable Spatial Intervals' },
                { label: 'Key Drawings & Assets', value: '2 Full Presentation Boards · Sections A-A, B-B, D-D · 10 Detail Plates' }
            ],
            relatedIds: ['ara-sira', 'sprouting-garden', 'bio-decay']
        },
        {
            id: 'ara-sira',
            num: '09',
            title: 'ARA-SIRA',
            subtitle: 'Dual-State Community Architecture & Editorial Spatial Publication',
            year: '2024',
            location: 'Istanbul',
            studio: 'Spatial & Editorial Design Studio',
            typology: 'Community Space, Modular Timber Thresholds & Editorial Book',
            medium: 'Editorial Design · Spatial Design · 1:1 Prototyping',
            question: 'Can one space hold both play and quiet?',
            subQuestion: 'How do modular timber thresholds negotiate collective energy and introverted solitude without permanent walls?',
            summary: 'ARA-SIRA ("From Time to Time / In-Between Rows") investigates dual-state spatial dynamics within community architecture: how a single architectural envelope can hold both exuberant collective play and quiet solitary reading. Documented through an editorial publication and full-scale timber joinery prototypes, the project designs porous seating-and-shade thresholds that let users recalibrate acoustic and visual intimacy throughout the day.',
            disciplines: [
                'Editorial Design',
                'Spatial Design',
                'Architectural Design',
                'Visual Communication'
            ],
            keywords: ['Play', 'Community', 'Construction', 'Editorial Publication', 'Timber Thresholds'],
            pole: 'contextual-research',
            poleLabel: 'Contextual Research',
            isClusterCore: false,
            star: null,
            awards: [],
            presentationStyle: 'architectural-gallery',
            url: './projects/ara-sira/',
            color: '#6366f1',
            heroImg: './assets/ara-sira-cover.jpg',
            heroCaption: 'ARA-SIRA — Modular Timber Thresholds Balancing Collective Play & Quiet Solitude',
            gallery: [
                {
                    src: './assets/ara-sira-cover.jpg',
                    label: 'Cover View',
                    caption: 'ARA-SIRA — Spatial Thresholds Between Active Play and Quiet Reading'
                },
                {
                    src: './projects/ara-sira/assets/ara-sira-hero-overview.jpg',
                    label: 'Overview',
                    caption: 'Overall Spatial Configuration & Modular Timber Frames'
                },
                {
                    src: './projects/ara-sira/assets/ara-sira-playground-facade.jpg',
                    label: 'Play Facade',
                    caption: 'Active Playground Facade & Climbing/Perching Timber Structure'
                },
                {
                    src: './projects/ara-sira/assets/ara-sira-reading-niche.jpg',
                    label: 'Reading Niche',
                    caption: 'Acoustic & Visual Refuge for Solitary Reading and Pause'
                },
                {
                    src: './projects/ara-sira/assets/ara-sira-timber-detail.jpg',
                    label: 'Timber Joinery',
                    caption: 'Tactile Timber Joinery & 1:1 Construction Assembly Detail'
                },
                {
                    src: './projects/ara-sira/assets/ara-sira-seating-shade.jpg',
                    label: 'Seating & Shade',
                    caption: 'Shared Seating Bench & Filtered Daylight Canopy'
                }
            ],
            researchStrands: [
                { label: 'Dual-State Spatiality', value: 'Negotiating Collective Play × Quiet Solitude in One Envelope' },
                { label: 'Mediums Explored', value: 'Editorial Design Publication · 1:1 Timber Construction · Spatial Thresholds' },
                { label: 'Key Documentation', value: '6 High-Resolution Tectonic, Facade & Interior Niche Studies' }
            ],
            relatedIds: ['wood-weave', 'millieu', 'stray']
        },
        {
            id: 'chronoclines',
            num: '04',
            title: 'CHRONOCLINES',
            subtitle: 'Generative Cartography & Urban Temporal Stratification',
            year: '2025',
            location: 'Urban Research / Generative Cartography',
            studio: 'Computational & Experimental Media Inquiry',
            typology: 'Generative Art, Urban Forensics & Exhibition Media',
            medium: 'Visual Communication · Generative Art · Exhibition Design',
            question: 'Can a city exhibit itself?',
            subQuestion: 'Can architectural representation function not as a static blueprint, but as an evolving geological and societal clock?',
            summary: 'CHRONOCLINES interrogates how an urban territory registers and exhibits its own temporal transformations. Combining algorithmic stratification, digital forensics, and archival cartography, the project translates historical topographical sedimentations, erased urban layers, and contemporary mobility flows into high-density visual artifacts—proposing the city itself as a self-curating exhibition.',
            disciplines: [
                'Visual Communication',
                'Exhibition Design',
                'Interactive & Simulation',
                'Experimental Design'
            ],
            keywords: ['Time', 'Transformation', 'Memory', 'Generative Cartography', 'Urban Strata'],
            pole: 'contextual-research',
            poleLabel: 'Contextual Research',
            isClusterCore: false,
            star: null,
            awards: [],
            presentationStyle: 'research-forensics',
            url: './projects/chronoclines/',
            color: '#ea580c',
            heroImg: './assets/chronoclines-cover.jpg',
            heroCaption: 'CHRONOCLINES — Generative Stratification of Urban Time & Topographical Memory',
            gallery: [
                {
                    src: './assets/chronoclines-cover.jpg',
                    label: 'Stratigraphy Map',
                    caption: 'CHRONOCLINES — Superimposition of Historical Urban Strata & Temporal Contours'
                }
            ],
            researchStrands: [
                { label: 'Core Method', value: 'Algorithmic Stratification · Archival Cartography · Temporal Contours' },
                { label: 'Exhibition Thesis', value: 'The City as Self-Exhibiting Palimpsest Rather Than Static Artifact' },
                { label: 'Visual Language', value: 'High-Density Topographical Linework & Temporal Isochrones' }
            ],
            relatedIds: ['you-were-here', 'emek-museum', 'fire-escape-simulation']
        },
        {
            id: 'you-were-here',
            num: '03',
            title: 'YOU WERE HERE.',
            subtitle: 'Live Participatory Digital Palimpsest & Cursor Telemetry Archive',
            year: '2026',
            location: 'Live Cloud Archive & Interactive Web Space',
            studio: 'Independent Experimental Spatial-Digital Inquiry',
            typology: 'Participatory Digital Monument & Live Cloud Archive',
            medium: 'Interactive & Simulation · Experimental Design · Visual Communication',
            question: 'What stays after we leave?',
            subQuestion: 'Can an anonymous digital cursor line possess the weight of physical presence and collective memory?',
            summary: 'YOU WERE HERE. transforms this portfolio website itself into an active topological sensorium. When a visitor grants consent, their involuntary cursor movements across the viewport are recorded as normalized coordinate vectors: kinetic velocity is inverted into stroke weight, while moments of reading hesitation bloom into translucent cerulean halos. Stored in a live Cloud Firebase Firestore archive, every visitor’s path is superimposed into an evolving collective palimpsest.',
            disciplines: [
                'Interactive & Simulation',
                'Experimental Design',
                'Visual Communication',
                'Exhibition Design'
            ],
            keywords: ['Digital Palimpsest', 'Presence', 'Collective Memory', 'Live Telemetry', 'Participatory Archive'],
            pole: 'critical-inquiry',
            poleLabel: 'Critical Inquiry',
            isClusterCore: true,
            star: {
                name: 'Alcyone / Practice Trace',
                bayer: 'η Tauri · Live Layer',
                mag: '2.87 mag',
                role: 'Ülker Living Palimpsest · Participatory Trace'
            },
            awards: [
                '✦ Live Participatory Cloud Archive — Active Across This Website'
            ],
            presentationStyle: 'live-participatory',
            url: './projects/you-were-here/',
            color: '#2563eb',
            heroImg: './assets/you-were-here-cover.png',
            heroCaption: 'YOU WERE HERE. — Superimposed Visitor Cursor Trajectories & Hesitation Halos (1:1 Vector-Raster Artifact)',
            gallery: [
                {
                    src: './assets/you-were-here-cover.png',
                    label: 'Trace Palimpsest',
                    caption: 'YOU WERE HERE. — Collective Superimposition of Anonymous Visitor Journeys'
                }
            ],
            researchStrands: [
                { label: 'Telemetry Encoding', value: 'Velocity → Inverted Stroke Weight · Cognitive Pause → Cerulean Halo' },
                { label: 'Architecture of Memory', value: 'Real-Time Cloud Firestore Sync + 1:1 Transparent PNG Artifact Export' },
                { label: 'Interactive Layer', value: 'Consent-Based Live Recording Running Directly on This Portfolio' }
            ],
            relatedIds: ['stray', 'chronoclines', 'emek-museum']
        },
        {
            id: 'emek-museum',
            num: '01',
            title: 'EMEK MUSEUM',
            subtitle: 'Counter-Monument & Spatial Forensics of Unseen Labor',
            year: '2026',
            location: 'Türkiye (Ongoing Spatial Research)',
            studio: 'Architectural Thesis & Critical Spatial Research',
            typology: 'Counter-Monument, Public Archive & Memorial Architecture',
            medium: 'Architectural Design · Exhibition Design · Spatial Justice',
            question: 'How can we make this labour visible again?',
            subQuestion: 'When workers lose their lives, why does the public narrative end with the accident while their labor and time vanish from view?',
            summary: 'Work-related accidents remain a persistent reality, particularly in Türkiye. Yet when workers lose their lives, public memory often reduces them to statistical casualties—erasing the hours they gave, the craft they practiced, and the worlds shaped through their labor. Emek Museum is an architectural counter-monument and spatial research initiative investigating how built space can restore visibility, dignity, and collective presence to unseen civic labor.',
            disciplines: [
                'Architectural Design',
                'Exhibition Design',
                'Spatial Design',
                'Experimental Design'
            ],
            keywords: ['Collective Memory', 'Narratives', 'Spatial Justice', 'Counter-Monument', 'Labor Forensics'],
            pole: 'critical-inquiry',
            poleLabel: 'Critical Inquiry',
            isClusterCore: true,
            star: {
                name: 'Maia',
                bayer: '20 Tauri',
                mag: '3.87 mag',
                role: 'Ülker Core Star · Spatial Justice & Memory'
            },
            awards: [
                '◈ Ongoing Architectural Research & Counter-Monument Initiative'
            ],
            presentationStyle: 'research-forensics',
            url: './projects/emek-museum/',
            color: '#0284c7',
            heroImg: './assets/emek-museum-wip.svg',
            heroCaption: 'EMEK MUSEUM — Spatial Research & Counter-Monument Framework (In Progress)',
            gallery: [
                {
                    src: './assets/emek-museum-wip.svg',
                    label: 'Research Dossier',
                    caption: 'EMEK MUSEUM — Ongoing Architectural Forensics & Counter-Monument Inquiry'
                }
            ],
            researchStrands: [
                { label: 'Critical Premise', value: 'Shifting Memorial Architecture from Passive Grief to Active Labor Visibility' },
                { label: 'Spatial Typology', value: 'Counter-Monument · Living Oral & Material Archive · Civic Forum' },
                { label: 'Dialectical Axis', value: 'Paired with Fire Escape Simulation (“Disaster Is Never Natural”)' }
            ],
            relatedIds: ['fire-escape-simulation', 'stray', 'you-were-here']
        },
        {
            id: 'fire-escape-simulation',
            num: '12',
            title: 'FIRE ESCAPE SIMULATION',
            subtitle: 'Agent-Based Behavioral Inquiry into Spatial Panic & Emergency Egress',
            year: '2026',
            location: 'Computational Spatial Research',
            studio: 'Behavioral Simulation & Spatial Forensics',
            typology: 'Agent-Based Evacuation Simulation & Code Critique',
            medium: 'Interactive & Simulation · Architectural Research',
            question: 'Can you escape the fire?',
            subQuestion: 'Do standardized building egress codes account for cognitive hesitation, smoke occlusion, and collective panic?',
            summary: 'FIRE ESCAPE SIMULATION is a computational behavioral inquiry investigating emergency crowd dynamics, exit route choices, and spatial panic under hazardous conditions. By modeling individual agent behaviors, visibility occlusions, corridor bottlenecks, and velocity drops during high-stress evacuation, the project critiques purely geometric building codes and exposes how spatial thresholds can either mitigate or amplify catastrophe.',
            disciplines: [
                'Interactive & Simulation',
                'Architectural Design',
                'Experimental Design'
            ],
            keywords: ['Egress Dynamics', 'Simulation', 'Spatial Panic', 'Agent-Based Modeling', 'Building Codes'],
            pole: 'contextual-research',
            poleLabel: 'Contextual Research',
            isClusterCore: true,
            star: {
                name: 'Asterope',
                bayer: '21 Tauri',
                mag: '5.76 mag',
                role: 'Ülker Core Star · Egress & Behavioral Forensics'
            },
            awards: [
                '◈ Ongoing Computational Simulation & Egress Forensics'
            ],
            presentationStyle: 'research-forensics',
            url: './projects/fire-escape-simulation/',
            color: '#dc2626',
            heroImg: './assets/fire-escape-wip.svg',
            heroCaption: 'FIRE ESCAPE SIMULATION — Agent-Based Egress & Bottleneck Forensics (In Progress)',
            gallery: [
                {
                    src: './assets/fire-escape-wip.svg',
                    label: 'Simulation Frame',
                    caption: 'FIRE ESCAPE SIMULATION — Multi-Agent Evacuation & Bottleneck Modeling'
                }
            ],
            researchStrands: [
                { label: 'Simulation Parameters', value: 'Multi-Agent Crowd Physics · Smoke Occlusion · Bottleneck Hesitation' },
                { label: 'Architectural Critique', value: 'Testing Static Regulatory Exit Ratios Against Real Human Panic Behavior' },
                { label: 'Dialectical Axis', value: 'Paired with Emek Museum (“Disaster Is Never Natural”)' }
            ],
            relatedIds: ['emek-museum', 'chronoclines', 'you-were-here']
        }
    ];

    window.EDITORIAL_PORTFOLIO_PROJECTS = EDITORIAL_PORTFOLIO_PROJECTS;

    // Map by slug for fast lookup
    const PROJECT_BY_ID = {};
    EDITORIAL_PORTFOLIO_PROJECTS.forEach(p => {
        PROJECT_BY_ID[p.id] = p;
    });

    // State
    let activeDiscipline = 'all';
    let activePole = null; // 'critical-inquiry' | 'contextual-research' | 'experimental-thinking' | null
    let activeView = 'editorial'; // 'editorial' | 'grid' | 'index'
    let searchQuery = '';

    // DOM References
    const disciplineButtons = Array.from(document.querySelectorAll('#ep-discipline-bar .ep-filter-pill'));
    const viewButtons = Array.from(document.querySelectorAll('.ep-view-btn'));
    const searchInput = document.getElementById('ep-project-search');
    const searchClearBtn = document.getElementById('ep-project-search-clear');
    const activeHeadingEl = document.getElementById('ep-active-filter-heading');
    const statusTextEl = document.getElementById('ep-filter-status-text');
    const resetFilterBtn = document.getElementById('ep-reset-filter-btn');

    // Compute and populate discipline counts in filter bar
    function updateDisciplineCounts() {
        const countElMap = {
            'all': document.getElementById('count-all'),
            'cluster-core': document.getElementById('count-cluster'),
            'Architectural Design': document.getElementById('count-arch'),
            'Spatial Design': document.getElementById('count-spatial'),
            'Bio-Material & Ecological': document.getElementById('count-bio'),
            'Exhibition Design': document.getElementById('count-exhibition'),
            'Interactive & Simulation': document.getElementById('count-interactive'),
            'Visual Communication': document.getElementById('count-viscomm'),
            'Editorial Design': document.getElementById('count-editorial'),
            'Experimental Design': document.getElementById('count-experimental')
        };

        Object.keys(countElMap).forEach(key => {
            const el = countElMap[key];
            if (!el) return;
            if (key === 'all') {
                el.textContent = String(EDITORIAL_PORTFOLIO_PROJECTS.length);
            } else if (key === 'cluster-core') {
                el.textContent = String(EDITORIAL_PORTFOLIO_PROJECTS.filter(p => p.isClusterCore).length);
            } else {
                const count = EDITORIAL_PORTFOLIO_PROJECTS.filter(p => p.disciplines.includes(key)).length;
                el.textContent = String(count);
            }
        });
    }

    function getFilteredProjects() {
        return EDITORIAL_PORTFOLIO_PROJECTS.filter(p => {
            if (activeDiscipline === 'cluster-core') {
                if (!p.isClusterCore) return false;
            } else if (activeDiscipline && activeDiscipline !== 'all') {
                if (!p.disciplines.includes(activeDiscipline)) return false;
            }

            if (activePole) {
                if (p.pole !== activePole) return false;
            }

            if (searchQuery.trim().length > 0) {
                const q = searchQuery.toLowerCase().trim();
                const haystack = [
                    p.title,
                    p.subtitle,
                    p.question,
                    p.subQuestion || '',
                    p.summary,
                    p.location,
                    p.year,
                    p.typology,
                    p.disciplines.join(' '),
                    p.keywords.join(' '),
                    p.star ? `${p.star.name} ${p.star.bayer}` : ''
                ].join(' ').toLowerCase();
                if (!haystack.includes(q)) return false;
            }

            return true;
        });
    }

    function updateFilterStatusBanner(filteredList) {
        const isFiltered = (activeDiscipline !== 'all') || !!activePole || (searchQuery.trim().length > 0);
        if (resetFilterBtn) {
            resetFilterBtn.classList.toggle('hidden', !isFiltered);
        }

        const poleNames = {
            'critical-inquiry': 'Vertex 01 · Critical Inquiry',
            'contextual-research': 'Vertex 02 · Contextual Research',
            'experimental-thinking': 'Vertex 03 · Experimental Thinking'
        };

        if (activeHeadingEl) {
            if (activePole && poleNames[activePole]) {
                activeHeadingEl.textContent = poleNames[activePole];
            } else if (activeDiscipline === 'cluster-core') {
                activeHeadingEl.textContent = '✦ Ülker (Pleiades) Core Cluster Works';
            } else if (activeDiscipline !== 'all') {
                activeHeadingEl.textContent = activeDiscipline;
            } else if (searchQuery.trim().length > 0) {
                activeHeadingEl.textContent = `Search Results: “${searchQuery.trim()}”`;
            } else {
                activeHeadingEl.textContent = 'All Works (12 Projects)';
            }
        }

        if (statusTextEl) {
            const countStr = `${filteredList.length} of ${EDITORIAL_PORTFOLIO_PROJECTS.length} projects`;
            if (!isFiltered) {
                statusTextEl.textContent = `Showing all ${EDITORIAL_PORTFOLIO_PROJECTS.length} projects across architectural, spatial, material, and computational inquiries — click any image or title to open the full project.`;
            } else {
                statusTextEl.textContent = `Showing ${countStr} matching your active selection.`;
            }
        }

        disciplineButtons.forEach(btn => {
            const d = btn.getAttribute('data-discipline');
            btn.classList.toggle('active', d === activeDiscipline && !activePole);
        });
    }

    // Render Editorial Monograph Card (View 1: Default)
    function renderEditorialCard(p, index) {
        const starBadgeHtml = p.star
            ? `<span class="ep-star-badge" data-cursor="dot"><span class="ep-star-glyph">&#x2726;</span> ${p.star.name.toUpperCase()} (${p.star.bayer})</span>`
            : '';

        const awardsHtml = (p.awards && p.awards.length > 0)
            ? p.awards.map(a => `<span class="ep-award-badge">${a}</span>`).join('')
            : '';

        const disciplineTagsHtml = p.disciplines.map(d => {
            const isActive = (activeDiscipline === d);
            return `<button type="button" class="ep-card-discipline-tag ${isActive ? 'is-active' : ''}" data-discipline-click="${d}" data-cursor="dot">${d}</button>`;
        }).join('');

        let galleryStripHtml = '';
        if (p.gallery && p.gallery.length > 1) {
            const thumbs = p.gallery.map((g, gIdx) => `
                <button type="button" class="ep-thumb-btn ${gIdx === 0 ? 'active' : ''}"
                        data-proj-id="${p.id}"
                        data-img-src="${g.src}"
                        data-img-caption="${g.caption.replace(/"/g, '&quot;')}"
                        aria-label="Preview ${g.label}">
                    <img src="${g.src}" alt="${p.title} — ${g.label}" loading="lazy" class="ep-no-auto-lightbox">
                    <span class="ep-thumb-label">${g.label}</span>
                </button>
            `).join('');
            galleryStripHtml = `
                <div class="ep-thumb-strip" role="region" aria-label="${p.title} visual plates">
                    ${thumbs}
                </div>
            `;
        }

        let strandsHtml = '';
        if (p.researchStrands && p.researchStrands.length > 0) {
            strandsHtml = `
                <div class="ep-strands-grid">
                    ${p.researchStrands.map(s => `
                        <div class="ep-strand-item">
                            <span class="ep-strand-label">${s.label}</span>
                            <span class="ep-strand-val">${s.value}</span>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        let relatedHtml = '';
        if (p.relatedIds && p.relatedIds.length > 0) {
            const relLinks = p.relatedIds
                .map(rId => PROJECT_BY_ID[rId])
                .filter(Boolean)
                .map(relProj => `<button type="button" class="ep-rel-jump-btn" data-jump-project="${relProj.id}" data-cursor="dot">${relProj.num}. ${relProj.title}</button>`)
                .join('');
            relatedHtml = `
                <div class="ep-card-relations">
                    <span class="ep-rel-label">CLUSTER DIALOGUE:</span>
                    <div class="ep-rel-pills">${relLinks}</div>
                </div>
            `;
        }

        return `
            <article class="ep-project-monograph ep-style-${p.presentationStyle} ${index % 2 === 1 ? 'ep-layout-alt' : ''}"
                     id="ep-project-${p.id}"
                     data-project-id="${p.id}"
                     style="--proj-accent: ${p.color};">
                
                <!-- Left / Top: Prominent Visual Stage -->
                <div class="ep-media-column">
                    <div class="ep-main-figure">
                        <a href="${p.url}" class="ep-main-media-link" data-project-nav="${p.id}" aria-label="Open ${p.title} full project">
                            <img src="${p.heroImg}"
                                 alt="${p.title} — ${p.subtitle}"
                                 class="ep-main-img ep-no-auto-lightbox"
                                 id="ep-main-img-${p.id}"
                                 loading="${index < 2 ? 'eager' : 'lazy'}">
                            <span class="ep-media-open-badge">OPEN FULL PROJECT &rarr;</span>
                        </a>
                        <div class="ep-figure-caption-bar">
                            <span class="ep-figure-caption-text" id="ep-caption-${p.id}">${p.heroCaption}</span>
                            <button type="button" class="ep-zoom-btn" data-zoom-project="${p.id}" aria-label="Enlarge current image fullscreen">
                                &#x2922; FULLSCREEN
                            </button>
                        </div>
                    </div>
                    ${galleryStripHtml}
                </div>

                <!-- Right / Bottom: Editorial Narrative, Question, Classification & Actions -->
                <div class="ep-content-column">
                    <div class="ep-card-topline">
                        <span class="ep-proj-index">NO. ${p.num}</span>
                        <span class="ep-proj-year-loc">${p.year} &bull; ${p.location}</span>
                        <button type="button" class="ep-pole-pill" data-pole-click="${p.pole}" data-cursor="dot">${p.poleLabel}</button>
                        ${starBadgeHtml}
                    </div>

                    ${awardsHtml ? `<div class="ep-awards-row">${awardsHtml}</div>` : ''}

                    <h3 class="ep-proj-title">
                        <a href="${p.url}" data-project-nav="${p.id}">${p.title}</a>
                    </h3>
                    <p class="ep-proj-subtitle">${p.subtitle}</p>

                    <blockquote class="ep-proj-question-box">
                        <span class="ep-question-kicker">CORE INQUIRY</span>
                        <p class="ep-question-main">&ldquo;${p.question}&rdquo;</p>
                        ${p.subQuestion ? `<p class="ep-question-sub">${p.subQuestion}</p>` : ''}
                    </blockquote>

                    <p class="ep-proj-summary">${p.summary}</p>

                    ${strandsHtml}

                    <div class="ep-card-disciplines-wrap">
                        <span class="ep-disciplines-label">DISCIPLINES:</span>
                        <div class="ep-card-disciplines">${disciplineTagsHtml}</div>
                    </div>

                    ${relatedHtml}

                    <div class="ep-card-actions">
                        <a href="${p.url}" class="ep-btn-open-project" data-project-nav="${p.id}">
                            <span>EXPLORE FULL PROJECT</span>
                            <span class="ep-btn-arrow">&rarr;</span>
                        </a>
                        <button type="button" class="ep-btn-quick-read" data-quick-read="${p.id}">
                            QUICK READ (EN / TR)
                        </button>
                    </div>
                </div>
            </article>
        `;
    }

    // Render Visual Grid Card (View 2: Compact Grid)
    function renderGridCard(p) {
        const starBadge = p.star
            ? `<span class="ep-grid-star">&#x2726; ${p.star.name}</span>`
            : '';

        const disciplineTags = p.disciplines.map(d =>
            `<button type="button" class="ep-card-discipline-tag" data-discipline-click="${d}" data-cursor="dot">${d}</button>`
        ).join('');

        return `
            <article class="ep-grid-card" id="ep-project-${p.id}" data-project-id="${p.id}" style="--proj-accent: ${p.color};">
                <a href="${p.url}" class="ep-grid-card-link" data-project-nav="${p.id}">
                    <div class="ep-grid-media-wrap">
                        <img src="${p.heroImg}" alt="${p.title}" loading="lazy" class="ep-grid-img ep-no-auto-lightbox">
                        <span class="ep-grid-num">${p.num}</span>
                        ${starBadge}
                    </div>
                </a>
                <div class="ep-grid-body">
                    <div class="ep-grid-meta">
                        <span>${p.year} &bull; ${p.location}</span>
                        <span class="ep-grid-pole">${p.poleLabel}</span>
                    </div>
                    <h3 class="ep-grid-title">
                        <a href="${p.url}" data-project-nav="${p.id}">${p.title}</a>
                    </h3>
                    <p class="ep-grid-question">&ldquo;${p.question}&rdquo;</p>
                    <p class="ep-grid-summary">${p.summary}</p>
                    <div class="ep-grid-tags">${disciplineTags}</div>
                    <div class="ep-grid-footer">
                        <a href="${p.url}" class="ep-grid-open-link" data-project-nav="${p.id}">OPEN PROJECT &rarr;</a>
                        <button type="button" class="ep-grid-quick-btn" data-quick-read="${p.id}">EN / TR</button>
                    </div>
                </div>
            </article>
        `;
    }

    // Render Architectural Index Table (View 3: Index & Relations)
    function renderIndexTable(list) {
        const rows = list.map(p => {
            const starText = p.star ? `✦ ${p.star.name} (${p.star.bayer})` : 'Constellation Field';
            const tags = p.disciplines.map(d =>
                `<button type="button" class="ep-index-tag" data-discipline-click="${d}" data-cursor="dot">${d}</button>`
            ).join('');

            return `
                <tr class="ep-index-row" id="ep-project-${p.id}" data-project-id="${p.id}" style="--proj-accent: ${p.color};">
                    <td class="ep-idx-num">${p.num}</td>
                    <td class="ep-idx-thumb">
                        <a href="${p.url}" data-project-nav="${p.id}" class="ep-main-media-link">
                            <img src="${p.heroImg}" alt="${p.title}" loading="lazy" class="ep-no-auto-lightbox">
                        </a>
                    </td>
                    <td class="ep-idx-title">
                        <a href="${p.url}" data-project-nav="${p.id}" class="ep-idx-title-link">${p.title}</a>
                        <span class="ep-idx-sub">${p.subtitle}</span>
                    </td>
                    <td class="ep-idx-question">&ldquo;${p.question}&rdquo;</td>
                    <td class="ep-idx-disciplines"><div class="ep-idx-tag-wrap">${tags}</div></td>
                    <td class="ep-idx-cluster">
                        <span class="ep-idx-star">${starText}</span>
                        <span class="ep-idx-pole">${p.poleLabel}</span>
                    </td>
                    <td class="ep-idx-year">${p.year}<br><small>${p.location}</small></td>
                    <td class="ep-idx-action">
                        <a href="${p.url}" class="ep-idx-open-btn" data-project-nav="${p.id}">OPEN &rarr;</a>
                    </td>
                </tr>
            `;
        }).join('');

        return `
            <div class="ep-index-table-wrap">
                <table class="ep-index-table">
                    <thead>
                        <tr>
                            <th>NO</th>
                            <th>VISUAL</th>
                            <th>PROJECT &amp; TYPOLOGY</th>
                            <th>CORE SPATIAL QUESTION</th>
                            <th>DISCIPLINES</th>
                            <th>ÜLKER / POLE</th>
                            <th>YEAR / SITE</th>
                            <th>ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows}
                    </tbody>
                </table>
            </div>
        `;
    }

    function renderProjectsStage() {
        const filtered = getFilteredProjects();
        updateFilterStatusBanner(filtered);

        stageEl.setAttribute('data-view-mode', activeView);

        if (filtered.length === 0) {
            stageEl.innerHTML = `
                <div class="ep-empty-state">
                    <p class="ep-empty-title">No projects match the current filter or search query.</p>
                    <button type="button" class="ep-btn-reset-empty" id="ep-empty-reset-btn">Show All 12 Projects</button>
                </div>
            `;
            const emptyResetBtn = document.getElementById('ep-empty-reset-btn');
            if (emptyResetBtn) {
                emptyResetBtn.addEventListener('click', resetAllFilters);
            }
            return;
        }

        if (activeView === 'editorial') {
            stageEl.innerHTML = `<div class="ep-editorial-list">${filtered.map((p, i) => renderEditorialCard(p, i)).join('')}</div>`;
        } else if (activeView === 'grid') {
            stageEl.innerHTML = `<div class="ep-grid-list">${filtered.map(p => renderGridCard(p)).join('')}</div>`;
        } else {
            stageEl.innerHTML = renderIndexTable(filtered);
        }
    }

    function resetAllFilters() {
        activeDiscipline = 'all';
        activePole = null;
        searchQuery = '';
        if (searchInput) searchInput.value = '';
        if (searchClearBtn) searchClearBtn.classList.add('hidden');
        renderProjectsStage();
    }

    // Open Bilingual Quick Read Modal (#project-modal) without leaving the page
    function openQuickReadModal(projectId) {
        const p = PROJECT_BY_ID[projectId];
        if (!p) return;

        const modal = document.getElementById('project-modal');
        if (!modal) return;

        const mCat = document.getElementById('m-cat');
        const mYear = document.getElementById('m-year');
        const mTitle = document.getElementById('m-title');
        const mQuestion = document.getElementById('m-question');
        const mDescEn = document.getElementById('m-desc-en');
        const mDescTr = document.getElementById('m-desc-tr');
        const mTags = document.getElementById('m-tags');
        const mLink = document.getElementById('m-link');
        const mVisualStage = document.getElementById('m-visual-stage');

        const cardStoreEl = document.querySelector(`#project-cards-store .project-card[data-id="${p.id}"]`);
        const enHtml = cardStoreEl?.querySelector('.card-detail-en')?.innerHTML || `<p>${p.summary}</p>`;
        const trHtml = cardStoreEl?.querySelector('.card-detail-tr')?.innerHTML || `<p>${p.summary}</p>`;

        if (mCat) mCat.textContent = p.disciplines.join(' · ');
        if (mYear) mYear.textContent = `${p.year} — ${p.location}`;
        if (mTitle) mTitle.textContent = p.title;
        if (mQuestion) mQuestion.textContent = `“${p.question}”`;
        if (mDescEn) mDescEn.innerHTML = enHtml;
        if (mDescTr) mDescTr.innerHTML = trHtml;

        if (mTags) {
            mTags.innerHTML = p.disciplines.map(d => `<span class="tag">${d}</span>`).join('') +
                p.keywords.map(k => `<span class="tag">#${k}</span>`).join('');
        }

        if (mLink) {
            mLink.setAttribute('href', p.url);
        }

        if (mVisualStage) {
            const galleryImgs = (p.gallery && p.gallery.length > 0) ? p.gallery : [{ src: p.heroImg, caption: p.heroCaption }];
            mVisualStage.innerHTML = `
                <div class="ep-modal-gallery">
                    ${galleryImgs.map(g => `
                        <figure class="ep-modal-figure">
                            <img src="${g.src}" alt="${p.title}" loading="lazy">
                            <figcaption>${g.caption}</figcaption>
                        </figure>
                    `).join('')}
                </div>
            `;
        }

        window.lastOpenedProjectSlug = p.id;
        if (typeof window.toggleModalLang === 'function') {
            window.toggleModalLang('en');
        }

        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
    window.openQuickReadModal = openQuickReadModal;

    function jumpToProjectCard(projectId) {
        if (!PROJECT_BY_ID[projectId]) return;
        let targetEl = document.getElementById(`ep-project-${projectId}`);
        if (!targetEl) {
            resetAllFilters();
            targetEl = document.getElementById(`ep-project-${projectId}`);
        }
        if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            targetEl.classList.remove('ep-flash-highlight');
            void targetEl.offsetWidth;
            targetEl.classList.add('ep-flash-highlight');
            setTimeout(() => {
                targetEl.classList.remove('ep-flash-highlight');
            }, 2400);
        }
    }
    window.jumpToProjectCard = jumpToProjectCard;

    window.filterByPole = function(poleKey) {
        activePole = poleKey;
        activeDiscipline = 'all';
        renderProjectsStage();
        const anchor = document.getElementById('ep-projects-anchor');
        if (anchor) {
            anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    disciplineButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const selected = btn.getAttribute('data-discipline') || 'all';
            activePole = null;
            if (activeDiscipline === selected && selected !== 'all') {
                activeDiscipline = 'all';
            } else {
                activeDiscipline = selected;
            }
            renderProjectsStage();
        });
    });

    if (resetFilterBtn) {
        resetFilterBtn.addEventListener('click', resetAllFilters);
    }

    viewButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const v = btn.getAttribute('data-view') || 'editorial';
            activeView = v;
            viewButtons.forEach(b => {
                const isMatch = b.getAttribute('data-view') === v;
                b.classList.toggle('active', isMatch);
                b.setAttribute('aria-selected', isMatch ? 'true' : 'false');
            });
            renderProjectsStage();
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value || '';
            if (searchClearBtn) {
                searchClearBtn.classList.toggle('hidden', searchQuery.trim().length === 0);
            }
            renderProjectsStage();
        });
    }

    if (searchClearBtn) {
        searchClearBtn.addEventListener('click', () => {
            searchQuery = '';
            if (searchInput) searchInput.value = '';
            searchClearBtn.classList.add('hidden');
            renderProjectsStage();
        });
    }

    stageEl.addEventListener('click', (e) => {
        // 1. Thumbnail switch
        const thumbBtn = e.target.closest('.ep-thumb-btn');
        if (thumbBtn) {
            e.preventDefault();
            e.stopPropagation();
            const projId = thumbBtn.getAttribute('data-proj-id');
            const newSrc = thumbBtn.getAttribute('data-img-src');
            const newCap = thumbBtn.getAttribute('data-img-caption');
            const mainImg = document.getElementById(`ep-main-img-${projId}`);
            const capEl = document.getElementById(`ep-caption-${projId}`);
            if (mainImg && newSrc) {
                mainImg.src = newSrc;
            }
            if (capEl && newCap) {
                capEl.textContent = newCap;
            }
            const strip = thumbBtn.closest('.ep-thumb-strip');
            if (strip) {
                strip.querySelectorAll('.ep-thumb-btn').forEach(b => b.classList.remove('active'));
            }
            thumbBtn.classList.add('active');
            return;
        }

        // 2. Fullscreen Zoom button
        const zoomBtn = e.target.closest('.ep-zoom-btn');
        if (zoomBtn) {
            e.preventDefault();
            e.stopPropagation();
            const projId = zoomBtn.getAttribute('data-zoom-project');
            const mainImg = document.getElementById(`ep-main-img-${projId}`);
            if (mainImg && typeof window.openUniversalFullscreenImage === 'function') {
                window.openUniversalFullscreenImage(mainImg.currentSrc || mainImg.src);
            }
            return;
        }

        // 3. Quick Read (EN/TR) button
        const quickBtn = e.target.closest('[data-quick-read]');
        if (quickBtn) {
            e.preventDefault();
            e.stopPropagation();
            const projId = quickBtn.getAttribute('data-quick-read');
            openQuickReadModal(projId);
            return;
        }

        // 4. Inline discipline tag click
        const discBtn = e.target.closest('[data-discipline-click]');
        if (discBtn) {
            e.preventDefault();
            e.stopPropagation();
            const d = discBtn.getAttribute('data-discipline-click');
            if (d) {
                activePole = null;
                activeDiscipline = (activeDiscipline === d) ? 'all' : d;
                renderProjectsStage();
                const anchor = document.getElementById('ep-projects-anchor');
                if (anchor) anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            return;
        }

        // 5. Pole pill click
        const poleBtn = e.target.closest('[data-pole-click]');
        if (poleBtn) {
            e.preventDefault();
            e.stopPropagation();
            const pole = poleBtn.getAttribute('data-pole-click');
            if (pole) {
                window.filterByPole(pole);
            }
            return;
        }

        // 6. Related project jump click
        const relJumpBtn = e.target.closest('[data-jump-project]');
        if (relJumpBtn) {
            e.preventDefault();
            e.stopPropagation();
            const targetId = relJumpBtn.getAttribute('data-jump-project');
            jumpToProjectCard(targetId);
            return;
        }

        // 7. Save active filter & view state when navigating to a project page
        const projNavLink = e.target.closest('[data-project-nav]');
        if (projNavLink) {
            try {
                sessionStorage.setItem('portfolio_return_discipline', activeDiscipline);
                sessionStorage.setItem('portfolio_return_view', activeView);
                sessionStorage.setItem('portfolio_return_pole', activePole || '');
            } catch (_) {}
        }
    });

    // Event Listeners: Ülker SVG Star Points & Cluster Jump Links in Hero
    document.querySelectorAll('.ep-star-point[data-star-target], .ep-cluster-jump[data-jump-project]').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = el.getAttribute('data-star-target') || el.getAttribute('data-jump-project');
            if (targetId) {
                jumpToProjectCard(targetId);
            }
        });
    });

    // Restore saved discipline/view filter if returning from a project page
    try {
        const savedDisc = sessionStorage.getItem('portfolio_return_discipline');
        const savedView = sessionStorage.getItem('portfolio_return_view');
        const savedPole = sessionStorage.getItem('portfolio_return_pole');
        if (savedDisc) {
            activeDiscipline = savedDisc;
            sessionStorage.removeItem('portfolio_return_discipline');
        }
        if (savedView && ['editorial', 'grid', 'index'].includes(savedView)) {
            activeView = savedView;
            viewButtons.forEach(b => {
                const isMatch = b.getAttribute('data-view') === activeView;
                b.classList.toggle('active', isMatch);
                b.setAttribute('aria-selected', isMatch ? 'true' : 'false');
            });
            sessionStorage.removeItem('portfolio_return_view');
        }
        if (savedPole) {
            activePole = savedPole;
            sessionStorage.removeItem('portfolio_return_pole');
        }
    } catch (_) {}

    // Initial render
    updateDisciplineCounts();
    renderProjectsStage();
});
