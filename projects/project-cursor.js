// =========================================================
// ELIFSU GENÇ PORTFOLIO — PROJECT PAGES UNIFIED CUSTOM CURSOR
// Hardware-accelerated 60+ FPS smooth tracking with GPU layer
// Complete suppression of native cursor and scroll-glitch protection
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
            document.documentElement.appendChild(cursorWrapper);
        } else if (cursorWrapper.parentElement !== document.documentElement) {
            // Crucial: Mount directly to documentElement (<html>)
            // This prevents ANY body transform or scroll offset from ever affecting the fixed position!
            document.documentElement.appendChild(cursorWrapper);
        }

        if (!customCursor) {
            customCursor = document.createElement('div');
            customCursor.id = 'custom-cursor';
            cursorWrapper.appendChild(customCursor);
        }

        // Clean up any stray text/label elements inside cursor wrapper
        const strayLabels = cursorWrapper.querySelectorAll('#cursor-label, .cursor-label');
        strayLabels.forEach(el => el.remove());

        // Start hidden until user moves mouse
        cursorWrapper.style.opacity = '0';
        cursorWrapper.style.transition = 'opacity 0.2s ease';

        let cursorX = -100;
        let cursorY = -100;
        let ticking = false;

        function updatePosition() {
            cursorWrapper.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
            ticking = false;
        }

        window.addEventListener('mousemove', (e) => {
            cursorX = e.clientX;
            cursorY = e.clientY;
            if (cursorWrapper.style.opacity !== '1') {
                cursorWrapper.style.opacity = '1';
            }
            if (!ticking) {
                requestAnimationFrame(updatePosition);
                ticking = true;
            }
        }, { passive: true });

        // On scroll: maintain exact viewport position and re-evaluate hover element
        window.addEventListener('scroll', () => {
            if (cursorX >= 0 && cursorY >= 0) {
                if (!ticking) {
                    requestAnimationFrame(updatePosition);
                    ticking = true;
                }
                const el = document.elementFromPoint(cursorX, cursorY);
                if (el && el.closest(interactiveSelector)) {
                    customCursor.classList.add('cursor-hover');
                } else {
                    customCursor.classList.remove('cursor-hover');
                }
            }
        }, { passive: true });

        // Hide when mouse exits window
        document.addEventListener('mouseleave', () => {
            cursorWrapper.style.opacity = '0';
        });

        document.addEventListener('mouseenter', () => {
            if (cursorX >= 0 && cursorY >= 0) {
                cursorWrapper.style.opacity = '1';
            }
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
            '.board-btn',
            '.lang-btn',
            '.lang-pill',
            '.lang-tab-btn',
            '.era-tab-btn',
            '.lightbox-close-btn',
            '.wwh-reopen-circle',
            '#wwh-reopen-circle',
            '.wwh-live-indicator',
            '#wwh-live-indicator',
            '.wwh-consent-popup',
            '#wwh-consent-popup',
            '.wwh-btn',
            '.wwh-btn-yes',
            '.wwh-btn-no',
            '.wwh-btn-learn'
        ].join(', ');

        // Event delegation for rock-solid hover states across dynamic and static elements
        document.addEventListener('mouseover', (e) => {
            if (e.target && e.target.closest && e.target.closest(interactiveSelector)) {
                customCursor.classList.add('cursor-hover');
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (e.target && e.target.closest && e.target.closest(interactiveSelector)) {
                customCursor.classList.remove('cursor-hover');
            }
        });
    }

    // =========================================================
    // UNIVERSAL SAFE RETURN TO PREVIOUS PAGE
    // Always returns to whatever previous page/view the user came from
    // =========================================================
    window.handleProjectReturn = function(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        const referrer = document.referrer;
        let isInternal = false;
        if (referrer) {
            try {
                const refUrl = new URL(referrer, window.location.href);
                if (refUrl.origin === window.location.origin ||
                    (window.location.protocol === 'file:' && referrer.includes('elifsugenc'))) {
                    isInternal = true;
                }
            } catch (err) {
                if (referrer.indexOf(window.location.host) !== -1) {
                    isInternal = true;
                }
            }
        }

        // If visited from within the portfolio and history exists, go back
        if (isInternal && window.history.length > 1) {
            window.history.back();
            return;
        }

        // If history has entries (fallback with timeout in case of strict privacy/referrer)
        if (window.history.length > 1) {
            const currentLoc = window.location.href;
            window.history.back();
            setTimeout(function() {
                if (window.location.href === currentLoc) {
                    window.location.href = '../../';
                }
            }, 300);
            return;
        }

        // Default root landing fallback
        window.location.href = '../../';
    };

    // Event delegation for all return links on project pages
    document.addEventListener('click', function(e) {
        const btn = e.target.closest('.back-link, .back-btn, .footer-nav-btn, .footer-back-link, .pnav-center-btn, .center-directory-btn');
        if (btn) {
            const href = btn.getAttribute('href') || '';
            if (href.includes('../') || href.includes('#constellation') || href === '#' || href === '') {
                window.handleProjectReturn(e);
            }
        }
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initProjectCursor);
    } else {
        initProjectCursor();
    }
})();

