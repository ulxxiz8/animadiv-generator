import React, { useState, useEffect, useMemo } from 'react';
import {
  MousePointer2,
  Pointer,
  LayoutTemplate,
  Check,
  Square,
  Grid,
  RotateCcw,
} from 'lucide-react';
import { generateAnimationCSS } from '../../utils/animationEngine';
import { renderSplitText } from '../../utils/typographyMotion';

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

const AnimatedItem = ({ params, activeState, localReplayKey }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [clickKey, setClickKey] = useState(0);

  if (!params || !params.styles || !params.specificSettings) return null;

  const s = params.specificSettings;
  const styles = params.styles;

  // Отримуємо конфіг для поточного стану
  const targetState = activeState === 'static' ? 'load' : activeState;
  const config = params.animations?.[targetState] || {};
  const preset = config.effectPreset || config.presetId || 'none';

  // ✅ ОПТИМІЗАЦІЯ 1: Мемоізація. CSS перераховується тільки при зміні конфігу
  const { keyframes, animationStr } = useMemo(() => {
    return activeState === 'static'
      ? { keyframes: '', animationStr: 'none' }
      : generateAnimationCSS(
          preset,
          config,
          `${params.id}_${activeState}`,
          targetState
        );
  }, [preset, JSON.stringify(config), activeState, params.id, targetState]);

  // ✅ ОПТИМІЗАЦІЯ 2: Чисті ін'єкції в DOM (без дублікатів і блимань)
  useEffect(() => {
    if (!keyframes) return;
    const styleId = `dynamic-styles-${params.id}-${activeState}`;
    let styleEl = document.getElementById(styleId);

    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }

    // Оновлюємо DOM тільки якщо CSS реально змінився
    if (styleEl.innerHTML !== keyframes) {
      styleEl.innerHTML = keyframes;
    }

    // Чистка: коли елемент зникає, видаляємо його стилі
    return () => {
      if (styleEl && styleEl.parentNode) {
        styleEl.parentNode.removeChild(styleEl);
      }
    };
  }, [keyframes, params.id, activeState]);
  // Логіка відтворення
  let activeAnimation = 'none';
  if (activeState === 'load') activeAnimation = animationStr;
  else if (activeState === 'hover' && isHovered) activeAnimation = animationStr;
  else if (activeState === 'click' && isClicked) activeAnimation = animationStr;

  const handleMouseEnter = () => activeState === 'hover' && setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsClicked(false);
  };
  const handleMouseDown = () => {
    if (activeState !== 'click') return;
    setIsClicked(false);
    setTimeout(() => {
      setClickKey((prev) => prev + 1);
      setIsClicked(true);
    }, 10);
  };
  const handleMouseUp = () => setIsClicked(false);

  let Tag = params.tag || 'div';
  if (params.type === 'text') Tag = s.tag || 'p';
  if (params.type === 'checkbox' || params.type === 'radio') Tag = 'label';

  const isVoidElement = Tag === 'input' || Tag === 'img' || Tag === 'textarea';

  // ВІДНОВЛЕНО: Твої оригінальні стилі елемента
  const elementStyles = {
    width: styles.width !== 'auto' ? `${styles.width}px` : 'auto',
    height: styles.height !== 'auto' ? `${styles.height}px` : 'auto',
    backgroundColor: styles.backgroundColor,
    color: styles.color,
    borderRadius: `${styles.borderRadius || 0}px`,
    border:
      styles.borderWidth > 0
        ? `${styles.borderWidth}px solid ${styles.borderColor || '#E5E7EB'}`
        : 'none',
    filter:
      styles.opacity !== undefined && styles.opacity < 1
        ? `opacity(${styles.opacity})`
        : 'none',
    padding: styles.padding || 0,
    boxSizing: 'border-box',
    outline: 'none',
    margin: 0,
    fontFamily: s.fontFamily || 'inherit',
    boxShadow:
      isHovered && s.hoverShadow
        ? s.hoverShadow
        : isHovered
          ? '0 10px 15px -3px rgba(0,0,0,0.1)'
          : 'none',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    transformOrigin: config.transformOrigin || 'center',
    animation: activeAnimation,
    transform: `${isClicked ? `scale(${s.activeScale || 0.95})` : isHovered ? `scale(${s.hoverScale || 1.02})` : 'scale(1)'}`,
    cursor:
      ['button', 'link', 'checkbox', 'radio'].includes(params.type) &&
      (activeState === 'hover' || activeState === 'click')
        ? 'pointer'
        : 'default',
  };

  // ВІДНОВЛЕНО: Твоя логіка для специфічних типів
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

  // ВІДНОВЛЕНО: Твої пропси (placeholder, src тощо)
  const elementProps = {
    id: `${params.id}_${activeState}`,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onMouseDown: handleMouseDown,
    onMouseUp: handleMouseUp,
    style: elementStyles,
    className: 'animadiv-element',
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

  // ВІДНОВЛЕНО: Твій внутрішній контент (чекбокси, текст)
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
          !isClicked &&
          (activeState === 'hover' || activeState === 'click')
        }
      />

      {isVoidElement ? (
        <Tag key={`key-${localReplayKey}-${clickKey}`} {...elementProps} />
      ) : (
        <Tag key={`key-${localReplayKey}-${clickKey}`} {...elementProps}>
          {renderContent()}
        </Tag>
      )}
    </div>
  );
};

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
