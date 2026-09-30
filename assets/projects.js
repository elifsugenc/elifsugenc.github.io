const projectsData = [
  {
    id: 'mode-tech',
    tabLabel: 'Games / Creative Tech',
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
      { id: 'stray', num: '01', title: 'STRAY', url: '/projects/stray/' },
      { id: 'bio-decay', num: '02', title: 'Bio-Decay', url: '/projects/bio-decay/' },
      { id: 'fire-escape', num: '03', title: 'Fire Escape Simulation', url: '/projects/fire-escape-simulation/' }
    ]
  },
  {
    id: 'mode-mystery',
    tabLabel: 'The Mystery / Q&A',
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
      { id: 'ara-sira', num: '04', title: 'ara-sira', url: '/projects/ara-sira/' }
    ]
  },
  {
    id: 'mode-art',
    tabLabel: 'Traditional Art & Sketches',
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
      { id: 'the-earthen', num: '05', title: 'The Earthen', url: '/projects/the-earthen/' }
    ]
  },
  {
    id: 'mode-arch',
    tabLabel: 'Architecture & Spatial',
    themeColor: '#0f295e', // blueprint navy
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
      { id: 'emek-museum', num: '06', title: 'Emek Museum', url: '/projects/emek-museum/' }
    ]
  }
];

window.projectsJsLoaded = true;

