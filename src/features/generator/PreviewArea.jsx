import React, { useState } from 'react';
import { animationPresets } from '../../data/presets';
import {
  MousePointer2,
  Pointer,
  LayoutTemplate,
  Check,
  Square,
  Grid,
  RotateCcw,
} from 'lucide-react';

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
  const [isActive, setIsActive] = useState(false);

  if (!params || !params.styles || !params.specificSettings) return null;

  const s = params.specificSettings;
  const styles = params.styles;
  const stateConfig =
    params.animations[activeState === 'static' ? 'load' : activeState];
  const activePreset = animationPresets.find(
    (p) => p.id === stateConfig?.presetId
  );
  const animationString =
    activePreset && activePreset.id !== 'none'
      ? `ag_${activePreset.id} ${stateConfig.duration}ms ${stateConfig.easing} both`
      : 'none';

  const isHovered = activeState === 'hover' && isActive;
  const isClicked = activeState === 'click' && isActive;
  const shouldPlayKeyframes = activeState === 'load' || isHovered || isClicked;

  let Tag = params.tag || 'div';
  if (params.type === 'text') Tag = s.tag || 'p';
  if (params.type === 'checkbox' || params.type === 'radio') Tag = 'label';

  const isVoidElement = Tag === 'input' || Tag === 'img' || Tag === 'textarea';

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
    animation: shouldPlayKeyframes ? animationString : 'none',
    '--animation-intensity': stateConfig?.intensity || 1,
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: isClicked
      ? `scale(${s.activeScale || 0.95})`
      : isHovered
        ? `scale(${s.hoverScale || 1.02})`
        : 'scale(1)',
  };

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
    elementStyles.cursor = 'pointer';
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
    elementStyles.cursor = 'pointer';
    elementStyles.backgroundColor = 'transparent';
    elementStyles.border = 'none';
    elementStyles.width = 'auto';
    elementStyles.height = 'auto';
  }

  const elementProps = {
    onMouseEnter: () => setIsActive(true),
    onMouseLeave: () => setIsActive(false),
    onMouseDown: () => setIsActive(true),
    onMouseUp: () => setIsActive(false),
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

  const renderContent = () => {
    if (params.type === 'button') return s.text;
    if (params.type === 'text') return s.content;
    if (params.type === 'link') return s.text;
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
          !isActive && (activeState === 'hover' || activeState === 'click')
        }
      />

      {isVoidElement ? (
        <Tag key={`${activeState}-${localReplayKey}`} {...elementProps} />
      ) : (
        <Tag key={`${activeState}-${localReplayKey}`} {...elementProps}>
          {renderContent()}
        </Tag>
      )}
    </div>
  );
};

const PreviewArea = ({ params, refreshKey }) => {
  const [activeState, setActiveState] = useState('load');
  const [isGridView, setIsGridView] = useState(false);
  const [localReplays, setLocalReplays] = useState({ load: 0 });

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

  const handleLocalReplay = (stateId) => {
    setLocalReplays((prev) => ({
      ...prev,
      [stateId]: (prev[stateId] || 0) + 1,
    }));
  };

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

          {/* ВИПРАВЛЕНО: Кнопки станів повернено для режиму "Один стан" */}
          {!isGridView && (
            <div
              style={{
                display: 'flex',
                gap: '4px',
                borderLeft: '1px solid #E5E7EB',
                paddingLeft: '16px',
              }}
            >
              {states.map((state) => (
                <button
                  key={state.id}
                  onClick={() => setActiveState(state.id)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    background:
                      activeState === state.id ? '#111827' : 'transparent',
                    color: activeState === state.id ? '#D6F854' : '#6B7280',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {state.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ВИПРАВЛЕНО: Тепер активна кнопка чорна з лимонним текстом! */}
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
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s',
              boxShadow: !isGridView
                ? '0 4px 6px -1px rgba(0,0,0,0.1)'
                : 'none',
            }}
          >
            <Square size={14} /> Один стан
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
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s',
              boxShadow: isGridView ? '0 4px 6px -1px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            <Grid size={14} /> Вітрина
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
          backgroundImage: 'radial-gradient(#D1D5DB 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          display: isGridView ? 'grid' : 'flex',
          gridTemplateColumns: isGridView ? '1fr 1fr' : 'none',
          gridTemplateRows: isGridView ? '1fr 1fr' : 'none',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {isGridView ? (
          states.map((state) => (
            <div
              key={state.id}
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                borderRight:
                  state.id === 'static' || state.id === 'click'
                    ? '1px dashed #D1D5DB'
                    : 'none',
                borderBottom:
                  state.id === 'static' || state.id === 'hover'
                    ? '1px dashed #D1D5DB'
                    : 'none',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  background: '#ffffff',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: '1px solid #E5E7EB',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  zIndex: 5,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '12px',
                    fontWeight: '800',
                    color: '#111827',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {state.label}
                </div>
              </div>

              {state.id === 'load' && (
                <button
                  onClick={() => handleLocalReplay(state.id)}
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    zIndex: 10,
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
                  }}
                >
                  <RotateCcw size={12} /> Play
                </button>
              )}

              <AnimatedItem
                params={params}
                activeState={state.id}
                localReplayKey={localReplays[state.id] || 0}
              />
            </div>
          ))
        ) : (
          <AnimatedItem
            key={refreshKey}
            params={params}
            activeState={activeState}
            localReplayKey={0}
          />
        )}
      </div>
    </div>
  );
};

export default PreviewArea;
