const colorToRgba = (color = '#111827', opacity = 0.24) => {
  if (String(color).startsWith('rgba(')) return color;
  if (String(color).startsWith('rgb(')) {
    return String(color).replace('rgb(', 'rgba(').replace(')', `, ${opacity})`);
  }

  const hex = String(color).replace('#', '');
  if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(hex)) {
    return `rgba(17, 24, 39, ${opacity})`;
  }

  const normalized =
    hex.length === 3
      ? hex
          .split('')
          .map((char) => char + char)
          .join('')
      : hex;
  const value = parseInt(normalized, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const resolveGlowColor = (config = {}) =>
  colorToRgba(
    config.shadowColor ||
      config.accentColor ||
      config.backgroundColor ||
      config.color ||
      config.borderColor ||
      '#111827',
    Math.min(config.shadowOpacity ?? 0.24, 0.35)
  );

/**
 * ГЕНЕРАТОР CSS (Для складних ефектів з псевдоелементами)
 */
export const generateInteractionCSS = (
  presetId,
  config,
  uniqueId,
  triggerState = 'load'
) => {
  const { duration = 300, rippleColor = 'rgba(255, 255, 255, 0.4)' } = config;

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
  const { intensity = 60, duration = 300 } = config;

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
      styles.boxShadow = `0 0 ${Math.max(6, intensity / 5)}px ${Math.max(
        0,
        intensity / 30
      )}px ${resolveGlowColor(config)}`;
      break;
    case 'magneticHover':
      styles.transform = `translate(${intensity / 12}px, -${intensity / 12}px)`;
      break;
    case 'pressEffect':
      styles.transform = `scale(${Math.max(0.86, 1 - intensity / 600)})`;
      break;
    case 'smoothCheck':
      styles.transform = 'scale(1.04)';
      break;
    case 'bounceCheck':
      styles.transition = `transform ${duration}ms cubic-bezier(0.34, 1.56, 0.64, 1)`;
      styles.transform = 'scale(1.14)';
      break;
    case 'radioPulse':
      styles.transform = 'scale(1.08)';
      styles.boxShadow = `0 0 0 6px ${resolveGlowColor(config)}`;
      break;
    case 'elasticToggle':
      styles.transition = `transform ${duration}ms cubic-bezier(0.68, -0.55, 0.27, 1.55), box-shadow ${duration}ms ease`;
      styles.transform = 'scale(0.92)';
      break;
  }

  return { keyframes: '', animationStr: 'none', transitionStyles: styles };
};
