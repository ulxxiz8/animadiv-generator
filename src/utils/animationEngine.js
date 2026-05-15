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
    zoomIntensity = 50,
    rotationAngle = 15,
    parallaxDirection = 'diagonal',
  } = config;

  const transitionStyles = {
    transition: `transform ${duration}ms ${easing} ${delay}ms, filter ${duration}ms ${easing} ${delay}ms`,
    willChange: 'transform, filter',
  };

  switch (presetId) {
    case 'parallaxHover': {
      const offset = Math.max(4, zoomIntensity / 10);
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
      transitionStyles.transform = `rotate(${rotationAngle}deg)`;
      break;
    case 'hoverBrightness':
      transitionStyles.filter = 'brightness(1.12)';
      break;
    case 'hoverBlur':
      transitionStyles.filter = `blur(${blurAmount}px)`;
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

  const config =
    typeof applyAccessibilityFilters === 'function'
      ? applyAccessibilityFilters(rawConfig)
      : rawConfig;

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
    if (['glowHover', 'magneticHover', 'pressEffect'].includes(presetId)) {
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
    return generateTypographyCSS(presetId, config, uniqueId);

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
    return generateLayoutFormCSS(presetId, config, uniqueId);

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
    floatingAmount = 15,
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

    case 'slide':
      let val = triggerState === 'hover' ? intensity / 5 : intensity;
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

    case 'scale':
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

    case 'rotate':
      if (triggerState === 'hover') motionObj.end.rotate = rotationAngle || 15;
      break;

    case 'hoverBlur':
      if (triggerState === 'hover') motionObj.end.blur = blurAmount || 5;
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

  return compileNormalizedMotion(motionObj, animName, triggerState);
};
