export const LOAD_PRESETS = [
  'none',
  'fadeIn',
  'fadeOut',
  'slideInUp',
  'slideInDown',
  'slideInLeft',
  'slideInRight',
  'slideOutUp',
  'slideOutDown',
  'slideOutLeft',
  'slideOutRight',
  'zoomIn',
  'zoomOut',
  'scaleIn',
  'scaleOut',
  'rotateIn',
  'rotateOut',
  'flipInX',
  'flipInY',
  'bounceIn',
  'elasticIn',
  'blurIn',
  'blurOut',
  'revealUp',
  'revealDown',
];

export const STATIC_LOOP_PRESETS = [
  'none',
  'pulse',
  'float',
  'breathe',
  'wiggle',
  'shake',
  'rotateLoop',
  'glow',
  'shimmer',
];

export const HOVER_PRESETS = [
  'none',
  'scaleUp',
  'scaleDown',
  'lift',
  'rotate',
  'tilt',
  'glow',
  'backgroundChange',
  'borderColorChange',
  'borderAnimation',
  'underline',
  'blur',
  'opacityChange',
];

export const CLICK_PRESETS = [
  'none',
  'scaleDown',
  'pressDown',
  'ripple',
  'elasticBounce',
  'rotateClick',
  'flash',
  'shakeClick',
];

export const SUPPORTED_MOTION_PRESETS = new Set([
  ...LOAD_PRESETS,
  ...STATIC_LOOP_PRESETS,
  ...HOVER_PRESETS,
  ...CLICK_PRESETS,
]);

export const PRESET_LABELS = {
  none: 'No animation',
  fadeIn: 'Fade In',
  fadeOut: 'Fade Out',
  slideInUp: 'Slide In Up',
  slideInDown: 'Slide In Down',
  slideInLeft: 'Slide In Left',
  slideInRight: 'Slide In Right',
  slideOutUp: 'Slide Out Up',
  slideOutDown: 'Slide Out Down',
  slideOutLeft: 'Slide Out Left',
  slideOutRight: 'Slide Out Right',
  zoomIn: 'Zoom In',
  zoomOut: 'Zoom Out',
  scaleIn: 'Scale In',
  scaleOut: 'Scale Out',
  rotateIn: 'Rotate In',
  rotateOut: 'Rotate Out',
  flipInX: 'Flip In X',
  flipInY: 'Flip In Y',
  bounceIn: 'Bounce In',
  elasticIn: 'Elastic In',
  blurIn: 'Blur In',
  blurOut: 'Blur Out',
  revealUp: 'Reveal Up',
  revealDown: 'Reveal Down',
  fadeByLetter: 'Letter Fade',
  fadeByWord: 'Word Fade',
  fadeByLine: 'Line Fade',
  typewriter: 'Typewriter',
  blurReveal: 'Blur Reveal',
  slideUpReveal: 'Slide Up Reveal',
  underlineDraw: 'Underline Draw',
  pulse: 'Pulse',
  float: 'Float',
  breathe: 'Breathe',
  wiggle: 'Wiggle',
  shake: 'Shake',
  rotateLoop: 'Rotate Loop',
  glow: 'Glow',
  shimmer: 'Shimmer',
  scaleUp: 'Scale Up',
  scaleDown: 'Scale Down',
  lift: 'Lift',
  rotate: 'Rotate',
  tilt: 'Tilt',
  shadowGrow: 'Shadow Grow',
  backgroundChange: 'Background Change',
  borderColorChange: 'Border Color Change',
  borderAnimation: 'Border Animation',
  underline: 'Underline',
  blur: 'Blur',
  opacityChange: 'Opacity Change',
  pressDown: 'Press Down',
  ripple: 'Ripple',
  elasticBounce: 'Elastic Bounce',
  rotateClick: 'Rotate Click',
  flash: 'Flash',
  shakeClick: 'Shake Click',
};

export const colorToRgba = (color = '#111827', opacity = 0.16) => {
  if (String(color).startsWith('rgba(')) return color;
  if (String(color).startsWith('rgb(')) {
    return String(color).replace('rgb(', 'rgba(').replace(')', `, ${opacity})`);
  }

  const hex = String(color).replace('#', '');
  if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(hex)) {
    return `rgba(17, 24, 39, ${opacity})`;
  }

  const normalized =
    hex.length === 3
      ? hex
          .split('')
          .map((char) => char + char)
          .join('')
      : hex;
  const value = parseInt(normalized, 16);
  return `rgba(${(value >> 16) & 255}, ${(value >> 8) & 255}, ${
    value & 255
  }, ${opacity})`;
};


