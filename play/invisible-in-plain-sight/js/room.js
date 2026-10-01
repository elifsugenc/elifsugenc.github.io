/**
 * room.js
 * Canvas-based interactive room for "invisible in plain sight."
 * Handles silhouette generation, attention-based reveals, and spatial compression.
 */

import { NARRATIVE, SETTINGS } from "../data/narrative.js";

const P = SETTINGS.palette;
const T = SETTINGS.timing;

/** Seeded pseudo-random for deterministic layout */
function seededRand(seed) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/** Generate a human silhouette path on a canvas context */
function drawSilhouette(ctx, x, y, scale, alpha, variant = 0) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  // Unstretched, natural proportions
  ctx.beginPath();
  const h = 55 + variant * 5; // Less extreme variation
  const w = 16 + variant * 3;
  
  ctx.moveTo(-w/2, 0);
  ctx.quadraticCurveTo(-w/2, -h*0.7, -w*0.3, -h + 10);
  
  // Head loop
  ctx.bezierCurveTo(-w*0.7, -h - 5, -w*0.5, -h - 22, 0, -h - 22);
  ctx.bezierCurveTo(w*0.5, -h - 22, w*0.7, -h - 5, w*0.3, -h + 10);
  
  ctx.quadraticCurveTo(w/2, -h*0.7, w/2, 0);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

