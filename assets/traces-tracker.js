/**
 * YOU WERE HERE. — Website-Wide Mouse Trace Recording & Archive System
 * Elifsu Genç Portfolio
 * 
 * Features:
 * - Subtle bottom consent popup (YES / NO) with session persistence
 * - Live fixed indicator in bottom-right: recording.xxx
 * - Website-wide normalized mouse tracking with dwell & click sampling
 * - Atomic sequential trace numbering (TRACE_0001, TRACE_0002...) via Cloud Firebase Firestore
 * - Preserves existing Firestore database (traces-together) and historical traces
 * - Lightweight HTML5 Canvas PNG trace generation (replacing heavyweight PDFs)
 */

(function () {
    'use strict';

    // Configuration & Storage Keys
    const CONSENT_KEY = 'wwh_consent';
    const SESSION_KEY = 'wwh_current_trace';
    const FIREBASE_CONFIG = {
        apiKey: "AIzaSyAfU5_2JMufKlGFa5WBDO_kpdp38jV6A5s",
        authDomain: "traces-together.firebaseapp.com",
        projectId: "traces-together",
        storageBucket: "traces-together.firebasestorage.app",
        messagingSenderId: "537119213522",
        appId: "1:537119213522:web:35ab67f62add69968e6a0b"
    };

    function getConsent() {
        try {
            return localStorage.getItem(CONSENT_KEY) || sessionStorage.getItem(CONSENT_KEY) || null;
        } catch (e) {
            return null;
        }
    }

    function setConsent(val) {
        try {
            localStorage.setItem(CONSENT_KEY, val);
            sessionStorage.setItem(CONSENT_KEY, val);
        } catch (e) {}
    }

    // Global in-memory state
    let db = null;
    let docFn = null;
    let setDocFn = null;
    let runTransactionFn = null;
    let initFirebasePromise = null;

    let activeTrace = null;
    let isTracking = false;
    let lastPointTime = 0;
    let lastPointCoord = { x: 0, y: 0 };
    let anchorPoint = null;
    let anchorStartTime = 0;
    let saveTimer = null;
    let dwellTimer = null;
    let hasUnsavedChanges = false;
    let isCloudSaving = false;

    const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

    // Format Point Count to recording.xxx (at least 3 digits, no upper limit)
    function formatCount(count) {
        const numStr = count < 1000 ? String(count).padStart(3, '0') : String(count);
        return 'recording.' + numStr;
    }

    // Initialize Firebase Firestore SDK modularly
    function initFirebase() {
        if (db && docFn && setDocFn) return Promise.resolve(true);
        if (initFirebasePromise) return initFirebasePromise;

        initFirebasePromise = (async () => {
            try {
                const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js');
                const { getFirestore, doc, setDoc, runTransaction } = await import('https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js');
                const app = initializeApp(FIREBASE_CONFIG);
                db = getFirestore(app);
                docFn = doc;
                setDocFn = setDoc;
                runTransactionFn = runTransaction;
                return true;
            } catch (err) {
                console.warn('[YOU WERE HERE] Firebase initialization fallback to local session:', err);
                return false;
            }
        })();

        return initFirebasePromise;
    }

    // Allocate an atomic unique trace number (e.g. TRACE_0001, TRACE_0002)
    async function allocateTraceNumber() {
        if (!db) {
            try {
                await initFirebase();
            } catch (e) {}
        }

        if (!db || !runTransactionFn || !docFn) {
            const fallbackNum = Math.floor(1000 + Math.random() * 9000);
            return 'TRACE_' + fallbackNum;
        }

        try {
            const metaRef = docFn(db, 'metadata', 'traces_counter');
            let assignedNum = 1;
            await runTransactionFn(db, async (transaction) => {
                const metaDoc = await transaction.get(metaRef);
                let currentTotal = 0;
                if (metaDoc.exists()) {
                    currentTotal = metaDoc.data().total || 0;
                }
                // Account for the preserved historical traces in Firestore
                if (currentTotal < 51) {
                    currentTotal = 51;
                }
                currentTotal += 1;
                transaction.set(metaRef, { 
                    total: currentTotal,
                    lastUpdated: new Date().toISOString()
                }, { merge: true });
                assignedNum = currentTotal;
            });
            return 'TRACE_' + String(assignedNum).padStart(4, '0');
        } catch (e) {
            console.warn('[YOU WERE HERE] Counter transaction note, using fallback format:', e);
            const tsSuffix = Date.now().toString().slice(-4);
            return 'TRACE_' + tsSuffix;
        }
    }

    // Load or initialize trace session
    async function loadOrCreateTrace() {
        let stored = null;
        try {
            stored = JSON.parse(sessionStorage.getItem(SESSION_KEY));
        } catch (e) {}

        if (stored && stored.id && Array.isArray(stored.points)) {
            activeTrace = stored;
            return activeTrace;
        }

        const now = new Date();
        const dateStr = now.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
        const timeStr = now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        const traceNumber = await allocateTraceNumber();

        activeTrace = {
            id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : 'trace_' + Date.now(),
            traceNumber: traceNumber,
            date: dateStr,
            time: timeStr,
            started: Date.now(),
            points: [],
            dwells: [],
            clicks: [],
            viewport: {
                initialWidth: window.innerWidth,
                initialHeight: window.innerHeight
            }
        };

        saveTraceToSession();
        return activeTrace;
    }

    function saveTraceToSession() {
        if (!activeTrace) return;
        try {
            sessionStorage.setItem(SESSION_KEY, JSON.stringify(activeTrace));
        } catch (e) {}
    }

    // Incremental batch save to Firebase Firestore
    async function saveTraceToCloud(force = false) {
        if (!activeTrace || getConsent() !== 'yes') return;
        saveTraceToSession();

        // Require at least 2 points to avoid empty cloud records
        if (activeTrace.points.length < 2 && !activeTrace.clicks.length) return;
        if (!hasUnsavedChanges && !force) return;

        if (!db) {
            try {
                await initFirebase();
            } catch (e) {}
        }

        if (db && setDocFn && docFn) {
            if (isCloudSaving && !force) return;
            isCloudSaving = true;
            try {
                const cloudPayload = {
                    id: activeTrace.id,
                    traceNumber: activeTrace.traceNumber,
                    date: activeTrace.date,
                    time: activeTrace.time,
                    started: activeTrace.started,
                    duration: Date.now() - activeTrace.started,
                    pointCount: activeTrace.points.length,
                    points: activeTrace.points,
                    dwells: activeTrace.dwells,
                    clicks: activeTrace.clicks,
                    lastUpdated: new Date().toISOString()
                };

                await setDocFn(docFn(db, 'traces', activeTrace.id), cloudPayload, { merge: true });
                hasUnsavedChanges = false;
            } catch (err) {
                console.warn('[YOU WERE HERE] Cloud save buffer synced locally:', err);
            } finally {
                isCloudSaving = false;
            }
        }
    }

    // Helper to get safe mount root (documentElement avoids body scroll/transform containment)
    function getMountRoot() {
        return document.documentElement || document.body;
    }

    // Live Indicator UI
    function ensureLiveIndicator() {
        let el = document.getElementById('wwh-live-indicator');
        const mount = getMountRoot();
        if (!el) {
            el = document.createElement('div');
            el.id = 'wwh-live-indicator';
            el.className = 'wwh-live-indicator';
            el.setAttribute('aria-live', 'polite');
            el.setAttribute('role', 'button');
            el.setAttribute('tabindex', '0');
            el.setAttribute('title', 'YOU WERE HERE. // Live Attention Economy Research Apparatus. Click to manage recording or visit thesis.');
            el.innerHTML = `
                <span class="wwh-live-dot" aria-hidden="true"></span>
                <span class="wwh-live-tag">RESEARCH DEMO</span>
                <span class="wwh-live-sep">&bull;</span>
                <span class="wwh-live-label" id="wwh-live-count">recording.000</span>
            `;
            mount.appendChild(el);

            el.addEventListener('click', (e) => {
                e.stopPropagation();
                showConsentPopup();
            });
            el.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    showConsentPopup();
                }
            });
        } else if (el.parentElement !== mount) {
            mount.appendChild(el);
        }
        return el;
    }

    function updateLiveCount() {
        const countEl = document.getElementById('wwh-live-count');
        if (countEl && activeTrace) {
            countEl.textContent = formatCount(activeTrace.points.length);
        }
    }

    function hideLiveIndicator() {
        const el = document.getElementById('wwh-live-indicator');
        if (el) el.remove();
    }

    // Floating "you are here." Reopen Circle on the Right Side
    function showReopenCircle() {
        let circle = document.getElementById('wwh-reopen-circle');
        const mount = getMountRoot();
        if (circle) {
            circle.classList.remove('wwh-circle-exit');
            if (circle.parentElement !== mount) {
                mount.appendChild(circle);
            }
            return;
        }

        circle = document.createElement('button');
        circle.type = 'button';
        circle.id = 'wwh-reopen-circle';
        circle.className = 'wwh-reopen-circle';
        circle.setAttribute('aria-label', 'YOU WERE HERE. — Reopen Attention Economy research demo prompt');
        circle.setAttribute('title', 'YOU WERE HERE. // Live Attention Economy Research Demo');

        circle.innerHTML = `
            <span class="wwh-circle-dot" aria-hidden="true"></span>
            <span class="wwh-circle-text">you are<br>here.</span>
        `;

        mount.appendChild(circle);

        circle.addEventListener('click', (e) => {
            e.stopPropagation();
            hideReopenCircle();
            showConsentPopup();
        });
        circle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                hideReopenCircle();
                showConsentPopup();
            }
        });
    }

    function hideReopenCircle() {
        const circle = document.getElementById('wwh-reopen-circle');
        if (circle) {
            circle.classList.add('wwh-circle-exit');
            setTimeout(() => circle.remove(), 250);
        }
    }

    // Helper to resolve the project URL relative to current location
    function getLearnMoreUrl() {
        const path = (window.location.pathname || '').replace(/\\/g, '/').toLowerCase();
        if (path.includes('/projects/you-were-here/')) {
            return '#overview';
        } else if (path.includes('/projects/')) {
            return '../you-were-here/';
        } else {
            return 'projects/you-were-here/';
        }
    }

    // Consent Popup UI
    function showConsentPopup() {
        hideReopenCircle();
        const mount = getMountRoot();
        let popup = document.getElementById('wwh-consent-popup');
        if (popup) {
            popup.classList.remove('wwh-exit');
            if (popup.parentElement !== mount) {
                mount.appendChild(popup);
            }
            void popup.offsetWidth;
            popup.classList.add('wwh-visible');
            return;
        }

        popup = document.createElement('div');
        popup.id = 'wwh-consent-popup';
        popup.className = 'wwh-consent-popup';
        popup.setAttribute('role', 'dialog');
        popup.setAttribute('aria-modal', 'false');
        popup.setAttribute('aria-labelledby', 'wwh-consent-title');

        const learnUrl = getLearnMoreUrl();

        popup.innerHTML = `
            <div class="wwh-consent-inner">
                <div class="wwh-consent-text-col">
                    <span class="wwh-consent-tag">&#x2726; LIVE RESEARCH EXPERIMENT // SPATIALIZING THE ATTENTION ECONOMY</span>
                    <h4 id="wwh-consent-title" class="wwh-consent-title">Can a digital portfolio register physical presence?</h4>
                    <p class="wwh-consent-desc">
                        This website functions as the live experimental testbed for <strong>YOU WERE HERE.</strong>, an architectural research project investigating the attention economy and digital dwell time. With your consent, anonymous cursor velocities and hesitation pauses are recorded as spatial vectors in our open collective archive.
                    </p>
                </div>
                <div class="wwh-consent-actions">
                    <a href="${learnUrl}" id="wwh-btn-learn" class="wwh-btn-learn modal-open-standalone-btn" data-cursor="question">
                        <span class="wwh-learn-icon">&#x2726;</span>
                        <span class="wwh-learn-text">RESEARCH THESIS &amp; DEMO &nearr;</span>
                    </a>
                    <div class="wwh-consent-choice-group">
                        <button type="button" id="wwh-btn-yes" class="wwh-btn wwh-btn-yes">AGREE &amp; RECORD</button>
                        <button type="button" id="wwh-btn-no" class="wwh-btn wwh-btn-no">DECLINE</button>
                    </div>
                </div>
            </div>
        `;

        mount.appendChild(popup);

        // Immediate entrance animation trigger
        void popup.offsetWidth;
        popup.classList.add('wwh-visible');

        // Event listeners
        const btnYes = document.getElementById('wwh-btn-yes');
        const btnNo = document.getElementById('wwh-btn-no');
        const btnLearn = document.getElementById('wwh-btn-learn');

        if (btnLearn) {
            btnLearn.addEventListener('mouseenter', () => {
                const cur = document.getElementById('custom-cursor');
                if (cur) {
                    cur.classList.remove('cursor-hover');
                    cur.classList.add('cursor-project');
                }
            });
            btnLearn.addEventListener('mouseleave', () => {
                const cur = document.getElementById('custom-cursor');
                if (cur) {
                    cur.classList.remove('cursor-project');
                }
            });
            btnLearn.addEventListener('click', (e) => {
                const dest = getLearnMoreUrl();
                if (dest === '#overview') {
                    e.preventDefault();
                    const ov = document.getElementById('overview');
                    if (ov) {
                        ov.scrollIntoView({ behavior: 'smooth' });
                    } else {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                } else {
                    // Navigate directly to projects/you-were-here/
                    e.preventDefault();
                    window.location.href = dest;
                }
            });
        }

        if (btnYes) {
            btnYes.addEventListener('click', async (e) => {
                e.stopPropagation();
                setConsent('yes');
                dismissPopup(popup);
                hideReopenCircle();
                await startRecording();
                saveTraceToCloud(true);
            });
        }

        if (btnNo) {
            btnNo.addEventListener('click', (e) => {
                e.stopPropagation();
                setConsent('no');
                dismissPopup(popup);
                stopRecording();
                activeTrace = null;
                try {
                    sessionStorage.removeItem(SESSION_KEY);
                } catch(e) {}
                showReopenCircle();
            });
        }
    }

    function dismissPopup(popup) {
        if (!popup) return;
        popup.classList.remove('wwh-visible');
        popup.classList.add('wwh-exit');
        setTimeout(() => popup.remove(), 400);
    }

    // Mouse, Stylus & Touch Pointer Tracking Logic
    function handlePointerMove(e) {
        if (!isTracking || !activeTrace) return;

        const now = Date.now();
        // High-fidelity sampling: 40ms interval (~25 fps) with generous 15,000 points limit
        if (now - lastPointTime < 40 || activeTrace.points.length >= 15000) return;

        // Privacy guard: ignore when interacting with form inputs
        const targetTag = e.target ? e.target.tagName : '';
        if (targetTag === 'INPUT' || targetTag === 'TEXTAREA' || (e.target && e.target.isContentEditable)) return;

        // Get coordinates across mouse, pointer, and touch
        let cx = e.clientX;
        let cy = e.clientY;
        if ((cx == null || cy == null) && e.touches && e.touches.length > 0) {
            cx = e.touches[0].clientX;
            cy = e.touches[0].clientY;
        }
        if (cx == null || cy == null || isNaN(cx) || isNaN(cy)) return;

        // Normalized viewport coordinates (0 to 1000)
        const winW = window.innerWidth || 1000;
        const winH = window.innerHeight || 1000;
        const nx = clamp(Math.round((cx / winW) * 1000), 0, 1000);
        const ny = clamp(Math.round((cy / winH) * 1000), 0, 1000);

        // Distance threshold to avoid static jitter while capturing smooth movements (2 units ≈ 3px)
        const dist = Math.hypot(nx - lastPointCoord.x, ny - lastPointCoord.y);
        if (dist < 2 && activeTrace.points.length > 0 && (now - lastPointTime < 140)) {
            return;
        }

        lastPointTime = now;
        lastPointCoord = { x: nx, y: ny };

        const point = {
            x: nx,
            y: ny,
            t: now - activeTrace.started
        };

        activeTrace.points.push(point);
        hasUnsavedChanges = true;
        updateLiveCount();

        // Frequently sync to sessionStorage (every 5 points) so page navigation never drops points
        if (activeTrace.points.length % 5 === 0) {
            saveTraceToSession();
        }

        if (activeTrace.points.length % 15 === 0) {
            updateLivingPalimpsests();
            try {
                window.dispatchEvent(new CustomEvent('traces:live_point', { detail: activeTrace }));
            } catch (e) {}
        }

        // Dwell pause tracking
        if (!anchorPoint || Math.hypot(point.x - anchorPoint.x, point.y - anchorPoint.y) > 10) {
            anchorPoint = point;
            anchorStartTime = now;
        }
    }

    function handleClick(e) {
        if (!isTracking || !activeTrace) return;
        const targetTag = e.target ? e.target.tagName : '';
        if (targetTag === 'INPUT' || targetTag === 'TEXTAREA' || (e.target && e.target.isContentEditable)) return;

        let cx = e.clientX;
        let cy = e.clientY;
        if ((cx == null || cy == null) && e.touches && e.touches.length > 0) {
            cx = e.touches[0].clientX;
            cy = e.touches[0].clientY;
        }
        if (cx == null || cy == null) return;

        const winW = window.innerWidth || 1000;
        const winH = window.innerHeight || 1000;
        const nx = clamp(Math.round((cx / winW) * 1000), 0, 1000);
        const ny = clamp(Math.round((cy / winH) * 1000), 0, 1000);

        activeTrace.clicks.push({
            x: nx,
            y: ny,
            t: Date.now() - activeTrace.started
        });
        hasUnsavedChanges = true;
        saveTraceToSession();
    }

    function checkDwellPauses() {
        if (!isTracking || !activeTrace || !anchorPoint) return;
        const now = Date.now();
        const duration = now - anchorStartTime;
        if (duration >= 420) {
            const dwell = {
                x: anchorPoint.x,
                y: anchorPoint.y,
                t: anchorPoint.t,
                duration: duration
            };
            const lastDwell = activeTrace.dwells[activeTrace.dwells.length - 1];
            if (lastDwell && lastDwell.t === dwell.t) {
                lastDwell.duration = duration;
            } else {
                activeTrace.dwells.push(dwell);
                hasUnsavedChanges = true;
            }
        }
    }

    // Start Pre-Recording (buffers points into memory before explicit click)
    async function startPreRecording() {
        if (isTracking) return;
        await loadOrCreateTrace();

        isTracking = true;

        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('touchmove', handlePointerMove);
        window.removeEventListener('click', handleClick);

        window.addEventListener('pointermove', handlePointerMove, { passive: true });
        window.addEventListener('touchmove', handlePointerMove, { passive: true });
        window.addEventListener('click', handleClick, { passive: true });

        if (dwellTimer) clearInterval(dwellTimer);
        dwellTimer = setInterval(checkDwellPauses, 180);
    }

    // Start Recording Lifecycle
    async function startRecording() {
        if (isTracking && saveTimer) return;
        await loadOrCreateTrace();

        isTracking = true;
        ensureLiveIndicator();
        updateLiveCount();

        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('touchmove', handlePointerMove);
        window.removeEventListener('click', handleClick);

        window.addEventListener('pointermove', handlePointerMove, { passive: true });
        window.addEventListener('touchmove', handlePointerMove, { passive: true });
        window.addEventListener('click', handleClick, { passive: true });

        if (dwellTimer) clearInterval(dwellTimer);
        if (saveTimer) clearInterval(saveTimer);

        dwellTimer = setInterval(checkDwellPauses, 180);
        saveTimer = setInterval(() => saveTraceToCloud(false), 2000); // 2s rapid auto-sync
    }

    function stopRecording() {
        isTracking = false;
        hideLiveIndicator();

        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('touchmove', handlePointerMove);
        window.removeEventListener('click', handleClick);

        if (dwellTimer) clearInterval(dwellTimer);
        if (saveTimer) clearInterval(saveTimer);
        dwellTimer = null;
        saveTimer = null;
    }

    // Lightweight HTML5 Canvas PNG Generator (replaces PDF export for fast, compact size)
    function renderTraceToCanvas(traceData, width = 800, height = 800) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        // Crisp white architectural background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);

        // Subtle architectural grid
        ctx.strokeStyle = '#f1f5f9';
        ctx.lineWidth = 1;
        const gridSize = width / 20;
        for (let x = 0; x <= width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
        for (let y = 0; y <= height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        const pts = traceData.points || [];
        const scaleX = width / 1000;
        const scaleY = height / 1000;

        // 1. Draw Dwell Pauses
        (traceData.dwells || []).forEach(d => {
            const r = clamp(d.duration / 120, 6, 40) * scaleX;
            ctx.beginPath();
            ctx.arc(d.x * scaleX, d.y * scaleY, r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(37, 99, 235, 0.08)';
            ctx.fill();

            ctx.beginPath();
            ctx.arc(d.x * scaleX, d.y * scaleY, r * 0.4, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(37, 99, 235, 0.18)';
            ctx.fill();
        });

        // 2. Draw Movement Lines
        if (pts.length > 1) {
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            for (let i = 1; i < pts.length; i++) {
                const prev = pts[i - 1];
                const curr = pts[i];
                const dist = Math.hypot(curr.x - prev.x, curr.y - prev.y);
                const dt = Math.max(30, curr.t - prev.t);
                const speed = (dist / dt) * 1000;
                const strokeWidth = clamp(7 - speed * 0.04, 1.2, 7) * scaleX;

                ctx.beginPath();
                ctx.moveTo(prev.x * scaleX, prev.y * scaleY);
                ctx.lineTo(curr.x * scaleX, curr.y * scaleY);
                ctx.strokeStyle = 'rgba(37, 99, 235, 0.55)';
                ctx.lineWidth = strokeWidth;
                ctx.stroke();
            }
        }

        // 3. Draw Click Glyphs
        (traceData.clicks || []).forEach(c => {
            const cx = c.x * scaleX;
            const cy = c.y * scaleY;
            const starRadius = 6 * scaleX;
            ctx.strokeStyle = '#2563eb';
            ctx.lineWidth = 1.8;
            for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.lineTo(cx + Math.cos(angle) * starRadius, cy + Math.sin(angle) * starRadius);
                ctx.stroke();
            }
        });

        // 4. Architectural Title Block Footer
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 14px monospace';
        ctx.fillText(traceData.traceNumber || 'TRACE_0000', 28, height - 38);

        ctx.fillStyle = '#64748b';
        ctx.font = '11px monospace';
        ctx.fillText(`DATE: ${traceData.date || '—'}  TIME: ${traceData.time || '—'}  POINTS: ${pts.length}`, 28, height - 20);

        return canvas;
    }

    // Export Trace as lightweight PNG file download
    function downloadTraceAsPNG(traceData) {
        const canvas = renderTraceToCanvas(traceData);
        canvas.toBlob(blob => {
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${traceData.traceNumber || 'trace'}.png`;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                a.remove();
                URL.revokeObjectURL(url);
            }, 1000);
        }, 'image/png');
    }

    // In-memory cache for historical and live traces
    let cachedTracesList = [];
    let lastPalimpsestRenderTime = 0;

    /**
     * Render the Living Collective Palimpsest (All historical traces + active live trace)
     * with uniform 16:10 aspect-ratio mapping to eliminate all stretching and distortion.
     */
    function renderCollectivePalimpsest(targetCanvas, tracesList, options = {}) {
        const traces = (tracesList && tracesList.length > 0) ? tracesList : (cachedTracesList || []);
        const canvas = targetCanvas || document.createElement('canvas');

        const width = options.width || (canvas.clientWidth > 0 ? canvas.clientWidth : (canvas.width || 1200));
        const height = options.height || (canvas.clientHeight > 0 ? canvas.clientHeight : (canvas.height || 750));

        const dpr = options.dpr || (targetCanvas ? Math.min(window.devicePixelRatio || 1, 2) : 1);

        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);

        const ctx = canvas.getContext('2d');
        if (dpr !== 1) {
            ctx.scale(dpr, dpr);
        }

        // Crisp architectural off-white background
        ctx.fillStyle = '#fafbfc';
        ctx.fillRect(0, 0, width, height);

        // Architectural drafting grid
        ctx.strokeStyle = 'rgba(26, 54, 93, 0.04)';
        ctx.lineWidth = 1;
        const step = 40;
        for (let x = 0; x <= width; x += step) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
        for (let y = 0; y <= height; y += step) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        // UNIFORM 16:10 DESKTOP PROPORTIONS (Zero Distortion / Stretches eliminated)
        const targetAspect = 16 / 10;
        const padX = options.paddingX !== undefined ? options.paddingX : 28;
        const padY = options.paddingY !== undefined ? options.paddingY : 24;
        const availW = Math.max(100, width - padX * 2);
        const availH = Math.max(100, height - padY * 2);

        const virtualW = 1000;
        const virtualH = 1000 / targetAspect; // 625

        const scale = Math.min(availW / virtualW, availH / virtualH);
        const sheetW = virtualW * scale;
        const sheetH = virtualH * scale;

        const originX = padX + (availW - sheetW) / 2;
        const originY = padY + (availH - sheetH) / 2;

        const toX = (nx) => originX + (nx / 1000) * sheetW;
        const toY = (ny) => originY + (ny / 1000) * sheetH;

        // Subtle architectural sheet boundary & corner marks
        ctx.strokeStyle = 'rgba(37, 99, 235, 0.12)';
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 1;
        ctx.strokeRect(originX, originY, sheetW, sheetH);
        ctx.setLineDash([]);

        const drawCross = (cx, cy) => {
            ctx.strokeStyle = 'rgba(26, 54, 93, 0.28)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(cx - 5, cy); ctx.lineTo(cx + 5, cy);
            ctx.moveTo(cx, cy - 5); ctx.lineTo(cx, cy + 5);
            ctx.stroke();
        };
        drawCross(originX, originY);
        drawCross(originX + sheetW, originY);
        drawCross(originX, originY + sheetH);
        drawCross(originX + sheetW, originY + sheetH);

        // Ensure chronological ordering: oldest first (drawn behind in background), newest last (drawn on top in front)
        traces.sort((a, b) => (a.started || 0) - (b.started || 0));
        const totalTraceCount = traces.length;

        // 1. Layer 1: Render All Dwell Pauses Across Visitors + Active Trace (Halos: older fainter, newer clearer)
        const includeActive = !options.excludeActive;

        traces.forEach((tr, idx) => {
            if (!tr.dwells || !tr.dwells.length) return;
            const progress = (totalTraceCount > 1) ? (idx / (totalTraceCount - 1)) : 1;
            const dAlpha = 0.02 + progress * 0.07;
            tr.dwells.forEach(d => {
                const r = clamp((d.duration || 100) / 140, 5, 34) * scale;
                ctx.beginPath();
                ctx.arc(toX(d.x), toY(d.y), r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(37, 99, 235, ${dAlpha.toFixed(3)})`;
                ctx.fill();

                ctx.beginPath();
                ctx.arc(toX(d.x), toY(d.y), r * 0.4, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(26, 54, 93, ${(dAlpha * 1.5).toFixed(3)})`;
                ctx.fill();
            });
        });

        if (includeActive && activeTrace && activeTrace.dwells) {
            activeTrace.dwells.forEach(d => {
                const r = clamp((d.duration || 100) / 140, 5, 34) * scale;
                ctx.beginPath();
                ctx.arc(toX(d.x), toY(d.y), r, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(37, 99, 235, 0.12)';
                ctx.fill();

                ctx.beginPath();
                ctx.arc(toX(d.x), toY(d.y), r * 0.4, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(26, 54, 93, 0.22)';
                ctx.fill();
            });
        }

        // 2. Layer 2: Render Movement Trajectories
        // Older traces: faint translucent underdrawings (opacity ~0.10, soft blue, fine stroke)
        // Newer traces: progressively darker, bolder, and drawn ON TOP in front (opacity up to 0.78, deep navy, bolder line)
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        traces.forEach((tr, idx) => {
            const pts = tr.points || [];
            if (pts.length < 2) return;

            // Normalized chronological progress from 0 (oldest) to 1 (newest)
            const progress = (totalTraceCount > 1) ? (idx / (totalTraceCount - 1)) : 1;

            // Progressive opacity curve: older traces are faint (0.10), newest traces are bold & rich (0.78)
            const opacity = 0.10 + Math.pow(progress, 1.35) * 0.68;

            // Color gradient: softer cerulean for older traces -> deep architectural navy/indigo for newest traces
            const r = Math.round(75 + (20 - 75) * progress);
            const g = Math.round(145 + (45 - 145) * progress);
            const b = Math.round(245 + (120 - 245) * progress);

            const lineWidth = (1.1 + progress * 0.8) * Math.max(0.8, scale * 1.1);

            ctx.beginPath();
            ctx.moveTo(toX(pts[0].x), toY(pts[0].y));
            for (let i = 1; i < pts.length; i++) {
                ctx.lineTo(toX(pts[i].x), toY(pts[i].y));
            }
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity.toFixed(3)})`;
            ctx.lineWidth = lineWidth;
            ctx.stroke();
        });

        // 3. Layer 3: Render Active Visitor's Real-Time Trace (Living Pulse at the very front / top)
        if (includeActive && activeTrace && activeTrace.points && activeTrace.points.length > 1) {
            const livePts = activeTrace.points;
            ctx.beginPath();
            ctx.moveTo(toX(livePts[0].x), toY(livePts[0].y));
            for (let i = 1; i < livePts.length; i++) {
                ctx.lineTo(toX(livePts[i].x), toY(livePts[i].y));
            }
            ctx.strokeStyle = 'rgba(20, 45, 120, 0.90)';
            ctx.lineWidth = 2.4 * Math.max(0.8, scale * 1.1);
            ctx.stroke();

            // Glowing cursor tip
            const lastPt = livePts[livePts.length - 1];
            ctx.beginPath();
            ctx.arc(toX(lastPt.x), toY(lastPt.y), 4.5 * scale, 0, Math.PI * 2);
            ctx.fillStyle = '#22c55e';
            ctx.fill();
            ctx.beginPath();
            ctx.arc(toX(lastPt.x), toY(lastPt.y), 8 * scale, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(34, 197, 94, 0.25)';
            ctx.fill();
        }

        // 4. Layer 4: Click Glyphs (Older are softer, newest are vibrant crimson crosses)
        traces.forEach((tr, idx) => {
            if (!tr.clicks || !tr.clicks.length) return;
            const progress = (totalTraceCount > 1) ? (idx / (totalTraceCount - 1)) : 1;
            const cAlpha = 0.22 + progress * 0.65;
            const starRadius = (3.5 + progress * 1.5) * scale;
            const cWidth = 1.0 + progress * 0.5;

            tr.clicks.forEach(c => {
                const cx = toX(c.x);
                const cy = toY(c.y);
                ctx.strokeStyle = `rgba(220, 38, 38, ${cAlpha.toFixed(3)})`;
                ctx.lineWidth = cWidth;
                ctx.beginPath();
                ctx.moveTo(cx - starRadius, cy);
                ctx.lineTo(cx + starRadius, cy);
                ctx.moveTo(cx, cy - starRadius);
                ctx.lineTo(cx, cy + starRadius);
                ctx.stroke();
            });
        });

        if (includeActive && activeTrace && activeTrace.clicks) {
            activeTrace.clicks.forEach(c => {
                const cx = toX(c.x);
                const cy = toY(c.y);
                const starRadius = 5.5 * scale;
                ctx.strokeStyle = 'rgba(220, 38, 38, 0.92)';
                ctx.lineWidth = 1.8;
                ctx.beginPath();
                ctx.moveTo(cx - starRadius, cy);
                ctx.lineTo(cx + starRadius, cy);
                ctx.moveTo(cx, cy - starRadius);
                ctx.lineTo(cx, cy + starRadius);
                ctx.stroke();
            });
        }

        // 5. Layer 5: Technical Title Block
        const activeCount = (includeActive && activeTrace && activeTrace.points && activeTrace.points.length > 5) ? 1 : 0;
        const totalTracesCount = traces.length + activeCount;
        const totalPoints = traces.reduce((acc, t) => acc + (t.pointCount || (t.points ? t.points.length : 0)), 0) + (includeActive && activeTrace && activeTrace.points ? activeTrace.points.length : 0);

        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 11px monospace';
        const titleText = options.title || 'YOU WERE HERE. // SHARED DRAWINGS';
        ctx.fillText(titleText, originX + 4, height - 12);

        ctx.fillStyle = '#64748b';
        ctx.font = '10px monospace';
        const rightText = options.rightText || `${totalTracesCount} DRAWINGS LAYERED • ${totalPoints.toLocaleString()} PTS`;
        const textWidth = ctx.measureText(rightText).width;
        ctx.fillText(rightText, Math.max(originX + 220, originX + sheetW - textWidth - 4), height - 12);

        return canvas;
    }

    // Historical legacy classification (08.10.2026 and prior)
    function isLegacyTrace(trace) {
        if (!trace) return false;
        if (trace.date && typeof trace.date === 'string') {
            const parts = trace.date.split('.');
            if (parts.length === 3) {
                const day = parseInt(parts[0], 10);
                const month = parseInt(parts[1], 10);
                const year = parseInt(parts[2], 10);
                if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
                    if (year < 2026) return true;
                    if (year === 2026) {
                        if (month < 10) return true;
                        if (month === 10 && day <= 8) return true;
                        return false;
                    }
                    return false;
                }
            }
        }
        if (trace.started && trace.started > 0) {
            const cutoff = new Date('2026-10-08T23:59:59+03:00').getTime();
            return trace.started <= cutoff;
        }
        return false;
    }

    function getLegacyTraces(list) {
        const src = (list && list.length > 0) ? list : (cachedTracesList || []);
        return src.filter(isLegacyTrace);
    }

    function getCurrentTraces(list) {
        const src = (list && list.length > 0) ? list : (cachedTracesList || []);
        return src.filter(t => !isLegacyTrace(t));
    }

    function getLivingPalimpsestDataURL(width = 1200, height = 750) {
        const offscreen = document.createElement('canvas');
        renderCollectivePalimpsest(offscreen, cachedTracesList, { width, height, dpr: 1 });
        return offscreen.toDataURL('image/png');
    }

    // Automatically update living palimpsest image across the entire website
    function updateLivingPalimpsests() {
        if (!cachedTracesList || cachedTracesList.length === 0) return;
        const now = Date.now();
        if (now - lastPalimpsestRenderTime < 1000) return; // Throttle
        lastPalimpsestRenderTime = now;

        const dataURL = getLivingPalimpsestDataURL(1200, 750);
        if (!dataURL) return;

        // 1. Update Project Card image on main portfolio page
        const projectCardImg = document.querySelector('#card-you-were-here .card-img');
        if (projectCardImg) {
            projectCardImg.style.backgroundImage = `url("${dataURL}")`;
            projectCardImg.style.backgroundSize = 'cover';
        }

        // 2. Update Constellation Node visual circle
        const constellationVisual = document.querySelector('.constellation-node[data-id="you-were-here"] .visual-img');
        if (constellationVisual) {
            constellationVisual.style.backgroundImage = `url("${dataURL}")`;
        }

        // 3. Update Modal Hero and Gallery image if Project Modal is open
        const modalHero = document.getElementById('modal-hero');
        if (modalHero && window.lastOpenedProjectSlug === 'you-were-here') {
            modalHero.style.backgroundImage = `url("${dataURL}")`;
            modalHero.style.backgroundSize = 'contain';
            modalHero.style.backgroundRepeat = 'no-repeat';
            modalHero.style.backgroundPosition = 'center';
            modalHero.style.backgroundColor = '#fafbfc';
            
            let badge = modalHero.querySelector('.m-living-hero-badge');
            if (!badge) {
                badge = document.createElement('div');
                badge.className = 'm-living-hero-badge';
                modalHero.appendChild(badge);
            }
            badge.innerHTML = `<span class="live-pulse-dot"></span> SHARED DRAWING &bull; ${cachedTracesList.length} SESSIONS`;
        }

        const modalGalImg = document.getElementById('modal-palimpsest-img');
        if (modalGalImg) {
            modalGalImg.src = dataURL;
        }

        // 4. Update collective canvas on dedicated project page if open
        const collectiveCanvas = document.getElementById('collective-canvas-overlay');
        if (collectiveCanvas) {
            const era = window.collectiveEraMode || 'CURRENT';
            if (era === 'LEGACY') {
                renderCollectivePalimpsest(collectiveCanvas, getLegacyTraces(), {
                    title: 'PREVIOUS WEBSITE ARCHIVE (≤ 2026)',
                    excludeActive: true
                });
            } else if (era === 'ALL') {
                renderCollectivePalimpsest(collectiveCanvas, cachedTracesList, {
                    title: 'ALL DRAWINGS SUPERIMPOSED'
                });
            } else {
                renderCollectivePalimpsest(collectiveCanvas, getCurrentTraces(), {
                    title: 'CURRENT WEBSITE SESSIONS (2026)'
                });
            }
        }

        // 5. Update legacy canvas in folder if present
        const legacyCanvas = document.getElementById('legacy-collective-canvas');
        if (legacyCanvas) {
            renderCollectivePalimpsest(legacyCanvas, getLegacyTraces(), {
                title: 'PREVIOUS WEBSITE ARCHIVE // TRACES TOGETHER (≤ 08.10.2026)',
                excludeActive: true
            });
        }
    }

    // Fetch all historical and new traces from Cloud Firebase Firestore
    async function fetchAllTraces() {
        if (!db) await initFirebase();
        if (!db) return [];
        try {
            const { collection, getDocs, query, limit } = await import('https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js');
            const q = query(collection(db, 'traces'), limit(500));
            const snap = await getDocs(q);
            const list = [];
            let fallbackIdx = 1;

            snap.forEach(docSnap => {
                const data = docSnap.data();
                const pts = data.points || [];
                let dateStr = data.date;
                let timeStr = data.time;

                let startedTs = (typeof data.started === 'number' && data.started > 0) ? data.started : 0;

                if (dateStr && dateStr.includes('T')) {
                    const d = new Date(dateStr);
                    if (!isNaN(d.getTime())) {
                        if (!startedTs) startedTs = d.getTime();
                        dateStr = d.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
                        timeStr = d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                    }
                } else if (dateStr && !startedTs) {
                    const parts = String(dateStr).split('.');
                    if (parts.length === 3) {
                        const d = parseInt(parts[0], 10);
                        const m = parseInt(parts[1], 10) - 1;
                        const y = parseInt(parts[2], 10);
                        let h = 0, min = 0, s = 0;
                        if (timeStr) {
                            const tp = String(timeStr).split(':');
                            if (tp.length >= 2) {
                                h = parseInt(tp[0], 10) || 0;
                                min = parseInt(tp[1], 10) || 0;
                                s = parseInt(tp[2], 10) || 0;
                            }
                        }
                        const parsed = new Date(y, m, d, h, min, s).getTime();
                        if (!isNaN(parsed)) startedTs = parsed;
                    }
                }

                list.push({
                    id: data.id || docSnap.id,
                    savedTraceNumber: data.traceNumber || null,
                    date: dateStr || '—',
                    time: timeStr || '—',
                    started: startedTs,
                    duration: data.duration || 0,
                    pointCount: data.pointCount || pts.length,
                    points: pts,
                    dwells: data.dwells || [],
                    clicks: data.clicks || []
                });
            });

            // Merge active live visitor session so it is never missing or truncated
            const currentActive = activeTrace || (function() {
                try {
                    return JSON.parse(sessionStorage.getItem(SESSION_KEY));
                } catch(e) { return null; }
            })();

            if (currentActive && currentActive.id) {
                const existingIdx = list.findIndex(t => t.id === currentActive.id);
                const activeItem = {
                    id: currentActive.id,
                    savedTraceNumber: currentActive.traceNumber || null,
                    date: currentActive.date || '—',
                    time: currentActive.time || '—',
                    started: currentActive.started || Date.now(),
                    duration: (Date.now() - (currentActive.started || Date.now())),
                    pointCount: currentActive.points ? currentActive.points.length : 0,
                    points: currentActive.points || [],
                    dwells: currentActive.dwells || [],
                    clicks: currentActive.clicks || [],
                    isActiveSession: true
                };

                if (existingIdx >= 0) {
                    list[existingIdx] = activeItem;
                } else if (currentActive.points && currentActive.points.length > 0) {
                    list.push(activeItem);
                }
            }

            // En eski 0001, en yeniye kadar kronolojik artan sırada numaralandır
            list.sort((a, b) => (a.started || 0) - (b.started || 0));

            list.forEach((item, index) => {
                item.traceNumber = 'TRACE_' + String(index + 1).padStart(4, '0');
            });

            cachedTracesList = list;
            setTimeout(updateLivingPalimpsests, 30);
            return list;
        } catch (err) {
            console.error('[YOU WERE HERE] Error fetching archive traces:', err);
            return [];
        }
    }

    // Public API exposed on window for YOU WERE HERE. archive views
    window.YouWereHereTracker = {
        getTrace: () => activeTrace,
        saveNow: saveTraceToCloud,
        renderToCanvas: renderTraceToCanvas,
        renderCollectivePalimpsest: renderCollectivePalimpsest,
        getLivingPalimpsestDataURL: getLivingPalimpsestDataURL,
        updateLivingPalimpsests: updateLivingPalimpsests,
        getCachedTraces: () => cachedTracesList,
        isLegacyTrace: isLegacyTrace,
        getLegacyTraces: getLegacyTraces,
        getCurrentTraces: getCurrentTraces,
        traceToPNGDataURL: (traceData, w = 400, h = 400) => renderTraceToCanvas(traceData, w, h).toDataURL('image/png'),
        downloadAsPNG: downloadTraceAsPNG,
        fetchAllTraces: fetchAllTraces,
        formatCount: formatCount
    };
    window.WeWereHereTracker = window.YouWereHereTracker; // Backward compatibility alias

    function handlePageExit() {
        saveTraceToSession();
        if (activeTrace && getConsent() === 'yes') {
            saveTraceToCloud(true);
        }
    }

    // Auto-save on page lifecycle events
    window.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            handlePageExit();
        }
    });
    window.addEventListener('pagehide', handlePageExit);
    window.addEventListener('beforeunload', handlePageExit);

    // Bootstrap on DOM Ready
    async function init() {
        const consent = getConsent();

        // 1. Consent State Handling
        if (consent === 'yes') {
            // Already consented: start recording immediately across all pages
            hideReopenCircle();
            await startRecording();
        } else if (consent === 'no') {
            // Explicitly declined: show the subtle reopen circle, do not record
            showReopenCircle();
        } else {
            // First time visitor (no choice made yet):
            // Show popup AND start pre-recording so initial movement/dwell is not lost
            showConsentPopup();
            await startPreRecording();
        }

        // 2. Initialize Firebase SDK and fetch historical traces in background
        initFirebase().then(() => {
            fetchAllTraces().catch(e => console.warn('[YOU WERE HERE] Background archive fetch:', e));
        }).catch(err => {
            console.warn('[YOU WERE HERE] Firebase init:', err);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
