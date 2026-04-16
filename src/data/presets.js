export const animationPresets = [
  {
    id: 'fade-in',
    name: 'Плавна поява (Fade)',
    supportsIntensity: false,
    keyframes: () => `  from { opacity: 0; }
  to { opacity: 1; }`,
  },
  {
    id: 'slide-up',
    name: 'Виліт (Slide Up)',
    supportsIntensity: true,
    keyframes: (
      params
    ) => `  from { transform: translateY(${params.intensity}px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }`,
  },
  {
    id: 'pop',
    name: 'Поява зі збільшенням (Pop)',
    supportsIntensity: true,
    keyframes: (params) => {
      const scale = 1 - params.intensity / 100;
      return `  from { transform: scale(${scale}); opacity: 0; }
  to { transform: scale(1); opacity: 1; }`;
    },
  },
  {
    id: 'bounce',
    name: 'Стрибок (Bounce)',
    supportsIntensity: false,
    keyframes: () => `  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-30px); }
  60% { transform: translateY(-15px); }`,
  },
  {
    id: 'shake',
    name: 'Трясіння (Shake)',
    supportsIntensity: true,
    keyframes: (params) => `  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-${params.intensity / 5}px); }
  75% { transform: translateX(${params.intensity / 5}px); }`,
  },
  {
    id: 'rotate-in',
    name: 'Поява з обертом (Rotate)',
    supportsIntensity: false,
    keyframes:
      () => `  from { transform: rotate(-180deg) scale(0); opacity: 0; }
  to { transform: rotate(0) scale(1); opacity: 1; }`,
  },
];
