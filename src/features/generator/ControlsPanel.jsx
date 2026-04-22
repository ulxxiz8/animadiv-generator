import React, { useState } from 'react';
import {
  Select,
  RangeSlider,
  Button,
  ColorPicker,
} from '../../components/UIElements';
import { easingOptions } from '../../data/easingOptions';
import { animationPresets } from '../../data/presets';
import { elementTypes } from '../../data/defaultParams';

// ТАСКА: Оновлено пропси. Тепер ми отримуємо onUpdateDesign та onUpdateAnimation окремо
const ControlsPanel = ({
  params,
  onUpdateDesign,
  onUpdateAnimation,
  onReset,
  onReplay,
}) => {
  const [activeTab, setActiveTab] = useState('design'); // 'design' або 'motion'

  // НОВИЙ СТАН: Який саме тригер ми зараз налаштовуємо у вкладці Motion?
  const [activeMotionState, setActiveMotionState] = useState('load'); // 'load', 'hover' або 'click'

  // Дістаємо налаштування тільки для активного стану (щоб повзунки стрибали на правильні значення)
  const currentAnimParams = params.animations[activeMotionState];

  // Шукаємо поточний пресет для активного стану
  const currentPreset = animationPresets.find(
    (p) => p.id === currentAnimParams.presetId
  );
  const supportsIntensity = currentPreset
    ? currentPreset.supportsIntensity
    : false;

  const helperStyle = {
    fontSize: '11px',
    color: '#6b7280',
    marginTop: '4px',
    marginBottom: '10px',
    lineHeight: '1.2',
  };

  return (
    <div
      className="controls-panel"
      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      {/* ПАНЕЛЬ ВКЛАДОК (Глобальна) */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid var(--border)',
          marginBottom: '20px',
        }}
      >
        <button
          onClick={() => setActiveTab('design')}
          style={{
            flex: 1,
            padding: '12px 0',
            background: 'transparent',
            border: 'none',
            borderBottom:
              activeTab === 'design'
                ? '2px solid #4F46E5'
                : '2px solid transparent',
            color: activeTab === 'design' ? '#4F46E5' : '#6B7280',
            fontWeight: activeTab === 'design' ? '600' : '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          🎨 Design
        </button>
        <button
          onClick={() => setActiveTab('motion')}
          style={{
            flex: 1,
            padding: '12px 0',
            background: 'transparent',
            border: 'none',
            borderBottom:
              activeTab === 'motion'
                ? '2px solid #4F46E5'
                : '2px solid transparent',
            color: activeTab === 'motion' ? '#4F46E5' : '#6B7280',
            fontWeight: activeTab === 'motion' ? '600' : '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          ✨ Motion
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
        {/* ================= ВКЛАДКА DESIGN ================= */}
        {activeTab === 'design' && (
          <div>
            <section style={{ marginBottom: '16px' }}>
              <Select
                label="Тип елемента"
                options={elementTypes}
                value={params.elementType}
                onChange={(val) =>
                  onUpdateDesign('elementType', val)
                } /* Використовуємо onUpdateDesign */
              />
              <p style={helperStyle}>Як елемент буде виглядати в DOM.</p>
            </section>

            <section style={{ marginBottom: '16px' }}>
              <ColorPicker
                label="Колір елемента"
                value={params.color}
                onChange={(val) => onUpdateDesign('color', val)}
              />
              <p style={helperStyle}>Колір фону об'єкта або заливки SVG.</p>
            </section>

            <section style={{ marginBottom: '16px' }}>
              <RangeSlider
                label="Розмір елемента"
                min={24}
                max={140}
                step={1}
                value={params.size}
                unit="px"
                onChange={(val) => onUpdateDesign('size', val)}
              />
              <p style={helperStyle}>
                Базові габарити (ширина та висота) у пікселях.
              </p>
            </section>
          </div>
        )}

        {/* ================= ВКЛАДКА MOTION ================= */}
        {activeTab === 'motion' && (
          <div>
            {/* МІНІ-ВКЛАДКИ ДЛЯ СТАНІВ */}
            <div
              style={{
                display: 'flex',
                gap: '4px',
                background: '#F3F4F6',
                padding: '4px',
                borderRadius: '8px',
                marginBottom: '20px',
              }}
            >
              {['load', 'hover', 'click'].map((state) => (
                <button
                  key={state}
                  onClick={() => setActiveMotionState(state)}
                  style={{
                    flex: 1,
                    padding: '6px 0',
                    border: 'none',
                    borderRadius: '6px',
                    background:
                      activeMotionState === state ? '#fff' : 'transparent',
                    color: activeMotionState === state ? '#111827' : '#6B7280',
                    fontSize: '12px',
                    fontWeight: activeMotionState === state ? '600' : '500',
                    boxShadow:
                      activeMotionState === state
                        ? '0 1px 3px rgba(0,0,0,0.1)'
                        : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textTransform: 'capitalize',
                  }}
                >
                  {state}
                </button>
              ))}
            </div>

            <section style={{ marginBottom: '16px' }}>
              <Select
                label="Оберіть ефект"
                // Додаємо опцію "Без анімації" для Hover/Click
                options={[
                  { label: 'Без ефекту (None)', value: 'none' },
                  ...animationPresets.map((preset) => ({
                    label: preset.name,
                    value: preset.id,
                  })),
                ]}
                value={currentAnimParams.presetId}
                onChange={(val) =>
                  onUpdateAnimation(activeMotionState, 'presetId', val)
                } /* Використовуємо onUpdateAnimation */
              />
              <p style={helperStyle}>
                Анімація для стану <b>{activeMotionState.toUpperCase()}</b>.
              </p>
            </section>

            {/* Показуємо інші налаштування, ТІЛЬКИ ЯКЩО обрано якийсь ефект (не 'none') */}
            {currentAnimParams.presetId !== 'none' && (
              <>
                <section style={{ marginBottom: '16px' }}>
                  <Select
                    label="Тип згладжування (Easing)"
                    options={easingOptions}
                    value={currentAnimParams.easing}
                    onChange={(val) =>
                      onUpdateAnimation(activeMotionState, 'easing', val)
                    }
                  />
                  <p style={helperStyle}>Характер руху.</p>
                </section>

                <section style={{ marginBottom: '16px' }}>
                  <RangeSlider
                    label="Тривалість анімації"
                    min={50}
                    max={2000}
                    step={50}
                    value={currentAnimParams.duration}
                    unit="ms"
                    onChange={(val) =>
                      onUpdateAnimation(activeMotionState, 'duration', val)
                    }
                  />
                  <p style={helperStyle}>Час одного циклу.</p>
                </section>

                <section
                  style={{
                    marginBottom: '16px',
                    opacity: supportsIntensity ? 1 : 0.5,
                  }}
                >
                  <RangeSlider
                    label="Інтенсивність / Сила"
                    min={0}
                    max={100}
                    step={1}
                    value={currentAnimParams.intensity}
                    unit="%"
                    onChange={(val) =>
                      onUpdateAnimation(activeMotionState, 'intensity', val)
                    }
                    disabled={!supportsIntensity}
                  />
                  {supportsIntensity ? (
                    <p style={helperStyle}>Глибина або розмах ефекту.</p>
                  ) : (
                    <p style={helperStyle}>
                      Цей ефект не підтримує налаштування інтенсивності.
                    </p>
                  )}
                </section>
              </>
            )}
          </div>
        )}
      </div>

      {/* КНОПКИ ДІЙ */}
      <div
        style={{
          marginTop: '20px',
          paddingTop: '16px',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          gap: '10px',
        }}
      >
        <Button onClick={onReplay} style={{ flex: 1 }}>
          Відтворити
        </Button>
        <Button variant="secondary" onClick={onReset} style={{ flex: 1 }}>
          Скинути
        </Button>
      </div>
    </div>
  );
};

export default ControlsPanel;
