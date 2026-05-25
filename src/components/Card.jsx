import React, { useEffect, useMemo, useState } from 'react';
import {
  Bookmark,
  Check,
  CheckCircle,
  Code2,
  ExternalLink,
  Trash2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { generateFullCSS } from '../utils/generateCss';
import DeveloperHandoffModal from './DeveloperHandoffModal';
import { useTranslation } from '../i18n/useTranslation';
import { generateAnimationCSS } from '../utils/animationEngine';
import { renderSplitText } from '../utils/typographyMotion';
import {
  sanitizeAnimationConfigForType,
  sanitizeAnimationsForType,
} from '../utils/semanticMapping';
import {
  getBaseTransform,
  getBoxShadow,
  getResolvedBackground,
} from '../utils/motionSystem';
import {
  createElement,
  DEFAULT_ANIMATION_CONFIG,
} from '../utils/elementSystem';
import { getPreferredPreviewState } from '../utils/previewState';

const PARAMS_KEY = 'animadiv-params';
const SAVED_KEY = 'animadiv-saved-items';

const EMPTY_MOTION = {
  keyframes: '',
  animationStr: 'none',
  transitionStyles: null,
  presetId: 'none',
  config: null,
};

const LEGACY_PRESET_MAP = {
  popIn: 'scaleIn',
  slideUp: 'slideInUp',
  slide: 'slideInUp',
  slideIn: 'slideInUp',
  slideUpReveal: 'revealUp',
  zoom: 'zoomIn',
  zoomReveal: 'zoomIn',
  blurReveal: 'blurIn',
  glowAppear: 'blurIn',
  fadeByWord: 'fadeIn',
  fadeByLetter: 'fadeIn',
  typewriter: 'fadeIn',
  underlineDraw: 'revealUp',
  floatingSection: 'float',
  floatingImage: 'float',
  staggerReveal: 'revealUp',
  kenBurns: 'zoomIn',
  magneticHover: 'lift',
  shadowLift: 'lift',
  shadowIncrease: 'shadowGrow',
  borderGlow: 'shadowGrow',
  borderHighlight: 'borderColorChange',
  borderSlide: 'borderAnimation',
  glowHover: 'shadowGrow',
  hoverBrightness: 'opacityChange',
  parallaxHover: 'tilt',
  tiltHover: 'tilt',
  colorTransition: 'backgroundChange',
  focusGlow: 'shadowGrow',
  autoExpand: 'scaleUp',
  expand: 'scaleUp',
  expandWidth: 'scaleUp',
  expandHeight: 'scaleUp',
  textShift: 'lift',
  arrowMove: 'lift',
  pressEffect: 'pressDown',
  rotateTap: 'rotateClick',
  bounceCheck: 'elasticBounce',
  radioPulse: 'elasticBounce',
  smoothCheck: 'scaleDown',
  dotExpand: 'scaleUp',
};

const readSavedItems = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(SAVED_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const clampNumber = (value, min, max, fallback) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return fallback;
  return Math.min(max, Math.max(min, numeric));
};

const getOpacity = (value, fallback = 1) =>
  clampNumber(value, 0, 1, fallback);

const px = (value) => {
  if (value === undefined || value === null) return undefined;
  if (value === 'auto') return 'auto';
  if (typeof value === 'number') return `${value}px`;
  return value;
};

const resolveCursor = (settings = {}, state = 'load') => {
  if (settings.disabled) return 'not-allowed';
  if (settings.cursor) return settings.cursor;
  return state === 'hover' || state === 'click' ? 'pointer' : 'default';
};

const createPlaceholderCSS = (id, params) => {
  if (!['input', 'textarea'].includes(params?.type)) return '';
  const color = params.styles?.color || '#111827';
  const disabledBackground = params.styles?.backgroundColor || '#F3F4F6';

  return `
#${id}::placeholder {
  color: ${color};
  opacity: 1;
}
#${id}:disabled {
  cursor: not-allowed;
  background: ${disabledBackground};
  filter: grayscale(0.18);
}
`;
};

const normalizeAnimationConfig = (config = {}) => {
  const { effectPreset, presetId, ...rest } = config || {};
  const mappedPreset = LEGACY_PRESET_MAP[presetId || effectPreset] || presetId || effectPreset || 'none';
  return {
    ...DEFAULT_ANIMATION_CONFIG,
    ...rest,
    presetId: mappedPreset,
  };
};

const normalizeLibraryItemForGenerator = (item) => {
  const type = item?.type || 'button';
  const defaults = createElement(type) || createElement('button');
  const styles = {
    ...defaults.styles,
    ...(item.styles || {}),
  };
  const settings = {
    ...defaults.specificSettings,
    ...(item.specificSettings || {}),
  };

  if (styles.background && !settings.gradientCss) {
    settings.backgroundType = 'gradient';
    settings.gradientCss = styles.background;
    settings.backgroundGradient = styles.background;
  } else if (!settings.backgroundType && !settings.backgroundMode) {
    settings.backgroundType = 'solid';
  }

  if (styles.backgroundColor && !settings.backgroundColor) {
    settings.backgroundColor = styles.backgroundColor;
  }

  const animations = sanitizeAnimationsForType(type, {
    load: normalizeAnimationConfig(item.animations?.load),
    static: normalizeAnimationConfig(item.animations?.static),
    hover: normalizeAnimationConfig(item.animations?.hover),
    click: normalizeAnimationConfig(item.animations?.click),
  });

  return {
    ...defaults,
    ...item,
    type,
    tag: item.tag || defaults.tag,
    styles,
    specificSettings: settings,
    animations,
  };
};

const getPreviewBackground = (item) => item.preview?.background || '#F9FAFB';

const hasAnimation = (params, state) => {
  const presetId = params?.animations?.[state]?.presetId;
  return Boolean(presetId && presetId !== 'none');
};

const getStateFromMotionStyle = (motionStyle = '') => {
  const value = String(motionStyle).toLowerCase();
  if (value.includes('hover')) return 'hover';
  if (value.includes('click')) return 'click';
  if (value.includes('load')) return 'load';
  if (value.includes('static')) return 'static';
  return null;
};

const getLibraryPreferredState = (params, item) => {
  const explicitState = item?.previewState || item?.initialPreviewState;
  if (explicitState && (explicitState === 'static' || hasAnimation(params, explicitState))) {
    return explicitState;
  }

  const motionState = getStateFromMotionStyle(item?.motionStyle);
  if (motionState && (motionState === 'static' || hasAnimation(params, motionState))) {
    return motionState;
  }

  if (hasAnimation(params, 'hover')) return 'hover';
  if (hasAnimation(params, 'click')) return 'click';
  if (hasAnimation(params, 'load')) return 'load';
  return 'static';
};

const isDarkPreview = (item) => {
  const background = String(getPreviewBackground(item)).toLowerCase();
  return (
    background.includes('#05101d') ||
    background.includes('#07111f') ||
    background.includes('#082231') ||
    background.includes('#090c1b') ||
    background.includes('#111827') ||
    background.includes('#15122e')
  );
};

const getMotionConfig = (params, state) => {
  const settings = params.specificSettings || {};
  const styles = params.styles || {};
  const config = params.animations?.[state];

  if (!config) return config;

  return {
    ...config,
    shadowColor: settings.shadowColor,
    shadowOpacity: settings.shadowOpacity,
    shadowOffsetX: settings.shadowOffsetX,
    shadowOffsetY: settings.shadowOffsetY,
    shadowBlur: settings.shadowBlur,
    shadowSpread: settings.shadowSpread,
    shadowEnabled: settings.shadowEnabled,
    hoverBackgroundColor: settings.hoverBackground || config.hoverBackgroundColor,
    hoverBorderColor: config.hoverBorderColor || styles.borderColor,
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

const usePreviewStyle = (styleId, keyframes) => {
  useEffect(() => {
    if (!keyframes) return;

    let styleEl = document.getElementById(styleId);

    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }

    styleEl.innerHTML = keyframes;

    return () => {
      const el = document.getElementById(styleId);
      if (el) el.remove();
    };
  }, [styleId, keyframes]);
};

const getMotion = (params, state) => {
  if (!params) return EMPTY_MOTION;

  const config = sanitizeAnimationConfigForType(
    params.type,
    state,
    getMotionConfig(params, state)
  );

  if (!config || !config.presetId || config.presetId === 'none') {
    return {
      ...EMPTY_MOTION,
      config,
    };
  }

  const result = generateAnimationCSS(
    config.presetId,
    config,
    `${params.id}_${state}`,
    state
  );

  return {
    ...EMPTY_MOTION,
    ...result,
    presetId: config.presetId,
    config,
  };
};

const getTag = (params) => {
  if (params.type === 'button' && params.specificSettings?.actionType === 'link') {
    return 'a';
  }
  if (params.type === 'text') return params.specificSettings?.tag || 'p';
  if (params.type === 'checkbox' || params.type === 'radio') return 'label';
  return params.tag || 'div';
};

const getBaseElementStyles = (params, state) => {
  const s = params.specificSettings || {};
  const styles = params.styles || {};
  const staticConfig = params.animations?.static || {};
  const background =
    s.backgroundMode === 'image' && s.backgroundImage
      ? `url("${s.backgroundImage}")`
      : getResolvedBackground(s, styles);
  const baseTransform = getBaseTransform(staticConfig);

  const base = {
    ...styles,
    '--base-transform': baseTransform,
    background,
    backgroundSize: s.backgroundMode === 'image' ? 'cover' : undefined,
    backgroundPosition: s.backgroundMode === 'image' ? 'center' : undefined,
    width: px(styles.width),
    height: px(styles.height),
    minHeight: px(styles.minHeight),
    padding: px(styles.padding),
    margin: px(styles.margin),
    borderRadius: px(styles.borderRadius),
    boxSizing: 'border-box',
    position: styles.position || 'relative',
    transform: 'var(--base-transform)',
    transformOrigin: staticConfig.transformOrigin || 'center',
    animation: 'none',
    transition: 'none',
    cursor: resolveCursor(s, state),
  };

  if (styles.borderWidth > 0) {
    base.border = `${styles.borderWidth}px ${styles.borderStyle || 'solid'} ${
      styles.borderColor || '#E5E7EB'
    }`;
  }

  if (styles.opacity !== undefined) {
    base.opacity = styles.opacity;
  }

  if (s.validationState === 'error' && s.errorBorderColor) {
    base.borderColor = s.errorBorderColor;
  }

  const shadow = getBoxShadow(s);
  if (shadow) {
    base.boxShadow = shadow;
  }

  if (params.type === 'block') {
    base.display = 'flex';
    base.flexDirection = 'column';
    base.justifyContent = s.alignY || 'center';
    base.alignItems = s.alignX || 'center';
    base.gap = `${s.gap || 0}px`;
    base.overflow = s.overflow || 'visible';
  }

  if (params.type === 'button') {
    base.display = 'flex';
    base.alignItems = 'center';
    base.justifyContent = 'center';
    base.fontSize = `${s.fontSize || 14}px`;
    base.fontWeight = s.fontWeight || 600;
    base.fontFamily = s.fontFamily || 'inherit';
    base.fontStyle = s.fontStyle || 'normal';
    base.whiteSpace = 'pre-wrap';
    base.textAlign = 'center';
  }

  if (params.type === 'input') {
    base.fontSize = `${s.fontSize || 14}px`;
    base.fontWeight = s.fontWeight || 400;
    base.fontFamily = s.fontFamily || 'inherit';
    base.fontStyle = s.fontStyle || 'normal';
    base.padding = styles.padding || '0 16px';
    base.display = 'block';
    base.whiteSpace = 'nowrap';
    base.overflow = 'hidden';
    base.textOverflow = 'ellipsis';
    base.outline = 'none';
    if (s.disabled) base.opacity = getOpacity(styles.opacity, 1) * 0.5;
  }

  if (params.type === 'textarea') {
    const rows = Math.max(Number(s.rows) || 4, 1);
    const hasManualHeight =
      styles.height !== undefined &&
      styles.height !== null &&
      styles.height !== '' &&
      styles.height !== 'auto' &&
      styles.height !== 100;

    base.fontSize = `${s.fontSize || 14}px`;
    base.fontWeight = s.fontWeight || 400;
    base.fontFamily = s.fontFamily || 'inherit';
    base.fontStyle = s.fontStyle || 'normal';
    base.padding = styles.padding || '12px 16px';
    base.resize = s.resize || 'vertical';
    base.outline = 'none';
    if (s.disabled) base.opacity = getOpacity(styles.opacity, 1) * 0.5;

    if (!hasManualHeight) {
      delete base.height;
      base.minHeight = px(styles.minHeight) || `${rows * 24 + 24}px`;
    }
  }

  if (params.type === 'text') {
    base.fontSize = `${s.fontSize || 24}px`;
    base.fontWeight = s.fontWeight || 800;
    base.fontFamily = s.fontFamily || 'inherit';
    base.fontStyle = s.fontStyle || 'normal';
    base.textAlign = s.textAlign || 'center';
    base.lineHeight = s.lineHeight || 1.5;
    base.letterSpacing = `${s.letterSpacing || 0}px`;
    base.textTransform = s.textTransform || 'none';
    base.whiteSpace = 'pre-wrap';
  }

  if (params.type === 'image') {
    base.objectFit = s.objectFit || 'cover';
    base.objectPosition = s.objectPosition || 'center';
    base.display = 'block';
    base.padding = 0;
  }

  if (params.type === 'link') {
    base.fontSize = `${s.fontSize || 14}px`;
    base.fontWeight = s.fontWeight || 500;
    base.fontFamily = s.fontFamily || 'inherit';
    base.fontStyle = s.fontStyle || 'normal';
    base.display = 'inline-flex';
    base.textDecoration = s.underline === 'always' ? 'underline' : 'none';
    base.backgroundColor = 'transparent';
    base.border = 'none';
  }

  if (params.type === 'checkbox' || params.type === 'radio') {
    base.display = 'inline-flex';
    base.alignItems = 'center';
    base.gap = '12px';
    base.background = 'transparent';
    base.backgroundColor = 'transparent';
    base.border = 'none';
    base.boxShadow = 'none';
    base.width = 'auto';
    base.height = 'auto';
    base.padding = 0;
    if (s.disabled) base.opacity = getOpacity(styles.opacity, 1) * 0.45;
  }

  if (['button', 'input', 'textarea', 'text', 'image', 'link'].includes(params.type)) {
    base.opacity = getOpacity(styles.opacity, 1);
  }

  if (['input', 'textarea'].includes(params.type) && s.disabled) {
    base.opacity = getOpacity(styles.opacity, 1) * 0.45;
    base.cursor = 'not-allowed';
    base.filter = 'grayscale(0.18)';
  }

  return base;
};

const renderContent = (params, textPreset, previewChecked) => {
  const s = params.specificSettings || {};
  const styles = params.styles || {};

  if (params.type === 'button') return renderSplitText(s.text, textPreset);
  if (params.type === 'text') return renderSplitText(s.content, textPreset);
  if (params.type === 'link') return renderSplitText(s.text, textPreset);

  if (params.type === 'block') {
    return (
      <div
        style={{
          opacity: 0.4,
          border: '1px dashed currentColor',
          padding: 12,
          borderRadius: 8,
        }}
      >
        Inner Content
      </div>
    );
  }

  if (params.type === 'checkbox') {
    const iconSize = s.size || 24;

    return (
      <>
        <div
          style={{
            width: `${iconSize}px`,
            height: `${iconSize}px`,
            flexShrink: 0,
            backgroundColor: previewChecked ? s.color || '#111827' : '#fff',
            border: `2px solid ${s.color || '#111827'}`,
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 180ms ease, border-color 180ms ease',
          }}
        >
          {previewChecked && (
            <Check
              size={iconSize * 0.7}
              color={s.checkColor || '#fff'}
              strokeWidth={3}
            />
          )}
        </div>
        <span
          style={{
            fontSize: `${s.fontSize || 14}px`,
            fontWeight: s.fontWeight || 500,
            fontFamily: s.fontFamily || 'inherit',
            fontStyle: s.fontStyle || 'normal',
            color: styles.color,
            background: 'transparent',
          }}
        >
          {s.label}
        </span>
      </>
    );
  }

  if (params.type === 'radio') {
    const iconSize = s.size || 24;

    return (
      <>
        <div
          style={{
            width: `${iconSize}px`,
            height: `${iconSize}px`,
            flexShrink: 0,
            backgroundColor: '#fff',
            border: `2px solid ${s.color || '#4F46E5'}`,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 180ms ease, border-color 180ms ease',
          }}
        >
          {previewChecked && (
            <div
              style={{
                width: '50%',
                height: '50%',
                backgroundColor: s.color || '#4F46E5',
                borderRadius: '50%',
              }}
            />
          )}
        </div>
        <span
          style={{
            fontSize: `${s.fontSize || 14}px`,
            fontWeight: s.fontWeight || 500,
            fontFamily: s.fontFamily || 'inherit',
            fontStyle: s.fontStyle || 'normal',
            color: styles.color,
            background: 'transparent',
          }}
        >
          {s.label}
        </span>
      </>
    );
  }

  return null;
};

const LibraryPreviewElement = ({ params, state, replayKey, forceHovered = false, forceClicked = false }) => {
  const [clicked, setClicked] = useState(false);
  const [clickKey, setClickKey] = useState(0);
  const [previewChecked, setPreviewChecked] = useState(
    Boolean(params.specificSettings?.checked)
  );

  const motion = useMemo(() => getMotion(params, state), [params, state]);
  const staticMotion = useMemo(() => getMotion(params, 'static'), [params]);
  const elementId = `${params.id}_${state}`;
  const hovered = forceHovered;
  const isClicked = clicked || forceClicked;

  usePreviewStyle(
    `animadiv-library-preview-${params.id}-${state}`,
    [
      staticMotion.keyframes,
      staticMotion.css,
      motion.keyframes,
      motion.css,
      createPlaceholderCSS(elementId, params),
    ]
      .filter(Boolean)
      .join('\n')
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setClicked(false);
      setClickKey(0);
      setPreviewChecked(Boolean(params.specificSettings?.checked));
    }, 0);

    return () => window.clearTimeout(timer);
  }, [state, motion.presetId, params.type, params.specificSettings?.checked]);

  const Tag = getTag(params);
  const s = params.specificSettings || {};
  const isVoidElement = Tag === 'input' || Tag === 'img' || Tag === 'textarea';

  let elementStyles = getBaseElementStyles(params, state);

  if (state === 'static') {
    elementStyles = {
      ...elementStyles,
      animation: staticMotion.animationStr || 'none',
      transition: 'none',
      cursor: 'default',
    };
  }

  if (state === 'load') {
    elementStyles = {
      ...elementStyles,
      animation:
        motion.animationStr && motion.animationStr !== 'none'
          ? motion.animationStr
          : staticMotion.animationStr || 'none',
      transition: 'none',
      cursor: 'default',
    };
  }

  if (state === 'hover') {
    const fallbackHoverTransition =
      'transform 240ms ease-out, filter 240ms ease-out, opacity 240ms ease-out, box-shadow 240ms ease-out, background-color 240ms ease-out, color 240ms ease-out, border-color 240ms ease-out';

    elementStyles = {
      ...elementStyles,
      transition:
        motion.transitionStyles?.transition || fallbackHoverTransition,
      cursor: 'pointer',
    };

    if (hovered && motion.transitionStyles) {
      const hoverOnlyStyles = { ...motion.transitionStyles };
      delete hoverOnlyStyles.transition;
      elementStyles = {
        ...elementStyles,
        ...hoverOnlyStyles,
      };
    }

    if (hovered && motion.animationStr && motion.animationStr !== 'none') {
      elementStyles.animation = motion.animationStr;
    }

    if (hovered && params.type === 'button') {
      if (s.hoverBackground) elementStyles.backgroundColor = s.hoverBackground;
      if (s.hoverColor) elementStyles.color = s.hoverColor;
    }

    if (hovered && params.type === 'link') {
      if (s.hoverColor) elementStyles.color = s.hoverColor;
      if (s.underline === 'hover') elementStyles.textDecoration = 'underline';
    }
  }

  if (state === 'click') {
    const clickTransition = motion.transitionStyles?.transition || 'none';
    elementStyles = {
      ...elementStyles,
      animation:
        isClicked && motion.animationStr && motion.animationStr !== 'none'
          ? motion.animationStr
          : 'none',
      transition: clickTransition,
      cursor: 'pointer',
    };

    if (isClicked && motion.transitionStyles) {
      const activeOnlyStyles = { ...motion.transitionStyles };
      delete activeOnlyStyles.transition;
      elementStyles = {
        ...elementStyles,
        ...activeOnlyStyles,
      };
    }
  }

  const elementProps = {
    id: elementId,
    style: elementStyles,
    className: `animadiv-element${state === 'click' && isClicked ? ' is-clicked' : ''}${state === 'hover' && hovered ? ' is-hovered' : ''}`,
  };

  if (state === 'load') {
    elementProps.key = `load-${replayKey}`;
  }

  if (state === 'click') {
    elementProps['data-click-key'] = clickKey;
    elementProps.onMouseDown = (event) => {
      event.preventDefault();
      if (params.type === 'checkbox') setPreviewChecked((value) => !value);
      if (params.type === 'radio') setPreviewChecked(true);
      setClicked(false);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setClickKey((value) => value + 1);
          setClicked(true);
          const duration = Number(motion.config?.duration) || 180;
          const delay = Number(motion.config?.delay) || 0;
          window.setTimeout(() => setClicked(false), duration + delay + 120);
        });
      });
    };
  }

  if (params.type === 'input') {
    elementProps.type = s.inputType || 'text';
    elementProps.placeholder = s.placeholder || '';
    elementProps.readOnly = true;
    elementProps.disabled = Boolean(s.disabled);
    elementProps['aria-invalid'] = s.validationState === 'error';
  }

  if (params.type === 'textarea') {
    elementProps.placeholder = s.placeholder || '';
    elementProps.rows = s.rows || 4;
    elementProps.readOnly = true;
    elementProps.disabled = Boolean(s.disabled);
    elementProps['aria-invalid'] = s.validationState === 'error';
  }

  if (params.type === 'image') {
    elementProps.src = s.src;
    elementProps.alt = s.alt || 'image';
    elementProps.loading = s.loading || 'lazy';
    elementProps.draggable = false;
  }

  if (params.type === 'link') {
    elementProps.href = s.href || '#';
    elementProps.target = s.target || '_self';
    elementProps.onClick = (e) => e.preventDefault();
  }

  if (params.type === 'button' && Tag === 'a') {
    elementProps.href = s.href || '#';
    elementProps.target = s.target || '_self';
    elementProps.role = 'button';
    elementProps.onClick = (e) => e.preventDefault();
  }

  const textPreset =
    state === 'click' || state === 'static' ? 'none' : motion.presetId;

  return React.createElement(
    Tag,
    elementProps,
    isVoidElement ? undefined : renderContent(params, textPreset, previewChecked)
  );
};

