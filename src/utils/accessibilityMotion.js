// ==========================================
// MOTION ACCESSIBILITY LAYER (Reduced Motion)
// ==========================================

export const applyAccessibilityFilters = (config) => {
  // Якщо режим не активовано, повертаємо оригінальний конфіг без змін
  if (!config.reduceMotion) {
    return config;
  }

  // Створюємо безпечну копію конфігу для модифікацій
  const safeConfig = { ...config };

  // 1. Зменшуємо translate distances (через глобальну інтенсивність)
  // Наприклад, зсув на 100px стає м'яким зсувом на 20px
  safeConfig.intensity = Math.min(safeConfig.intensity, 20);

  // 2. Зменшуємо blur (сильний блюр шкідливий для зорового фокусування)
  if (safeConfig.blurAmount) {
    safeConfig.blurAmount = Math.min(safeConfig.blurAmount, 2); // Максимум 2px
  }

  // 3. Зменшуємо stagger (щоб елементи з'являлися майже одночасно, а не довгою хвилею)
  if (safeConfig.stagger) {
    safeConfig.stagger = Math.min(safeConfig.stagger, 20); // Максимум 20ms затримки між дітьми
  }

  // 4. Вимикаємо aggressive bounce та пружини
  if (safeConfig.usePhysics) {
    // Збільшуємо тертя (damping) та зменшуємо силу (stiffness),
    // щоб пружина зупинялася майже без відскоків
    safeConfig.damping = Math.max(safeConfig.damping, 25);
    safeConfig.stiffness = Math.min(safeConfig.stiffness, 60);
  }

  // 5. Заміна агресивних кривих на м'які (опціонально)
  const aggressiveEasings = [
    'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    'cubic-bezier(0.34, 1.56, 0.64, 1)',
  ];
  if (aggressiveEasings.includes(safeConfig.easing)) {
    safeConfig.easing = 'ease-out'; // Робимо рух просто плавним і передбачуваним
  }

  // 6. Вимкнення нескінченних рухів (наприклад, floatingImage)
  if (safeConfig.iterationCount === 'infinite') {
    safeConfig.iterationCount = 1; // Відіграє один раз і зупиниться
  }

  return safeConfig;
};
