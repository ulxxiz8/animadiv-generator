export const PRESET_NAMES = {
  none: 'No Effect',
  fade: 'Fade',
  slide: 'Slide',
  scale: 'Scale',
  fadeByLetter: 'Fade by Letter',
  fadeByWord: 'Fade by Word',
  typewriter: 'Typewriter',
  blurReveal: 'Blur Reveal',
  slideUpReveal: 'Slide Up Reveal',
  underlineDraw: 'Underline Draw',
  parallaxHover: 'Parallax Hover',
  tiltHover: 'Tilt Hover',
  kenBurns: 'Ken Burns Effect',
  zoomReveal: 'Zoom Reveal',
  floatingImage: 'Floating Image',
  hoverBrightness: 'Hover Brightness',
  hoverBlur: 'Hover Blur',
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

export const ELEMENT_PRESET_MAP = {
  text: {
    load: [
      'fade',
      'slide',
      'scale',
      'fadeByLetter',
      'fadeByWord',
      'blurReveal',
      'typewriter',
      'slideUpReveal',
    ],
    hover: ['underlineDraw', 'fadeByWord'],
    click: [],
  },
  link: {
    load: [
      'fade',
      'slide',
      'scale',
      'fadeByLetter',
      'fadeByWord',
      'blurReveal',
      'typewriter',
      'slideUpReveal',
    ],
    hover: ['underlineDraw', 'fadeByWord'],
    click: [],
  },
  image: {
    load: ['fade', 'slide', 'scale', 'zoomReveal', 'kenBurns', 'floatingImage'],
    hover: ['parallaxHover', 'tiltHover', 'hoverBrightness', 'hoverBlur'],
    click: [],
  },
  button: {
    load: ['fade', 'slide', 'scale'],
    hover: ['glowHover', 'magneticHover'],
    click: ['pressEffect', 'ripple'],
  },
  checkbox: {
    load: ['fade', 'scale'],
    hover: ['glowHover'],
    click: ['smoothCheck', 'bounceCheck', 'radioPulse', 'elasticToggle'],
  },
  radio: {
    load: ['fade', 'scale'],
    hover: ['glowHover'],
    click: ['smoothCheck', 'bounceCheck', 'radioPulse', 'elasticToggle'],
  },
  input: {
    load: ['fade', 'slide'],
    hover: ['focusGlow', 'borderSlide', 'placeholderFade'],
    click: ['errorShake'],
  },
  textarea: {
    load: ['fade', 'slide'],
    hover: ['focusGlow', 'borderSlide', 'placeholderFade'],
    click: ['errorShake'],
  },
  block: {
    load: ['fade', 'slide', 'staggerReveal', 'expandCollapse', 'floatingSection'],
    hover: [],
    click: [],
  },
};

const IMPLEMENTED_PRESETS = new Set([
  'fade',
  'slide',
  'scale',
  'fadeByLetter',
  'fadeByWord',
  'typewriter',
  'blurReveal',
  'slideUpReveal',
  'underlineDraw',
  'parallaxHover',
  'tiltHover',
  'kenBurns',
  'zoomReveal',
  'floatingImage',
  'hoverBrightness',
  'hoverBlur',
  'pressEffect',
  'ripple',
  'glowHover',
  'magneticHover',
  'focusGlow',
  'borderSlide',
  'placeholderFade',
  'errorShake',
  'staggerReveal',
  'expandCollapse',
  'floatingSection',
]);

export const getAvailablePresetsForType = (
  elementType,
  triggerState = 'load'
) => {
  const byState = ELEMENT_PRESET_MAP[elementType] || {};
  const ids = byState[triggerState] || [];
  const visibleIds = ['none', ...ids.filter((id) => IMPLEMENTED_PRESETS.has(id))];

  return visibleIds.map((id) => ({
    id,
    name: PRESET_NAMES[id] || id,
  }));
};

const timedParams = ['duration', 'delay', 'easing'];

export const PRESET_SUPPORTED_PARAMS = {
  none: [],

  fade: [...timedParams, 'intensity'],
  slide: [...timedParams, 'direction', 'intensity'],
  scale: [...timedParams, 'scaleRange', 'transformOrigin', 'intensity'],

  fadeByLetter: [...timedParams, 'intensity'],
  fadeByWord: [...timedParams, 'intensity'],
  fadeByLine: [...timedParams, 'intensity'],
  typewriter: ['duration', 'stagger'],
  blurReveal: ['duration', 'blurAmount', 'stagger'],
  slideUpReveal: timedParams,
  underlineDraw: timedParams,

  parallaxHover: ['duration', 'easing', 'hoverDepth'],
  tiltHover: ['rotationAngle', 'hoverDepth', 'transformOrigin'],
  kenBurns: [...timedParams, 'zoomIntensity'],
  zoomReveal: [...timedParams, 'zoomIntensity'],
  floatingImage: [...timedParams, 'floatingAmount'],
  hoverBrightness: ['duration', 'easing', 'intensity'],
  hoverBlur: ['duration', 'easing', 'blurAmount'],

  pressEffect: ['duration', 'intensity'],
  ripple: ['duration'],
  glowHover: ['duration', 'intensity'],
  magneticHover: ['duration', 'intensity'],
  borderDraw: ['duration'],
  smoothCheck: [],
  bounceCheck: [],
  radioPulse: [],
  elasticToggle: [],

  focusGlow: timedParams,
  borderSlide: timedParams,
  placeholderFade: timedParams,
  errorShake: ['duration', 'delay'],
  staggerReveal: [...timedParams, 'stagger'],
  expandCollapse: ['duration', 'delay'],
  floatingSection: ['duration', 'delay', 'easing', 'floatingAmount'],

  squashStretch: ['duration', 'delay', 'intensity'],
  anticipateReveal: ['duration', 'delay', 'intensity'],
  arcReveal: ['duration', 'delay', 'intensity'],
  secondaryAction: ['duration', 'delay', 'intensity'],
  followThrough: ['duration', 'delay', 'stagger'],
};

export const TRIGGER_RESTRICTIONS = Object.fromEntries(
  Object.entries(ELEMENT_PRESET_MAP).map(([type, states]) => [
    type,
    Object.keys(states),
  ])
);

export const isStateAllowedForType = (state, type) => {
  if (state === 'static') return true;
  const allowed = TRIGGER_RESTRICTIONS[type] || ['load', 'hover', 'click'];
  return allowed.includes(state);
};
