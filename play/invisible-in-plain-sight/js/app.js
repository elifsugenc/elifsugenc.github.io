import { NARRATIVE } from '../data/narrative.js';

// --- State ---
const state = {
    started: false,
    ended: false,
    interactedCount: 0,
    maxFigures: 50,
    event10Triggered: false,
    event35Triggered: false,
    zoomProgress: 0, // 0 to 1
    figures: []
};

// --- DOM ---
const canvas = document.getElementById('experience-canvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('start-btn');
const startScreen = document.getElementById('start-screen');
const quoteText = document.getElementById('quote-text');
const intrusiveOverlay = document.getElementById('intrusive-overlay');
const intrusiveText = document.getElementById('intrusive-text');

let W, H;
function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// --- Audio System ---
let audioCtx;
let masterGain;

function initAudio() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 1.0;
    
    // Slight room reverb/muffle on master
    const masterFilter = audioCtx.createBiquadFilter();
    masterFilter.type = 'lowpass';
    masterFilter.frequency.value = 2000;
    
    masterGain.connect(masterFilter);
    masterFilter.connect(audioCtx.destination);
    
    // Background room tone
    const roomTone = audioCtx.createBufferSource();
    const rtBuffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 2, audioCtx.sampleRate);
    const rtData = rtBuffer.getChannelData(0);
    for(let i=0; i<rtData.length; i++) rtData[i] = (Math.random()*2-1) * 0.003;
    roomTone.buffer = rtBuffer;
    roomTone.loop = true;
    
    const rtFilter = audioCtx.createBiquadFilter();
    rtFilter.type = 'lowpass';
    rtFilter.frequency.value = 400;
    
    roomTone.connect(rtFilter);
    rtFilter.connect(masterGain);
    roomTone.start();
}

function generateSpeechBuffer() {
    const duration = 5 + Math.random() * 3;
    const sampleRate = audioCtx.sampleRate;
    const bufSize = Math.floor(sampleRate * duration);
    const buffer = audioCtx.createBuffer(1, bufSize, sampleRate);
    const data = buffer.getChannelData(0);
    
    const isMale = Math.random() > 0.4; 
    let baseFreq = isMale ? (100 + Math.random()*30) : (180 + Math.random()*40);
    
    let pos = 0;
    while (pos < bufSize) {
        const syllables = 2 + Math.floor(Math.random() * 6);
        for (let s = 0; s < syllables; s++) {
            const sylLen = Math.floor(sampleRate * (0.12 + Math.random() * 0.18));
            const pauseLen = Math.floor(sampleRate * (0.01 + Math.random() * 0.05));
            const freqTarget = baseFreq * (0.85 + Math.random() * 0.3);
            let currentFreq = baseFreq;
            let phase = 0;
            
            for(let i=0; i<sylLen && pos < bufSize; i++) {
                currentFreq += (freqTarget - currentFreq) * 0.002; 
                phase += currentFreq / sampleRate;
                let val = (phase % 1) * 2 - 1; 
                val = val * 0.7 + Math.sin(phase * Math.PI * 2) * 0.3;
                let env = 1;
                const attack = Math.floor(sampleRate * 0.04);
                const release = Math.floor(sampleRate * 0.08);
                if (i < attack) env = i / attack;
                else if (i > sylLen - release) env = (sylLen - i) / release;
                data[pos++] = val * env;
            }
            for(let i=0; i<pauseLen && pos < bufSize; i++) data[pos++] = 0;
        }
        const phrasePauseLen = Math.floor(sampleRate * (0.5 + Math.random() * 1.5));
        for(let i=0; i<phrasePauseLen && pos < bufSize; i++) data[pos++] = 0;
    }
    return buffer;
}

function addMumblingVoice(panX) {
    if(!audioCtx) return;
    const buffer = generateSpeechBuffer();
    const source = audioCtx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    
    const formant = audioCtx.createBiquadFilter();
    formant.type = 'bandpass';
    formant.frequency.value = 400 + Math.random() * 300; 
    formant.Q.value = 1.5 + Math.random() * 1.5;
    
    const lowpass = audioCtx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 900 + Math.random() * 400;
    
    const panner = audioCtx.createStereoPanner();
    panner.pan.value = (panX - 0.5) * 1.5; // slight stereo spread
    
    const voiceGain = audioCtx.createGain();
    voiceGain.gain.setValueAtTime(0, audioCtx.currentTime);
    const targetVolume = 0.05 + Math.random() * 0.02; 
    voiceGain.gain.linearRampToValueAtTime(targetVolume, audioCtx.currentTime + 3.0);
    
    source.connect(formant);
    formant.connect(lowpass);
    lowpass.connect(panner);
    panner.connect(voiceGain);
    voiceGain.connect(masterGain);
    
    source.start(0, Math.random() * buffer.duration);
}

