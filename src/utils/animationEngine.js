import { generateTypographyCSS } from './typographyMotion';
import { generateImageCSS } from './imageMotion';
import { generateInteractionCSS } from './interactionMotion';
import { generateLayoutFormCSS } from './layoutFormMotion';
import { generateCombinedCSS } from './combinationMotion';
import { generateDisneyCSS } from './disneyMotion';
import { generatePhysicsCSS } from './physicsMotion';
import { applyAccessibilityFilters } from './accessibilityMotion';
import { compileNormalizedMotion } from './transformBuilder';

/**
 * Детермінований хеш. Видає однаковий ID для однакових налаштувань.
 * Це гарантує, що браузер не буде перемальовувати DOM без потреби.
 */
export const getConfigHash = (config) => {
  const str = JSON.stringify(config || {});
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
};

/**
 * Створює CSS-правила та рядок анімації на основі конфігурації.
 */
export const generateAnimationCSS = (
  presetId,
  rawConfig,
  uniqueId,
  triggerState = 'load'
) => {
  if (!presetId || presetId === 'none') {
    return { keyframes: '', animationStr: 'none' };
  }

  // ✅ ACCESSIBILITY LAYER (Мідлвар)
  const config =
    typeof applyAccessibilityFilters === 'function'
      ? applyAccessibilityFilters(rawConfig)
      : rawConfig;

  // 0. Physics Layer (Розумний перехоплювач)
  if (config.usePhysics) {
    // Фізика працює ТІЛЬКИ для scale та slide. Для інших — просто ігноруємо прапорець.
    if (presetId === 'scale')
      return generatePhysicsCSS('physicsScale', config, uniqueId);
    if (presetId === 'slide')
      return generatePhysicsCSS('physicsBounce', config, uniqueId);
  }
  // Якщо вибрано суто фізичний пресет напряму
  if (['physicsScale', 'physicsBounce', 'physicsHover'].includes(presetId)) {
    return generatePhysicsCSS(presetId, config, uniqueId);
  }

  // 0. Combination
  if (config.effects?.length > 0 || (presetId && presetId.includes('+'))) {
    const effectsArray =
      config.effects?.length > 0
        ? config.effects
        : presetId.split('+').map((eff) => ({ type: eff.trim() }));

    return generateCombinedCSS(effectsArray, config, uniqueId, triggerState);
  }

  // 1. Typography
  const typographyPresets = [
    'fadeByLetter',
    'fadeByWord',
    'fadeByLine',
    'typewriter',
    'blurReveal',
    'slideUpReveal',
    'underlineDraw',
  ];
  if (typographyPresets.includes(presetId))
    return generateTypographyCSS(presetId, config, uniqueId);

  // 2. Image
  const imagePresets = [
    'zoomReveal',
    'parallaxHover',
    'tiltHover',
    'kenBurns',
    'floatingImage',
    'hoverBrightness',
    'hoverBlur',
  ];
  if (imagePresets.includes(presetId))
    return generateImageCSS(presetId, config, uniqueId);

  // 3. Interactions
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
  if (interactionPresets.includes(presetId))
    return generateInteractionCSS(presetId, config, uniqueId);

  // 4. Layout & Form
  const layoutFormPresets = [
    'errorShake',
    'focusGlow',
    'borderSlide',
    'placeholderFade',
    'floatingLabel',
    'staggerReveal',
    'expandCollapse',
    'floatingSection',
    'scrollReveal',
  ];
  if (layoutFormPresets.includes(presetId))
    return generateLayoutFormCSS(presetId, config, uniqueId);

  // 5. Disney-Inspired
  const disneyPresets = [
    'squashStretch',
    'anticipateReveal',
    'arcReveal',
    'secondaryAction',
    'followThrough',
  ];
  if (disneyPresets.includes(presetId))
    return generateDisneyCSS(presetId, config, uniqueId);

  // ==========================================
  // БАЗОВІ ПРЕСЕТИ З АДАПТАЦІЄЮ ПІД ТРИГЕР
  // ==========================================

  /// 🔴 ЗМІНЕНО: const на let, щоб ми могли тюнити час
  let {
    duration = 300,
    delay = 0,
    easing = 'ease',
    intensity = 100,
    direction = 'normal',
    iterationCount = 1,
    fillMode,
    scaleRange = [1, 1],
    motionAxis = 'all',
  } = config;

  // ✅ TACTILE CLICK LIFECYCLE
  if (triggerState === 'click') {
    // Примусово затискаємо час у тактильні рамки
    duration = Math.max(80, Math.min(duration, 180));
    // Надаємо пружності
    if (easing === 'ease') easing = 'cubic-bezier(0.4, 0, 0.2, 1)';
  }

  // ✅ Ініціалізація Motion Object
  let motionObj = {
    start: { x: 0, y: 0, scale: 1, rotate: 0, opacity: null },
    mid: null,
    end: { x: 0, y: 0, scale: 1, rotate: 0, opacity: null },
    timing: {
      duration,
      easing,
      delay,
      fillMode:
        fillMode && fillMode !== 'both'
          ? fillMode
          : triggerState === 'hover'
            ? 'forwards'
            : 'both',
      iterationCount:
        iterationCount === 'infinite' ? 'infinite' : iterationCount,
      direction: [
        'normal',
        'reverse',
        'alternate',
        'alternate-reverse',
      ].includes(direction)
        ? direction
        : 'normal',
    },
  };

  const hash = getConfigHash(config);
  const animName = `ad_anim_${presetId}_${triggerState}_${uniqueId}_${hash}`;

  switch (presetId) {
    case 'fade': {
      if (triggerState === 'hover') {
        motionObj.end.opacity = Math.max(0.2, 1 - intensity / 100);
      } else if (triggerState === 'click') {
        motionObj.mid = { opacity: 0.5 };
      } else {
        motionObj.start.opacity = Math.max(0, 1 - intensity / 100);
        motionObj.end.opacity = 1;
      }
      break;
    }

    case 'slide': {
      let val =
        triggerState === 'hover'
          ? intensity / 5
          : triggerState === 'click'
            ? intensity / 8
            : intensity;
      let dx = 0,
        dy = 0;

      if (direction === 'left') dx = -val;
      else if (direction === 'right') dx = val;
      else if (direction === 'top' || direction === 'reverse') dy = -val;
      else dy = val;

      if (triggerState === 'hover') {
        motionObj.end.x = dx;
        motionObj.end.y = dy;
      } else if (triggerState === 'click') {
        motionObj.mid = { x: dx, y: dy };
      } else {
        motionObj.start.x = dx;
        motionObj.start.y = dy;
        motionObj.start.opacity = 0;
        motionObj.end.opacity = 1;
      }
      break;
    }

    case 'scale': {
      const sStart =
        scaleRange[0] !== 1 ? scaleRange[0] : Math.max(0, 1 - intensity / 100);
      const sEnd = scaleRange[1] !== 1 ? scaleRange[1] : 1 + intensity / 500;

      if (triggerState === 'hover') {
        if (motionAxis !== 'y') motionObj.end.scaleX = sEnd;
        if (motionAxis !== 'x') motionObj.end.scaleY = sEnd;
      } else if (triggerState === 'click') {
        motionObj.mid = { transforms: {} }; // Ініціалізація для безпеки
        const clickScale = Math.max(0.5, 1 - intensity / 500);
        if (motionAxis !== 'y') motionObj.mid.scaleX = clickScale;
        if (motionAxis !== 'x') motionObj.mid.scaleY = clickScale;
      } else {
        motionObj.start.opacity = 0;
        motionObj.end.opacity = 1;
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

    default:
      return { keyframes: '', animationStr: 'none' };
  }

  // 🏁 ФІНАЛЬНИЙ ПУНКТ: компіляція та вихід з функції
  return compileNormalizedMotion(motionObj, animName, triggerState);
};
