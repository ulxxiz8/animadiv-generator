import React, { useState } from 'react';

const CodeOutput = ({ params, code }) => {
  const [activeTab, setActiveTab] = useState('css');

  const htmlCode = `<${params.elementType || 'div'} class="ag-animated"></${params.elementType || 'div'}>`;
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      alert('Код скопійовано!'); // Або зміна тексту кнопки на "Copied!"
    } catch (err) {
      console.error('Помилка копіювання', err);
    }
  };
  const downloadCss = () => {
    const blob = new Blob([code], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'animation.css';
    link.click();
  };
  // І додай onClick={handleCopy} до своєї кнопки <button> у цьому ж файлі
  return (
    <div
      className="code-output"
      style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
    >
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={() => setActiveTab('css')}
          style={{
            background: activeTab === 'css' ? '#4F46E5' : '#eee',
            color: activeTab === 'css' ? 'white' : '#333',
            border: 'none',
            padding: '5px 15px',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          CSS
        </button>
        <button
          onClick={() => setActiveTab('html')}
          style={{
            background: activeTab === 'html' ? '#4F46E5' : '#eee',
            color: activeTab === 'html' ? 'white' : '#333',
            border: 'none',
            padding: '5px 15px',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          HTML
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
        }}
      >
        <pre
          style={{
            margin: 0,
            whiteSpace: 'pre-wrap',
            fontFamily: 'monospace',
            fontSize: '13px',
          }}
        >
          <code>{activeTab === 'css' ? code : htmlCode}</code>
        </pre>
      </div>
    </div>
  );
};

export default CodeOutput;
