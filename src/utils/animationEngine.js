import { generateTypographyCSS } from './typographyMotion';
import { generateImageCSS } from './imageMotion';
import {
  generateInteractionCSS,
  generateInteractionStyles,
} from './interactionMotion';
import { generateLayoutFormCSS } from './layoutFormMotion';
import { generateDisneyCSS } from './disneyMotion';
import { generatePhysicsCSS } from './physicsMotion';
import { applyAccessibilityFilters } from './accessibilityMotion';
import { compileNormalizedMotion } from './transformBuilder';

export const getConfigHash = (config) => {
  const str = JSON.stringify(config || {});
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
};

const generateImageHoverStyles = (presetId, config = {}) => {
  const {
    duration = 300,
    delay = 0,
    easing = 'ease',
    blurAmount = 10,
    rotationAngle = 15,
    hoverDepth = 20,
    transformOrigin = 'center',
    intensity = 100,
    parallaxDirection = 'diagonal',
  } = config;

  const transitionStyles = {
    transition: `transform ${duration}ms ${easing} ${delay}ms, filter ${duration}ms ${easing} ${delay}ms`,
    willChange: 'transform, filter',
    transformOrigin,
  };

  switch (presetId) {
    case 'parallaxHover': {
      const offset = Math.max(4, hoverDepth / 2);
      const x =
        parallaxDirection === 'vertical'
          ? 0
          : parallaxDirection === 'left'
            ? -offset
            : offset;
      const y =
        parallaxDirection === 'horizontal'
          ? 0
          : parallaxDirection === 'up'
            ? -offset
            : offset;
      transitionStyles.transform = `translate3d(${x}px, ${y}px, 0)`;
      break;
    }
    case 'tiltHover':
      transitionStyles.transform = `perspective(700px) rotate(${rotationAngle}deg) translateY(-${hoverDepth / 4}px)`;
      break;
    case 'hoverBrightness':
      transitionStyles.filter = `brightness(${1 + intensity / 500})`;
      break;
    case 'hoverBlur':
      transitionStyles.filter = `blur(${Math.min(Math.max(blurAmount || 3, 0), 4)}px)`;
      break;
    default:
      return { keyframes: '', animationStr: 'none', transitionStyles: null };
  }

  return { keyframes: '', animationStr: 'none', transitionStyles };
};

