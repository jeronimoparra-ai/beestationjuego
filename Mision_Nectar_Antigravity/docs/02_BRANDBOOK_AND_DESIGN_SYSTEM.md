# BRANDBOOK Y SISTEMA DE DISEÑO
# BeeStation: Misión Néctar

---

## 1. IDENTIDAD DE MARCA Y CONVIVENCIA CON BEEStation

### 1.1 Jerarquía Institucional
- **Marca Anfitriona / Madre:** **BeeStation** (Tecnología IoT no invasiva para la apicultura, SENA Centro Minero Ambiental).
  - Tono: Científico, confiable, ecológico, innovador, sobrio pero accesible.
  - Paleta núcleo: `#F59E0B` (Ámbar abeja), `#D97706` (Miel profunda), `#1C1C1E` (Grafito noche).
- **Sub-marca de Experiencia:** **Misión Néctar** (Videojuego lúdico-educativo ferial).
  - Tono: Cálido, enérgico, mágico, tierno, inclusivo y cooperativo.
  - El imagotipo integra el hexágono de celdilla apícola estilizado con alas dinámicas y una gota de néctar radiante que brota del centro.

```
       / \         <- Alas etéreas
     /     \
    |   *   |      <- Núcleo de néctar radiante
     \     /
       \ /         <- Celdilla hexagonal base
   MISIÓN NÉCTAR   <- Tipografía Fredoka / Nunito Bold
  Un juego BeeStation
```

### 1.2 Reglas de Convivencia Visual
1. El logotipo de **BeeStation** siempre aparece en la esquina superior izquierda o en la base del podio como sello de procedencia técnica.
2. El título **Misión Néctar** utiliza bordes redondeados y relieve amigable para conectar con la audiencia infantil y familiar, pero sin caer en el infantilismo plano o elementos de baja calidad como emojis estándar.
3. Se mantiene una estricta consistencia en la iluminación: luz dorada cenital de mañana (hora de mayor pecoreo de las abejas).

---

## 2. PALETA CROMÁTICA COMPLETA Y ROLES DE COLOR

### 2.1 Colores Principales (Brand Core)
| Nombre del Tono | Código HEX | RGB | Rol en el Videojuego |
|---|---|---|---|
| **BeeStation Amber** | `#F59E0B` | (245, 158, 11) | Color anfitrión principal; botones de acción, destellos dorados, aureolas. |
| **Deep Honey** | `#D97706` | (217, 119, 6) | Sombras, bordes táctiles, acentos de profundidad y botones activos. |
| **Bee Dark Graphite**| `#1C1C1E` | (28, 28, 30) | Fondos de alto contraste en UI, textos legibles sobre fondos claros. |

### 2.2 Paleta Secundaria del Jardín y Personajes (Nature & Flora)
| Nombre del Tono | Código HEX | RGB | Rol en Escenarios e Interfaz |
|---|---|---|---|
| **Flower Cream** | `#FFF8E9` | (255, 248, 233) | Fondo base cálido, pergaminos de UI, paneles de diálogo de Mielita. |
| **Honey Gold** | `#FFC94F` | (255, 201, 79) | Relleno de néctar, brillo de flores doradas, polen flotante. |
| **Garden Green** | `#67A56D` | (103, 165, 109) | Hojas, tallos sanos, indicadores de éxito y progreso positivo. |
| **Soft Mint** | `#BCE5C8` | (188, 229, 200) | Alas traslúcidas de las abejas, efectos de rocío y frescura. |
| **Sky Blue** | `#9EDDF1` | (158, 221, 241) | Cielo de mañana, antenas de Cielo, indicadores de conexión WiFi. |
| **Coral Bloom** | `#FF8C80` | (255, 140, 128) | Flores de coral, alertas amables, bufanda de Coral, rubor de mejillas. |
| **Lavender Mist** | `#B8A4E5` | (184, 164, 229) | Flores violeta, moño de Lavanda, medallas de plata y rareza. |
| **Soft Peach** | `#FFD0AD` | (255, 208, 173) | Tono de piel de Mielita, bufandas, flores dulces. |
| **Leaf Dark** | `#344536` | (52, 69, 54) | Tipografía principal de alta legibilidad, contornos orgánicos. |
| **Nature Brown** | `#76563D` | (118, 86, 61) | Rayas del abdomen de las abejas, ramas del jardín y madera de colmena. |

---

## 3. TIPOGRAFÍA Y JERARQUÍAS

### 3.1 Fuentes Tipográficas Oficiales
- **Tipografía de Título y Display:** `Fredoka` (Google Fonts, pesos 600 SemiBold y 700 Bold).
  - Razón de elección: Trazos redondeados, orgánicos y amables, con alto impacto visual y excelente legibilidad desde 3 metros en pantallas de TV.
- **Tipografía de Cuerpo y Datos Numéricos:** `Nunito` (Google Fonts, pesos 600 SemiBold, 700 Bold, 900 Black).
  - Razón de elección: Gran altura de x, dígitos tabulares bien diferenciados ideales para temporizadores regresivos y contadores de puntos.

### 3.2 Escala de Tamaños
| Nivel | Tamaño TV (1920x1080) | Tamaño Celular (390x844) | Peso y Estilo |
|---|---|---|---|
| **H1 Display** (Titular / Fin de partida) | 64px - 72px | 32px - 36px | Fredoka 700, sombra sutil |
| **H2 Sección** (Lobby, Podio) | 42px - 48px | 24px - 28px | Fredoka 600 |
| **H3 Tarjeta / Alerta** | 28px - 32px | 18px - 20px | Nunito 800 |
| **Temporizador Central** | 80px - 96px | 44px - 52px | Nunito 900 Tabular |
| **Cuerpo / Instrucciones** | 22px - 26px | 15px - 17px | Nunito 600 |
| **Microcopy / Metadatos** | 16px - 18px | 12px - 13px | Nunito 700 Caps |

---

## 4. SISTEMA DE COMPONENTES DE INTERFAZ

### 4.1 Botones Táctiles Móviles
- Altura mínima: **58px**, con esquinas redondeadas `border-radius: 28px`.
- Efecto 3D táctil tipo pill arcade: sombra inferior sólida (`box-shadow: 0 6px 0 var(--color-shadow)`), que al presionarse (`:active`) se comprime a `translateY(4px)` y reduce la sombra a `0 2px 0`.
- Soporte haptic integrado vía Web API.

### 4.2 Indicador de Néctar y Colmena
- Frasco / Ánfora hexagonal con nivel de líquido SVG dinámico.
- Ondas sinusoidales animadas en la superficie del líquido mediante clip-paths y funciones trigonométricas.
- Burbujas de miel flotantes que emergen desde el fondo del frasco.
- Porcentaje central en tipografía Nunito 900 con rebote elástico cada vez que aumenta 10%.

### 4.3 Tarjetas de Jugador (Player Badges)
- Contenedor hexagonal u ovalado con borde en `#FFC94F`.
- Micro-avatar animado de la abeja elegida.
- Nombre o apodo del explorador con recorte elíptico si supera 12 caracteres.
- Contador de néctar aportado en tiempo real.
