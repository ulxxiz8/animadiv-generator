import React, { useState, useEffect } from 'react';
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

  // 1. Отримуємо конфіги для ВСІХ шарів одночасно
  const loadConfig = params.animations?.load || {};
  const hoverConfig = params.animations?.hover || {};
  const clickConfig = params.animations?.click || {};

  const loadPreset = loadConfig.effectPreset || loadConfig.presetId || 'none';
  const hoverPreset =
    hoverConfig.effectPreset || hoverConfig.presetId || 'none';
  const clickPreset =
    clickConfig.effectPreset || clickConfig.presetId || 'none';

  // 2. Генеруємо CSS для кожного шару незалежно
  const loadData = generateAnimationCSS(
    loadPreset,
    loadConfig,
    `${params.id}_load`,
    'load'
  );
  const hoverData = generateAnimationCSS(
    hoverPreset,
    hoverConfig,
    `${params.id}_hover`,
    'hover'
  );
  const clickData = generateAnimationCSS(
    clickPreset,
    clickConfig,
    `${params.id}_click`,
    'click'
  );

  useEffect(() => {
    const styleId = `dynamic-styles-${params.id}`;
    let styleEl = document.getElementById(styleId);
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }
    // Ін'єктуємо всі кейфрейми одночасно
    styleEl.innerHTML = `
      ${loadData.keyframes}
      ${hoverData.keyframes}
      ${clickData.keyframes}
    `;
  }, [loadData.keyframes, hoverData.keyframes, clickData.keyframes, params.id]);

  // 3. Логіка відтворення
  const shouldPlayHover = isHovered || activeState === 'hover';
  const shouldPlayClick = isClicked || activeState === 'click';

  const handleMouseDown = () => {
    setIsClicked(false);
    setTimeout(() => {
      setClickKey((prev) => prev + 1);
      setIsClicked(true);
    }, 10);
  };

  let Tag = params.tag || 'div';
  if (params.type === 'text') Tag = s.tag || 'p';
  if (params.type === 'checkbox' || params.type === 'radio') Tag = 'label';

  const isVoidElement = Tag === 'input' || Tag === 'img' || Tag === 'textarea';

  // Базові стилі самого елемента (статичні)
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
    fontFamily: s.fontFamily || 'inherit',
    boxShadow: isHovered
      ? s.hoverShadow || '0 10px 15px -3px rgba(0,0,0,0.1)'
      : 'none',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    // Статичний масштаб для сумісності
    transform: `${isClicked ? `scale(${s.activeScale || 0.95})` : isHovered ? `scale(${s.hoverScale || 1.02})` : 'scale(1)'}`,
  };

  // Додаткові стилі за типом елемента (Flexbox, типи кнопок тощо)
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
    elementStyles.cursor = 'pointer';
  }

  const renderContent = () => {
    const p =
      clickPreset !== 'none'
        ? clickPreset
        : hoverPreset !== 'none'
          ? hoverPreset
          : loadPreset;
    if (params.type === 'button') return renderSplitText(s.text, p);
    if (params.type === 'text') return renderSplitText(s.content, p);
    if (params.type === 'link') return renderSplitText(s.text, p);
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
    if (params.type === 'checkbox' || params.type === 'radio') {
      const iconSize = s.size || 24;
      const isCheck = params.type === 'checkbox';
      return (
        <>
          <div
            style={{
              width: `${iconSize}px`,
              height: `${iconSize}px`,
              flexShrink: 0,
              backgroundColor: s.checked ? styles.backgroundColor : '#fff',
              border: `2px solid ${styles.backgroundColor}`,
              borderRadius: isCheck ? '6px' : '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {s.checked &&
              (isCheck ? (
                <Check size={iconSize * 0.7} color={s.checkColor || '#fff'} />
              ) : (
                <div
                  style={{
                    width: '50%',
                    height: '50%',
                    background: s.color || '#4F46E5',
                    borderRadius: '50%',
                  }}
                />
              ))}
          </div>
          <span
            style={{
              fontSize: `${s.fontSize || 14}px`,
              fontWeight: s.fontWeight || 500,
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

      {/* ШАР 1: LOAD */}
      <div
        key={`load-${localReplayKey}`}
        style={{
          animation: loadPreset !== 'none' ? loadData.animationStr : 'none',
          transformOrigin: loadConfig.transformOrigin || 'center',
          display: 'inline-flex',
        }}
      >
        {/* ШАР 2: HOVER */}
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            setIsClicked(false);
          }}
          style={{
            animation:
              shouldPlayHover && hoverPreset !== 'none'
                ? hoverData.animationStr
                : 'none',
            transformOrigin: hoverConfig.transformOrigin || 'center',
            display: 'inline-flex',
          }}
        >
          {/* ШАР 3: CLICK */}
          <div
            key={`click-${clickKey}`}
            onMouseDown={handleMouseDown}
            onMouseUp={() => setIsClicked(false)}
            style={{
              animation:
                shouldPlayClick && clickPreset !== 'none'
                  ? clickData.animationStr
                  : 'none',
              transformOrigin: clickConfig.transformOrigin || 'center',
              display: 'inline-flex',
            }}
          >
            {isVoidElement ? (
              <Tag {...params.elementProps} style={elementStyles} />
            ) : (
              <Tag style={elementStyles}>{renderContent()}</Tag>
            )}
          </div>
        </div>
      </div>
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
                }}
              >
                {s.label}
              </div>
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
                  padding: '4px',
                }}
              >
                {' '}
                <RotateCcw size={14} />{' '}
              </button>
              <AnimatedItem
                params={params}
                activeState={s.id}
                localReplayKey={localReplays[s.id]}
              />
            </div>
          ))
        ) : (
          <AnimatedItem
            key={refreshKey}
            params={params}
            activeState={activeState}
            localReplayKey={localReplays[activeState]}
          />
        )}
      </div>
    </div>
  );
};

export default PreviewArea;