const clampMotionNumber = (value, min, max, fallback) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return fallback;
  return Math.min(max, Math.max(min, numeric));
};

export const getGeneratedGradient = (settings = {}, styles = {}) => {
  const type = settings.gradientType || 'linear';
  const from = settings.gradientColorFrom || styles.backgroundColor || '#F9FAFB';
  const middle = settings.gradientColorMiddle;
  const to = settings.gradientColorTo || '#E5E7EB';

  if (settings.gradientCss) return settings.gradientCss;

  if (type === 'radial') {
    const position = settings.gradientPosition || 'center';
    const stops = middle
      ? `${from} 0%, ${middle} 50%, ${to} 100%`
      : `${from} 0%, ${to} 100%`;
    return `radial-gradient(circle at ${position}, ${stops})`;
  }

  const angle = Number(settings.gradientAngle ?? 135);
  const stops = middle
    ? `${from} 0%, ${middle} 50%, ${to} 100%`
    : `${from} 0%, ${to} 100%`;
  return `linear-gradient(${angle}deg, ${stops})`;
};

export const getResolvedBackground = (settings = {}, styles = {}) => {
  const backgroundType = settings.backgroundType || settings.backgroundMode || 'solid';
  if (backgroundType === 'image' && settings.backgroundImage) {
    return `url("${settings.backgroundImage}")`;
  }
  if (backgroundType === 'gradient' || settings.backgroundMode === 'gradient') {
    return getGeneratedGradient(settings, styles);
  }
  return settings.backgroundColor || styles.backgroundColor || 'transparent';
};

export const getBoxShadow = (settings = {}) => {
  if (!settings.shadowEnabled) return null;
  const x = Number(settings.shadowOffsetX ?? 0);
  const y = Number(settings.shadowOffsetY ?? 6);
  const blur = Number(settings.shadowBlur ?? 18);
  const spread = Number(settings.shadowSpread ?? 0);
  return `${x}px ${y}px ${blur}px ${spread}px ${colorToRgba(
    settings.shadowColor,
    settings.shadowOpacity ?? 0.16
  )}`;
};

export const getBaseTransform = (config = {}) => {
  const transform = config.staticTransform || {};
  const parts = [
    `translateX(${Number(transform.translateX ?? config.translateX ?? 0)}px)`,
    `translateY(${Number(transform.translateY ?? config.translateY ?? 0)}px)`,
    `scale(${Number(transform.scale ?? config.scale ?? 1)})`,
    `rotate(${Number(transform.rotate ?? config.rotate ?? 0)}deg)`,
    `skewX(${Number(transform.skewX ?? config.skewX ?? 0)}deg)`,
    `skewY(${Number(transform.skewY ?? config.skewY ?? 0)}deg)`,
  ];
  return parts.join(' ');
};

const timing = (config = {}, defaults = {}) => ({
  duration: Number(config.duration ?? defaults.duration ?? 300),
  delay: Number(config.delay ?? defaults.delay ?? 0),
  easing: config.easing || defaults.easing || 'ease',
  iterationCount: config.iterationCount ?? defaults.iterationCount ?? 1,
  fillMode: config.fillMode || defaults.fillMode || 'both',
});

const animationString = (name, config, defaults) => {
  const t = timing(config, defaults);
  return `${name} ${t.duration}ms ${t.easing} ${t.delay}ms ${t.iterationCount} ${t.fillMode}`;
};