function playMaleLaughter() {
    if(!audioCtx) return;
    const sampleRate = audioCtx.sampleRate;
    const bufSize = Math.floor(sampleRate * 3.0);
    const buffer = audioCtx.createBuffer(1, bufSize, sampleRate);
    const data = buffer.getChannelData(0);
    
    let pos = 0;
    let baseFreq = 140; 
    for (let ha = 0; ha < 6; ha++) { 
        const sylLen = Math.floor(sampleRate * 0.12);
        const pauseLen = Math.floor(sampleRate * 0.15);
        let phase = 0;
        for (let i=0; i<sylLen && pos < bufSize; i++) {
            phase += baseFreq / sampleRate;
            let val = (phase % 1) * 2 - 1; 
            let env = 1;
            if (i < 200) env = i/200;
            else if (i > sylLen - 1000) env = (sylLen - i)/1000;
            data[pos++] = val * env;
        }
        for(let i=0; i<pauseLen && pos < bufSize; i++) data[pos++] = 0;
        baseFreq *= 0.92; 
    }
    
    const source = audioCtx.createBufferSource();
    source.buffer = buffer;
    
    const formant = audioCtx.createBiquadFilter();
    formant.type = 'bandpass';
    formant.frequency.value = 800;
    formant.Q.value = 3.0;
    
    const distFilter = audioCtx.createBiquadFilter();
    distFilter.type = 'lowpass';
    distFilter.frequency.value = 1000;
    
    const gain = audioCtx.createGain();
    gain.gain.value = 0.5;
    
    source.connect(formant);
    formant.connect(gain);
    gain.connect(distFilter);
    distFilter.connect(masterGain);
    
    source.start();
}

// --- Visual System ---

function seededRandom(seed) {
    return function() {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    };
}

function initFigures() {
    const rand = seededRandom(12345);
    state.figures = [];
    
    for (let i = 0; i < state.maxFigures; i++) {
        // Fisheye mapping (all 50 figures visible in a curve)
        let fx, fy, valid = false;
        let attempts = 0;
        let distanceOffset = 0;
        let angleNorm = 0;
        
        while (!valid && attempts < 200) {
            angleNorm = rand(); // 0 to 1 horizontally
            distanceOffset = rand() * 0.5; // depth variation
            
            fx = angleNorm;
            
            // Fisheye depth curve: Center (0.5) is close, edges (0, 1) curve away
            const distFromCenter = Math.abs(fx - 0.5) * 2.0; 
            const curveDepth = distFromCenter * distFromCenter; 
            
            // Base fy: 0.85 (bottom, close) up to 0.45 (top, far)
            fy = 0.85 - (curveDepth * 0.25) - (distanceOffset * 0.15);

            valid = true;
            for (let j = 0; j < i; j++) {
                const dx = state.figures[j].fx - fx;
                const dy = state.figures[j].fy - fy;
                if (dx*dx + dy*dy < 0.001) {
                    valid = false;
                    break;
                }
            }
            attempts++;
        }
        
        const distFromCenter = Math.abs(fx - 0.5) * 2.0;
        const fisheyeScale = 1.0 - (distFromCenter * 0.3); // Edges look smaller
        const baseScale = (0.55 + (1.0 - distanceOffset) * 0.45) * fisheyeScale;
        const rotation = (angleNorm - 0.5) * 0.3; // Tilt inwards at edges
        
        state.figures.push({
            id: i,
            fx, fy,
            baseScale,
            rotation,
            revealed: false,
            hoverProgress: 0,
            textIndex: i % NARRATIVE.phase2.figureRevealTexts.length
        });
    }
    
    // Sort by depth so closer figures draw last (on top)
    state.figures.sort((a, b) => a.fy - b.fy);
}

function drawSilhouette(ctx, x, y, scale, alpha, rotation) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.scale(scale, scale);

    ctx.beginPath();
    const h = 55; 
    const w = 16;
    
    ctx.moveTo(-w/2, 0);
    ctx.quadraticCurveTo(-w/2, -h*0.7, -w*0.3, -h + 10);
    
    // Head
    ctx.bezierCurveTo(-w*0.7, -h - 5, -w*0.5, -h - 22, 0, -h - 22);
    ctx.bezierCurveTo(w*0.5, -h - 22, w*0.7, -h - 5, w*0.3, -h + 10);
    
    ctx.quadraticCurveTo(w/2, -h*0.7, w/2, 0);
    ctx.closePath();
    
    ctx.fillStyle = "#2c2c28"; // Unrevealed color
    ctx.fill();
    ctx.restore();
}

