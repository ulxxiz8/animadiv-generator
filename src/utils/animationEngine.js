import { generateTypographyCSS } from './typographyMotion';
import { generateImageCSS } from './imageMotion';
import { generateInteractionCSS } from './interactionMotion';
import { generateLayoutFormCSS } from './layoutFormMotion';
import { generateCombinedCSS } from './combinationMotion';
import { generateDisneyCSS } from './disneyMotion';
import { generatePhysicsCSS } from './physicsMotion';
import { applyAccessibilityFilters } from './accessibilityMotion';

/**
 * Створює CSS-правила та рядок анімації на основі конфігурації.
 */
// ✅ ДОДАНО: 4-й параметр triggerState (за замовчуванням 'load')
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

  // ✅ Визначаємо, чи це інтеракція (щоб адаптувати базові ефекти)
  const isInteraction = triggerState === 'hover' || triggerState === 'click';

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
  if (config.effects?.length > 0 || presetId.includes('+')) {
    const effectsArray =
      config.effects?.length > 0
        ? config.effects
        : presetId.split('+').map((eff) => ({ type: eff.trim() }));
    return generateCombinedCSS(effectsArray, config, uniqueId);
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
    iterationCount = 1, // ✅ Підключено з аудиту
    fillMode, // ✅ Підключено з аудиту
    scaleRange = [1, 1], // ✅ Підключено з аудиту
    motionAxis = 'all', // ✅ Підключено з аудиту
  } = config;

  // Додано triggerState в ім'я для уникнення конфліктів CSS
  const animName = `ad_anim_${presetId}_${triggerState}_${uniqueId}`;
  let frames = '';

  switch (presetId) {
    case 'fade': {
      if (isInteraction) {
        // Hover/Click Fade: зміна прозорості від 1 до меншого значення
        const endOpacity = Math.max(0.2, 1 - intensity / 100);
        frames = `0% { opacity: 1; } 100% { opacity: ${endOpacity}; }`;
      } else {
        // Load Fade: класична поява
        const startOpacity = Math.max(0, 1 - intensity / 100);
        frames = `0% { opacity: ${startOpacity}; } 100% { opacity: 1; }`;
      }
      break;
    }
    case 'slide': {
      let translateVal = `translateY(${intensity / 5}px)`; // Менший зсув для інтеракцій
      if (direction === 'left')
        translateVal = `translateX(-${intensity / 5}px)`;
      if (direction === 'right')
        translateVal = `translateX(${intensity / 5}px)`;
      if (direction === 'top' || direction === 'reverse')
        translateVal = `translateY(-${intensity / 5}px)`;

      if (isInteraction) {
        // Hover/Click Slide: зсув з початкової точки
        frames = `0% { transform: translate(0, 0); } 100% { transform: ${translateVal}; }`;
      } else {
        // Load Slide: поява з-за меж
        const loadTranslate = translateVal.replace('/ 5', ''); // Повертаємо великий зсув для load
        frames = `0% { transform: ${loadTranslate}; opacity: 0; } 100% { transform: translate(0, 0); opacity: 1; }`;
      }
      break;
    }
    case 'scale': {
      // ✅ Підключення scaleRange та motionAxis
      const sStart =
        scaleRange[0] !== 1 ? scaleRange[0] : Math.max(0, 1 - intensity / 100);
      const sEnd =
        scaleRange[1] !== 1
          ? scaleRange[1]
          : isInteraction
            ? 1 + intensity / 500
            : 1;

      let scaleFn = 'scale';
      if (motionAxis === 'x') scaleFn = 'scaleX';
      if (motionAxis === 'y') scaleFn = 'scaleY';

      if (isInteraction) {
        frames = `0% { transform: ${scaleFn}(1); } 100% { transform: ${scaleFn}(${sEnd}); }`;
      } else {
        frames = `0% { transform: ${scaleFn}(${sStart}); opacity: 0; } 100% { transform: ${scaleFn}(${sEnd}); opacity: 1; }`;
      }
      break;
    }
    default:
      return { keyframes: '', animationStr: 'none' };
  }

  // ✅ Підключення кастомного fillMode та iterationCount
  const finalFillMode =
    fillMode && fillMode !== 'both'
      ? fillMode
      : isInteraction
        ? 'forwards'
        : 'both';
  const finalIter = iterationCount === 'infinite' ? 'infinite' : iterationCount;

  // Захист від того, що 'direction' в slide використовується для сторін (left, top), що не є валідним CSS animation-direction
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
