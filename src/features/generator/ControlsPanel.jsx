import React from 'react';
import {
  Select,
  RangeSlider,
  Button,
  ColorPicker,
} from '../../components/UIElements';
import { easingOptions } from '../../data/easingOptions';
import { animationPresets } from '../../data/presets';
import { elementTypes } from '../../data/defaultParams';

const ControlsPanel = ({ params, onUpdate, onReset, onReplay }) => {
  // Шукаємо поточний пресет, щоб дізнатися, чи підтримує він інтенсивність
  const currentPreset = animationPresets.find((p) => p.id === params.presetId);
  const supportsIntensity = currentPreset
    ? currentPreset.supportsIntensity
    : false;

  // ТАСКА 1: Єдиний стиль для всіх підказок (щоб код був чистим)
  const helperStyle = {
    fontSize: '11px',
    color: '#6b7280', // muted gray
    marginTop: '4px',
    marginBottom: '10px',
    lineHeight: '1.2',
  };

  return (
    <div className="controls-panel">
      <h2>Налаштування</h2>

      {/* Завдання 1: Тип елемента */}
      <section style={{ marginBottom: '16px' }}>
        <Select
          label="Тип елемента"
          options={elementTypes}
          value={params.elementType}
          onChange={(val) => onUpdate('elementType', val)}
        />
        <p style={helperStyle}>
          Як елемент буде виглядати в DOM (кнопка, іконка, блок).
        </p>
      </section>

      {/* Завдання 2: Ефект анімації */}
      <section style={{ marginBottom: '16px' }}>
        <Select
          label="Оберіть ефект"
          options={animationPresets.map((preset) => ({
            label: preset.name,
            value: preset.id,
          }))}
          value={params.presetId}
          onChange={(val) => onUpdate('presetId', val)}
        />
        <p style={helperStyle}>Готовий шаблон траєкторії та поведінки.</p>
      </section>

      {/* Лінія-розділювач */}
      <hr
        style={{
          margin: '20px 0',
          border: 'none',
          borderTop: '1px solid var(--border)',
        }}
      />

      {/* Завдання 3: Вибір кольору */}
      <section style={{ marginBottom: '16px' }}>
        <ColorPicker
          label="Колір елемента"
          value={params.color}
          onChange={(val) => onUpdate('color', val)}
        />
        <p style={helperStyle}>Колір фону об'єкта або заливки SVG-іконки.</p>
      </section>

      {/* Завдання 6: Easing */}
      <section style={{ marginTop: '16px', marginBottom: '16px' }}>
        <Select
          label="Тип згладжування (Easing)"
          options={easingOptions}
          value={params.easing}
          onChange={(val) => onUpdate('easing', val)}
        />
        <p style={helperStyle}>
          Характер руху (наприклад: плавний старт, відскок, лінійний).
        </p>
      </section>

      {/* Завдання 5: Тривалість */}
      <section style={{ marginBottom: '16px' }}>
        <RangeSlider
          label="Тривалість анімації"
          min={200}
          max={2000}
          step={50}
          value={params.duration}
          unit="ms"
          onChange={(val) => onUpdate('duration', val)}
        />
        <p style={helperStyle}>
          Час (у мілісекундах), за який завершується один цикл.
        </p>
      </section>

      {/* Завдання 7: Інтенсивність */}
      <section
        style={{ marginBottom: '16px', opacity: supportsIntensity ? 1 : 0.5 }}
      >
        <RangeSlider
          label="Інтенсивність / Сила"
          min={0}
          max={100}
          step={1}
          value={params.intensity}
          unit="%"
          onChange={(val) => onUpdate('intensity', val)}
          disabled={!supportsIntensity}
        />
        {supportsIntensity ? (
          <p style={helperStyle}>
            Глибина або розмах застосованого ефекту трансформації.
          </p>
        ) : (
          <p style={helperStyle}>
            Цей ефект не підтримує налаштування інтенсивності.
          </p>
        )}
      </section>

      {/* Завдання 4: Розмір */}
      <section style={{ marginBottom: '16px' }}>
        <RangeSlider
          label="Розмір елемента"
          min={24}
          max={140}
          step={1}
          value={params.size}
          unit="px"
          onChange={(val) => onUpdate('size', val)}
        />
        <p style={helperStyle}>
          Базові габарити (ширина та висота) у пікселях.
        </p>
      </section>

      {/* Завдання 8 і 9: Кнопки дій */}
      <div style={{ marginTop: '24px', display: 'flex', gap: '10px' }}>
        <Button onClick={onReplay}>Відтворити знову</Button>
        <Button variant="secondary" onClick={onReset}>
          Скинути
        </Button>
      </div>
    </div>
  );
};

export default ControlsPanel;
