// ==========================================
// MOTION PRESET TOKENS SYSTEM
// ==========================================

export const MOTION_TOKENS = {
  custom: {
    name: 'Custom (Ручне налаштування)',
  },
  snappy: {
    name: 'Snappy (Різкий та швидкий)',
    duration: 200,
    easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)', // Швидкий старт, різка зупинка
    intensity: 120,
    blurAmount: 0,
    stagger: 30,
  },
  smooth: {
    name: "Smooth (Плавний та м'який)",
    duration: 600,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)', // Класичний плавний рух
    intensity: 100,
    blurAmount: 5,
    stagger: 100,
  },
  cinematic: {
    name: 'Cinematic (Кінематографічний)',
    duration: 1200,
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', // Повільно, епічно, з розмахом
    intensity: 150,
    blurAmount: 15,
    stagger: 200,
  },
  playful: {
    name: 'Playful (Грайливий)',
    duration: 500,
    easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)', // Bouncy (імітація пружини через криву)
    intensity: 80,
    blurAmount: 0,
    stagger: 60,
  },
  subtle: {
    name: 'Subtle (Непомітний/Акуратний)',
    duration: 400,
    easing: 'ease-out',
    intensity: 30, // Дуже мінімальний рух
    blurAmount: 2,
    stagger: 40,
  },
};

/**
 * Функція-утиліта, яка накладає параметри токена на поточний конфіг.
 * Викликатиметься з UI, коли користувач обирає токен.
 */
export const applyMotionToken = (currentConfig, tokenId) => {
  if (!tokenId || tokenId === 'custom' || !MOTION_TOKENS[tokenId]) {
    return { ...currentConfig, motionToken: 'custom' };
  }

  const tokenParams = MOTION_TOKENS[tokenId];

  // Повертаємо оновлений конфіг.
  // Всі інші параметри (direction, presetId тощо) залишаються недоторканими!
  return {
    ...currentConfig,
    motionToken: tokenId,
    duration: tokenParams.duration,
    easing: tokenParams.easing,
    intensity: tokenParams.intensity,
    blurAmount: tokenParams.blurAmount,
    stagger: tokenParams.stagger,
  };
};
