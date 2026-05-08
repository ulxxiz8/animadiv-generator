// ==========================================
// INTERACTION MOTION GENERATOR (Buttons, Checkbox, Radio)
// ==========================================
export const generateInteractionCSS = (presetId, config, uniqueId) => {
  const {
    duration = 300,
    delay = 0,
    easing = 'ease',
    intensity = 100,
    // Нові параметри (можна додати у конфіг)
    glowColor = 'rgba(79, 70, 229, 0.6)',
    rippleColor = 'rgba(255, 255, 255, 0.4)',
  } = config;

  const containerSelector = `#${uniqueId}`;
  let keyframes = '';
  let animationStr = 'none';
  const animName = `ad_interact_${presetId}_${uniqueId}`;

  switch (presetId) {
    // --- BUTTON EFFECTS ---
    case 'pressEffect': {
      // Squash & Stretch: елемент сплющується по Y і розтягується по X
      const squashY = Math.max(0.8, 1 - intensity / 500); // Напр., 0.8
      const stretchX = Math.min(1.2, 1 + intensity / 500); // Напр., 1.2
      keyframes = `
        @keyframes ${animName} { 
          0% { transform: scale(1, 1); } 
          40% { transform: scale(${stretchX}, ${squashY}); } 
          100% { transform: scale(1, 1); } 
        }
      `;
      animationStr = `${animName} ${duration}ms cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms both`;
      break;
    }
    case 'ripple': {
      // CSS-only ripple (по центру). Для click-position ripple потрібен JS event listener.
      keyframes = `
        @keyframes ${animName}_ripple { 
          0% { transform: translate(-50%, -50%) scale(0); opacity: 1; } 
          100% { transform: translate(-50%, -50%) scale(2.5); opacity: 0; } 
        }
        ${containerSelector} { position: relative; overflow: hidden; }
        ${containerSelector}::after {
          content: ''; position: absolute; top: 50%; left: 50%;
          width: 100%; height: 100%; padding-bottom: 100%;
          background-color: ${rippleColor}; border-radius: 50%;
          transform: translate(-50%, -50%) scale(0);
          animation: ${animName}_ripple ${duration}ms ${easing} ${delay}ms both;
          pointer-events: none;
        }
      `;
      break;
    }
    case 'glowHover': {
      keyframes = `
        @keyframes ${animName} { 
          0% { box-shadow: 0 0 0px 0px transparent; } 
          100% { box-shadow: 0 0 ${intensity / 5}px ${intensity / 10}px ${glowColor}; } 
        }
      `;
      animationStr = `${animName} ${duration}ms ${easing} ${delay}ms forwards`;
      break;
    }
    case 'magneticHover': {
      // Імітація magnetic hover через CSS (легкий зсув)
      keyframes = `
        @keyframes ${animName} { 
          0% { transform: translate(0, 0); } 
          100% { transform: translate(${intensity / 20}px, -${intensity / 20}px); } 
        }
      `;
      animationStr = `${animName} ${duration}ms ease-out ${delay}ms forwards`;
      break;
    }
    case 'borderDraw': {
      keyframes = `
        @keyframes ${animName}_border { 
          0% { clip-path: inset(0 100% 0 0); } 
          100% { clip-path: inset(0 0 0 0); } 
        }
        ${containerSelector} { position: relative; }
        ${containerSelector}::before {
          content: ''; position: absolute; inset: 0;
          border: 2px solid currentColor; border-radius: inherit;
          clip-path: inset(0 100% 0 0);
          animation: ${animName}_border ${duration}ms ${easing} ${delay}ms forwards;
          pointer-events: none;
        }
      `;
      break;
    }

    // --- CHECKBOX / RADIO EFFECTS ---
    case 'bounceCheck': {
      // Анімуємо дочірню SVG-галочку (або крапку радіо) з ефектом "пружини"
      keyframes = `
        @keyframes ${animName}_bounce { 
          0% { transform: scale(0); } 
          50% { transform: scale(1.2); } 
          100% { transform: scale(1); } 
        }
        ${containerSelector} svg, ${containerSelector} div > div {
          animation: ${animName}_bounce ${duration}ms cubic-bezier(0.175, 0.885, 0.32, 1.275) ${delay}ms both;
        }
      `;
      break;
    }
    case 'smoothCheck': {
      keyframes = `
        @keyframes ${animName}_smooth { 
          0% { opacity: 0; transform: scale(0.5); } 
          100% { opacity: 1; transform: scale(1); } 
        }
        ${containerSelector} svg, ${containerSelector} div > div {
          animation: ${animName}_smooth ${duration}ms ease-in-out ${delay}ms both;
        }
      `;
      break;
    }
    case 'radioPulse': {
      keyframes = `
        @keyframes ${animName}_pulse { 
          0% { box-shadow: 0 0 0 0 ${glowColor}; } 
          100% { box-shadow: 0 0 0 ${intensity / 5}px transparent; } 
        }
        ${containerSelector} > div {
          animation: ${animName}_pulse ${duration}ms ease-out ${delay}ms infinite;
        }
      `;
      break;
    }
    case 'elasticToggle': {
      // Контейнер чекбокса "стискається" при кліку
      const squashAmount = Math.max(0.5, 1 - intensity / 200);
      keyframes = `
        @keyframes ${animName}_elastic { 
          0% { transform: scale(1); } 
          50% { transform: scale(${squashAmount}); } 
          100% { transform: scale(1); } 
        }
        ${containerSelector} > div:first-child {
          animation: ${animName}_elastic ${duration}ms cubic-bezier(0.68, -0.55, 0.265, 1.55) ${delay}ms both;
        }
      `;
      break;
    }
    default:
      break;
  }

  return { keyframes, animationStr };
};
