import { DEFAULT_ANIMATION_CONFIG } from './elementSystem';

export const PRESET_NAMES = {
  none: 'No Effect',
  fade: 'Fade',
  fadeIn: 'Fade In',
  slide: 'Slide',
  slideUp: 'Slide Up',
  slideDown: 'Slide Down',
  slideLeft: 'Slide Left',
  slideRight: 'Slide Right',
  slideIn: 'Slide In',
  scale: 'Scale',
  scaleIn: 'Scale In',
  scaleUp: 'Scale Up',
  scaleDown: 'Scale Down',
  popIn: 'Pop In',
  rotateIn: 'Rotate In',
  bounceIn: 'Bounce In',
  glowAppear: 'Glow Appear',
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
  pressDown: 'Press Down',
  ripple: 'Ripple',
  shake: 'Shake',
  pulse: 'Pulse',
  flash: 'Flash',
  rotateTap: 'Rotate Tap',
  elasticBounce: 'Elastic Bounce',
  lift: 'Lift',
  shadowLift: 'Shadow Lift',
  shadowIncrease: 'Shadow Increase',
  backgroundChange: 'Background Change',
  backgroundShift: 'Background Shift',
  colorTransition: 'Color Transition',
  borderAnimation: 'Border Animation',
  rotateSlightly: 'Rotate Slightly',
  tilt: 'Tilt',
  opacityChange: 'Opacity Change',
  borderGlow: 'Border Glow',
  borderHighlight: 'Border Highlight',
  textShift: 'Text Shift',
  iconMove: 'Icon Move',
  gradientMotion: 'Gradient Motion',
  arrowMove: 'Arrow Move',
  brightnessChange: 'Brightness Change',
  zoom: 'Zoom',
  expand: 'Expand',
  flip: 'Flip',
  checkDraw: 'Check Draw',
  dotExpand: 'Dot Expand',
  expandWidth: 'Expand Width',
  expandHeight: 'Expand Height',
  autoExpand: 'Auto Expand',
  underlineExpand: 'Underline Expand',
  underlineAnimate: 'Underline Animate',
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
      'fadeIn',
      'typewriter',
      'slideIn',
      'blurReveal',
      'fadeByWord',
      'fade',
      'slide',
      'scale',
      'fadeByLetter',
      'fadeByWord',
      'blurReveal',
      'typewriter',
      'slideUpReveal',
    ],
    hover: ['colorTransition', 'underlineDraw', 'glow', 'textShift', 'fadeByWord'],
    click: ['flash', 'bounceIn', 'pulse'],
  },
  link: {
    load: ['fadeIn', 'slideIn', 'fade', 'slide'],
    hover: ['underlineDraw', 'colorTransition', 'glow', 'arrowMove', 'textShift'],
    click: ['ripple', 'flash', 'pressEffect'],
  },
  image: {
    load: ['fadeIn', 'blurReveal', 'zoomReveal', 'kenBurns', 'slideIn', 'fade', 'slide', 'scale', 'floatingImage'],
    hover: ['zoom', 'tilt', 'parallaxHover', 'brightnessChange', 'shadowLift', 'hoverBrightness', 'hoverBlur'],
    click: ['expand', 'flip', 'pulse', 'flash'],
  },
  button: {
    load: ['fadeIn', 'popIn', 'slideIn', 'glowAppear', 'scaleUp', 'fade', 'slide', 'scale'],
    hover: ['colorTransition', 'glow', 'scaleUp', 'shadowLift', 'borderGlow', 'textShift', 'iconMove', 'gradientMotion', 'glowHover', 'magneticHover'],
    click: ['pressEffect', 'ripple', 'bounceIn', 'pulse', 'flash', 'shake', 'scaleDown'],
  },
  checkbox: {
    load: ['fadeIn', 'scaleIn', 'fade', 'scale'],
    hover: ['glow', 'borderHighlight', 'glowHover'],
    click: ['checkDraw', 'bounceCheck', 'pulse', 'ripple', 'smoothCheck', 'radioPulse'],
  },
  radio: {
    load: ['fadeIn', 'scaleIn', 'fade', 'scale'],
    hover: ['glow', 'borderHighlight', 'glowHover'],
    click: ['dotExpand', 'pulse', 'ripple', 'bounceCheck', 'radioPulse'],
  },
  input: {
    load: ['fadeIn', 'slideIn', 'expandWidth', 'fade', 'slide'],
    hover: ['borderHighlight', 'glow', 'backgroundShift', 'focusGlow', 'borderSlide'],
    click: ['borderAnimation', 'focusGlow', 'floatingLabel', 'shake', 'underlineExpand', 'errorShake'],
  },
  textarea: {
    load: ['fadeIn', 'expandHeight', 'fade', 'slide'],
    hover: ['borderGlow', 'backgroundChange', 'focusGlow', 'borderSlide'],
    click: ['focusGlow', 'autoExpand', 'underlineAnimate', 'shake', 'errorShake'],
  },
  block: {
    load: [
      'fadeIn',
      'slideUp',
      'slideDown',
      'slideLeft',
      'slideRight',
      'scaleIn',
      'rotateIn',
      'blurReveal',
      'bounceIn',
      'fade',
      'slide',
      'scale',
      'staggerReveal',
      'expandCollapse',
      'floatingSection',
    ],
    hover: ['scaleUp', 'lift', 'glow', 'shadowIncrease', 'backgroundChange', 'borderAnimation', 'rotateSlightly', 'tilt', 'opacityChange'],
    click: ['pressDown', 'ripple', 'shake', 'pulse', 'scaleDown', 'flash', 'rotateTap', 'elasticBounce'],
  },
};

