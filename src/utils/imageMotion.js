import { compileNormalizedMotion } from './transformBuilder';
import { getConfigHash } from './animationEngine';

export const generateImageCSS = (presetId, config, uniqueId) => {
  const {
    duration = 500,
    delay = 0,
    easing = 'ease',
    zoomIntensity = 50,
    floatingAmount = 10,
  } = config;

  // Базовий каркас інструкцій для нового рушія
  let motionObj = {
    start: {},
    mid: null,
    end: {},
    timing: { duration, delay, easing, fillMode: 'both', iterationCount: 1 },
  };

  const hash = getConfigHash(config);
  const animName = `ad_img_${presetId}_load_${uniqueId}_${hash}`;

  switch (presetId) {
    case 'zoomReveal': {
      // zoomIntensity: 50 -> 1.5x scale (Твоя оригінальна математика)
      const startScale = 1 + zoomIntensity / 100;
      motionObj.start = { opacity: 0, scale: startScale };
      motionObj.end = { opacity: 1, scale: 1 };
      break;
    }

    case 'kenBurns': {
      // Ken Burns — це дуже повільний зум із легким зсувом
      const endScale = 1 + zoomIntensity / 200; // max ~1.25x
      motionObj.start = { scale: 1, x: '0%', y: '0%' };
      motionObj.end = { scale: endScale, x: '-2%', y: '-2%' };
      // duration * 10 для ефекту кінематографічної повільності
      motionObj.timing.duration = duration * 10;
      motionObj.timing.easing = 'linear';
      break;
    }

    case 'floatingImage': {
      // Infinite translateY
      motionObj.start = { y: 0 };
      motionObj.mid = { y: -floatingAmount };
      motionObj.end = { y: 0 };
      motionObj.timing.duration = duration * 2;
      motionObj.timing.easing = 'ease-in-out';
      motionObj.timing.iterationCount = 'infinite';
      break;
    }

    case 'hoverBrightness':
    case 'hoverBlur':
    case 'tiltHover':
    case 'parallaxHover': {
      // Оскільки ці ефекти розраховані на HOVER (а цей файл генерує LOAD),
      // при завантаженні сторінки ми даємо їм просто плавний fade-in.
      // Самі ефекти нахилу та блюру відпрацюють при наведенні мишки (через animationEngine).
      motionObj.start = { opacity: 0 };
      motionObj.end = { opacity: 1 };
      break;
    }

    default:
      return { keyframes: '', animationStr: 'none' };
  }

  // Віддаємо чисті інструкції в центральний рушій!
  return compileNormalizedMotion(motionObj, animName, 'load');
};
