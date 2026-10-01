/**
 * main.js
 * Orchestrates all phases of "invisible in plain sight."
 * Entry point for the experience.
 */

import { NARRATIVE, SETTINGS } from "../data/narrative.js";
import { Room } from "./room.js";
import { Narrator } from "./narrator.js";
import { AmbientAudio } from "./audio.js";

const P = SETTINGS.palette;
const T = SETTINGS.timing;

// ─── State ──────────────────────────────────────────────────────────────────

const state = {
  phase: 0,           // 0=title, 1=room, 2=background, 3=alibi, 4=weight, 5=account
  soundEnabled: true,
  reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  started: false,
  ended: false,
};

// ─── DOM refs ────────────────────────────────────────────────────────────────

const $ = (id) => document.getElementById(id);

const screen = {
  title:      $("screen-title"),
  experience: $("screen-experience"),
  ending:     $("screen-ending"),
};

const els = {
  titleText:          $("title-text"),
  contentNote:        $("content-note"),
  enterBtn:           $("btn-enter"),
  soundToggle:        $("btn-sound"),
  reducedMotionToggle:$("btn-reduced-motion"),
  exitBtn:            $("btn-exit"),

  canvas:             $("room-canvas"),
  narratorText:       $("narrator-text"),
  revealText:         $("reveal-text"),
  contradictionText:  $("contradiction-text"),
  phaseLabel:         $("phase-label"),
  instruction:        $("instruction"),

  endingQuestion:     $("ending-question"),
  endingSubtext:      $("ending-subtext"),
  restartBtn:         $("btn-restart"),
  returnBtn:          $("btn-return"),
};

// ─── Modules ─────────────────────────────────────────────────────────────────

let room, narrator, audio;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function showScreen(name) {
  Object.values(screen).forEach((s) => {
    s.classList.remove("screen--visible");
    s.setAttribute("aria-hidden", "true");
  });
  screen[name].classList.add("screen--visible");
  screen[name].setAttribute("aria-hidden", "false");
}

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function updateSoundButton() {
  const on = audio ? audio.isEnabled() : state.soundEnabled;
  els.soundToggle.textContent = on ? NARRATIVE.soundOnLabel : NARRATIVE.soundOffLabel;
  els.soundToggle.setAttribute("aria-pressed", String(on));
}

function updateReducedMotionButton() {
  els.reducedMotionToggle.textContent = NARRATIVE.reducedMotionLabel;
  els.reducedMotionToggle.setAttribute("aria-pressed", String(state.reducedMotion));
}

// ─── Reveal / Contradiction overlay ──────────────────────────────────────────

let revealTimeout = null;
let contradictionTimeout = null;

function showRevealText(text) {
  if (!text) return;
  clearTimeout(revealTimeout);
  els.revealText.textContent = text;
  els.revealText.classList.add("overlay-text--visible");
  revealTimeout = setTimeout(() => {
    els.revealText.classList.remove("overlay-text--visible");
  }, 3200);
}

function showContradictionText(contraObj) {
  if (!contraObj) return;
  clearTimeout(contradictionTimeout);
  els.contradictionText.innerHTML = `
    <span class="contradiction__label">${contraObj.label}</span>
    <span class="contradiction__reveal">${contraObj.reveal}</span>
  `;
  els.contradictionText.classList.add("overlay-text--visible");
  contradictionTimeout = setTimeout(() => {
    els.contradictionText.classList.remove("overlay-text--visible");
  }, 5500);
}

// ─── Phase transitions ────────────────────────────────────────────────────────

async function enterPhase(phase) {
  state.phase = phase;
  if (room) room.setPhase(phase);
  if (audio) audio.setPhase(phase);

  switch (phase) {
    case 1: await runPhase1(); break;
    case 2: await runPhase2(); break;
    case 3: await runPhase3(); break;
    case 4: await runPhase4(); break;
    case 5: await runPhase5(); break;
  }
}

// Phase 1: THE ROOM
async function runPhase1() {
  els.instruction.textContent = NARRATIVE.openingInstruction;
  els.instruction.classList.add("overlay-text--visible");

  await delay(1200);

  // Opening narrator fragments
  narrator.setSequence(NARRATIVE.phase1.narratorOpening, () => {
    // After opening narration, transition to phase 2
    setTimeout(() => enterPhase(2), 800);
  });
}

// Phase 2: THE BACKGROUND — look around, figures become people
let glitchInterval = null;
async function runPhase2() {
  els.instruction.textContent = "";
  els.instruction.classList.remove("overlay-text--visible");

  narrator.setSequence(NARRATIVE.phase2.narratorPhase2, null);
  
  // Show the glitch text
  const gt = document.getElementById("glitch-title");
  if (gt) {
    gt.style.opacity = 1;
    clearInterval(glitchInterval);
    glitchInterval = setInterval(() => {
      gt.style.transform = `translate(${Math.random()*6-3}px, ${Math.random()*6-3}px)`;
      gt.style.opacity = 0.4 + Math.random()*0.5;
      setTimeout(() => {
        gt.style.transform = "translate(0,0)";
        gt.style.opacity = 1;
      }, 150);
    }, 3000);
  }

  // Room will call onPhaseComplete(2) once enough figures are revealed
  // That's wired in initRoom below
}

