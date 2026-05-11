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
 * Бере normalized motion object і перетворює його на готовий CSS через buildCSSFrame.
 */
export const compileNormalizedMotion = (motionObj, animName, triggerState) => {
  const { start, mid, end, timing } = motionObj;
  const { duration, easing, delay, fillMode, iterationCount, direction } =
    timing;

  let frames = '';
  // Якщо є mid (для кліку), будуємо 3 кадри, інакше 2.
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