document.addEventListener("DOMContentLoaded", () => {
    const network = document.getElementById('eye-network');
    if (!network) return;

    let currentModeIndex = -1;
    let isSwitching = false;
    
    // UI Elements
    const linesContainer = document.getElementById('network-lines');
    const eyeSvg = document.querySelector('.sketch-eye-open');
    
    // Create dedicated iris stage inside eye SVG so ONLY iris slides
    let irisStage = document.getElementById('iris-stage');
    if (!irisStage && eyeSvg) {
        // Clean up old static HTML pupil
        const oldPupil = document.getElementById('eye-pupil');
        if (oldPupil) oldPupil.remove();

        irisStage = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        irisStage.id = 'iris-stage';
        eyeSvg.appendChild(irisStage);
    }
    
    // Inject Tabs
    const heading = document.querySelector('.eye-heading');
    const tabsContainer = document.createElement('div');
    tabsContainer.className = 'category-tabs';
    projectsData.forEach((mode, idx) => {
        const btn = document.createElement('button');
        btn.textContent = mode.tabLabel;
        btn.className = 'category-tab-btn';
        btn.onclick = () => switchMode(idx);
        tabsContainer.appendChild(btn);
    });
    heading.appendChild(tabsContainer);

    // Inject Arrows
    const leftArrow = document.createElement('button');
    leftArrow.className = 'nav-arrow nav-arrow-left';
    leftArrow.innerHTML = '&lt;';
    leftArrow.setAttribute('aria-label', 'Previous Category');
    leftArrow.onclick = () => switchMode((currentModeIndex - 1 + projectsData.length) % projectsData.length);
    
    const rightArrow = document.createElement('button');
    rightArrow.className = 'nav-arrow nav-arrow-right';
    rightArrow.innerHTML = '&gt;';
    rightArrow.setAttribute('aria-label', 'Next Category');
    rightArrow.onclick = () => switchMode((currentModeIndex + 1) % projectsData.length);
    
    network.appendChild(leftArrow);
    network.appendChild(rightArrow);

    // Node container - starts with initial-load to appear together with connection lines
    const nodesContainer = document.createElement('div');
    nodesContainer.className = 'nodes-container initial-load';
    network.appendChild(nodesContainer);

    setTimeout(() => {
        nodesContainer.classList.remove('initial-load');
    }, 3200);

    // Mouse tracking ONLY applies to dynamic-pupil inside irisStage
    document.addEventListener('mousemove', (e) => {
        const pupilEl = document.getElementById('dynamic-pupil');
        if (pupilEl) {
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;
            pupilEl.style.transform = `translate(${x * 35}px, ${y * 22}px)`;
        }
    });

    const bases=[[175,172],[820,174],[190,545],[810,540],[500,90],[500,610],[120,350], [880,350]];
    let start = performance.now();
    let activeNodes = [];
    
    const animate = (now) => {
        const t = (now - start) / 1000;
        const count = activeNodes.length;
        if (count > 0) {
            const coords = bases.slice(0, count).map(([x,y], i) => [
                x + Math.sin(t * 0.42 + i * 1.8) * 23,
                y + Math.cos(t * 0.35 + i * 2.2) * 17
            ]);
            
            linesContainer.innerHTML = coords.map(([x,y], i) => 
                `<line x1="500" y1="350" x2="${x}" y2="${y}" class="spoke"/>
                 <circle cx="${x}" cy="${y}" r="4" class="node-dot"/>
                 <line x1="${x}" y1="${y}" x2="${coords[(i+1)%count][0]}" y2="${coords[(i+1)%count][1]}" class="mesh"/>`
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

    function switchMode(idx) {
        if (idx === currentModeIndex || isSwitching) return;
        
        nodesContainer.classList.remove('initial-load');

        const isInitial = (currentModeIndex === -1);
        const direction = (!isInitial && idx > currentModeIndex) ? -1 : 1;
        
        if (!isInitial) {
            isSwitching = true;
            
            // Slide out ONLY the iris and project buttons
            if (irisStage) {
                irisStage.style.transition = 'opacity 0.2s ease-out, transform 0.2s ease-out';
                irisStage.style.opacity = '0';
                irisStage.style.transform = `translateX(${direction * -40}px)`;
            }

            nodesContainer.style.transition = 'opacity 0.2s ease-out, transform 0.2s ease-out';
            nodesContainer.style.opacity = '0';
            nodesContainer.style.transform = `translateX(${direction * -25}px)`;
        }
        
        setTimeout(() => {
            currentModeIndex = idx;
            const mode = projectsData[idx];

            // Update tabs
            Array.from(tabsContainer.children).forEach((btn, i) => {
                btn.classList.toggle('active', i === idx);
            });

            // Update Theme Color dynamically
            document.documentElement.style.setProperty('--primary', mode.themeColor);

            // Update Pupil inside irisStage
            if (irisStage) {
                irisStage.innerHTML = mode.eyeGraphic;
            }

            // Update project nodes
            nodesContainer.innerHTML = '';
            activeNodes = mode.projects.map((proj, i) => {
                const a = document.createElement('a');
                a.className = `network-project network-project-${i + 1}`;
                a.href = proj.url;
                a.innerHTML = `<span class="network-number">${proj.num}</span><span>${proj.title}<span class="accent">.</span></span><span class="network-arrow">&#x2197;</span>`;
                nodesContainer.appendChild(a);
                return a;
            });

            start = performance.now();
            
            if (!isInitial) {
                // Slide in from opposite side
                if (irisStage) {
                    irisStage.style.transition = 'none';
                    irisStage.style.transform = `translateX(${direction * 40}px)`;
                    irisStage.style.opacity = '0';
                }

                nodesContainer.style.transition = 'none';
                nodesContainer.style.transform = `translateX(${direction * 25}px)`;
                nodesContainer.style.opacity = '0';

                if (irisStage) void irisStage.offsetWidth; // Force reflow
                void nodesContainer.offsetWidth;

                if (irisStage) {
                    irisStage.style.transition = 'opacity 0.25s ease-out, transform 0.25s ease-out';
                    irisStage.style.opacity = '1';
                    irisStage.style.transform = 'translateX(0)';
                }

                nodesContainer.style.transition = 'opacity 0.25s ease-out, transform 0.25s ease-out';
                nodesContainer.style.opacity = '1';
                nodesContainer.style.transform = 'translateX(0)';

                setTimeout(() => {
                    isSwitching = false;
                }, 260);
            }
            
        }, isInitial ? 0 : 200);
    }

    // Clean up old static HTML nodes
    Array.from(network.querySelectorAll('.network-project')).forEach(el => el.remove());

    // Initialize first mode
    switchMode(0);
});