const Preview = ({ item, replayKey, isHovered, isPressed }) => {
  const params = useMemo(() => normalizeLibraryItemForGenerator(item), [item]);
  const baseState = getLibraryPreferredState(params, item) || getPreferredPreviewState(params);
  const state =
    isPressed && hasAnimation(params, 'click')
      ? 'click'
      : isHovered && hasAnimation(params, 'hover')
        ? 'hover'
        : baseState;
  const dark = isDarkPreview(item);

  return (
    <div
      style={{
        minHeight: 232,
        background: getPreviewBackground(item),
        borderBottom: dark
          ? '1px solid rgba(255,255,255,0.12)'
          : '1px solid var(--border)',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        padding: 30,
        position: 'relative',
      }}
    >
      <LibraryPreviewElement
        params={params}
        state={state}
        replayKey={replayKey}
        forceHovered={isHovered && state === 'hover'}
        forceClicked={isPressed && state === 'click'}
      />
    </div>
  );
};

const ActionButton = ({ children, onClick, active = false, primary = false }) => (
  <button
    type="button"
    onClick={(event) => {
      event.stopPropagation();
      onClick?.(event);
    }}
    style={{
      flex: 'none',
      width: 'auto',
      padding: '8px 12px',
      background: primary || active ? 'var(--card-dark-bg)' : 'var(--surface-subtle)',
      color: primary || active ? 'var(--primary)' : 'var(--button-secondary-text)',
      border: primary || active ? '1px solid var(--card-dark-border)' : '1px solid var(--border)',
      borderRadius: 999,
      fontWeight: 850,
      fontSize: 13,
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      whiteSpace: 'nowrap',
      transition: 'opacity 0.15s',
    }}
    onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.75'; }}
    onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
  >
    {children}
  </button>
);