// ─── Intrusive Text Event ──────────────────────────────────────────────────────

function triggerIntrusiveText(message) {
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.top = "0";
  container.style.left = "0";
  container.style.width = "100vw";
  container.style.height = "100vh";
  container.style.display = "flex";
  container.style.alignItems = "center";
  container.style.justifyContent = "center";
  container.style.pointerEvents = "none";
  container.style.zIndex = "9999999"; // Guaranteed top
  container.style.opacity = "0";
  container.style.transition = "opacity 0.3s ease";
  container.style.padding = "0 10vw";
  container.style.boxSizing = "border-box";
  
  const textNode = document.createElement("span");
  textNode.textContent = message;
  textNode.style.color = "#ffffff";
  textNode.style.fontSize = "3.5rem"; // Very large
  textNode.style.fontWeight = "bold";
  textNode.style.textAlign = "center";
  textNode.style.textShadow = "0px 4px 20px rgba(0,0,0,0.8)";
  
  container.appendChild(textNode);
  document.body.appendChild(container);
  
  // Force reflow and fade in
  container.getBoundingClientRect();
  container.style.opacity = "1";
  
  // Glitch sequence at 2, 4, 6, 8 seconds
  let glitches = 0;
  const glitchInterval = setInterval(() => {
    glitches++;
    if (glitches >= 5) {
      clearInterval(glitchInterval);
      container.style.opacity = "0";
      setTimeout(() => container.remove(), 500);
      return;
    }
    
    // Apply temporary glitch
    textNode.style.transform = `translate(${Math.random()*40-20}px, ${Math.random()*40-20}px) scale(1.05)`;
    textNode.style.textShadow = "4px 0 0 red, -4px 0 0 cyan, 0px 4px 20px rgba(0,0,0,0.8)";
    
    setTimeout(() => {
      textNode.style.transform = "none";
      textNode.style.textShadow = "0px 4px 20px rgba(0,0,0,0.8)";
    }, 150);
    
  }, 2000);
}

// Phase 3: THE ALIBI — narrator rationalizes
async function runPhase3() {
  els.phaseLabel.textContent = "";

  narrator.setSequence(NARRATIVE.phase3.narratorFragments, () => {
    // Phase 4 triggered at 35 people natively in room.js
  });
}

// Phase 4: THE WEIGHT — spatial compression (35 people trigger)
async function runPhase4() {
  // Narrator fragments continue
  narrator.setSequence(NARRATIVE.phase4.narratorFragments, null);
  
  // Play male laughter
  if (audio) audio.playLaughter();

  // Room compression happens in the canvas loop (room.update)
  // When compression reaches threshold, room calls onPhaseComplete(4)
}

// Phase 5: THE ACCOUNT — exposure, ending question
async function runPhase5() {
  narrator.setSequence(NARRATIVE.phase5.narratorShift, async () => {
    // After narrator shift, show ending
    await delay(800);
    await showEnding();
  });
}

async function showEnding() {
  state.ended = true;
  clearInterval(glitchInterval);
  const gt = document.getElementById("glitch-title");
  if (gt) gt.style.opacity = 0;
  if (room) room.stop();
  if (audio) audio.stop();

  await delay(T.transitionMs);
  showScreen("ending");

  await delay(400);
  els.endingQuestion.classList.add("overlay-text--visible");
  await delay(1800);
  els.endingSubtext.classList.add("overlay-text--visible");
}

// ─── Room init ────────────────────────────────────────────────────────────────

function initRoom() {
  room = new Room(els.canvas, {
    reducedMotion: state.reducedMotion,
    onReveal: (fig, text) => {
      if (state.phase >= 2) showRevealText(text);
    },
    onWhisper: () => {
      if (audio) audio.addContinuousWhisper();
    },
    onTenPersonEvent: () => {
      triggerIntrusiveText("The voices were getting louder, but no one was opening their mouth.");
    },
    onThirtyFivePersonEvent: () => {
      triggerIntrusiveText("There were so many of them now.");
    },
    onContradiction: (fig, contraObj) => {
      if (state.phase >= 3) showContradictionText(contraObj);
    },
    onPhaseComplete: (completedPhase) => {
      if (completedPhase === 2 && state.phase === 2) {
        enterPhase(3);
      } else if (completedPhase === 3 && state.phase === 3) {
        enterPhase(4);
      } else if (completedPhase === 4 && state.phase === 4) {
        enterPhase(5);
      }
    },
  });

  room.resize();
  room.start();
}

