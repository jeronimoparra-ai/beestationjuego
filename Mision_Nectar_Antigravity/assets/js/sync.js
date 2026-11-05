/**
 * BeeStation: Misión Néctar - Motor de Sincronización en Tiempo Real
 * Utiliza BroadcastChannel nativo con fallback a localStorage para comunicación entre pestañas
 */

class NectarNetworkSync {
  constructor(channelName = 'beestation_nectar_room') {
    this.channelName = channelName;
    this.channel = null;
    this.listeners = new Map();

    this.init();
  }

  init() {
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        this.channel = new BroadcastChannel(this.channelName);
        this.channel.onmessage = (e) => this.handleMessage(e.data);
      } catch (err) {
        console.warn('BroadcastChannel error, usando fallback localStorage', err);
      }
    }

    // Fallback con evento storage de window
    window.addEventListener('storage', (e) => {
      if (e.key === this.channelName && e.newValue) {
        try {
          const data = JSON.parse(e.newValue);
          this.handleMessage(data);
        } catch (ex) {}
      }
    });
  }

  on(eventType, callback) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType).push(callback);
  }

  off(eventType, callback) {
    if (!this.listeners.has(eventType)) return;
    const arr = this.listeners.get(eventType).filter(cb => cb !== callback);
    this.listeners.set(eventType, arr);
  }

  send(eventType, payload = {}) {
    const message = {
      type: eventType,
      payload: payload,
      timestamp: Date.now(),
      senderId: this.getSenderId()
    };

    if (this.channel) {
      try {
        this.channel.postMessage(message);
      } catch (e) {}
    }

    // Almacenar en localStorage para pestañas de respaldo
    try {
      localStorage.setItem(this.channelName, JSON.stringify(message));
    } catch (e) {}

    // Despachar también localmente para la propia pestaña
    this.handleMessage(message);
  }

  handleMessage(msg) {
    if (!msg || !msg.type) return;
    const callbacks = this.listeners.get(msg.type);
    if (callbacks) {
      callbacks.forEach(cb => {
        try {
          cb(msg.payload, msg);
        } catch (err) {
          console.error('Error en callback sync:', err);
        }
      });
    }

    // Notificar listeners globales
    const allCallbacks = this.listeners.get('*');
    if (allCallbacks) {
      allCallbacks.forEach(cb => cb(msg));
    }
  }

  getSenderId() {
    if (!this._senderId) {
      this._senderId = 'client_' + Math.random().toString(36).substr(2, 7);
    }
    return this._senderId;
  }
}

if (typeof window !== 'undefined') {
  window.NectarNetworkSync = NectarNetworkSync;
  window.networkSync = new NectarNetworkSync();
}
