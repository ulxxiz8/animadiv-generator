import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  LayoutTemplate,
  RotateCcw,
  Check,
  MousePointer2,
  Pointer,
} from 'lucide-react';
import { generateAnimationCSS } from '../../utils/animationEngine';
import { renderSplitText } from '../../utils/typographyMotion';
import { isStateAllowedForType } from '../../utils/semanticMapping';

const EMPTY_MOTION = {
  keyframes: '',
  animationStr: 'none',
  transitionStyles: null,
  presetId: 'none',
  config: null,
};

const DEFAULT_HOVER_TRANSITION =
  'transform 240ms ease-out, filter 240ms ease-out, opacity 240ms ease-out, box-shadow 240ms ease-out, background-color 240ms ease-out, color 240ms ease-out, border-color 240ms ease-out';

const px = (value) => {
  if (value === undefined || value === null) return undefined;
  if (value === 'auto') return 'auto';
  if (typeof value === 'number') return `${value}px`;
  return value;
};

const usePreviewStyle = (styleId, css) => {
  useEffect(() => {
    if (!css) return undefined;

    let styleEl = document.getElementById(styleId);

    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }

    styleEl.innerHTML = css;

    return () => {
      const el = document.getElementById(styleId);
      if (el) el.remove();
    };
  }, [styleId, css]);
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
  if (!params || state === 'static') return EMPTY_MOTION;

  const config = params.animations?.[state];

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
  if (params.type === 'text') return params.specificSettings?.tag || 'p';
  if (params.type === 'checkbox' || params.type === 'radio') return 'label';
  return params.tag || 'div';
};

const buildBaseStyles = (params, state) => {
  const s = params.specificSettings || {};
  const styles = params.styles || {};

  const base = {
    ...styles,
    width: px(styles.width),
    height: px(styles.height),
    padding: px(styles.padding),
    borderRadius: px(styles.borderRadius),
    boxSizing: 'border-box',
    position: 'relative',
    animation: 'none',
    transition: 'none',
    cursor: state === 'hover' || state === 'click' ? 'pointer' : 'default',
  };

  if (styles.borderWidth > 0) {
    base.border = `${styles.borderWidth}px solid ${
      styles.borderColor || '#E5E7EB'
    }`;
  }

  if (styles.opacity !== undefined) {
    base.opacity = styles.opacity;
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
    base.whiteSpace = 'pre-wrap';
    base.textAlign = 'center';
  }

  if (params.type === 'input') {
    base.fontSize = `${s.fontSize || 14}px`;
    base.fontWeight = s.fontWeight || 400;
    base.fontFamily = s.fontFamily || 'inherit';
    base.padding = styles.padding || '0 16px';
    base.outline = 'none';
  }

  if (params.type === 'textarea') {
    base.fontSize = `${s.fontSize || 14}px`;
    base.fontFamily = s.fontFamily || 'inherit';
    base.padding = styles.padding || '12px 16px';
    base.resize = s.resize || 'both';
    base.outline = 'none';
  }

  if (params.type === 'text') {
    base.fontSize = `${s.fontSize || 24}px`;
    base.fontWeight = s.fontWeight || 800;
    base.fontFamily = s.fontFamily || 'inherit';
    base.textAlign = s.textAlign || 'center';
    base.lineHeight = s.lineHeight || 1.5;
    base.whiteSpace = 'pre-wrap';
  }

  if (params.type === 'image') {
    base.objectFit = s.objectFit || 'cover';
    base.display = 'block';
    base.padding = 0;
  }

  if (params.type === 'link') {
    base.fontSize = `${s.fontSize || 14}px`;
    base.fontWeight = s.fontWeight || 500;
    base.fontFamily = s.fontFamily || 'inherit';
    base.display = 'inline-flex';
    base.textDecoration = s.underline === 'always' ? 'underline' : 'none';
  }

  if (params.type === 'checkbox' || params.type === 'radio') {
    base.display = 'flex';
    base.alignItems = 'center';
    base.gap = '12px';
    base.backgroundColor = 'transparent';
    base.border = 'none';
    base.width = 'auto';
    base.height = 'auto';
  }

  return base;
};

