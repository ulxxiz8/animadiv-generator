import React, { useState } from 'react';
import { animationPresets } from '../../data/presets';

// --- НОВИЙ КОМПОНЕНТ: Анімований курсор-підказка ---
const HintCursor = ({ type, isVisible }) => {
  const animationStyle =
    type === 'hover'
      ? 'hint-hover 3s infinite ease-in-out'
      : 'hint-click 2s infinite ease-in-out';

  return (
    <div
      style={{
        position: 'absolute',
        right: '20%',
        bottom: '20%',
        opacity: isVisible ? 0.7 : 0,
        transition: 'opacity 0.3s ease',
        pointerEvents: 'none',
        animation: isVisible ? animationStyle : 'none',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          fontSize: '24px',
          filter: 'drop-shadow(0px 4px 4px rgba(0,0,0,0.2))',
        }}
      >
        {type === 'hover' ? '🖱️' : '👆'}
      </div>
      <div
        style={{
          background: '#111827',
          color: '#fff',
          fontSize: '10px',
          padding: '2px 6px',
          borderRadius: '4px',
          marginTop: '4px',
          fontWeight: 'bold',
        }}
      >
        {type === 'hover' ? 'Наведи' : 'Клікни'}
      </div>

      <style>{`
        @keyframes hint-hover {
          0%, 100% { transform: translate(20px, 20px); }
          50% { transform: translate(-10px, -10px); }
        }
        @keyframes hint-click {
          0%, 100% { transform: translateY(10px) scale(1); }
          50% { transform: translateY(-5px) scale(0.9); }
        }
      `}</style>
    </div>
  );
};

// --- ВНУТРІШНІЙ КОМПОНЕНТ: Елемент, що анімується ---
const AnimatedItem = ({ params, activeState, Tag }) => {
  const [triggerCount, setTriggerCount] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const stateConfig =
    params.animations[activeState === 'static' ? 'load' : activeState];
  const activePreset = animationPresets.find(
    (p) => p.id === stateConfig.presetId
  );

  const animationString =
    activePreset && activePreset.id !== 'none'
      ? `ag_${activePreset.id} ${stateConfig.duration}ms ${stateConfig.easing} both`
      : 'none';

  const handleMouseEnter = () => {
    if (activeState === 'hover') {
      setTriggerCount((c) => c + 1);
      setIsActive(true);
    }
  };

  const handleMouseLeave = () => {
    if (activeState === 'hover' || activeState === 'click') setIsActive(false);
  };

  const handleMouseDown = () => {
    if (activeState === 'click') {
      setTriggerCount((c) => c + 1);
      setIsActive(true);
    }
  };

  const handleMouseUp = () => {
    if (activeState === 'click') setIsActive(false);
  };

  const shouldPlayKeyframes =
    activeState === 'load' ||
    (activeState === 'hover' && isActive) ||
    (activeState === 'click' && isActive);

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: activeState !== 'static' ? 'pointer' : 'default',
        position: 'relative',
      }}
    >
      {(activeState === 'hover' || activeState === 'click') && (
        <HintCursor type={activeState} isVisible={!isActive} />
      )}

      <Tag
        key={`${activeState}-${triggerCount}`}
        // ТАСКА: ПІДКЛЮЧАЄМО КЛАСИ ДЛЯ ЗВ'ЯЗКУ З ГЕНЕРАТОРОМ
        className={`animadiv-element ${activeState === 'load' ? 'is-load' : ''}`}
        style={{
          width: `${params.size}px`,
          height: `${params.size}px`,
          backgroundColor: params.color,
          borderRadius:
            params.elementType === 'span'
              ? '50%'
              : params.elementType === 'button'
                ? '8px'
                : '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxSizing: 'border-box',
          color: 'white',
          border: 'none',
          outline: 'none',

          animation: shouldPlayKeyframes ? animationString : 'none',
          '--animation-intensity': stateConfig.intensity,

          // Ми залишаємо ці стилі тут для миттєвого відгуку в прев'ю,
          // але вони дублюють логіку класів для надійності
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          transform:
            activeState === 'click' && isActive
              ? 'scale(0.95)'
              : activeState === 'hover' && isActive
                ? 'scale(1.02)'
                : 'scale(1)',
          boxShadow:
            activeState === 'hover' && isActive
              ? '0 20px 25px -5px rgba(0,0,0,0.15)'
              : '0 10px 15px -3px rgba(0,0,0,0.1)',
        }}
      >
        {params.elementType === 'button' && (
          <span style={{ fontWeight: '600', letterSpacing: '0.5px' }}>
            Button
          </span>
        )}
        {params.elementType === 'div' && (
          <span style={{ fontSize: '24px' }}>✨</span>
        )}
        {params.elementType === 'article' && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            <div
              style={{
                width: '24px',
                height: '4px',
                background: 'rgba(255,255,255,0.8)',
                borderRadius: '2px',
              }}
            />
            <div
              style={{
                width: '32px',
                height: '4px',
                background: 'rgba(255,255,255,0.5)',
                borderRadius: '2px',
              }}
            />
          </div>
        )}
        {params.elementType === 'span' && (
          <svg
            width={params.size * 0.5}
            height={params.size * 0.5}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        )}
      </Tag>
    </div>
  );
};