// ─── Event bindings ───────────────────────────────────────────────────────────

function bindEvents() {
  // Enter button
  els.enterBtn.addEventListener("click", startExperience);
  els.enterBtn.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") startExperience();
  });

  // Sound toggle — works across all screens
  document.querySelectorAll(".btn-sound-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!audio) {
        audio = new AmbientAudio();
        audio.start();
      }
      const enabled = audio.toggle();
      state.soundEnabled = enabled;
      updateSoundButton();
      document.querySelectorAll(".btn-sound-toggle").forEach((b) => {
        b.textContent = enabled ? NARRATIVE.soundOnLabel : NARRATIVE.soundOffLabel;
        b.setAttribute("aria-pressed", String(enabled));
      });
    });
  });

  // Reduced motion toggle
  document.querySelectorAll(".btn-reduced-motion-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.reducedMotion = !state.reducedMotion;
      if (room) room.reducedMotion = state.reducedMotion;
      updateReducedMotionButton();
      document.querySelectorAll(".btn-reduced-motion-toggle").forEach((b) => {
        b.setAttribute("aria-pressed", String(state.reducedMotion));
      });
    });
  });

  // Exit — always available
  document.querySelectorAll(".btn-exit").forEach((btn) => {
    btn.addEventListener("click", exitExperience);
  });

  // Canvas pointer
  els.canvas.addEventListener("pointermove", (e) => {
    if (state.phase < 2 || !room) return;
    const rect = els.canvas.getBoundingClientRect();
    room.onPointerMove(e.clientX - rect.left, e.clientY - rect.top);
  });

  els.canvas.addEventListener("pointerleave", () => {
    if (room) room.onPointerLeave();
  });

  // Touch — treat as pointer
  els.canvas.addEventListener("touchmove", (e) => {
    if (state.phase < 2 || !room) return;
    e.preventDefault();
    const rect = els.canvas.getBoundingClientRect();
    const t = e.touches[0];
    room.onPointerMove(t.clientX - rect.left, t.clientY - rect.top);
  }, { passive: false });

  els.canvas.addEventListener("touchend", () => {
    if (room) room.onPointerLeave();
  });

  // Keyboard navigation in room
  document.addEventListener("keydown", (e) => {
    if (state.phase < 2 || !room) return;
    if (e.key === "Tab" || e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      room.onKeyboardSelect();
    }
    if (e.key === "Escape") exitExperience();
  });

  // Ending buttons
  if (els.restartBtn) {
    els.restartBtn.addEventListener("click", restartExperience);
  }
  if (els.returnBtn) {
    els.returnBtn.addEventListener("click", returnToTitle);
  }

  // Resize
  window.addEventListener("resize", () => {
    if (room) room.resize();
  });
}

// ─── Core lifecycle ──────────────────────────────────────────────────────────

async function startExperience() {
  if (state.started) return;
  state.started = true;

  // Init audio (must be after gesture)
  audio = new AmbientAudio();
  if (state.soundEnabled) audio.start();

  // Init narrator
  narrator = new Narrator(els.narratorText);

  // Show experience screen
  showScreen("experience");
  await delay(300);

  // Init room
  initRoom();

  // Begin phase 1
  await enterPhase(1);
}

function exitExperience() {
  if (room) room.stop();
  if (audio) audio.stop();
  narrator?.stop();
  returnToTitle();
}

function returnToTitle() {
  state.started = false;
  state.ended = false;
  state.phase = 0;
  room?.stop();
  room = null;
  showScreen("title");
}

async function restartExperience() {
  state.ended = false;
  state.started = false;
  showScreen("experience");
  await delay(200);

  narrator = new Narrator(els.narratorText);
  audio = new AmbientAudio();
  if (state.soundEnabled) audio.start();

  // Reinit room
  initRoom();
  await enterPhase(1);
}

// ─── Boot ────────────────────────────────────────────────────────────────────

function boot() {
  // Set up text content from narrative data
  els.titleText.textContent = NARRATIVE.title;
  els.contentNote.textContent = NARRATIVE.contentNote;
  els.enterBtn.textContent = NARRATIVE.enterLabel;
  els.soundToggle.textContent = state.soundEnabled
    ? NARRATIVE.soundOnLabel
    : NARRATIVE.soundOffLabel;
  els.soundToggle.setAttribute("aria-pressed", String(state.soundEnabled));

  if (els.reducedMotionToggle) {
    els.reducedMotionToggle.textContent = NARRATIVE.reducedMotionLabel;
    els.reducedMotionToggle.setAttribute("aria-pressed", String(state.reducedMotion));
  }

  bindEvents();
  showScreen("title");
}

document.addEventListener("DOMContentLoaded", boot);
