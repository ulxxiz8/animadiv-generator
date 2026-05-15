import { generateAnimationCSS } from './animationEngine';

const PX_FIELDS = new Set([
  'width',
  'height',
  'borderRadius',
  'borderWidth',
  'fontSize',
  'gap',
]);

const toKebabCase = (value) =>
  value.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);

const formatStyleValue = (key, value) => {
  if (value === undefined || value === null || value === '') return null;
  if (typeof value === 'number' && PX_FIELDS.has(key)) return `${value}px`;
  return String(value);
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
    if (settings.disabled) baseStyles.filter = 'opacity(0.5)';
  }

  if (params.type === 'textarea') {
    baseStyles.padding = '12px 16px';
    baseStyles.resize = settings.resize || 'both';
    if (settings.disabled) baseStyles.opacity = 0.5;
  }

  if (params.type === 'text') {
    baseStyles.fontSize = settings.fontSize || 24;
    baseStyles.fontWeight = settings.fontWeight || 800;
    baseStyles.textAlign = settings.textAlign || 'center';
    baseStyles.lineHeight = settings.lineHeight || 1.5;
    baseStyles.whiteSpace = 'pre-wrap';
  }

  if (params.type === 'image') {
    baseStyles.objectFit = settings.objectFit || 'cover';
    baseStyles.display = 'block';
    baseStyles.padding = 0;
  }

  if (params.type === 'link') {
    baseStyles.fontWeight = settings.fontWeight || 500;
    baseStyles.display = 'inline-flex';
    baseStyles.textDecoration = settings.underline === 'always' ? 'underline' : 'none';
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
          ? styles.backgroundColor || '#111827'
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
  const animations = params.animations || {};
  const loadConfig = getAnimationConfig(animations, 'load');
  const hoverConfig = getAnimationConfig(animations, 'hover');
  const clickConfig = getAnimationConfig(animations, 'click');

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