const loadFrames = {
  fadeIn: ['opacity: 0;', 'opacity: 1;'],
  fadeOut: ['opacity: 1;', 'opacity: 0;'],
  slideInUp: [
    'opacity: 0; transform: var(--base-transform) translateY(100%);',
    'opacity: 1; transform: var(--base-transform) translateY(0);',
  ],
  slideInDown: [
    'opacity: 0; transform: var(--base-transform) translateY(-100%);',
    'opacity: 1; transform: var(--base-transform) translateY(0);',
  ],
  slideInLeft: [
    'opacity: 0; transform: var(--base-transform) translateX(-100%);',
    'opacity: 1; transform: var(--base-transform) translateX(0);',
  ],
  slideInRight: [
    'opacity: 0; transform: var(--base-transform) translateX(100%);',
    'opacity: 1; transform: var(--base-transform) translateX(0);',
  ],
  slideOutUp: [
    'opacity: 1; transform: var(--base-transform) translateY(0);',
    'opacity: 0; transform: var(--base-transform) translateY(-100%);',
  ],
  slideOutDown: [
    'opacity: 1; transform: var(--base-transform) translateY(0);',
    'opacity: 0; transform: var(--base-transform) translateY(100%);',
  ],
  slideOutLeft: [
    'opacity: 1; transform: var(--base-transform) translateX(0);',
    'opacity: 0; transform: var(--base-transform) translateX(-100%);',
  ],
  slideOutRight: [
    'opacity: 1; transform: var(--base-transform) translateX(0);',
    'opacity: 0; transform: var(--base-transform) translateX(100%);',
  ],
  zoomIn: [
    'opacity: 0; transform: var(--base-transform) scale(0.7);',
    'opacity: 1; transform: var(--base-transform) scale(1);',
  ],
  zoomOut: [
    'opacity: 1; transform: var(--base-transform) scale(1);',
    'opacity: 0; transform: var(--base-transform) scale(1.25);',
  ],
  scaleIn: [
    'opacity: 0; transform: var(--base-transform) scale(0.84);',
    'opacity: 1; transform: var(--base-transform) scale(1);',
  ],
  scaleOut: [
    'opacity: 1; transform: var(--base-transform) scale(1);',
    'opacity: 0; transform: var(--base-transform) scale(0.84);',
  ],
  rotateIn: [
    'opacity: 0; transform: var(--base-transform) rotate(-90deg) scale(0.9);',
    'opacity: 1; transform: var(--base-transform) rotate(0) scale(1);',
  ],
  rotateOut: [
    'opacity: 1; transform: var(--base-transform) rotate(0) scale(1);',
    'opacity: 0; transform: var(--base-transform) rotate(90deg) scale(0.9);',
  ],
  flipInX: [
    'opacity: 0; transform: var(--base-transform) perspective(700px) rotateX(-90deg);',
    'opacity: 1; transform: var(--base-transform) perspective(700px) rotateX(0);',
  ],
  flipInY: [
    'opacity: 0; transform: var(--base-transform) perspective(700px) rotateY(-90deg);',
    'opacity: 1; transform: var(--base-transform) perspective(700px) rotateY(0);',
  ],
  bounceIn: [
    '0% { opacity: 0; transform: var(--base-transform) scale(0.72); }',
    '55% { opacity: 1; transform: var(--base-transform) scale(1.08); }',
    '75% { transform: var(--base-transform) scale(0.96); }',
    '100% { transform: var(--base-transform) scale(1); }',
  ],
  elasticIn: [
    '0% { opacity: 0; transform: var(--base-transform) scale(0.7); }',
    '50% { opacity: 1; transform: var(--base-transform) scale(1.14); }',
    '70% { transform: var(--base-transform) scale(0.92); }',
    '90% { transform: var(--base-transform) scale(1.04); }',
    '100% { transform: var(--base-transform) scale(1); }',
  ],
  blurIn: [
    'opacity: 0; filter: blur(12px);',
    'opacity: 1; filter: blur(0);',
  ],
  blurOut: [
    'opacity: 1; filter: blur(0);',
    'opacity: 0; filter: blur(12px);',
  ],
  revealUp: [
    'opacity: 0; clip-path: inset(100% 0 0 0); transform: var(--base-transform) translateY(16px);',
    'opacity: 1; clip-path: inset(0 0 0 0); transform: var(--base-transform) translateY(0);',
  ],
  revealDown: [
    'opacity: 0; clip-path: inset(0 0 100% 0); transform: var(--base-transform) translateY(-16px);',
    'opacity: 1; clip-path: inset(0 0 0 0); transform: var(--base-transform) translateY(0);',
  ],
};

const makeKeyframes = (name, frames) => {
  if (!frames) return '';
  if (frames.length > 2) return `@keyframes ${name} {\n  ${frames.join('\n  ')}\n}`;
  return `@keyframes ${name} {\n  from { ${frames[0]} }\n  to { ${frames[1]} }\n}`;
};

const hoverTransition = (config = {}) => {
  const t = timing(config, { duration: 240, fillMode: 'forwards' });
  return `transform ${t.duration}ms ${t.easing} ${t.delay}ms, opacity ${t.duration}ms ${t.easing} ${t.delay}ms, filter ${t.duration}ms ${t.easing} ${t.delay}ms, background ${t.duration}ms ${t.easing} ${t.delay}ms, color ${t.duration}ms ${t.easing} ${t.delay}ms, border-color ${t.duration}ms ${t.easing} ${t.delay}ms, box-shadow ${t.duration}ms ${t.easing} ${t.delay}ms`;
};

