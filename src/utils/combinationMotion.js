import { buildCSSFrame } from './transformBuilder';
import { getConfigHash } from './animationEngine'; // Підключаємо наш розумний хеш

export const generateCombinedCSS = (
  effectsArray,
  config,
  uniqueId,
  triggerState = 'load'
) => {
  const { duration = 300, delay = 0, easing = 'ease', fillMode } = config;

  // ✅ ВИПРАВЛЕНО: Стабільний хеш замість Math.random
  const hash = getConfigHash(config);
  const animName = `ad_combined_${triggerState}_${uniqueId}_${hash}`;

  // ... (Решта коду залишається без змін)
  // Створюємо порожні математичні стани
  let startState = {
    x: 0,
    y: 0,
    scaleX: 1,
    scaleY: 1,
    rotate: 0,
    opacity: null,
    blur: 0,
  };
  let endState = {
    x: 0,
    y: 0,
    scaleX: 1,
    scaleY: 1,
    rotate: 0,
    opacity: null,
    blur: 0,
  };
  let midState = null;

  // 2. INDIVIDUAL PARAMETERS (Наповнюємо стани)
  effectsArray.forEach((effectObj) => {
    const type = effectObj.type;

    // Пріоритет: Індивідуальні налаштування ефекту -> Загальний Config -> Дефолт
    const intensity =
      effectObj.intensity !== undefined
        ? effectObj.intensity
        : config.intensity || 100;
    const direction = effectObj.direction || config.direction || 'normal';
    const scaleRange = effectObj.scaleRange || config.scaleRange || [1, 1];
    const motionAxis = effectObj.motionAxis || config.motionAxis || 'all';
    const blurAmount =
      effectObj.blurAmount !== undefined
        ? effectObj.blurAmount
        : config.blurAmount || 10;
    const rotationAngle =
      effectObj.rotationAngle !== undefined
        ? effectObj.rotationAngle
        : config.rotationAngle || 15;

    if (type === 'fade') {
      if (triggerState === 'hover') {
        endState.opacity = Math.max(0.2, 1 - intensity / 100);
      } else if (triggerState === 'click') {
        midState = midState || { ...startState };
        midState.opacity = 0.5;
      } else {
        startState.opacity = Math.max(0, 1 - intensity / 100);
        endState.opacity = 1;
      }
    }

    if (type === 'slide') {
      let val = intensity / 5;
      let dx = 0,
        dy = 0;
      if (direction === 'left') dx = -val;
      if (direction === 'right') dx = val;
      if (direction === 'top' || direction === 'reverse') dy = -val;
      if (direction === 'bottom' || direction === 'normal') dy = val;

      if (triggerState === 'hover') {
        endState.x = dx;
        endState.y = dy;
      } else if (triggerState === 'click') {
        midState = midState || { ...startState };
        midState.x = dx * 1.5;
        midState.y = dy * 1.5;
      } else {
        startState.x = dx * 5;
        startState.y = dy * 5;
      }
    }

    if (type === 'scale') {
      const sStart =
        scaleRange[0] !== 1 ? scaleRange[0] : Math.max(0, 1 - intensity / 100);
      const sEnd = scaleRange[1] !== 1 ? scaleRange[1] : 1 + intensity / 500;

      let startX = sStart,
        startY = sStart;
      let endX = sEnd,
        endY = sEnd;

      if (motionAxis === 'x') {
        startY = 1;
        endY = 1;
      }
      if (motionAxis === 'y') {
        startX = 1;
        endX = 1;
      }

      if (triggerState === 'hover') {
        endState.scaleX = endX;
        endState.scaleY = endY;
      } else if (triggerState === 'click') {
        midState = midState || { ...startState };
        const cS = Math.max(0.5, 1 - intensity / 500);
        midState.scaleX = motionAxis === 'y' ? 1 : cS;
        midState.scaleY = motionAxis === 'x' ? 1 : cS;
      } else {
        startState.scaleX = startX;
        startState.scaleY = startY;
      }
    }

    if (type === 'blur') {
      if (triggerState === 'hover') endState.blur = blurAmount;
      else if (triggerState === 'click') {
        midState = midState || { ...startState };
        midState.blur = blurAmount / 2;
      } else startState.blur = blurAmount;
    }

    if (type === 'rotate') {
      if (triggerState === 'hover') endState.rotate = rotationAngle;
      else if (triggerState === 'click') {
        midState = midState || { ...startState };
        midState.rotate = rotationAngle;
      } else startState.rotate = rotationAngle;
    }
  });

  // 3. CENTRALIZED MERGE (Проганяємо об'єднані стани через Transform Builder)
  let frames = '';
  if (triggerState === 'click' && midState) {
    frames = `0% { ${buildCSSFrame(startState)} } \n50% { ${buildCSSFrame(midState)} } \n100% { ${buildCSSFrame(endState)} }`;
  } else {
    frames = `0% { ${buildCSSFrame(startState)} } \n100% { ${buildCSSFrame(endState)} }`;
  }

  const finalFillMode =
    fillMode && fillMode !== 'both'
      ? fillMode
      : triggerState === 'hover'
        ? 'forwards'
        : 'both';
  const keyframes = `@keyframes ${animName} { \n${frames} \n}`;
  const animationStr = `${animName} ${duration}ms ${easing} ${delay}ms ${finalFillMode}`;

  return { keyframes, animationStr };
};