// --- ОСНОВНИЙ КОМПОНЕНТ ---
const PreviewArea = ({ params, refreshKey }) => {
  const [activeState, setActiveState] = useState('load');
  const [isGridView, setIsGridView] = useState(false);

  const Tag = params.elementType || 'div';

  const states = [
    { id: 'static', label: 'Static', icon: '📍', desc: 'Стан спокою' },
    { id: 'hover', label: 'Hover', icon: '🖱️', desc: 'При наведенні' },
    { id: 'click', label: 'Click', icon: '🔘', desc: 'При кліку' },
    { id: 'load', label: 'Load', icon: '🚀', desc: 'При появі' },
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
      {!isGridView && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            padding: '12px',
            background: '#fff',
            borderRadius: '12px',
            border: '1px solid var(--border)',
            marginBottom: '20px',
          }}
        >
          {states.map((state) => (
            <button
              key={state.id}
              onClick={() => setActiveState(state.id)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background:
                  activeState === state.id ? '#EEF2FF' : 'transparent',
                color: activeState === state.id ? '#4F46E5' : '#6B7280',
                fontSize: '13px',
                fontWeight: activeState === state.id ? '700' : '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease',
              }}
            >
              <span>{state.icon}</span> {state.label}
            </button>
          ))}
        </div>
      )}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <h4
          style={{
            fontSize: '12px',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
          }}
        >
          Попередній перегляд
        </h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => setIsGridView(!isGridView)}
            style={{
              padding: '6px 12px',
              background: isGridView ? '#4F46E5' : '#F3F4F6',
              color: isGridView ? '#fff' : '#4B5563',
              border: '1px solid',
              borderColor: isGridView ? '#4F46E5' : '#D1D5DB',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {isGridView ? '⊞ Вітрина станів' : '🔲 Один стан'}
          </button>
          <span
            style={{
              fontSize: '12px',
              color: 'var(--primary)',
              fontWeight: '600',
            }}
          >
            {params.size}x{params.size}px
          </span>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          background: '#F3F4F6',
          borderRadius: '12px',
          border: '1px solid var(--border)',
          position: 'relative',
          overflow: 'hidden',
          backgroundImage: 'radial-gradient(#D1D5DB 1px, transparent 1px)',
          backgroundSize: '20px 20px',
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
                borderRight:
                  state.id === 'static' || state.id === 'click'
                    ? '1px dashed #D1D5DB'
                    : 'none',
                borderBottom:
                  state.id === 'static' || state.id === 'hover'
                    ? '1px dashed #D1D5DB'
                    : 'none',
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  background: 'rgba(255,255,255,0.9)',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: '600',
                  color: '#4B5563',
                  border: '1px solid #E5E7EB',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '2px',
                  zIndex: 5,
                }}
              >
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <span>{state.icon}</span> {state.label}
                </div>
                <span
                  style={{
                    fontSize: '9px',
                    color: '#9CA3AF',
                    fontWeight: 'normal',
                  }}
                >
                  {state.desc}
                </span>
              </div>
              <AnimatedItem params={params} activeState={state.id} Tag={Tag} />
            </div>
          ))
        ) : (
          <AnimatedItem
            key={refreshKey}
            params={params}
            activeState={activeState}
            Tag={Tag}
          />
        )}
      </div>
    </div>
  );
};

export default PreviewArea;
