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

  addContinuousWhisper() {
    if (!this._started || !this._ctx || !this._enabled) return;
    const ctx = this._ctx;
    
    // Base noise for whisper
    const bufSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    
    // Male formant-like frequencies (rough approximation for mumbling)
    const baseF1 = 400 + Math.random() * 200;
    const baseF2 = 1000 + Math.random() * 500;
    const baseF3 = 2200 + Math.random() * 600;
    
    const filter1 = ctx.createBiquadFilter(); filter1.type = 'bandpass'; filter1.frequency.value = baseF1; filter1.Q.value = 5;
    const filter2 = ctx.createBiquadFilter(); filter2.type = 'bandpass'; filter2.frequency.value = baseF2; filter2.Q.value = 6;
    const filter3 = ctx.createBiquadFilter(); filter3.type = 'bandpass'; filter3.frequency.value = baseF3; filter3.Q.value = 6;
    
    // Irregular amplitude modulation (2 LFOs)
    const lfo1 = ctx.createOscillator(); lfo1.type = 'sine'; lfo1.frequency.value = 2 + Math.random() * 2;
    const lfo2 = ctx.createOscillator(); lfo2.type = 'sine'; lfo2.frequency.value = 4 + Math.random() * 3;
    
    const lfoGain1 = ctx.createGain(); lfoGain1.gain.value = 0.4; lfo1.connect(lfoGain1);
    const lfoGain2 = ctx.createGain(); lfoGain2.gain.value = 0.3; lfo2.connect(lfoGain2);
    
    const modGain = ctx.createGain();
    modGain.gain.value = 0.2; // base volume
    lfoGain1.connect(modGain.gain);
    lfoGain2.connect(modGain.gain);
    
    const voiceGain = ctx.createGain();
    voiceGain.gain.setValueAtTime(0, ctx.currentTime);
    const targetVolume = 0.015 + Math.random() * 0.01;
    voiceGain.gain.linearRampToValueAtTime(targetVolume, ctx.currentTime + 2.0);
    
    source.connect(filter1); source.connect(filter2); source.connect(filter3);
    filter1.connect(modGain); filter2.connect(modGain); filter3.connect(modGain);
    
    modGain.connect(voiceGain);
    voiceGain.connect(this._masterGain);
    
    lfo1.start(); lfo2.start(); source.start();
  }

  playLaughter() {
    if (!this._started || !this._ctx || !this._enabled) return;
    const ctx = this._ctx;
    const now = ctx.currentTime;
    
    // Pitched oscillator for vocal cord (male = ~120Hz)
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 2.5);
    
    // Formant filters for "Ha ha ha"
    const filter1 = ctx.createBiquadFilter(); filter1.type = 'bandpass'; filter1.frequency.value = 700; filter1.Q.value = 3;
    const filter2 = ctx.createBiquadFilter(); filter2.type = 'bandpass'; filter2.frequency.value = 1200; filter2.Q.value = 3;
    
    // Amplitude modulation for the laugh pulses
    const lfo = ctx.createOscillator();
    lfo.type = 'square';
    lfo.frequency.setValueAtTime(5, now);
    lfo.frequency.linearRampToValueAtTime(3.5, now + 2);
    
    // Smooth the pulses slightly
    const lfoFilter = ctx.createBiquadFilter();
    lfoFilter.type = 'lowpass';
    lfoFilter.frequency.value = 15;
    
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 1;
    lfo.connect(lfoFilter);
    lfoFilter.connect(lfoGain.gain);
    
    const voiceGain = ctx.createGain();
    voiceGain.gain.setValueAtTime(0, now);
    voiceGain.gain.linearRampToValueAtTime(0.0, now);
    voiceGain.gain.linearRampToValueAtTime(0.4, now + 0.1); // Attack
    voiceGain.gain.exponentialRampToValueAtTime(0.01, now + 2.5); // Decay
    
    // Distant/muffled effect
    const distFilter = ctx.createBiquadFilter();
    distFilter.type = 'lowpass';
    distFilter.frequency.value = 900;
    
    osc.connect(filter1); osc.connect(filter2);
    filter1.connect(voiceGain); filter2.connect(voiceGain);
    
    const amNode = ctx.createGain();
    amNode.gain.value = 0;
    lfoGain.connect(amNode.gain);
    
    voiceGain.connect(amNode);
    amNode.connect(distFilter);
    distFilter.connect(this._masterGain);
    
    osc.start(now); lfo.start(now);
    osc.stop(now + 3); lfo.stop(now + 3);
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
