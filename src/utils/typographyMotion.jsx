import React from 'react';

// ==========================================
// 1. TEXT SPLITTING SYSTEM (Без зовнішніх бібліотек)
// ==========================================
export const renderSplitText = (text, presetId) => {
  if (!text) return null;

  // Визначаємо тип розбиття на основі пресету
  const needsLetters = ['fadeByLetter', 'typewriter'].includes(presetId);
  const needsWords = ['fadeByWord', 'blurReveal', 'slideUpReveal'].includes(
    presetId
  );
  const needsLines = ['fadeByLine'].includes(presetId);

  // Якщо ефект не потребує розбиття (напр. underlineDraw), повертаємо сирий текст
  if (!needsLetters && !needsWords && !needsLines) {
    return text;
  }

  if (needsLetters) {
    return text.split('').map((char, i) => (
      <span
        key={i}
        className="ad-char"
        style={{
          '--char-index': i,
          display: 'inline-block',
          whiteSpace: char === ' ' ? 'pre' : 'normal',
        }}
      >
        {char}
      </span>
    ));
  }

  if (needsWords) {
    return text.split(' ').map((word, i) => (
      <span
        key={i}
        className="ad-word"
        style={{
          '--word-index': i,
          display: 'inline-block',
          marginRight: '0.25em',
        }}
      >
        {word}
      </span>
    ));
  }

  if (needsLines) {
    return text.split('\n').map((line, i) => (
      <span
        key={i}
        className="ad-line"
        style={{ '--line-index': i, display: 'block' }}
      >
        {line}
      </span>
    ));
  }
};

// ==========================================
// 2. TYPOGRAPHY CSS GENERATOR
// ==========================================
export const generateTypographyCSS = (presetId, config, uniqueId) => {
  const {
    duration = 500,
    delay = 0,
    easing = 'ease',
    stagger = 50,
    blurAmount = 10,
  } = config;
  const containerSelector = `#${uniqueId}`;

  let keyframes = '';
  let animationStr = 'none';

  switch (presetId) {
    case 'fadeByLetter':
    case 'fadeByWord':
    case 'fadeByLine': {
      const type =
        presetId === 'fadeByLetter'
          ? 'char'
          : presetId === 'fadeByWord'
            ? 'word'
            : 'line';
      keyframes = `
        @keyframes ad_text_fade { 0% { opacity: 0; } 100% { opacity: 1; } }
        ${containerSelector} .ad-${type} {
          opacity: 0;
          animation: ad_text_fade ${duration}ms ${easing} forwards;
          animation-delay: calc(${delay}ms + (var(--${type}-index) * ${stagger}ms));
        }
      `;
      break;
    }
    case 'typewriter': {
      keyframes = `
        @keyframes ad_type { 0% { opacity: 0; } 100% { opacity: 1; } }
        @keyframes ad_blink { 50% { border-color: transparent; } }
        ${containerSelector} {
          border-right: 2px solid currentColor;
          animation: ad_blink 0.75s step-end infinite;
          padding-right: 4px;
        }
        ${containerSelector} .ad-char {
          opacity: 0;
          animation: ad_type 0.1s step-end forwards;
          animation-delay: calc(${delay}ms + (var(--char-index) * ${stagger}ms));
        }
      `;
      break;
    }
    case 'blurReveal': {
      keyframes = `
        @keyframes ad_blur { 0% { opacity: 0; filter: blur(${blurAmount}px); } 100% { opacity: 1; filter: blur(0px); } }
        ${containerSelector} .ad-word {
          opacity: 0;
          animation: ad_blur ${duration}ms ${easing} forwards;
          animation-delay: calc(${delay}ms + (var(--word-index) * ${stagger}ms));
        }
      `;
      break;
    }
    case 'slideUpReveal': {
      keyframes = `
        @keyframes ad_slide_up { 0% { opacity: 0; transform: translateY(100%); } 100% { opacity: 1; transform: translateY(0); } }
        ${containerSelector} { overflow: hidden; display: inline-block; }
        ${containerSelector} .ad-word {
          opacity: 0;
          transform: translateY(100%);
          animation: ad_slide_up ${duration}ms ${easing} forwards;
          animation-delay: calc(${delay}ms + (var(--word-index) * ${stagger}ms));
        }
      `;
      break;
    }
    case 'underlineDraw': {
      keyframes = `
        @keyframes ad_underline { 0% { width: 0; } 100% { width: 100%; } }
        ${containerSelector} { position: relative; display: inline-block; }
        ${containerSelector}::after {
          content: ''; position: absolute; bottom: -2px; left: 0; height: 2px;
          background-color: currentColor; width: 0;
          animation: ad_underline ${duration}ms ${easing} ${delay}ms forwards;
        }
      `;
      break;
    }
    default:
      break;
  }

  // Для текстових пресетів ми анімуємо дочірні елементи або псевдоелементи через глобальні стилі,
  // тому animationStr самого контейнера дорівнює 'none'
  return { keyframes, animationStr };
};
