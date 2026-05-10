import React from 'react';

// Розумний хеш для кешування CSS, щоб уникнути дублікатів та ререндерів
const getHash = (config) => {
  const str = JSON.stringify(config || {});
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
};

export const generateTypographyCSS = (
  presetId,
  config,
  uniqueId,
  triggerState = 'load'
) => {
  const {
    duration = 800,
    delay = 0,
    easing = 'ease-out',
    intensity = 100,
  } = config;
  const hash = getHash(config);
  const animName = `ad_typo_${presetId}_${hash}`;

  let frames = '';
  let targetSelector = '';
  let delayCalc = '';
  let isOpacityReveal = false;

  // 1. Оптимізована генерація Keyframes
  switch (presetId) {
    case 'fadeByLetter':
      frames = `0% { opacity: 0; transform: translateY(${intensity / 5}px); } 100% { opacity: 1; transform: translateY(0); }`;
      targetSelector = '.anim-char';
      delayCalc = `calc(var(--char-index) * ${Math.max(10, 50 - intensity / 2)}ms)`;
      isOpacityReveal = true;
      break;
    case 'typewriter':
      frames = `0% { opacity: 0; } 100% { opacity: 1; }`;
      targetSelector = '.anim-char';
      delayCalc = `calc(var(--char-index) * ${Math.max(10, 80 - intensity / 2)}ms)`;
      isOpacityReveal = true;
      break;
    case 'fadeByWord':
      frames = `0% { opacity: 0; transform: translateY(${intensity / 5}px); } 100% { opacity: 1; transform: translateY(0); }`;
      targetSelector = '.anim-inner';
      delayCalc = `calc(var(--word-index) * ${Math.max(20, 100 - intensity)}ms)`;
      isOpacityReveal = true;
      break;
    case 'blurReveal':
      frames = `0% { opacity: 0; filter: blur(${intensity / 10}px); transform: scale(0.9); } 100% { opacity: 1; filter: blur(0px); transform: scale(1); }`;
      targetSelector = '.anim-inner';
      delayCalc = `calc(var(--word-index) * ${Math.max(20, 100 - intensity)}ms)`;
      isOpacityReveal = true;
      break;
    case 'slideUpReveal':
      frames = `0% { transform: translateY(100%); } 100% { transform: translateY(0); }`;
      targetSelector = '.anim-inner';
      delayCalc = `calc(var(--line-index) * 100ms)`;
      break;
    case 'fadeByLine':
      frames = `0% { opacity: 0; transform: translateY(${intensity / 5}px); } 100% { opacity: 1; transform: translateY(0); }`;
      targetSelector = '.anim-inner';
      delayCalc = `calc(var(--line-index) * 150ms)`;
      isOpacityReveal = true;
      break;
    case 'underlineDraw':
      frames = `0% { background-size: 0% 2px; } 100% { background-size: 100% 2px; }`;
      targetSelector = '.anim-inner';
      delayCalc = `calc(var(--word-index) * 50ms)`;
      break;
    default:
      return { keyframes: '', animationStr: 'none' };
  }

  // 2. Ізоляція тригерів (щоб hover працював тільки при наведенні)
  let parentSelector = `#${uniqueId}`;
  if (triggerState === 'hover') parentSelector = `#${uniqueId}:hover`;
  if (triggerState === 'click') parentSelector = `#${uniqueId}:active`;

  // Захист від блимання (flash) при завантаженні
  let baseOpacityRule = '';
  if (triggerState === 'load' && isOpacityReveal) {
    baseOpacityRule = 'opacity: 0;';
  }

  // Специфічне правило для ліній, щоб не ламало layout
  let underlineRule = '';
  if (presetId === 'underlineDraw') {
    underlineRule = `
      background-image: linear-gradient(currentColor, currentColor);
      background-repeat: no-repeat;
      background-position: bottom left;
      background-size: 0% 2px;
    `;
  }

  // 3. Збірка фінального CSS з використанням CSS-змінних
  const keyframesCSS = `
    @keyframes ${animName} { ${frames} }
    
    #${uniqueId} .anim-word, #${uniqueId} .anim-line {
       overflow: ${presetId === 'slideUpReveal' ? 'hidden' : 'visible'};
    }

    #${uniqueId} ${targetSelector} {
       ${baseOpacityRule}
       ${underlineRule}
    }
    
    ${parentSelector} ${targetSelector} {
       animation: ${animName} ${duration}ms ${easing} forwards;
       animation-delay: calc(${delay}ms + ${delayCalc});
    }
  `;

  // Повертаємо 'none' для батьківського блоку, оскільки ми анімуємо його дітей (спани)
  return { keyframes: keyframesCSS, animationStr: 'none' };
};

export const renderSplitText = (text, preset) => {
  if (!text) return null;

  // 1. Safeguards: Захист від лагів при масивному тексті
  const SAFE_LETTER_LIMIT = 80;
  let mode = 'none';

  if (['fadeByLine', 'slideUpReveal'].includes(preset)) mode = 'line';
  else if (['fadeByWord', 'blurReveal', 'underlineDraw'].includes(preset))
    mode = 'word';
  else if (['fadeByLetter', 'typewriter'].includes(preset)) {
    // Fallback: якщо тексту багато, розбиваємо по словах, а не літерах
    mode = text.length > SAFE_LETTER_LIMIT ? 'word' : 'letter';
  }

  if (mode === 'none') return <>{text}</>;

  // 2. Безпечний рендер ліній
  if (mode === 'line') {
    const lines = text.split('\n');
    return lines.map((line, i) => (
      <span
        key={i}
        className="anim-line"
        style={{ display: 'block', '--line-index': i }}
      >
        <span className="anim-inner" style={{ display: 'block' }}>
          {line || '\u00A0'}
        </span>
      </span>
    ));
  }

  // 3. Безпечний рендер слів (із збереженням пробілів)
  if (mode === 'word') {
    // Розбиваємо, але залишаємо пробіли окремими елементами
    const words = text.split(/(\s+)/);
    let wordCount = 0;

    return words.map((word, i) => {
      if (word.trim() === '') {
        return (
          <span key={i} style={{ whiteSpace: 'pre' }}>
            {word}
          </span>
        );
      }
      const currentIndex = wordCount++;
      return (
        <span
          key={i}
          className="anim-word"
          style={{ display: 'inline-block', verticalAlign: 'bottom' }}
        >
          <span
            className="anim-inner"
            style={{ display: 'inline-block', '--word-index': currentIndex }}
          >
            {word}
          </span>
        </span>
      );
    });
  }

  // 4. Безпечний рендер літер
  if (mode === 'letter') {
    const words = text.split(/(\s+)/);
    let charCount = 0;

    return words.map((word, i) => {
      if (word.trim() === '') {
        return (
          <span key={i} style={{ whiteSpace: 'pre' }}>
            {word}
          </span>
        );
      }
      return (
        <span
          key={i}
          className="anim-word"
          style={{
            display: 'inline-block',
            whiteSpace: 'nowrap',
            verticalAlign: 'bottom',
          }}
        >
          {word.split('').map((char, j) => {
            const currentIndex = charCount++;
            return (
              <span
                key={j}
                className="anim-char"
                style={{
                  display: 'inline-block',
                  '--char-index': currentIndex,
                }}
              >
                {char}
              </span>
            );
          })}
        </span>
      );
    });
  }
};
