/**
 * narrative.js
 * All narrative text for "invisible in plain sight."
 * Edit this file to change the story text, narrator fragments, and ending.
 */

export const NARRATIVE = {
  title: "invisible in plain sight",

  contentNote:
    "An abstract experience about sexual violence, silence, and responsibility. No graphic imagery.",

  enterLabel: "enter",
  exitLabel: "leave",
  soundOnLabel: "sound on",
  soundOffLabel: "sound off",
  reducedMotionLabel: "reduce motion",
  restartLabel: "revisit the room",
  returnLabel: "return to start",

  openingInstruction: "Look closely. Select what you notice.",

  // Phase 1 – THE ROOM
  phase1: {
    ambientLabel: "The room.",
    narratorOpening: [
      "It was crowded.",
      "That's the first thing I want you to understand.",
      "There were people everywhere.",
    ],
  },

  // Phase 2 – THE BACKGROUND
  phase2: {
    figureRevealTexts: [
      // Each figure in the room can reveal one of these on focus
      "He was there.",
      "He saw.",
      "He saw it too.",
      "He didn't move.",
      "He was right there.",
      "He stood close.",
      "He didn't look away.",
      "He was watching.",
      "He chose not to speak.",
      "He remembers it differently.",
      "He didn't imagine it.",
    ],
    narratorPhase2: [
      "A room full of people.",
      "They were having a good time.",
      "No one seemed alarmed.",
    ],
  },

  // Phase 3 – THE ALIBI
  phase3: {
    narratorFragments: [
      "Everyone was there.",
      "No one said anything.",
      "I told myself that meant something.",
      "If it had been wrong —",
      "someone would have said something.",
      "Wouldn't they?",
      "The room was full.",
      "I took that as a sign.",
    ],
    contradictions: [
      // Revealed when player focuses on figures the narrator dismisses
      { label: "He said the space was empty.", reveal: "It was not empty." },
      { label: "He said he was far away.", reveal: "He was close." },
      {
        label: "He said no one noticed.",
        reveal: "He was watching the whole time.",
      },
      {
        label: "He described this corner as vacant.",
        reveal: "He was standing here.",
      },
      {
        label: "He said the crowd approved.",
        reveal: "No one gave permission.",
      },
    ],
  },

  // Phase 4 – THE WEIGHT
  phase4: {
    narratorFragments: [
      "The silence meant yes.",
      "That's how I understood it.",
      "No one stopped me.",
      "No one said a word.",
      "In a crowded room.",
      "What would you have thought?",
    ],
    environmentNote:
      "The room contracts. The walls press in. The air thickens with what is not said.",
  },

  // Phase 5 – THE ACCOUNT
  phase5: {
    narratorShift: [
      "The room was full.",
      "They were there.",
      "And I —",
      "I made a choice.",
      "Not they.",
      "I.",
    ],
    endingQuestion: "What did their silence allow him to tell himself?",
    endingSubtext:
      "Their silence was not permission. It was only silence.",
  },
};

/**
 * VISUAL SETTINGS
 * Edit palette, timing, and figure counts here.
 */
export const SETTINGS = {
  palette: {
    background: "#1a1a18",
    backgroundLight: "#252520",
    charcoal: "#2c2c28",
    midgray: "#5a5a52",
    lightgray: "#b0b0a0",
    offwhite: "#e8e6dc",
    accent: "#8b7355", // single muted warm accent
    accentLight: "#c4a882",
    text: "#d4d2c8",
    textFaint: "#6a6860",
  },

  timing: {
    focusDwellMs: 1200,       // ms of focused attention before reveal
    transitionMs: 1800,       // phase transition duration
    textFadeMs: 600,          // narrator text fade
    grainSpeed: 0.3,          // film grain animation speed
    compressionRate: 0.0008,  // how fast the room compresses in phase 4
  },

  room: {
    figureCount: 50,          // total silhouettes in the room
    distinctFigures: 50,      // make all figures interactable
    contradictionFigures: 5,  // figures that carry contradiction reveals
  },

  typography: {
    titleFont: "'Georgia', 'Times New Roman', serif",
    bodyFont: "'Georgia', 'Times New Roman', serif",
    monoFont: "'Courier New', monospace",
  },
};
