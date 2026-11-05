/**
 * BeeStation: Misión Néctar - Motor de Flores y Botánica Interactiva
 * Variedades florales SVG, estados de floración, lógica de toques y recompensas
 */

const FLOWER_TYPES = {
  margarita: {
    id: 'margarita',
    name: 'Margarita Sol',
    color: '#FFC94F',
    accent: '#F59E0B',
    center: '#76563D',
    points: 10,
    isGolden: false
  },
  coral: {
    id: 'coral',
    name: 'Lirio Coral',
    color: '#FF8C80',
    accent: '#D9584C',
    center: '#FFE9A8',
    points: 10,
    isGolden: false
  },
  azul: {
    id: 'azul',
    name: 'Campanilla Azul',
    color: '#9EDDF1',
    accent: '#4BA6C7',
    center: '#FFF8E9',
    points: 10,
    isGolden: false
  },
  lavanda: {
    id: 'lavanda',
    name: 'Orquídea Lavanda',
    color: '#B8A4E5',
    accent: '#7E63BE',
    center: '#FFC94F',
    points: 10,
    isGolden: false
  },
  rosa: {
    id: 'rosa',
    name: 'Flor de Guayabo',
    color: '#FFD0AD',
    accent: '#FF8C80',
    center: '#FFE9A8',
    points: 10,
    isGolden: false
  },
  dorada: {
    id: 'dorada',
    name: 'Loto Celestial Dorado',
    color: '#FFE9A8',
    accent: '#F59E0B',
    center: '#FFF',
    points: 30,
    isGolden: true
  }
};

/**
 * Genera el SVG enriquecido de una flor según su tipo y estado
 * Estados: 'sprout' (brote), 'resting' (inactiva), 'glow' (aviso), 'active' (lista para tocar), 'harvested' (cosechada), 'recharging' (recuperándose)
 */
