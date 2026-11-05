/**
 * BeeStation: Misión Néctar - Biblioteca de Personajes Vectoriales
 * Rigging y renderizador SVG modular para Mielita y las 6 Abejas Exploradoras
 */

const BEE_PALETTES = {
  mielita: {
    name: 'Mielita',
    light: '#FFF0C2',
    mid: '#FFC94F',
    dark: '#F59E0B',
    deep: '#D97706',
    skin: '#FFD0AD',
    stripes: '#76563D',
    cheeks: '#FF8C80',
    wings: '#BCE5C8',
    wingStroke: '#67A56D'
  },
  nectar: {
    name: 'Néctar',
    light: '#FFE9A8',
    mid: '#FFC94F',
    dark: '#F59E0B',
    deep: '#D97706',
    skin: '#FFF8E9',
    stripes: '#76563D',
    cheeks: '#FF8C80',
    wings: '#BCE5C8',
    wingStroke: '#67A56D'
  },
  menta: {
    name: 'Menta',
    light: '#E8F8EC',
    mid: '#9BD6A6',
    dark: '#67A56D',
    deep: '#3D7A44',
    skin: '#F0FBF2',
    stripes: '#344536',
    cheeks: '#FF8C80',
    wings: '#D2F2DC',
    wingStroke: '#498551'
  },
  coral: {
    name: 'Coral',
    light: '#FFEAE6',
    mid: '#FFAFA4',
    dark: '#FF8C80',
    deep: '#D9584C',
    skin: '#FFF3F0',
    stripes: '#5A3632',
    cheeks: '#FF6B5B',
    wings: '#BCE5C8',
    wingStroke: '#67A56D'
  },
  lavanda: {
    name: 'Lavanda',
    light: '#F3EEFB',
    mid: '#C9B8EB',
    dark: '#B8A4E5',
    deep: '#7E63BE',
    skin: '#F9F6FD',
    stripes: '#483A61',
    cheeks: '#FF8C80',
    wings: '#E5DDF5',
    wingStroke: '#9782CB'
  },
  cielo: {
    name: 'Cielo',
    light: '#E8F7FD',
    mid: '#B3E4F5',
    dark: '#9EDDF1',
    deep: '#4BA6C7',
    skin: '#F3FAFD',
    stripes: '#2B4A54',
    cheeks: '#FF8C80',
    wings: '#D2EFF9',
    wingStroke: '#5FA8C1'
  },
  durazno: {
    name: 'Durazno',
    light: '#FFF3E8',
    mid: '#FFE0C7',
    dark: '#FFD0AD',
    deep: '#D68F58',
    skin: '#FFFBF7',
    stripes: '#6E482D',
    cheeks: '#FF8C80',
    wings: '#BCE5C8',
    wingStroke: '#67A56D'
  }
};

const EXPLORER_BEES = [
  { id: 'nectar', name: 'Néctar', palette: 'nectar', accessory: 'flower', trait: 'La clásica del jardín', color: '#F59E0B' },
  { id: 'menta', name: 'Menta', palette: 'menta', accessory: 'leaf', trait: 'Fresca y ligera', color: '#67A56D' },
  { id: 'coral', name: 'Coral', palette: 'coral', accessory: 'goggles', trait: 'Exploradora curiosa', color: '#FF8C80' },
  { id: 'lavanda', name: 'Lavanda', palette: 'lavanda', accessory: 'bow', trait: 'Soñadora del jardín', color: '#B8A4E5' },
  { id: 'cielo', name: 'Cielo', palette: 'cielo', accessory: 'antenna', trait: 'Veloz y atenta', color: '#9EDDF1' },
  { id: 'durazno', name: 'Durazno', palette: 'durazno', accessory: 'scarf', trait: 'Dulce y tranquila', color: '#FFD0AD' }
];

/**
 * Genera el markup SVG completo de una abeja con pose, expresión y accesorio
 */
