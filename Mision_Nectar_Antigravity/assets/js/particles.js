/**
 * BeeStation: Misión Néctar - Motor de Partículas Canvas
 * Polen ambiental, gotas de néctar con trayectorias bézier y fuegos de artificio
 */

class NectarParticleEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas ? canvas.getContext('2d') : null;
    this.particles = [];
    this.drops = []; // Gotas volando hacia la colmena
    this.maxParticles = 120;
    this.isRunning = false;
    this.lastTime = performance.now();

    if (this.canvas) {
      this.resize();
      window.addEventListener('resize', () => this.resize());
    }
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width * (window.devicePixelRatio || 1);
    this.canvas.height = rect.height * (window.devicePixelRatio || 1);
    if (this.ctx) {
      this.ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    }
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.loop();
  }

  stop() {
    this.isRunning = false;
  }

  // Polen ambiental de fondo
  spawnPollen() {
    if (this.particles.length >= this.maxParticles || !this.canvas) return;
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;

    this.particles.push({
      x: Math.random() * w,
      y: h + 10,
      vx: (Math.random() - 0.5) * 0.6,
      vy: -(0.4 + Math.random() * 0.8),
      size: 1.5 + Math.random() * 3.5,
      alpha: 0.1 + Math.random() * 0.5,
      color: Math.random() > 0.4 ? '#FFC94F' : '#FFE9A8',
      life: 0,
      maxLife: 300 + Math.random() * 400
    });
  }

  // Estallido al tocar una flor
  burstAt(x, y, isGolden = false, count = 14) {
    const colors = isGolden 
      ? ['#FFE9A8', '#FFC94F', '#F59E0B', '#FFFFFF'] 
      : ['#FFC94F', '#BCE5C8', '#FF8C80', '#FFFFFF'];

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = (isGolden ? 3.5 : 2.2) + Math.random() * 2.8;

      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: isGolden ? 3 + Math.random() * 4 : 2 + Math.random() * 3,
        alpha: 0.9,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 0,
        maxLife: 45 + Math.random() * 25
      });
    }
  }

  // Gota de néctar que vuela parabólicamente a la colmena
  launchDrop(fromX, fromY, toX, toY, isGolden = false, onArrive = null) {
    const ctrlX = (fromX + toX) / 2 + (Math.random() - 0.5) * 60;
    const ctrlY = Math.min(fromY, toY) - (80 + Math.random() * 70);

    this.drops.push({
      p0: { x: fromX, y: fromY },
      p1: { x: ctrlX, y: ctrlY },
      p2: { x: toX, y: toY },
      progress: 0,
      speed: 0.024 + Math.random() * 0.008, // Duración ~400ms
      isGolden: isGolden,
      onArrive: onArrive,
      size: isGolden ? 10 : 7
    });
  }

  // Fuegos artificiales de miel dorada al ganar
  celebrationFirework() {
    if (!this.canvas) return;
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;
    const x = w * 0.2 + Math.random() * w * 0.6;
    const y = h * 0.2 + Math.random() * h * 0.4;
    this.burstAt(x, y, true, 32);
  }

  loop() {
    if (!this.isRunning) return;
    const now = performance.now();
    const dt = Math.min(32, now - this.lastTime);
    this.lastTime = now;

    if (!this.canvas || !this.ctx) return;
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;

    this.ctx.clearRect(0, 0, w, h);

    // Polen
    if (Math.random() < 0.2) this.spawnPollen();

    // Actualizar y dibujar partículas
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life++;

      const progress = p.life / p.maxLife;
      const currentAlpha = p.alpha * (1 - progress);

      if (progress >= 1) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, currentAlpha);
      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    // Actualizar y dibujar gotas voladoras
    for (let i = this.drops.length - 1; i >= 0; i--) {
      const d = this.drops[i];
      d.progress += d.speed;

      const t = Math.min(1, d.progress);
      // Bézier cuadrática
      const curX = (1 - t) * (1 - t) * d.p0.x + 2 * (1 - t) * t * d.p1.x + t * t * d.p2.x;
      const curY = (1 - t) * (1 - t) * d.p0.y + 2 * (1 - t) * t * d.p1.y + t * t * d.p2.y;

      // Estela pequeña
      this.ctx.save();
      this.ctx.globalAlpha = 0.55;
      this.ctx.fillStyle = d.isGolden ? '#FFE9A8' : '#FFC94F';
      this.ctx.beginPath();
      this.ctx.arc(curX - (d.p2.x - curX) * 0.05, curY - (d.p2.y - curY) * 0.05, d.size * 0.6, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();

      // Gota principal
      this.ctx.save();
      this.ctx.shadowColor = d.isGolden ? '#F59E0B' : '#FFC94F';
      this.ctx.shadowBlur = d.isGolden ? 12 : 6;
      this.ctx.fillStyle = d.isGolden ? '#FFE9A8' : '#FFC94F';
      this.ctx.beginPath();
      this.ctx.arc(curX, curY, d.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();

      if (t >= 1) {
        if (d.onArrive) d.onArrive();
        this.burstAt(d.p2.x, d.p2.y, d.isGolden, 6);
        this.drops.splice(i, 1);
      }
    }

    requestAnimationFrame(() => this.loop());
  }
}

if (typeof window !== 'undefined') {
  window.NectarParticleEngine = NectarParticleEngine;
}
