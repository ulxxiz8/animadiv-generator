import React, { useState } from 'react';
import { RangeSlider, Button, ColorPicker } from '../../components/UIElements';
import { easingOptions } from '../../data/easingOptions';
import {
  getAvailablePresetsForType,
  PRESET_SUPPORTED_PARAMS,
} from '../../utils/semanticMapping';
import { MOTION_TOKENS } from '../../utils/motionTokens';
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
  Zap,
  Accessibility,
} from 'lucide-react';

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

  const currentAnimParams = params.animations[activeMotionState] || {};
  const currentPresetVal =
    currentAnimParams.effectPreset || currentAnimParams.presetId || 'none';
  const hasPreset = currentPresetVal !== 'none';
  const isPhysicsOn =
    currentAnimParams.usePhysics || currentPresetVal.startsWith('physics');

  // РОЗУМНА ФІЛЬТРАЦІЯ
  const getSupportedControls = () => {
    if (!hasPreset) return [];
    const presets = currentPresetVal.split('+');
    const paramsSet = new Set();

    paramsSet.add('motionToken');

    presets.forEach((p) => {
      let targetP = p;
      if (currentAnimParams.usePhysics) {
        if (p === 'scale') targetP = 'physicsScale';
        if (p === 'slide') targetP = 'physicsBounce';
      }
      const sp = PRESET_SUPPORTED_PARAMS[targetP] || [
        'duration',
        'delay',
        'easing',
        'intensity',
      ];
      sp.forEach((param) => paramsSet.add(param));
    });

    return Array.from(paramsSet);
  };

  const supportedControls = getSupportedControls();
  const isSupported = (key) => supportedControls.includes(key);

  const hasPlaybackParams =
    isSupported('iterationCount') ||
    isSupported('direction') ||
    isSupported('fillMode') ||
    isSupported('motionAxis');
  const hasVisualParams =
    isSupported('transformOrigin') ||
    isSupported('intensity') ||
    isSupported('blurAmount') ||
    isSupported('rotationAngle') ||
    isSupported('floatingAmount') ||
    isSupported('stagger') ||
    isSupported('scaleRange') ||
    isSupported('zoomIntensity') ||
    isSupported('hoverDepth');

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

  const handleAnimChange = (key, value) => {
    onUpdateAnimation(activeMotionState, key, value);
    if (key === 'effectPreset') {
      onUpdateAnimation(activeMotionState, 'presetId', value);
    }
  };

  const handleTokenApply = (tokenId) => {
    handleAnimChange('motionToken', tokenId);
    if (MOTION_TOKENS[tokenId] && tokenId !== 'custom') {
      const t = MOTION_TOKENS[tokenId];
      handleAnimChange('duration', t.duration);
      handleAnimChange('easing', t.easing);
      handleAnimChange('intensity', t.intensity);
      handleAnimChange('blurAmount', t.blurAmount);
      handleAnimChange('stagger', t.stagger);
    }
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

        {/* ============================================================== */}
        {/* ВКЛАДКА MOTION З 100% ФІЛЬТРАЦІЄЮ ПАРАМЕТРІВ */}
        {/* ============================================================== */}
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

            {isSupported('motionToken') && (
              <AccordionSection title="Preset Tokens" defaultOpen={true}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {Object.keys(MOTION_TOKENS || {}).map((tokenId) => (
                    <button
                      key={tokenId}
                      onClick={() => handleTokenApply(tokenId)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        border: '1px solid #E5E7EB',
                        background:
                          currentAnimParams.motionToken === tokenId
                            ? '#D6F854'
                            : '#F9FAFB',
                        color:
                          currentAnimParams.motionToken === tokenId
                            ? '#111827'
                            : '#6B7280',
                        fontSize: '12px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      {MOTION_TOKENS[tokenId].name.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </AccordionSection>
            )}

            <AccordionSection title="Core Behavior" defaultOpen={true}>
              {/* === ПЕРШИЙ БЛОК: Головний ефект (Завжди активний) === */}
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Primary Effect</label>
                <select
                  value={currentPresetVal.split('+')[0]}
                  onChange={(e) =>
                    handleAnimChange('effectPreset', e.target.value)
                  }
                  style={inputStyle}
                >
                  {getAvailablePresetsForType(
                    params.type,
                    activeMotionState
                  ).map((preset) => (
                    <option key={preset.id} value={preset.id}>
                      {preset.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* === ДРУГИЙ БЛОК: Комбінації (Тільки для базових ефектів) === */}
              {['none', 'fade', 'slide', 'scale'].includes(
                currentPresetVal.split('+')[0]
              ) && (
                <div
                  style={{
                    marginBottom: '16px',
                    opacity: hasPreset ? 1 : 0.4,
                    pointerEvents: hasPreset ? 'auto' : 'none',
                  }}
                >
                  <label style={labelStyle}>Combine with (Secondary)</label>
                  <select
                    value={
                      currentPresetVal.includes('+')
                        ? currentPresetVal.split('+')[1]
                        : 'none'
                    }
                    onChange={(e) => {
                      const primary = currentPresetVal.split('+')[0] || 'none';
                      const secondary = e.target.value;
                      const combined =
                        secondary === 'none'
                          ? primary
                          : `${primary}+${secondary}`;
                      handleAnimChange('effectPreset', combined);
                    }}
                    style={inputStyle}
                  >
                    <option value="none">No combination</option>
                    <option value="fade">Fade</option>
                    <option value="slide">Slide</option>
                    <option value="scale">Scale</option>
                    <option value="blur">Blur</option>
                    <option value="rotate">Rotate</option>
                  </select>
                </div>
              )}

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  opacity: hasPreset ? 1 : 0.4,
                  pointerEvents: hasPreset ? 'auto' : 'none',
                }}
              >
                {isSupported('duration') && (
                  <RangeSlider
                    label="Duration (ms)"
                    min={50}
                    max={3000}
                    step={50}
                    value={currentAnimParams.duration || 300}
                    unit=""
                    onChange={(val) => {
                      handleAnimChange('duration', val);
                      handleAnimChange('motionToken', 'custom');
                    }}
                  />
                )}
                {isSupported('delay') && (
                  <RangeSlider
                    label="Delay (ms)"
                    min={0}
                    max={2000}
                    step={50}
                    value={currentAnimParams.delay || 0}
                    unit=""
                    onChange={(val) => handleAnimChange('delay', val)}
                  />
                )}
                {isSupported('easing') && (
                  <div
                    style={{
                      opacity: isPhysicsOn ? 0.4 : 1,
                      pointerEvents: isPhysicsOn ? 'none' : 'auto',
                    }}
                  >
                    <label style={labelStyle}>Easing (Timing Function)</label>
                    <select
                      value={currentAnimParams.easing || 'ease'}
                      onChange={(e) => {
                        handleAnimChange('easing', e.target.value);
                        handleAnimChange('motionToken', 'custom');
                      }}
                      style={inputStyle}
                    >
                      {easingOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </AccordionSection>

            {/* ТЕПЕР PHYSICS ДІЙСНО З'ЯВИТЬСЯ ДЛЯ SCALE І SLIDE */}
            {isSupported('usePhysics') && (
              <AccordionSection title="Physics Engine" defaultOpen={false}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '700',
                    color: '#111827',
                    marginBottom: '16px',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={currentAnimParams.usePhysics || false}
                    onChange={(e) =>
                      handleAnimChange('usePhysics', e.target.checked)
                    }
                    style={{
                      width: '16px',
                      height: '16px',
                      accentColor: '#111827',
                    }}
                  />
                  <Zap
                    size={14}
                    color="#D6F854"
                    style={{
                      background: '#111827',
                      borderRadius: '4px',
                      padding: '2px',
                    }}
                  />{' '}
                  Enable Physics
                </label>
                <div
                  style={{
                    opacity: isPhysicsOn ? 1 : 0.4,
                    pointerEvents: isPhysicsOn ? 'auto' : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                  }}
                >
                  <RangeSlider
                    label="Stiffness (Жорсткість)"
                    min={10}
                    max={300}
                    step={5}
                    value={currentAnimParams.stiffness || 100}
                    unit=""
                    onChange={(val) => handleAnimChange('stiffness', val)}
                  />
                  <RangeSlider
                    label="Damping (Загасання/Тертя)"
                    min={2}
                    max={40}
                    step={1}
                    value={currentAnimParams.damping || 10}
                    unit=""
                    onChange={(val) => handleAnimChange('damping', val)}
                  />
                  <RangeSlider
                    label="Mass (Маса)"
                    min={0.1}
                    max={5}
                    step={0.1}
                    value={currentAnimParams.mass || 1}
                    unit=""
                    onChange={(val) => handleAnimChange('mass', val)}
                  />
                </div>
              </AccordionSection>
            )}

            {hasPlaybackParams && (
              <AccordionSection
                title="Playback & Direction"
                defaultOpen={false}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    opacity: hasPreset ? 1 : 0.4,
                    pointerEvents: hasPreset ? 'auto' : 'none',
                  }}
                >
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '12px',
                    }}
                  >
                    {isSupported('iterationCount') && (
                      <div>
                        <label style={labelStyle}>Iteration Count</label>
                        <select
                          value={currentAnimParams.iterationCount || 1}
                          onChange={(e) =>
                            handleAnimChange('iterationCount', e.target.value)
                          }
                          style={inputStyle}
                        >
                          <option value="1">1 (Once)</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="infinite">Infinite</option>
                        </select>
                      </div>
                    )}
                    {isSupported('direction') && (
                      <div>
                        <label style={labelStyle}>Direction</label>
                        <select
                          value={currentAnimParams.direction || 'normal'}
                          onChange={(e) =>
                            handleAnimChange('direction', e.target.value)
                          }
                          style={inputStyle}
                        >
                          <option value="normal">Normal</option>
                          <option value="reverse">Reverse</option>
                          <option value="alternate">Alternate</option>
                          <option value="alternate-reverse">Alt Reverse</option>
                        </select>
                      </div>
                    )}
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '12px',
                    }}
                  >
                    {isSupported('fillMode') && (
                      <div>
                        <label style={labelStyle}>Fill Mode</label>
                        <select
                          value={currentAnimParams.fillMode || 'both'}
                          onChange={(e) =>
                            handleAnimChange('fillMode', e.target.value)
                          }
                          style={inputStyle}
                        >
                          <option value="none">None</option>
                          <option value="forwards">Forwards</option>
                          <option value="backwards">Backwards</option>
                          <option value="both">Both</option>
                        </select>
                      </div>
                    )}
                    {isSupported('motionAxis') && (
                      <div>
                        <label style={labelStyle}>Motion Axis</label>
                        <select
                          value={currentAnimParams.motionAxis || 'all'}
                          onChange={(e) =>
                            handleAnimChange('motionAxis', e.target.value)
                          }
                          style={inputStyle}
                        >
                          <option value="all">All (X & Y)</option>
                          <option value="x">X Axis Only</option>
                          <option value="y">Y Axis Only</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              </AccordionSection>
            )}

            {hasVisualParams && (
              <AccordionSection title="Transform & Visuals" defaultOpen={false}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    opacity: hasPreset ? 1 : 0.4,
                    pointerEvents: hasPreset ? 'auto' : 'none',
                  }}
                >
                  {isSupported('transformOrigin') && (
                    <div>
                      <label style={labelStyle}>Transform Origin</label>
                      <select
                        value={currentAnimParams.transformOrigin || 'center'}
                        onChange={(e) =>
                          handleAnimChange('transformOrigin', e.target.value)
                        }
                        style={inputStyle}
                      >
                        <option value="center">Center</option>
                        <option value="top">Top</option>
                        <option value="bottom">Bottom</option>
                        <option value="left">Left</option>
                        <option value="right">Right</option>
                        <option value="top left">Top Left</option>
                        <option value="bottom right">Bottom Right</option>
                      </select>
                    </div>
                  )}

                  {isSupported('intensity') && (
                    <RangeSlider
                      label="Intensity / Deformation (%)"
                      min={0}
                      max={200}
                      step={1}
                      value={
                        currentAnimParams.intensity !== undefined
                          ? currentAnimParams.intensity
                          : 100
                      }
                      unit=""
                      onChange={(val) => {
                        handleAnimChange('intensity', val);
                        handleAnimChange('motionToken', 'custom');
                      }}
                    />
                  )}
                  {isSupported('zoomIntensity') && (
                    <RangeSlider
                      label="Zoom Intensity (%)"
                      min={0}
                      max={200}
                      step={1}
                      value={
                        currentAnimParams.zoomIntensity !== undefined
                          ? currentAnimParams.zoomIntensity
                          : 50
                      }
                      unit=""
                      onChange={(val) => handleAnimChange('zoomIntensity', val)}
                    />
                  )}
                  {isSupported('blurAmount') && (
                    <RangeSlider
                      label="Blur Amount (px)"
                      min={0}
                      max={50}
                      step={1}
                      value={currentAnimParams.blurAmount || 0}
                      unit=""
                      onChange={(val) => {
                        handleAnimChange('blurAmount', val);
                        handleAnimChange('motionToken', 'custom');
                      }}
                    />
                  )}
                  {isSupported('rotationAngle') && (
                    <RangeSlider
                      label="Rotation Angle (deg)"
                      min={-360}
                      max={360}
                      step={1}
                      value={currentAnimParams.rotationAngle || 0}
                      unit=""
                      onChange={(val) => handleAnimChange('rotationAngle', val)}
                    />
                  )}
                  {isSupported('floatingAmount') && (
                    <RangeSlider
                      label="Floating Distance (px)"
                      min={0}
                      max={100}
                      step={1}
                      value={currentAnimParams.floatingAmount || 15}
                      unit=""
                      onChange={(val) =>
                        handleAnimChange('floatingAmount', val)
                      }
                    />
                  )}
                  {isSupported('hoverDepth') && (
                    <RangeSlider
                      label="Hover Depth (px)"
                      min={0}
                      max={100}
                      step={1}
                      value={currentAnimParams.hoverDepth || 20}
                      unit=""
                      onChange={(val) => handleAnimChange('hoverDepth', val)}
                    />
                  )}
                  {isSupported('stagger') && (
                    <RangeSlider
                      label="Stagger Children (ms)"
                      min={0}
                      max={1000}
                      step={50}
                      value={currentAnimParams.stagger || 0}
                      unit=""
                      onChange={(val) => {
                        handleAnimChange('stagger', val);
                        handleAnimChange('motionToken', 'custom');
                      }}
                    />
                  )}

                  {isSupported('scaleRange') && (
                    <div>
                      <label style={labelStyle}>
                        Scale Range (Start &rarr; End)
                      </label>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '12px',
                        }}
                      >
                        <input
                          type="number"
                          step={0.1}
                          min={0}
                          max={5}
                          value={
                            currentAnimParams.scaleRange
                              ? currentAnimParams.scaleRange[0]
                              : 1
                          }
                          onChange={(e) =>
                            handleAnimChange('scaleRange', [
                              Number(e.target.value),
                              currentAnimParams.scaleRange[1],
                            ])
                          }
                          style={inputStyle}
                        />
                        <input
                          type="number"
                          step={0.1}
                          min={0}
                          max={5}
                          value={
                            currentAnimParams.scaleRange
                              ? currentAnimParams.scaleRange[1]
                              : 1
                          }
                          onChange={(e) =>
                            handleAnimChange('scaleRange', [
                              currentAnimParams.scaleRange[0],
                              Number(e.target.value),
                            ])
                          }
                          style={inputStyle}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </AccordionSection>
            )}

            <AccordionSection title="Accessibility" defaultOpen={false}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '700',
                  color: '#111827',
                  background: currentAnimParams.reduceMotion
                    ? '#FEF3C7'
                    : '#F9FAFB',
                  padding: '12px',
                  borderRadius: '12px',
                  border: currentAnimParams.reduceMotion
                    ? '1px solid #F59E0B'
                    : '1px solid #E5E7EB',
                  transition: 'all 0.2s',
                }}
              >
                <input
                  type="checkbox"
                  checked={currentAnimParams.reduceMotion || false}
                  onChange={(e) =>
                    handleAnimChange('reduceMotion', e.target.checked)
                  }
                  style={{
                    width: '16px',
                    height: '16px',
                    accentColor: '#D97706',
                  }}
                />
                <Accessibility
                  size={16}
                  color={currentAnimParams.reduceMotion ? '#D97706' : '#6B7280'}
                />
                Reduced Motion (Safe Mode)
              </label>
              <p
                style={{
                  fontSize: '11px',
                  color: '#6B7280',
                  marginTop: '8px',
                  lineHeight: 1.4,
                }}
              >
                Автоматично зрізає агресивні відскоки пружин, зменшує відстань
                зсуву та вимикає нескінченні циклічні анімації для комфорту
                вестибулярного апарату.
              </p>
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