function renderBeeSVG({
  character = 'mielita',
  expression = 'happy', // happy, wink, surprised, excited, celebrate, rest
  flying = false,
  animated = false,
  accessory = 'none', // none, flower, leaf, goggles, bow, antenna, scarf
  size = 120,
  className = ''
} = {}) {
  const p = BEE_PALETTES[character] || BEE_PALETTES.mielita;
  const uid = 'bee_' + Math.random().toString(36).substr(2, 6);

  // Expresiones oculares
  let eyesMarkup = '';
  const darkEye = '#344536';
  if (expression === 'surprised') {
    eyesMarkup = `
      <circle cx="103" cy="90" r="11" fill="${darkEye}" />
      <circle cx="137" cy="90" r="11" fill="${darkEye}" />
      <circle cx="106" cy="86" r="3.8" fill="#FFF" />
      <circle cx="140" cy="86" r="3.8" fill="#FFF" />
      <circle cx="101" cy="93" r="1.8" fill="#FFF" />
      <circle cx="135" cy="93" r="1.8" fill="#FFF" />
    `;
  } else if (expression === 'wink') {
    eyesMarkup = `
      <circle cx="104" cy="90" r="9" fill="${darkEye}" />
      <circle cx="107" cy="86.5" r="3.2" fill="#FFF" />
      <path d="M127 92 q9 -9 18 0" stroke="${darkEye}" stroke-width="5" fill="none" stroke-linecap="round" />
    `;
  } else if (expression === 'celebrate' || expression === 'rest') {
    eyesMarkup = `
      <path d="M95 91 q9 -10 18 0" stroke="${darkEye}" stroke-width="5" fill="none" stroke-linecap="round" />
      <path d="M127 91 q9 -10 18 0" stroke="${darkEye}" stroke-width="5" fill="none" stroke-linecap="round" />
    `;
  } else if (expression === 'excited') {
    eyesMarkup = `
      <path d="M95 93 q9 -12 18 0" stroke="${darkEye}" stroke-width="5.5" fill="none" stroke-linecap="round" />
      <path d="M127 93 q9 -12 18 0" stroke="${darkEye}" stroke-width="5.5" fill="none" stroke-linecap="round" />
      <circle cx="104" cy="95" r="2.5" fill="#FFF" />
      <circle cx="136" cy="95" r="2.5" fill="#FFF" />
    `;
  } else {
    // happy default
    eyesMarkup = `
      <circle cx="104" cy="90" r="9" fill="${darkEye}" />
      <circle cx="136" cy="90" r="9" fill="${darkEye}" />
      <circle cx="107" cy="86" r="3.2" fill="#FFF" />
      <circle cx="139" cy="86" r="3.2" fill="#FFF" />
      <circle cx="102" cy="92" r="1.5" fill="#FFF" />
      <circle cx="134" cy="92" r="1.5" fill="#FFF" />
    `;
  }

  // Expresiones de boca
  let mouthMarkup = '';
  const darkMouth = p.stripes;
  if (expression === 'surprised') {
    mouthMarkup = `<ellipse cx="120" cy="116" rx="9" ry="11" fill="${darkMouth}" />`;
  } else if (expression === 'celebrate' || expression === 'excited') {
    mouthMarkup = `
      <path d="M104 107 q16 26 32 0 z" fill="${darkMouth}" />
      <path d="M112 118 q8 8 16 0" fill="#FF8C80" />
    `;
  } else if (expression === 'rest') {
    mouthMarkup = `<path d="M112 114 q8 7 16 0" stroke="${darkMouth}" stroke-width="4.5" fill="none" stroke-linecap="round" />`;
  } else {
    mouthMarkup = `<path d="M107 110 q13 16 26 0" stroke="${darkMouth}" stroke-width="4.5" fill="none" stroke-linecap="round" />`;
  }

  // Accesorios
  let accMarkup = '';
  if (accessory === 'flower') {
    accMarkup = `
      <g id="${uid}_acc">
        <circle cx="120" cy="36" r="8" fill="#FFC94F" />
        <circle cx="105" cy="41" r="7" fill="#FF8C80" />
        <circle cx="135" cy="41" r="7" fill="#FF8C80" />
        <circle cx="111" cy="27" r="6" fill="#FFD0AD" />
        <circle cx="129" cy="27" r="6" fill="#FFD0AD" />
        <circle cx="120" cy="36" r="4" fill="#F59E0B" />
      </g>
    `;
  } else if (accessory === 'leaf') {
    accMarkup = `
      <g id="${uid}_acc">
        <path d="M116 46 c16 -18 34 -20 36 -15 c2 7 -16 24 -36 15 z" fill="#67A56D" stroke="#344536" stroke-width="2.5" />
        <path d="M122 43 q14 -6 26 -8" stroke="#BCE5C8" stroke-width="2" fill="none" />
      </g>
    `;
  } else if (accessory === 'goggles') {
    accMarkup = `
      <g id="${uid}_acc">
        <rect x="88" y="78" width="64" height="24" rx="12" fill="#9EDDF1" fill-opacity="0.5" stroke="#344536" stroke-width="3.5" />
        <circle cx="104" cy="90" r="10" fill="#FFF" fill-opacity="0.8" stroke="#344536" stroke-width="3" />
        <circle cx="136" cy="90" r="10" fill="#FFF" fill-opacity="0.8" stroke="#344536" stroke-width="3" />
        <line x1="114" y1="90" x2="126" y2="90" stroke="#344536" stroke-width="4" />
      </g>
    `;
  } else if (accessory === 'bow') {
    accMarkup = `
      <g id="${uid}_acc">
        <path d="M142 42 l20 -14 v28 z" fill="#B8A4E5" stroke="#7E63BE" stroke-width="2" />
        <path d="M142 42 l-20 -14 v28 z" fill="#B8A4E5" stroke="#7E63BE" stroke-width="2" />
        <circle cx="142" cy="42" r="6" fill="#7E63BE" />
      </g>
    `;
  } else if (accessory === 'antenna') {
    accMarkup = `
      <g id="${uid}_acc" stroke="#9EDDF1" stroke-width="4" fill="none" stroke-linecap="round">
        <path d="M83 33 q-10 -16 -4 -24" />
        <path d="M157 33 q10 -16 4 -24" />
        <circle cx="79" cy="8" r="6" fill="#9EDDF1" stroke="#344536" stroke-width="2.5" />
        <circle cx="161" cy="8" r="6" fill="#9EDDF1" stroke="#344536" stroke-width="2.5" />
      </g>
    `;
  } else if (accessory === 'scarf') {
    accMarkup = `
      <g id="${uid}_acc">
        <path d="M74 138 q46 22 92 0" stroke="#FF8C80" stroke-width="14" fill="none" stroke-linecap="round" />
        <path d="M146 144 l16 26 -18 4 z" fill="#FF8C80" stroke="#D9584C" stroke-width="2" />
      </g>
    `;
  }

  // Animaciones y clases
  const floatClass = flying ? 'bee-anim-float' : '';
  const wingClass = animated || flying ? 'bee-anim-wings' : '';

  return `
    <svg viewBox="0 0 240 240" width="${size}" height="${size}" class="bee-svg ${floatClass} ${className}" role="img" aria-label="${p.name}, abeja exploradora">
      <defs>
        <radialGradient id="${uid}_body" cx="35%" cy="25%" r="90%">
          <stop offset="0%" stop-color="${p.light}" />
          <stop offset="60%" stop-color="${p.mid}" />
          <stop offset="100%" stop-color="${p.dark}" />
        </radialGradient>
        <radialGradient id="${uid}_head" cx="35%" cy="22%" r="95%">
          <stop offset="0%" stop-color="#FFFFFF" />
          <stop offset="70%" stop-color="${p.skin}" />
          <stop offset="100%" stop-color="${p.mid}" />
        </radialGradient>
        <linearGradient id="${uid}_wing" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.95" />
          <stop offset="100%" stop-color="${p.wings}" stop-opacity="0.75" />
        </linearGradient>
        <clipPath id="${uid}_body_clip">
          <ellipse cx="120" cy="152" rx="66" ry="56" />
        </clipPath>
      </defs>

      <!-- Sombra en suelo -->
      <ellipse cx="120" cy="224" rx="${flying ? '42' : '54'}" ry="8" fill="#344536" opacity="${flying ? '0.08' : '0.14'}" />

      <!-- Estelas de vuelo si está volando -->
      ${flying ? `
        <g stroke="${p.dark}" stroke-width="3.5" stroke-linecap="round" opacity="0.45">
          <path d="M26 150 h24 M14 176 h30 M30 202 h20" />
        </g>
      ` : ''}

      <!-- Contenedor con inclinación de vuelo -->
      <g transform="${flying ? 'rotate(-6 120 140)' : ''}">
        <!-- Alas traseras con animación -->
        <g class="${wingClass}" style="transform-origin: 120px 104px;">
          <ellipse cx="86" cy="78" rx="28" ry="42" fill="url(#${uid}_wing)" stroke="${p.wingStroke}" stroke-width="3" transform="rotate(-26 86 78)" />
          <ellipse cx="154" cy="78" rx="28" ry="42" fill="url(#${uid}_wing)" stroke="${p.wingStroke}" stroke-width="3" transform="rotate(26 154 78)" />
        </g>

        <!-- Antenas -->
        <path d="M103 66 C98 44 91 36 83 32" stroke="${p.stripes}" stroke-width="5" fill="none" stroke-linecap="round" />
        <path d="M137 66 C142 44 149 36 157 32" stroke="${p.stripes}" stroke-width="5" fill="none" stroke-linecap="round" />
        <circle cx="83" cy="32" r="7" fill="${p.dark}" stroke="${p.deep}" stroke-width="1.5" />
        <circle cx="157" cy="32" r="7" fill="${p.dark}" stroke="${p.deep}" stroke-width="1.5" />

        <!-- Brazos / Patitas -->
        ${expression === 'celebrate' ? `
          <path d="M62 136 C48 128 40 116 38 102" stroke="${p.stripes}" stroke-width="7" fill="none" stroke-linecap="round" />
          <path d="M178 136 C192 128 200 116 202 102" stroke="${p.stripes}" stroke-width="7" fill="none" stroke-linecap="round" />
        ` : `
          <path d="M60 156 C46 166 40 176 38 188" stroke="${p.stripes}" stroke-width="7" fill="none" stroke-linecap="round" />
          <path d="M180 156 C194 166 200 176 202 188" stroke="${p.stripes}" stroke-width="7" fill="none" stroke-linecap="round" />
        `}

        <!-- Cuerpo elíptico -->
        <ellipse cx="120" cy="152" rx="66" ry="56" fill="url(#${uid}_body)" stroke="${p.deep}" stroke-width="2" />

        <!-- Rayas de abeja redondeadas recortadas -->
        <g clip-path="url(#${uid}_body_clip)">
          <rect x="36" y="132" width="168" height="15" rx="7.5" fill="${p.stripes}" transform="rotate(-3 120 140)" />
          <rect x="36" y="163" width="168" height="15" rx="7.5" fill="${p.stripes}" transform="rotate(-3 120 170)" />
          <rect x="36" y="194" width="168" height="15" rx="7.5" fill="${p.stripes}" transform="rotate(-3 120 200)" />
        </g>

        <!-- Brillo especular del abdomen -->
        <ellipse cx="90" cy="122" rx="20" ry="11" fill="#FFFFFF" opacity="0.32" transform="rotate(-22 90 122)" />

        <!-- Cabeza tierna -->
        <circle cx="120" cy="96" r="49" fill="url(#${uid}_head)" stroke="${p.light}" stroke-width="3" />

        <!-- Mejillas sonrojadas -->
        <ellipse cx="94" cy="112" rx="12" ry="7" fill="${p.cheeks}" opacity="0.55" />
        <ellipse cx="146" cy="112" rx="12" ry="7" fill="${p.cheeks}" opacity="0.55" />

        <!-- Ojos y Boca -->
        ${eyesMarkup}
        ${mouthMarkup}

        <!-- Accesorio colocado si corresponde -->
        ${accMarkup}
      </g>
    </svg>
  `;
}

// Exportación global o para módulos
if (typeof window !== 'undefined') {
  window.BEE_PALETTES = BEE_PALETTES;
  window.EXPLORER_BEES = EXPLORER_BEES;
  window.renderBeeSVG = renderBeeSVG;
}
