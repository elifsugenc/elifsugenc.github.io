/**
 * narrator.js
 * Manages the unreliable narrator text sequence and UI display.
 * Text fragments appear sequentially per phase, fading in and out.
 */

import { NARRATIVE, SETTINGS } from "../data/narrative.js";

const T = SETTINGS.timing;

export class Narrator {
  constructor(el) {
    this._el = el; // DOM element for narrator text
    this._queue = [];
    this._current = null;
    this._displayTimer = null;
    this._phase = 1;
    this._autoAdvance = true;
    this._fragmentDuration = 3800; // ms each fragment is visible
    this._fadeDuration = T.textFadeMs;
    this._onEmpty = null;
  }

  /** Feed a new sequence of text fragments */
  setSequence(fragments, onEmpty) {
    this._clearTimer();
    this._queue = [...fragments];
    this._onEmpty = onEmpty || null;
    this._showNext();
  }

  /** Show a single, priority message immediately */
  flash(text, durationMs = 4500) {
    this._clearTimer();
    this._queue = [];
    this._setVisible(text);
    this._displayTimer = setTimeout(() => {
      this._fadeOut();
    }, durationMs);
  }

  /** Append an additional fragment to the current queue */
  enqueue(text) {
    this._queue.push(text);
    if (!this._current) this._showNext();
  }

  _showNext() {
    if (this._queue.length === 0) {
      // Small pause before calling empty handler
      this._displayTimer = setTimeout(() => {
        this._fadeOut();
        if (this._onEmpty) this._onEmpty();
      }, this._fadeDuration + 200);
      return;
    }

    const text = this._queue.shift();
    this._setVisible(text);

    this._displayTimer = setTimeout(() => {
      this._showNext();
    }, this._fragmentDuration);
  }

  _setVisible(text) {
    this._current = text;
    this._el.classList.remove("narrator--hidden");
    void this._el.offsetHeight; // force reflow for transition
    this._el.classList.add("narrator--visible");
    
    // Scramble effect
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*";
    let iteration = 0;
    const maxIterations = 12;
    
    clearInterval(this._scrambleInterval);
    this._scrambleInterval = setInterval(() => {
      this._el.textContent = text
        .split("")
        .map((letter, index) => {
          if (index < iteration || letter === " ") {
            return text[index];
          }
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join("");
        
      if (iteration >= text.length) {
        clearInterval(this._scrambleInterval);
      }
      iteration += text.length / maxIterations;
    }, 40);
  }

  _fadeOut() {
    this._el.classList.remove("narrator--visible");
    this._el.classList.add("narrator--hidden");
    this._current = null;
  }

  _clearTimer() {
    if (this._displayTimer) {
      clearTimeout(this._displayTimer);
      this._displayTimer = null;
    }
  }

  stop() {
    this._clearTimer();
    this._queue = [];
    this._fadeOut();
  }

  isActive() {
    return this._current !== null || this._queue.length > 0;
  }
}
