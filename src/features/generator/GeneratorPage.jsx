import React, { useMemo, useState, useEffect } from 'react';
import ControlsPanel from './ControlsPanel';
import PreviewArea from './PreviewArea';
import CodeOutput from './CodeOutput';
import { generateFullCSS } from '../../utils/generateCss';
import { sanitizeAnimationsForType } from '../../utils/semanticMapping';
import {
  createElement,
  DEFAULT_ANIMATION_CONFIG,
  updateElementStyle,
  updateSpecificSetting,
} from '../../utils/elementSystem'; // ПІДКЛЮЧАЄМО НАШУ ФАБРИКУ

const normalizeAnimationConfig = (config) => {
  const { effectPreset, ...nextConfig } = config || {};
  return {
    ...DEFAULT_ANIMATION_CONFIG,
    ...nextConfig,
    presetId: nextConfig.presetId || effectPreset || 'none',
  };
};

const normalizeSavedParams = (savedParams) => ({
  ...savedParams,
  animations: sanitizeAnimationsForType(savedParams.type, {
    load: normalizeAnimationConfig(savedParams.animations?.load),
    hover: normalizeAnimationConfig(savedParams.animations?.hover),
    click: normalizeAnimationConfig(savedParams.animations?.click),
  }),
});

// Функція ініціалізації стану
const getInitialState = () => {
  const saved = localStorage.getItem('animadiv-params');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      // Перевіряємо, чи це вже нова архітектура (має бути об'єкт styles)
      if (parsed.styles && parsed.animations)
        return normalizeSavedParams(parsed);
    } catch {
      localStorage.removeItem('animadiv-params');
    }
  }

  // Якщо нічого немає або версія стара — генеруємо базову кнопку через фабрику
  const defaultElement = createElement('button');
  return {
    ...defaultElement,
    animations: {
      load: {
        presetId: 'fade',
        duration: 500,
        easing: 'ease-out',
        intensity: 100,
      },
      hover: {
        presetId: 'none',
        duration: 200,
        easing: 'ease',
        intensity: 100,
      },
      click: {
        presetId: 'none',
        duration: 150,
        easing: 'ease',
        intensity: 100,
      },
    },
  };
};

const GeneratorPage = () => {
  const [params, setParams] = useState(getInitialState);
  const [refreshKey, setRefreshKey] = useState(0);
  const [activePreviewState, setActivePreviewState] = useState('load');
  const [activeMotionState, setActiveMotionState] = useState('load');

  // 1. ОНОВЛЕННЯ ТИПУ ЕЛЕМЕНТА (Зберігаємо поточні анімації, але повністю міняємо об'єкт)
  const handleTypeChange = (newType) => {
    const newElement = createElement(newType);
    if (newElement) {
      setParams((prev) => ({
        ...newElement,
        animations: sanitizeAnimationsForType(
          newType,
          prev.animations || newElement.animations
        ),
      }));
    }
  };

  // 2. ОНОВЛЕННЯ БАЗОВИХ СТИЛІВ (width, height, background...)
  const handleStyleChange = (key, value) => {
    setParams((prev) => updateElementStyle(prev, key, value));
  };

  // 3. ОНОВЛЕННЯ СПЕЦИФІЧНИХ НАЛАШТУВАНЬ (текст кнопки, тип інпута...)
  const handleSpecificSettingChange = (key, value) => {
    setParams((prev) => updateSpecificSetting(prev, key, value));
  };

  // 4. ОНОВЛЕННЯ АНІМАЦІЙ
  const updateAnimationParam = (stateName, key, value) => {
    setParams((prev) => ({
      ...prev,
      animations: {
        ...prev.animations,
        [stateName]: {
          ...normalizeAnimationConfig(prev.animations?.[stateName]),
          [key]: value,
        },
      },
    }));
  };

  const resetParams = () => {
    localStorage.removeItem('animadiv-params');
    setParams(getInitialState());
  };

  const handleReplay = () => setRefreshKey((prev) => prev + 1);

  const handleMotionStateChange = (state) => {
    setActiveMotionState(state);
    setActivePreviewState(state);
  };

  const handlePreviewStateChange = (state) => {
    setActivePreviewState(state);

    if (state !== 'static') {
      setActiveMotionState(state);
    }
  };

  // CSS генератор тимчасово може видавати помилки, поки ми його не оновимо, це ок
  const fullCss = useMemo(() => generateFullCSS(params), [params]);

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('animadiv-params', JSON.stringify(params));
    }, 500);
    return () => clearTimeout(timer);
  }, [params]);

  useEffect(() => {
    const timer = window.setTimeout(handleReplay, 0);
    return () => window.clearTimeout(timer);
  }, [params.animations?.load?.presetId]);

  return (
    <main className="main-container">
      <div className="column settings-panel">
        <ControlsPanel
          params={params}
          activeMotionState={activeMotionState}
          onActiveMotionStateChange={handleMotionStateChange}
          onTypeChange={handleTypeChange}
          onStyleChange={handleStyleChange}
          onSpecificSettingChange={handleSpecificSettingChange}
          onUpdateAnimation={updateAnimationParam}
          onReset={resetParams}
          onReplay={handleReplay}
        />
      </div>
      <div className="column preview-panel">
        <PreviewArea
          params={params}
          refreshKey={refreshKey}
          activeState={activePreviewState}
          onActiveStateChange={handlePreviewStateChange}
        />
      </div>
      <div className="column code-panel">
        <CodeOutput params={params} code={fullCss} />
      </div>
    </main>
  );
};

export default GeneratorPage;
