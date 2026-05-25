import { DEFAULT_ANIMATION_CONFIG } from './elementSystem';
import {
  CLICK_PRESETS,
  HOVER_PRESETS,
  LOAD_PRESETS,
  PRESET_LABELS,
  STATIC_LOOP_PRESETS,
} from './motionSystem';

export const PRESET_NAMES = PRESET_LABELS;

const motionStates = {
  load: LOAD_PRESETS,
  static: STATIC_LOOP_PRESETS,
  hover: HOVER_PRESETS,
  click: CLICK_PRESETS,
};

const typographyStates = {
  load: [
    'none',
    'fadeByLetter',
    'fadeByWord',
    'fadeByLine',
    'typewriter',
    'blurReveal',
    'slideUpReveal',
    'underlineDraw',
  ],
  hover: ['none', 'underline', 'blur', 'opacityChange', 'colorTransition'],
};

const imageStates = {
  load: LOAD_PRESETS,
  hover: ['none', 'scaleUp', 'scaleDown', 'lift', 'rotate', 'tilt', 'opacityChange'],
  click: CLICK_PRESETS.filter((id) => id !== 'ripple'),
};

export const ELEMENT_PRESET_MAP = {
  block: motionStates,
  button: motionStates,
  input: motionStates,
  textarea: motionStates,
  checkbox: motionStates,
  radio: motionStates,
  text: typographyStates,
  image: imageStates,
  link: motionStates,
};

export const getAvailablePresetsForType = (
  elementType,
  triggerState = 'load'
) => {
  const byState = ELEMENT_PRESET_MAP[elementType] || motionStates;
  const ids = byState[triggerState] || [];
  const visibleIds = ['none', ...ids.filter((id) => id !== 'none')];

  return visibleIds.map((id) => ({
    id,
    name: PRESET_NAMES[id] || id,
    nameKey: `data.presets.${id}`,
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

export const TRIGGER_RESTRICTIONS = Object.fromEntries(
  Object.entries(ELEMENT_PRESET_MAP).map(([type, states]) => [
    type,
    Object.keys(states),
  ])
);

export const isStateAllowedForType = (state, type) => {
  const allowed = TRIGGER_RESTRICTIONS[type] || [
    'load',
    'static',
    'hover',
    'click',
  ];
  return allowed.includes(state);
};

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
  static: sanitizeAnimationConfigForType(type, 'static', animations.static),
  hover: sanitizeAnimationConfigForType(type, 'hover', animations.hover),
  click: sanitizeAnimationConfigForType(type, 'click', animations.click),
});

const timedParams = ['duration', 'delay', 'easing'];

export const PRESET_SUPPORTED_PARAMS = {
  none: [],
  fadeIn: [...timedParams, 'iterationCount', 'fillMode'],
  fadeOut: [...timedParams, 'iterationCount', 'fillMode'],
  slideInUp: [...timedParams, 'iterationCount', 'fillMode'],
  slideInDown: [...timedParams, 'iterationCount', 'fillMode'],
  slideInLeft: [...timedParams, 'iterationCount', 'fillMode'],
  slideInRight: [...timedParams, 'iterationCount', 'fillMode'],
  slideOutUp: [...timedParams, 'iterationCount', 'fillMode'],
  slideOutDown: [...timedParams, 'iterationCount', 'fillMode'],
  slideOutLeft: [...timedParams, 'iterationCount', 'fillMode'],
  slideOutRight: [...timedParams, 'iterationCount', 'fillMode'],
  zoomIn: [...timedParams, 'iterationCount', 'fillMode'],
  zoomOut: [...timedParams, 'iterationCount', 'fillMode'],
  scaleIn: [...timedParams, 'iterationCount', 'fillMode', 'transformOrigin'],
  scaleOut: [...timedParams, 'iterationCount', 'fillMode', 'transformOrigin'],
  rotateIn: [...timedParams, 'iterationCount', 'fillMode', 'transformOrigin'],
  rotateOut: [...timedParams, 'iterationCount', 'fillMode', 'transformOrigin'],
  flipInX: [...timedParams, 'iterationCount', 'fillMode', 'transformOrigin'],
  flipInY: [...timedParams, 'iterationCount', 'fillMode', 'transformOrigin'],
  bounceIn: [...timedParams, 'iterationCount', 'fillMode'],
  elasticIn: [...timedParams, 'iterationCount', 'fillMode'],
  blurIn: [...timedParams, 'iterationCount', 'fillMode', 'blurAmount'],
  blurOut: [...timedParams, 'iterationCount', 'fillMode', 'blurAmount'],
  revealUp: [...timedParams, 'iterationCount', 'fillMode'],
  revealDown: [...timedParams, 'iterationCount', 'fillMode'],

  fadeByLetter: [...timedParams, 'intensity'],
  fadeByWord: [...timedParams, 'intensity'],
  fadeByLine: [...timedParams, 'intensity'],
  typewriter: [...timedParams, 'stagger'],
  slideUpReveal: [...timedParams],
  underlineDraw: [...timedParams],

  pulse: ['duration', 'easing'],
  float: ['duration', 'easing', 'floatingAmount'],
  breathe: ['duration', 'easing'],
  wiggle: ['duration', 'easing', 'rotationAngle'],
  shake: ['duration', 'easing'],
  rotateLoop: ['duration', 'easing'],
  glow: ['duration', 'easing'],
  shimmer: ['duration', 'easing'],

  scaleUp: ['duration', 'delay', 'easing', 'hoverScale'],
  scaleDown: ['duration', 'delay', 'easing', 'hoverScale', 'clickScale'],
  lift: ['duration', 'delay', 'easing', 'hoverTranslateY'],
  rotate: ['duration', 'delay', 'easing', 'hoverRotate'],
  tilt: ['duration', 'delay', 'easing', 'hoverRotate'],
  backgroundChange: ['duration', 'delay', 'easing'],
  borderColorChange: ['duration', 'delay', 'easing'],
  borderAnimation: ['duration', 'delay', 'easing'],
  underline: ['duration', 'delay', 'easing'],
  blur: ['duration', 'delay', 'easing', 'blurAmount'],
  opacityChange: ['duration', 'delay', 'easing', 'hoverOpacity'],

  pressDown: ['duration', 'clickTranslateY'],
  ripple: ['duration', 'rippleColor'],
  elasticBounce: ['clickDuration'],
  rotateClick: ['duration', 'rotationAngle'],
  flash: ['duration'],
  shakeClick: ['duration'],
};
