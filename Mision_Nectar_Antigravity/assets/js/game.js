/**
 * BeeStation: Misión Néctar - Motor Central de Juego
 * Manejo de estados (Lobby, Countdown, Juego, Resultados, Telemetría) y reglas de negocio
 */

class NectarGameCore {
  constructor({ isHost = false, role = 'tv' } = {}) {
    this.isHost = isHost;
    this.role = role; // 'tv', 'mobile', 'organizer'
    this.state = 'LOBBY'; // LOBBY, COUNTDOWN, PLAYING, RESULTS, TELEMETRY
    this.roundDuration = 30; // Segundos
    this.timeLeft = 30;
    this.timerInterval = null;

    // Métricas de partida
    this.hiveTargetDrops = 50; // Meta base colectiva
    this.hiveCurrentDrops = 0;
    this.totalScore = 0;
    this.overflowDrops = 0;

    // Jugadores
    this.players = new Map();
    this.localPlayer = null;

    // Flores activas
    this.flowers = [];
    this.flowerSlotsCount = 6;
    this.flowerSpawnInterval = null;

    // Racha local (solo móvil)
    this.localCombo = 0;

    // Bots simulados
    this.bots = [];
    this.botsInterval = null;

    this.initSync();
  }

  initSync() {
    if (!window.networkSync) return;

    window.networkSync.on('PLAYER_JOIN', (payload) => {
      this.players.set(payload.id, {
        id: payload.id,
        name: payload.name || 'Explorador',
        character: payload.character || 'nectar',
        color: payload.color || '#F59E0B',
        score: payload.score || 0,
        drops: payload.drops || 0,
        isBot: !!payload.isBot
      });
      if (this.onPlayersUpdated) this.onPlayersUpdated();
    });

    window.networkSync.on('START_COUNTDOWN', () => {
      this.startCountdown();
    });

    window.networkSync.on('START_ROUND', (payload) => {
      this.startRound(payload);
    });

    window.networkSync.on('COLLECT_NECTAR', (payload) => {
      this.handleNectarCollected(payload);
    });

    window.networkSync.on('GAME_OVER', (payload) => {
      this.handleGameOver(payload);
    });

    window.networkSync.on('RESET_ROOM', () => {
      this.resetRoom();
    });

    window.networkSync.on('SWITCH_TELEMETRY', () => {
      this.state = 'TELEMETRY';
      if (this.onStateChanged) this.onStateChanged('TELEMETRY');
    });

    window.networkSync.on('INJECT_BOTS', (payload) => {
      this.injectBots(payload.count || 5);
    });
  }

  // --- REGISTRO DE JUGADOR LOCAL ---
  registerLocalPlayer({ name, character }) {
    const id = window.networkSync ? window.networkSync.getSenderId() : 'local_' + Math.random().toString(36).substr(2, 5);
    const charData = (window.EXPLORER_BEES || []).find(b => b.id === character) || { color: '#F59E0B' };

    this.localPlayer = {
      id: id,
      name: name || 'Abejita ' + Math.floor(100 + Math.random() * 900),
      character: character || 'nectar',
      color: charData.color,
      score: 0,
      drops: 0,
      combo: 0
    };

    this.players.set(id, this.localPlayer);

    if (window.networkSync) {
      window.networkSync.send('PLAYER_JOIN', this.localPlayer);
    }

    return this.localPlayer;
  }

  // --- CUENTA REGRESIVA ---
  startCountdown() {
    this.state = 'COUNTDOWN';
    if (this.onStateChanged) this.onStateChanged('COUNTDOWN');

    let count = 3;
    if (window.audioSystem) window.audioSystem.playTick();
    if (this.onCountdownTick) this.onCountdownTick(count);

    const cInterval = setInterval(() => {
      count--;
      if (count > 0) {
        if (window.audioSystem) window.audioSystem.playTick();
        if (this.onCountdownTick) this.onCountdownTick(count);
      } else {
        clearInterval(cInterval);
        if (window.audioSystem) window.audioSystem.playGo();
        if (this.onCountdownTick) this.onCountdownTick('¡A VOLAR!');
        setTimeout(() => {
          if (this.isHost) {
            window.networkSync.send('START_ROUND', { duration: this.roundDuration });
          }
        }, 600);
      }
    }, 1000);
  }

