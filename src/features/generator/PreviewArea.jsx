import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from 'react';
import {
  MousePointer2,
  Pointer,
  LayoutTemplate,
  Check,
  RotateCcw,
} from 'lucide-react';
import { generateAnimationCSS } from '../../utils/animationEngine';
import { renderSplitText } from '../../utils/typographyMotion';

// ==========================================
// 1. STABLE STYLE INJECTION
// ==========================================
const useDynamicStyle = (id, activeState, keyframes) => {
  useEffect(() => {
    if (!keyframes) return;
    const styleId = `dynamic-styles-${id}-${activeState}`;
    let styleEl = document.getElementById(styleId);

    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }

    if (styleEl.innerHTML !== keyframes) {
      styleEl.innerHTML = keyframes;
    }

    return () => {
      const el = document.getElementById(styleId);
      if (el) el.remove();
    };
  }, [keyframes, id, activeState]);
};

// ==========================================
// 2. HINT CURSOR
// ==========================================
const HintCursor = ({ type, isVisible }) => {
  if (!isVisible) return null;
  const animationStyle =
    type === 'hover'
      ? 'hint-hover 3s infinite ease-in-out'
      : 'hint-click 2s infinite ease-in-out';
  return (
    <div
      style={{
        position: 'absolute',
        right: '10%',
        bottom: '10%',
        transition: 'opacity 0.3s ease',
        pointerEvents: 'none',
        animation: animationStyle,
        zIndex: 10,
      }}
    >
      <div style={{ filter: 'drop-shadow(0px 8px 12px rgba(0,0,0,0.15))' }}>
        {type === 'hover' ? (
          <MousePointer2 size={32} fill="#ffffff" />
        ) : (
          <Pointer size={32} fill="#ffffff" />
        )}
      </div>
      <style>{`
        @keyframes hint-hover { 0%, 100% { transform: translate(20px, 20px); } 50% { transform: translate(-10px, -10px); } }
        @keyframes hint-click { 0%, 100% { transform: translateY(10px) scale(1); } 50% { transform: translateY(-5px) scale(0.9); } }
      `}</style>
    </div>
  );
};