const colorToRgba = (color = '#111827', opacity = 0.22) => {
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
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const resolveAccentGlow = (config = {}) =>
  colorToRgba(
    config.shadowColor ||
      config.accentColor ||
      config.backgroundColor ||
      config.color ||
      config.borderColor ||
      '#111827',
    Math.min(config.shadowOpacity ?? 0.22, 0.32)
  );

const generateFormHoverStyles = (presetId, config = {}) => {
  const {
    duration = 300,
    delay = 0,
    easing = 'ease',
    glowColor = resolveAccentGlow(config),
  } = config;

  const transitionStyles = {
    transition: `box-shadow ${duration}ms ${easing} ${delay}ms, border-color ${duration}ms ${easing} ${delay}ms, opacity ${duration}ms ${easing} ${delay}ms`,
    willChange: 'box-shadow, border-color, opacity',
  };

  switch (presetId) {
    case 'focusGlow':
      transitionStyles.boxShadow = `0 0 0 3px ${glowColor}`;
      break;
    case 'borderSlide':
      transitionStyles.boxShadow = 'inset 0 -2px 0 0 currentColor';
      break;
    case 'placeholderFade':
      transitionStyles.opacity = 0.82;
      break;
    default:
      return { keyframes: '', animationStr: 'none', transitionStyles: null };
  }

  return { keyframes: '', animationStr: 'none', transitionStyles };
};

export const generateAnimationCSS = (
  presetId,
  rawConfig,
  uniqueId,
  triggerState = 'load'
) => {
  if (!presetId || presetId === 'none') {
    return { keyframes: '', animationStr: 'none', transitionStyles: null };
  }

  const PRESET_ALIASES = {
    fadeIn: 'fade',
    popIn: 'scale',
    slideIn: 'slide',
    slideUp: 'slide',
    slideDown: 'slide',
    slideLeft: 'slide',
    slideRight: 'slide',
    scaleIn: 'scale',
    scaleUp: 'scale',
    scaleDown: 'scale',
    rotateIn: 'rotate',
    rotateSlightly: 'rotate',
    rotateTap: 'rotate',
    blurReveal: 'blurReveal',
    bounceIn: 'squashStretch',
    lift: 'magneticHover',
    shadowLift: 'magneticHover',
    shadowIncrease: 'glowHover',
    backgroundChange: 'hoverBrightness',
    backgroundShift: 'hoverBrightness',
    colorTransition: 'hoverBrightness',
    borderAnimation: 'borderDraw',
    borderGlow: 'glowHover',
    borderHighlight: 'glowHover',
    glowAppear: 'glowHover',
    glow: 'glowHover',
    opacityChange: 'fade',
    tilt: 'tiltHover',
    pressDown: 'pressEffect',
    press: 'pressEffect',
    shake: 'errorShake',
    pulse: 'radioPulse',
    flash: 'fade',
    elasticBounce: 'elasticToggle',
    checkDraw: 'smoothCheck',
    dotExpand: 'radioPulse',
    underlineExpand: 'borderSlide',
    underlineAnimate: 'borderSlide',
    autoExpand: 'expandCollapse',
    expandWidth: 'scale',
    expandHeight: 'expandCollapse',
    textShift: 'slide',
    iconMove: 'slide',
    arrowMove: 'slide',
    gradientMotion: 'hoverBrightness',
    brightnessChange: 'hoverBrightness',
    zoom: 'parallaxHover',
    expand: 'scale',
    flip: 'rotate',
  };

  const resolvedPresetId = PRESET_ALIASES[presetId] || presetId;
  const aliasConfig = { ...(rawConfig || {}) };

  if (['slideUp', 'lift', 'shadowLift'].includes(presetId)) aliasConfig.direction = 'top';
  if (presetId === 'slideDown') aliasConfig.direction = 'bottom';
  if (presetId === 'slideLeft') aliasConfig.direction = 'left';
  if (presetId === 'slideRight') aliasConfig.direction = 'right';
  if (['rotateIn', 'rotateSlightly', 'rotateTap', 'flip'].includes(presetId)) {
    aliasConfig.rotationAngle = presetId === 'flip' ? 180 : aliasConfig.rotationAngle || 10;
  }
  if (presetId === 'scaleDown') aliasConfig.intensity = Math.max(aliasConfig.intensity || 100, 140);

  presetId = resolvedPresetId;

  const config =
    typeof applyAccessibilityFilters === 'function'
      ? applyAccessibilityFilters(aliasConfig)
      : aliasConfig;

  // 1. Physics Layer
  if (config.usePhysics && (presetId === 'scale' || presetId === 'slide')) {
    const physicsId = presetId === 'scale' ? 'physicsScale' : 'physicsBounce';
    return generatePhysicsCSS(physicsId, config, uniqueId);
  }

  // 2. Interaction Layer (КРИТИЧНИЙ ФІКС)
  const interactionPresets = [
    'pressEffect',
    'ripple',
    'glowHover',
    'magneticHover',
    'borderDraw',
    'smoothCheck',
    'bounceCheck',
    'radioPulse',
    'elasticToggle',
  ];

  if (interactionPresets.includes(presetId)) {
    // 💡 Використовуємо Styles для простих, CSS для складних
    if (
      [
        'glowHover',
        'magneticHover',
        'pressEffect',
        'smoothCheck',
        'bounceCheck',
        'radioPulse',
        'elasticToggle',
      ].includes(presetId)
    ) {
      if (triggerState === 'hover' || triggerState === 'click') {
        return generateInteractionStyles(presetId, config);
      }
    }
    return generateInteractionCSS(presetId, config, uniqueId, triggerState);
  }

  // 3. Typography, Image, Disney, Layout (Груповий прокид)
  if (
    [
      'fadeByLetter',
      'fadeByWord',
      'fadeByLine',
      'typewriter',
      'blurReveal',
      'slideUpReveal',
      'underlineDraw',
    ].includes(presetId)
  )
    return generateTypographyCSS(
      presetId,
      {
        ...config,
        intensity:
          presetId === 'blurReveal'
            ? Math.max(0, (config.blurAmount ?? config.intensity ?? 10) * 10)
            : presetId === 'typewriter' && config.stagger !== undefined
              ? Math.max(0, Math.min(140, 160 - Number(config.stagger) * 2))
              : config.intensity,
      },
      uniqueId,
      triggerState
    );

  if (
    [
      'zoomReveal',
      'parallaxHover',
      'tiltHover',
      'kenBurns',
      'floatingImage',
      'hoverBrightness',
      'hoverBlur',
    ].includes(presetId)
  )
    return triggerState === 'hover'
      ? generateImageHoverStyles(presetId, config)
      : triggerState === 'load'
        ? generateImageCSS(presetId, config, uniqueId)
        : { keyframes: '', animationStr: 'none', transitionStyles: null };

  if (
    [
      'errorShake',
      'focusGlow',
      'borderSlide',
      'placeholderFade',
      'floatingLabel',
      'staggerReveal',
      'expandCollapse',
      'floatingSection',
      'scrollReveal',
    ].includes(presetId)
  )
    return triggerState === 'hover'
      ? generateFormHoverStyles(presetId, config)
      : generateLayoutFormCSS(presetId, config, uniqueId);

  if (
    [
      'squashStretch',
      'anticipateReveal',
      'arcReveal',
      'secondaryAction',
      'followThrough',
    ].includes(presetId)
  )
    return generateDisneyCSS(presetId, config, uniqueId);

  // 4. Базові пресети (Fade, Slide, Scale, Rotate)
  let {
    duration = 300,
    delay = 0,
    easing = 'ease',
    intensity = 100,
    direction = 'normal',
    fillMode = 'both',
    iterationCount = 1,
    scaleRange = [1, 1],
    motionAxis = 'all',
    blurAmount = 0,
    rotationAngle = 0,
    transformOrigin = 'center',
  } = config;

  if (triggerState === 'click') {
    duration = Math.max(80, Math.min(duration, 180));
    easing = 'cubic-bezier(0.4, 0, 0.2, 1)';
  }

  let motionObj = {
    start: { x: 0, y: 0, scale: 1, rotate: 0, opacity: null, blur: 0 },
    mid: null,
    end: { x: 0, y: 0, scale: 1, rotate: 0, opacity: null, blur: 0 },
    timing: {
      duration,
      easing,
      delay,
      fillMode: triggerState === 'hover' ? 'forwards' : fillMode,
      iterationCount:
        iterationCount === 'infinite' ? 'infinite' : iterationCount,
      direction,
    },
  };

  const animName = `ad_anim_${presetId}_${triggerState}_${uniqueId}_${getConfigHash(config)}`;

  switch (presetId) {
    case 'fade':
      if (triggerState === 'hover')
        motionObj.end.opacity = Math.max(0.2, 1 - intensity / 100);
      else if (triggerState === 'click') motionObj.mid = { opacity: 0.5 };
      else {
        motionObj.start.opacity = 0;
        motionObj.end.opacity = 1;
      }
      break;

    case 'slide': {
      const val = triggerState === 'hover' ? intensity / 5 : intensity;
      let dx = 0,
        dy = 0;
      if (direction === 'left') dx = -val;
      else if (direction === 'right') dx = val;
      else if (direction === 'top') dy = -val;
      else dy = val;

      if (triggerState === 'hover') {
        motionObj.end.x = dx;
        motionObj.end.y = dy;
      } else if (triggerState === 'click') {
        motionObj.mid = { x: dx / 5, y: dy / 5 };
      } else {
        motionObj.start.x = dx;
        motionObj.start.y = dy;
        motionObj.start.opacity = 0;
        motionObj.end.opacity = 1;
      }
      break;
    }

    case 'scale': {
      const sStart = scaleRange[0] !== 1 ? scaleRange[0] : 0.8;
      const sEnd = 1 + intensity / 500;
      if (triggerState === 'hover') {
        if (motionAxis !== 'y') motionObj.end.scaleX = sEnd;
        if (motionAxis !== 'x') motionObj.end.scaleY = sEnd;
      } else if (triggerState === 'click') {
        const pressScale = Math.max(0.8, 1 - intensity / 1000);
        motionObj.mid = {};
        if (motionAxis !== 'y') motionObj.mid.scaleX = pressScale;
        if (motionAxis !== 'x') motionObj.mid.scaleY = pressScale;
      } else {
        motionObj.start.opacity = 0;
        if (motionAxis !== 'y') {
          motionObj.start.scaleX = sStart;
          motionObj.end.scaleX = 1;
        }
        if (motionAxis !== 'x') {
          motionObj.start.scaleY = sStart;
          motionObj.end.scaleY = 1;
        }
      }
      break;
    }

    case 'rotate':
      if (triggerState === 'hover') motionObj.end.rotate = rotationAngle || 15;
      else if (triggerState === 'click') motionObj.mid = { rotate: rotationAngle || 12 };
      else {
        motionObj.start.opacity = 0;
        motionObj.start.rotate = -(rotationAngle || 90);
        motionObj.end.opacity = 1;
        motionObj.end.rotate = 0;
      }
      break;

    case 'hoverBlur':
      if (triggerState === 'hover')
        motionObj.end.blur = Math.min(Math.max(blurAmount || 3, 0), 4);
      break;

    default:
      return { keyframes: '', animationStr: 'none', transitionStyles: null };
  }
  if (triggerState === 'hover') {
    const transition = `transform ${duration}ms ${easing} ${delay}ms, filter ${duration}ms ${easing} ${delay}ms, opacity ${duration}ms ${easing} ${delay}ms`;

    const transformParts = [];

    const end = motionObj.end || {};

    if (end.x || end.y) {
      transformParts.push(`translate3d(${end.x || 0}px, ${end.y || 0}px, 0)`);
    }

    if (end.scaleX || end.scaleY) {
      transformParts.push(`scale(${end.scaleX || 1}, ${end.scaleY || 1})`);
    } else if (end.scale && end.scale !== 1) {
      transformParts.push(`scale(${end.scale})`);
    }

    if (end.rotate) {
      transformParts.push(`rotate(${end.rotate}deg)`);
    }

    const transitionStyles = {
      transition,
      willChange: 'transform, filter, opacity',
      transformOrigin,
    };

    if (transformParts.length > 0) {
      transitionStyles.transform = transformParts.join(' ');
    }

    if (end.blur) {
      transitionStyles.filter = `blur(${end.blur}px)`;
    }

    if (end.opacity !== null && end.opacity !== undefined) {
      transitionStyles.opacity = end.opacity;
    }

    return {
      keyframes: '',
      animationStr: 'none',
      transitionStyles,
    };
  }

  const compiled = compileNormalizedMotion(motionObj, animName, triggerState);

  if (triggerState === 'load' && presetId === 'scale' && transformOrigin) {
    return {
      ...compiled,
      keyframes: `#${uniqueId} { transform-origin: ${transformOrigin}; }\n${compiled.keyframes}`,
    };
  }

  return compiled;
};
