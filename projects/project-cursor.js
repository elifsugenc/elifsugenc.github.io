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

        // On scroll: maintain exact viewport position and re-evaluate hover element
        window.addEventListener('scroll', () => {
            if (cursorX >= 0 && cursorY >= 0) {
                if (!ticking) {
                    requestAnimationFrame(updatePosition);
                    ticking = true;
                }
                const el = document.elementFromPoint(cursorX, cursorY);
                updateCursorHoverState(el);
            }
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

    try {
        const lightboxObserver = new MutationObserver(mutations => {
            for (const m of mutations) {
                if (m.type === 'attributes' && m.attributeName === 'class') {
                    if (m.target && m.target.classList && m.target.classList.contains('active')) {
                        lastLightboxOpenedTime = Date.now();
                        window.__lastLightboxOpenedTime = lastLightboxOpenedTime;
                        window.lockBodyScroll();
                    } else if (m.target && m.target.classList && !m.target.classList.contains('active')) {
                        const anyActive = document.querySelector('.lightbox-overlay.active, .image-lightbox.active, .lightbox-modal.active, #universal-lightbox.active');
                        if (!anyActive) {
                            window.unlockBodyScroll();
                        }
                    }
                }
            }
        });
        lightboxObserver.observe(document.documentElement, {
            subtree: true,
            attributes: true,
            attributeFilter: ['class']
        });
    } catch (_) {}

    function ensureUniversalLightbox() {
        let modal = document.querySelector(
            '.lightbox-overlay, .image-lightbox, .lightbox-modal, #image-lightbox, #lightbox, #lightbox-modal, #universal-lightbox'
        );
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'universal-lightbox';
            modal.className = 'lightbox-overlay image-lightbox';
            modal.innerHTML = `
                <button id="lightbox-close-btn" class="lightbox-close-btn" aria-label="Close enlarged image">&times;</button>
                <div class="lightbox-img-wrapper lightbox-content-box">
                    <img id="lightbox-img" class="lightbox-img" src="" alt="Enlarged architectural drawing">
                </div>
                <p id="lightbox-caption" class="lightbox-caption"></p>
            `;
            document.body.appendChild(modal);
        } else {
            // Guarantee essential sub-elements exist in existing modals
            if (!modal.querySelector('img')) {
                const box = modal.querySelector('.lightbox-content-box, .lightbox-img-wrapper') || modal;
                const newImg = document.createElement('img');
                newImg.id = 'lightbox-img';
                newImg.className = 'lightbox-img';
                box.appendChild(newImg);
            }
            if (!modal.querySelector('.lightbox-close-btn, #lightbox-close-btn')) {
                const btn = document.createElement('button');
                btn.id = 'lightbox-close-btn';
                btn.className = 'lightbox-close-btn';
                btn.setAttribute('aria-label', 'Close enlarged image');
                btn.innerHTML = '&times;';
                modal.appendChild(btn);
            }
            if (!modal.querySelector('.lightbox-caption, .lightbox-caption-text, #lightbox-caption')) {
                const cap = document.createElement('p');
                cap.id = 'lightbox-caption';
                cap.className = 'lightbox-caption';
                modal.appendChild(cap);
            }
        }
        return modal;
    }

    function realOpenLightbox(src, caption) {
        if (!src) return;
        const modal = ensureUniversalLightbox();
        const img = modal.querySelector('img');
        const cap = modal.querySelector('.lightbox-caption, .lightbox-caption-text, #lightbox-caption');
        if (img) {
            img.src = src;
            img.alt = caption || 'Enlarged architectural drawing';
        }
        if (cap) {
            cap.innerText = caption ? caption.trim() : '';
        }
        modal.classList.remove('hidden');
        modal.classList.add('active');
        window.lockBodyScroll();
        lastLightboxOpenedTime = Date.now();
        window.__lastLightboxOpenedTime = lastLightboxOpenedTime;
    }

    function closeAnyActiveLightbox(e) {
        if (e && e.preventDefault) e.preventDefault();
        if (e && e.stopPropagation) e.stopPropagation();
        const activeModals = document.querySelectorAll(
            '.lightbox-overlay.active, .image-lightbox.active, .lightbox-modal.active, #image-lightbox.active, #lightbox.active, #lightbox-modal.active, #universal-lightbox.active'
        );
        let closed = false;
        activeModals.forEach(modal => {
            modal.classList.remove('active');
            modal.classList.add('hidden');
            const img = modal.querySelector('img');
            if (img) img.src = '';
            const cap = modal.querySelector('.lightbox-caption, .lightbox-caption-text, #lightbox-caption');
            if (cap) cap.innerText = '';
            closed = true;
        });
        if (closed) {
            window.unlockBodyScroll();
        }
        return closed;
    }

    // Protect window.openLightbox and window.closeLightbox against recursive overwrite
    try {
        Object.defineProperty(window, 'openLightbox', {
            get() { return realOpenLightbox; },
            set(fn) { /* prevent recursive inline function from overwriting master */ },
            configurable: true
        });
        Object.defineProperty(window, 'closeLightbox', {
            get() { return closeAnyActiveLightbox; },
            set(fn) { /* protect */ },
            configurable: true
        });
    } catch (_) {
        window.openLightbox = realOpenLightbox;
        window.closeLightbox = closeAnyActiveLightbox;
    }
    window.openUniversalFullscreenImage = realOpenLightbox;
    window.closeLightboxDirect = closeAnyActiveLightbox;

    // Capture-phase click:
    // 1. If lightbox is currently open: clicking close button or anywhere on screen (image, wrapper, backdrop) closes it
    // 2. If lightbox is closed: clicking ANY image or drawing card across the project zooms it to fullscreen!
    document.addEventListener('click', function(e) {
        const openedAt = Math.max(lastLightboxOpenedTime, window.__lastLightboxOpenedTime || 0);

        // CASE 1: Close active lightbox on any click (backdrop, image itself, wrapper, or close button)
        const activeModal = document.querySelector(
            '.lightbox-overlay.active, .image-lightbox.active, .lightbox-modal.active, #image-lightbox.active, #lightbox.active, #lightbox-modal.active, #universal-lightbox.active'
        );
        if (activeModal) {
            // Immediate close on close button
            if (e.target.closest('.lightbox-close-btn, #lightbox-close-btn')) {
                e.preventDefault();
                e.stopPropagation();
                closeAnyActiveLightbox(e);
                return;
            }
            // Debounce accidental immediate dismissal from the opening click
            if (Date.now() - openedAt < 120) {
                return;
            }
            e.preventDefault();
            e.stopPropagation();
            closeAnyActiveLightbox(e);
            return;
        }

        // CASE 2: Don't trigger lightbox on navigation links, interactive buttons, or consent popups
        if (e.target.closest('a, button, .sq-tile-link, .sq-project-tile, .project-crumb, .back-btn, .footer-nav-btn, .wwh-consent-popup, #wwh-consent-popup')) {
            return;
        }

        // CASE 3: Image or Zoomable Media Container Click
        const clickedImg = e.target.closest('img:not(.brand-logo-gif):not(#lightbox-img):not(.lightbox-img):not([src*="favicon"]):not(.sq-tile-img)');
        const zoomContainer = e.target.closest(
            '.zoomable-image-container, .board-compact-card, .tech-card, .dual-card, .render-quad-card, ' +
            '.hero-visual-card, .visual-feature-plate, .visual-plate, .tectonic-image-panel, .recipe-diagram-card, ' +
            '.diag-card, .board-item, .visual-frame, .drawing-card, .drawing-item, .drawing-frame, ' +
            '.content-card, .content-card-img-wrap, .visual-plate-media, .visual-feature-media, .board-thumb-frame, ' +
            '.tectonics-img-wrap, .recipe-img-wrap, .blueprint-canvas-box, .perspective-card, .model-card, ' +
            '.prog-card, .render-gal-card, .cases-diagram-card, .detail-card, .refuge-item-card, .gallery-card, .pillar-card'
        );

        if (clickedImg || zoomContainer) {
            const targetEl = zoomContainer || clickedImg;
            const onclickAttr = targetEl.getAttribute('onclick') || (clickedImg && clickedImg.getAttribute('onclick'));

            let targetSrc = '';
            let targetCaption = '';

            // Check if element has an explicit openLightbox call in onclick
            if (onclickAttr && /openLightbox\(/i.test(onclickAttr)) {
                const match = onclickAttr.match(/openLightbox\(\s*['"]([^'"]+)['"](?:\s*,\s*['"]([^'"]*)['"])?/);
                if (match) {
                    targetSrc = match[1];
                    targetCaption = match[2] || '';
                }
            } else if (onclickAttr && /openBoardLightbox\(/i.test(onclickAttr)) {
                // If it's a board lightbox call, let the inline board function handle it
                return;
            }

            // Fallback: extract from image element
            if (!targetSrc) {
                const img = clickedImg || (zoomContainer && zoomContainer.querySelector('img:not(#lightbox-img):not(.lightbox-img):not(.sq-tile-img)'));
                if (img) {
                    targetSrc = img.getAttribute('data-full-src') || img.currentSrc || img.src || img.getAttribute('src');
                    targetCaption = img.getAttribute('data-caption') || img.getAttribute('alt') || '';
                }
            }

            // Fallback caption: extract from container header/caption
            if (!targetCaption && zoomContainer) {
                const capEl = zoomContainer.querySelector('.caption-desc, .caption-title, figcaption, h3, h4');
                if (capEl) targetCaption = capEl.innerText.trim();
            }

            if (targetSrc) {
                e.preventDefault();
                e.stopPropagation();
                window.openLightbox(targetSrc, targetCaption);
            }
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

