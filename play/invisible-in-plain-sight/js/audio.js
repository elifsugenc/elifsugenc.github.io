/**
 * audio.js
 * Web Audio API ambient soundscape for "invisible in plain sight."
 * Begins only after user gesture. All essential narrative is visual.
 */

export class AmbientAudio {
  constructor() {
    this._ctx = null;
    this._masterGain = null;
    this._nodes = [];
    this._enabled = true;
    this._started = false;
    this._phase = 1;
  }

  _ensureContext() {
    if (!this._ctx) {
      this._ctx = new (window.AudioContext || window.webkitAudioContext)();
      this._masterGain = this._ctx.createGain();
      this._masterGain.gain.setValueAtTime(0, this._ctx.currentTime);
      this._masterGain.connect(this._ctx.destination);
    }
    if (this._ctx.state === "suspended") {
      this._ctx.resume();
    }
  }

  /** Creates a gentle low-frequency drone layer */
  _createDrone(freq, gainVal, detune = 0) {
    const ctx = this._ctx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = "sine";
    osc.frequency.value = freq;
    osc.detune.value = detune;

    filter.type = "lowpass";
    filter.frequency.value = 400;
    filter.Q.value = 0.8;

    gain.gain.value = gainVal;

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this._masterGain);
    osc.start();

    this._nodes.push({ osc, gain, filter });
    return { osc, gain };
  }

  /** Creates filtered noise for atmosphere */
  _createNoise(gainVal, lowFreq = 100, highFreq = 600) {
    const ctx = this._ctx;
    const bufSize = ctx.sampleRate * 4;
    const buffer = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const lowFilter = ctx.createBiquadFilter();
    lowFilter.type = "highpass";
    lowFilter.frequency.value = lowFreq;

    const highFilter = ctx.createBiquadFilter();
    highFilter.type = "lowpass";
    highFilter.frequency.value = highFreq;

    const gain = ctx.createGain();
    gain.gain.value = gainVal;

    source.connect(lowFilter);
    lowFilter.connect(highFilter);
    highFilter.connect(gain);
    gain.connect(this._masterGain);
    source.start();

    this._nodes.push({ source, gain });
    return { source, gain };
  }

  /** Start the ambient soundscape after user gesture */
  start() {
    if (this._started || !this._enabled) return;
    this._ensureContext();
    this._started = true;

    // Deep room tone
    this._createDrone(55, 0.06);
    this._createDrone(82.5, 0.04, 3);
    this._createDrone(110, 0.02, -5);

    // Subtle upper harmonic shimmer
    this._createDrone(220, 0.008, 8);
    this._createDrone(165, 0.006, -12);

    // Very soft room noise
    this._noiseNode = this._createNoise(0.015, 80, 300);

    // Fade in slowly
    this._masterGain.gain.linearRampToValueAtTime(
      1.0,
      this._ctx.currentTime + 3
    );
  }

  playWhisper(intensity) {
    if (!this._started || !this._ctx || !this._enabled) return;
    const ctx = this._ctx;
    
    const bufSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    // Number of voices based on how many bars/figures are filled
    const numVoices = Math.min(15, Math.max(1, Math.floor(intensity / 4)));
    
    for (let v = 0; v < numVoices; v++) {
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 800 + Math.random() * 2500;
      filter.Q.value = 6 + Math.random() * 6;
      
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.02 + Math.random()*0.03, ctx.currentTime + 0.1 + Math.random()*0.4);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8 + Math.random());
      
      source.connect(filter);
      filter.connect(gain);
      gain.connect(this._masterGain);
      
      source.start();
    }
  }

  /** Transition audio state for each phase */
  setPhase(phase) {
    this._phase = phase;
    if (!this._started || !this._ctx) return;
    const ctx = this._ctx;
    const now = ctx.currentTime;

    if (phase === 3) {
      // Phase 3: slight tension — filter tightens
      this._nodes.forEach(({ filter }) => {
        if (filter) {
          filter.frequency.linearRampToValueAtTime(250, now + 2);
        }
      });
    } else if (phase === 4) {
      // Phase 4: compression — muffling effect
      this._nodes.forEach(({ filter, gain }) => {
        if (filter) {
          filter.frequency.linearRampToValueAtTime(120, now + 3);
        }
      });
      if (this._noiseNode) {
        this._noiseNode.gain.linearRampToValueAtTime(0.035, now + 3);
      }
      // Pitch down slightly to suggest weight
      this._nodes.forEach(({ osc }) => {
        if (osc) {
          const f = osc.frequency.value;
          osc.frequency.linearRampToValueAtTime(f * 0.97, now + 4);
        }
      });
    } else if (phase === 5) {
      // Phase 5: opening — clarity returns partially
      this._nodes.forEach(({ filter }) => {
        if (filter) {
          filter.frequency.linearRampToValueAtTime(500, now + 2);
        }
      });
      if (this._masterGain) {
        this._masterGain.gain.linearRampToValueAtTime(0.6, now + 3);
      }
    }
  }

  toggle() {
    this._enabled = !this._enabled;
    if (!this._ctx) return this._enabled;

    if (this._enabled) {
      this._masterGain.gain.linearRampToValueAtTime(
        1.0,
        this._ctx.currentTime + 0.5
      );
    } else {
      this._masterGain.gain.linearRampToValueAtTime(
        0,
        this._ctx.currentTime + 0.3
      );
    }
    return this._enabled;
  }

  isEnabled() {
    return this._enabled;
  }

  stop() {
    if (!this._ctx) return;
    this._masterGain.gain.linearRampToValueAtTime(
      0,
      this._ctx.currentTime + 1.5
    );
  }
}
