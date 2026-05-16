import React, { useMemo, useState } from 'react';
import { generateHtml } from '../../utils/generateHtml';

const TABS = [
  { id: 'html', label: 'HTML' },
  { id: 'css', label: 'CSS' },
  { id: 'combined', label: 'Combined' },
];

const CodeOutput = ({ params, code }) => {
  const [activeTab, setActiveTab] = useState('html');
  const [copied, setCopied] = useState(false);

  const htmlCode = useMemo(() => generateHtml(params), [params]);
  const cleanCSS = useMemo(() => (code ? code.trim() : ''), [code]);
  const cleanHTML = useMemo(
    () => (htmlCode ? htmlCode.trim() : ''),
    [htmlCode]
  );

  const renderedCode = useMemo(() => {
    if (activeTab === 'html') return cleanHTML;
    if (activeTab === 'css') return cleanCSS;
    return `${cleanHTML}

/* ========================= */
/* CSS Animation and Styles */
/* ========================= */
${cleanCSS}`;
  }, [activeTab, cleanCSS, cleanHTML]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(renderedCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch (err) {
      console.error('Copy failed', err);
      setCopied(false);
    }
  };

  const getTabStyle = (tabName) => {
    const isActive = activeTab === tabName;
    return {
      flex: 1,
      background: isActive ? '#111827' : 'transparent',
      color: isActive ? '#D6F854' : '#6B7280',
      border: 'none',
      padding: '9px 12px',
      borderRadius: '7px',
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: 800,
      letterSpacing: '0.02em',
      transition: 'background 0.15s ease, color 0.15s ease',
    };
  };

  return (
    <div
      className="code-output"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        height: '100%',
        minHeight: 0,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        <div
          role="tablist"
          aria-label="Export code format"
          style={{
            display: 'flex',
            gap: '4px',
            background: '#F3F4F6',
            border: '1px solid #E5E7EB',
            padding: '4px',
            borderRadius: '10px',
            flex: 1,
          }}
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={getTabStyle(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleCopy}
          style={{
            background: copied ? '#10B981' : '#111827',
            color: copied ? '#ffffff' : '#D6F854',
            border: '1px solid',
            borderColor: copied ? '#10B981' : '#111827',
            padding: '9px 14px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 800,
            whiteSpace: 'nowrap',
            transition: 'all 0.15s ease',
          }}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <div
        style={{
          background: '#111827',
          color: '#F9FAFB',
          border: '1px solid #374151',
          borderRadius: '10px',
          minHeight: '260px',
          flex: 1,
          minWidth: 0,
          minBlockSize: 0,
          overflow: 'hidden',
        }}
      >
        <pre
          style={{
            margin: 0,
            height: '100%',
            maxHeight: 'calc(100vh - 260px)',
            minHeight: '260px',
            overflow: 'auto',
            padding: '18px',
            whiteSpace: 'pre',
            tabSize: 2,
            fontFamily:
              'JetBrains Mono, SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace',
            fontSize: '12.5px',
            lineHeight: 1.6,
          }}
        >
          <code>{renderedCode}</code>
        </pre>
      </div>
    </div>
  );
};

export default React.memo(CodeOutput);
