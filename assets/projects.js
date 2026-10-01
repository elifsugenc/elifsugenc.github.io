const projectsData = [
  {
    id: 'mode-mystery',
    tabLabel: 'Questions',
    themeColor: '#7a31d7', // purple/blue
    eyeGraphic: `
      <g id="dynamic-pupil" style="transition: transform 0.1s ease-out;">
        <!-- Base pupil abstract shape -->
        <path d="M136 108 C136 89 154 83 165 92 C178 88 188 101 185 120 C183 141 168 149 153 145 C141 141 135 128 136 108Z" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="4 4" />
        <!-- Glowing blue question mark -->
        <text x="160" y="132" font-family="monospace" font-size="40" font-weight="bold" fill="currentColor" text-anchor="middle">?</text>
        <circle cx="160" cy="116" r="25" fill="currentColor" opacity="0.1" />
      </g>
    `,
    projects: [
      { id: 'stray', num: '01', title: 'Is doing nothing doing something<span class="q-mark">?</span>', url: '/projects/stray/', baseIndex: 0 },
      { id: 'bio-decay', num: '02', title: 'How many microplastics can we eat in a day<span class="q-mark">?</span>', url: '/projects/bio-decay/', baseIndex: 1 },
      { id: 'the-earthen', num: '03', title: 'Does death exist because life exists,<br>or does life exist because death exists<span class="q-mark">?</span>', url: '/projects/the-earthen/', baseIndex: 2 },
      { id: 'emek-museum', num: '04', title: 'How to make invisible labor visible<span class="q-mark">?</span>', url: '/projects/emek-museum/', baseIndex: 3 },
      { id: 'traces', num: '05', title: 'Why trace matters<span class="q-mark">?</span>', url: '/projects/traces-together/', baseIndex: 4 },
      { id: 'fire-escape', num: '06', title: 'Can you escape the fire<span class="q-mark">?</span>', url: '/projects/fire-escape-simulation/', baseIndex: 5 },
      { id: 'ara-sira', num: '07', title: 'What do kids want<span class="q-mark">?</span>', url: '/projects/ara-sira/', baseIndex: 6 }
    ]
  },
  {
    id: 'mode-arch',
    tabLabel: 'Architecture & Interior Design',
    themeColor: '#3157d7', // default site blue
    eyeGraphic: `
      <g id="dynamic-pupil" style="transition: transform 0.1s ease-out;">
        <!-- Technical drafting motif -->
        <path d="M136 108 C136 89 154 83 165 92 C178 88 188 101 185 120 C183 141 168 149 153 145 C141 141 135 128 136 108Z" fill="none" stroke="currentColor" stroke-width="1" />
        <line x1="145" y1="116" x2="175" y2="116" stroke="currentColor" stroke-width="1" stroke-dasharray="2 2" />
        <line x1="160" y1="101" x2="160" y2="131" stroke="currentColor" stroke-width="1" stroke-dasharray="2 2" />
        <path d="M160 90 L145 130 h30 Z" fill="none" stroke="currentColor" stroke-width="2" />
      </g>
    `,
    projects: [
      { id: 'emek-museum', num: '06', title: 'Emek Museum<span class="accent">.</span>', url: '/projects/emek-museum/', baseIndex: 3 },
      { id: 'ara-sira', num: '04', title: 'ara-sira<span class="accent">.</span>', url: '/projects/ara-sira/', baseIndex: 6 },
      { id: 'stray', num: '01', title: 'STRAY<span class="accent">.</span>', url: '/projects/stray/', baseIndex: 0 },
      { id: 'bio-decay', num: '02', title: 'Bio-Decay<span class="accent">.</span>', url: '/projects/bio-decay/', baseIndex: 1 },
      { id: 'the-earthen', num: '05', title: 'The Earthen<span class="accent">.</span>', url: '/projects/the-earthen/', baseIndex: 2 },
      { id: 'millieu', num: '07', title: 'Millieu<span class="accent">.</span>', url: '/projects/millieu/', baseIndex: 4 },
      { id: 'chronoclines', num: '08', title: 'ChronoClines<span class="accent">.</span>', url: '/projects/chronoclines/', baseIndex: 5 },
      { id: 'sprouting-garden', num: '09', title: 'Sprouting Garden<span class="accent">.</span>', url: '/projects/sprouting-garden/', baseIndex: 7 },
      { id: 'wood-weave', num: '10', title: 'Wood Weave<span class="accent">.</span>', url: '/projects/wood-weave/', baseIndex: 2 }
    ]
  },
  {
    id: 'mode-tech',
    tabLabel: 'Game Design',
    themeColor: '#1bb5d2', // cyan/blue
    eyeGraphic: `
      <g id="dynamic-pupil" style="transition: transform 0.1s ease-out;">
        <!-- Base pupil outline -->
        <path d="M136 108 C136 89 154 83 165 92 C178 88 188 101 185 120 C183 141 168 149 153 145 C141 141 135 128 136 108Z" fill="none" stroke="currentColor" stroke-width="2" />
        <!-- Pixelated console motif -->
        <path d="M145 98 h30 v30 h-30 z" fill="currentColor"/>
        <path d="M150 103 h20 v12 h-20 z" fill="#fff"/>
        <path d="M152 120 h6 v6 h-6 z" fill="#fff"/>
        <path d="M164 122 h4 v4 h-4 z" fill="#fff"/>
        <!-- CRT scanlines (glitch) -->
        <path d="M130 110 h60 M132 115 h55" stroke="currentColor" stroke-width="1" opacity="0.5" />
      </g>
    `,
    projects: [
      { id: 'fire-escape', num: '03', title: 'Fire Escape Simulation<span class="accent">.</span>', url: '/projects/fire-escape-simulation/', baseIndex: 5 }
    ]
  },
  {
    id: 'mode-art',
    tabLabel: 'Art',
    themeColor: '#4a4a4a', // charcoal/gray
    eyeGraphic: `
      <g id="dynamic-pupil" style="transition: transform 0.1s ease-out;">
        <!-- Charcoal hatching motif -->
        <path d="M136 108 C136 89 154 83 165 92 C178 88 188 101 185 120 C183 141 168 149 153 145 C141 141 135 128 136 108Z" fill="#f4f4f4" stroke="currentColor" stroke-width="1.5" />
        <path d="M145 95 l15 30 M150 95 l15 30 M155 95 l15 30 M140 100 l15 30" stroke="currentColor" stroke-width="1.5" opacity="0.6" />
        <path d="M140 120 l25 -20 M145 125 l25 -20 M150 130 l20 -15" stroke="currentColor" stroke-width="1.5" opacity="0.6" />
      </g>
    `,
    projects: [
      { id: 'traditional', num: '08', title: 'Traditional<span class="accent">.</span>', url: '#', baseIndex: 0 },
      { id: 'digital', num: '09', title: 'Digital<span class="accent">.</span>', url: '#', baseIndex: 1 },
      { id: '3d', num: '10', title: '3D<span class="accent">.</span>', url: '#', baseIndex: 5 }
    ]
  }
];