function drawBackground() {
    // Solid background
    ctx.fillStyle = "#1a1a18";
    ctx.fillRect(0, 0, W, H);
    
    // Perspective Grid (Critical Matter vibe)
    ctx.save();
    ctx.strokeStyle = `rgba(139,115,85,${0.03 + state.zoomProgress * 0.08})`; 
    ctx.lineWidth = 1;
    const gridCols = 24;
    const gridRows = 12;
    const vanishY = H * (0.45 + state.zoomProgress * 0.05); // slightly shifts up
    const floorH = H - vanishY;
    
    // Vertical lines (stable center!)
    for (let i = 0; i <= gridCols; i++) {
        const xTop = W * 0.5; // Always centered!
        const spread = (i / gridCols) - 0.5;
        // The bottom spread decreases as zoomProgress increases
        const xBot = W * 0.5 + (spread * W * (2.5 - state.zoomProgress * 1.5));
        
        ctx.beginPath();
        ctx.moveTo(xTop, vanishY);
        ctx.lineTo(xBot, H);
        ctx.stroke();
    }
    
    // Horizontal lines
    for (let j = 1; j <= gridRows; j++) {
        const factor = Math.pow(j / gridRows, 1.8 - state.zoomProgress * 0.5);
        const yLine = vanishY + factor * floorH;
        ctx.beginPath();
        ctx.moveTo(0, yLine);
        ctx.lineTo(W, yLine);
        ctx.stroke();
    }
    ctx.restore();
    
    // Vignette
    const vigAlpha = 0.3 + state.zoomProgress * 0.5;
    const vigGrad = ctx.createRadialGradient(W / 2, H / 2, H * 0.2, W / 2, H / 2, H * 0.9);
    vigGrad.addColorStop(0, `rgba(0,0,0,0)`);
    vigGrad.addColorStop(1, `rgba(0,0,0,${vigAlpha})`);
    ctx.fillStyle = vigGrad;
    ctx.fillRect(0, 0, W, H);
}

// --- Game Loop ---
let pointerX = -1;
let pointerY = -1;

canvas.addEventListener('mousemove', (e) => {
    pointerX = e.clientX;
    pointerY = e.clientY;
});

