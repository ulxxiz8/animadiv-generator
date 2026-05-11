import { generateTypographyCSS } from './typographyMotion';
import { generateImageCSS } from './imageMotion';
import {
  generateInteractionCSS,
  generateInteractionStyles,
} from './interactionMotion';
import { generateLayoutFormCSS } from './layoutFormMotion';
import { generateCombinedCSS } from './combinationMotion';
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
    return generateImageCSS(presetId, config, uniqueId);

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
      fillMode: triggerState === 'hover' ? 'forwards' : 'both',
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

  return compileNormalizedMotion(motionObj, animName, triggerState);
};
