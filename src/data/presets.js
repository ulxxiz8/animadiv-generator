export const animationPresets = [
  {
    id: 'fade-in',
    name: 'Fade',
    nameKey: 'data.presets.fade',
    supportsIntensity: false,
    // ✅ НОВИЙ КОНТРАКТ: Вказує UI, що тут немає повзунка інтенсивності
    supportedParams: ['duration', 'delay', 'easing'],
    supportedTriggers: ['load', 'hover', 'click'],
    interactionType: 'keyframes',
    motionCategory: 'opacity',
    // Твоя логіка залишилась абсолютно недоторканою:
    keyframes: () => `  from { opacity: 0; }
  to { opacity: 1; }`,
  },
  {
    id: 'slide-up',
    name: 'Slide Up',
    nameKey: 'data.presets.slideUp',
    supportsIntensity: true,
    // ✅ НОВИЙ КОНТРАКТ: Додано 'intensity', бо supportsIntensity === true
    supportedParams: ['duration', 'delay', 'easing', 'intensity'],
    supportedTriggers: ['load', 'hover', 'click'],
    interactionType: 'keyframes',
    motionCategory: 'transform',
    keyframes: (
      params
    ) => `  from { transform: translateY(${params.intensity}px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }`,
  },
  {
    id: 'pop',
    name: 'Pop',
    nameKey: 'data.presets.pop',
    supportsIntensity: true,
    // ✅ НОВИЙ КОНТРАКТ
    supportedParams: ['duration', 'delay', 'easing', 'intensity'],
    supportedTriggers: ['load', 'hover', 'click'],
    interactionType: 'keyframes',
    motionCategory: 'transform',
    keyframes: (params) => {
      const scale = 1 - params.intensity / 100;
      return `  from { transform: scale(${scale}); opacity: 0; }
  to { transform: scale(1); opacity: 1; }`;
    },
  },
  {
    id: 'bounce',
    name: 'Bounce',
    nameKey: 'data.presets.bounce',
    supportsIntensity: false,
    // ✅ НОВИЙ КОНТРАКТ
    supportedParams: ['duration', 'delay', 'easing'],
    supportedTriggers: ['load', 'hover', 'click'],
    interactionType: 'keyframes',
    motionCategory: 'transform',
    keyframes: () => `  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-30px); }
  60% { transform: translateY(-15px); }`,
  },
  {
    id: 'shake',
    name: 'Shake',
    nameKey: 'data.presets.shake',
    supportsIntensity: true,
    // ✅ НОВИЙ КОНТРАКТ
    supportedParams: ['duration', 'delay', 'easing', 'intensity'],
    supportedTriggers: ['load', 'hover', 'click'],
    interactionType: 'keyframes',
    motionCategory: 'transform',
    keyframes: (params) => `  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-${params.intensity / 5}px); }
  75% { transform: translateX(${params.intensity / 5}px); }`,
  },
  {
    id: 'rotate-in',
    name: 'Rotate',
    nameKey: 'data.presets.rotate',
    supportsIntensity: false,
    // ✅ НОВИЙ КОНТРАКТ
    supportedParams: ['duration', 'delay', 'easing'],
    supportedTriggers: ['load', 'hover', 'click'],
    interactionType: 'keyframes',
    motionCategory: 'transform',
    keyframes:
      () => `  from { transform: rotate(-180deg) scale(0); opacity: 0; }
  to { transform: rotate(0) scale(1); opacity: 1; }`,
  },
];

// ✅ ДОДАНА УТИЛІТА: Це запобіжник для UI (щоб не було помилок, якщо пресет 'none')
// ✅ РОЗУМНА УТИЛІТА КОНТРАКТІВ
export const getPresetContract = (presetId) => {
  if (!presetId || presetId === 'none') {
    return {
      supportedParams: [],
      supportedTriggers: ['load', 'hover', 'click'],
      interactionType: 'none',
      motionCategory: 'none',
    };
  }

  // 1. Базовий набір повзунків, який потрібен майже завжди (включаючи повторення та заповнення)
  const baseParams = [
    'duration',
    'delay',
    'easing',
    'iterationCount',
    'fillMode',
    'transformOrigin',
  ];

  // 2. Словник для вбудованих базових ефектів твого рушія
  const coreContracts = {
    fade: [...baseParams, 'intensity'],
    slide: [...baseParams, 'intensity', 'direction'],
    scale: [...baseParams, 'intensity', 'motionAxis', 'scaleRange'],
    physicsScale: [
      'stiffness',
      'damping',
      'mass',
      'motionAxis',
      'scaleRange',
      'intensity',
    ],
    physicsBounce: ['stiffness', 'damping', 'mass', 'direction', 'intensity'],
    // Якщо маєш ще базові ефекти, їх можна додати сюди
  };

  // 3. Шукаємо пресет у твоєму масиві animationPresets
  const preset = animationPresets.find((p) => p.id === presetId);

  // 4. Формуємо фінальний список повзунків
  // Якщо це базовий ефект - беремо з coreContracts. Інакше - з масиву (або базові)
  let params = coreContracts[presetId] || preset?.supportedParams || baseParams;

  // Зворотна сумісність: якщо у твоєму старому пресеті стоїть supportsIntensity: true,
  // ми автоматично вмикаємо повзунок інтенсивності!
  if (preset?.supportsIntensity && !params.includes('intensity')) {
    params = [...params, 'intensity'];
  }

  return {
    supportedParams: params,
    supportedTriggers: preset?.supportedTriggers || ['load', 'hover', 'click'],
    interactionType: preset?.interactionType || 'transition',
    motionCategory: preset?.motionCategory || 'misc',
  };
};