const IMPLEMENTED_PRESETS = new Set([
  'fade',
  'fadeIn',
  'slide',
  'slideIn',
  'slideUp',
  'slideDown',
  'slideLeft',
  'slideRight',
  'scale',
  'scaleIn',
  'scaleUp',
  'scaleDown',
  'popIn',
  'rotate',
  'rotateIn',
  'bounceIn',
  'glowAppear',
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
  'pressDown',
  'ripple',
  'shake',
  'pulse',
  'flash',
  'rotateTap',
  'elasticBounce',
  'lift',
  'shadowLift',
  'shadowIncrease',
  'backgroundChange',
  'backgroundShift',
  'colorTransition',
  'borderAnimation',
  'rotateSlightly',
  'tilt',
  'opacityChange',
  'borderGlow',
  'borderHighlight',
  'textShift',
  'iconMove',
  'gradientMotion',
  'arrowMove',
  'brightnessChange',
  'zoom',
  'expand',
  'flip',
  'checkDraw',
  'dotExpand',
  'expandWidth',
  'expandHeight',
  'autoExpand',
  'underlineExpand',
  'underlineAnimate',
  'glowHover',
  'magneticHover',
  'smoothCheck',
  'bounceCheck',
  'radioPulse',
  'elasticToggle',
  'focusGlow',
  'borderSlide',
  'placeholderFade',
  'errorShake',
  'staggerReveal',
  'expandCollapse',
  'floatingSection',
  'squashStretch',
]);

export const getAvailablePresetsForType = (
  elementType,
  triggerState = 'load'
) => {
  const byState = ELEMENT_PRESET_MAP[elementType] || {};
  const ids = byState[triggerState] || [];
  const visibleIds = [
    'none',
    ...ids.filter((id) => IMPLEMENTED_PRESETS.has(id)),
  ];

  return visibleIds.map((id) => ({
    id,
    name: PRESET_NAMES[id] || id,
  }));
};

const normalizeAnimationConfig = (config) => {
  const { effectPreset, ...nextConfig } = config || {};

  return {
    ...DEFAULT_ANIMATION_CONFIG,
    ...nextConfig,
    presetId: nextConfig.presetId || effectPreset || 'none',
  };
};

