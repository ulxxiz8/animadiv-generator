// ==========================================
// PHYSICS MOTION GENERATOR (Spring, Inertia)
// ==========================================

// Математична функція загасаючих коливань (пружини)
const calculateSpringPosition = (t, stiffness, damping, mass) => {
  // Базова симуляція Damped Harmonic Oscillator
  const angularFreq = Math.sqrt(stiffness / mass);
  const dampingRatio = damping / (2 * Math.sqrt(stiffness * mass));

  if (dampingRatio < 1) {
    // Underdamped (з відскоком / overshoot)
    const dampedFreq = angularFreq * Math.sqrt(1 - dampingRatio * dampingRatio);
    const envelope = Math.exp(-dampingRatio * angularFreq * t);
    return 1 - envelope * Math.cos(dampedFreq * t);
  } else {
    // Critically damped / Overdamped (без відскоку)
    return 1 - Math.exp(-angularFreq * t) * (1 + angularFreq * t);
  }
};

export const generatePhysicsCSS = (presetId, config, uniqueId) => {
  const {
    duration = 800,
    delay = 0,
    stiffness = 100,
    damping = 10,
    mass = 1,
    intensity = 100,
  } = config;

  const animName = `ad_physics_${presetId}_${uniqueId}`;
  let framesStr = '';

  // Генеруємо 20 ключових кадрів для плавності фізики (0% - 100%)
  const frameCount = 20;

  // Допоміжна функція для генерації CSS-кадрів на основі формули
  const generateFrames = (transformCallback) => {
    let frames = '';
    for (let i = 0; i <= frameCount; i++) {
      const progress = i / frameCount; // Від 0 до 1 (час анімації)
      // Щоб симуляція пружини виглядала добре, рахуємо 't' від 0 до ~6 секунд симуляції
      const simulatedTime = progress * 6;
      const position = calculateSpringPosition(
        simulatedTime,
        stiffness,
        damping,
        mass
      );

      frames += `${progress * 100}% { transform: ${transformCallback(position)}; }\n`;
    }
    return frames;
  };

  switch (presetId) {
    case 'physicsScale': {
      // position змінюється від 0 до 1 (з можливим overshoot, напр. 1.1)
      framesStr = generateFrames((pos) => {
        const startScale = Math.max(0, 1 - intensity / 100); // Зазвичай 0
        const currentScale = startScale + (1 - startScale) * pos;
        return `scale(${currentScale})`;
      });
      break;
    }
    case 'physicsBounce': {
      framesStr = generateFrames((pos) => {
        // translateY від -intensity px до 0
        const currentY = -intensity * (1 - pos);
        return `translateY(${currentY}px)`;
      });
      break;
    }
    case 'physicsHover': {
      // Фізичний ховер: легке збільшення масштабу з пружиною
      framesStr = generateFrames((pos) => {
        const targetScale = 1.05;
        const currentScale = 1 + (targetScale - 1) * pos;
        return `scale(${currentScale})`;
      });
      break;
    }
    default:
      return { keyframes: '', animationStr: 'none' };
  }

  const keyframes = `
    @keyframes ${animName} { 
      ${framesStr} 
    }
  `;

  // Зверни увагу: easing тут 'linear', бо вся динаміка (прискорення/сповільнення)
  // вже закладена в самі відсотки ключових кадрів нашою формулою!
  const animationStr = `${animName} ${duration}ms linear ${delay}ms both`;

  return { keyframes, animationStr };
};
