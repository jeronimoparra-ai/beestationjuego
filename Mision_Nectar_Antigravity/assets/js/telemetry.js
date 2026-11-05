/**
 * BeeStation: Misión Néctar - Módulo de Telemetría Educativa IoT
 * Conexión narrativa entre el videojuego y el sistema de monitoreo no invasivo SENA Centro Minero Ambiental
 */

class BeeStationTelemetryDemo {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.timeOfDay = 10; // Horas (6 a 18)
    this.simData = {
      temp: 34.8, // °C
      humidity: 58, // %
      weight: 42.6, // kg
      frequency: 238, // Hz
      colonyStatus: 'ÓPTIMO - REINA PRESENTE',
      battery: 94 // %
    };
  }

  init() {
    if (!this.container) return;
    this.render();
    this.attachEvents();
  }

  // Calcula valores realistas según la hora del día
  updateTime(hour) {
    this.timeOfDay = hour;

    // A las 7:00 las abejas salen (el peso desciende 0.8kg). Hacia las 16:00 vuelven con néctar (el peso sube +2.4kg).
    let weightDelta = 0;
    if (hour <= 8) weightDelta = -0.3;
    else if (hour <= 11) weightDelta = -0.7; // Salida masiva a pecorear
    else if (hour <= 15) weightDelta = +0.8; // Ingreso de néctar
    else weightDelta = +2.2; // Almacenamiento pleno de néctar del juego

    this.simData.weight = +(41.5 + weightDelta).toFixed(2);
    // Temperatura de cría estrictamente autorregulada por las abejas
    this.simData.temp = +(34.5 + Math.sin(hour / 3) * 0.4).toFixed(1);
    this.simData.humidity = +(62 - (hour > 12 ? (hour - 12) * 1.5 : 0)).toFixed(0);
    this.simData.frequency = Math.floor(235 + Math.sin(hour) * 8);

    this.updateUI();
  }

  render() {
    this.container.innerHTML = `
      <div class="telemetry-panel">
        <!-- Encabezado con Mielita Científica -->
        <div class="telemetry-header">
          <div class="telemetry-avatar" id="telem-mielita-slot"></div>
          <div class="telemetry-title-block">
            <div class="badge-sena">SENA · Centro Minero Ambiental · Proyecto BeeStation</div>
            <h2>Monitoreo Apícola No Invasivo con IoT</h2>
            <p class="telemetry-intro">
              "¿Cómo sabemos qué sucede dentro de la colmena sin abrirla ni alterar a las abejas? 
              El nodo <strong>ESP32</strong> registra peso, temperatura, humedad y el zumbido acústico 
              de la reina en tiempo real."
            </p>
          </div>
        </div>

        <!-- Barra interactiva de tiempo -->
        <div class="time-control-card">
          <div class="time-label-row">
            <span><strong>Simulador del Día de Pecoreo:</strong></span>
            <span id="label-cur-hour" class="highlight-time">${this.timeOfDay}:00 hrs (Pecoreo Matutino)</span>
          </div>
          <input type="range" id="time-slider" min="6" max="18" value="${this.timeOfDay}" step="1" class="telemetry-slider" />
          <div class="slider-marks">
            <span>06:00 (Amanecer)</span>
            <span>10:00 (Misión Néctar)</span>
            <span>14:00 (Zumbido Activo)</span>
            <span>18:00 (Cierre de Piquera)</span>
          </div>
        </div>

        <!-- Matriz de 4 Sensores Principales -->
        <div class="sensor-cards-grid">
          <!-- Sensor 1: Temperatura de Cría -->
          <div class="sensor-card">
            <div class="sensor-card-top">
              <span class="sensor-badge">DHT22 / DS18B20</span>
              <span class="sensor-status-dot green"></span>
            </div>
            <div class="sensor-icon">🌡️</div>
            <div class="sensor-name">Temperatura de Nido</div>
            <div class="sensor-value" id="val-temp">${this.simData.temp} °C</div>
            <div class="sensor-desc">Rango óptimo vital: 34.5°C a 35.5°C para el desarrollo larvario.</div>
            <div class="sensor-mini-bar">
              <div class="sensor-bar-fill" id="bar-temp" style="width: 88%;"></div>
            </div>
          </div>

          <!-- Sensor 2: Humedad Relativa -->
          <div class="sensor-card">
            <div class="sensor-card-top">
              <span class="sensor-badge">DHT22</span>
              <span class="sensor-status-dot green"></span>
            </div>
            <div class="sensor-icon">💧</div>
            <div class="sensor-name">Humedad Interior</div>
            <div class="sensor-value" id="val-hum">${this.simData.humidity} %</div>
            <div class="sensor-desc">Evita la deshidratación del panal y la fermentación de la miel.</div>
            <div class="sensor-mini-bar">
              <div class="sensor-bar-fill" id="bar-hum" style="width: ${this.simData.humidity}%;"></div>
            </div>
          </div>

          <!-- Sensor 3: Báscula / Peso de Néctar -->
          <div class="sensor-card highlight-honey">
            <div class="sensor-card-top">
              <span class="sensor-badge">Celda HX711 200kg</span>
              <span class="sensor-status-dot green"></span>
            </div>
            <div class="sensor-icon">⚖️</div>
            <div class="sensor-name">Peso de la Colmena</div>
            <div class="sensor-value" id="val-weight">${this.simData.weight} kg</div>
            <div class="sensor-desc">Refleja directamente el néctar que las abejas acumulan durante el día.</div>
            <div class="sensor-mini-bar">
              <div class="sensor-bar-fill honey" id="bar-weight" style="width: 72%;"></div>
            </div>
          </div>

          <!-- Sensor 4: Actividad Acústica -->
          <div class="sensor-card">
            <div class="sensor-card-top">
              <span class="sensor-badge">FFT Microfónico</span>
              <span class="sensor-status-dot green"></span>
            </div>
            <div class="sensor-icon">📡</div>
            <div class="sensor-name">Frecuencia Acústica</div>
            <div class="sensor-value" id="val-freq">${this.simData.frequency} Hz</div>
            <div class="sensor-desc">200-250 Hz = Reina tranquila. >450 Hz = Alerta de enjambrazón.</div>
            <!-- Visualizador simulado de onda -->
            <div class="wave-visualizer">
              <div class="wave-bar" style="height: 40%;"></div>
              <div class="wave-bar" style="height: 75%;"></div>
              <div class="wave-bar" style="height: 95%;"></div>
              <div class="wave-bar" style="height: 60%;"></div>
              <div class="wave-bar" style="height: 85%;"></div>
              <div class="wave-bar" style="height: 50%;"></div>
            </div>
          </div>
        </div>

        <!-- Diagrama del Nodo ESP32 y Arquitectura Segura -->
        <div class="hardware-spec-box">
          <div class="hw-chip">
            <span class="hw-icon">⚡</span>
            <div>
              <strong>Nodo Local Autónomo ESP32</strong>
              <div class="hw-sub">POST JSON directo a api/ingest.php con firma criptográfica local. Sin nube externa obligatoria.</div>
            </div>
          </div>
          <div class="hw-chip">
            <span class="hw-icon">🔋</span>
            <div>
              <strong>Energía Sostenible</strong>
              <div class="hw-sub">Batería LiPo + Panel solar de apoyo. Autonomía permanente en campo.</div>
            </div>
          </div>
        </div>

        <div class="demo-notice">
          * Demostración interactiva didáctica conectada a la experiencia ferial Misión Néctar. Datos simulados con precisión biológica.
        </div>
      </div>
    `;

    // Renderizar avatar de Mielita científica
    const slot = document.getElementById('telem-mielita-slot');
    if (slot && window.renderBeeSVG) {
      slot.innerHTML = window.renderBeeSVG({
        character: 'mielita',
        expression: 'wink',
        accessory: 'flower',
        size: 90
      });
    }
  }

  attachEvents() {
    const slider = document.getElementById('time-slider');
    if (slider) {
      slider.addEventListener('input', (e) => {
        this.updateTime(parseInt(e.target.value, 10));
      });
    }
  }

  updateUI() {
    const lblHour = document.getElementById('label-cur-hour');
    const valTemp = document.getElementById('val-temp');
    const valHum = document.getElementById('val-hum');
    const valWeight = document.getElementById('val-weight');
    const valFreq = document.getElementById('val-freq');
    const barHum = document.getElementById('bar-hum');

    if (lblHour) {
      let desc = 'Pecoreo Normal';
      if (this.timeOfDay <= 8) desc = 'Salida de Abejas Exploradoras';
      else if (this.timeOfDay === 10 || this.timeOfDay === 11) desc = 'Pico de Recolección de Néctar';
      else if (this.timeOfDay >= 16) desc = 'Retorno Masivo al Nido';
      lblHour.textContent = `${this.timeOfDay}:00 hrs (${desc})`;
    }

    if (valTemp) valTemp.textContent = `${this.simData.temp} °C`;
    if (valHum) valHum.textContent = `${this.simData.humidity} %`;
    if (valWeight) valWeight.textContent = `${this.simData.weight} kg`;
    if (valFreq) valFreq.textContent = `${this.simData.frequency} Hz`;
    if (barHum) barHum.style.width = `${this.simData.humidity}%`;
  }
}

if (typeof window !== 'undefined') {
  window.BeeStationTelemetryDemo = BeeStationTelemetryDemo;
}
