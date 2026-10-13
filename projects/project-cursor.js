// =========================================================
// ELIFSU GENÇ PORTFOLIO — PROJECT PAGES UNIFIED CUSTOM CURSOR
// Hardware-accelerated 60+ FPS smooth tracking with GPU layer
// Complete suppression of native cursor and double-cursor glitching
// =========================================================

(function() {
    'use strict';

    if (window.__portfolioProjectCursorInitialized) return;
    window.__portfolioProjectCursorInitialized = true;

    function initProjectCursor() {
        let cursorWrapper = document.getElementById('cursor-wrapper');
        let customCursor = document.getElementById('custom-cursor');

        // Dynamically ensure DOM elements exist
        if (!cursorWrapper) {
            cursorWrapper = document.createElement('div');
            cursorWrapper.id = 'cursor-wrapper';
            document.body.appendChild(cursorWrapper);
        }

        if (!customCursor) {
            customCursor = document.createElement('div');
            customCursor.id = 'custom-cursor';
            cursorWrapper.appendChild(customCursor);
        }

        // Clean up any stray text/label elements inside cursor wrapper
        const strayLabels = cursorWrapper.querySelectorAll('#cursor-label, .cursor-label');
        strayLabels.forEach(el => el.remove());

        let cursorX = window.innerWidth / 2;
        let cursorY = window.innerHeight / 2;
        let ticking = false;

        function updatePosition() {
            cursorWrapper.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
            ticking = false;
        }

        window.addEventListener('mousemove', (e) => {
            cursorX = e.clientX;
            cursorY = e.clientY;
            if (cursorWrapper.style.opacity === '0') {
                cursorWrapper.style.opacity = '1';
            }
            if (!ticking) {
                requestAnimationFrame(updatePosition);
                ticking = true;
            }
        }, { passive: true });

        // Hide when mouse exits window
        document.addEventListener('mouseleave', () => {
            cursorWrapper.style.opacity = '0';
        });

        document.addEventListener('mouseenter', () => {
            cursorWrapper.style.opacity = '1';
        });

        // Interactive elements selector
        const interactiveSelector = [
            'a',
            'button',
            'input',
            'select',
            'textarea',
            '[role="button"]',
            '.back-link',
            '.back-btn',
            '.footer-nav-btn',
            '.pnav-link',
            '.pnav-center-btn',
            '.center-directory-btn',
            '.zoomable-image-container',
            '.board-card',
            '.board-item',
            '.render-card',
            '.render-gal-card',
            '.drawing-card',
            '.drawing-item',
            '.drawing-viewer',
            '.gallery-card',
            '.content-card',
            '.refuge-item-card',
            '.pillar-card',
            '.material-card',
            '.material-photo-card',
            '.detail-col',
            '.recipe-diagram-card',
            '.tectonic-sub-card',
            '.hero-visual-card',
            '.lang-btn',
            '.lang-pill',
            '.lang-tab-btn',
            '.lightbox-close-btn',
            '.lightbox-modal',
            '.lightbox-trigger',
            '.artifact-frame'
        ].join(', ');

        // Event delegation for rock-solid hover states across dynamic and static elements
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest(interactiveSelector)) {
                customCursor.classList.add('cursor-hover');
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (e.target.closest(interactiveSelector)) {
                customCursor.classList.remove('cursor-hover');
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initProjectCursor);
    } else {
        initProjectCursor();
    }
})();