window.projectsJsLoaded = true;

document.addEventListener("DOMContentLoaded", () => {
    const network = document.getElementById('eye-network');
    if (!network) return;

    let currentModeIndex = -1;
    let isSwitching = false;
    let nodeTimer = null;
    
    // UI Elements
    const linesContainer = document.getElementById('network-lines');
    const eyeSvg = document.querySelector('.sketch-eye-open');
    
    // Create dedicated iris stage inside eye SVG so ONLY iris slides
    let irisStage = document.getElementById('iris-stage');
    if (!irisStage && eyeSvg) {
        const oldPupil = document.getElementById('eye-pupil');
        if (oldPupil) oldPupil.remove();

        irisStage = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        irisStage.id = 'iris-stage';
        eyeSvg.appendChild(irisStage);
    }
    
    // Inject Tabs
    // Inject Mode Carousel (Arrows + Label)
    const carouselContainer = document.createElement('div');
    carouselContainer.className = 'mode-carousel';
    
    const leftArrow = document.createElement('button');
    leftArrow.className = 'carousel-arrow carousel-arrow-left needs-attention';
    leftArrow.innerHTML = '&lt;';
    leftArrow.setAttribute('aria-label', 'Previous Category');
    
    const rightArrow = document.createElement('button');
    rightArrow.className = 'carousel-arrow carousel-arrow-right needs-attention';
    rightArrow.innerHTML = '&gt;';
    rightArrow.setAttribute('aria-label', 'Next Category');
    
    let arrowAttentionTimer = setTimeout(() => {}, 0);
    function resetArrowAttention() {
        leftArrow.classList.remove('needs-attention');
        rightArrow.classList.remove('needs-attention');
        clearTimeout(arrowAttentionTimer);
        arrowAttentionTimer = setTimeout(() => {
            leftArrow.classList.add('needs-attention');
            rightArrow.classList.add('needs-attention');
        }, 4000);
    }
    
    leftArrow.onclick = () => {
        resetArrowAttention();
        switchMode((currentModeIndex - 1 + projectsData.length) % projectsData.length, 'left');
    };
    
    const modeLabelWrapper = document.createElement('div');
    modeLabelWrapper.className = 'carousel-label-wrapper';
    
    const modeLabel = document.createElement('span');
    modeLabel.className = 'carousel-label';
    modeLabelWrapper.appendChild(modeLabel);
    
    rightArrow.onclick = () => {
        resetArrowAttention();
        switchMode((currentModeIndex + 1) % projectsData.length, 'right');
    };
    
    carouselContainer.appendChild(leftArrow);
    carouselContainer.appendChild(modeLabelWrapper);
    carouselContainer.appendChild(rightArrow);
    
    network.appendChild(carouselContainer);

    // Node container - starts with initial-load to appear smoothly 0.5s after connection lines
    const nodesContainer = document.createElement('div');
    nodesContainer.className = 'nodes-container initial-load';
    network.appendChild(nodesContainer);

    setTimeout(() => {
        nodesContainer.classList.remove('initial-load');
    }, 4000);

    // Mouse tracking ONLY applies to dynamic-pupil inside irisStage
    document.addEventListener('mousemove', (e) => {
        const pupilEl = document.getElementById('dynamic-pupil');
        if (pupilEl) {
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;
            pupilEl.style.transform = `translate(${x * 35}px, ${y * 22}px)`;
        }
    });

    const eyeCenter = document.querySelector('.eye-center');
    const sketchEye = document.querySelector('.sketch-eye');
    if (eyeCenter && sketchEye) {
        eyeCenter.addEventListener('click', () => {
            sketchEye.classList.add('is-blinking');
            setTimeout(() => sketchEye.classList.remove('is-blinking'), 80);
        });
    }

    const bases=[[200,230],[800,230],[190,545],[810,540],[500,150],[500,610],[120,370], [880,370]];
    let start = performance.now();
    let activeNodes = [];
    
    const animate = (now) => {
        const t = (now - start) / 1000;
        const count = activeNodes.length;
        if (count > 0) {
            const coords = activeNodes.map((el, i) => {
                const bIdx = parseInt(el.dataset.baseIndex !== undefined ? el.dataset.baseIndex : i);
                const [x, y] = bases[bIdx];
                return [
                    x + Math.sin(t * 0.42 + i * 1.8) * 23,
                    y + Math.cos(t * 0.35 + i * 2.2) * 17
                ];
            });
            
            linesContainer.innerHTML = coords.map(([x,y], i) => 
                `<line x1="500" y1="350" x2="${x}" y2="${y}" class="spoke"/>
                 <circle cx="${x}" cy="${y}" r="4" class="node-dot"/>
                 ${count > 1 ? `<line x1="${x}" y1="${y}" x2="${coords[(i+1)%count][0]}" y2="${coords[(i+1)%count][1]}" class="mesh"/>` : ''}`
            ).join('');

            activeNodes.forEach((el, i) => {
                if (coords[i]) {
                    el.style.left = coords[i][0] / 10 + '%';
                    el.style.top = coords[i][1] / 7 + '%';
                }
            });
        } else {
            linesContainer.innerHTML = '';
        }
        
        if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
            requestAnimationFrame(animate);
        }
    };
    requestAnimationFrame(animate);

    function switchMode(idx, explicitDirection) {
        if (idx === currentModeIndex || isSwitching) return;
        
        if (nodeTimer) clearTimeout(nodeTimer);
        nodesContainer.classList.remove('initial-load');

        const isInitial = (currentModeIndex === -1);
        
        // If left arrow clicked, text slides towards left (1)
        // If right arrow clicked, text slides towards right (-1)
        let direction = 1;
        if (explicitDirection === 'left') direction = 1;
        else if (explicitDirection === 'right') direction = -1;
        else if (!isInitial && idx < currentModeIndex) direction = 1;
        else direction = -1;
        
        if (!isInitial) {
            isSwitching = true;
            
            // Fade out the project buttons and lines when switching
            nodesContainer.style.transition = 'opacity 0.18s ease-out';
            nodesContainer.style.opacity = '0';
            linesContainer.style.transition = 'opacity 0.18s ease-out';
            linesContainer.style.opacity = '0';

            // Slide out the mode label
            modeLabel.style.transition = 'opacity 0.2s ease-out, transform 0.2s ease-out';
            modeLabel.style.opacity = '0';
            modeLabel.style.transform = `translateX(${direction * -20}px)`;

            // Slide out ONLY the iris
            if (irisStage) {
                irisStage.style.transition = 'opacity 0.2s ease-out, transform 0.2s ease-out';
                irisStage.style.opacity = '0';
                irisStage.style.transform = `translateX(${direction * -40}px)`;
            }
        }
        
        setTimeout(() => {
            currentModeIndex = idx;
            const mode = projectsData[idx];

            // Update Label
            modeLabel.textContent = mode.tabLabel;
            if (!isInitial) {
                modeLabel.style.transition = 'none';
                modeLabel.style.transform = `translateX(${direction * 20}px)`;
                void modeLabel.offsetWidth; // Force reflow
                modeLabel.style.transition = 'opacity 0.2s ease-out, transform 0.2s ease-out';
                modeLabel.style.opacity = '1';
                modeLabel.style.transform = 'translateX(0)';
            }

            // Update Theme Color dynamically
            document.documentElement.style.setProperty('--primary', mode.themeColor);

            // Update Pupil inside irisStage and slide it in
            if (irisStage) {
                irisStage.innerHTML = mode.eyeGraphic;
                if (!isInitial) {
                    irisStage.style.transition = 'none';
                    irisStage.style.transform = `translateX(${direction * 40}px)`;
                    irisStage.style.opacity = '0';
                    void irisStage.offsetWidth; // Force reflow
                    irisStage.style.transition = 'opacity 0.25s ease-out, transform 0.25s ease-out';
                    irisStage.style.opacity = '1';
                    irisStage.style.transform = 'translateX(0)';
                }
            }

            // Create new project nodes with initial coordinates pre-set to prevent sticking at top!
            nodesContainer.innerHTML = '';
            activeNodes = mode.projects.map((proj, i) => {
                const a = document.createElement('a');
                const bIdx = proj.baseIndex !== undefined ? proj.baseIndex : i;
                a.className = `network-project network-project-${bIdx + 1}`;
                a.href = proj.url;
                a.dataset.baseIndex = bIdx;
                if (bases[bIdx]) {
                    a.style.left = bases[bIdx][0] / 10 + '%';
                    a.style.top = bases[bIdx][1] / 7 + '%';
                }
                a.innerHTML = `<span>${proj.title}</span><span class="network-arrow">&#x2197;</span>`;
                nodesContainer.appendChild(a);
                return a;
            });

            start = performance.now();
            
            if (!isInitial) {
                // Nodes wait 0.5s (500ms) after transition, then smoothly appear at their positions!
                nodeTimer = setTimeout(() => {
                    nodesContainer.style.transition = 'opacity 0.35s ease-out';
                    nodesContainer.style.opacity = '1';
                    linesContainer.style.transition = 'opacity 0.35s ease-out';
                    linesContainer.style.opacity = '1';
                    isSwitching = false;
                }, 500);
            } else {
                isSwitching = false;
            }
            
        }, isInitial ? 0 : 200);
    }

    // Clean up old static HTML nodes
    Array.from(network.querySelectorAll('.network-project')).forEach(el => el.remove());

    // Initialize first mode
    switchMode(0);
});
