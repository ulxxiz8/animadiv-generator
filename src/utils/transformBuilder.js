/**
 * src/utils/transformBuilder.js
 * UNIFIED TRANSFORM ENGINE
 * Збирає розрізнені інструкції у валідний, безконфліктний CSS (Transitions або Keyframes)
 */

const parseVal = (val, unit) =>
  typeof val === 'number' ? `${val}${unit}` : val;

/**
 * 1. CENTRAL FRAME BUILDER
 * Бере об'єкт інструкцій і безпечно мержить їх в один CSS-рядок
 */
export const buildCSSFrame = (frameData) => {
  if (!frameData) return '';

  let transformStr = '';
  let filterStr = '';
  let styleStr = '';

  // --- MERGE TRANSFORMS ---
  const { x, y, z, scale, scaleX, scaleY, rotate, skewX, skewY } = frameData;

  // Translate
  if (x !== undefined || y !== undefined || z !== undefined) {
    const tx = x !== undefined ? parseVal(x, 'px') : '0px';
    const ty = y !== undefined ? parseVal(y, 'px') : '0px';
    const tz = z !== undefined ? parseVal(z, 'px') : '0px';
    transformStr += `translate3d(${tx}, ${ty}, ${tz}) `;
  }

  // Scale (підтримка як загального scale, так і по осях)
  if (scale !== undefined) {
    transformStr += `scale(${scale}) `;
  } else if (scaleX !== undefined || scaleY !== undefined) {
    const sx = scaleX !== undefined ? scaleX : 1;
    const sy = scaleY !== undefined ? scaleY : 1;
    transformStr += `scale3d(${sx}, ${sy}, 1) `;
  }

  // Rotate
  if (rotate !== undefined) {
    transformStr += `rotate(${parseVal(rotate, 'deg')}) `;
  }

  // Skew
  if (skewX !== undefined || skewY !== undefined) {
    const skX = skewX !== undefined ? parseVal(skewX, 'deg') : '0deg';
    const skY = skewY !== undefined ? parseVal(skewY, 'deg') : '0deg';
    transformStr += `skew(${skX}, ${skY}) `;
  }

  // --- MERGE FILTERS ---
  const { blur, brightness, dropShadow } = frameData;
  if (blur !== undefined) filterStr += `blur(${parseVal(blur, 'px')}) `;
  if (brightness !== undefined) filterStr += `brightness(${brightness}) `;
  if (dropShadow !== undefined) filterStr += `drop-shadow(${dropShadow}) `;

  // --- COMPILE FINAL STRING ---
  if (transformStr.trim()) styleStr += `transform: ${transformStr.trim()}; `;
  if (filterStr.trim()) styleStr += `filter: ${filterStr.trim()}; `;

  if (frameData.opacity !== undefined && frameData.opacity !== null) {
    styleStr += `opacity: ${frameData.opacity}; `;
  }
  if (frameData.boxShadow !== undefined) {
    styleStr += `box-shadow: ${frameData.boxShadow}; `;
  }

  return styleStr.trim();
};

/**
 * 2. RUNTIME COMPILER
 * Визначає, куди віддати зібраний CSS: у Hover/Click (Transitions) чи Load (Keyframes)
 */
export const compileNormalizedMotion = (motionObj, animName, triggerState) => {
  const { start, mid, end, timing } = motionObj;
  const {
    duration = 300,
    easing = 'ease',
    delay = 0,
    fillMode = 'both',
    iterationCount = 1,
    direction = 'normal',
  } = timing || {};

  // ==========================================
  // HOVER & CLICK ENGINE (Transitions)
  // ==========================================
  if (triggerState === 'hover' || triggerState === 'click') {
    // Для кліку використовуємо mid (якщо є, напр. ефект вдавлювання), інакше end
    const targetFrame = triggerState === 'click' && mid ? mid : end;
    const rawStyleStr = buildCSSFrame(targetFrame);

    // Створюємо React style об'єкт
    const transitionStyles = {
      transition: `all ${duration}ms ${easing} ${delay > 0 ? delay + 'ms' : ''}`,
      willChange: 'transform, filter, opacity',
    };

    // Парсимо згенерований CSS-рядок у React CamelCase формат
    rawStyleStr.split(';').forEach((rule) => {
      if (!rule.trim()) return;
      const [key, value] = rule.split(':').map((s) => s.trim());
      if (!key || !value) return;

      const camelKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      transitionStyles[camelKey] = value;
    });

    return { keyframes: '', animationStr: 'none', transitionStyles };
  }

  // ==========================================
  // LOAD ENGINE (Keyframes)
  // ==========================================
  let keyframes = `@keyframes ${animName} {\n`;

  keyframes += `  0% { ${buildCSSFrame(start)} }\n`;
  if (mid) {
    keyframes += `  50% { ${buildCSSFrame(mid)} }\n`;
  }
  keyframes += `  100% { ${buildCSSFrame(end)} }\n`;

  keyframes += `}`;

  const animationStr = `${animName} ${duration}ms ${easing} ${delay}ms ${iterationCount} ${direction} ${fillMode}`;

  return { keyframes, animationStr, transitionStyles: null };
};