const renderContent = (params, textPreset) => {
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
            backgroundColor: s.checked ? styles.backgroundColor : '#fff',
            border: `2px solid ${styles.backgroundColor || '#111827'}`,
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 180ms ease, border-color 180ms ease',
          }}
        >
          {s.checked && (
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
            color: styles.color,
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
          {s.checked && (
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
            color: styles.color,
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
  const clickTimerRef = useRef(null);

  const motion = useMemo(() => getMotion(params, state), [params, state]);

  usePreviewStyle(
    `animadiv-preview-${params.id}-${state}`,
    state === 'static' ? '' : motion.keyframes
  );

  useEffect(() => {
    setHovered(false);
    setClicked(false);
    setClickKey(0);
    if (clickTimerRef.current) window.clearTimeout(clickTimerRef.current);
  }, [state, motion.presetId]);

  useEffect(
    () => () => {
      if (clickTimerRef.current) window.clearTimeout(clickTimerRef.current);
    },
    []
  );

  const Tag = getTag(params);
  const s = params.specificSettings || {};
  const isVoidElement = Tag === 'input' || Tag === 'img' || Tag === 'textarea';

  let elementStyles = buildBaseStyles(params, state);

  if (state === 'static') {
    elementStyles = {
      ...elementStyles,
      animation: 'none',
      transition: 'none',
      cursor: 'default',
      pointerEvents: 'none',
    };
  }

  if (state === 'load') {
    elementStyles = {
      ...elementStyles,
      animation: motion.animationStr || 'none',
      transition: 'none',
      cursor: 'default',
    };
  }

  if (state === 'hover') {
    elementStyles = {
      ...elementStyles,
      transition:
        motion.transitionStyles?.transition || DEFAULT_HOVER_TRANSITION,
      cursor: 'pointer',
    };

    if (hovered && motion.transitionStyles) {
      const { transition, ...hoverOnlyStyles } = motion.transitionStyles;
      elementStyles = {
        ...elementStyles,
        ...hoverOnlyStyles,
      };
    }

    if (hovered && params.type === 'button') {
      if (s.hoverBackground) elementStyles.backgroundColor = s.hoverBackground;
      if (s.hoverColor) elementStyles.color = s.hoverColor;
    }

    if (hovered && params.type === 'link') {
      if (s.hoverColor) elementStyles.color = s.hoverColor;
      if (s.underline === 'hover') elementStyles.textDecoration = 'underline';
    }

    if (hovered && (params.type === 'input' || params.type === 'textarea')) {
      elementStyles.borderColor = s.focusBorderColor || '#4F46E5';
      elementStyles.boxShadow =
        s.focusShadow || `0 0 0 3px ${s.focusBorderColor || '#4F46E5'}33`;
    }
  }

  if (state === 'click') {
    elementStyles = {
      ...elementStyles,
      animation:
        clicked && motion.animationStr && motion.animationStr !== 'none'
          ? motion.animationStr
          : 'none',
      transition: clicked
        ? motion.transitionStyles?.transition || 'none'
        : 'none',
      cursor: 'pointer',
    };

    if (clicked && motion.transitionStyles) {
      const { transition, ...clickOnlyStyles } = motion.transitionStyles;
      elementStyles = {
        ...elementStyles,
        ...clickOnlyStyles,
      };
    }
  }

  const elementId = `${params.id}_${state}`;
  const elementProps = {
    id: elementId,
    style: elementStyles,
    className: [
      'animadiv-element',
      state === 'hover' && hovered ? 'is-hovered' : '',
      state === 'click' && clicked ? 'is-clicked' : '',
    ]
      .filter(Boolean)
      .join(' '),
  };

  if (state === 'load') {
    elementProps.key = `load-${replayKey}`;
  }

  if (state === 'click') {
    elementProps.key = `click-${clickKey}`;
    elementProps.onAnimationEnd = () => setClicked(false);
  }

  if (params.type === 'input') {
    elementProps.type = s.inputType || 'text';
    elementProps.placeholder = s.placeholder || '';
    elementProps.readOnly = true;
  }

  if (params.type === 'textarea') {
    elementProps.placeholder = s.placeholder || '';
    elementProps.rows = s.rows || 4;
    elementProps.readOnly = true;
  }

  if (params.type === 'image') {
    elementProps.src = s.src;
    elementProps.alt = s.alt || 'image';
    elementProps.draggable = false;
  }

  if (params.type === 'link') {
    elementProps.href = s.href || '#';
    elementProps.onClick = (event) => event.preventDefault();
  }

  const textPreset =
    state === 'click' || state === 'static' ? 'none' : motion.presetId;

  const interactionHandlers = {};

  if (state === 'hover') {
    interactionHandlers.onMouseEnter = () => setHovered(true);
    interactionHandlers.onMouseLeave = () => setHovered(false);
  }

  if (state === 'click') {
    interactionHandlers.onMouseDown = () => {
      if (clickTimerRef.current) window.clearTimeout(clickTimerRef.current);
      setClicked(false);
      requestAnimationFrame(() => {
        setClickKey((value) => value + 1);
        setClicked(true);
        const duration = Number(motion.config?.duration) || 180;
        const delay = Number(motion.config?.delay) || 0;
        clickTimerRef.current = window.setTimeout(
          () => {
            setClicked(false);
          },
          duration + delay + 100
        );
      });
    };
  }

  return (
    <div
      {...interactionHandlers}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: state === 'static' || state === 'load' ? 'none' : 'auto',
      }}
    >
      <HintCursor
        type={state}
        visible={
          (state === 'hover' && !hovered) || (state === 'click' && !clicked)
        }
      />

      {isVoidElement ? (
        <Tag {...elementProps} />
      ) : (
        <Tag {...elementProps}>{renderContent(params, textPreset)}</Tag>
      )}
    </div>
  );
};

const PreviewArea = ({ params }) => {
  const [activeState, setActiveState] = useState('load');
  const [isGridView, setIsGridView] = useState(false);
  const [localReplayKey, setLocalReplayKey] = useState(0);

  const states = useMemo(() => {
    if (!params?.type) return [{ id: 'static', label: 'Static' }];

    return [
      { id: 'static', label: 'Static' },
      { id: 'load', label: 'Load' },
      { id: 'hover', label: 'Hover' },
      { id: 'click', label: 'Click' },
    ].filter(
      (item) =>
        item.id === 'static' || isStateAllowedForType(item.id, params.type)
    );
  }, [params?.type]);

  useEffect(() => {
    if (!states.some((item) => item.id === activeState)) {
      setActiveState(states[0]?.id || 'static');
    }
  }, [activeState, states]);

  if (!params || !params.styles) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#F9FAFB',
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
          border: isGridView ? '0.5px dashed #D1D5DB' : 'none',
        }}
      >
        {isGridView && (
          <div
            style={{
              position: 'absolute',
              top: 12,
              left: 12,
              background: '#fff',
              padding: '4px 8px',
              borderRadius: 6,
              fontSize: 10,
              fontWeight: 900,
              border: '1px solid #E5E7EB',
              zIndex: 5,
            }}
          >
            {state.label}
          </div>
        )}

        {isLoad && (
          <button
            onClick={() => setLocalReplayKey((value) => value + 1)}
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              background: '#111827',
              color: '#D6F854',
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
            <RotateCcw size={14} /> Play
          </button>
        )}

        <PreviewElement
          params={params}
          state={state.id}
          replayKey={isLoad ? localReplayKey : 0}
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
          background: '#ffffff',
          padding: '12px 20px',
          borderRadius: 16,
          border: '1px solid #E5E7EB',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <h4
            style={{
              fontSize: 14,
              fontWeight: 800,
              color: '#111827',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <LayoutTemplate size={18} color="#111827" /> Canvas
          </h4>

          {!isGridView && (
            <div
              style={{
                display: 'flex',
                gap: 4,
                borderLeft: '1px solid #E5E7EB',
                paddingLeft: 16,
              }}
            >
              {states.map((state) => (
                <button
                  key={state.id}
                  onClick={() => setActiveState(state.id)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 8,
                    border: 'none',
                    background:
                      activeState === state.id ? '#111827' : 'transparent',
                    color: activeState === state.id ? '#D6F854' : '#6B7280',
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
            background: '#F3F4F6',
            padding: 4,
            borderRadius: 10,
          }}
        >
          <button
            onClick={() => setIsGridView(false)}
            style={{
              padding: '6px 16px',
              background: !isGridView ? '#111827' : 'transparent',
              color: !isGridView ? '#D6F854' : '#6B7280',
              border: 'none',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            Один стан
          </button>

          <button
            onClick={() => setIsGridView(true)}
            style={{
              padding: '6px 16px',
              background: isGridView ? '#111827' : 'transparent',
              color: isGridView ? '#D6F854' : '#6B7280',
              border: 'none',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            Вітрина
          </button>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          background: '#F9FAFB',
          borderRadius: 24,
          border: '1px solid #E5E7EB',
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