function render() {
    if (!state.started) {
        requestAnimationFrame(render);
        return;
    }
    
    drawBackground();
    
    let hoveredFig = null;
    
    // Zoom/Compression modifies position scaling
    const comp = state.zoomProgress;
    
    for (let fig of state.figures) {
        // Apply spatial compression logic for zoom-out
        const margin = comp * 0.15;
        const mappedFx = margin + fig.fx * (1 - margin * 2);
        const mappedFy = margin * 0.5 + fig.fy * (1 - margin * 0.7);
        
        const x = W * mappedFx;
        const y = H * Math.pow(mappedFy, 1.2 - comp * 0.3);
        const scale = fig.baseScale * (0.4 + mappedFy * 0.6);
        
        // Interaction logic
        const dx = pointerX - x;
        const dy = pointerY - (y - 30 * scale);
        const r = 40 * scale;
        
        const isHovered = (dx*dx + dy*dy < r*r);
        if (isHovered && !fig.revealed && !hoveredFig) {
            hoveredFig = fig;
        }
        
        if (hoveredFig === fig) {
            fig.hoverProgress += 0.05;
            if (fig.hoverProgress >= 1.0) {
                // Reveal!
                fig.revealed = true;
                state.interactedCount++;
                showQuote(NARRATIVE.phase2.figureRevealTexts[fig.textIndex]);
                addMumblingVoice(fig.fx);
                checkMilestones();
            }
        } else {
            fig.hoverProgress = Math.max(0, fig.hoverProgress - 0.1);
        }
        
        // Draw focus ring
        if (fig.hoverProgress > 0 && !fig.revealed) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(196,168,130,0.5)`;
            ctx.lineWidth = 2;
            ctx.arc(x, y - 30 * scale, r * 1.2, -Math.PI/2, -Math.PI/2 + Math.PI * 2 * fig.hoverProgress);
            ctx.stroke();
        }
        
        // Draw Figure
        const alpha = fig.revealed ? 0.9 : 0.4 + fig.hoverProgress * 0.3;
        drawSilhouette(ctx, x, y, scale, alpha, fig.rotation);
        
        // Draw orange overlay if revealed
        if (fig.revealed) {
            ctx.save();
            ctx.globalCompositeOperation = "source-atop"; // wait, standard canvas needs manual mask for this.
            // simpler: just draw again with orange and low alpha
            ctx.fillStyle = "#e67e22";
            ctx.globalAlpha = 0.5;
            ctx.translate(x, y);
            ctx.rotate(fig.rotation);
            ctx.scale(scale, scale);
            ctx.beginPath();
            const h = 55, w = 16;
            ctx.moveTo(-w/2, 0);
            ctx.quadraticCurveTo(-w/2, -h*0.7, -w*0.3, -h + 10);
            ctx.bezierCurveTo(-w*0.7, -h - 5, -w*0.5, -h - 22, 0, -h - 22);
            ctx.bezierCurveTo(w*0.5, -h - 22, w*0.7, -h - 5, w*0.3, -h + 10);
            ctx.quadraticCurveTo(w/2, -h*0.7, w/2, 0);
            ctx.fill();
            ctx.restore();
        }
    }
    
    // Zoom interpolation
    if (state.event35Triggered && !state.ended) {
        state.zoomProgress += (1.0 - state.zoomProgress) * 0.005; 
    }
    
    requestAnimationFrame(render);
}

// --- Event Logic ---

let quoteTimeout;
function showQuote(text) {
    quoteText.textContent = text;
    quoteText.style.opacity = 1;
    clearTimeout(quoteTimeout);
    quoteTimeout = setTimeout(() => {
        quoteText.style.opacity = 0;
    }, 4000);
}

function triggerIntrusiveSequence(message) {
    intrusiveOverlay.style.display = "flex";
    intrusiveText.textContent = message;
    intrusiveText.style.opacity = 1;
    
    let glitches = 0;
    const interval = setInterval(() => {
        glitches++;
        if (glitches >= 5) {
            clearInterval(interval);
            intrusiveText.style.opacity = 0;
            setTimeout(() => { intrusiveOverlay.style.display = "none"; }, 500);
            return;
        }
        
        intrusiveText.style.transform = `translate(${Math.random()*40-20}px, ${Math.random()*40-20}px) scale(1.05)`;
        intrusiveText.style.textShadow = "4px 0 0 red, -4px 0 0 cyan, 0px 5px 25px rgba(0,0,0,0.9)";
        
        setTimeout(() => {
            intrusiveText.style.transform = "none";
            intrusiveText.style.textShadow = "0px 5px 25px rgba(0,0,0,0.9)";
        }, 150);
        
    }, 2000);
}

function checkMilestones() {
    if (state.interactedCount === 10 && !state.event10Triggered) {
        state.event10Triggered = true;
        triggerIntrusiveSequence("The voices were getting louder, but no one was opening their mouth.");
    }
    
    if (state.interactedCount === 35 && !state.event35Triggered) {
        state.event35Triggered = true;
        triggerIntrusiveSequence("There were so many of them now.");
        playMaleLaughter();
    }
    
    if (state.interactedCount === state.maxFigures && !state.ended) {
        state.ended = true;
        setTimeout(() => {
            document.getElementById('end-screen').style.opacity = 1;
            document.getElementById('end-screen').style.pointerEvents = "all";
            setTimeout(() => {
                document.getElementById('end-subtext').style.opacity = 1;
            }, 3000);
        }, 2000);
    }
}

// --- Init ---
startBtn.addEventListener('click', () => {
    startScreen.style.opacity = 0;
    setTimeout(() => {
        startScreen.style.display = "none";
        initAudio();
        initFigures();
        state.started = true;
        
        // Show top text and glitch it every 3 seconds
        const topText = document.getElementById('top-glitch-text');
        topText.style.opacity = 1;
        setInterval(() => {
            if (Math.random() > 0.3) { // 70% chance to glitch every 3s
                topText.style.transform = `translate(${Math.random()*10-5}px, ${Math.random()*10-5}px)`;
                topText.style.textShadow = "2px 0 0 red, -2px 0 0 cyan";
                setTimeout(() => {
                    topText.style.transform = "none";
                    topText.style.textShadow = "0 0 10px rgba(0,0,0,0.8)";
                }, 150);
            }
        }, 3000);
    }, 2000);
});

requestAnimationFrame(render);
