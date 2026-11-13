/**
 * THE LIST KEEPS GROWING — INTERACTIVE MEMORIAL ARCHIVE
 * Auto-Scrolling Memorial Name Stream & Record Disclosure Controller
 * Emek Museum // INT401 Studio
 */

(function () {
    'use strict';

    // =========================================================================
    // 1. ARCHIVAL DATA REPOSITORY (ETHICALLY STRUCTURED)
    // No artificial or simulated names/disasters. All entries are clear placeholders
    // formatted to demonstrate the expanding continuous memorial list.
    // =========================================================================
    const TOTAL_PLACEHOLDER_ROWS = 12;

    const MEMORIAL_ENTRIES = Array.from({ length: TOTAL_PLACEHOLDER_ROWS }, (_, i) => {
        const num = String(i + 1).padStart(3, '0');
        return {
            id: `REC-${num}`,
            refCode: `ARCHIVE REF // EM-${num}`,
            displayNum: `#${num}`,
            name: 'Verified names will appear here',
            status: 'PENDING VERIFICATION',
            periodId: 'period-1',
            dossier: {
                nameLead: 'A name.',
                lifeNarrative: 'A life. A family. A story that should not have ended this way.',
                previewNote: 'Conceptual interaction preview — not a historical record.',
                openButtonLabel: 'Reveal the story',
                closeButtonLabel: 'Hide the story',
                details: [
                    { label: 'RECORDED IDENTITY', value: '[Verified name will appear here]' },
                    { label: 'LABOUR / OCCUPATION', value: '[Verified occupation / role will appear here]' },
                    { label: 'INCIDENT BASIN / PIT', value: '[Verified basin / pit location will appear here]' },
                    { label: 'BIOGRAPHICAL NARRATIVE', value: '[Verified story will appear here]' }
                ],
                notice: 'Historical records are being prepared.'
            }
        };
    });

    const ARCHIVE_PERIODS = [
        {
            id: 'period-1',
            label: 'Archive Period 1',
            phaseCode: 'PHASE 01 // INITIAL REPOSITORY',
            status: 'CONCEPTUAL PREVIEW',
            records: [MEMORIAL_ENTRIES[0]] // Initial primary dossier entity
        },
        {
            id: 'period-2',
            label: 'Archive Period 2',
            phaseCode: 'PHASE 02 // SUBSEQUENT ACCUMULATION',
            status: 'AWAITING FIELD VERIFICATION',
            records: [] // Empty state demonstrating verified data boundary
        },
        {
            id: 'period-3',
            label: 'Archive Period 3',
            phaseCode: 'PHASE 03 // ONGOING CIVIC MEMORIAL',
            status: 'AWAITING FIELD VERIFICATION',
            records: [] // Empty state demonstrating verified data boundary
        }
    ];

    // =========================================================================
    // 2. STATE MANAGEMENT & DOM REFERENCES
    // =========================================================================
    let activePeriodId = ARCHIVE_PERIODS[0].id;
    let selectedRecordId = MEMORIAL_ENTRIES[0].id;
    let activeDossierExpanded = false;

    // Auto-Scroll Stream State
    let isPausedByUser = false;
    let isInteracting = false;
    let currentScrollY = 0;
    let animationFrameId = null;
    let resumeTimeoutId = null;
    const SCROLL_SPEED = 0.45; // Readable, continuous slow drift (~27px/sec)
    const RESUME_DELAY_MS = 1800;

    // DOM Elements
    const streamViewportEl = document.getElementById('stream-viewport');
    const streamListEl = document.getElementById('stream-list');
    const streamListCloneEl = document.getElementById('stream-list-clone');
    const streamToggleBtn = document.getElementById('stream-toggle-btn');
    const streamStatusTag = document.getElementById('stream-status-tag');
    const timelineStripEl = document.getElementById('timeline-strip');
    const recordsContainerEl = document.getElementById('records-container');
    const holdingCountEl = document.getElementById('holding-count');

    // =========================================================================
    // 3. CONTINUOUS MEMORIAL NAME STREAM BUILDER
    // =========================================================================
    function buildStreamRowMarkup(entry, isClone) {
        return `
            <li class="stream-item" role="${isClone ? 'presentation' : 'listitem'}">
                <button type="button" 
                        class="stream-row-btn ${entry.id === selectedRecordId ? 'is-selected-row' : ''}" 
                        data-record-id="${entry.id}"
                        ${isClone ? 'tabindex="-1" aria-hidden="true"' : `aria-label="Inspect archival entry ${entry.displayNum}: ${entry.name}"`}>
                    <div class="item-left">
                        <span class="item-index" aria-hidden="true">${entry.displayNum}</span>
                        <span class="item-name">${entry.name}</span>
                    </div>
                    <div class="item-right">
                        <span class="item-ref-tag">${entry.refCode}</span>
                        <span class="item-status-pill">${entry.status}</span>
                        <span class="item-action-hint" aria-hidden="true">INSPECT DOSSIER &rarr;</span>
                    </div>
                </button>
            </li>
        `;
    }

    function initStreamRows() {
        if (!streamListEl || !streamListCloneEl) return;

        // Canonical Accessible List
        streamListEl.innerHTML = MEMORIAL_ENTRIES.map(e => buildStreamRowMarkup(e, false)).join('');

        // Visual Looping Clone (Screen readers strictly ignore aria-hidden clone)
        streamListCloneEl.innerHTML = MEMORIAL_ENTRIES.map(e => buildStreamRowMarkup(e, true)).join('');

        // Attach Click and Keyboard Handlers
        streamViewportEl.querySelectorAll('.stream-row-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const recId = btn.getAttribute('data-record-id');
                if (recId) {
                    inspectRecord(recId, true);
                }
            });
        });
    }

    // =========================================================================
    // 4. AUTO-SCROLL ENGINE (REQUEST_ANIMATION_FRAME)
    // =========================================================================
    function updateStreamStatusIndicator() {
        if (!streamStatusTag || !streamToggleBtn) return;

        const btnText = streamToggleBtn.querySelector('.stream-btn-text');
        const btnIcon = streamToggleBtn.querySelector('.stream-btn-icon');
        const statusText = streamStatusTag.querySelector('.stream-status-text');

        if (isPausedByUser) {
            streamToggleBtn.setAttribute('aria-pressed', 'true');
            if (btnText) btnText.textContent = 'Resume names';
            if (btnIcon) btnIcon.textContent = '\u25B6'; // Play icon
            streamStatusTag.classList.add('is-paused');
            if (statusText) statusText.textContent = 'Stream: Paused (Manual Control)';
        } else if (isInteracting) {
            streamToggleBtn.setAttribute('aria-pressed', 'false');
            if (btnText) btnText.textContent = 'Pause names';
            if (btnIcon) btnIcon.textContent = '\u25AE\u25AE'; // Pause icon
            streamStatusTag.classList.add('is-paused');
            if (statusText) statusText.textContent = 'Stream: Paused (User Reading)';
        } else {
            streamToggleBtn.setAttribute('aria-pressed', 'false');
            if (btnText) btnText.textContent = 'Pause names';
            if (btnIcon) btnIcon.textContent = '\u25AE\u25AE';
            streamStatusTag.classList.remove('is-paused');
            if (statusText) statusText.textContent = 'Stream: Active (Slow Scroll)';
        }
    }

    function tickAutoScroll() {
        if (!streamViewportEl || !streamListEl) return;

        if (!isPausedByUser && !isInteracting) {
            const canonicalHeight = streamListEl.offsetHeight;
            if (canonicalHeight > 0) {
                currentScrollY += SCROLL_SPEED;
                if (currentScrollY >= canonicalHeight) {
                    currentScrollY -= canonicalHeight;
                }
                streamViewportEl.scrollTop = currentScrollY;
            }
        }

        animationFrameId = requestAnimationFrame(tickAutoScroll);
    }

    function scheduleInteractionResume() {
        if (resumeTimeoutId) clearTimeout(resumeTimeoutId);
        resumeTimeoutId = setTimeout(() => {
            isInteracting = false;
            updateStreamStatusIndicator();
        }, RESUME_DELAY_MS);
    }

    function handleUserInteractionStart() {
        isInteracting = true;
        if (resumeTimeoutId) clearTimeout(resumeTimeoutId);
        updateStreamStatusIndicator();
    }

    function handleUserInteractionEnd() {
        scheduleInteractionResume();
    }

    function initStreamInteractionListeners() {
        if (!streamViewportEl) return;

        // Check prefers-reduced-motion
        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (motionQuery.matches) {
            isPausedByUser = true;
            updateStreamStatusIndicator();
        }

        // Toggle Button
        if (streamToggleBtn) {
            streamToggleBtn.addEventListener('click', () => {
                isPausedByUser = !isPausedByUser;
                if (isPausedByUser) {
                    isInteracting = false;
                    if (resumeTimeoutId) clearTimeout(resumeTimeoutId);
                } else {
                    currentScrollY = streamViewportEl.scrollTop;
                }
                updateStreamStatusIndicator();
            });
        }

        // Pause on Hover
        streamViewportEl.addEventListener('mouseenter', handleUserInteractionStart);
        streamViewportEl.addEventListener('mouseleave', handleUserInteractionEnd);

        // Pause on Touch
        streamViewportEl.addEventListener('touchstart', handleUserInteractionStart, { passive: true });
        streamViewportEl.addEventListener('touchend', handleUserInteractionEnd, { passive: true });

        // Pause on Keyboard Focus inside stream
        streamViewportEl.addEventListener('focusin', handleUserInteractionStart);
        streamViewportEl.addEventListener('focusout', handleUserInteractionEnd);

        // Pause on Manual Scroll Wheel or Drag
        streamViewportEl.addEventListener('wheel', () => {
            handleUserInteractionStart();
            currentScrollY = streamViewportEl.scrollTop;
            scheduleInteractionResume();
        }, { passive: true });

        streamViewportEl.addEventListener('scroll', () => {
            if (isInteracting) {
                currentScrollY = streamViewportEl.scrollTop;
            }
        }, { passive: true });
    }

    // =========================================================================
    // 5. RECORD INSPECTION & ACCORDION DISCLOSURE
    // =========================================================================
    function inspectRecord(recId, shouldScrollToDossier) {
        selectedRecordId = recId;
        activePeriodId = 'period-1'; // Switch to phase containing active record
        activeDossierExpanded = true; // Auto-expand when explicitly inspected

        // Update selected row style in stream
        streamViewportEl.querySelectorAll('.stream-row-btn').forEach(btn => {
            btn.classList.toggle('is-selected-row', btn.getAttribute('data-record-id') === recId);
        });

        // Re-render tabs and dossier
        updateTimelineTabs();
        renderRecordsHolding();

        if (shouldScrollToDossier) {
            const dossierSection = document.getElementById('archive-holding-section');
            if (dossierSection) {
                dossierSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }

    // =========================================================================
    // 6. TIMELINE PERIOD CONTROLS
    // =========================================================================
    function updateTimelineTabs() {
        if (!timelineStripEl) return;
        const tabs = timelineStripEl.querySelectorAll('.timeline-period-btn');
        tabs.forEach(tab => {
            const isSelected = tab.id === `tab-${activePeriodId}`;
            tab.classList.toggle('active', isSelected);
            tab.setAttribute('aria-selected', isSelected ? 'true' : 'false');
            tab.tabIndex = isSelected ? 0 : -1;
        });
    }

    function renderTimelineStrip() {
        if (!timelineStripEl) return;
        timelineStripEl.innerHTML = '';

        ARCHIVE_PERIODS.forEach((period, index) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = `timeline-period-btn ${period.id === activePeriodId ? 'active' : ''}`;
            btn.id = `tab-${period.id}`;
            btn.setAttribute('role', 'tab');
            btn.setAttribute('aria-selected', period.id === activePeriodId ? 'true' : 'false');
            btn.setAttribute('aria-controls', 'records-container');
            btn.tabIndex = period.id === activePeriodId ? 0 : -1;

            btn.innerHTML = `
                <span class="p-batch-tag">${period.phaseCode}</span>
                <span class="p-title">${period.label}</span>
                <span class="p-status">
                    <span class="p-status-dot" aria-hidden="true"></span>
                    <span>${period.status}</span>
                </span>
            `;

            btn.addEventListener('click', () => {
                selectPeriod(period.id);
            });

            btn.addEventListener('keydown', (e) => {
                handleTimelineKeydown(e, index);
            });

            timelineStripEl.appendChild(btn);
        });
    }

    function handleTimelineKeydown(e, currentIndex) {
        const tabs = Array.from(timelineStripEl.querySelectorAll('.timeline-period-btn'));
        let targetIndex = currentIndex;

        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            targetIndex = (currentIndex + 1) % tabs.length;
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            targetIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        } else if (e.key === 'Home') {
            e.preventDefault();
            targetIndex = 0;
        } else if (e.key === 'End') {
            e.preventDefault();
            targetIndex = tabs.length - 1;
        } else {
            return;
        }

        const targetTab = tabs[targetIndex];
        const targetPeriodId = ARCHIVE_PERIODS[targetIndex].id;
        selectPeriod(targetPeriodId);
        targetTab.focus();
    }

    function selectPeriod(periodId) {
        if (activePeriodId === periodId) return;
        activePeriodId = periodId;
        updateTimelineTabs();
        renderRecordsHolding();
    }

    // =========================================================================
    // 7. ARCHIVE HOLDINGS RENDERING & DISCLOSURE
    // =========================================================================
    function renderRecordsHolding() {
        if (!recordsContainerEl) return;
        recordsContainerEl.innerHTML = '';

        const currentPeriod = ARCHIVE_PERIODS.find(p => p.id === activePeriodId);
        const records = (currentPeriod && currentPeriod.id === 'period-1')
            ? [MEMORIAL_ENTRIES.find(e => e.id === selectedRecordId) || MEMORIAL_ENTRIES[0]]
            : [];

        // Update Section Counter Badge
        if (holdingCountEl) {
            holdingCountEl.textContent = records.length === 1
                ? '1 RECORD IN CURRENT PHASE'
                : `${records.length} RECORDS IN CURRENT PHASE`;
        }

        // CASE A: Empty State (When period has no verified records)
        if (!records || records.length === 0) {
            const emptyEl = document.createElement('div');
            emptyEl.className = 'empty-holding-card';
            emptyEl.innerHTML = `
                <span class="empty-status-tag">EMPTY REPOSITORY BATCH</span>
                <h3 class="empty-headline">Verified records will appear here.</h3>
                <p class="empty-subtext">Historical records are being prepared.</p>
                <div class="empty-stamp-meta" aria-hidden="true">
                    <span>HOLDING STATUS: 0 VERIFIED ENTRIES</span>
                    <span>&bull;</span>
                    <span>AWAITING INQUIRY ARCHIVE COMMISSION</span>
                </div>
            `;
            recordsContainerEl.appendChild(emptyEl);
            return;
        }

        // CASE B: Record Card with WAI-ARIA Accessible Disclosure Pattern
        records.forEach(rec => {
            const card = document.createElement('article');
            card.className = 'archive-card';
            card.setAttribute('data-record-id', rec.id);

            const btnId = `btn-${rec.id.toLowerCase()}`;
            const panelId = `panel-${rec.id.toLowerCase()}`;
            const isExpanded = activeDossierExpanded;

            const detailsHtml = rec.dossier.details.map(item => `
                <div class="dossier-row">
                    <span class="d-label">${item.label}:</span>
                    <span class="d-val placeholder-val">${item.value}</span>
                </div>
            `).join('');

            card.innerHTML = `
                <div class="card-header-bar">
                    <span class="card-ref-badge">${rec.refCode} &bull; ${rec.displayNum}</span>
                    <span class="card-status-pill">${rec.status}</span>
                </div>

                <div class="card-primary-block">
                    <h3 class="card-name-lead">${rec.dossier.nameLead}</h3>
                    <p class="card-life-narrative">${rec.dossier.lifeNarrative}</p>
                    <p class="card-preview-note">${rec.dossier.previewNote}</p>
                </div>

                <div class="card-action-bar">
                    <button type="button" 
                            class="reveal-btn" 
                            id="${btnId}" 
                            aria-expanded="${isExpanded ? 'true' : 'false'}" 
                            aria-controls="${panelId}">
                        <span class="btn-text">${isExpanded ? rec.dossier.closeButtonLabel : rec.dossier.openButtonLabel}</span>
                        <span class="btn-icon" aria-hidden="true">&darr;</span>
                    </button>
                </div>

                <div class="card-disclosure-panel" 
                     id="${panelId}" 
                     role="region" 
                     aria-labelledby="${btnId}" 
                     ${isExpanded ? '' : 'hidden'}>
                    <div class="panel-inner-content">
                        <div class="dossier-grid">
                            ${detailsHtml}
                        </div>
                        <div class="record-notice-strip">
                            <span class="notice-beacon" aria-hidden="true">&#9679;</span>
                            <span class="notice-text">${rec.dossier.notice}</span>
                        </div>
                    </div>
                </div>
            `;

            // Toggle Handler
            const toggleBtn = card.querySelector(`#${btnId}`);
            const panel = card.querySelector(`#${panelId}`);
            const btnText = toggleBtn.querySelector('.btn-text');

            toggleBtn.addEventListener('click', () => {
                const expanded = toggleBtn.getAttribute('aria-expanded') === 'true';
                const nextState = !expanded;
                activeDossierExpanded = nextState;

                toggleBtn.setAttribute('aria-expanded', String(nextState));
                btnText.textContent = nextState ? rec.dossier.closeButtonLabel : rec.dossier.openButtonLabel;

                if (nextState) {
                    panel.removeAttribute('hidden');
                } else {
                    panel.setAttribute('hidden', '');
                }
            });

            recordsContainerEl.appendChild(card);
        });
    }

    // =========================================================================
    // 8. LIFECYCLE & CLEANUP
    // =========================================================================
    function cleanup() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        if (resumeTimeoutId) {
            clearTimeout(resumeTimeoutId);
            resumeTimeoutId = null;
        }
    }

    window.addEventListener('beforeunload', cleanup);
    window.addEventListener('pagehide', cleanup);

    // =========================================================================
    // 9. INITIALIZATION
    // =========================================================================
    document.addEventListener('DOMContentLoaded', () => {
        initStreamRows();
        initStreamInteractionListeners();
        updateStreamStatusIndicator();
        renderTimelineStrip();
        renderRecordsHolding();

        // Start Auto-Scroll Animation Loop
        currentScrollY = streamViewportEl ? streamViewportEl.scrollTop : 0;
        animationFrameId = requestAnimationFrame(tickAutoScroll);
    });
})();