// ==========================================
// 3. ANIMATED ITEM COMPONENT
// ==========================================
const AnimatedItem = ({ params, activeState, localReplayKey }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [clickPhase, setClickPhase] = useState('idle');
  const elementRef = useRef(null);

  const isClicked = clickPhase !== 'idle';

  if (!params || !params.styles || !params.specificSettings) return null;

  const s = params.specificSettings;
  const styles = params.styles;

  const targetState = activeState === 'static' ? 'load' : activeState;
  const config = params.animations?.[targetState] || {};
  const preset = config.effectPreset || config.presetId || 'none';

  const { keyframes, animationStr, transitionStyles } = useMemo(() => {
    return activeState === 'static'
      ? { keyframes: '', animationStr: 'none', transitionStyles: null }
      : generateAnimationCSS(
          preset,
          config,
          `${params.id}_${activeState}`,
          targetState
        );
  }, [preset, JSON.stringify(config), activeState, params.id, targetState]);

  useDynamicStyle(params.id, activeState, keyframes);

  // 🔄 STABLE REPLAY ENGINE
  const triggerReplay = useCallback(() => {
    if (!elementRef.current) return;
    const el = elementRef.current;

    el.style.animation = 'none';

    // Подвійний requestAnimationFrame гарантує, що браузер відрендерить скидання
    // перед тим, як ми знову призначимо анімацію. Це прибирає глітчі.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (elementRef.current) {
          elementRef.current.style.animation = animationStr;
        }
      });
    });
  }, [animationStr]);

  useEffect(() => {
    if (localReplayKey > 0 && activeState === 'load') {
      triggerReplay();
    }
  }, [localReplayKey, activeState, triggerReplay]);

  // 🖱️ STABLE INTERACTION LISTENERS
  const handleMouseEnter = () => {
    if (activeState === 'hover') setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setClickPhase('idle'); // Жорстке скидання стейту при втраті фокусу
  };

  const handleMouseDown = () => {
    if (activeState !== 'click') return;
    if (!transitionStyles) triggerReplay(); // Для ripple, bounce
    setClickPhase('pressed');
  };

  const handleMouseUp = () => {
    if (activeState === 'click' && clickPhase === 'pressed') {
      setClickPhase('released');
    }
  };

  const handleAnimationEnd = () => {
    if (activeState === 'click') setClickPhase('idle');
  };

  // 🎨 PREDICTABLE VISUAL STATE
  const applyLoadAnimation = () => {
    if (activeState !== 'load') return {};
    return { animation: animationStr };
  };

  const applyHoverState = () => {
    if (activeState !== 'hover' || !isHovered) return {};
    if (transitionStyles) return transitionStyles;
    return { animation: animationStr };
  };

  const applyClickState = () => {
    if (activeState !== 'click' || clickPhase === 'idle') return {};
    if (transitionStyles) {
      return clickPhase === 'pressed' ? transitionStyles : {};
    }
    return { animation: animationStr };
  };

  const dynamicInteractionStyles = useMemo(() => {
    const load = applyLoadAnimation();
    const hover = applyHoverState();
    const click = applyClickState();

    // Пріоритет: Click > Hover > Load
    const activeStyles = { ...load, ...hover, ...click };

    // Якщо анімації немає — повертаємо порожній об'єкт, щоб не затирати стилі
    return Object.keys(activeStyles).length > 0 ? activeStyles : {};
  }, [isHovered, clickPhase, animationStr, transitionStyles]);

  // 🧱 DOM ELEMENT BUILDER
  let Tag = params.tag || 'div';
  if (params.type === 'text') Tag = s.tag || 'p';
  if (params.type === 'checkbox' || params.type === 'radio') Tag = 'label';

  const isVoidElement = Tag === 'input' || Tag === 'img' || Tag === 'textarea';

  const elementStyles = {
    // 1. Статичні стилі з бази
    ...styles,
    width: styles.width !== 'auto' ? `${styles.width}px` : 'auto',
    height: styles.height !== 'auto' ? `${styles.height}px` : 'auto',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    // 2. Видимість
    opacity: 1,
    visibility: 'visible',

    // 3. АНІМАЦІЯ (Тільки для Load!)
    // Якщо ми на будь-якому іншому табі (Hover/Click), ставимо 'none'.
    // Це дозволить CSS-класам (.is-hovered) з interactionMotion.js нарешті спрацювати.
    animation: activeState === 'load' ? animationStr : 'none',

    // 4. Додаткові правки
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    cursor: 'pointer',
    fontSize: `${s.fontSize || 14}px`,
    fontWeight: s.fontWeight || 600,
  };

  // Логіка специфічних типів (Block, Button, Input, Textarea, Text, Image, Link)
  if (params.type === 'block') {
    elementStyles.display = 'flex';
    elementStyles.flexDirection = 'column';
    elementStyles.justifyContent = s.alignY || 'center';
    elementStyles.alignItems = s.alignX || 'center';
    elementStyles.gap = `${s.gap || 0}px`;
    elementStyles.overflow = s.overflow || 'visible';
  }

  if (params.type === 'button') {
    elementStyles.display = 'flex';
    elementStyles.alignItems = 'center';
    elementStyles.justifyContent = 'center';
    elementStyles.fontSize = `${s.fontSize || 14}px`;
    elementStyles.fontWeight = s.fontWeight || 600;
    elementStyles.whiteSpace = 'pre-wrap';
    elementStyles.textAlign = 'center';
    if (isHovered && s.hoverBackground)
      elementStyles.backgroundColor = s.hoverBackground;
    if (isHovered && s.hoverColor) elementStyles.color = s.hoverColor;
  }

  if (params.type === 'input') {
    elementStyles.fontSize = `${s.fontSize || 14}px`;
    elementStyles.fontWeight = s.fontWeight || 400;
    elementStyles.padding = styles.padding || '0 16px';
    if (s.disabled) elementStyles.filter = 'opacity(0.5)';
    if (isHovered || isClicked) {
      elementStyles.borderColor = s.focusBorderColor;
      elementStyles.boxShadow =
        s.focusShadow || `0 0 0 3px ${s.focusBorderColor}33`;
    }
  }

  if (params.type === 'textarea') {
    elementStyles.fontSize = `${s.fontSize || 14}px`;
    elementStyles.padding = '12px 16px';
    elementStyles.resize = s.resize || 'both';
    if (s.disabled) elementStyles.opacity = 0.5;
    if (isHovered || isClicked) {
      elementStyles.borderColor = s.focusBorderColor;
      elementStyles.boxShadow =
        s.focusShadow || `0 0 0 3px ${s.focusBorderColor}33`;
    }
  }

  if (params.type === 'text') {
    elementStyles.fontSize = `${s.fontSize || 24}px`;
    elementStyles.fontWeight = s.fontWeight || 800;
    elementStyles.textAlign = s.textAlign || 'center';
    elementStyles.lineHeight = s.lineHeight || 1.5;
    elementStyles.whiteSpace = 'pre-wrap';
  }

  if (params.type === 'image') {
    elementStyles.objectFit = s.objectFit || 'cover';
    elementStyles.display = 'block';
    elementStyles.padding = 0;
  }

  if (params.type === 'link') {
    elementStyles.fontSize = `${s.fontSize || 14}px`;
    elementStyles.fontWeight = s.fontWeight || 500;
    elementStyles.display = 'inline-flex';
    if (isHovered && s.hoverColor) elementStyles.color = s.hoverColor;
    elementStyles.textDecoration =
      s.underline === 'always'
        ? 'underline'
        : s.underline === 'hover' && isHovered
          ? 'underline'
          : 'none';
  }

  if (params.type === 'checkbox' || params.type === 'radio') {
    elementStyles.display = 'flex';
    elementStyles.alignItems = 'center';
    elementStyles.gap = '12px';
    elementStyles.backgroundColor = 'transparent';
    elementStyles.border = 'none';
    elementStyles.width = 'auto';
    elementStyles.height = 'auto';
  }

  const elementProps = {
    ref: elementRef,
    id: `${params.id}_${activeState}`,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onMouseDown: handleMouseDown,
    onMouseUp: handleMouseUp,
    onAnimationEnd: handleAnimationEnd,
    style: elementStyles,
    className:
      `animadiv-element ${isHovered ? 'is-hovered' : ''} ${clickPhase !== 'idle' ? 'is-clicked' : ''}`.trim(),
  };

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
    elementProps.onClick = (e) => e.preventDefault();
  }

  const renderContent = () => {
    if (params.type === 'button') return renderSplitText(s.text, preset);
    if (params.type === 'text') return renderSplitText(s.content, preset);
    if (params.type === 'link') return renderSplitText(s.text, preset);
    if (params.type === 'block')
      return (
        <div
          style={{
            opacity: 0.4,
            border: '1px dashed currentColor',
            padding: '12px',
            borderRadius: 8,
          }}
        >
          Inner Content
        </div>
      );
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
              border: `2px solid ${styles.backgroundColor}`,
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
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
              color: styles.color,
              fontFamily: s.fontFamily,
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
              transition: 'all 0.2s',
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
              color: styles.color,
              fontFamily: s.fontFamily,
            }}
          >
            {s.label}
          </span>
        </>
      );
    }
    return null;
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <HintCursor
        type={activeState}
        isVisible={
          !isHovered &&
          clickPhase === 'idle' &&
          (activeState === 'hover' || activeState === 'click')
        }
      />

      {isVoidElement ? (
        <Tag {...elementProps} />
      ) : (
        <Tag {...elementProps}> {renderContent()}</Tag>
      )}
    </div>
  );
};

