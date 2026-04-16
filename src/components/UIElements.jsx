import React from 'react';

// 1. Напис (Label)
export const Label = ({ children }) => (
  <label
    style={{
      fontSize: '12px',
      fontWeight: '700',
      color: 'var(--text-muted)',
      textTransform: 'uppercase',
      display: 'block',
      marginBottom: '8px',
    }}
  >
    {children}
  </label>
);

// 2. ОНОВЛЕНИЙ Повзунок (RangeSlider) з підтримкою disabled
export const RangeSlider = ({
  label,
  value,
  min,
  max,
  step,
  onChange,
  unit = '',
  disabled = false, // Додали цей параметр!
}) => (
  <div
    style={{ marginBottom: '16px', pointerEvents: disabled ? 'none' : 'auto' }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <Label>{label}</Label>
      <span
        style={{
          fontSize: '12px',
          fontWeight: '600',
          opacity: disabled ? 0.3 : 1,
        }}
      >
        {disabled ? '—' : `${value}${unit}`}
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      disabled={disabled}
      style={{
        width: '100%',
        accentColor: 'var(--primary)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.3 : 1,
      }}
    />
  </div>
);

// 3. Випадаючий список (Select)
export const Select = ({ label, options, value, onChange }) => (
  <div style={{ marginBottom: '16px' }}>
    <Label>{label}</Label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: '100%',
        padding: '10px',
        borderRadius: '6px',
        border: '1px solid var(--border)',
        background: 'white',
        fontSize: '14px',
        outline: 'none',
      }}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

// 4. Кнопка (Button)
export const Button = ({ children, onClick, variant = 'primary' }) => (
  <button
    onClick={onClick}
    style={{
      width: '100%',
      padding: '12px',
      borderRadius: '8px',
      border: 'none',
      fontWeight: '700',
      cursor: 'pointer',
      backgroundColor: variant === 'primary' ? 'var(--primary)' : '#E5E7EB',
      color: variant === 'primary' ? 'white' : 'var(--text-main)',
      transition: 'opacity 0.2s',
    }}
  >
    {children}
  </button>
);

// 5. Вибір кольору (ColorPicker)
export const ColorPicker = ({ label, value, onChange }) => (
  <div style={{ marginBottom: '16px' }}>
    <Label>{label}</Label>
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '40px',
          height: '40px',
          padding: '0',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          background: 'none',
        }}
      />
      <input
        type="text"
        value={value.toUpperCase()}
        onChange={(e) => onChange(e.target.value)}
        style={{
          flex: 1,
          padding: '10px',
          borderRadius: '6px',
          border: '1px solid var(--border)',
          background: 'white',
          fontSize: '14px',
          fontFamily: 'monospace',
          outline: 'none',
        }}
      />
    </div>
  </div>
);
