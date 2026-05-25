import { generateAnimationCSS } from './animationEngine';
import { sanitizeAnimationsForType } from './semanticMapping';
import {
  getBaseTransform,
  getBoxShadow,
  getResolvedBackground,
} from './motionSystem';

const PX_FIELDS = new Set([
  'width',
  'height',
  'minHeight',
  'borderRadius',
  'borderWidth',
  'fontSize',
  'gap',
  'letterSpacing',
  'margin',
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

const encodeSvgColor = (color = '#FFFFFF') =>
  String(color).replace('#', '%23').replace(/\s/g, '');

const getCheckboxCheckSvg = (color = '#FFFFFF') =>
  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M3.5 8.4 6.6 11.5 12.8 4.5' fill='none' stroke='${encodeSvgColor(color)}' stroke-width='2.3' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`;

const getAnimationConfig = (animations = {}, state) => ({
  presetId: 'none',
  ...(animations[state] || {}),
});

const getMotionConfig = (params = {}, state) => {
  const settings = params.specificSettings || {};
  const styles = params.styles || {};
  const stateConfig = getAnimationConfig(params.animations || {}, state);

  return {
    ...stateConfig,
    shadowColor: settings.shadowColor,
    shadowOpacity: settings.shadowOpacity,
    shadowOffsetX: settings.shadowOffsetX,
    shadowOffsetY: settings.shadowOffsetY,
    shadowBlur: settings.shadowBlur,
    shadowSpread: settings.shadowSpread,
    shadowEnabled: settings.shadowEnabled,
    hoverBackgroundColor:
      settings.hoverBackground || stateConfig.hoverBackgroundColor,
    hoverBorderColor: stateConfig.hoverBorderColor || styles.borderColor,
    borderColor: styles.borderColor,
    borderWidth: styles.borderWidth,
    borderStyle: styles.borderStyle,
    borderRadius: styles.borderRadius,
    accentColor:
      settings.color ||
      settings.checkColor ||
      styles.backgroundColor ||
      styles.color ||
      styles.borderColor,
    backgroundColor: styles.backgroundColor,
    color: styles.color,
  };
};

const normalizeExportSelectors = (css) =>
  String(css || '')
    .replaceAll('#animadiv-element', '.animadiv-element')
    .replaceAll('.is-hovered', ':hover')
    .replaceAll('.is-clicked', ':active');


const getPageStyles = () => ({
  margin: 0,
  width: '100%',
  minHeight: '100vh',
});

const getStageStyles = () => ({
  width: '100%',
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxSizing: 'border-box',
  padding: '40px',
});

const getBaseStyles = (params = {}) => {
  const styles = params.styles || {};
  const settings = params.specificSettings || {};
  const staticConfig = params.animations?.static || {};
  const background =
    settings.backgroundMode === 'image' && settings.backgroundImage
        ? `url("${settings.backgroundImage}")`
        : getResolvedBackground(settings, styles);
  const baseStyles = {
    ...styles,
    '--base-transform': getBaseTransform(staticConfig),
    background,
    backgroundSize: settings.backgroundMode === 'image' ? 'cover' : undefined,
    backgroundPosition: settings.backgroundMode === 'image' ? 'center' : undefined,
    width: styles.width !== 'auto' ? styles.width : 'auto',
    height: styles.height !== 'auto' ? styles.height : 'auto',
    minHeight: styles.minHeight,
    position: styles.position || 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: styles.opacity ?? 1,
    visibility: 'visible',
    transform: 'var(--base-transform)',
    transformOrigin: staticConfig.transformOrigin || 'center',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    cursor: settings.cursor || 'pointer',
    fontSize: settings.fontSize || 14,
    fontWeight: settings.fontWeight || 600,
    fontStyle: settings.fontStyle || 'normal',
  };

  const shadow = getBoxShadow(settings);
  if (shadow) baseStyles.boxShadow = shadow;

  if (Number(styles.borderWidth) > 0) {
    baseStyles.border = `${styles.borderWidth}px ${styles.borderStyle || 'solid'} ${
      styles.borderColor || 'currentColor'
    }`;
  }

  if (settings.validationState === 'error' && settings.errorBorderColor) {
    baseStyles.borderColor = settings.errorBorderColor;
  }

  if (params.type === 'block') {
    baseStyles.flexDirection = 'column';
    baseStyles.justifyContent = settings.alignY || 'center';
    baseStyles.alignItems = settings.alignX || 'center';
    baseStyles.gap = settings.gap || 0;
    baseStyles.overflow = settings.overflow || 'visible';
  }

  if (params.type === 'button') {
    baseStyles.display = 'inline-flex';
    baseStyles.alignItems = 'center';
    baseStyles.justifyContent = 'center';
    baseStyles.verticalAlign = 'middle';
    baseStyles.appearance = 'none';
    baseStyles.WebkitAppearance = 'none';
    baseStyles.fontFamily = settings.fontFamily || 'inherit';
    baseStyles.lineHeight = settings.lineHeight || 'normal';
    baseStyles.whiteSpace = 'normal';
    baseStyles.textAlign = 'center';
    baseStyles.textDecoration = 'none';
    baseStyles.userSelect = 'none';
    baseStyles.border = Number(styles.borderWidth) > 0 ? baseStyles.border : 'none';
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
    baseStyles.display = 'block';
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


const getPlaceholderRules = (params = {}) => {
  if (params.type !== 'input' && params.type !== 'textarea') return [];
  const styles = params.styles || {};
  return [
    createRule('.animadiv-element::placeholder', {
      color: styles.color || '#111827',
      opacity: 1,
    }),
  ];
};

const getSemanticChildRules = (params = {}) => {
  const settings = params.specificSettings || {};
  const styles = params.styles || {};

  if (params.type !== 'checkbox' && params.type !== 'radio') return [];

  const controlColor =
    params.type === 'checkbox'
      ? settings.color || '#111827'
      : settings.color || '#4F46E5';
  const checkColor = settings.checkColor || '#FFFFFF';
  const controlSize = settings.size || 24;

  const inputSelector =
    params.type === 'checkbox'
      ? '.animadiv-element input[type="checkbox"]'
      : '.animadiv-element input[type="radio"]';

  const inputBase = createRule(inputSelector, {
    appearance: 'none',
    WebkitAppearance: 'none',
    width: controlSize,
    height: controlSize,
    flexShrink: 0,
    margin: 0,
    display: 'inline-grid',
    placeContent: 'center',
    cursor: 'inherit',
    background: '#FFFFFF',
    border: `2px solid ${controlColor}`,
    borderRadius: params.type === 'checkbox' ? '6px' : '50%',
    transition: 'background-color 180ms ease, border-color 180ms ease, box-shadow 180ms ease',
  });

  const checkedBase = createRule(`${inputSelector}:checked`, {
    backgroundColor: params.type === 'checkbox' ? controlColor : '#FFFFFF',
    backgroundImage: params.type === 'checkbox' ? getCheckboxCheckSvg(checkColor) : undefined,
    backgroundRepeat: params.type === 'checkbox' ? 'no-repeat' : undefined,
    backgroundPosition: params.type === 'checkbox' ? 'center' : undefined,
    backgroundSize: params.type === 'checkbox' ? '76% 76%' : undefined,
    borderColor: controlColor,
  });

  const marker =
    params.type === 'checkbox'
      ? ''
      : createRule(`${inputSelector}:checked::after`, {
          content: '""',
          width: '50%',
          height: '50%',
          borderRadius: '50%',
          background: controlColor,
        });

  return [
    inputBase,
    checkedBase,
    marker,
    createRule('.animadiv-element span', {
      fontSize: settings.fontSize || 14,
      fontWeight: settings.fontWeight || 500,
      fontStyle: settings.fontStyle || 'normal',
      color: styles.color,
      fontFamily: settings.fontFamily || 'inherit',
      background: 'transparent',
    }),
  ];
};


const getContentRules = (params = {}) => {
  if (!['button', 'link'].includes(params.type)) return [];
  return [
    createRule('.animadiv-element > .animadiv-content', {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      minWidth: 0,
      lineHeight: 'inherit',
      textAlign: 'center',
      pointerEvents: 'none',
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
    normalizeExportSelectors(motionData.css),
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
  const sanitizedParams = {
    ...params,
    animations: sanitizeAnimationsForType(params.type, params.animations),
  };
  const loadConfig = getMotionConfig(sanitizedParams, 'load');
  const staticConfig = getMotionConfig(sanitizedParams, 'static');
  const hoverConfig = getMotionConfig(sanitizedParams, 'hover');
  const clickConfig = getMotionConfig(sanitizedParams, 'click');

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
  const staticData = generateAnimationCSS(
    staticConfig.presetId,
    staticConfig,
    'animadiv-element',
    'static'
  );

  const baseSection = getSection('Base styles', [
    createRule('html, body', getPageStyles()),
    createRule('.animadiv-stage', getStageStyles()),
    createRule('.animadiv-element', getBaseStyles(sanitizedParams)),
    ...getPlaceholderRules(sanitizedParams),
    ...getSemanticChildRules(sanitizedParams),
    ...getContentRules(sanitizedParams),
  ]);

  const loadSection = getSection('Load animation', [
    loadData.animationStr && loadData.animationStr !== 'none'
      ? createRule('.animadiv-element', {
          animation: loadData.animationStr,
        })
      : '',
  ]);

  const staticSection = getSection('Static loop animation', [
    staticData.animationStr && staticData.animationStr !== 'none'
      ? createRule('.animadiv-element', {
          animation: staticData.animationStr,
        })
      : '',
    normalizeExportSelectors(staticData.css),
  ]);

  const hoverSection = getSection('Hover styles', [
    hoverConfig.presetId !== 'none'
      ? getStateRule(
          '.animadiv-element:hover',
          hoverData,
          getTypeHoverStyles(sanitizedParams),
          {
            clearBaseAnimation: true,
          }
        )
      : '',
  ]);

  const clickSection = getSection('Click styles', [
    clickConfig.presetId !== 'none'
      ? getStateRule('.animadiv-element:active', clickData, {}, {
          clearBaseAnimation: true,
        })
      : '',
  ]);

  const keyframesSection = getSection(
    'Keyframes',
    [
      staticData.keyframes,
      loadData.keyframes,
      hoverData.keyframes,
      clickData.keyframes,
    ].map(normalizeExportSelectors)
  );

  return [
    '/* Generated by AnimaDiv */',
    baseSection,
    staticSection,
    loadSection,
    hoverSection,
    clickSection,
    keyframesSection,
  ]
    .filter(Boolean)
    .join('\n\n');
};
