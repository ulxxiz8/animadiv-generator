import React, { useMemo, useState } from 'react';
import { generateHtml } from '../../utils/generateHtml';
import DeveloperHandoffModal from '../../components/DeveloperHandoffModal';

const TABS = [
  { id: 'html', label: 'HTML' },
  { id: 'css', label: 'CSS' },
  { id: 'combined', label: 'Combined' },
];

const CodeOutput = ({ params, code }) => {
  const [activeTab, setActiveTab] = useState('html');
  const [copied, setCopied] = useState(false);
  const [isHandoffOpen, setIsHandoffOpen] = useState(false);

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

  const codeLines = useMemo(() => renderedCode.split('\n'), [renderedCode]);

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
      background: isActive ? 'var(--button-bg)' : 'transparent',
      color: isActive ? 'var(--button-text)' : 'var(--text-muted)',
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
            background: 'var(--surface-subtle)',
            border: '1px solid var(--border)',
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
            background: copied ? '#D6F854' : 'var(--button-bg)',
            color: copied ? '#111827' : 'var(--button-text)',
            border: '1px solid',
            borderColor: copied ? '#D6F854' : 'var(--button-bg)',
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
          background: 'var(--code-bg)',
          color: 'var(--code-text)',
          border: '1px solid var(--border)',
          borderRadius: '10px',
          minHeight: '260px',
          flex: 1,
          minWidth: 0,
          minBlockSize: 0,
          overflow: 'hidden',
        }}
      >
        <div
          role="textbox"
          aria-label="Generated code"
          aria-multiline="true"
          tabIndex={0}
          style={{
            height: '100%',
            maxHeight: 'calc(100vh - 260px)',
            minHeight: '260px',
            overflow: 'auto',
            padding: '16px 0',
            tabSize: 2,
            fontFamily:
              'JetBrains Mono, SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace',
            fontSize: '12.5px',
            lineHeight: 1.6,
            outline: 'none',
          }}
        >
          {codeLines.map((line, index) => (
            <div
              key={`${activeTab}-${index}-${line}`}
              style={{
                display: 'grid',
                gridTemplateColumns: '34px minmax(0, 1fr)',
                alignItems: 'start',
                minWidth: 0,
                paddingRight: '12px',
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  color: 'var(--text-muted)',
                  opacity: 0.7,
                  userSelect: 'none',
                  textAlign: 'right',
                  paddingRight: '8px',
                  borderRight: '1px solid rgba(148, 163, 184, 0.22)',
                }}
              >
                {index + 1}
              </span>
              <code
                style={{
                  display: 'block',
                  minWidth: 0,
                  paddingLeft: '8px',
                  whiteSpace: 'pre-wrap',
                  overflowWrap: 'anywhere',
                  wordBreak: 'break-word',
                }}
              >
                {line || ' '}
              </code>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          flex: 'none',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '12px',
        }}
      >
        <button
          type="button"
          onClick={() => setIsHandoffOpen(true)}
          style={{
            width: '100%',
            minHeight: 42,
            background: 'var(--button-bg)',
            color: 'var(--button-text)',
            border: '1px solid var(--button-bg)',
            padding: '10px 14px',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 850,
            whiteSpace: 'normal',
            lineHeight: 1.2,
            transition: 'opacity 0.15s ease',
          }}
        >
          Передати розробнику
        </button>
      </div>

      <DeveloperHandoffModal
        open={isHandoffOpen}
        onClose={() => setIsHandoffOpen(false)}
        params={params}
        css={cleanCSS}
        title="Current generator element"
      />
    </div>
  );
};

export default React.memo(CodeOutput);
