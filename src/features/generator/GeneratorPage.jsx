import React, { useMemo, useState, useEffect } from 'react';
import ControlsPanel from './ControlsPanel';
import PreviewArea from './PreviewArea';
import CodeOutput from './CodeOutput';
import { generateFullCSS } from '../../utils/generateCss';
// Тимчасово закоментуємо старий імпорт, бо ми створили нову архітектуру прямо тут
// import { initialParams } from '../../data/defaultParams';

// НОВА АРХІТЕКТУРА ДАНИХ (State)
const advancedInitialParams = {
  // 1. Глобальний дизайн (єдиний для всіх станів)
  elementType: 'button',
  color: '#4F46E5',
  size: 64,

  // 2. Локальні налаштування анімації (незалежні для кожного стану)
  animations: {
    load: {
      presetId: 'bounce',
      duration: 800,
      easing: 'ease-out',
      intensity: 100,
    },
    hover: { presetId: 'none', duration: 200, easing: 'ease', intensity: 100 },
    click: { presetId: 'none', duration: 150, easing: 'ease', intensity: 100 },
  },
};

const GeneratorPage = () => {
  // Завантаження параметрів з localStorage при старті
  const [params, setParams] = useState(() => {
    const saved = localStorage.getItem('animadiv-params');
    if (saved) {
      const parsed = JSON.parse(saved);
      // ЗАПОБІЖНИК: Якщо в пам'яті лежить стара версія (без об'єкта animations), скидаємо до нової
      if (!parsed.animations) return advancedInitialParams;
      return parsed;
    }
    return advancedInitialParams;
  });

  const [refreshKey, setRefreshKey] = useState(0);

  // НОВА ЛОГІКА ОНОВЛЕННЯ 1: Для Дизайну (color, size, elementType)
  const updateDesignParam = (key, value) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  };

  // НОВА ЛОГІКА ОНОВЛЕННЯ 2: Для Анімації конкретного стану (load, hover, click)
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
    setParams(advancedInitialParams);
    localStorage.removeItem('animadiv-params'); // Очищення при скиданні
  };

  const handleReplay = () => setRefreshKey((prev) => prev + 1);

  // Примітка: Після завершення всіх 3 кроків нам доведеться оновити generateFullCSS,
  // щоб він вмів читати нову структуру (params.animations). Поки що може не генерувати правильний CSS.
  const fullCss = useMemo(() => generateFullCSS(params), [params]);

  // Збереження params у localStorage з Debounce 500мс
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('animadiv-params', JSON.stringify(params));
      console.log('Saved NEW structure to localStorage');
    }, 500);

    return () => clearTimeout(timer);
  }, [params]);

  // Автоматичний перезапуск при зміні пресета для Load (бо Hover/Click ми тестуємо мишкою)
  useEffect(() => {
    handleReplay();
  }, [params.animations.load.presetId]);

  // Ін'єкція стилів у DOM
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
          onUpdateDesign={updateDesignParam}
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
