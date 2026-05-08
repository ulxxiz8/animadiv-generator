// ==========================================
// LAYOUT & FORM MOTION GENERATOR
// (Inputs, Textareas, Containers)
// ==========================================
export const generateLayoutFormCSS = (presetId, config, uniqueId) => {
  const {
    duration = 300,
    delay = 0,
    easing = 'ease',
    stagger = 100,
    floatingAmount = 15,
    glowColor = 'rgba(79, 70, 229, 0.4)',
    errorColor = 'rgba(239, 68, 68, 0.8)', // Червоний для помилок
  } = config;

  const containerSelector = `#${uniqueId}`;
  let keyframes = '';
  let animationStr = 'none';
  const animName = `ad_lf_${presetId}_${uniqueId}`;

  switch (presetId) {
    // --- INPUT / TEXTAREA EFFECTS ---
    case 'errorShake': {
      // Короткий, неагресивний горизонтальний шейк
      keyframes = `
        @keyframes ${animName} { 
          0%, 100% { transform: translateX(0); border-color: inherit; } 
          20%, 60% { transform: translateX(-4px); border-color: ${errorColor}; } 
          40%, 80% { transform: translateX(4px); border-color: ${errorColor}; } 
        }
      `;
      animationStr = `${animName} 400ms ease-in-out ${delay}ms both`;
      break;
    }
    case 'focusGlow': {
      // М'яке пульсування світіння
      keyframes = `
        @keyframes ${animName} { 
          0% { box-shadow: 0 0 0 0 transparent; } 
          100% { box-shadow: 0 0 0 4px ${glowColor}; } 
        }
      `;
      animationStr = `${animName} ${duration}ms ${easing} ${delay}ms forwards`;
      break;
    }
    case 'borderSlide': {
      // Імітація промальовування рамки знизу через inset box-shadow
      keyframes = `
        @keyframes ${animName} { 
          0% { box-shadow: inset 0 -1px 0 0 transparent; } 
          100% { box-shadow: inset 0 -2px 0 0 currentColor; } 
        }
      `;
      animationStr = `${animName} ${duration}ms ${easing} ${delay}ms forwards`;
      break;
    }
    case 'placeholderFade': {
      // Плейсхолдер м'яко вицвітає і зсувається вгору
      keyframes = `
        @keyframes ${animName}_ph { 
          0% { opacity: 1; transform: translateY(0); } 
          100% { opacity: 0; transform: translateY(-5px); } 
        }
        ${containerSelector}::placeholder {
          animation: ${animName}_ph ${duration}ms ${easing} ${delay}ms forwards;
        }
      `;
      break;
    }
    case 'floatingLabel': {
      // Оскільки у нас немає окремого тегу <label> в генераторі для інпутів,
      // ми імітуємо "звільнення простору" для нього через зміну padding.
      keyframes = `
        @keyframes ${animName} { 
          0% { padding-top: 16px; font-size: 14px; } 
          100% { padding-top: 24px; font-size: 14px; } 
        }
      `;
      animationStr = `${animName} ${duration}ms ${easing} ${delay}ms forwards`;
      break;
    }

    // --- CONTAINER / BLOCK EFFECTS ---
    case 'staggerReveal': {
      // Динамічно створюємо затримки для перших 10 дочірніх елементів (без JS!)
      let childRules = '';
      for (let i = 1; i <= 10; i++) {
        childRules += `
          ${containerSelector} > *:nth-child(${i}) {
            animation-delay: calc(${delay}ms + (${i - 1} * ${stagger}ms));
          }
        `;
      }
      keyframes = `
        @keyframes ${animName}_child { 
          0% { opacity: 0; transform: translateY(20px); } 
          100% { opacity: 1; transform: translateY(0); } 
        }
        ${containerSelector} > * {
          opacity: 0;
          animation: ${animName}_child ${duration}ms ${easing} forwards;
        }
        ${childRules}
      `;
      break;
    }
    case 'expandCollapse': {
      // Анімація розкриття блоку з точки зору Y-осі
      keyframes = `
        @keyframes ${animName} { 
          0% { opacity: 0; transform: scaleY(0); } 
          100% { opacity: 1; transform: scaleY(1); } 
        }
        ${containerSelector} { transform-origin: top; }
      `;
      animationStr = `${animName} ${duration}ms cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms both`;
      break;
    }
    case 'floatingSection': {
      keyframes = `
        @keyframes ${animName} { 
          0%, 100% { transform: translateY(0); } 
          50% { transform: translateY(-${floatingAmount}px); } 
        }
      `;
      animationStr = `${animName} ${duration * 2}ms ease-in-out ${delay}ms infinite`;
      break;
    }
    case 'scrollReveal': {
      // Анімація, яка зазвичай тригериться Intersection Observer'ом.
      // Тут ми просто даємо їй ідеальну кінематографічну криву.
      keyframes = `
        @keyframes ${animName} { 
          0% { opacity: 0; transform: translateY(40px) scale(0.98); } 
          100% { opacity: 1; transform: translateY(0) scale(1); } 
        }
      `;
      animationStr = `${animName} ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms both`;
      break;
    }
    default:
      break;
  }

  return { keyframes, animationStr };
};
