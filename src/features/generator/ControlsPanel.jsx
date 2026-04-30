import React, { useState } from 'react';
import { RangeSlider, Button, ColorPicker } from '../../components/UIElements';
import { easingOptions } from '../../data/easingOptions';
import { animationPresets } from '../../data/presets';
import {
  Paintbrush,
  Activity,
  MousePointer2,
  CheckSquare,
  CircleDot,
  TextCursorInput,
  Square,
  Type,
  Image as ImageIcon,
  Link2,
  ChevronDown,
  ChevronUp,
  FormInput,
} from 'lucide-react';

// ВИПРАВЛЕНІ ІКОНКИ
const figmaElements = [
  {
    id: 'block',
    label: 'Container',
    icon: <Square size={16} strokeDasharray="2 2" />,
  },
  { id: 'button', label: 'Button', icon: <MousePointer2 size={16} /> },
  { id: 'input', label: 'Input', icon: <TextCursorInput size={16} /> },
  { id: 'textarea', label: 'Textarea', icon: <FormInput size={16} /> },
  { id: 'checkbox', label: 'Checkbox', icon: <CheckSquare size={16} /> },
  { id: 'radio', label: 'Radio', icon: <CircleDot size={16} /> },
  { id: 'text', label: 'Typography', icon: <Type size={16} /> },
  { id: 'image', label: 'Image', icon: <ImageIcon size={16} /> },
  { id: 'link', label: 'Link', icon: <Link2 size={16} /> },
];

const fontFamilies = [
  { label: 'Inter', value: 'Inter' },
  { label: 'Manrope', value: 'Manrope' },
  { label: 'Playfair Display', value: 'Playfair Display' },
  { label: 'JetBrains Mono', value: 'JetBrains Mono' },
];