export class Room {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.figures = [];
    this.phase = 1;
    this.compression = 0; // 0–1, increases in phase 4
    this.revealedContradictions = new Set();
    this.focusTarget = null;
    this.focusTimer = 0;
    this.focusDwellMs = T.focusDwellMs;
    this.reducedMotion = options.reducedMotion || false;
    this.grainOffset = 0;
    this.grainCanvas = document.createElement("canvas");
    this.grainCtx = this.grainCanvas.getContext("2d");
    this.narratorTextQueue = [];
    this.activeNarratorText = null;
    this.narratorTextAlpha = 0;
    this.lastTime = 0;
    this.onReveal = options.onReveal || (() => {});
    this.onContradiction = options.onContradiction || (() => {});
    this.onPhaseComplete = options.onPhaseComplete || (() => {});
    this.onWhisper = options.onWhisper || (() => {});
    this._phaseCompleteEmitted = new Set();
    this._figureRevealCount = 0;
    this._contradictionCount = 0;
    this._animId = null;
    this._pointerX = null;
    this._pointerY = null;
    this._keyboardIndex = 0;
    this.traces = [];
    this._generateFigures();
    this._generateGrain();
  }

  _generateFigures() {
    const rand = seededRand(42);
    const W = this.canvas.width;
    const H = this.canvas.height;
    const cfg = SETTINGS.room;
    const contradictionTexts = NARRATIVE.phase3.contradictions;
    const revealTexts = NARRATIVE.phase2.figureRevealTexts;

    this.figures = [];

    for (let i = 0; i < cfg.figureCount; i++) {
      const isDistinct = i < cfg.distinctFigures;
      const isContradiction = i >= cfg.distinctFigures && i < cfg.distinctFigures + cfg.contradictionFigures;

      let fx, fy, valid = false;
      let attempts = 0;
      let distanceOffset = 0;
      let fxNorm = 0;
      
      while (!valid && attempts < 150) {
        // Distribute evenly around 360-degree viewing circle (0-1 screen width)
        const angleNorm = rand(); // 0 to 1
        distanceOffset = rand() * 0.4; // depth variation
        
        fxNorm = angleNorm;
        fx = angleNorm;
        
        // Fisheye depth curve: Center (0.5) is close, edges (0, 1) curve away
        const distFromCenter = Math.abs(fx - 0.5) * 2.0; 
        const curveDepth = distFromCenter * distFromCenter; 
        
        // fy: 0.85 (bottom, close) up to 0.45 (top, far)
        fy = 0.85 - (curveDepth * 0.25) - (distanceOffset * 0.15);

        valid = true;
        for (let j = 0; j < i; j++) {
           const dx = this.figures[j].fx - fx;
           const dy = this.figures[j].fy - fy;
           // Prevent harsh overlap
           if (dx*dx + dy*dy < 0.001) {
             valid = false;
             break;
           }
        }
        attempts++;
      }
      
      const distFromCenter = Math.abs(fx - 0.5) * 2.0;
      const fisheyeScale = 1.0 - (distFromCenter * 0.3); // Edges look smaller/farther
      const baseScale = (0.55 + (1.0 - distanceOffset) * 0.45) * fisheyeScale;
      const baseAlpha = isDistinct ? 0.6 + rand() * 0.3 : 0.15 + (1.0 - distanceOffset) * 0.25;
      const rotation = (fxNorm - 0.5) * 0.25; // max rotation ~ 0.12 radians

      const contradictionIndex = isContradiction
        ? (i - cfg.distinctFigures) % contradictionTexts.length
        : null;
      const revealIndex = !isContradiction
        ? i % revealTexts.length
        : null;

      this.figures.push({
        id: i,
        fx, fy, // fractional position
        scale: baseScale,
        baseAlpha,
        alpha: baseAlpha,
        rotation,
        variant: Math.floor(rand() * 3),
        isDistinct,
        isContradiction,
        contradictionIndex,
        revealIndex,
        revealed: false,
        contradictionRevealed: false,
        focusProgress: 0, // 0–1, fills as player focuses
        revealAlpha: 0,   // for reveal text overlay fade
        hovered: false,
        color: isDistinct ? P.midgray : P.charcoal,
        // Distinct figures get slightly warmer shade
        distinctColor: isDistinct ? P.accent : null,
        // Position at phase start for smooth contradiction shift
        trueX: null, trueY: null,
      });
    }

    // Set "true" positions for contradiction figures (closer than narrator claims)
    this.figures.forEach((f) => {
      if (f.isContradiction) {
        // Contradiction: figure is actually nearby; show displaced position initially
        f.narrated_fx = Math.min(0.9, f.fx + 0.15 + seededRand(f.id * 17)() * 0.1);
        f.narrated_fy = f.fy + seededRand(f.id * 13)() * 0.05;
      }
    });
    
    // Sort by depth (fy) so closer figures render on top
    this.figures.sort((a, b) => a.fy - b.fy);
  }

  _generateGrain() {
    const gc = this.grainCanvas;
    const gctx = this.grainCtx;
    const size = 256;
    gc.width = size;
    gc.height = size;
    const imageData = gctx.createImageData(size, size);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const v = Math.floor(Math.random() * 60);
      data[i] = data[i + 1] = data[i + 2] = v;
      data[i + 3] = Math.floor(Math.random() * 28);
    }
    gctx.putImageData(imageData, 0, 0);
  }

  resize() {
    const dpr = window.devicePixelRatio || 1;
    const W = window.innerWidth;
    const H = window.innerHeight;
    this.canvas.width = W * dpr;
    this.canvas.height = H * dpr;
    this.canvas.style.width = W + "px";
    this.canvas.style.height = H + "px";
    // Reset transform before applying DPR scale to avoid accumulation
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this._logicalW = W;
    this._logicalH = H;
  }

  /** Convert fractional figure position to canvas coords, with compression */
  _figureCoords(fig) {
    const W = this._logicalW || 800;
    const H = this._logicalH || 600;
    const comp = this.compression;

    // In phases 1-2, contradiction figures are shown at "narrator's" stated position
    // In phase 3+, they shift to their true position
    let fx = fig.fx;
    let fy = fig.fy;

    if (fig.isContradiction && fig.narrated_fx !== undefined) {
      const t = this.phase < 3 ? 0 : Math.min(1, (this.phase - 2.5) * 2);
      fx = fig.narrated_fx + (fig.fx - fig.narrated_fx) * t;
      fy = fig.narrated_fy + (fig.fy - fig.narrated_fy) * t;
    }

    // Compression: squeeze room inward
    const margin = comp * 0.12;
    fx = margin + fx * (1 - margin * 2);
    fy = margin * 0.5 + fy * (1 - margin * 0.7);

    return {
      x: fx * W,
      y: H * 0.25 + fy * H * 0.65,
    };
  }

  _figureHitRadius(fig) {
    const baseR = 30 * fig.scale;
    return Math.max(28, baseR);
  }

  getFigureAtPoint(cx, cy) {
    // Find topmost (highest fy = frontmost) figure at canvas point
    let best = null;
    let bestFy = -1;
    for (const fig of this.figures) {
      const { x, y } = this._figureCoords(fig);
      const r = this._figureHitRadius(fig);
      const dx = cx - x;
      const dy = cy - y;
      if (dx * dx + dy * dy < r * r && fig.fy > bestFy) {
        best = fig;
        bestFy = fig.fy;
      }
    }
    return best;
  }

  onPointerMove(cx, cy) {
    this._pointerX = cx;
    this._pointerY = cy;
    let fig = this.getFigureAtPoint(cx, cy);
    if (fig && fig.revealed) {
      fig = null; // Cannot interact with already revealed figures
    }
    if (fig !== this.focusTarget) {
      this.focusTimer = 0;
      this.focusTarget = fig;
      this.figures.forEach((f) => (f.hovered = false));
      if (fig) fig.hovered = true;
    }
  }

  onPointerLeave() {
    this._pointerX = null;
    this._pointerY = null;
    if (this.focusTarget) {
      this.focusTarget.hovered = false;
      this.focusTarget = null;
    }
    this.focusTimer = 0;
  }

  onKeyboardSelect() {
    // Cycle through interactive figures
    const interactable = this.figures.filter((f) => (f.isDistinct || f.isContradiction) && !f.revealed);
    if (interactable.length === 0) return;
    this._keyboardIndex = (this._keyboardIndex + 1) % interactable.length;
    const fig = interactable[this._keyboardIndex];
    const { x, y } = this._figureCoords(fig);
    this.onPointerMove(x, y);
    // Immediately trigger reveal
    this._triggerReveal(fig);
  }

  _triggerReveal(fig) {
    if (!fig) return;
    fig.focusProgress = 1;

    if (!fig.revealed) {
      fig.revealed = true;
      this._figureRevealCount++;
      const textPool = NARRATIVE.phase2.figureRevealTexts;
      const revealText = textPool[fig.id % textPool.length];
      this.onReveal(fig, revealText);
      this.onWhisper(this._figureRevealCount);
      
      // Critical Matter: Material trace
      this.traces.push({ fx: fig.fx, fy: fig.fy, scale: fig.scale, alpha: 0 });
    }

    // Contradiction triggers in phase 3+, independently of basic reveal
    if (fig.isContradiction && !fig.contradictionRevealed && this.phase >= 3) {
      fig.contradictionRevealed = true;
      this._contradictionCount++;
      const c = NARRATIVE.phase3.contradictions[fig.contradictionIndex];
      this.onContradiction(fig, c);
    }

    // Reset dwell so player naturally moves on; arc resets after short delay
    this.focusTimer = 0;
    this.focusTarget = null;
    setTimeout(() => { fig.focusProgress = 0; }, 600);

    // Check phase advancement
    this._checkPhaseProgress();
  }

  _checkPhaseProgress() {
    const totalInteracted = this._figureRevealCount;
    const total = this.figures.length;
    
    // 10-person special event
    if (totalInteracted >= 10 && !this._event10Emitted) {
      this._event10Emitted = true;
      if (this.onTenPersonEvent) this.onTenPersonEvent();
    }
    
    // Phase 2 to 3 transition
    if (this.phase === 2 && totalInteracted >= 15 && !this._phaseCompleteEmitted.has(2)) {
      this._phaseCompleteEmitted.add(2);
      this.onPhaseComplete(2);
    }

    // 35-person special event (Phase 3 to 4 transition)
    if (this.phase === 3 && totalInteracted >= 35 && !this._phaseCompleteEmitted.has(3)) {
      this._phaseCompleteEmitted.add(3);
      if (this.onThirtyFivePersonEvent) this.onThirtyFivePersonEvent();
      this.onPhaseComplete(3);
    }

    if (this.phase === 4 && this.compression >= 0.85 && totalInteracted >= total && !this._phaseCompleteEmitted.has(4)) {
      this._phaseCompleteEmitted.add(4);
      this.onPhaseComplete(4);
    }
  }

  setPhase(phase) {
    this.phase = phase;
    if (phase === 5) {
      // Restore compression partially in the ending
      // Figures become clearly visible
      this.figures.forEach((f) => {
        f.alpha = Math.max(f.baseAlpha, 0.4);
      });
    }
  }

  _drawBackground() {
    const ctx = this.ctx;
    const W = this._logicalW;
    const H = this._logicalH;
    const comp = this.compression;

    // Base fill
    ctx.fillStyle = P.background;
    ctx.fillRect(0, 0, W, H);

    // Floor plane — perspective gradient
    const floorGrad = ctx.createLinearGradient(0, H * 0.45, 0, H);
    floorGrad.addColorStop(0, P.background);
    floorGrad.addColorStop(0.4, P.charcoal);
    floorGrad.addColorStop(1, "#111110");
    ctx.fillStyle = floorGrad;
    ctx.fillRect(0, H * 0.45, W, H * 0.55);

    // Forensic Perspective Grid (Critical Matter vibe)
    ctx.save();
    // Grid becomes more intense and distorted as compression increases
    ctx.strokeStyle = `rgba(139,115,85,${0.03 + comp * 0.08})`; 
    ctx.lineWidth = 1;
    const gridCols = 24;
    const gridRows = 12;
    const vanishY = H * 0.45;
    const floorH = H * 0.55;
    
    // Vertical lines
    for (let i = 0; i <= gridCols; i++) {
      // The vanishing point remains stable and centered
      const xTop = W * 0.5;
      const spread = (i / gridCols) - 0.5;
      const xBot = W * 0.5 + (spread * W * (2.5 - comp * 1.2));
      
      ctx.beginPath();
      ctx.moveTo(xTop, vanishY);
      ctx.lineTo(xBot, H);
      ctx.stroke();
    }
    
    // Horizontal lines
    for (let j = 1; j <= gridRows; j++) {
      const factor = Math.pow(j / gridRows, 1.8 - comp * 0.5);
      const yLine = vanishY + factor * floorH;
      ctx.beginPath();
      ctx.moveTo(0, yLine);
      ctx.lineTo(W, yLine);
      ctx.stroke();
    }
    ctx.restore();

    // Wall — with subtle vignette compression
    const wallGrad = ctx.createLinearGradient(0, 0, 0, H * 0.5);
    wallGrad.addColorStop(0, "#111110");
    wallGrad.addColorStop(0.6, P.charcoal);
    wallGrad.addColorStop(1, P.background);
    ctx.fillStyle = wallGrad;
    ctx.fillRect(0, 0, W, H * 0.5);

    // Vignette — intensifies with compression
    const vigAlpha = 0.3 + comp * 0.45;
    const vigGrad = ctx.createRadialGradient(W / 2, H / 2, H * 0.2, W / 2, H / 2, H * 0.9);
    vigGrad.addColorStop(0, `rgba(0,0,0,0)`);
    vigGrad.addColorStop(1, `rgba(0,0,0,${vigAlpha})`);
    ctx.fillStyle = vigGrad;
    ctx.fillRect(0, 0, W, H);

    // Horizon line — subtle
    ctx.save();
    ctx.strokeStyle = `rgba(90,90,82,${0.12 + comp * 0.08})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, H * 0.45);
    ctx.lineTo(W, H * 0.45);
    ctx.stroke();
    ctx.restore();
    
    // Permanent Material Traces (Burn-in for revealed figures)
    if (this.traces) {
      ctx.save();
      for (const trace of this.traces) {
        // Fade in trace
        trace.alpha = Math.min(0.15, trace.alpha + 0.005);
        const { x, y } = this._figureCoords({ fx: trace.fx, fy: trace.fy, isContradiction: false });
        
        ctx.fillStyle = `rgba(196,168,130,${trace.alpha})`;
        ctx.beginPath();
        // Draw a distorted shadow/burn mark on the grid
        ctx.ellipse(x, y, 25 * trace.scale, 8 * trace.scale, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Data node mark
        ctx.fillStyle = `rgba(196,168,130,${trace.alpha * 2})`;
        ctx.fillRect(x - 2, y - 2, 4, 4);
      }
      ctx.restore();
    }

    // Exit marker — dims and blurs with compression (phase 4)
    if (this.phase >= 3) {
      const exitAlpha = Math.max(0.04, 0.2 - comp * 0.18);
      ctx.save();
      ctx.globalAlpha = exitAlpha;
      ctx.fillStyle = P.midgray;
      const exitW = 40 - comp * 25;
      const exitH = 80 - comp * 50;
      const exitX = W * 0.88;
      const exitY = H * 0.3;
      if (exitW > 3 && exitH > 5) {
        ctx.fillRect(exitX, exitY, Math.max(2, exitW), Math.max(4, exitH));
      }
      ctx.restore();
    }
  }

  _drawFigures(dt) {
    const ctx = this.ctx;

    // Sort by depth (back to front) for correct overlap
    const sorted = [...this.figures].sort((a, b) => a.fy - b.fy);

    for (const fig of sorted) {
      const { x, y } = this._figureCoords(fig);
      const scale = fig.scale * (0.4 + fig.fy * 0.6);

      // Focus ring (keyboard / pointer hover)
      if (fig.hovered && this.phase >= 2) {
        ctx.save();
        ctx.strokeStyle = `rgba(196,168,130,${0.35 + fig.focusProgress * 0.3})`;
        ctx.lineWidth = 1.5;
        const r = this._figureHitRadius(fig) * 1.1;
        ctx.beginPath();
        ctx.arc(x, y - 30 * scale, r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Focus progress arc (dwell indicator)
      if (fig.focusProgress > 0 && fig.focusProgress < 1 && this.phase >= 2) {
        ctx.save();
        ctx.strokeStyle = `rgba(196,168,130,0.5)`;
        ctx.lineWidth = 2;
        const r = this._figureHitRadius(fig) * 1.15;
        ctx.beginPath();
        ctx.arc(x, y - 30 * scale, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * fig.focusProgress);
        ctx.stroke();
        ctx.restore();
      }

      // Silhouette fill — revealed figures get distinctly visible
      let fillAlpha = fig.alpha;
      if (fig.revealed) fillAlpha = 0.85;
      else if (fig.hovered) fillAlpha = Math.min(0.9, fillAlpha + 0.2);
      if (this.phase === 5) fillAlpha = Math.max(fillAlpha, 0.65);

      const fillColor = fig.revealed 
        ? "#e67e22" // Orange
        : (fig.isDistinct ? P.midgray : P.charcoal);

      ctx.fillStyle = fillColor;
      drawSilhouette(ctx, x, y, scale, fillAlpha, fig.variant);

      // Reveal text label
      if (fig.revealed && this.phase >= 2) {
        fig.revealTimer = (fig.revealTimer !== undefined) ? fig.revealTimer : 3200;
        
        if (fig.hovered || fig.focusProgress > 0) {
          fig.revealTimer = 3200;
          fig.revealAlpha = Math.min(1, fig.revealAlpha + (dt / 200));
        } else {
          if (fig.revealTimer > 0) {
            fig.revealTimer -= dt;
          } else {
            fig.revealAlpha = Math.max(0, fig.revealAlpha - (dt / 800));
          }
        }

        if (fig.revealAlpha > 0) {
          ctx.save();
          ctx.globalAlpha = fig.revealAlpha;
          ctx.fillStyle = "#e67e22"; // Orange text
          ctx.font = `15px ${SETTINGS.typography.bodyFont}`;
          ctx.textAlign = "center";
          const textPool = NARRATIVE.phase2.figureRevealTexts;
          const text = textPool[fig.id % textPool.length];
          ctx.fillText(text, x, y - 60 * scale - 15);
          ctx.restore();
        }
      }
    }
  }

  _drawGrain() {
    if (this.reducedMotion) return;
    const ctx = this.ctx;
    const W = this._logicalW;
    const H = this._logicalH;

    ctx.save();
    ctx.globalAlpha = 0.04;
    ctx.globalCompositeOperation = "screen";
    const gW = this.grainCanvas.width;
    const gH = this.grainCanvas.height;

    // Tile and offset grain for animation
    const ox = Math.floor(this.grainOffset * 37) % gW;
    const oy = Math.floor(this.grainOffset * 23) % gH;

    for (let tx = -gW + ox; tx < W + gW; tx += gW) {
      for (let ty = -gH + oy; ty < H + gH; ty += gH) {
        ctx.drawImage(this.grainCanvas, tx, ty);
      }
    }

    ctx.restore();
  }

  update(ts) {
    const dt = this.lastTime ? Math.min(ts - this.lastTime, 100) : 16;
    this._lastDt = dt; // store for use in draw
    this.lastTime = ts;

    // Grain animation
    if (!this.reducedMotion) {
      this.grainOffset += T.grainSpeed * (dt / 16);
    }

    // Focus dwell — build up focusProgress
    if (this.focusTarget && this.phase >= 2) {
      this.focusTimer += dt;
      const progress = Math.min(1, this.focusTimer / this.focusDwellMs);
      this.focusTarget.focusProgress = progress;

      if (progress >= 1) {
        this._triggerReveal(this.focusTarget);
      }
    }

    // Phase 4 spatial compression
    if (this.phase === 4) {
      this.compression = Math.min(1, this.compression + T.compressionRate * dt);
      // Phase advance is guarded by _phaseCompleteEmitted in _checkPhaseProgress
      this._checkPhaseProgress();
    }
    // Phase 5: ease compression back slightly
    if (this.phase === 5) {
      this.compression = Math.max(0.2, this.compression - T.compressionRate * 0.5 * dt);
    }
  }

  draw(ts) {
    this.update(ts);
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this._logicalW, this._logicalH);

    this._drawBackground();
    this._drawFigures(this._lastDt || 16);
    this._drawGrain();
  }

  start() {
    const loop = (ts) => {
      this.draw(ts);
      this._animId = requestAnimationFrame(loop);
    };
    this._animId = requestAnimationFrame(loop);
  }

  stop() {
    if (this._animId) cancelAnimationFrame(this._animId);
    this._animId = null;
  }
}
