import React, { useMemo, useState } from 'react';
import ControlsPanel from './ControlsPanel';
import PreviewArea from './PreviewArea';
import CodeOutput from './CodeOutput';
import { initialParams } from '../../data/defaultParams';
import { generateFullCSS } from '../../utils/generateCss';

const GeneratorPage = () => {
  const [params, setParams] = useState(initialParams);
  const [refreshKey, setRefreshKey] = useState(0);

  const updateParam = (key, value) =>
    setParams((prev) => ({ ...prev, [key]: value }));
  const resetParams = () => setParams(initialParams);
  const handleReplay = () => setRefreshKey((prev) => prev + 1);

  // Таска 6: Обчислення (залишається робочою)
  const fullCss = useMemo(() => generateFullCSS(params), [params]);
  // ТАСКА: Ін'єкція стилів у DOM
  React.useEffect(() => {
    // 1. Створюємо або знаходимо існуючий тег <style> для наших динамічних анімацій
    let styleTag = document.getElementById('dynamic-animation-styles');

    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'dynamic-animation-styles';
      document.head.appendChild(styleTag);
    }

    // 2. Записуємо наш згенерований CSS у цей тег
    styleTag.innerHTML = fullCss;

    // 3. Очищення при видаленні компонента (опціонально, але професійно)
    return () => {
      if (styleTag) {
        styleTag.innerHTML = '';
      }
    };
  }, [fullCss]); // Ефект спрацьовує щоразу, коли змінюється текст коду
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

      {/* ПОВЕРТАЄМО ПАНЕЛІ В ОДИН РЯД, ЯКЩО ТВІЙ CSS ЦЕ ПЕРЕДБАЧАЄ */}
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
