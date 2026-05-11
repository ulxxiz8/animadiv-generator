/**
 * Centralized Transform Merge Engine
 * Завжди генерує transform в одному і тому ж порядку: translate -> scale -> rotate -> skew.
 * Це гарантує ідеальну CSS-інтерполяцію при комбінації ефектів.
 */
export const buildCSSFrame = (state) => {
  const {
    x = 0,
    y = 0,
    z = 0,
    scale = 1,
    scaleX = null,
    scaleY = null,
    rotate = 0,
    skewX = 0,
    skewY = 0,
    opacity = null,
    blur = 0,
    brightness = 100,
  } = state;

  // ВАЖЛИВО: Жодних if (x !== 0). CSS потрібна стабільна матриця!
  let transformStr = '';

  // 1. Translate
  if (z !== 0) {
    transformStr += `translate3d(${typeof x === 'number' ? x + 'px' : x}, ${typeof y === 'number' ? y + 'px' : y}, ${typeof z === 'number' ? z + 'px' : z}) `;
  } else {
    transformStr += `translate(${typeof x === 'number' ? x + 'px' : x}, ${typeof y === 'number' ? y + 'px' : y}) `;
  }

  // 2. Scale
  const finalScaleX = scaleX !== null ? scaleX : scale;
  const finalScaleY = scaleY !== null ? scaleY : scale;
  if (finalScaleX === finalScaleY) transformStr += `scale(${finalScaleX}) `;
  else transformStr += `scale(${finalScaleX}, ${finalScaleY}) `;

  // 3. Rotate
  transformStr += `rotate(${rotate}deg) `;

  // 4. Skew
  transformStr += `skew(${skewX}deg, ${skewY}deg) `;

  // 5. Фільтри
  let filterStr = '';
  if (blur !== 0) filterStr += `blur(${blur}px) `;
  if (brightness !== 100) filterStr += `brightness(${brightness}%) `;

  // 6. Фінальний мердж
  let css = '';
  if (transformStr.trim()) css += `transform: ${transformStr.trim()}; `;
  if (filterStr.trim()) css += `filter: ${filterStr.trim()}; `;
  if (opacity !== null) css += `opacity: ${opacity}; `;

  return css.trim();
};

/**
 * Motion Pipeline Compiler
 * Бере normalized motion object і перетворює його на готовий CSS (keyframes або transitions).
 */
export const compileNormalizedMotion = (motionObj, animName, triggerState) => {
  const { start, mid, end, timing } = motionObj;
  const { duration, easing, delay, fillMode, iterationCount, direction } =
    timing;

  // ✅ НОВА ЛОГІКА: Transition-Based Hover
  if (triggerState === 'hover') {
    // Беремо лише фінальний стан (куди елемент має прийти при наведенні)
    const endCSS = buildCSSFrame(end);
    const transitionStr =
      `all ${duration}ms ${easing} ${delay > 0 ? delay + 'ms' : ''}`.trim();

    // Парсимо CSS-рядок у React-об'єкт, щоб система Preview могла легко його "впорснути" в інлайн-стилі
    const transitionStyles = { transition: transitionStr };
    endCSS.split(';').forEach((rule) => {
      const [key, value] = rule.split(':');
      if (key && value) {
        // Перетворюємо kebab-case (напр. box-shadow) у camelCase (boxShadow)
        const camelKey = key
          .trim()
          .replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        transitionStyles[camelKey] = value.trim();
      }
    });

    return {
      keyframes: '', // Вимикаємо keyframes для hover
      animationStr: 'none',
      transitionCSS: `${endCSS}; transition: ${transitionStr};`, // Готовий рядок для експорту в .css файли
      transitionStyles, // Готовий об'єкт для PreviewArea (React inline styles)
    };
  }

  // ✅ ЗБЕРЕЖЕНА ЛОГІКА: Keyframes для Load та Click
  let frames = '';
  if (triggerState === 'click' && mid) {
    frames = `
      0% { ${buildCSSFrame(start)} }
      50% { ${buildCSSFrame(mid)} }
      100% { ${buildCSSFrame(end)} }
    `.trim();
  } else {
    frames = `
      0% { ${buildCSSFrame(start)} }
      100% { ${buildCSSFrame(end)} }
    `.trim();
  }

  const keyframes = `@keyframes ${animName} {\n  ${frames}\n}`;
  const animationStr = `${animName} ${duration}ms ${easing} ${delay}ms ${iterationCount} ${direction} ${fillMode}`;

  return { keyframes, animationStr };
};
