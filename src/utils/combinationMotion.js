// ==========================================
// ANIMATION COMBINATION GENERATOR
// ==========================================
export const generateCombinedCSS = (effects, config, uniqueId) => {
  const {
    duration = 300,
    delay = 0,
    easing = 'ease',
    intensity = 100,
  } = config;

  let startTransform = [];
  let endTransform = [];
  let startOpacity = '';
  let endOpacity = '';
  let startFilter = [];
  let endFilter = [];

  // Проходимо по кожному ефекту і збираємо "шматочки" CSS
  effects.forEach((eff) => {
    switch (eff.type) {
      case 'fade':
        startOpacity = `opacity: ${Math.max(0, 1 - intensity / 100)};`;
        endOpacity = `opacity: 1;`;
        break;

      case 'slide':
        const dir = eff.direction || config.direction || 'normal';
        let translateVal = `translateY(${intensity}px)`;
        if (dir === 'left') translateVal = `translateX(-${intensity}px)`;
        if (dir === 'right') translateVal = `translateX(${intensity}px)`;
        if (dir === 'top') translateVal = `translateY(-${intensity}px)`;

        startTransform.push(translateVal);
        // Завжди повертаємо в початкову точку
        endTransform.push(`translate(0, 0)`);
        break;

      case 'scale':
        const startScale = Math.max(0, 1 - intensity / 100);
        startTransform.push(`scale(${startScale})`);
        endTransform.push(`scale(1)`);
        break;

      case 'rotate':
        const angle = config.rotationAngle || 90;
        startTransform.push(`rotate(${angle}deg)`);
        endTransform.push(`rotate(0deg)`);
        break;

      case 'blur':
        const blurVal = config.blurAmount || 10;
        startFilter.push(`blur(${blurVal}px)`);
        endFilter.push(`blur(0px)`);
        break;
    }
  });

  // Склеюємо масиви в єдині CSS рядки (щоб уникнути конфлікту transform)
  const transformStartStr = startTransform.length
    ? `transform: ${startTransform.join(' ')};`
    : '';
  const transformEndStr = endTransform.length
    ? `transform: ${endTransform.join(' ')};`
    : '';
  const filterStartStr = startFilter.length
    ? `filter: ${startFilter.join(' ')};`
    : '';
  const filterEndStr = endFilter.length
    ? `filter: ${endFilter.join(' ')};`
    : '';

  // Генеруємо унікальне ім'я для комбінації
  const animName = `ad_combo_${uniqueId}_${Date.now()}`;

  const keyframes = `
    @keyframes ${animName} { 
      0% { ${startOpacity} ${transformStartStr} ${filterStartStr} } 
      100% { ${endOpacity} ${transformEndStr} ${filterEndStr} } 
    }
  `;

  const animationStr = `${animName} ${duration}ms ${easing} ${delay}ms both`;

  return { keyframes, animationStr };
};
