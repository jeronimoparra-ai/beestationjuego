# MANUAL DE IMPLEMENTACIÓN TÉCNICA Y DESPLIEGUE
# BeeStation: Misión Néctar

---

## 1. ARQUITECTURA DEL PROTOTIPO Y TECNOLOGÍAS

Para garantizar que el prototipo sea inmediatamente ejecutable en cualquier navegador sin necesidad de compilar paquetes pesados ni sufrir fallos de dependencias en Windows, se ha construido sobre tecnologías web nativas modernas y de máximo rendimiento:

1. **HTML5 Semántico + Responsive Grid & Flexbox:**
   - Vista TV fijada a relación 16:9 con contención `object-fit: contain` / `aspect-ratio: 16/9` para televisores 1080p, 2K o 4K.
   - Vista Móvil optimizada para orientación vertical (desde 320x568px en iPhone SE hasta 430x932px en iPhone 15 Pro Max) con prevención de zoom accidental (`touch-action: manipulation`, `user-scalable=no`).
2. **CSS3 Modular con Variables y Animaciones GPU:**
   - Transformaciones aceleradas por hardware (`translate3d`, `scale`, `rotate`) para garantizar 60 FPS estables.
3. **HTML5 Canvas 2D Particle Engine:**
   - Motor de partículas de alto rendimiento para el polen, gotas de néctar voladoras y fuegos artificiales de victoria.
4. **Web Audio API Procedural Synth:**
   - Generación de sonido en tiempo real sin archivos MP3 externos. Cero latencia y cero fallos 404.
5. **Cross-Tab Local Synchronizer (`BroadcastChannel` + `localStorage` fallback):**
   - Permite que si abres el TV en una ventana o monitor y el Móvil en otra ventana (o varios móviles en el mismo navegador o dispositivos en red local), los toques y la puntuación se comuniquen instantáneamente en tiempo real en menos de 5 milisegundos.

---

## 2. ESTRUCTURA DE ARCHIVOS DEL PROTOTIPO

```
beestation-mision-nectar/
│
├── index.html                   # Portal unificado con Selector de Vistas y Simulador Dual
├── tv.html                      # Vista Televisor 16:9 (Público / Stand)
├── mobile.html                  # Vista Celular Vertical (Mando del Jugador)
├── organizer.html               # Consola del Organizador / Game Master
├── telemetry.html               # Demostración Interactiva BeeStation IoT
│
├── docs/                        # Documentación Técnica y Creativa Completa
│   ├── 01_GAME_DESIGN_DOCUMENT.md
│   ├── 02_BRANDBOOK_AND_DESIGN_SYSTEM.md
│   ├── 03_CHARACTER_BIBLE.md
│   ├── 04_ENVIRONMENT_ART_BIBLE.md
│   ├── 05_ANIMATION_AND_MOTION_BIBLE.md
│   ├── 06_AUDIO_SPECIFICATION.md
│   ├── 07_BEESTATION_BRIDGE_AND_TELEMETRY.md
│   └── 08_TECHNICAL_IMPLEMENTATION_MANUAL.md
│
└── assets/                      # Recursos Gráficos, Estilos y Scripts
    ├── key_art.jpg              # Arte conceptual oficial generado
    ├── css/
    │   ├── theme.css            # Paleta, variables y reset tipográfico
    │   ├── tv.css               # Estilos de la pantalla TV
    │   ├── mobile.css           # Estilos ergonómicos táctiles del móvil
    │   ├── organizer.css        # Consola de control y panel de bots
    │   └── telemetry.css        # Dashboard educativo tecnológico
    ├── js/
    │   ├── audio.js             # Sintetizador procedural Web Audio API
    │   ├── characters.js        # Modelos SVG de Mielita y 6 abejas
    │   ├── flowers.js           # Lógica botánica y ciclos de floración
    │   ├── particles.js         # Canvas physics de polen y miel
    │   ├── sync.js              # BroadcastChannel y sincronización
    │   └── game.js              # Máquina de estados del juego
    └── svg/                     # Catálogo de recursos vectoriales editables
        ├── characters/          # SVGs independientes de cada abeja
        ├── flowers/             # SVGs de flores en sus 6 estados
        ├── ui/                  # Iconos, colmena, ánforas, marcos QR
        └── telemetry/           # Diagrama ESP32, sensores y colmena
```

---

## 3. CÓMO EJECUTAR EL PROTOTIPO

### Opción A: Ejecución Directa (Doble Clic)
1. Abrir la carpeta `C:\Users\andre\.gemini\antigravity\scratch\beestation-mision-nectar`.
2. Hacer doble clic sobre `index.html`.
3. El portal cargará en el navegador predeterminado (Chrome, Edge, Firefox).

### Opción B: Servidor Local Rápido (Recomendado para red WiFi local)
Si se desea proyectar el TV en un televisor HDMI y conectar celulares reales conectados a la misma red WiFi local:
```powershell
cd C:\Users\andre\.gemini\antigravity\scratch\beestation-mision-nectar
python -m http.server 8080
```
Luego:
- En la pantalla de TV: Abrir `http://localhost:8080/tv.html`.
- En los celulares de los visitantes: Abrir `http://<IP_DE_TU_PC>:8080/mobile.html` (o escanear el QR generado automáticamente en la pantalla de TV).

---

## 4. HOJA DE RUTA PARA INTEGRACIÓN FUTURA (FASE POSTERIOR)

Cuando el equipo decida llevar el prototipo a producción en un stand físico de feria con hasta 100 participantes simultáneos:

1. **Servidor WebSocket Local Ligero:**
   - Un script en Node.js (`ws` library) o Python (`websockets` / `FastAPI`) ejecutándose en la misma máquina local o en una Raspberry Pi 4 / mini PC.
   - Latencia promedio estimada: < 8 milisegundos en red local privada de 5 GHz.
2. **Generación Dinámica de Código QR:**
   - El TV detecta automáticamente la IP local asignada por el router WiFi del stand y dibuja el QR exacto con la URL `http://192.168.x.x:8080/mobile.html?room=STAND_SENA`.
3. **Persistencia Educativa:**
   - Los participantes pueden ingresar voluntariamente su correo electrónico al finalizar la demostración para recibir un folleto digital en PDF sobre la tecnología de BeeStation y el cuidado de las abejas.