export const generateMotionCSS = (
  presetId,
  config = {},
  uniqueId = 'animadiv-element',
  triggerState = 'load'
) => {
  if (!presetId || presetId === 'none') {
    return { keyframes: '', animationStr: 'none', transitionStyles: null, css: '' };
  }

  if (triggerState === 'load' && LOAD_PRESETS.includes(presetId)) {
    const name = `ad_${presetId}_${uniqueId}`;
    return {
      keyframes: makeKeyframes(name, loadFrames[presetId]),
      animationStr: animationString(name, config, { duration: 500, fillMode: 'both' }),
      transitionStyles: null,
      css: '',
    };
  }

  if (triggerState === 'static' && STATIC_LOOP_PRESETS.includes(presetId)) {
    const name = `ad_${presetId}_${uniqueId}`;
    const frames = {
      pulse: ['transform: var(--base-transform) scale(1);', 'transform: var(--base-transform) scale(1.06);'],
      float: ['transform: var(--base-transform) translateY(0);', 'transform: var(--base-transform) translateY(-12px);'],
      breathe: ['filter: brightness(1); transform: var(--base-transform) scale(1);', 'filter: brightness(1.04); transform: var(--base-transform) scale(1.025);'],
      wiggle: ['0%, 100% { transform: var(--base-transform) rotate(0); }', '25% { transform: var(--base-transform) rotate(-2deg); }', '75% { transform: var(--base-transform) rotate(2deg); }'],
      shake: ['0%, 100% { transform: var(--base-transform) translateX(0); }', '25% { transform: var(--base-transform) translateX(-4px); }', '75% { transform: var(--base-transform) translateX(4px); }'],
      rotateLoop: ['transform: var(--base-transform) rotate(0deg);', 'transform: var(--base-transform) rotate(360deg);'],
      glow: ['box-shadow: 0 0 0 rgba(214, 248, 84, 0);', 'box-shadow: 0 0 28px rgba(214, 248, 84, .45);'],
      shimmer: ['background-position: 200% center;', 'background-position: -200% center;'],
    };
    return {
      keyframes: makeKeyframes(name, frames[presetId]),
      animationStr: animationString(name, config, {
        duration: presetId === 'rotateLoop' ? 2400 : 1600,
        iterationCount: 'infinite',
        fillMode: 'both',
      }),
      transitionStyles: null,
      css: '',
    };
  }

  if (triggerState === 'hover' && HOVER_PRESETS.includes(presetId)) {
    const hoverScale = clampMotionNumber(config.hoverScale, 1.01, 2.5, 1.06);
    const hoverRotate = clampMotionNumber(config.hoverRotate, -45, 45, 4);
    const hoverTranslateY = clampMotionNumber(config.hoverTranslateY, -80, 80, -6);
    const hoverScaleDown = clampMotionNumber(config.hoverScaleDown ?? config.clickScale, 0.2, 0.99, 0.96);
    const styles = { transition: hoverTransition(config), willChange: 'transform, opacity, filter, background, border-color, box-shadow' };
    const cssParts = [];

    if (presetId === 'scaleUp') styles.transform = `var(--base-transform) scale(${hoverScale})`;
    if (presetId === 'scaleDown') styles.transform = `var(--base-transform) scale(${hoverScaleDown})`;
    if (presetId === 'lift') styles.transform = `var(--base-transform) translateY(${hoverTranslateY}px)`;
    if (presetId === 'rotate') styles.transform = `var(--base-transform) rotate(${hoverRotate}deg)`;
    if (presetId === 'tilt') styles.transform = `var(--base-transform) perspective(700px) rotateX(5deg) rotateY(-5deg)`;
    if (presetId === 'glow') {
      styles.boxShadow = `0 0 0 1px ${colorToRgba(config.accentColor, 0.24)}, 0 0 28px ${colorToRgba(config.accentColor, 0.36)}`;
      styles.filter = 'brightness(1.04)';
    }
    if (presetId === 'backgroundChange') {
      styles.background = config.hoverUseGradient
        ? `linear-gradient(135deg, ${config.hoverGradientFrom || '#111827'}, ${config.hoverGradientTo || '#334155'})`
        : config.hoverBackgroundColor || config.hoverBackground || '#374151';
      if (config.hoverColor) styles.color = config.hoverColor;
    }
    if (presetId === 'borderColorChange') {
      styles.borderColor = config.hoverBorderColor || config.borderColor || '#111827';
    }
    if (presetId === 'borderAnimation') {
      styles.borderColor = config.hoverBorderColor || config.borderColor || '#111827';
      styles.boxShadow =
        config.borderAnimationType === 'glow'
          ? `0 0 0 4px ${colorToRgba(config.hoverBorderColor || config.borderColor, 0.18)}`
          : config.borderAnimationType === 'dashed'
            ? `0 0 0 1px ${config.hoverBorderColor || config.borderColor || '#111827'}`
            : `inset 0 0 0 ${Math.max(2, Number(config.borderWidth || 2))}px ${config.hoverBorderColor || config.borderColor || '#111827'}`;
      if (config.borderAnimationType === 'dashed') styles.borderStyle = 'dashed';
    }
    if (presetId === 'underline') styles.textDecoration = 'underline';
    if (presetId === 'blur') {
      const blurAmount = Number(config.blurAmount);
      styles.filter = `blur(${Number.isFinite(blurAmount) && blurAmount > 0 ? blurAmount : 4}px)`;
    }
    if (presetId === 'opacityChange') styles.opacity = config.hoverOpacity ?? 0.72;

    return { keyframes: '', animationStr: 'none', transitionStyles: styles, css: cssParts.join('\n') };
  }

  if (triggerState === 'click' && CLICK_PRESETS.includes(presetId)) {
    const duration = Number(config.clickDuration ?? config.duration ?? 180);
    const name = `ad_${presetId}_${uniqueId}`;
    const styles = {
      transition: `transform ${duration}ms ease, box-shadow ${duration}ms ease, opacity ${duration}ms ease, background ${duration}ms ease`,
      willChange: 'transform, box-shadow, opacity',
    };

    if (presetId === 'scaleDown') styles.transform = `var(--base-transform) scale(${clampMotionNumber(config.clickScale, 0.2, 0.99, 0.96)})`;
    if (presetId === 'pressDown') {
      styles.transform = `var(--base-transform) translateY(${config.clickTranslateY ?? 2}px)`;
      styles.boxShadow = `0 2px 6px ${colorToRgba(config.shadowColor || '#111827', 0.12)}`;
    }
    if (presetId === 'rotateClick') styles.transform = 'var(--base-transform) rotate(8deg) scale(0.98)';
    if (presetId === 'flash') {
      styles.opacity = 0.68;
      styles.filter = 'brightness(1.2)';
    }

    const frames = {
      elasticBounce: ['0% { transform: var(--base-transform) scale(1); }', '28% { transform: var(--base-transform) scale(0.92); }', '55% { transform: var(--base-transform) scale(1.08); }', '78% { transform: var(--base-transform) scale(0.98); }', '100% { transform: var(--base-transform) scale(1); }'],
      shakeClick: ['0%, 100% { transform: var(--base-transform) translateX(0); }', '25% { transform: var(--base-transform) translateX(-6px); }', '75% { transform: var(--base-transform) translateX(6px); }'],
      ripple: ['0% { transform: translate(-50%, -50%) scale(0); opacity: .45; }', '100% { transform: translate(-50%, -50%) scale(2.8); opacity: 0; }'],
    };

    if (presetId === 'elasticBounce' || presetId === 'shakeClick') {
      return {
        keyframes: makeKeyframes(name, frames[presetId]),
        animationStr: animationString(name, config, { duration: presetId === 'elasticBounce' ? 420 : 240, fillMode: 'both' }),
        transitionStyles: null,
        css: '',
      };
    }

    if (presetId === 'ripple') {
      const css = `
#${uniqueId} { position: relative; overflow: hidden; }
#${uniqueId}::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  width: 120%;
  aspect-ratio: 1;
  border-radius: 999px;
  background: ${config.rippleColor || 'rgba(255, 255, 255, 0.45)'};
  transform: translate(-50%, -50%) scale(0);
  opacity: 0;
  pointer-events: none;
}
#${uniqueId}.is-clicked::after,
#${uniqueId}:active::after {
  animation: ${name} ${duration}ms ease-out both;
}`;
      return { keyframes: makeKeyframes(name, frames.ripple), animationStr: 'none', transitionStyles: styles, css };
    }

    return { keyframes: '', animationStr: 'none', transitionStyles: styles, css: '' };
  }

  return { keyframes: '', animationStr: 'none', transitionStyles: null, css: '' };
};
