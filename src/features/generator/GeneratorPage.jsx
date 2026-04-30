import React, { useMemo, useState, useEffect } from 'react';
import ControlsPanel from './ControlsPanel';
import PreviewArea from './PreviewArea';
import CodeOutput from './CodeOutput';
import { generateFullCSS } from '../../utils/generateCss';
import {
  createElement,
  updateElementStyle,
  updateSpecificSetting,
} from '../../utils/elementSystem'; // ПІДКЛЮЧАЄМО НАШУ ФАБРИКУ

// Функція ініціалізації стану
const getInitialState = () => {
  const saved = localStorage.getItem('animadiv-params');
  if (saved) {
    const parsed = JSON.parse(saved);
    // Перевіряємо, чи це вже нова архітектура (має бути об'єкт styles)
    if (parsed.styles && parsed.animations) return parsed;
  }

  // Якщо нічого немає або версія стара — генеруємо базову кнопку через фабрику
  const defaultElement = createElement('button');
  return {
    ...defaultElement,
    animations: {
      load: {
        presetId: 'bounce',
        duration: 800,
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

  // 1. ОНОВЛЕННЯ ТИПУ ЕЛЕМЕНТА (Зберігаємо поточні анімації, але повністю міняємо об'єкт)
  const handleTypeChange = (newType) => {
    const newElement = createElement(newType);
    if (newElement) {
      setParams((prev) => ({
        ...newElement,
        animations: prev.animations, // Переносимо анімації на новий елемент
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
          ...prev.animations[stateName],
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

  // CSS генератор тимчасово може видавати помилки, поки ми його не оновимо, це ок
  const fullCss = useMemo(() => generateFullCSS(params), [params]);

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('animadiv-params', JSON.stringify(params));
    }, 500);
    return () => clearTimeout(timer);
  }, [params]);

  useEffect(() => {
    handleReplay();
  }, [params.animations.load.presetId]);

  useEffect(() => {
    let styleTag = document.getElementById('dynamic-animation-styles');
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'dynamic-animation-styles';
      document.head.appendChild(styleTag);
    }
    styleTag.innerHTML = fullCss;
    return () => {
      if (styleTag) styleTag.innerHTML = '';
    };
  }, [fullCss]);

  return (
    <main className="main-container">
      <div className="column settings-panel">
        <ControlsPanel
          params={params}
          onTypeChange={handleTypeChange}
          onStyleChange={handleStyleChange}
          onSpecificSettingChange={handleSpecificSettingChange}
          onUpdateAnimation={updateAnimationParam}
          onReset={resetParams}
          onReplay={handleReplay}
        />
      </div>
      <div className="column preview-panel">
        <PreviewArea params={params} refreshKey={refreshKey} />
      </div>
      <div className="column code-panel">
        <CodeOutput params={params} code={fullCss} />
      </div>
    </main>
  );
};

export default GeneratorPage;