// ==========================================
// 4. MAIN PREVIEW AREA
// ==========================================
const PreviewArea = ({ params, refreshKey }) => {
  const [activeState, setActiveState] = useState('load');
  const [isGridView, setIsGridView] = useState(false);
  const [localReplays, setLocalReplays] = useState({
    load: 0,
    hover: 0,
    click: 0,
    static: 0,
  });

  if (!params || !params.styles)
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

  const states = [
    { id: 'static', label: 'Static' },
    { id: 'hover', label: 'Hover' },
    { id: 'click', label: 'Click' },
    { id: 'load', label: 'Load' },
  ];

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
          marginBottom: '20px',
          background: '#ffffff',
          padding: '12px 20px',
          borderRadius: '16px',
          border: '1px solid #E5E7EB',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <h4
            style={{
              fontSize: '14px',
              fontWeight: '800',
              color: '#111827',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <LayoutTemplate size={18} color="#111827" /> Canvas
          </h4>
          {!isGridView && (
            <div
              style={{
                display: 'flex',
                gap: '4px',
                borderLeft: '1px solid #E5E7EB',
                paddingLeft: '16px',
              }}
            >
              {states.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveState(s.id)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    background:
                      activeState === s.id ? '#111827' : 'transparent',
                    color: activeState === s.id ? '#D6F854' : '#6B7280',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer',
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <div
          style={{
            display: 'flex',
            background: '#F3F4F6',
            padding: '4px',
            borderRadius: '10px',
          }}
        >
          <button
            onClick={() => setIsGridView(false)}
            style={{
              padding: '6px 16px',
              background: !isGridView ? '#111827' : 'transparent',
              color: !isGridView ? '#D6F854' : '#6B7280',
              border: 'none',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: '800',
              cursor: 'pointer',
            }}
          >
            {' '}
            Один стан{' '}
          </button>
          <button
            onClick={() => setIsGridView(true)}
            style={{
              padding: '6px 16px',
              background: isGridView ? '#111827' : 'transparent',
              color: isGridView ? '#D6F854' : '#6B7280',
              border: 'none',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: '800',
              cursor: 'pointer',
            }}
          >
            {' '}
            Вітрина{' '}
          </button>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          background: '#F9FAFB',
          borderRadius: '24px',
          border: '1px solid #E5E7EB',
          position: 'relative',
          overflow: 'hidden',
          display: isGridView ? 'grid' : 'flex',
          gridTemplateColumns: isGridView ? '1fr 1fr' : 'none',
          gridTemplateRows: isGridView ? '1fr 1fr' : 'none',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {isGridView ? (
          states.map((s) => (
            <div
              key={s.id}
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                border: '0.5px dashed #D1D5DB',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  background: '#fff',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '10px',
                  fontWeight: '900',
                  border: '1px solid #E5E7EB',
                  zIndex: 5,
                }}
              >
                {s.label}
              </div>

              {s.id === 'load' && (
                <button
                  onClick={() =>
                    setLocalReplays((p) => ({ ...p, [s.id]: p[s.id] + 1 }))
                  }
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: '#111827',
                    color: '#D6F854',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 10px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '10px',
                    fontWeight: '800',
                    textTransform: 'uppercase',
                    zIndex: 20,
                  }}
                >
                  <RotateCcw size={12} /> Play
                </button>
              )}

              <AnimatedItem
                params={params}
                activeState={s.id}
                localReplayKey={localReplays[s.id]}
              />
            </div>
          ))
        ) : (
          <>
            {activeState === 'load' && (
              <button
                onClick={() =>
                  setLocalReplays((p) => ({
                    ...p,
                    [activeState]: p[activeState] + 1,
                  }))
                }
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: '#111827',
                  color: '#D6F854',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '11px',
                  fontWeight: '800',
                  textTransform: 'uppercase',
                  zIndex: 20,
                }}
              >
                <RotateCcw size={14} /> Play
              </button>
            )}

            <AnimatedItem
              key={refreshKey}
              params={params}
              activeState={activeState}
              localReplayKey={localReplays[activeState]}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default PreviewArea;
