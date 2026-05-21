import React, { useEffect, useMemo, useState } from 'react';
import { RangeSlider, Button, ColorPicker } from '../../components/UIElements';
import { easingOptions } from '../../data/easingOptions';
import {
  getAvailablePresetsForType,
  isStateAllowedForType,
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

const panelBlockStyle = {
  maxWidth: '100%',
  minWidth: 0,
  boxSizing: 'border-box',
};

const twoColumnGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
  gap: '12px',
  ...panelBlockStyle,
};

const AccordionSection = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div
      style={{ borderBottom: '1px solid var(--border)', ...panelBlockStyle }}
    >
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
          color: 'var(--text-main)',
          fontWeight: '800',
          fontSize: '12px',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          ...panelBlockStyle,
          overflowWrap: 'anywhere',
          wordBreak: 'break-word',
        }}
      >
        {title}
        {isOpen ? (
          <ChevronUp size={16} color="currentColor" />
        ) : (
          <ChevronDown size={16} color="currentColor" />
        )}
      </button>
      {isOpen && (
        <div
          style={{
            padding: '0 24px 24px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            ...panelBlockStyle,
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
  activeMotionState: controlledActiveMotionState,
  onActiveMotionStateChange,
  onTypeChange,
  onStyleChange,
  onSpecificSettingChange,
  onUpdateAnimation,
  onReset,
  onReplay,
}) => {
  const [activeTab, setActiveTab] = useState('design');
  const [localActiveMotionState, setLocalActiveMotionState] = useState('load');
  const activeMotionState =
    controlledActiveMotionState || localActiveMotionState;
  const setActiveMotionState =
    onActiveMotionStateChange || setLocalActiveMotionState;
  const allowedMotionStates = useMemo(
    () =>
      ['load', 'hover', 'click'].filter((state) =>
        isStateAllowedForType(state, params?.type)
      ),
    [params?.type]
  );
  const currentMotionState = allowedMotionStates.includes(activeMotionState)
    ? activeMotionState
    : allowedMotionStates[0] || 'load';

  useEffect(() => {
    if (
      !allowedMotionStates.includes(activeMotionState) &&
      currentMotionState
    ) {
      setActiveMotionState(currentMotionState);
    }
  }, [
    activeMotionState,
    allowedMotionStates,
    currentMotionState,
    setActiveMotionState,
  ]);

  const currentAnimParams = params?.animations?.[currentMotionState] || {
    presetId: 'none',
  };
  const availablePresets = useMemo(
    () => getAvailablePresetsForType(params?.type, currentMotionState),
    [params?.type, currentMotionState]
  );
  const availablePresetIds = useMemo(
    () => new Set(availablePresets.map((preset) => preset.id)),
    [availablePresets]
  );
  const defaultPresetId = useMemo(
    () => availablePresets.find((preset) => preset.id !== 'none')?.id || 'none',
    [availablePresets]
  );
  const scaleRange = currentAnimParams.scaleRange || [1, 1];
  const rawPresetVal = currentAnimParams.presetId || 'none';
  const currentPresetVal = availablePresetIds.has(rawPresetVal)
    ? rawPresetVal
    : 'none';
  const hasPreset = currentPresetVal !== 'none';
  const isPhysicsOn =
    currentAnimParams.usePhysics || currentPresetVal.startsWith('physics');

  useEffect(() => {
    if (params && rawPresetVal !== currentPresetVal) {
      onUpdateAnimation(currentMotionState, 'presetId', currentPresetVal);
    }
  }, [
    currentMotionState,
    currentPresetVal,
    onUpdateAnimation,
    params,
    rawPresetVal,
  ]);

  useEffect(() => {
    if (params && currentPresetVal === 'none' && defaultPresetId !== 'none') {
      onUpdateAnimation(currentMotionState, 'presetId', defaultPresetId);
    }
  }, [
    currentMotionState,
    currentPresetVal,
    defaultPresetId,
    onUpdateAnimation,
    params,
  ]);

  if (!params || !params.styles)
    return <div style={{ padding: 20 }}>Loading...</div>;

  // РОЗУМНА ФІЛЬТРАЦІЯ ЧЕРЕЗ UNIFIED CONTRACT
  const getSupportedControls = () => {
    if (!hasPreset) return [];
    const paramsSet = new Set();

    let targetId = currentPresetVal;
    // Фізика - це окремий рушій, який замінює базові пресети
    if (currentAnimParams.usePhysics) {
      if (currentPresetVal === 'scale') targetId = 'physicsScale';
      if (currentPresetVal === 'slide') targetId = 'physicsBounce';
    }

    // ✅ БЕРЕМО КОНТРАКТ ІЗ БАЗИ ДАНИХ
    const supportedParams = PRESET_SUPPORTED_PARAMS[targetId] || [];

    // Додаємо всі підтримувані параметри з контракту у загальний список
    supportedParams.forEach((param) => paramsSet.add(param));
    return Array.from(paramsSet);
  };

  const supportedControls = getSupportedControls();

  // 🛑 СУВОРИЙ АУДИТ: Тільки ті параметри, які реально підключені до рушія
  const WORKING_CONTROLS = [
    'duration',
    'delay',
    'easing',
    'intensity',
    'iterationCount',
    'direction',
    'fillMode',
    'motionAxis',
    'transformOrigin',
    'scaleRange',
    'rotationAngle',
    'blurAmount',
    'floatingAmount',
    'hoverDepth',
    'zoomIntensity',
    'usePhysics',
    'stiffness',
    'damping',
    'mass',
    'stagger',
  ];

  const isSupported = (key) => {
    // 1. Відсікаємо все, що не імплементовано в рушії (напр. zoomIntensity)
    if (!WORKING_CONTROLS.includes(key)) return false;

    // 2. Відсікаємо stagger для елементів, які не розбиваються на літери
    if (
      ['iterationCount', 'fillMode'].includes(key) &&
      currentMotionState !== 'load'
    ) {
      return false;
    }

    // 3. Якщо перевірку пройдено - перевіряємо, чи підтримує це поточний пресет
    return supportedControls.includes(key);
  };
  const hasPlaybackParams = isSupported('direction');
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
    maxWidth: '100%',
    minWidth: 0,
    boxSizing: 'border-box',
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid var(--control-border)',
    fontSize: '13px',
    outline: 'none',
    background: 'var(--control-bg)',
    color: 'var(--text-main)',
    fontFamily: 'inherit',
  };
  const labelStyle = {
    fontSize: '12px',
    fontWeight: '700',
    color: 'var(--text-muted)',
    display: 'block',
    marginBottom: '6px',
    maxWidth: '100%',
    overflowWrap: 'anywhere',
    wordBreak: 'break-word',
  };

  const isTextLike = params.type === 'text' || params.type === 'link';
  const isChoiceControl = params.type === 'checkbox' || params.type === 'radio';
  const showWidthControl = !isChoiceControl;
  const showHeightControl = !isTextLike && !isChoiceControl;
  const showPaddingControl = !isChoiceControl;
  const showBackgroundControl =
    params.type !== 'image' &&
    params.type !== 'text' &&
    params.type !== 'link' &&
    !isChoiceControl;
  const showTextColorControl = params.type !== 'image';
  const showOpacityControl = !isChoiceControl;
  const showBorderControls = !isTextLike && !isChoiceControl;
  const showShadowControls = [
    'button',
    'block',
    'image',
    'input',
    'textarea',
  ].includes(params.type);
  const hasDimensionControls =
    showWidthControl || showHeightControl || showPaddingControl;
  const hasAppearanceControls =
    showBackgroundControl ||
    showTextColorControl ||
    showOpacityControl ||
    showBorderControls ||
    showShadowControls;

  const handleAnimChange = (key, value) => {
    onUpdateAnimation(currentMotionState, key, value);
  };

  const handleMotionStateClick = (state) => {
    setActiveMotionState(state);

    const presetId = params?.animations?.[state]?.presetId || 'none';
    const stateDefault =
      getAvailablePresetsForType(params?.type, state).find(
        (preset) => preset.id !== 'none'
      )?.id || 'none';

    if (presetId === 'none' && stateDefault !== 'none') {
      onUpdateAnimation(state, 'presetId', stateDefault);
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

  const getNumericStyleValue = (key, fallback = 0) => {
    const value = params.styles[key];
    if (typeof value === 'number') return value;
    const parsed = parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : fallback;
  };

  const renderSettingField = (key, label, type, options = [], step = 1) => {
    const value = params.specificSettings[key];
    const onChange = (val) => onSpecificSettingChange(key, val);
    const getSelectValue = (rawValue) =>
      options.find((opt) => String(opt.value) === rawValue)?.value ?? rawValue;

    return (
      <div key={key} style={panelBlockStyle}>
        <label style={labelStyle}>{label}</label>
        {type === 'select' && (
          <select
            value={value !== undefined ? value : ''}
            onChange={(e) => onChange(getSelectValue(e.target.value))}
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
              color: 'var(--text-main)',
            }}
          >
            <input
              type="checkbox"
              checked={value || false}
              onChange={(e) => onChange(e.target.checked)}
              style={{
                width: '16px',
                height: '16px',
                accentColor: 'var(--button-bg)',
              }}
            />{' '}
            Увімкнути
          </label>
        )}
      </div>
    );
  };

  const renderShadowControls = () => {
    if (!showShadowControls) return null;

    const settings = params.specificSettings || {};

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {renderSettingField('shadowEnabled', 'Shadow', 'checkbox')}
        {settings.shadowEnabled && (
          <>
            <ColorPicker
              label="Shadow Color"
              value={settings.shadowColor || '#111827'}
              onChange={(val) => onSpecificSettingChange('shadowColor', val)}
            />
            <RangeSlider
              label="Shadow Blur (px)"
              min={0}
              max={80}
              step={1}
              value={settings.shadowBlur ?? 18}
              unit=""
              onChange={(val) => onSpecificSettingChange('shadowBlur', val)}
            />
            <RangeSlider
              label="Shadow Offset Y (px)"
              min={-40}
              max={80}
              step={1}
              value={settings.shadowOffsetY ?? 6}
              unit=""
              onChange={(val) => onSpecificSettingChange('shadowOffsetY', val)}
            />
            <RangeSlider
              label="Shadow Opacity"
              min={0}
              max={1}
              step={0.05}
              value={settings.shadowOpacity ?? 0.16}
              unit=""
              onChange={(val) => onSpecificSettingChange('shadowOpacity', val)}
            />
          </>
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
                gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
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
              { label: 'Auto', value: 'auto' },
              { label: 'Scroll', value: 'scroll' },
            ])}
            {renderSettingField('backgroundMode', 'Background Type', 'select', [
              { label: 'Color', value: 'color' },
              { label: 'Gradient', value: 'gradient' },
              { label: 'Image', value: 'image' },
            ])}
            {params.specificSettings.backgroundMode === 'gradient' &&
              renderSettingField('backgroundGradient', 'Gradient CSS', 'text')}
            {params.specificSettings.backgroundMode === 'image' &&
              renderSettingField(
                'backgroundImage',
                'Background Image URL',
                'text'
              )}
          </>
        );
      case 'button':
        return (
          <>
            {renderSettingField('text', 'Button Text', 'textarea')}
            <div style={twoColumnGridStyle}>
              {renderSettingField('actionType', 'Action', 'select', [
                { label: 'None', value: 'none' },
                { label: 'Link', value: 'link' },
              ])}
              {renderSettingField('cursor', 'Cursor', 'select', [
                { label: 'Pointer', value: 'pointer' },
                { label: 'Default', value: 'default' },
                { label: 'Help', value: 'help' },
                { label: 'Wait', value: 'wait' },
              ])}
            </div>
            {params.specificSettings.actionType === 'link' && (
              <div style={twoColumnGridStyle}>
                {renderSettingField('href', 'Link URL', 'text')}
                {renderSettingField('target', 'Target', 'select', [
                  { label: 'Same Tab', value: '_self' },
                  { label: 'New Tab', value: '_blank' },
                ])}
              </div>
            )}
            {renderSettingField(
              'fontFamily',
              'Font Family',
              'select',
              fontFamilies
            )}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
                gap: '12px',
              }}
            >
              {renderSettingField('fontSize', 'Font Size (px)', 'number')}
              {renderSettingField('fontWeight', 'Weight', 'select', [
                { label: 'Normal', value: 400 },
                { label: 'Semibold', value: 600 },
                { label: 'Bold', value: 700 },
                { label: 'Heavy', value: 850 },
              ])}
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
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
                gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
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
            <div style={twoColumnGridStyle}>
              {renderSettingField('validationState', 'Validation', 'select', [
                { label: 'None', value: 'none' },
                { label: 'Valid', value: 'valid' },
                { label: 'Error', value: 'error' },
              ])}
              {renderSettingField('disabled', 'Disabled', 'checkbox')}
            </div>
            {params.specificSettings.validationState === 'error' &&
              renderSettingField('errorBorderColor', 'Error Border', 'color')}
          </>
        );
      case 'text':
        return (
          <>
            {renderSettingField('content', 'Text Content', 'textarea')}
            {renderSettingField('tag', 'Tag', 'select', [
              { label: 'Paragraph', value: 'p' },
              { label: 'Span', value: 'span' },
              { label: 'Heading 1', value: 'h1' },
              { label: 'Heading 2', value: 'h2' },
              { label: 'Heading 3', value: 'h3' },
            ])}
            {renderSettingField(
              'fontFamily',
              'Font Family',
              'select',
              fontFamilies
            )}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
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
                gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
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
            <div style={twoColumnGridStyle}>
              {renderSettingField(
                'letterSpacing',
                'Letter Spacing (px)',
                'number',
                [],
                0.1
              )}
              {renderSettingField('textTransform', 'Transform', 'select', [
                { label: 'None', value: 'none' },
                { label: 'Uppercase', value: 'uppercase' },
                { label: 'Lowercase', value: 'lowercase' },
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
            {params.type === 'radio' &&
              renderSettingField('name', 'Group Name', 'text')}
            {renderSettingField('disabled', 'Disabled', 'checkbox')}
            {renderSettingField(
              'fontFamily',
              'Font Family',
              'select',
              fontFamilies
            )}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
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
              {renderSettingField('color', 'Accent Color', 'color')}
              {params.type === 'checkbox' &&
                renderSettingField('checkColor', 'Mark Color', 'color')}
            </div>
          </>
        );
      case 'image':
        return (
          <>
            {renderSettingField('src', 'Image URL', 'text')}
            {renderSettingField('alt', 'Alt Text', 'text')}
            {renderSettingField('objectFit', 'Object Fit', 'select', [
              { label: 'Cover', value: 'cover' },
              { label: 'Contain', value: 'contain' },
            ])}
            {renderSettingField('objectPosition', 'Object Position', 'select', [
              { label: 'Center', value: 'center' },
              { label: 'Top', value: 'top' },
              { label: 'Bottom', value: 'bottom' },
              { label: 'Left', value: 'left' },
              { label: 'Right', value: 'right' },
            ])}
            {renderSettingField('loading', 'Lazy Load', 'select', [
              { label: 'Lazy', value: 'lazy' },
              { label: 'Eager', value: 'eager' },
            ])}
          </>
        );
      case 'link':
        return (
          <>
            {renderSettingField('text', 'Link Text', 'text')}
            {renderSettingField('href', 'URL', 'text')}
            {renderSettingField('target', 'Target', 'select', [
              { label: 'Same Tab', value: '_self' },
              { label: 'New Tab', value: '_blank' },
            ])}
            {renderSettingField(
              'fontFamily',
              'Font Family',
              'select',
              fontFamilies
            )}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
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
            {renderSettingField('underline', 'Underline', 'select', [
              { label: 'None', value: 'none' },
              { label: 'Always', value: 'always' },
              { label: 'Hover', value: 'hover' },
            ])}
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
            <div style={twoColumnGridStyle}>
              {renderSettingField('rows', 'Rows', 'number')}
              {renderSettingField('resize', 'Resize', 'select', [
                { label: 'None', value: 'none' },
                { label: 'Vertical', value: 'vertical' },
                { label: 'Horizontal', value: 'horizontal' },
                { label: 'Both', value: 'both' },
              ])}
            </div>
            {renderSettingField('focusBorderColor', 'Focus Border', 'color')}
            <div style={twoColumnGridStyle}>
              {renderSettingField('fontSize', 'Font Size (px)', 'number')}
              {renderSettingField('validationState', 'Validation', 'select', [
                { label: 'None', value: 'none' },
                { label: 'Valid', value: 'valid' },
                { label: 'Error', value: 'error' },
              ])}
            </div>
            <div style={twoColumnGridStyle}>
              {renderSettingField('disabled', 'Disabled', 'checkbox')}
              {params.specificSettings.validationState === 'error' &&
                renderSettingField('errorBorderColor', 'Error Border', 'color')}
            </div>
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
        background: 'var(--surface)',
        overflowY: 'auto',
        overflowX: 'hidden',
        borderRadius: '12px',
        ...panelBlockStyle,
      }}
    >
      <style>{`
        .controls-panel,
        .controls-panel * {
          max-width: 100%;
          box-sizing: border-box;
          min-width: 0;
        }

        .controls-panel input,
        .controls-panel select,
        .controls-panel button,
        .controls-panel textarea {
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
        }

        .controls-panel label,
        .controls-panel button,
        .controls-panel span,
        .controls-panel p {
          overflow-wrap: anywhere;
          word-break: break-word;
        }
      `}</style>
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid var(--border)',
          position: 'sticky',
          top: 0,
          background: 'var(--surface)',
          zIndex: 10,
          ...panelBlockStyle,
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
                ? '2px solid var(--text-main)'
                : '2px solid transparent',
            color:
              activeTab === 'design' ? 'var(--text-main)' : 'var(--text-muted)',
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
                ? '2px solid var(--text-main)'
                : '2px solid transparent',
            color:
              activeTab === 'motion' ? 'var(--text-main)' : 'var(--text-muted)',
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
                  gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
                  gap: '8px',
                  background: 'var(--surface-muted)',
                  padding: '12px',
                  borderRadius: '16px',
                  border: '1px solid var(--border)',
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
                        params.type === el.id
                          ? 'var(--button-bg)'
                          : 'transparent',
                      color:
                        params.type === el.id
                          ? 'var(--button-text)'
                          : 'var(--text-muted)',
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
                        color:
                          params.type === el.id
                            ? 'var(--button-text)'
                            : 'var(--text-muted)',
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
            {hasDimensionControls && (
              <AccordionSection
                title="Dimensions & Box Model"
                defaultOpen={false}
              >
                {showWidthControl && (
                  <RangeSlider
                    label="Width (px)"
                    min={20}
                    max={600}
                    step={1}
                    value={getNumericStyleValue('width')}
                    unit=""
                    onChange={(val) => onStyleChange('width', val)}
                  />
                )}
                {showHeightControl && (
                  <RangeSlider
                    label="Height (px)"
                    min={20}
                    max={600}
                    step={1}
                    value={getNumericStyleValue(
                      'height',
                      params.type === 'textarea' ? 112 : 0
                    )}
                    unit=""
                    onChange={(val) => onStyleChange('height', val)}
                  />
                )}
                {showPaddingControl && (
                  <RangeSlider
                    label="Padding (px)"
                    min={0}
                    max={100}
                    step={1}
                    value={parseInt(params.styles.padding) || 0}
                    unit=""
                    onChange={(val) => onStyleChange('padding', `${val}px`)}
                  />
                )}
                {!isChoiceControl && (
                  <RangeSlider
                    label="Margin (px)"
                    min={0}
                    max={120}
                    step={1}
                    value={getNumericStyleValue('margin')}
                    unit=""
                    onChange={(val) => onStyleChange('margin', val)}
                  />
                )}
              </AccordionSection>
            )}
            <AccordionSection title="Position & Layer" defaultOpen={false}>
              <div style={twoColumnGridStyle}>
                <div style={panelBlockStyle}>
                  <label style={labelStyle}>Position</label>
                  <select
                    value={params.styles.position || 'relative'}
                    onChange={(e) => onStyleChange('position', e.target.value)}
                    style={inputStyle}
                  >
                    <option value="relative">Relative</option>
                    <option value="absolute">Absolute</option>
                    <option value="fixed">Fixed</option>
                  </select>
                </div>
                <div style={panelBlockStyle}>
                  <label style={labelStyle}>Z-index</label>
                  <input
                    type="number"
                    value={params.styles.zIndex ?? 1}
                    onChange={(e) =>
                      onStyleChange('zIndex', Number(e.target.value))
                    }
                    style={inputStyle}
                  />
                </div>
              </div>
            </AccordionSection>
            {hasAppearanceControls && (
              <AccordionSection title="Appearance" defaultOpen={false}>
                {showBackgroundControl && (
                  <ColorPicker
                    label="Background Fill"
                    value={params.styles.backgroundColor || 'transparent'}
                    onChange={(val) => onStyleChange('backgroundColor', val)}
                  />
                )}
                {showTextColorControl && (
                  <ColorPicker
                    label="Text Color"
                    value={params.styles.color || '#111827'}
                    onChange={(val) => onStyleChange('color', val)}
                  />
                )}
                {showOpacityControl && (
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
                )}
                {showBorderControls && (
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
                {renderShadowControls()}
              </AccordionSection>
            )}
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
                  background: 'var(--surface-muted)',
                  padding: '6px',
                  borderRadius: '12px',
                  border: '1px solid var(--border)',
                }}
              >
                {allowedMotionStates.map((state) => (
                  <button
                    key={state}
                    onClick={() => handleMotionStateClick(state)}
                    style={{
                      flex: 1,
                      padding: '10px 0',
                      border: 'none',
                      borderRadius: '8px',
                      background:
                        currentMotionState === state
                          ? 'var(--button-bg)'
                          : 'transparent',
                      color:
                        currentMotionState === state
                          ? 'var(--button-text)'
                          : 'var(--text-muted)',
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
                        border: '1px solid var(--border)',
                        background:
                          currentAnimParams.motionToken === tokenId
                            ? 'var(--button-text)'
                            : 'var(--surface-muted)',
                        color:
                          currentAnimParams.motionToken === tokenId
                            ? 'var(--button-bg)'
                            : 'var(--text-muted)',
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
                  value={currentPresetVal}
                  onChange={(e) => handleAnimChange('presetId', e.target.value)}
                  style={inputStyle}
                >
                  {availablePresets.map((preset) => (
                    <option key={preset.id} value={preset.id}>
                      {preset.name}
                    </option>
                  ))}
                </select>
              </div>

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
                    color: 'var(--text-main)',
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
                      accentColor: 'var(--button-bg)',
                    }}
                  />
                  <Zap
                    size={14}
                    color="#D6F854"
                    style={{
                      background: 'var(--button-bg)',
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
                      gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
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
                        <label style={labelStyle}>Slide Direction</label>
                        <select
                          value={currentAnimParams.direction || 'bottom'}
                          onChange={(e) =>
                            handleAnimChange('direction', e.target.value)
                          }
                          style={inputStyle}
                        >
                          <option value="bottom">Bottom</option>
                          <option value="top">Top</option>
                          <option value="left">Left</option>
                          <option value="right">Right</option>
                        </select>
                      </div>
                    )}
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
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
                          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
                          gap: '12px',
                        }}
                      >
                        <input
                          type="number"
                          step={0.1}
                          min={0}
                          max={5}
                          value={scaleRange[0]}
                          onChange={(e) =>
                            handleAnimChange('scaleRange', [
                              Number(e.target.value),
                              scaleRange[1],
                            ])
                          }
                          style={inputStyle}
                        />
                        <input
                          type="number"
                          step={0.1}
                          min={0}
                          max={5}
                          value={scaleRange[1]}
                          onChange={(e) =>
                            handleAnimChange('scaleRange', [
                              scaleRange[0],
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
                  color: 'var(--text-main)',
                  background: currentAnimParams.reduceMotion
                    ? 'var(--warning-bg)'
                    : 'var(--surface-muted)',
                  padding: '12px',
                  borderRadius: '12px',
                  border: currentAnimParams.reduceMotion
                    ? '1px solid var(--warning-border)'
                    : '1px solid var(--border)',
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
                    accentColor: 'var(--primary)',
                  }}
                />
                <Accessibility
                  size={16}
                  color={
                    currentAnimParams.reduceMotion
                      ? 'var(--primary)'
                      : 'currentColor'
                  }
                />
                Reduced Motion (Safe Mode)
              </label>
              <p
                style={{
                  fontSize: '11px',
                  color: 'var(--text-muted)',
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
          borderTop: '1px solid var(--border)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          background: 'var(--surface)',
          position: 'sticky',
          bottom: 0,
          zIndex: 12,
          boxShadow: '0 -12px 24px rgba(15, 23, 42, 0.08)',
          borderBottomLeftRadius: '12px',
          borderBottomRightRadius: '12px',
        }}
      >
        <Button onClick={onReplay} style={{ flex: '1 1 120px' }}>
          Відтворити
        </Button>
        <Button
          variant="secondary"
          onClick={onReset}
          style={{ flex: '1 1 120px' }}
        >
          Скинути
        </Button>
      </div>
    </div>
  );
};

export default ControlsPanel;
