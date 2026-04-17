import React, { useState } from 'react';
import { generateHtml } from '../../utils/generateHtml';

const CodeOutput = ({ params, code }) => {
  const [activeTab, setActiveTab] = useState('css');
  const [copied, setCopied] = useState(false);

  // Формуємо HTML
  const htmlCode = generateHtml(params);

  // ТАСКА 7: Форматування коду (Простий шаблон)
  const renderCode = () => {
    // Очищаємо код від випадкових порожніх рядків зверху та знизу
    const cleanCSS = code ? code.trim() : '';
    const cleanHTML = htmlCode ? htmlCode.trim() : '';

    if (activeTab === 'css') return cleanCSS;
    if (activeTab === 'html') return cleanHTML;
    if (activeTab === 'both') {
      // Охайний шаблон з візуальними розділювачами
      return `${cleanHTML}

/* ========================= */
/* CSS Анімація та Стилі     */
/* ========================= */
${cleanCSS}`;
    }
    return '';
  };

  const handleCopy = async () => {
    try {
      const textToCopy = renderCode();
      await navigator.clipboard.writeText(textToCopy);

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Помилка копіювання', err);
    }
  };

  const getTabStyle = (tabName) => ({
    background: activeTab === tabName ? '#4F46E5' : '#eee',
    color: activeTab === tabName ? 'white' : '#333',
    border: 'none',
    padding: '5px 15px',
    borderRadius: '4px',
    cursor: 'pointer',
  });

  return (
    <div
      className="code-output"
      style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
    >
      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={() => setActiveTab('css')} style={getTabStyle('css')}>
          CSS
        </button>
        <button
          onClick={() => setActiveTab('html')}
          style={getTabStyle('html')}
        >
          HTML
        </button>
        <button
          onClick={() => setActiveTab('both')}
          style={getTabStyle('both')}
        >
          Both
        </button>
      </div>

      <div
        style={{
          background: '#1F2937',
          color: '#F9FAFB',
          padding: '20px',
          borderRadius: '8px',
          position: 'relative',
          minHeight: '150px',
          overflowX: 'auto',
        }}
      >
        <button
          onClick={handleCopy}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: copied ? '#10B981' : '#374151',
            color: 'white',
            border: '1px solid',
            borderColor: copied ? '#10B981' : '#4B5563',
            padding: '4px 10px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            transition: 'all 0.2s ease',
          }}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>

        <pre
          style={{
            margin: 0,
            marginTop: '10px',
            whiteSpace: 'pre-wrap',
            fontFamily: 'monospace',
            fontSize: '13px',
            lineHeight: '1.5', // Додає коду легкості для читання
          }}
        >
          <code>{renderCode()}</code>
        </pre>
      </div>
    </div>
  );
};

export default CodeOutput;