const Card = ({ item, mode = 'library', onSavedChange }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(() =>
    readSavedItems().some((saved) => saved.id === item.id)
  );
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [replayKey, setReplayKey] = useState(0);
  const [isHandoffOpen, setIsHandoffOpen] = useState(false);
  const itemName = t(item.nameKey, { defaultValue: item.name });
  const itemCategory = t(item.categoryKey, { defaultValue: item.category });
  const itemMotionStyle = t(item.motionStyleKey, { defaultValue: item.motionStyle });

  const useInGenerator = () => {
    const generatorItem = normalizeLibraryItemForGenerator(item);
    const initialPreviewState = getLibraryPreferredState(generatorItem, item);
    localStorage.setItem(
      PARAMS_KEY,
      JSON.stringify({
        ...generatorItem,
        initialPreviewState,
        initialMotionState: initialPreviewState,
      })
    );
    navigate('/generator');
  };

  const toggleSave = () => {
    const savedItems = readSavedItems();
    const exists = savedItems.some((saved) => saved.id === item.id);
    const nextItems =
      mode === 'mysets' || exists
        ? savedItems.filter((saved) => saved.id !== item.id)
        : [...savedItems, item];
    localStorage.setItem(SAVED_KEY, JSON.stringify(nextItems));
    setIsSaved(!exists && mode !== 'mysets');
    onSavedChange?.(nextItems);
  };

  return (
    <>
      <article
        style={{
          background: 'var(--surface)',
          borderRadius: 24,
          border: isHovered ? '1px solid var(--control-border)' : '1px solid var(--border)',
          overflow: 'hidden',
          transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
          boxShadow: isHovered
            ? '0 16px 34px -14px rgba(0,0,0,0.25)'
            : '0 1px 2px rgba(0,0,0,0.03)',
          transition: 'transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease',
        }}
        onMouseEnter={() => { setIsHovered(true); setReplayKey((key) => key + 1); }}
        onMouseLeave={() => { setIsHovered(false); setIsPressed(false); }}
        onMouseDown={() => { setIsPressed(true); setReplayKey((key) => key + 1); }}
        onMouseUp={() => setIsPressed(false)}
      >
        <Preview
          item={item}
          replayKey={replayKey}
          isHovered={isHovered}
          isPressed={isPressed}
        />

        <div style={{ padding: 18 }}>
          <h3
            style={{
              fontSize: 18,
              fontWeight: 850,
              color: 'var(--text-main)',
              lineHeight: 1.12,
              letterSpacing: 0,
              margin: '0 0 10px',
            }}
          >
            {itemName}
          </h3>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 16 }}>
            {[itemCategory, itemMotionStyle].filter(Boolean).map((badge) => (
              <span
                key={badge}
                style={{
                  fontSize: 11,
                  color: badge === itemCategory ? 'var(--primary)' : 'var(--text-muted)',
                  background: badge === itemCategory ? 'var(--card-dark-bg)' : 'var(--surface-subtle)',
                  border: badge === itemCategory ? '1px solid var(--card-dark-border)' : '1px solid var(--border)',
                  padding: '4px 8px',
                  borderRadius: 999,
                  fontWeight: 850,
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                {badge}
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
            <ActionButton onClick={useInGenerator} primary>
              <ExternalLink size={14} /> Edit
            </ActionButton>

            <ActionButton onClick={toggleSave} active={isSaved && mode !== 'mysets'}>
              {mode === 'mysets' ? (
                <><Trash2 size={14} /> Remove</>
              ) : (
                <>{isSaved ? <CheckCircle size={14} /> : <Bookmark size={14} />} Save</>
              )}
            </ActionButton>

            <ActionButton onClick={() => setIsHandoffOpen(true)}>
              <Code2 size={14} /> Code
            </ActionButton>
          </div>
        </div>
      </article>

      <DeveloperHandoffModal
        open={isHandoffOpen}
        onClose={() => setIsHandoffOpen(false)}
        params={normalizeLibraryItemForGenerator(item)}
        css={generateFullCSS(normalizeLibraryItemForGenerator(item))}
        title={itemName}
      />
    </>
  );
};

export default Card;
