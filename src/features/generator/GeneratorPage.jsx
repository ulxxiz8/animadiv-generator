import React, { useMemo, useState, useEffect } from 'react';
import ControlsPanel from './ControlsPanel';
import PreviewArea from './PreviewArea';
import CodeOutput from './CodeOutput';
import { initialParams } from '../../data/defaultParams';
import { generateFullCSS } from '../../utils/generateCss';

const GeneratorPage = () => {
  // ТАСКА: Завантаження параметрів з localStorage при старті
  const [params, setParams] = useState(() => {
    const saved = localStorage.getItem('animadiv-params');
    return saved ? JSON.parse(saved) : initialParams;
  });

  const [refreshKey, setRefreshKey] = useState(0);

  const updateParam = (key, value) =>
    setParams((prev) => ({ ...prev, [key]: value }));
  const resetParams = () => {
    setParams(initialParams);
    localStorage.removeItem('animadiv-params'); // Очищення при скиданні
  };
  const handleReplay = () => setRefreshKey((prev) => prev + 1);

  const fullCss = useMemo(() => generateFullCSS(params), [params]);

  // ТАСКА: Збереження params у localStorage з Debounce 500мс
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('animadiv-params', JSON.stringify(params));
      console.log('Saved to localStorage'); // Для тестування
    }, 500);

    // Очищення таймера, якщо params змінилися швидше ніж за 500мс
    return () => clearTimeout(timer);
  }, [params]);

  // Автоматичний перезапуск при зміні пресета
  useEffect(() => {
    handleReplay();
  }, [params.presetId]);

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
          onUpdate={updateParam}
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