const resetAnimationConfig = () => ({
  ...DEFAULT_ANIMATION_CONFIG,
  presetId: 'none',
});

export const sanitizeAnimationConfigForType = (type, state, config) => {
  const normalized = normalizeAnimationConfig(config);
  const availableIds = new Set(
    getAvailablePresetsForType(type, state).map((preset) => preset.id)
  );

  if (
    !isStateAllowedForType(state, type) ||
    !availableIds.has(normalized.presetId)
  ) {
    return resetAnimationConfig();
  }

  return normalized;
};

export const sanitizeAnimationsForType = (type, animations = {}) => ({
  load: sanitizeAnimationConfigForType(type, 'load', animations.load),
  hover: sanitizeAnimationConfigForType(type, 'hover', animations.hover),
  click: sanitizeAnimationConfigForType(type, 'click', animations.click),
});

const timedParams = ['duration', 'delay', 'easing'];

export const PRESET_SUPPORTED_PARAMS = {
  none: [],

  fade: [...timedParams, 'intensity'],
  fadeIn: [...timedParams, 'intensity'],
  slide: [...timedParams, 'direction', 'intensity'],
  slideIn: [...timedParams, 'direction', 'intensity'],
  slideUp: [...timedParams, 'intensity'],
  slideDown: [...timedParams, 'intensity'],
  slideLeft: [...timedParams, 'intensity'],
  slideRight: [...timedParams, 'intensity'],
  scale: [...timedParams, 'scaleRange', 'transformOrigin', 'intensity'],
  scaleIn: [...timedParams, 'scaleRange', 'transformOrigin', 'intensity'],
  scaleUp: [...timedParams, 'scaleRange', 'transformOrigin', 'intensity'],
  scaleDown: [...timedParams, 'scaleRange', 'transformOrigin', 'intensity'],
  popIn: [...timedParams, 'scaleRange', 'transformOrigin', 'intensity'],
  rotate: [...timedParams, 'rotationAngle', 'transformOrigin'],
  rotateIn: [...timedParams, 'rotationAngle', 'transformOrigin'],
  rotateSlightly: [...timedParams, 'rotationAngle', 'transformOrigin'],
  rotateTap: [...timedParams, 'rotationAngle', 'transformOrigin'],
  bounceIn: ['duration', 'delay', 'intensity'],
  glowAppear: ['duration', 'intensity'],

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
  pressDown: ['duration', 'intensity'],
  ripple: ['duration'],
  shake: ['duration', 'delay'],
  pulse: ['duration', 'intensity'],
  flash: ['duration', 'intensity'],
  elasticBounce: ['duration', 'intensity'],
  lift: ['duration', 'intensity'],
  shadowLift: ['duration', 'intensity'],
  shadowIncrease: ['duration', 'intensity'],
  backgroundChange: ['duration', 'easing', 'intensity'],
  backgroundShift: ['duration', 'easing', 'intensity'],
  colorTransition: ['duration', 'easing', 'intensity'],
  borderAnimation: ['duration'],
  borderGlow: ['duration', 'intensity'],
  borderHighlight: ['duration', 'intensity'],
  textShift: [...timedParams, 'direction', 'intensity'],
  iconMove: [...timedParams, 'direction', 'intensity'],
  gradientMotion: ['duration', 'easing', 'intensity'],
  arrowMove: [...timedParams, 'direction', 'intensity'],
  brightnessChange: ['duration', 'easing', 'intensity'],
  zoom: ['duration', 'easing', 'hoverDepth'],
  expand: [...timedParams, 'scaleRange', 'transformOrigin', 'intensity'],
  flip: [...timedParams, 'rotationAngle', 'transformOrigin'],
  checkDraw: [],
  dotExpand: [],
  expandWidth: [...timedParams, 'scaleRange', 'transformOrigin', 'intensity'],
  expandHeight: ['duration', 'delay'],
  autoExpand: ['duration', 'delay'],
  underlineExpand: timedParams,
  underlineAnimate: timedParams,
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
