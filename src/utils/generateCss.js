import { generateAnimationCSS } from './animationEngine';

const PX_FIELDS = new Set([
  'width',
  'height',
  'minHeight',
  'borderRadius',
  'borderWidth',
  'fontSize',
  'gap',
  'letterSpacing',
]);

const toKebabCase = (value) =>
  value.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);

const formatStyleValue = (key, value) => {
  if (value === undefined || value === null || value === '') return null;
  if (typeof value === 'number' && PX_FIELDS.has(key)) return `${value}px`;
  return String(value);
};

const colorToRgba = (color = '#111827', opacity = 0.16) => {
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

const getShadowStyle = (settings = {}) => {
  if (!settings.shadowEnabled) return null;

  return `0 ${settings.shadowOffsetY ?? 6}px ${settings.shadowBlur ?? 18}px ${colorToRgba(
    settings.shadowColor,
    settings.shadowOpacity ?? 0.16
  )}`;
};

const styleObjectToCss = (styles = {}, indent = '  ') =>
  Object.entries(styles)
    .map(([key, value]) => {
      const formatted = formatStyleValue(key, value);
      if (formatted === null) return null;
      return `${indent}${toKebabCase(key)}: ${formatted};`;
    })
    .filter(Boolean)
    .join('\n');

const createRule = (selector, styles) => {
  const body =
    typeof styles === 'string' ? styles.trim() : styleObjectToCss(styles || {});
  if (!body) return '';
  return `${selector} {\n${body}\n}`;
};

const uniqueBlocks = (blocks) => [...new Set(blocks.filter(Boolean))];

const getAnimationConfig = (animations = {}, state) => ({
  presetId: 'none',
  ...(animations[state] || {}),
});

const getMotionConfig = (params = {}, state) => {
  const settings = params.specificSettings || {};
  const styles = params.styles || {};

  return {
    ...getAnimationConfig(params.animations || {}, state),
    shadowColor: settings.shadowColor,
    shadowOpacity: settings.shadowOpacity,
    accentColor:
      settings.color ||
      settings.checkColor ||
      styles.backgroundColor ||
      styles.color ||
      styles.borderColor,
    backgroundColor: styles.backgroundColor,
    color: styles.color,
    borderColor: styles.borderColor,
  };
};

const normalizeExportSelectors = (css) =>
  String(css || '')
    .replaceAll('#animadiv-element', '.animadiv-element')
    .replaceAll('.is-hovered', ':hover')
    .replaceAll('.is-clicked', ':active');

const getBaseStyles = (params = {}) => {
  const styles = params.styles || {};
  const settings = params.specificSettings || {};
  const baseStyles = {
    ...styles,
    width: styles.width !== 'auto' ? styles.width : 'auto',
    height: styles.height !== 'auto' ? styles.height : 'auto',
    minHeight: styles.minHeight,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 1,
    visibility: 'visible',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    cursor: 'pointer',
    fontSize: settings.fontSize || 14,
    fontWeight: settings.fontWeight || 600,
  };

  const shadow = getShadowStyle(settings);
  if (shadow) baseStyles.boxShadow = shadow;

  if (params.type === 'block') {
    baseStyles.flexDirection = 'column';
    baseStyles.justifyContent = settings.alignY || 'center';
    baseStyles.alignItems = settings.alignX || 'center';
    baseStyles.gap = settings.gap || 0;
    baseStyles.overflow = settings.overflow || 'visible';
  }

  if (params.type === 'button') {
    baseStyles.whiteSpace = 'pre-wrap';
    baseStyles.textAlign = 'center';
  }

  if (params.type === 'input') {
    baseStyles.fontWeight = settings.fontWeight || 400;
    baseStyles.padding = styles.padding || '0 16px';
    baseStyles.display = 'block';
    baseStyles.whiteSpace = 'nowrap';
    baseStyles.overflow = 'hidden';
    baseStyles.textOverflow = 'ellipsis';
    if (settings.disabled) baseStyles.filter = 'opacity(0.5)';
  }

  if (params.type === 'textarea') {
    const rows = Math.max(Number(settings.rows) || 4, 1);
    const hasManualHeight =
      styles.height !== undefined &&
      styles.height !== null &&
      styles.height !== '' &&
      styles.height !== 'auto' &&
      styles.height !== 100;

    baseStyles.fontWeight = settings.fontWeight || 400;
    baseStyles.padding = styles.padding || '12px 16px';
    baseStyles.resize = settings.resize || 'vertical';
    baseStyles.fontFamily = settings.fontFamily || 'inherit';

    if (!hasManualHeight) {
      delete baseStyles.height;
      baseStyles.minHeight = styles.minHeight || rows * 24 + 24;
    }

    if (settings.disabled) baseStyles.opacity = 0.5;
  }

  if (params.type === 'text') {
    baseStyles.fontSize = settings.fontSize || 24;
    baseStyles.fontWeight = settings.fontWeight || 800;
    baseStyles.fontFamily = settings.fontFamily || 'inherit';
    baseStyles.textAlign = settings.textAlign || 'center';
    baseStyles.lineHeight = settings.lineHeight || 1.5;
    baseStyles.letterSpacing = settings.letterSpacing || 0;
    baseStyles.textTransform = settings.textTransform || 'none';
    baseStyles.whiteSpace = 'pre-wrap';
    baseStyles.backgroundColor = 'transparent';
    baseStyles.border = 'none';
  }

  if (params.type === 'image') {
    baseStyles.objectFit = settings.objectFit || 'cover';
    baseStyles.objectPosition = settings.objectPosition || 'center';
    baseStyles.display = 'block';
    baseStyles.padding = 0;
  }

  if (params.type === 'link') {
    baseStyles.fontWeight = settings.fontWeight || 500;
    baseStyles.fontFamily = settings.fontFamily || 'inherit';
    baseStyles.display = 'inline-flex';
    baseStyles.textDecoration = settings.underline === 'always' ? 'underline' : 'none';
    baseStyles.backgroundColor = 'transparent';
    baseStyles.border = 'none';
  }

  if (params.type === 'checkbox' || params.type === 'radio') {
    baseStyles.alignItems = 'center';
    baseStyles.gap = '12px';
    baseStyles.backgroundColor = 'transparent';
    baseStyles.border = 'none';
    baseStyles.width = 'auto';
    baseStyles.height = 'auto';
  }

  return baseStyles;
};

const getSemanticChildRules = (params = {}) => {
  const settings = params.specificSettings || {};
  const styles = params.styles || {};

  if (params.type !== 'checkbox' && params.type !== 'radio') return [];

  return [
    createRule('.animadiv-element input', {
      width: settings.size || 24,
      height: settings.size || 24,
      accentColor:
        params.type === 'checkbox'
          ? settings.color || '#111827'
          : settings.color || '#4F46E5',
    }),
    createRule('.animadiv-element span', {
      fontSize: settings.fontSize || 14,
      fontWeight: settings.fontWeight || 500,
      color: styles.color,
      fontFamily: settings.fontFamily || 'inherit',
    }),
  ];
};

const getTypeHoverStyles = (params = {}) => {
  const settings = params.specificSettings || {};
  const styles = {};

  if (params.type === 'button') {
    if (settings.hoverBackground) styles.backgroundColor = settings.hoverBackground;
    if (settings.hoverColor) styles.color = settings.hoverColor;
  }

  if (params.type === 'link') {
    if (settings.hoverColor) styles.color = settings.hoverColor;
    if (settings.underline === 'hover') styles.textDecoration = 'underline';
  }

  if (params.type === 'input' || params.type === 'textarea') {
    if (settings.focusBorderColor) {
      styles.borderColor = settings.focusBorderColor;
      styles.boxShadow =
        settings.focusShadow || `0 0 0 3px ${settings.focusBorderColor}33`;
    }
  }

  return styles;
};

const transitionStylesToCss = (transitionStyles) =>
  transitionStyles ? styleObjectToCss(transitionStyles) : '';

const getStateRule = (
  selector,
  motionData,
  extraStyles = {},
  { clearBaseAnimation = false } = {}
) => {
  const animationRule =
    motionData.animationStr && motionData.animationStr !== 'none'
      ? `  animation: ${motionData.animationStr};`
      : clearBaseAnimation
        ? '  animation: none;'
        : '';
  const styles = [
    styleObjectToCss(extraStyles),
    transitionStylesToCss(motionData.transitionStyles),
    animationRule,
  ]
    .filter(Boolean)
    .join('\n');

  return createRule(selector, styles);
};

const getSection = (title, blocks) => {
  const content = uniqueBlocks(blocks).join('\n\n');
  if (!content) return '';
  return `/* ${title} */\n${content}`;
};

export const generateFullCSS = (params = {}) => {
  const loadConfig = getMotionConfig(params, 'load');
  const hoverConfig = getMotionConfig(params, 'hover');
  const clickConfig = getMotionConfig(params, 'click');

  const loadData = generateAnimationCSS(
    loadConfig.presetId,
    loadConfig,
    'animadiv-element',
    'load'
  );
  const hoverData = generateAnimationCSS(
    hoverConfig.presetId,
    hoverConfig,
    'animadiv-element',
    'hover'
  );
  const clickData = generateAnimationCSS(
    clickConfig.presetId,
    clickConfig,
    'animadiv-element',
    'click'
  );

  const baseSection = getSection('Base styles', [
    createRule('.animadiv-element', getBaseStyles(params)),
    ...getSemanticChildRules(params),
  ]);

  const loadSection = getSection('Load animation', [
    loadData.animationStr && loadData.animationStr !== 'none'
      ? createRule('.animadiv-element', {
          animation: loadData.animationStr,
        })
      : '',
  ]);

  const hoverSection = getSection('Hover styles', [
    getStateRule('.animadiv-element:hover', hoverData, getTypeHoverStyles(params), {
      clearBaseAnimation: true,
    }),
  ]);

  const clickSection = getSection('Click styles', [
    getStateRule('.animadiv-element:active', clickData, {}, {
      clearBaseAnimation: true,
    }),
  ]);

  const keyframesSection = getSection(
    'Keyframes',
    [loadData.keyframes, hoverData.keyframes, clickData.keyframes].map(
      normalizeExportSelectors
    )
  );

  return [
    '/* Generated by AnimaDiv */',
    baseSection,
    loadSection,
    hoverSection,
    clickSection,
    keyframesSection,
  ]
    .filter(Boolean)
    .join('\n\n');
};
