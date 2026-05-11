// ==========================================
// 1. СЛОВНИК НАЗВ ПРЕСЕТІВ (Для UI)
// ==========================================
export const PRESET_NAMES = {
  none: 'Без ефекту (None)',
  fade: 'Fade (Поява)',
  slide: 'Slide (Зсув)',
  scale: 'Scale (Масштаб)',
  fadeByLetter: 'Fade by Letter',
  fadeByWord: 'Fade by Word',
  typewriter: 'Typewriter',
  blurReveal: 'Blur Reveal',
  underlineDraw: 'Underline Draw',
  parallaxHover: 'Parallax Hover',
  tiltHover: 'Tilt Hover',
  kenBurns: 'Ken Burns Effect',
  zoomReveal: 'Zoom Reveal',
  floatingImage: 'Floating Image',
  pressEffect: 'Press Effect',
  ripple: 'Ripple',
  glowHover: 'Glow Hover',
  magneticHover: 'Magnetic Hover',
  borderDraw: 'Border Draw',
  smoothCheck: 'Smooth Check',
  bounceCheck: 'Bounce Check',
  radioPulse: 'Radio Pulse',
  elasticToggle: 'Elastic Toggle',
  floatingLabel: 'Floating Label',
  focusGlow: 'Focus Glow',
  borderSlide: 'Border Slide',
  placeholderFade: 'Placeholder Fade',
  errorShake: 'Error Shake',
  staggerReveal: 'Stagger Reveal',
  expandCollapse: 'Expand / Collapse',
  floatingSection: 'Floating Section',
  scrollReveal: 'Scroll Reveal',
  squashStretch: 'Squash & Stretch Drop',
  anticipateReveal: 'Anticipation Reveal',
  arcReveal: 'Arc Motion Reveal',
  secondaryAction: 'Secondary Shadow/Glow',
  followThrough: 'Follow Through Elements',
};

// ==========================================
// 2. СЕМАНТИЧНА МАТРИЦЯ (Правила доступу)
// ==========================================
export const ELEMENT_PRESET_MAP = {
  global: [
    'none',
    'fade',
    'slide',
    'scale',
    'squashStretch',
    'anticipateReveal',
    'arcReveal',
  ],
  text: [
    'fadeByLetter',
    'fadeByWord',
    'typewriter',
    'blurReveal',
    'underlineDraw',
  ],
  link: [
    'fadeByLetter',
    'fadeByWord',
    'typewriter',
    'blurReveal',
    'underlineDraw',
  ],
  image: [
    'parallaxHover',
    'tiltHover',
    'kenBurns',
    'zoomReveal',
    'floatingImage',
  ],
  checkbox: ['smoothCheck', 'bounceCheck', 'radioPulse', 'elasticToggle'],
  radio: ['smoothCheck', 'bounceCheck', 'radioPulse', 'elasticToggle'],
  input: [
    'floatingLabel',
    'focusGlow',
    'borderSlide',
    'placeholderFade',
    'errorShake',
  ],
  textarea: [
    'floatingLabel',
    'focusGlow',
    'borderSlide',
    'placeholderFade',
    'errorShake',
  ],
  block: [
    'staggerReveal',
    'expandCollapse',
    'floatingSection',
    'scrollReveal',
    'followThrough',
    'secondaryAction',
  ],
  button: [
    'pressEffect',
    'ripple',
    'glowHover',
    'magneticHover',
    'borderDraw',
    'secondaryAction',
  ],
};

// ==========================================
// 3. ФІЛЬТРАЦІЯ
// ==========================================
export const getAvailablePresetsForType = (elementType) => {
  const globals = ELEMENT_PRESET_MAP.global;
  const specifics = ELEMENT_PRESET_MAP[elementType] || [];
  const combinedIds = [...new Set([...globals, ...specifics])];
  return combinedIds.map((id) => ({
    id: id,
    name: PRESET_NAMES[id] || id,
  }));
};

