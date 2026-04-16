import React from 'react';
// Додаємо імпорт пресетів, щоб перевірити, чи є активний ефект
import { animationPresets } from '../../data/presets';

const PreviewArea = ({ params, refreshKey }) => {
  // Визначаємо тег динамічно
  const Tag = params.elementType || 'div';

  // 1. Формуємо рядок анімації
  // Приклад: "fade-in 800ms ease-out forwards"
  const activePreset = animationPresets.find((p) => p.id === params.presetId);
  // Знайди цей рядок (приблизно 12-й) і заміни на цей:
  const animationString = activePreset
    ? `ag_${activePreset.id} ${params.duration}ms ${params.easing} both`
    : 'none';

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
      {/* Заголовок області */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
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

      {/* Робоче поле */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#F3F4F6',
          borderRadius: '12px',
          border: '1px solid var(--border)',
          position: 'relative',
          overflow: 'hidden',
          backgroundImage: 'radial-gradient(#D1D5DB 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      >
        {/* Анімований об'єкт */}
        <Tag
          key={refreshKey}
          style={{
            // ТРЕТЯ ТАСКА: ДИНАМІЧНІ СТИЛІ КОЛЬОРУ ТА РОЗМІРУ
            width: `${params.size}px`,
            height: `${params.size}px`,
            backgroundColor: params.color,

            // Радіус залежить від типу
            borderRadius:
              params.elementType === 'span'
                ? '50%'
                : params.elementType === 'button'
                  ? '8px'
                  : '16px',

            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box',
            color: 'white',
            cursor: params.elementType === 'button' ? 'pointer' : 'default',
            border: 'none',
            outline: 'none',

            // МАГІЯ АНІМАЦІЇ: Підключаємо згенерований рядок
            animation: animationString,

            // Передаємо інтенсивність через CSS-змінну (якщо ти використовуєш її у своїх @keyframes)
            '--animation-intensity': params.intensity,
          }}
        >
          {/* Контент */}
          {params.elementType === 'button' && 'Button'}

          {params.elementType === 'div' && params.presetId}

          {params.elementType === 'article' && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <div
                style={{
                  width: '20px',
                  height: '4px',
                  background: 'rgba(255,255,255,0.5)',
                  borderRadius: '2px',
                }}
              ></div>
              <div
                style={{
                  width: '30px',
                  height: '4px',
                  background: 'rgba(255,255,255,0.5)',
                  borderRadius: '2px',
                }}
              ></div>
            </div>
          )}

          {params.elementType === 'span' && (
            <svg
              width={params.size * 0.6}
              height={params.size * 0.6}
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
    </div>
  );
};

export default PreviewArea;
