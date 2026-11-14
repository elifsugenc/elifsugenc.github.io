// =========================================================
// ELIFSU GENÇ PORTFOLIO — PROJECT PAGES UNIFIED CUSTOM CURSOR
// Hardware-accelerated 60+ FPS smooth tracking with GPU layer
// Complete suppression of native cursor and scroll-glitch protection
// =========================================================

(function() {
    'use strict';

    if (window.__portfolioProjectCursorInitialized) return;
    window.__portfolioProjectCursorInitialized = true;

    // Dynamically ensure project-related.js is loaded
    if (!document.querySelector('script[src*="project-related.js"]')) {
        const relScript = document.createElement('script');
        relScript.src = '../project-related.js';
        relScript.defer = true;
        document.head.appendChild(relScript);
    }

    // Ensure clean URLs on all project pages (strip trailing /index.html and any ?from=... parameters)
    try {
        const searchParams = new URLSearchParams(window.location.search);
        const fromParam = searchParams.get('from');
        if (fromParam) {
            sessionStorage.setItem('portfolio_return_origin', fromParam);
        }
        if (window.location.search || window.location.pathname.endsWith('/index.html')) {
            const cleanPath = window.location.pathname.replace(/\/index\.html$/, '/');
            window.history.replaceState(null, '', cleanPath + window.location.hash);
        }
    } catch (_) {}

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

        // Image elements selector — triggers solid blue dot expansion (NO question mark, NO hollow ring)
        const imageSelector = [
            'img:not(.brand-logo-gif):not([src*="favicon"])',
            '.zoomable-image-container',
            '.board-compact-card',
            '.recipe-diagram-card',
            '.visual-feature-plate',
            '.visual-plate',
            '.tech-card',
            '.dual-card',
            '.render-quad-card',
            '.hero-visual-card',
            '.tectonic-image-panel',
            '.diag-card',
            '.board-item',
            '.visual-frame',
            '.image-lightbox',
            '.lightbox-overlay',
            '.lightbox-modal',
            '#universal-lightbox',
            '.lightbox-img-wrapper',
            '.lightbox-content-box',
            '#lightbox-img',
            '.lightbox-img'
        ].join(', ');

        // Interactive UI elements selector (buttons, navigation links, tabs, form controls)
        const interactiveSelector = [
            'a',
            'button',
            'input',
            'select',
            'textarea',
            '[role="button"]',
            '.vocab-term',
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

        function updateCursorHoverState(target) {
            if (!target || !target.closest) {
                customCursor.classList.remove('cursor-hover', 'cursor-img-hover');
                return;
            }
            if (target.closest(imageSelector)) {
                customCursor.classList.remove('cursor-hover');
                customCursor.classList.add('cursor-img-hover');
            } else if (target.closest(interactiveSelector)) {
                customCursor.classList.remove('cursor-img-hover');
                customCursor.classList.add('cursor-hover');
            } else {
                customCursor.classList.remove('cursor-hover', 'cursor-img-hover');
            }
        }

        // On scroll: position:fixed keeps cursor locked to screen. Zero forced layout reflows!
        window.addEventListener('scroll', () => {
            // Hover states update naturally via mouseover/mousemove without layout thrashing
        }, { passive: true });

        // Hide when mouse exits window
        document.addEventListener('mouseleave', () => {
            cursorWrapper.style.opacity = '0';
            customCursor.classList.remove('cursor-hover', 'cursor-img-hover');
        });

        document.addEventListener('mouseenter', () => {
            if (cursorX >= 0 && cursorY >= 0) {
                cursorWrapper.style.opacity = '1';
            }
        });

        // Event delegation for rock-solid hover states across dynamic and static elements
        document.addEventListener('mouseover', (e) => {
            if (e.target && e.target.closest) {
                updateCursorHoverState(e.target);
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (e.target && e.target.closest) {
                const rel = e.relatedTarget;
                updateCursorHoverState(rel);
            }
        });
    }

    // =========================================================
    // IN-PAGE ANCHOR NAVIGATION WITHOUT HISTORY POLLUTION
    // Prevents in-page # links from creating back-button traps
    // =========================================================
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a[href^="#"]');
        if (!link) return;
        const hash = link.getAttribute('href');
        if (!hash || hash === '#' || hash === '#!') return;

        try {
            const target = document.querySelector(hash);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
                // Use replaceState so in-page browsing NEVER traps the back button!
                if (window.history && window.history.replaceState) {
                    window.history.replaceState(null, '', hash);
                }
            }
        } catch (err) {}
    });

    // =========================================================
    // UNIVERSAL SAFE RETURN TO PREVIOUS PORTFOLIO VIEW
    // Always returns directly to the exact spot where the user came from
    // Never traps the user in in-page # hash history!
    // =========================================================
    window.handleProjectReturn = function(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        // 1. Try exact returnUrl from sessionStorage
        try {
            sessionStorage.setItem('portfolio_return_active', 'true');
            const returnUrl = sessionStorage.getItem('portfolio_return_url');
            if (returnUrl) {
                window.location.href = returnUrl;
                return false;
            }
        } catch (err) {}

        // 2. Try URL query parameter ?from=...
        try {
            const params = new URLSearchParams(window.location.search);
            const from = params.get('from');
            if (from === 'constellation') {
                window.location.href = '../../#constellation';
                return false;
            } else if (from === 'about') {
                window.location.href = '../../#about';
                return false;
            } else if (from === 'archive') {
                window.location.href = '../../#archive';
                return false;
            } else if (from === 'design-approach') {
                window.location.href = '../../#design-approach';
                return false;
            } else if (from === 'cluster' || from === 'main') {
                window.location.href = '../../';
                return false;
            }
        } catch (err) {}

        // 3. Fallback to browser history back if previous page was our site
        try {
            if (document.referrer && document.referrer.includes(window.location.host)) {
                window.history.back();
                return false;
            }
        } catch (err) {}

        // 4. Default fallback to portfolio root
        window.location.href = '../../';
        return false;
    };

    function syncProjectReturnLinks() {
        try {
            const params = new URLSearchParams(window.location.search);
            const from = params.get('from') || sessionStorage.getItem('portfolio_return_origin');
            let targetHref = '../../';
            let labelSuffix = '';

            if (from === 'constellation') {
                targetHref = '../../#constellation';
                labelSuffix = 'CONSTELLATION';
            } else if (from === 'about') {
                targetHref = '../../#about';
                labelSuffix = 'ABOUT / CV';
            } else if (from === 'archive') {
                targetHref = '../../#archive';
                labelSuffix = 'ARCHIVE';
            } else if (from === 'design-approach') {
                targetHref = '../../#design-approach';
                labelSuffix = 'METHODOLOGY';
            } else if (from === 'cluster' || from === 'main') {
                targetHref = '../../';
                labelSuffix = 'OBSERVATORY';
            }

            document.querySelectorAll('.back-link, .back-btn, .footer-nav-btn, .footer-back-link, .pnav-center-btn, .center-directory-btn').forEach(btn => {
                btn.setAttribute('href', targetHref);
                if (btn.classList.contains('footer-nav-btn') && labelSuffix) {
                    btn.innerHTML = `&larr; RETURN TO ${labelSuffix}`;
                }
            });
        } catch (err) {}
    }

    // Event delegation for all return links on project pages
    document.addEventListener('click', function(e) {
        const btn = e.target.closest('.back-link, .back-btn, .footer-nav-btn, .footer-back-link, .pnav-center-btn, .center-directory-btn');
        if (btn) {
            window.handleProjectReturn(e);
        }
    });

    // =========================================================
    // UNIVERSAL LIGHTBOX CONTROLLER (CLICK ANYWHERE TO CLOSE)
    // Pure minimal fullscreen image viewer, zero text noise, dark translucent overlay
    // Zero layout shift via stable scroll locking + padding compensation
    // =========================================================
    let lastLightboxOpenedTime = 0;
    let isBodyScrollLocked = false;

    window.lockBodyScroll = function() {
        if (isBodyScrollLocked) return;
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        if (scrollbarWidth > 0) {
            document.documentElement.style.paddingRight = `${scrollbarWidth}px`;
            const nav = document.querySelector('.project-nav');
            if (nav && window.getComputedStyle(nav).position === 'fixed') {
                nav.style.paddingRight = `${scrollbarWidth}px`;
            }
        }
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
        isBodyScrollLocked = true;
    };

    window.unlockBodyScroll = function() {
        if (!isBodyScrollLocked) return;
        document.documentElement.style.paddingRight = '';
        const nav = document.querySelector('.project-nav');
        if (nav) nav.style.paddingRight = '';
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        isBodyScrollLocked = false;
    };

    // Image click zoom completely disabled per user preference
    window.openLightbox = function() {};
    window.closeLightbox = function() {};
    window.openUniversalFullscreenImage = function() {};
    window.closeLightboxDirect = function() {};
    window.openBoardLightbox = function() {};

    // Prevent any clicks on images or zoom containers from triggering lightbox
    document.addEventListener('click', function(e) {
        const clickedImg = e.target.closest('img, .zoomable-image-container, .board-compact-card');
        if (clickedImg && !clickedImg.closest('a, button, input, textarea, select, [role="button"]')) {
            const onclickAttr = clickedImg.getAttribute('onclick');
            if (onclickAttr && /lightbox/i.test(onclickAttr)) {
                e.preventDefault();
                e.stopPropagation();
            }
        }
    }, true);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initProjectCursor();
            syncProjectReturnLinks();
        });
    } else {
        initProjectCursor();
        syncProjectReturnLinks();
    }
})();