// ==========================================
// 4. SUPPORTED PARAMETERS (Semantic UI filtering)
// ==========================================
const baseParams = [
  'duration',
  'delay',
  'easing',
  'iterationCount',
  'fillMode',
];

export const PRESET_SUPPORTED_PARAMS = {
  none: [],

  // Базові (УВАГА: додано usePhysics)
  fade: [...baseParams, 'intensity'],
  slide: [...baseParams, 'intensity', 'direction', 'usePhysics'],
  scale: [
    ...baseParams,
    'intensity',
    'scaleRange',
    'motionAxis',
    'transformOrigin',
    'usePhysics',
  ],

  // Typography
  fadeByLetter: [...baseParams, 'stagger'],
  fadeByWord: [...baseParams, 'stagger'],
  fadeByLine: [...baseParams, 'stagger'],
  typewriter: [...baseParams, 'stagger'],
  blurReveal: [...baseParams, 'blurAmount', 'stagger'],
  slideUpReveal: [...baseParams, 'stagger'],
  underlineDraw: [...baseParams],

  // Image (УВАГА: додано zoomIntensity та hoverDepth)
  parallaxHover: [...baseParams, 'hoverDepth', 'direction'],
  tiltHover: [...baseParams, 'rotationAngle', 'hoverDepth', 'transformOrigin'],
  kenBurns: [...baseParams, 'zoomIntensity', 'transformOrigin'],
  zoomReveal: [...baseParams, 'zoomIntensity', 'transformOrigin'],
  floatingImage: [...baseParams, 'floatingAmount'],
  hoverBrightness: [...baseParams],
  hoverBlur: [...baseParams, 'blurAmount'],

  // Interactions
  pressEffect: [...baseParams, 'intensity'],
  ripple: [...baseParams],
  glowHover: [...baseParams, 'intensity'],
  magneticHover: [...baseParams, 'intensity'],
  borderDraw: [...baseParams],
  smoothCheck: [...baseParams],
  bounceCheck: [...baseParams],
  radioPulse: [...baseParams, 'intensity'],
  elasticToggle: [...baseParams, 'intensity'],

  // Layout & Form
  floatingLabel: [...baseParams],
  focusGlow: [...baseParams, 'intensity'],
  borderSlide: [...baseParams],
  placeholderFade: [...baseParams],
  errorShake: [...baseParams],
  staggerReveal: [...baseParams, 'stagger'],
  expandCollapse: [...baseParams, 'transformOrigin'],
  floatingSection: [...baseParams, 'floatingAmount'],
  scrollReveal: [...baseParams],

  // Disney
  squashStretch: [...baseParams, 'intensity'],
  anticipateReveal: [...baseParams, 'intensity'],
  arcReveal: [...baseParams, 'intensity'],
  secondaryAction: [...baseParams, 'intensity'],
  followThrough: [...baseParams, 'stagger'],

  // Physics (УВАГА: додано usePhysics, щоб панель не зникала сама в себе)
  physicsScale: ['duration', 'delay', 'intensity', 'scaleRange', 'usePhysics'],
  physicsBounce: ['duration', 'delay', 'intensity', 'direction', 'usePhysics'],
  physicsHover: ['duration', 'delay', 'intensity', 'usePhysics'],
};
// ✅ Нові семантичні обмеження для тригерів
export const TRIGGER_RESTRICTIONS = {
  image: ['load', 'hover'], // Зображення рідко анімують по кліку (feedback)
  text: ['load', 'hover'],
  block: ['load'], // Контейнери зазвичай тільки з'являються
  button: ['hover', 'click'],
  checkbox: ['hover', 'click'],
  radio: ['hover', 'click'],
  input: ['hover', 'click'],
};

// Перевірка, чи доступний стейт для типу елемента
export const isStateAllowedForType = (state, type) => {
  if (state === 'static') return true;
  const allowed = TRIGGER_RESTRICTIONS[type] || ['load', 'hover', 'click'];
  return allowed.includes(state);
};