  // --- INICIO DE PARTIDA ---
  startRound({ duration = 30 } = {}) {
    this.state = 'PLAYING';
    this.timeLeft = duration;
    this.hiveCurrentDrops = 0;
    this.overflowDrops = 0;
    this.totalScore = 0;
    this.localCombo = 0;

    // Resetear puntuación de jugadores
    this.players.forEach(p => {
      p.score = 0;
      p.drops = 0;
    });

    if (this.onStateChanged) this.onStateChanged('PLAYING');
    if (window.audioSystem) {
      window.audioSystem.setTempo(112);
      window.audioSystem.startBgm();
    }

    // Inicializar ranuras de flores
    this.initFlowers();

    // Iniciar temporizador
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      this.timeLeft--;

      // Aceleración de música en últimos 10 segundos
      if (this.timeLeft <= 10 && this.timeLeft > 0 && window.audioSystem) {
        window.audioSystem.setTempo(135);
      }

      if (this.onTimerTick) this.onTimerTick(this.timeLeft);

      if (this.timeLeft <= 0) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
        if (this.isHost) {
          window.networkSync.send('GAME_OVER', {
            hiveDrops: this.hiveCurrentDrops,
            targetDrops: this.hiveTargetDrops,
            overflowDrops: this.overflowDrops,
            topPlayers: this.getTopPlayers(10)
          });
        }
      }
    }, 1000);

    // Ciclo de floración
    this.startFlowerSpawning();
  }

  // --- GESTIÓN DE FLORES ---
  initFlowers() {
    const types = ['margarita', 'coral', 'azul', 'lavanda', 'rosa'];
    this.flowers = [];
    for (let i = 0; i < this.flowerSlotsCount; i++) {
      this.flowers.push({
        slotIndex: i,
        type: types[i % types.length],
        state: 'active',
        isGolden: false,
        cooldownTimer: null
      });
    }
    if (this.onFlowersUpdated) this.onFlowersUpdated(this.flowers);
  }

  startFlowerSpawning() {
    if (this.flowerSpawnInterval) clearInterval(this.flowerSpawnInterval);
    this.flowerSpawnInterval = setInterval(() => {
      if (this.state !== 'PLAYING') return;

      // Probabilidad de flor dorada (25% base, 40% en últimos 10s)
      const goldenChance = this.timeLeft <= 10 ? 0.40 : 0.22;
      const slot = Math.floor(Math.random() * this.flowerSlotsCount);
      const flower = this.flowers[slot];

      if (flower && flower.state === 'recharging') {
        const isGold = Math.random() < goldenChance;
        flower.type = isGold ? 'dorada' : ['margarita', 'coral', 'azul', 'lavanda', 'rosa'][Math.floor(Math.random() * 5)];
        flower.isGolden = isGold;
        flower.state = 'active';
        if (this.onFlowerChanged) this.onFlowerChanged(flower);
      }
    }, 1100);
  }

  // --- RECOLECCIÓN DE NÉCTAR ---
  tapFlower(slotIndex) {
    if (this.state !== 'PLAYING') return null;
    const flower = this.flowers[slotIndex];
    if (!flower || flower.state !== 'active') return null;

    const isGolden = flower.isGolden;
    const basePoints = isGolden ? 30 : 10;
    const dropCount = isGolden ? 3 : 1;

    // Actualizar racha combo
    this.localCombo++;
    const multiplier = this.localCombo >= 6 ? 3 : this.localCombo >= 3 ? 2 : 1;
    const totalPoints = basePoints * multiplier;

    // Cambiar estado a cosechada y programar enfriamiento
    flower.state = 'harvested';
    if (this.onFlowerChanged) this.onFlowerChanged(flower);

    setTimeout(() => {
      flower.state = 'recharging';
      if (this.onFlowerChanged) this.onFlowerChanged(flower);
    }, 300);

    // Audio y háptica
    if (window.audioSystem) {
      if (isGolden) window.audioSystem.playGoldenBurst();
      else window.audioSystem.playPop();

      if (this.localCombo === 3 || this.localCombo === 6) {
        window.audioSystem.playComboUp(this.localCombo);
      }
    }

    if (navigator.vibrate) {
      navigator.vibrate(isGolden ? [25, 40, 35] : [15]);
    }

    // Enviar sincronización
    const payload = {
      playerId: this.localPlayer ? this.localPlayer.id : 'player_anon',
      playerName: this.localPlayer ? this.localPlayer.name : 'Explorador',
      character: this.localPlayer ? this.localPlayer.character : 'nectar',
      points: totalPoints,
      drops: dropCount,
      isGolden: isGolden,
      slotIndex: slotIndex,
      combo: this.localCombo,
      multiplier: multiplier
    };

    if (window.networkSync) {
      window.networkSync.send('COLLECT_NECTAR', payload);
    } else {
      this.handleNectarCollected(payload);
    }

    return payload;
  }

  handleNectarCollected(payload) {
    // Actualizar jugador
    let p = this.players.get(payload.playerId);
    if (!p) {
      p = {
        id: payload.playerId,
        name: payload.playerName,
        character: payload.character,
        score: 0,
        drops: 0
      };
      this.players.set(payload.playerId, p);
    }

    p.score += payload.points;
    p.drops += payload.drops;

    // Actualizar colmena colectiva
    this.totalScore += payload.points;
    if (this.hiveCurrentDrops < this.hiveTargetDrops) {
      this.hiveCurrentDrops = Math.min(this.hiveTargetDrops, this.hiveCurrentDrops + payload.drops);
      if (this.hiveCurrentDrops >= this.hiveTargetDrops) {
        if (window.audioSystem) window.audioSystem.playVictory();
      }
    } else {
      this.overflowDrops += payload.drops;
    }

    if (this.onNectarCollected) this.onNectarCollected(payload, {
      currentDrops: this.hiveCurrentDrops,
      targetDrops: this.hiveTargetDrops,
      overflow: this.overflowDrops,
      progressPercent: Math.min(100, Math.floor((this.hiveCurrentDrops / this.hiveTargetDrops) * 100))
    });
  }

  // --- FINAL DE PARTIDA ---
  handleGameOver(payload) {
    this.state = 'RESULTS';
    if (this.timerInterval) clearInterval(this.timerInterval);
    if (this.flowerSpawnInterval) clearInterval(this.flowerSpawnInterval);

    if (window.audioSystem) {
      window.audioSystem.stopBgm();
      window.audioSystem.playVictory();
    }

    if (this.onStateChanged) this.onStateChanged('RESULTS', payload);
  }

  // --- REINICIAR SALA ---
  resetRoom() {
    this.state = 'LOBBY';
    this.timeLeft = this.roundDuration;
    this.hiveCurrentDrops = 0;
    this.overflowDrops = 0;
    this.totalScore = 0;
    this.localCombo = 0;

    if (this.timerInterval) clearInterval(this.timerInterval);
    if (this.flowerSpawnInterval) clearInterval(this.flowerSpawnInterval);
    if (window.audioSystem) window.audioSystem.stopBgm();

    this.initFlowers();
    if (this.onStateChanged) this.onStateChanged('LOBBY');
  }

  // --- INYECCIÓN DE BOTS PARA SIMULAR HASTA 100 ABEJAS ---
  injectBots(count = 10) {
    const chars = ['nectar', 'menta', 'coral', 'lavanda', 'cielo', 'durazno'];
    const botNames = ['Zumbador', 'Poli-Bot', 'Alita', 'RayoMiel', 'Solcito', 'Dulceflor', 'Brisa', 'Chispita', 'Florecita', 'Avispado'];

    for (let i = 0; i < count; i++) {
      const bId = 'bot_' + Math.random().toString(36).substr(2, 6);
      const bChar = chars[i % chars.length];
      const bName = botNames[i % botNames.length] + ' #' + (i + 1);

      const bot = {
        id: bId,
        name: bName,
        character: bChar,
        score: 0,
        drops: 0,
        isBot: true
      };

      this.players.set(bId, bot);
      if (window.networkSync) {
        window.networkSync.send('PLAYER_JOIN', bot);
      }
    }

    if (this.botsInterval) clearInterval(this.botsInterval);
    this.botsInterval = setInterval(() => {
      if (this.state !== 'PLAYING') return;
      // Los bots tocan flores aleatoriamente
      const randomSlot = Math.floor(Math.random() * this.flowerSlotsCount);
      const randomBot = Array.from(this.players.values()).filter(p => p.isBot)[Math.floor(Math.random() * count)];

      if (randomBot) {
        const isGolden = Math.random() < 0.2;
        this.handleNectarCollected({
          playerId: randomBot.id,
          playerName: randomBot.name,
          character: randomBot.character,
          points: isGolden ? 30 : 10,
          drops: isGolden ? 3 : 1,
          isGolden: isGolden,
          slotIndex: randomSlot
        });
      }
    }, Math.max(150, 1800 / Math.max(1, count)));
  }

  getTopPlayers(limit = 10) {
    return Array.from(this.players.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }
}

if (typeof window !== 'undefined') {
  window.NectarGameCore = NectarGameCore;
}
