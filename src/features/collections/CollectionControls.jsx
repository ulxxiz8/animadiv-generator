import React from 'react';
import { animationPresets } from '../../data/presets'; // Підтягуємо нашу бібліотеку анімацій

const CollectionControls = ({
  globalPreset,
  setGlobalPreset,
  staggerDelay,
  setStaggerDelay,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        height: '100%',
      }}
    >
      {/* СЕКЦІЯ 1: Глобальна анімація */}
      <div>
        <div
          style={{
            fontSize: '13px',
            fontWeight: '700',
            color: '#111827',
            textTransform: 'uppercase',
            marginBottom: '16px',
            letterSpacing: '0.05em',
          }}
        >
          Global Animation
          <span
            style={{
              display: 'block',
              fontSize: '10px',
              color: '#6B7280',
              textTransform: 'none',
              marginTop: '2px',
              letterSpacing: 'normal',
            }}
          >
            (Для всього набору)
          </span>
        </div>

        <label
          style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '8px',
          }}
        >
          Вибір пресету
        </label>
        <select
          value={globalPreset}
          onChange={(e) => setGlobalPreset(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: '8px',
            border: '1px solid #D1D5DB',
            fontSize: '14px',
            color: '#111827',
            background: '#fff',
            outline: 'none',
            cursor: 'pointer',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          }}
        >
          <option value="none">Без анімації</option>
          {animationPresets.map((preset) => (
            <option key={preset.id} value={preset.id}>
              {preset.name}
            </option>
          ))}
        </select>
      </div>

      {/* СЕКЦІЯ 2: Stagger Delay (Каскад) */}
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px',
          }}
        >
          <label
            style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}
          >
            Stagger delay
          </label>
          <span
            style={{
              fontSize: '12px',
              color: '#4F46E5',
              fontWeight: '700',
              background: '#EEF2FF',
              padding: '2px 6px',
              borderRadius: '4px',
            }}
          >
            {staggerDelay}ms
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="1000"
          step="50"
          value={staggerDelay}
          onChange={(e) => setStaggerDelay(Number(e.target.value))}
          style={{ width: '100%', cursor: 'pointer', accentColor: '#4F46E5' }}
        />
        <p
          style={{
            fontSize: '11px',
            color: '#9CA3AF',
            marginTop: '8px',
            lineHeight: '1.4',
          }}
        >
          Затримка між появою кожного наступного елемента (створює ефект
          каскаду).
        </p>
      </div>

      <hr
        style={{
          border: 'none',
          borderTop: '1px solid #E5E7EB',
          margin: '8px 0',
        }}
      />

      {/* СЕКЦІЯ 3: Заглушка для налаштувань конкретного елемента */}
      <div style={{ opacity: 0.5, marginTop: 'auto' }}>
        <div
          style={{
            fontSize: '13px',
            fontWeight: '700',
            color: '#111827',
            textTransform: 'uppercase',
            marginBottom: '8px',
            letterSpacing: '0.05em',
          }}
        >
          Налаштування елемента
        </div>
        <p
          style={{
            fontSize: '12px',
            color: '#6B7280',
            background: '#F3F4F6',
            padding: '12px',
            borderRadius: '8px',
            border: '1px dashed #D1D5DB',
          }}
        >
          Оберіть конкретний елемент на макеті, щоб розблокувати його дизайн
          (розміри, колір, тіні).
        </p>
      </div>
    </div>
  );
};

export default CollectionControls;
