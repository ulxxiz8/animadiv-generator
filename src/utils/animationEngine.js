import { generateTypographyCSS } from './typographyMotion';
import { generateImageCSS } from './imageMotion';
import { generateInteractionCSS } from './interactionMotion';
import { generateLayoutFormCSS } from './layoutFormMotion';
import { generateCombinedCSS } from './combinationMotion';
import { generateDisneyCSS } from './disneyMotion';
import { generatePhysicsCSS } from './physicsMotion';
import { applyAccessibilityFilters } from './accessibilityMotion';

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
  const {
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

  // ✅ СТАБІЛЬНИЙ ХЕШ (замість Math.random)
  const hash = getConfigHash(config);
  const animName = `ad_anim_${presetId}_${triggerState}_${uniqueId}_${hash}`;
  let frames = '';

  // ✅ Чітке розділення hover та click у базових пресетах
  switch (presetId) {
    case 'fade': {
      if (triggerState === 'hover') {
        const endOpacity = Math.max(0.2, 1 - intensity / 100);
        frames = `0% { opacity: 1; } 100% { opacity: ${endOpacity}; }`;
      } else if (triggerState === 'click') {
        frames = `0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; }`;
      } else {
        const startOpacity = Math.max(0, 1 - intensity / 100);
        frames = `0% { opacity: ${startOpacity}; } 100% { opacity: 1; }`;
      }
      break;
    }
    case 'slide': {
      let translateVal = `translateY(${intensity / 5}px)`;
      if (direction === 'left')
        translateVal = `translateX(-${intensity / 5}px)`;
      if (direction === 'right')
        translateVal = `translateX(${intensity / 5}px)`;
      if (direction === 'top' || direction === 'reverse')
        translateVal = `translateY(-${intensity / 5}px)`;

      if (triggerState === 'hover') {
        frames = `0% { transform: translate(0, 0); } 100% { transform: ${translateVal}; }`;
      } else if (triggerState === 'click') {
        // Клік робить швидкий зсув і повертається
        const clickVal = translateVal.replace('/ 5', '/ 8');
        frames = `0% { transform: translate(0, 0); } 50% { transform: ${clickVal}; } 100% { transform: translate(0, 0); }`;
      } else {
        const loadTranslate = translateVal.replace('/ 5', '');
        frames = `0% { transform: ${loadTranslate}; opacity: 0; } 100% { transform: translate(0, 0); opacity: 1; }`;
      }
      break;
    }
    case 'scale': {
      const sStart =
        scaleRange[0] !== 1 ? scaleRange[0] : Math.max(0, 1 - intensity / 100);
      const sEnd = scaleRange[1] !== 1 ? scaleRange[1] : 1 + intensity / 500;

      let scaleFn = 'scale';
      if (motionAxis === 'x') scaleFn = 'scaleX';
      if (motionAxis === 'y') scaleFn = 'scaleY';

      if (triggerState === 'hover') {
        frames = `0% { transform: ${scaleFn}(1); } 100% { transform: ${scaleFn}(${sEnd}); }`;
      } else if (triggerState === 'click') {
        // Клік стискає елемент всередину і відпускає
        const clickEnd = Math.max(0.5, 1 - intensity / 500);
        frames = `0% { transform: ${scaleFn}(1); } 50% { transform: ${scaleFn}(${clickEnd}); } 100% { transform: ${scaleFn}(1); }`;
      } else {
        const loadEnd = scaleRange[1] !== 1 ? scaleRange[1] : 1;
        frames = `0% { transform: ${scaleFn}(${sStart}); opacity: 0; } 100% { transform: ${scaleFn}(${loadEnd}); opacity: 1; }`;
      }
      break;
    }
    default:
      return { keyframes: '', animationStr: 'none' };
  }

  // Hover має утримувати стан (forwards), а Click і Load - завершуватись (both)
  const finalFillMode =
    fillMode && fillMode !== 'both'
      ? fillMode
      : triggerState === 'hover'
        ? 'forwards'
        : 'both';
  const finalIter = iterationCount === 'infinite' ? 'infinite' : iterationCount;

  const cssDirection = [
    'normal',
    'reverse',
    'alternate',
    'alternate-reverse',
  ].includes(direction)
    ? direction
    : 'normal';

  const keyframes = `@keyframes ${animName} { ${frames} }`;
  const animationStr = `${animName} ${duration}ms ${easing} ${delay}ms ${finalIter} ${cssDirection} ${finalFillMode}`;

  return { keyframes, animationStr };
};
