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
            '.zoomable-image-container',
            '.board-compact-card',
            '.recipe-diagram-card',
            '.visual-feature-plate',
            '.visual-plate',
            '.lightbox-overlay',
            '.image-lightbox',
            '.lightbox-modal',
            '#lightbox-img',
            '.lightbox-img',
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
    // Pure minimal fullscreen image viewer, zero text, dark translucent overlay
    // =========================================================
    function closeAnyActiveLightbox() {
        const activeModals = document.querySelectorAll(
            '.lightbox-overlay.active, .image-lightbox.active, .lightbox-modal.active, .lightbox-modal:not(.hidden), #image-lightbox.active, #lightbox.active, #lightbox-modal:not(.hidden)'
        );
        let closed = false;
        activeModals.forEach(modal => {
            modal.classList.remove('active');
            modal.classList.add('hidden');
            const img = modal.querySelector('img');
            if (img) img.src = '';
            closed = true;
        });
        if (closed) {
            document.body.style.overflow = '';
        }
        if (typeof window.closeLightbox === 'function') {
            try { window.closeLightbox(); } catch(_) {}
        }
        if (typeof window.closeLightboxDirect === 'function') {
            try { window.closeLightboxDirect(); } catch(_) {}
        }
        return closed;
    }

    // Capture-phase click: clicking ANYWHERE on the screen closes the open lightbox
    document.addEventListener('click', function(e) {
        const activeModal = document.querySelector(
            '.lightbox-overlay.active, .image-lightbox.active, .lightbox-modal.active, .lightbox-modal:not(.hidden), #image-lightbox.active, #lightbox.active, #lightbox-modal:not(.hidden)'
        );
        if (activeModal) {
            // The user clicked while lightbox is open -> close it immediately!
            e.preventDefault();
            e.stopPropagation();
            closeAnyActiveLightbox();
        }
    }, true);

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAnyActiveLightbox();
        }
    });

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