const AccordionSection = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div style={{ borderBottom: '1px solid #E5E7EB' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: '#111827',
          fontWeight: '800',
          fontSize: '12px',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        {title}
        {isOpen ? (
          <ChevronUp size={16} color="#111827" />
        ) : (
          <ChevronDown size={16} color="#6B7280" />
        )}
      </button>
      {isOpen && (
        <div
          style={{
            padding: '0 24px 24px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

const ControlsPanel = ({
  params,
  onTypeChange,
  onStyleChange,
  onSpecificSettingChange,
  onUpdateAnimation,
  onReset,
  onReplay,
}) => {
  const [activeTab, setActiveTab] = useState('design');
  const [activeMotionState, setActiveMotionState] = useState('load');

  if (!params || !params.styles)
    return <div style={{ padding: 20 }}>Loading...</div>;

  const currentAnimParams = params.animations[activeMotionState];
  const supportsIntensity =
    animationPresets.find((p) => p.id === currentAnimParams?.presetId)
      ?.supportsIntensity || false;

  const inputStyle = {
    width: '100%',
    boxSizing: 'border-box',
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #D1D5DB',
    fontSize: '13px',
    outline: 'none',
    background: '#F9FAFB',
    color: '#111827',
    fontFamily: 'inherit',
  };
  const labelStyle = {
    fontSize: '12px',
    fontWeight: '700',
    color: '#6B7280',
    display: 'block',
    marginBottom: '6px',
  };

  const renderSettingField = (key, label, type, options = [], step = 1) => {
    const value = params.specificSettings[key];
    const onChange = (val) => onSpecificSettingChange(key, val);

    return (
      <div key={key}>
        <label style={labelStyle}>{label}</label>
        {type === 'select' && (
          <select
            value={value !== undefined ? value : ''}
            onChange={(e) => onChange(e.target.value)}
            style={inputStyle}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}
        {type === 'text' && (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            style={inputStyle}
          />
        )}
        {type === 'textarea' && (
          <textarea
            rows={3}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        )}
        {type === 'number' && (
          <input
            type="number"
            step={step}
            value={value !== undefined ? value : 0}
            onChange={(e) => onChange(Number(e.target.value))}
            style={inputStyle}
          />
        )}
        {type === 'color' && (
          <ColorPicker value={value || '#000000'} onChange={onChange} />
        )}
        {type === 'checkbox' && (
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '600',
              color: '#111827',
            }}
          >
            <input
              type="checkbox"
              checked={value || false}
              onChange={(e) => onChange(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: '#111827' }}
            />{' '}
            Увімкнути
          </label>
        )}
      </div>
    );
  };

  const renderSpecificSettings = () => {
    switch (params.type) {
      case 'block':
        return (
          <>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
              }}
            >
              {renderSettingField('alignX', 'Align X', 'select', [
                { label: 'Left', value: 'flex-start' },
                { label: 'Center', value: 'center' },
                { label: 'Right', value: 'flex-end' },
              ])}
              {renderSettingField('alignY', 'Align Y', 'select', [
                { label: 'Top', value: 'flex-start' },
                { label: 'Center', value: 'center' },
                { label: 'Bottom', value: 'flex-end' },
              ])}
            </div>
            {renderSettingField('gap', 'Gap (px)', 'number')}
            {renderSettingField('overflow', 'Overflow', 'select', [
              { label: 'Visible', value: 'visible' },
              { label: 'Hidden', value: 'hidden' },
            ])}
          </>
        );
      case 'button':
        return (
          <>
            {renderSettingField('text', 'Button Text', 'textarea')}
            {renderSettingField(
              'fontFamily',
              'Font Family',
              'select',
              fontFamilies
            )}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
              }}
            >
              {renderSettingField('fontSize', 'Font Size (px)', 'number')}
              {renderSettingField('fontWeight', 'Weight', 'select', [
                { label: 'Normal', value: 400 },
                { label: 'Semibold', value: 600 },
                { label: 'Bold', value: 700 },
              ])}
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
              }}
            >
              {renderSettingField('hoverBackground', 'Hover Fill', 'color')}
              {renderSettingField('hoverColor', 'Hover Text', 'color')}
            </div>
          </>
        );
      case 'input':
        return (
          <>
            {renderSettingField('placeholder', 'Placeholder', 'text')}
            {renderSettingField(
              'fontFamily',
              'Font Family',
              'select',
              fontFamilies
            )}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
              }}
            >
              {renderSettingField('fontSize', 'Font Size (px)', 'number')}
              {renderSettingField('inputType', 'Type', 'select', [
                { label: 'Text', value: 'text' },
                { label: 'Password', value: 'password' },
              ])}
            </div>
            {renderSettingField('focusBorderColor', 'Focus Border', 'color')}
          </>
        );
      case 'text':
        return (
          <>
            {renderSettingField('content', 'Text Content', 'textarea')}
            {renderSettingField(
              'fontFamily',
              'Font Family',
              'select',
              fontFamilies
            )}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
              }}
            >
              {renderSettingField('fontSize', 'Font Size (px)', 'number')}
              {renderSettingField('fontWeight', 'Weight', 'select', [
                { label: 'Normal', value: 400 },
                { label: 'Bold', value: 700 },
                { label: 'Black', value: 900 },
              ])}
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
              }}
            >
              {renderSettingField(
                'lineHeight',
                'Line Height',
                'number',
                [],
                0.1
              )}
              {renderSettingField('textAlign', 'Alignment', 'select', [
                { label: 'Left', value: 'left' },
                { label: 'Center', value: 'center' },
                { label: 'Right', value: 'right' },
              ])}
            </div>
          </>
        );
      case 'checkbox':
      case 'radio':
        return (
          <>
            {renderSettingField('checked', 'Default Checked', 'checkbox')}
            {renderSettingField('label', 'Label Text', 'textarea')}
            {renderSettingField(
              'fontFamily',
              'Font Family',
              'select',
              fontFamilies
            )}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
              }}
            >
              {renderSettingField('fontSize', 'Font Size (px)', 'number')}
              {renderSettingField('fontWeight', 'Weight', 'select', [
                { label: 'Normal', value: 400 },
                { label: 'Medium', value: 500 },
                { label: 'Semibold', value: 600 },
                { label: 'Bold', value: 700 },
              ])}
            </div>
            {/* ВИПРАВЛЕНО: Більше не в одній лінійці з Color Picker, щоб повзунок не стискався */}
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              {renderSettingField('size', 'Icon Size (px)', 'number')}
              {params.type === 'checkbox'
                ? renderSettingField('checkColor', 'Mark Color', 'color')
                : renderSettingField('color', 'Accent Color', 'color')}
            </div>
          </>
        );
      // ВІДНОВЛЕНО: Налаштування для Image
      case 'image':
        return (
          <>
            {renderSettingField('src', 'Image URL', 'text')}
            {renderSettingField('objectFit', 'Object Fit', 'select', [
              { label: 'Cover', value: 'cover' },
              { label: 'Contain', value: 'contain' },
            ])}
          </>
        );
      // ВІДНОВЛЕНО: Налаштування для Link
      case 'link':
        return (
          <>
            {renderSettingField('text', 'Link Text', 'text')}
            {renderSettingField(
              'fontFamily',
              'Font Family',
              'select',
              fontFamilies
            )}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
              }}
            >
              {renderSettingField('fontSize', 'Font Size (px)', 'number')}
              {renderSettingField('fontWeight', 'Weight', 'select', [
                { label: 'Normal', value: 400 },
                { label: 'Medium', value: 500 },
                { label: 'Bold', value: 700 },
              ])}
            </div>
            {renderSettingField('hoverColor', 'Hover Color', 'color')}
          </>
        );
      case 'textarea':
        return (
          <>
            {renderSettingField('placeholder', 'Placeholder', 'text')}
            {renderSettingField(
              'fontFamily',
              'Font Family',
              'select',
              fontFamilies
            )}
            {renderSettingField('focusBorderColor', 'Focus Border', 'color')}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="controls-panel"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: '#ffffff',
        overflowY: 'auto',
        borderRadius: '12px',
      }}
    >
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid #E5E7EB',
          position: 'sticky',
          top: 0,
          background: '#fff',
          zIndex: 10,
        }}
      >
        <button
          onClick={() => setActiveTab('design')}
          style={{
            flex: 1,
            padding: '16px 0',
            background: 'transparent',
            border: 'none',
            borderBottom:
              activeTab === 'design'
                ? '2px solid #111827'
                : '2px solid transparent',
            color: activeTab === 'design' ? '#111827' : '#9CA3AF',
            fontWeight: activeTab === 'design' ? '800' : '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <Paintbrush size={16} /> Design
        </button>
        <button
          onClick={() => setActiveTab('motion')}
          style={{
            flex: 1,
            padding: '16px 0',
            background: 'transparent',
            border: 'none',
            borderBottom:
              activeTab === 'motion'
                ? '2px solid #111827'
                : '2px solid transparent',
            color: activeTab === 'motion' ? '#111827' : '#9CA3AF',
            fontWeight: activeTab === 'motion' ? '800' : '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <Activity size={16} /> Motion
        </button>
      </div>

      <div style={{ flex: 1 }}>
        {activeTab === 'design' && (
          <>
            <AccordionSection title="Component Type" defaultOpen={true}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '8px',
                  background: '#F9FAFB',
                  padding: '12px',
                  borderRadius: '16px',
                  border: '1px solid #E5E7EB',
                }}
              >
                {figmaElements.map((el) => (
                  <button
                    key={el.id}
                    onClick={() => onTypeChange(el.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 12px',
                      border: 'none',
                      borderRadius: '12px',
                      background:
                        params.type === el.id ? '#111827' : 'transparent',
                      color: params.type === el.id ? '#ffffff' : '#6B7280',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      textAlign: 'left',
                      boxShadow:
                        params.type === el.id
                          ? '0 4px 6px -1px rgba(0,0,0,0.1)'
                          : 'none',
                    }}
                  >
                    <span
                      style={{
                        color: params.type === el.id ? '#D6F854' : '#9CA3AF',
                      }}
                    >
                      {el.icon}
                    </span>{' '}
                    {el.label}
                  </button>
                ))}
              </div>
            </AccordionSection>
            {params.specificSettings &&
              Object.keys(params.specificSettings).length > 0 && (
                <AccordionSection title="Specific Settings" defaultOpen={true}>
                  {renderSpecificSettings()}
                </AccordionSection>
              )}
            <AccordionSection
              title="Dimensions & Box Model"
              defaultOpen={false}
            >
              <RangeSlider
                label="Width (px)"
                min={20}
                max={600}
                step={1}
                value={params.styles.width || 0}
                unit=""
                onChange={(val) => onStyleChange('width', val)}
              />
              {params.type !== 'text' && params.type !== 'link' && (
                <RangeSlider
                  label="Height (px)"
                  min={20}
                  max={600}
                  step={1}
                  value={params.styles.height || 0}
                  unit=""
                  onChange={(val) => onStyleChange('height', val)}
                />
              )}
              <RangeSlider
                label="Padding (px)"
                min={0}
                max={100}
                step={1}
                value={parseInt(params.styles.padding) || 0}
                unit=""
                onChange={(val) => onStyleChange('padding', `${val}px`)}
              />
            </AccordionSection>
            <AccordionSection title="Appearance" defaultOpen={false}>
              {params.type !== 'image' && (
                <ColorPicker
                  label="Background Fill"
                  value={params.styles.backgroundColor || 'transparent'}
                  onChange={(val) => onStyleChange('backgroundColor', val)}
                />
              )}
              {params.type !== 'image' && (
                <ColorPicker
                  label="Text Color"
                  value={params.styles.color || '#111827'}
                  onChange={(val) => onStyleChange('color', val)}
                />
              )}
              <RangeSlider
                label="Opacity"
                min={0}
                max={1}
                step={0.05}
                value={
                  params.styles.opacity !== undefined
                    ? params.styles.opacity
                    : 1
                }
                unit=""
                onChange={(val) => onStyleChange('opacity', val)}
              />
              {params.type !== 'text' && params.type !== 'link' && (
                <>
                  <RangeSlider
                    label="Corner Radius (px)"
                    min={0}
                    max={100}
                    step={1}
                    value={params.styles.borderRadius || 0}
                    unit=""
                    onChange={(val) => onStyleChange('borderRadius', val)}
                  />
                  <RangeSlider
                    label="Border Width (px)"
                    min={0}
                    max={20}
                    step={1}
                    value={params.styles.borderWidth || 0}
                    unit=""
                    onChange={(val) => onStyleChange('borderWidth', val)}
                  />
                  {params.styles.borderWidth > 0 && (
                    <ColorPicker
                      label="Border Color"
                      value={params.styles.borderColor || '#E5E7EB'}
                      onChange={(val) => onStyleChange('borderColor', val)}
                    />
                  )}
                </>
              )}
            </AccordionSection>
          </>
        )}
        {activeTab === 'motion' && (
          <>
            <AccordionSection title="Trigger State" defaultOpen={true}>
              <div
                style={{
                  display: 'flex',
                  gap: '4px',
                  background: '#F9FAFB',
                  padding: '6px',
                  borderRadius: '12px',
                  border: '1px solid #E5E7EB',
                }}
              >
                {['load', 'hover', 'click'].map((state) => (
                  <button
                    key={state}
                    onClick={() => setActiveMotionState(state)}
                    style={{
                      flex: 1,
                      padding: '10px 0',
                      border: 'none',
                      borderRadius: '8px',
                      background:
                        activeMotionState === state ? '#111827' : 'transparent',
                      color:
                        activeMotionState === state ? '#D6F854' : '#6B7280',
                      fontSize: '13px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {state}
                  </button>
                ))}
              </div>
            </AccordionSection>
            <AccordionSection title="Animation Properties" defaultOpen={true}>
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Effect Preset</label>
                <select
                  value={currentAnimParams.presetId}
                  onChange={(e) =>
                    onUpdateAnimation(
                      activeMotionState,
                      'presetId',
                      e.target.value
                    )
                  }
                  style={inputStyle}
                >
                  <option value="none">Без ефекту (None)</option>
                  {animationPresets.map((preset) => (
                    <option key={preset.id} value={preset.id}>
                      {preset.name}
                    </option>
                  ))}
                </select>
              </div>
              {currentAnimParams.presetId !== 'none' && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                  }}
                >
                  <div>
                    <label style={labelStyle}>Easing Curve</label>
                    <select
                      value={currentAnimParams.easing}
                      onChange={(e) =>
                        onUpdateAnimation(
                          activeMotionState,
                          'easing',
                          e.target.value
                        )
                      }
                      style={inputStyle}
                    >
                      {easingOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <RangeSlider
                    label="Duration (ms)"
                    min={50}
                    max={2000}
                    step={50}
                    value={currentAnimParams.duration}
                    unit=""
                    onChange={(val) =>
                      onUpdateAnimation(activeMotionState, 'duration', val)
                    }
                  />
                  <div
                    style={{
                      opacity: supportsIntensity ? 1 : 0.4,
                      pointerEvents: supportsIntensity ? 'auto' : 'none',
                    }}
                  >
                    <RangeSlider
                      label="Intensity (%)"
                      min={0}
                      max={100}
                      step={1}
                      value={currentAnimParams.intensity}
                      unit=""
                      onChange={(val) =>
                        onUpdateAnimation(activeMotionState, 'intensity', val)
                      }
                    />
                  </div>
                </div>
              )}
            </AccordionSection>
          </>
        )}
      </div>

      <div
        style={{
          padding: '20px 24px',
          borderTop: '1px solid #E5E7EB',
          display: 'flex',
          gap: '12px',
          background: '#F9FAFB',
          borderBottomLeftRadius: '12px',
          borderBottomRightRadius: '12px',
        }}
      >
        <Button
          onClick={onReplay}
          style={{ flex: 1, background: '#111827', color: '#D6F854' }}
        >
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
