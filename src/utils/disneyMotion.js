// ==========================================
// DISNEY-INSPIRED UI MOTION GENERATOR
// ==========================================
export const generateDisneyCSS = (presetId, config, uniqueId) => {
  const {
    duration = 400,
    delay = 0,
    intensity = 100, // Використовується для Exaggeration
    stagger = 50,
  } = config;

  const containerSelector = `#${uniqueId}`;
  let keyframes = '';
  let animationStr = 'none';
  const animName = `ad_disney_${presetId}_${uniqueId}`;

  // Базовий коефіцієнт перебільшення (Exaggeration)
  // Якщо intensity = 100, коефіцієнт = 1. Якщо 50 -> 0.5 (менш агресивно)
  const exg = intensity / 100;

  switch (presetId) {
    // 1. Squash & Stretch (UI Friendly Bounce / Drop)
    case 'squashStretch': {
      // Під час падіння елемент витягується по Y, при ударі — сплющується по Y
      const stretchY = 1 + 0.1 * exg; // 1.1
      const squashX = 1 - 0.05 * exg; // 0.95

      const squashY = 1 - 0.15 * exg; // 0.85
      const stretchX = 1 + 0.1 * exg; // 1.1

      keyframes = `
        @keyframes ${animName} { 
          0% { opacity: 0; transform: translateY(-40px) scale(${squashX}, ${stretchY}); } 
          60% { opacity: 1; transform: translateY(0) scale(${stretchX}, ${squashY}); } 
          80% { transform: translateY(-6px) scale(0.98, 1.02); } 
          100% { transform: translateY(0) scale(1, 1); } 
        }
      `;
      // Slow In / Slow Out імплементовано через кастомний bezier
      animationStr = `${animName} ${duration}ms cubic-bezier(0.25, 1, 0.5, 1) ${delay}ms both`;
      break;
    }

    // 2. Anticipation (Відтягнення перед рухом)
    case 'anticipateReveal': {
      // Елемент спочатку трохи "провалюється" або йде в протилежний бік
      const pullback = 10 * exg; // Відтяжка в пікселях
      keyframes = `
        @keyframes ${animName} { 
          0% { opacity: 0; transform: translateX(-40px); } 
          40% { opacity: 1; transform: translateX(${pullback}px); } /* Overshoot / Anticipation for settle */
          70% { transform: translateX(-${pullback / 2}px); } 
          100% { transform: translateX(0); } 
        }
      `;
      animationStr = `${animName} ${duration}ms cubic-bezier(0.175, 0.885, 0.32, 1.275) ${delay}ms both`;
      break;
    }

    // 3. Arcs (Рух по дузі замість прямої лінії)
    case 'arcReveal': {
      // У CSS дугу найкраще імітувати, розбиваючи траєкторію на ключові кадри,
      // де X і Y змінюються з різною швидкістю.
      const arcDepth = 20 * exg;
      keyframes = `
        @keyframes ${animName} { 
          0% { opacity: 0; transform: translate(-40px, 40px); } 
          50% { opacity: 1; transform: translate(-10px, -${arcDepth}px); } /* Вершина дуги */
          100% { transform: translate(0, 0); } 
        }
      `;
      animationStr = `${animName} ${duration}ms ease-out ${delay}ms both`;
      break;
    }

    // 4. Secondary Action (Синхронна поява тіні/світіння під час основного руху)
    case 'secondaryAction': {
      keyframes = `
        @keyframes ${animName} { 
          0% { 
            opacity: 0; 
            transform: scale(0.9) translateY(10px); 
            box-shadow: 0 0 0 rgba(0,0,0,0); 
          } 
          100% { 
            opacity: 1; 
            transform: scale(1) translateY(0); 
            box-shadow: 0 ${10 * exg}px ${20 * exg}px rgba(0,0,0,0.15); 
          } 
        }
      `;
      animationStr = `${animName} ${duration}ms cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms both`;
      break;
    }

    // 5. Follow Through & Overlapping Action (Staggered settling)
    case 'followThrough': {
      // Батьківський елемент з'являється, а діти "долітають" з інерцією
      let childRules = '';
      for (let i = 1; i <= 8; i++) {
        // Кожен наступний елемент має більшу амплітуду "пружини", імітуючи хвіст
        childRules += `
          ${containerSelector} > *:nth-child(${i}) {
            animation: ${animName}_child ${duration * 0.8}ms cubic-bezier(0.34, 1.56, 0.64, 1) calc(${delay}ms + (${i} * ${stagger}ms)) both;
          }
        `;
      }

      keyframes = `
        @keyframes ${animName}_parent {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes ${animName}_child {
          0% { opacity: 0; transform: translateX(-15px) rotate(-2deg); }
          100% { opacity: 1; transform: translateX(0) rotate(0deg); }
        }
        ${containerSelector} {
          animation: ${animName}_parent ${duration}ms ease-out ${delay}ms both;
        }
        ${childRules}
      `;
      // Основна анімація задається на батька безпосередньо в правилі вище,
      // тому animationStr залишаємо 'none', щоб уникнути конфліктів у style
      break;
    }

    default:
      break;
  }

  return { keyframes, animationStr };
};
