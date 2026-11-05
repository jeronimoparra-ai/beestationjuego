/**
 * BeeStation: Misión Néctar - Sintetizador Procedural de Audio Web Audio API
 * Genera todos los efectos y música en tiempo real sin requerir archivos MP3 externos.
 */

class NectarAudioSystem {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.musicGain = null;
    this.sfxGain = null;
    this.isMuted = false;
    this.isBgmPlaying = false;
    this.bgmTimer = null;
    this.bgmTempo = 112; // BPM
    this.bgmStep = 0;
  }

  init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // SFX Bus
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.9, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      // Music Bus
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      this.musicGain.connect(this.masterGain);
    } catch (e) {
      console.warn('Web Audio API no soportado o bloqueado en este entorno', e);
    }
  }

  ensureContext() {
    if (!this.ctx) this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.8, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  setVolume(val) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, val)), this.ctx.currentTime);
    }
  }

  // --- EFECTOS DE SONIDO PROCEDURALES ---

  playPop() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, t); // C5
    osc.frequency.exponentialRampToValueAtTime(783.99, t + 0.08); // G5

    gain.gain.setValueAtTime(0.6, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.13);
  }

  playGoldenBurst() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    const freqs = [880, 1108.7, 1318.5, 1760]; // Arpegio brillante A5, C#6, E6, A6

    freqs.forEach((f, idx) => {
      const delay = idx * 0.035;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = idx % 2 === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(f, t + delay);

      gain.gain.setValueAtTime(0.4, t + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.28);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t + delay);
      osc.stop(t + delay + 0.3);
    });
  }

  playComboUp(combo = 2) {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    const baseFreq = 400 + Math.min(combo, 8) * 80;
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(baseFreq, t);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, t + 0.15);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.19);
  }

  playTick() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, t); // La 440

    gain.gain.setValueAtTime(0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.09);
  }

  playGo() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    const chord = [523.25, 659.25, 783.99, 1046.5]; // Acorde C mayor

    chord.forEach((freq) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.4, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + 0.65);
    });
  }

  playHiveFill() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.exponentialRampToValueAtTime(240, t + 0.12);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.22);
  }

  playVictory() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    const notes = [
      { f: 523.25, d: 0.12, w: 0 },
      { f: 659.25, d: 0.12, w: 0.14 },
      { f: 783.99, d: 0.12, w: 0.28 },
      { f: 1046.5, d: 0.35, w: 0.42 }
    ];

    notes.forEach((n) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, t + n.w);

      gain.gain.setValueAtTime(0.5, t + n.w);
      gain.gain.exponentialRampToValueAtTime(0.001, t + n.w + n.d);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t + n.w);
      osc.stop(t + n.w + n.d + 0.05);
    });
  }

  // --- MÚSICA AMBIENTAL PROCEDURAL (BGM) ---

  startBgm() {
    this.ensureContext();
    if (this.isBgmPlaying || !this.ctx) return;
    this.isBgmPlaying = true;
    this.bgmStep = 0;
    this.scheduleNextBgmBeat();
  }

  stopBgm() {
    this.isBgmPlaying = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  setTempo(bpm) {
    this.bgmTempo = Math.max(80, Math.min(180, bpm));
  }

  scheduleNextBgmBeat() {
    if (!this.isBgmPlaying || !this.ctx) return;

    const interval = (60 / this.bgmTempo) * 500; // semicorcheas

    // Notas pentatónicas de marimba cálida (F, G, A, C, D)
    const melodyScale = [349.23, 392.00, 440.00, 523.25, 587.33, 698.46];
    const bassScale = [174.61, 196.00, 220.00, 130.81];

    if (!this.isMuted) {
      const t = this.ctx.currentTime;
      // Bajo suave cada 4 tiempos
      if (this.bgmStep % 4 === 0) {
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        const bassNote = bassScale[(this.bgmStep / 4) % bassScale.length];

        bassOsc.type = 'sine';
        bassOsc.frequency.setValueAtTime(bassNote, t);
        bassGain.gain.setValueAtTime(0.3, t);
        bassGain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

        bassOsc.connect(bassGain);
        bassGain.connect(this.musicGain);

        bassOsc.start(t);
        bassOsc.stop(t + 0.45);
      }

      // Marimba melódica aleatoria armónica
      if (Math.random() > 0.3) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const note = melodyScale[Math.floor(Math.random() * melodyScale.length)];

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note, t);

        gain.gain.setValueAtTime(0.18, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

        osc.connect(gain);
        gain.connect(this.musicGain);

        osc.start(t);
        osc.stop(t + 0.25);
      }
    }

    this.bgmStep++;
    this.bgmTimer = setTimeout(() => this.scheduleNextBgmBeat(), interval);
  }
}

// Instancia única global
window.audioSystem = new NectarAudioSystem();
