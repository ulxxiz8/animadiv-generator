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
import { useTranslation } from '../../i18n/useTranslation';

const figmaElements = [
  {
    id: 'block',
    labelKey: 'library.types.block',
    label: 'Container',
    icon: <Square size={16} strokeDasharray="2 2" />,
  },
  { id: 'button', labelKey: 'library.types.button', label: 'Button', icon: <MousePointer2 size={16} /> },
  { id: 'input', labelKey: 'library.types.input', label: 'Input', icon: <TextCursorInput size={16} /> },
  { id: 'textarea', labelKey: 'library.types.textarea', label: 'Textarea', icon: <FormInput size={16} /> },
  { id: 'checkbox', labelKey: 'library.types.checkbox', label: 'Checkbox', icon: <CheckSquare size={16} /> },
  { id: 'radio', labelKey: 'library.types.radio', label: 'Radio', icon: <CircleDot size={16} /> },
  { id: 'text', labelKey: 'library.types.text', label: 'Typography', icon: <Type size={16} /> },
  { id: 'image', labelKey: 'library.types.image', label: 'Image', icon: <ImageIcon size={16} /> },
  { id: 'link', labelKey: 'library.types.link', label: 'Link', icon: <Link2 size={16} /> },
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

const AccordionSection = ({ title, children, defaultOpen = true, badge }) => {
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
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {title}
          {badge && (
            <span
              style={{
                background: 'var(--button-bg)',
                color: 'var(--button-text)',
                fontSize: '9px',
                fontWeight: '900',
                padding: '2px 6px',
                borderRadius: '4px',
                letterSpacing: '0.04em',
              }}
            >
              {badge}
            </span>
          )}
        </span>
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
  const { t } = useTranslation();
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

  if (!params || !params.styles)
    return <div style={{ padding: 20 }}>{t('common.loading')}</div>;

  const getSupportedControls = () => {
    if (!hasPreset) return [];
    const paramsSet = new Set();

    let targetId = currentPresetVal;
    if (currentAnimParams.usePhysics) {
      if (currentPresetVal === 'scale') targetId = 'physicsScale';
      if (currentPresetVal === 'slide') targetId = 'physicsBounce';
    }

    const supportedParams = PRESET_SUPPORTED_PARAMS[targetId] || [];
    supportedParams.forEach((param) => paramsSet.add(param));
    return Array.from(paramsSet);
  };

  const supportedControls = getSupportedControls();

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
    if (!WORKING_CONTROLS.includes(key)) return false;
    if (
      ['iterationCount', 'fillMode'].includes(key) &&
      currentMotionState !== 'load'
    ) {
      return false;
    }
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
            {t('common.enable', { defaultValue: 'Enable' })}
          </label>
        )}
      </div>
    );
  };

  const renderAnimField = (key, label, type, options = [], step = 1) => {
    const value = currentAnimParams[key];
    const onChange = (val) => handleAnimChange(key, val);
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
        {type === 'number' && (
          <input
            type="number"
            step={step}
            value={value !== undefined ? value : 0}
            onChange={(e) => onChange(Number(e.target.value))}
            style={inputStyle}
          />
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
              checked={Boolean(value)}
              onChange={(e) => onChange(e.target.checked)}
              style={{
                width: '16px',
                height: '16px',
                accentColor: 'var(--button-bg)',
              }}
            />
            {t('common.enable', { defaultValue: 'Enable' })}
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
        {renderSettingField('shadowEnabled', t('controls.labels.shadow'), 'checkbox')}
        {settings.shadowEnabled && (
          <>
            <ColorPicker
              label={t('controls.labels.shadowColor')}
              value={settings.shadowColor || '#111827'}
              onChange={(val) => onSpecificSettingChange('shadowColor', val)}
            />
            <RangeSlider
              label={t('controls.labels.shadowOffsetX', { defaultValue: 'Shadow Offset X' })}
              min={-80}
              max={80}
              step={1}
              value={settings.shadowOffsetX ?? 0}
              unit=""
              onChange={(val) => onSpecificSettingChange('shadowOffsetX', val)}
            />
            <RangeSlider
              label={t('controls.labels.shadowOffsetY')}
              min={-40}
              max={80}
              step={1}
              value={settings.shadowOffsetY ?? 6}
              unit=""
              onChange={(val) => onSpecificSettingChange('shadowOffsetY', val)}
            />
            <RangeSlider
              label={t('controls.labels.shadowBlur')}
              min={0}
              max={80}
              step={1}
              value={settings.shadowBlur ?? 18}
              unit=""
              onChange={(val) => onSpecificSettingChange('shadowBlur', val)}
            />
            <RangeSlider
              label={t('controls.labels.shadowSpread', { defaultValue: 'Shadow Spread' })}
              min={-40}
              max={80}
              step={1}
              value={settings.shadowSpread ?? 0}
              unit=""
              onChange={(val) => onSpecificSettingChange('shadowSpread', val)}
            />
            <RangeSlider
              label={t('controls.labels.shadowOpacity')}
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

  // =====================================================================
  // STATE-SPECIFIC OVERRIDES — показуються тільки у відповідному стані
  // =====================================================================
  const renderStateOverrides = () => {
    const s = params.specificSettings || {};

    // Static is preview-only now. It is not configurable from Motion.


    // HOVER state overrides
    if (currentMotionState === 'hover') {
      const showBackgroundControls = currentPresetVal === 'backgroundChange';
      const showBorderControls = [
        'borderColorChange',
        'borderAnimation',
      ].includes(currentPresetVal);

      const sharedHoverControls = (
        <>
          {showBackgroundControls && (
            <>
              <ColorPicker
                label="Hover Background"
                value={currentAnimParams.hoverBackgroundColor || s.hoverBackground || '#374151'}
                onChange={(val) => handleAnimChange('hoverBackgroundColor', val)}
              />
              {renderAnimField('hoverUseGradient', 'Use Hover Gradient', 'checkbox')}
              {currentAnimParams.hoverUseGradient && (
                <div style={twoColumnGridStyle}>
                  <ColorPicker
                    label="Hover From"
                    value={currentAnimParams.hoverGradientFrom || '#111827'}
                    onChange={(val) => handleAnimChange('hoverGradientFrom', val)}
                  />
                  <ColorPicker
                    label="Hover To"
                    value={currentAnimParams.hoverGradientTo || '#334155'}
                    onChange={(val) => handleAnimChange('hoverGradientTo', val)}
                  />
                </div>
              )}
            </>
          )}
          {showBorderControls && (
            <>
              <ColorPicker
                label="Hover Border"
                value={currentAnimParams.hoverBorderColor || params.styles.borderColor || '#4F46E5'}
                onChange={(val) => handleAnimChange('hoverBorderColor', val)}
              />
              {renderAnimField('borderAnimationType', 'Border Animation', 'select', [
                { label: 'Color', value: 'color' },
                { label: 'Grow', value: 'grow' },
                { label: 'Glow', value: 'glow' },
                { label: 'Dashed', value: 'dashed' },
              ])}
            </>
          )}
          {currentPresetVal === 'opacityChange' &&
            renderAnimField('hoverOpacity', 'Hover Opacity', 'number')}
          {['scaleUp', 'scaleDown'].includes(currentPresetVal) &&
            renderAnimField('hoverScale', 'Hover Scale', 'number')}
          {currentPresetVal === 'lift' &&
            renderAnimField('hoverTranslateY', 'Hover Translate Y', 'number')}
          {['rotate', 'tilt'].includes(currentPresetVal) &&
            renderAnimField('hoverRotate', 'Hover Rotate', 'number')}
        </>
      );

      if (params.type === 'button') {
        return (
          <>
            <div
              style={{
                padding: '10px 12px',
                borderRadius: '10px',
                background: 'var(--surface-muted)',
                border: '1px solid var(--border)',
                fontSize: '11px',
                color: 'var(--text-muted)',
                fontWeight: '600',
                lineHeight: 1.4,
              }}
            >
              {t('controls.stateMessages.hoverOnly')}
            </div>
            <ColorPicker
              label={t('controls.labels.hoverFill')}
              value={s.hoverBackground || '#374151'}
              onChange={(val) => onSpecificSettingChange('hoverBackground', val)}
            />
            <ColorPicker
              label={t('controls.labels.hoverTextColor')}
              value={s.hoverColor || '#ffffff'}
              onChange={(val) => onSpecificSettingChange('hoverColor', val)}
            />
            {sharedHoverControls}
          </>
        );
      }

      if (params.type === 'link') {
        return (
          <>
            <div
              style={{
                padding: '10px 12px',
                borderRadius: '10px',
                background: 'var(--surface-muted)',
                border: '1px solid var(--border)',
                fontSize: '11px',
                color: 'var(--text-muted)',
                fontWeight: '600',
                lineHeight: 1.4,
              }}
            >
              {t('controls.stateMessages.hoverOnly')}
            </div>
            <ColorPicker
              label={t('controls.labels.hoverColor')}
              value={s.hoverColor || '#3730A3'}
              onChange={(val) => onSpecificSettingChange('hoverColor', val)}
            />
            {renderSettingField('underline', t('controls.labels.underlineOnHover'), 'select', [
              { label: t('options.none'), value: 'none' },
              { label: t('options.always'), value: 'always' },
              { label: t('options.hover'), value: 'hover' },
            ])}
            {sharedHoverControls}
          </>
        );
      }

      if (params.type === 'input' || params.type === 'textarea') {
        return (
          <>
            <div
              style={{
                padding: '10px 12px',
                borderRadius: '10px',
                background: 'var(--surface-muted)',
                border: '1px solid var(--border)',
                fontSize: '11px',
                color: 'var(--text-muted)',
                fontWeight: '600',
                lineHeight: 1.4,
              }}
            >
              {t('controls.stateMessages.focusHover')}
            </div>
            <ColorPicker
              label={t('controls.labels.focusBorderColor')}
              value={s.focusBorderColor || '#4F46E5'}
              onChange={(val) => onSpecificSettingChange('focusBorderColor', val)}
            />
            {sharedHoverControls}
          </>
        );
      }

      if (params.type === 'image') {
        return (
          <>
            <div
              style={{
                padding: '10px 12px',
                borderRadius: '10px',
                background: 'var(--surface-muted)',
                border: '1px solid var(--border)',
                fontSize: '11px',
                color: 'var(--text-muted)',
                fontWeight: '600',
                lineHeight: 1.4,
              }}
            >
              {t('controls.stateMessages.imageHover')}
            </div>
            <RangeSlider
              label={t('controls.labels.hoverScale')}
              min={1}
              max={1.5}
              step={0.01}
              value={s.hoverScale || 1.05}
              unit=""
              onChange={(val) => onSpecificSettingChange('hoverScale', val)}
            />
            {sharedHoverControls}
          </>
        );
      }

      return (
        sharedHoverControls || (
          <div
            style={{
              padding: '10px 12px',
              borderRadius: '10px',
              background: 'var(--surface-muted)',
              border: '1px solid var(--border)',
              fontSize: '11px',
              color: 'var(--text-muted)',
              fontWeight: '600',
            }}
          >
            {t('controls.stateMessages.noHover')}
          </div>
        )
      );
    }

    // CLICK state overrides
    if (currentMotionState === 'click') {
      const sharedClickControls = (
        <>
          {['scaleDown', 'elasticBounce'].includes(currentPresetVal) &&
            renderAnimField('clickScale', 'Click Scale', 'number', [], 0.01)}
          {currentPresetVal === 'pressDown' &&
            renderAnimField('clickTranslateY', 'Press Distance', 'number')}
          {currentPresetVal === 'ripple' && (
            <ColorPicker
              label="Ripple Color"
              value={currentAnimParams.rippleColor || 'rgba(255, 255, 255, 0.45)'}
              onChange={(val) => handleAnimChange('rippleColor', val)}
            />
          )}
          {['elasticBounce', 'rotateClick', 'flash', 'shakeClick'].includes(
            currentPresetVal
          ) &&
            renderAnimField('clickDuration', 'Click Duration', 'number')}
        </>
      );

      if (params.type === 'button') {
        return (
          <>
            <div
              style={{
                padding: '10px 12px',
                borderRadius: '10px',
                background: 'var(--surface-muted)',
                border: '1px solid var(--border)',
                fontSize: '11px',
                color: 'var(--text-muted)',
                fontWeight: '600',
                lineHeight: 1.4,
              }}
            >
              {t('controls.stateMessages.clickOnly')}
            </div>
            <RangeSlider
              label={t('controls.labels.pressScale')}
              min={0.8}
              max={1}
              step={0.01}
              value={s.activeScale || 0.95}
              unit=""
              onChange={(val) => onSpecificSettingChange('activeScale', val)}
            />
            {sharedClickControls}
          </>
        );
      }

      return (
        sharedClickControls || (
          <div
            style={{
              padding: '10px 12px',
              borderRadius: '10px',
              background: 'var(--surface-muted)',
              border: '1px solid var(--border)',
              fontSize: '11px',
              color: 'var(--text-muted)',
              fontWeight: '600',
            }}
          >
            {t('controls.stateMessages.noClick')}
          </div>
        )
      );
    }

    // LOAD state — немає state overrides, тільки анімація
    return (
      <div
        style={{
          padding: '10px 12px',
          borderRadius: '10px',
          background: 'var(--surface-muted)',
          border: '1px solid var(--border)',
          fontSize: '11px',
          color: 'var(--text-muted)',
          fontWeight: '600',
        }}
      >
        {t('controls.stateMessages.load')}
      </div>
    );
  };

  // =====================================================================
  // ELEMENT-SPECIFIC SETTINGS (завжди видимі, не залежать від стану)
  // =====================================================================
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
            {renderSettingField('backgroundType', 'Background Type', 'select', [
              { label: 'Solid', value: 'solid' },
              { label: 'Gradient', value: 'gradient' },
            ])}
            {params.specificSettings.backgroundType === 'solid' && (
              <ColorPicker
                label="Background Color"
                value={
                  params.specificSettings.backgroundColor ||
                  params.styles.backgroundColor ||
                  '#F9FAFB'
                }
                onChange={(val) => {
                  onSpecificSettingChange('backgroundColor', val);
                  onStyleChange('backgroundColor', val);
                }}
              />
            )}
            {params.specificSettings.backgroundType === 'gradient' && (
              <>
                {renderSettingField('gradientType', 'Gradient Type', 'select', [
                  { label: 'Linear', value: 'linear' },
                  { label: 'Radial', value: 'radial' },
                ])}
                <div style={twoColumnGridStyle}>
                  <ColorPicker
                    label="From"
                    value={params.specificSettings.gradientColorFrom || '#111827'}
                    onChange={(val) =>
                      onSpecificSettingChange('gradientColorFrom', val)
                    }
                  />
                  <ColorPicker
                    label="To"
                    value={params.specificSettings.gradientColorTo || '#334155'}
                    onChange={(val) =>
                      onSpecificSettingChange('gradientColorTo', val)
                    }
                  />
                </div>
                {renderSettingField('gradientColorMiddle', 'Middle Color (optional)', 'text')}
                {params.specificSettings.gradientType !== 'radial' ? (
                  <RangeSlider
                    label="Angle"
                    min={0}
                    max={360}
                    step={1}
                    value={params.specificSettings.gradientAngle ?? 135}
                    unit="deg"
                    onChange={(val) => onSpecificSettingChange('gradientAngle', val)}
                  />
                ) : (
                  renderSettingField('gradientPosition', 'Radial Position', 'select', [
                    { label: 'Center', value: 'center' },
                    { label: 'Top', value: 'top' },
                    { label: 'Bottom', value: 'bottom' },
                    { label: 'Left', value: 'left' },
                    { label: 'Right', value: 'right' },
                  ])
                )}
                <div
                  style={{
                    height: 42,
                    borderRadius: 10,
                    border: '1px solid var(--border)',
                    background:
                      params.specificSettings.gradientCss ||
                      (params.specificSettings.gradientType === 'radial'
                        ? `radial-gradient(circle at ${params.specificSettings.gradientPosition || 'center'}, ${params.specificSettings.gradientColorFrom || '#111827'} 0%, ${params.specificSettings.gradientColorMiddle ? `${params.specificSettings.gradientColorMiddle} 50%, ` : ''}${params.specificSettings.gradientColorTo || '#334155'} 100%)`
                        : `linear-gradient(${params.specificSettings.gradientAngle ?? 135}deg, ${params.specificSettings.gradientColorFrom || '#111827'} 0%, ${params.specificSettings.gradientColorMiddle ? `${params.specificSettings.gradientColorMiddle} 50%, ` : ''}${params.specificSettings.gradientColorTo || '#334155'} 100%)`),
                  }}
                />
                {renderSettingField('gradientCss', 'Custom Gradient CSS', 'textarea')}
              </>
            )}
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
              {renderSettingField('fontStyle', 'Style', 'select', [
                { label: 'Normal', value: 'normal' },
                { label: 'Italic', value: 'italic' },
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
              {renderSettingField('fontStyle', 'Style', 'select', [
                { label: 'Normal', value: 'normal' },
                { label: 'Italic', value: 'italic' },
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
              {renderSettingField('fontStyle', 'Style', 'select', [
                { label: 'Normal', value: 'normal' },
                { label: 'Italic', value: 'italic' },
              ])}
            </div>
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
          <Paintbrush size={16} /> {t('controls.tabs.design')}
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
          <Activity size={16} /> {t('controls.tabs.motion')}
        </button>
      </div>

      <div style={{ flex: 1 }}>
        {activeTab === 'design' && (
          <>
            <AccordionSection title={t('controls.sections.componentType')} defaultOpen={true}>
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
                    {t(el.labelKey, { defaultValue: el.label })}
                  </button>
                ))}
              </div>
            </AccordionSection>

            {/* ELEMENT-SPECIFIC SETTINGS — завжди видимі */}
            {params.specificSettings &&
              Object.keys(params.specificSettings).length > 0 && (
                <AccordionSection title={t('controls.sections.elementSettings')} defaultOpen={true}>
                  {renderSpecificSettings()}
                </AccordionSection>
              )}

            {hasDimensionControls && (
              <AccordionSection
                title={t('controls.sections.dimensions')}
                defaultOpen={false}
              >
                {showWidthControl && (
                  <RangeSlider
                    label={t('controls.labels.width')}
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
                    label={t('controls.labels.height')}
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
                    label={t('controls.labels.padding')}
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
                    label={t('controls.labels.margin')}
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
            <AccordionSection title={t('controls.sections.positionLayer')} defaultOpen={false}>
              <div style={twoColumnGridStyle}>
                <div style={panelBlockStyle}>
                  <label style={labelStyle}>{t('controls.labels.position')}</label>
                  <select
                    value={params.styles.position || 'relative'}
                    onChange={(e) => onStyleChange('position', e.target.value)}
                    style={inputStyle}
                  >
                    <option value="relative">{t('options.relative')}</option>
                    <option value="absolute">{t('options.absolute')}</option>
                    <option value="fixed">{t('options.fixed')}</option>
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
              <AccordionSection title={t('controls.sections.appearance')} defaultOpen={false}>
                {showBackgroundControl && (
                  <ColorPicker
                    label={t('controls.labels.backgroundFill')}
                    value={params.styles.backgroundColor || 'transparent'}
                    onChange={(val) => onStyleChange('backgroundColor', val)}
                  />
                )}
                {showTextColorControl && (
                  <ColorPicker
                    label={t('controls.labels.textColor')}
                    value={params.styles.color || '#111827'}
                    onChange={(val) => onStyleChange('color', val)}
                  />
                )}
                {showOpacityControl && (
                  <RangeSlider
                    label={t('controls.labels.opacity')}
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
                      label={t('controls.labels.cornerRadius')}
                      min={0}
                      max={100}
                      step={1}
                      value={params.styles.borderRadius || 0}
                      unit=""
                      onChange={(val) => onStyleChange('borderRadius', val)}
                    />
                    <RangeSlider
                      label={t('controls.labels.borderWidth')}
                      min={0}
                      max={20}
                      step={1}
                      value={params.styles.borderWidth || 0}
                      unit=""
                      onChange={(val) => onStyleChange('borderWidth', val)}
                    />
                    {params.styles.borderWidth > 0 && (
                      <ColorPicker
                        label={t('controls.labels.borderColor')}
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
        {/* ВКЛАДКА MOTION */}
        {/* ============================================================== */}
        {activeTab === 'motion' && (
          <>
            <AccordionSection title={t('controls.sections.triggerState')} defaultOpen={true}>
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

            {/* STATE-SPECIFIC STYLE OVERRIDES */}
            <AccordionSection
              title={t('controls.sections.stateStyles')}
              badge={currentMotionState.toUpperCase()}
              defaultOpen={true}
            >
              {renderStateOverrides()}
            </AccordionSection>

            {isSupported('motionToken') && (
              <AccordionSection title={t('controls.sections.presetTokens')} defaultOpen={true}>
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
                      {t(MOTION_TOKENS[tokenId].nameKey, { defaultValue: MOTION_TOKENS[tokenId].name })}
                    </button>
                  ))}
                </div>
              </AccordionSection>
            )}

            <AccordionSection title={t('controls.sections.coreBehavior')} defaultOpen={true}>
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>{t('controls.labels.primaryEffect')}</label>
                <select
                  value={currentPresetVal}
                  onChange={(e) => handleAnimChange('presetId', e.target.value)}
                  style={inputStyle}
                >
                  {availablePresets.map((preset) => (
                    <option key={preset.id} value={preset.id}>
                      {t(preset.nameKey, { defaultValue: preset.name })}
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
                    label={t('controls.labels.duration')}
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
                    label={t('controls.labels.delay')}
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
                    <label style={labelStyle}>{t('controls.labels.easing')}</label>
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
                            {t(opt.labelKey, { defaultValue: opt.label })}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </AccordionSection>

            {isSupported('usePhysics') && (
              <AccordionSection title={t('controls.sections.physicsEngine')} defaultOpen={false}>
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
                  {t('controls.labels.enablePhysics')}
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
                    label={t('controls.labels.stiffness')}
                    min={10}
                    max={300}
                    step={5}
                    value={currentAnimParams.stiffness || 100}
                    unit=""
                    onChange={(val) => handleAnimChange('stiffness', val)}
                  />
                  <RangeSlider
                    label={t('controls.labels.damping')}
                    min={2}
                    max={40}
                    step={1}
                    value={currentAnimParams.damping || 10}
                    unit=""
                    onChange={(val) => handleAnimChange('damping', val)}
                  />
                  <RangeSlider
                    label={t('controls.labels.mass')}
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
                title={t('controls.sections.playbackDirection')}
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
                          <option value="1">{t('options.once')}</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="infinite">{t('options.infinite')}</option>
                        </select>
                      </div>
                    )}
                    {isSupported('direction') && (
                      <div>
                        <label style={labelStyle}>{t('controls.labels.slideDirection')}</label>
                        <select
                          value={currentAnimParams.direction || 'bottom'}
                          onChange={(e) =>
                            handleAnimChange('direction', e.target.value)
                          }
                          style={inputStyle}
                        >
                          <option value="bottom">{t('options.bottom')}</option>
                          <option value="top">{t('options.top')}</option>
                          <option value="left">{t('options.left')}</option>
                          <option value="right">{t('options.right')}</option>
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
                          <option value="none">{t('options.none')}</option>
                          <option value="forwards">{t('options.forwards')}</option>
                          <option value="backwards">{t('options.backwards')}</option>
                          <option value="both">{t('options.both')}</option>
                        </select>
                      </div>
                    )}
                    {isSupported('motionAxis') && (
                      <div>
                        <label style={labelStyle}>{t('controls.labels.motionAxis')}</label>
                        <select
                          value={currentAnimParams.motionAxis || 'all'}
                          onChange={(e) =>
                            handleAnimChange('motionAxis', e.target.value)
                          }
                          style={inputStyle}
                        >
                          <option value="all">{t('options.allAxes')}</option>
                          <option value="x">{t('options.xAxis')}</option>
                          <option value="y">{t('options.yAxis')}</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              </AccordionSection>
            )}

            {hasVisualParams && (
              <AccordionSection title={t('controls.sections.transformVisuals')} defaultOpen={false}>
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
                      <label style={labelStyle}>{t('controls.labels.transformOrigin')}</label>
                      <select
                        value={currentAnimParams.transformOrigin || 'center'}
                        onChange={(e) =>
                          handleAnimChange('transformOrigin', e.target.value)
                        }
                        style={inputStyle}
                      >
                        <option value="center">{t('options.center')}</option>
                        <option value="top">{t('options.top')}</option>
                        <option value="bottom">{t('options.bottom')}</option>
                        <option value="left">{t('options.left')}</option>
                        <option value="right">{t('options.right')}</option>
                        <option value="top left">{t('options.topLeft')}</option>
                        <option value="bottom right">{t('options.bottomRight')}</option>
                      </select>
                    </div>
                  )}

                  {isSupported('intensity') && (
                    <RangeSlider
                      label={t('controls.labels.intensity')}
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
                      label={t('controls.labels.zoomIntensity')}
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
                      label={t('controls.labels.blurAmount')}
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
                      label={t('controls.labels.rotationAngle')}
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
                      label={t('controls.labels.floatingDistance')}
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
                      label={t('controls.labels.hoverDepth')}
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
                      label={t('controls.labels.staggerChildren')}
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
                        {t('controls.labels.scaleRange')}
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

            <AccordionSection title={t('controls.sections.accessibility')} defaultOpen={false}>
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
                {t('controls.labels.reducedMotion')}
              </label>
              <p
                style={{
                  fontSize: '11px',
                  color: 'var(--text-muted)',
                  marginTop: '8px',
                  lineHeight: 1.4,
                }}
              >
                {t('controls.stateMessages.reducedMotion')}
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
          {t('common.play')}
        </Button>
        <Button
          variant="secondary"
          onClick={onReset}
          style={{ flex: '1 1 120px' }}
        >
          {t('common.reset')}
        </Button>
      </div>
    </div>
  );
};

export default ControlsPanel;

