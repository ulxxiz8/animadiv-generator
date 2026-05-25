import React, { useEffect, useMemo, useState } from 'react';
import {
  LayoutTemplate,
  RotateCcw,
  Check,
  MousePointer2,
  Pointer,
} from 'lucide-react';
import { generateAnimationCSS } from '../../utils/animationEngine';
import { renderSplitText } from '../../utils/typographyMotion';
import {
  isStateAllowedForType,
  sanitizeAnimationConfigForType,
} from '../../utils/semanticMapping';
import {
  getBaseTransform,
  getBoxShadow,
  getResolvedBackground,
} from '../../utils/motionSystem';
import { useTranslation } from '../../i18n/useTranslation';

const EMPTY_MOTION = {
  keyframes: '',
  animationStr: 'none',
  transitionStyles: null,
  presetId: 'none',
  config: null,
};


const clampNumber = (value, min, max, fallback) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return fallback;
  return Math.min(max, Math.max(min, numeric));
};

const getOpacity = (value, fallback = 1) =>
  clampNumber(value, 0, 1, fallback);

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

const px = (value) => {
  if (value === undefined || value === null) return undefined;
  if (value === 'auto') return 'auto';
  if (typeof value === 'number') return `${value}px`;
  return value;
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

const HintCursor = ({ type, visible }) => {
  if (!visible) return null;

  return (
    <div
      style={{
        position: 'absolute',
        right: '12%',
        bottom: '12%',
        pointerEvents: 'none',
        zIndex: 20,
        animation:
          type === 'hover'
            ? 'animadiv-hint-hover 2.6s infinite ease-in-out'
            : 'animadiv-hint-click 2s infinite ease-in-out',
        filter: 'drop-shadow(0 8px 14px rgba(0,0,0,0.16))',
      }}
    >
      {type === 'hover' ? (
        <MousePointer2 size={34} fill="#ffffff" color="#111827" />
      ) : (
        <Pointer size={34} fill="#ffffff" color="#111827" />
      )}

      <style>{`
        @keyframes animadiv-hint-hover {
          0%, 100% { transform: translate(18px, 18px); opacity: 0.8; }
          50% { transform: translate(-8px, -8px); opacity: 1; }
        }

        @keyframes animadiv-hint-click {
          0%, 100% { transform: translateY(8px) scale(1); opacity: 0.8; }
          50% { transform: translateY(-4px) scale(0.92); opacity: 1; }
        }
      `}</style>
    </div>
  );
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

const PreviewElement = ({ params, state, replayKey }) => {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [clickKey, setClickKey] = useState(0);
  const [previewChecked, setPreviewChecked] = useState(
    Boolean(params.specificSettings?.checked)
  );

  const motion = useMemo(() => getMotion(params, state), [params, state]);
  const staticMotion = useMemo(() => getMotion(params, 'static'), [params]);

  const elementId = `${params.id}_${state}`;

  usePreviewStyle(
    `animadiv-preview-${params.id}-${state}`,
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
      setHovered(false);
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

    if (
      hovered &&
      motion.animationStr &&
      motion.animationStr !== 'none'
    ) {
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
        clicked && motion.animationStr && motion.animationStr !== 'none'
          ? motion.animationStr
          : 'none',
      transition: clickTransition,
      cursor: 'pointer',
    };

    if (clicked && motion.transitionStyles) {
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
    className: `animadiv-element${state === 'click' && clicked ? ' is-clicked' : ''}${state === 'hover' && hovered ? ' is-hovered' : ''}`,
  };

  if (state === 'load') {
    elementProps.key = `load-${replayKey}`;
  }

  if (state === 'click') {
    elementProps['data-click-key'] = clickKey;
  }

  if (state === 'hover') {
    elementProps.onMouseEnter = () => setHovered(true);
    elementProps.onMouseLeave = () => setHovered(false);
  }

  if (state === 'click') {
    elementProps.onMouseDown = (event) => {
      event.preventDefault();

      if (params.type === 'checkbox') {
        setPreviewChecked((value) => !value);
      }

      if (params.type === 'radio') {
        setPreviewChecked(true);
      }

      setClicked(false);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setClickKey((value) => value + 1);
          setClicked(true);

          const duration = Number(motion.config?.duration) || 180;
          const delay = Number(motion.config?.delay) || 0;

          window.setTimeout(() => {
            setClicked(false);
          }, duration + delay + 120);
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

  const handlePreviewLinkClick = (e) => {
    const href = s.href || '#';
    if (!href || href === '#') {
      e.preventDefault();
      return;
    }

    e.preventDefault();
    window.open(href, s.target || '_self', s.target === '_blank' ? 'noopener,noreferrer' : undefined);
  };

  if (params.type === 'link') {
    elementProps.href = s.href || '#';
    elementProps.target = s.target || '_self';
    elementProps.onClick = handlePreviewLinkClick;
  }

  if (params.type === 'button' && Tag === 'a') {
    elementProps.href = s.href || '#';
    elementProps.target = s.target || '_self';
    elementProps.role = 'button';
    elementProps.onClick = handlePreviewLinkClick;
  }

  const textPreset =
    state === 'click' || state === 'static' ? 'none' : motion.presetId;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <HintCursor
        type={state}
        visible={
          (state === 'hover' && !hovered) || (state === 'click' && !clicked)
        }
      />

      {React.createElement(
        Tag,
        elementProps,
        isVoidElement
          ? undefined
          : renderContent(params, textPreset, previewChecked)
      )}
    </div>
  );
};

const PreviewArea = ({
  params,
  refreshKey = 0,
  activeState: controlledActiveState,
  onActiveStateChange,
}) => {
  const { t } = useTranslation();
  const [localActiveState, setLocalActiveState] = useState('static');
  const isControlled =
    controlledActiveState !== undefined &&
    typeof onActiveStateChange === 'function';
  const activeState = isControlled ? controlledActiveState : localActiveState;
  const setActiveState = isControlled ? onActiveStateChange : setLocalActiveState;
  const [isGridView, setIsGridView] = useState(false);
  const [localReplayKey, setLocalReplayKey] = useState(0);
  const type = params?.type;

  const states = useMemo(() => {
    if (!type) return [{ id: 'static', label: t('preview.states.static', { defaultValue: 'Static' }) }];

    return [
      { id: 'static', label: t('preview.states.static', { defaultValue: 'Static' }) },
      { id: 'load', label: t('preview.states.load', { defaultValue: 'Load' }) },
      { id: 'hover', label: t('preview.states.hover', { defaultValue: 'Hover' }) },
      { id: 'click', label: t('preview.states.click', { defaultValue: 'Click' }) },
    ].filter(
      (item) =>
        item.id === 'static' || isStateAllowedForType(item.id, type)
    );
  }, [t, type]);

  useEffect(() => {
    if (!states.some((item) => item.id === activeState)) {
      const timer = window.setTimeout(() => {
        setActiveState(states[0]?.id || 'static');
      }, 0);

      return () => window.clearTimeout(timer);
    }
  }, [activeState, setActiveState, states]);

  if (!params || !params.styles) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: 'var(--canvas-bg)',
          borderRadius: 24,
        }}
      />
    );
  }

  const renderPreviewCell = (state) => {
    const isLoad = state.id === 'load';

    return (
      <div
        key={state.id}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: isGridView ? '0.5px dashed var(--control-border)' : 'none',
        }}
      >
        {isGridView && (
          <div
            style={{
              position: 'absolute',
              top: 12,
              left: 12,
              background: 'var(--surface)',
              padding: '4px 8px',
              borderRadius: 6,
              fontSize: 10,
              fontWeight: 900,
              border: '1px solid var(--border)',
              zIndex: 5,
            }}
          >
            {state.label}
          </div>
        )}

        {isLoad && (
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setLocalReplayKey((value) => value + 1);
            }}
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              background: 'var(--button-bg)',
              color: 'var(--button-text)',
              border: 'none',
              borderRadius: 8,
              padding: '8px 12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 11,
              fontWeight: 800,
              textTransform: 'uppercase',
              zIndex: 20,
            }}
          >
            <RotateCcw size={14} /> {t('common.play')}
          </button>
        )}

        <PreviewElement
          params={params}
          state={state.id}
          replayKey={isLoad ? `${localReplayKey}-${refreshKey}` : 0}
        />
      </div>
    );
  };

  const currentState =
    states.find((item) => item.id === activeState) || states[0];

  return (
    <div
      className="preview-area"
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
          background: 'var(--surface)',
          padding: '12px 20px',
          borderRadius: 16,
          border: '1px solid var(--border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <h4
            style={{
              fontSize: 14,
              fontWeight: 800,
              color: 'var(--text-main)',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <LayoutTemplate size={18} color="currentColor" /> Canvas
          </h4>

          {!isGridView && (
            <div
              style={{
                display: 'flex',
                gap: 4,
                borderLeft: '1px solid var(--border)',
                paddingLeft: 16,
              }}
            >
              {states.map((state) => (
                <button
                  type="button"
                  key={state.id}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setActiveState(state.id);
                  }}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 8,
                    border: 'none',
                    background:
                      activeState === state.id
                        ? 'var(--button-bg)'
                        : 'transparent',
                    color:
                      activeState === state.id
                        ? 'var(--button-text)'
                        : 'var(--text-muted)',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {state.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            background: 'var(--surface-subtle)',
            padding: 4,
            borderRadius: 10,
          }}
        >
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setIsGridView(false);
            }}
            style={{
              padding: '6px 16px',
              background: !isGridView ? 'var(--button-bg)' : 'transparent',
              color: !isGridView ? 'var(--button-text)' : 'var(--text-muted)',
              border: 'none',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            {t('preview.singleState')}
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setIsGridView(true);
            }}
            style={{
              padding: '6px 16px',
              background: isGridView ? 'var(--button-bg)' : 'transparent',
              color: isGridView ? 'var(--button-text)' : 'var(--text-muted)',
              border: 'none',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            {t('preview.showcase')}
          </button>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          background: 'var(--canvas-bg)',
          borderRadius: 24,
          border: '1px solid var(--border)',
          overflow: 'hidden',
          display: isGridView ? 'grid' : 'flex',
          gridTemplateColumns: isGridView ? '1fr 1fr' : 'none',
          gridTemplateRows: isGridView ? '1fr 1fr' : 'none',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {isGridView
          ? states.map(renderPreviewCell)
          : renderPreviewCell(currentState)}
      </div>
    </div>
  );
};

export default PreviewArea;
