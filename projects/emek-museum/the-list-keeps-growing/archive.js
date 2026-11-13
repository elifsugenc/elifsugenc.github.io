/**
 * THE LIST KEEPS GROWING — INTERACTIVE MEMORIAL ARCHIVE
 * Independent Archive Data Structure & Interaction Controller
 * Emek Museum // INT401 Studio
 */

(function () {
    'use strict';

    // =========================================================================
    // 1. ARCHIVE DATA REPOSITORY (SEPARATED FROM VIEW RENDERING)
    // Structured to accept verified historical records once confirmed.
    // Contains strictly conceptual placeholder entities in initial deployment.
    // =========================================================================
    const ARCHIVE_PERIODS = [
        {
            id: 'period-1',
            label: 'Archive Period 1',
            phaseCode: 'PHASE 01 // INITIAL REPOSITORY',
            status: 'CONCEPTUAL PREVIEW',
            records: [
                {
                    id: 'REC-001',
                    referenceCode: 'ARCHIVE REF // EM-001',
                    statusPill: 'PENDING VERIFICATION',
                    nameLead: 'A name.',
                    lifeNarrative: 'A life. A family. A story that should not have ended this way.',
                    previewNote: 'Conceptual interaction preview — not a historical record.',
                    openButtonLabel: 'Reveal the story',
                    closeButtonLabel: 'Hide the story',
                    // Revealed fields upon disclosure (strictly ethical placeholders)
                    details: [
                        { label: 'RECORDED IDENTITY', value: '[Verified name will appear here]' },
                        { label: 'LABOUR / OCCUPATION', value: '[Verified occupation / role will appear here]' },
                        { label: 'INCIDENT BASIN / PIT', value: '[Verified basin / pit location will appear here]' },
                        { label: 'BIOGRAPHICAL NARRATIVE', value: '[Verified story will appear here]' }
                    ],
                    notice: 'Historical records are being prepared.'
                }
            ]
        },
        {
            id: 'period-2',
            label: 'Archive Period 2',
            phaseCode: 'PHASE 02 // SUBSEQUENT ACCUMULATION',
            status: 'AWAITING FIELD VERIFICATION',
            records: [] // Empty state demonstrating non-fabricated integrity
        },
        {
            id: 'period-3',
            label: 'Archive Period 3',
            phaseCode: 'PHASE 03 // ONGOING CIVIC MEMORIAL',
            status: 'AWAITING FIELD VERIFICATION',
            records: [] // Empty state demonstrating non-fabricated integrity
        }
    ];

    // State
    let activePeriodId = ARCHIVE_PERIODS[0].id;

    // DOM Elements
    const timelineStripEl = document.getElementById('timeline-strip');
    const recordsContainerEl = document.getElementById('records-container');
    const holdingCountEl = document.getElementById('holding-count');

    // =========================================================================
    // 2. TIMELINE STRIP RENDERING & TAB CONTROLS
    // =========================================================================
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

    // Accessible Keyboard Navigation for Timeline Tabs
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

        // Update Tab States
        const tabs = timelineStripEl.querySelectorAll('.timeline-period-btn');
        tabs.forEach(tab => {
            const isSelected = tab.id === `tab-${periodId}`;
            tab.classList.toggle('active', isSelected);
            tab.setAttribute('aria-selected', isSelected ? 'true' : 'false');
            tab.tabIndex = isSelected ? 0 : -1;
        });

        // Render Archive Holding for selected period
        renderRecordsHolding();
    }

    // =========================================================================
    // 3. ARCHIVE HOLDINGS RENDERING & DISCLOSURE INTERACTION
    // =========================================================================
    function renderRecordsHolding() {
        if (!recordsContainerEl) return;
        recordsContainerEl.innerHTML = '';

        const currentPeriod = ARCHIVE_PERIODS.find(p => p.id === activePeriodId);
        const records = currentPeriod ? currentPeriod.records : [];

        // Update Section Counter Badge
        if (holdingCountEl) {
            holdingCountEl.textContent = records.length === 1
                ? '1 RECORD IN CURRENT PHASE'
                : `${records.length} RECORDS IN CURRENT PHASE`;
        }

        // CASE A: Empty State (No verified records)
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

        // CASE B: Record Cards with Accessible Disclosure Pattern
        records.forEach(rec => {
            const card = document.createElement('article');
            card.className = 'archive-card';
            card.setAttribute('data-record-id', rec.id);

            const btnId = `btn-${rec.id.toLowerCase()}`;
            const panelId = `panel-${rec.id.toLowerCase()}`;

            const detailsHtml = rec.details.map(item => `
                <div class="dossier-row">
                    <span class="d-label">${item.label}:</span>
                    <span class="d-val placeholder-val">${item.value}</span>
                </div>
            `).join('');

            card.innerHTML = `
                <div class="card-header-bar">
                    <span class="card-ref-badge">${rec.referenceCode}</span>
                    <span class="card-status-pill">${rec.statusPill}</span>
                </div>

                <div class="card-primary-block">
                    <h3 class="card-name-lead">${rec.nameLead}</h3>
                    <p class="card-life-narrative">${rec.lifeNarrative}</p>
                    <p class="card-preview-note">${rec.previewNote}</p>
                </div>

                <div class="card-action-bar">
                    <button type="button" 
                            class="reveal-btn" 
                            id="${btnId}" 
                            aria-expanded="false" 
                            aria-controls="${panelId}">
                        <span class="btn-text">${rec.openButtonLabel}</span>
                        <span class="btn-icon" aria-hidden="true">&darr;</span>
                    </button>
                </div>

                <div class="card-disclosure-panel" 
                     id="${panelId}" 
                     role="region" 
                     aria-labelledby="${btnId}" 
                     hidden>
                    <div class="panel-inner-content">
                        <div class="dossier-grid">
                            ${detailsHtml}
                        </div>
                        <div class="record-notice-strip">
                            <span class="notice-beacon" aria-hidden="true">&#9679;</span>
                            <span class="notice-text">${rec.notice}</span>
                        </div>
                    </div>
                </div>
            `;

            // Wire up disclosure interaction
            const toggleBtn = card.querySelector(`#${btnId}`);
            const panel = card.querySelector(`#${panelId}`);
            const btnText = toggleBtn.querySelector('.btn-text');

            toggleBtn.addEventListener('click', () => {
                const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
                const nextState = !isExpanded;

                toggleBtn.setAttribute('aria-expanded', String(nextState));
                btnText.textContent = nextState ? rec.closeButtonLabel : rec.openButtonLabel;

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
    // 4. INITIALIZATION
    // =========================================================================
    document.addEventListener('DOMContentLoaded', () => {
        renderTimelineStrip();
        renderRecordsHolding();
    });
})();