function renderFlowerSVG({
  type = 'margarita',
  state = 'active',
  size = 110,
  className = ''
} = {}) {
  const f = FLOWER_TYPES[type] || FLOWER_TYPES.margarita;
  const uid = 'flower_' + Math.random().toString(36).substr(2, 6);

  // Estados visuales
  const isGolden = f.isGolden;
  const isActive = state === 'active' || state === 'glow';
  const isHarvested = state === 'harvested';
  const isRecharging = state === 'recharging' || state === 'resting';

  let scaleClass = '';
  if (state === 'glow') scaleClass = 'flower-state-glow';
  else if (state === 'active') scaleClass = 'flower-state-active';
  else if (state === 'harvested') scaleClass = 'flower-state-harvested';
  else if (isRecharging) scaleClass = 'flower-state-recharge';

  // Pétalos según tipo
  let petalsMarkup = '';
  if (f.id === 'margarita') {
    // 8 pétalos simétricos
    petalsMarkup = `
      <g fill="${f.color}" stroke="${f.accent}" stroke-width="2">
        <ellipse cx="60" cy="30" rx="12" ry="24" />
        <ellipse cx="60" cy="90" rx="12" ry="24" />
        <ellipse cx="30" cy="60" rx="24" ry="12" />
        <ellipse cx="90" cy="60" rx="24" ry="12" />
        <ellipse cx="39" cy="39" rx="13" ry="23" transform="rotate(-45 39 39)" />
        <ellipse cx="81" cy="81" rx="13" ry="23" transform="rotate(-45 81 81)" />
        <ellipse cx="81" cy="39" rx="13" ry="23" transform="rotate(45 81 39)" />
        <ellipse cx="39" cy="81" rx="13" ry="23" transform="rotate(45 39 81)" />
      </g>
    `;
  } else if (f.id === 'dorada') {
    // Loto celestial dorado con pétalos dobles en flor de loto
    petalsMarkup = `
      <g fill="url(#${uid}_gold)" stroke="#D97706" stroke-width="2.5">
        <path d="M60 12 C72 32 75 48 60 58 C45 48 48 32 60 12 Z" />
        <path d="M60 108 C72 88 75 72 60 62 C45 72 48 88 60 108 Z" />
        <path d="M12 60 C32 48 48 45 58 60 C48 75 32 72 12 60 Z" />
        <path d="M108 60 C88 48 72 45 62 60 C72 75 88 72 108 60 Z" />
        <path d="M26 26 C44 38 52 50 48 62 C36 58 24 44 26 26 Z" />
        <path d="M94 26 C76 38 68 50 72 62 C84 58 96 44 94 26 Z" />
        <path d="M26 94 C44 82 52 70 48 58 C36 62 24 76 26 94 Z" />
        <path d="M94 94 C76 82 68 70 72 58 C84 62 96 76 94 94 Z" />
      </g>
    `;
  } else if (f.id === 'coral') {
    // 5 pétalos estilizados en estrella suave
    petalsMarkup = `
      <g fill="${f.color}" stroke="${f.accent}" stroke-width="2.5">
        <circle cx="60" cy="35" r="18" />
        <circle cx="84" cy="52" r="18" />
        <circle cx="75" cy="82" r="18" />
        <circle cx="45" cy="82" r="18" />
        <circle cx="36" cy="52" r="18" />
      </g>
    `;
  } else if (f.id === 'azul') {
    // Cáliz campanilla
    petalsMarkup = `
      <g fill="${f.color}" stroke="${f.accent}" stroke-width="2">
        <path d="M35 70 C30 45 45 30 60 25 C75 30 90 45 85 70 C72 78 48 78 35 70 Z" />
        <circle cx="45" cy="28" r="12" fill="${f.color}" />
        <circle cx="60" cy="20" r="14" fill="${f.color}" />
        <circle cx="75" cy="28" r="12" fill="${f.color}" />
      </g>
    `;
  } else {
    // Flor silvestre genérica de 6 pétalos redondos
    petalsMarkup = `
      <g fill="${f.color}" stroke="${f.accent}" stroke-width="2">
        <circle cx="60" cy="32" r="17" />
        <circle cx="84" cy="46" r="17" />
        <circle cx="84" cy="74" r="17" />
        <circle cx="60" cy="88" r="17" />
        <circle cx="36" cy="74" r="17" />
        <circle cx="36" cy="46" r="17" />
      </g>
    `;
  }

  return `
    <svg viewBox="0 0 120 120" width="${size}" height="${size}" class="flower-svg ${scaleClass} ${className}" role="button" aria-label="${f.name}, valor ${f.points} puntos">
      <defs>
        <radialGradient id="${uid}_gold" cx="40%" cy="35%" r="85%">
          <stop offset="0%" stop-color="#FFFFFF" />
          <stop offset="35%" stop-color="#FFE9A8" />
          <stop offset="75%" stop-color="#FFC94F" />
          <stop offset="100%" stop-color="#D97706" />
        </radialGradient>
        <radialGradient id="${uid}_aura" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="${isGolden ? '#FFE9A8' : '#FFC94F'}" stop-opacity="0.8" />
          <stop offset="70%" stop-color="${isGolden ? '#F59E0B' : '#FF8C80'}" stop-opacity="0.3" />
          <stop offset="100%" stop-color="${isGolden ? '#D97706' : '#FFC94F'}" stop-opacity="0" />
        </radialGradient>
      </defs>

      <!-- Resplandor exterior cuando está activa o brillante -->
      ${isActive ? `
        <circle cx="60" cy="60" r="${isGolden ? '56' : '50'}" fill="url(#${uid}_aura)" class="${isGolden ? 'anim-golden-pulse' : 'anim-flower-pulse'}" />
      ` : ''}

      <!-- Pétalos -->
      <g class="flower-petals-group">
        ${petalsMarkup}
      </g>

      <!-- Núcleo central / polen -->
      <circle cx="60" cy="60" r="${isGolden ? '18' : '15'}" fill="${isGolden ? 'url(#' + uid + '_gold)' : f.center}" stroke="${f.accent}" stroke-width="2.5" />
      <circle cx="56" cy="56" r="4" fill="#FFFFFF" opacity="0.6" />

      <!-- Chispas doradas para flor especial -->
      ${isGolden ? `
        <g stroke="#FFF" stroke-width="2.5" stroke-linecap="round" class="anim-spin-slow" style="transform-origin: 60px 60px;">
          <path d="M60 48 v-6 M60 78 v-6 M48 60 h-6 M78 60 h-6" />
        </g>
      ` : ''}

      <!-- Anillo de progreso si está recargándose -->
      ${isRecharging ? `
        <circle cx="60" cy="60" r="32" fill="none" stroke="#67A56D" stroke-width="4" stroke-dasharray="140" stroke-dashoffset="70" opacity="0.6" />
      ` : ''}
    </svg>
  `;
}

if (typeof window !== 'undefined') {
  window.FLOWER_TYPES = FLOWER_TYPES;
  window.renderFlowerSVG = renderFlowerSVG;
}
