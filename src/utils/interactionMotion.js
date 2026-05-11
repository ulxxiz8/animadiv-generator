/**
 * ГЕНЕРАТОР CSS (Для складних ефектів з псевдоелементами)
 */
export const generateInteractionCSS = (
  presetId,
  config,
  uniqueId,
  triggerState = 'load'
) => {
  const {
    duration = 300,
    intensity = 100,
    glowColor = 'rgba(214, 248, 84, 0.6)',
    rippleColor = 'rgba(255, 255, 255, 0.4)',
  } = config;

  const id = `#${uniqueId}`;
  const anim = `anim_${presetId}_${uniqueId}_${triggerState}`;
  const active =
    triggerState === 'hover'
      ? `${id}.is-hovered`
      : triggerState === 'click'
        ? `${id}.is-clicked`
        : id;

  // 🛡️ БАЗОВИЙ ЗАХИСТ: Щоб нічого не зникало
  let css = `${id} { opacity: 1 !important; visibility: visible !important; position: relative !important; }`;

  switch (presetId) {
    case 'ripple':
      css += `
        @keyframes ${anim}_r { 0% { transform: translate(-50%,-50%) scale(0); opacity: 1; } 100% { transform: translate(-50%,-50%) scale(2.5); opacity: 0; } }
        ${id} { overflow: hidden !important; }
        ${id}::after { 
          content: ''; position: absolute; top: 50%; left: 50%; width: 100%; height: 100%; 
          background: ${rippleColor}; border-radius: 50%; z-index: 0; pointer-events: none;
          transform: translate(-50%,-50%) scale(0); opacity: 0; 
        }
        ${active}::after { animation: ${anim}_r ${duration}ms ease-out forwards; }
      `;
      break;

    case 'borderDraw':
      css += `
        @keyframes ${anim}_b { 0% { clip-path: inset(0 100% 0 0); } 100% { clip-path: inset(0 0 0 0); } }
        ${id}::before { 
          content: ''; position: absolute; inset: 0; border: 2px solid currentColor; 
          border-radius: inherit; pointer-events: none; z-index: 10; opacity: 0; 
        }
        ${active}::before { opacity: 1; animation: ${anim}_b ${duration}ms ease forwards; }
      `;
      break;

    default:
      break;
  }

  return { keyframes: css, animationStr: 'none', transitionStyles: null };
};

/**
 * ГЕНЕРАТОР STYLES (Для миттєвих ефектів без ризику зникнення)
 */
export const generateInteractionStyles = (presetId, config) => {
  const {
    intensity = 100,
    glowColor = 'rgba(214, 248, 84, 0.6)',
    duration = 300,
  } = config;

  const styles = {
    transition: `transform ${duration}ms cubic-bezier(0.34, 1.56, 0.64, 1), 
                 box-shadow ${duration}ms ease, 
                 filter ${duration}ms ease`,
    transform: 'scale(1) translate(0,0)',
    opacity: 1,
    visibility: 'visible',
  };

  switch (presetId) {
    case 'glowHover':
      styles.boxShadow = `0 0 ${intensity / 2}px ${intensity / 4}px ${glowColor}`;
      break;
    case 'magneticHover':
      styles.transform = `translate(${intensity / 10}px, -${intensity / 10}px)`;
      break;
    case 'pressEffect':
      styles.transform = `scale(${1 - intensity / 500})`;
      break;
  }

  return { keyframes: '', animationStr: 'none', transitionStyles: styles };
};
