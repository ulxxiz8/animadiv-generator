import React from 'react';

// 1. Напис (Label)
export const Label = ({ children }) => (
  <label
    style={{
      fontSize: '12px',
      fontWeight: '700',
      color: '#6B7280',
      textTransform: 'uppercase',
      display: 'block',
      marginBottom: '8px',
      letterSpacing: '0.05em',
    }}
  >
    {children}
  </label>
);

// 2. ОНОВЛЕНИЙ Повзунок (RangeSlider) з підтримкою disabled
export const RangeSlider = ({
  label,
  min,
  max,
  step,
  value,
  unit,
  onChange,
  disabled,
}) => {
  return (
    <div
      style={{
        width: '100%',
        opacity: disabled ? 0.5 : 1,
        pointerEvents: disabled ? 'none' : 'auto',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '8px',
        }}
      >
        <label
          style={{ fontSize: '12px', fontWeight: '700', color: '#6B7280' }}
        >
          {label}
        </label>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{ flex: 1, accentColor: '#111827', cursor: 'pointer' }}
        />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: '#F9FAFB',
            border: '1px solid #D1D5DB',
            borderRadius: '6px',
            overflow: 'hidden',
            width: '70px',
          }}
        >
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            style={{
              width: '100%',
              border: 'none',
              background: 'transparent',
              padding: '6px',
              fontSize: '13px',
              fontWeight: '600',
              color: '#111827',
              textAlign: 'center',
              outline: 'none',
              appearance: 'textfield',
            }}
          />
        </div>
      </div>
    </div>
  );
};

// 3. Випадаючий список (Select)
export const Select = ({ label, options, value, onChange }) => (
  <div style={{ marginBottom: '20px' }}>
    <Label>{label}</Label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: '100%',
        padding: '10px 12px',
        borderRadius: '8px',
        border: '1px solid #D1D5DB',
        background: '#fff',
        fontSize: '14px',
        color: '#111827',
        outline: 'none',
        cursor: 'pointer',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
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
      fontWeight: '600',
      fontSize: '14px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      backgroundColor: variant === 'primary' ? '#111827' : '#F3F4F6',
      color: variant === 'primary' ? '#fff' : '#374151',
    }}
    onMouseEnter={(e) => (e.target.style.opacity = '0.9')}
    onMouseLeave={(e) => (e.target.style.opacity = '1')}
  >
    {children}
  </button>
);

// 5. Вибір кольору (ColorPicker)
export const ColorPicker = ({ label, value, onChange }) => (
  <div style={{ marginBottom: '20px' }}>
    <Label>{label}</Label>
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '38px',
          height: '38px',
          padding: '0',
          border: '1px solid #E5E7EB',
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
          padding: '10px 12px',
          borderRadius: '8px',
          border: '1px solid #D1D5DB',
          background: '#fff',
          fontSize: '13px',
          fontFamily: 'monospace',
          outline: 'none',
          color: '#374151',
        }}
      />
    </div>
  </div>
);
