import React, { useMemo, useState } from 'react';
import DeveloperHandoffModal from '../../components/DeveloperHandoffModal';
import { createDeveloperHandoffFromBundle } from '../../utils/developerHandoff';
import { useTranslation } from '../../i18n/useTranslation';

const TABS = [
  { id: 'html', label: 'HTML' },
  { id: 'css', label: 'CSS' },
];

const copyText = async (value) => {
  await navigator.clipboard.writeText(value);
};

const CollectionCodeOutput = ({ bundle, title }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('html');
  const [copied, setCopied] = useState(false);
  const [isHandoffOpen, setIsHandoffOpen] = useState(false);
  const [handoffId, setHandoffId] = useState('');

  const renderedCode = bundle?.[activeTab] || '';
  const codeLines = useMemo(() => renderedCode.split('\n'), [renderedCode]);

  const handleCopy = async () => {
    try {
      await copyText(renderedCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch (error) {
      console.error('Copy failed', error);
      setCopied(false);
    }
  };

  const getTabStyle = (tabId) => {
    const isActive = activeTab === tabId;
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
        gap: 12,
        height: '100%',
        minHeight: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
          role="tablist"
          aria-label={t('aria.exportCodeFormat')}
          style={{
            display: 'flex',
            gap: 4,
            background: 'var(--surface-subtle)',
            border: '1px solid var(--border)',
            padding: 4,
            borderRadius: 10,
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
              {tab.labelKey ? t(tab.labelKey) : tab.label}
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
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: 800,
            whiteSpace: 'nowrap',
            transition: 'all 0.15s ease',
          }}
        >
          {copied ? t('common.copied') : t('common.copy')}
        </button>
      </div>

      <div
        style={{
          background: 'var(--code-bg)',
          color: 'var(--code-text)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          flex: 1,
          minHeight: 0,
          minWidth: 0,
          overflow: 'hidden',
        }}
      >
        <div
          role="textbox"
          aria-label={t('aria.generatedCode')}
          aria-multiline="true"
          tabIndex={0}
          style={{
            height: '100%',
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
                paddingRight: 12,
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  color: 'var(--text-muted)',
                  opacity: 0.7,
                  userSelect: 'none',
                  textAlign: 'right',
                  paddingRight: 8,
                  borderRight: '1px solid rgba(148, 163, 184, 0.22)',
                }}
              >
                {index + 1}
              </span>
              <code
                style={{
                  display: 'block',
                  minWidth: 0,
                  paddingLeft: 8,
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
          borderRadius: 12,
          padding: 12,
        }}
      >
        <button
          type="button"
          onClick={() => {
            const handoff = createDeveloperHandoffFromBundle({ bundle, title, previewState: 'load' });
            setHandoffId(handoff.id);
            setIsHandoffOpen(true);
          }}
          style={{
            width: '100%',
            minHeight: 42,
            background: 'var(--button-bg)',
            color: 'var(--button-text)',
            border: '1px solid var(--button-bg)',
            padding: '10px 14px',
            borderRadius: 12,
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 850,
            whiteSpace: 'normal',
            lineHeight: 1.2,
          }}
        >
          {t('codeOutput.developerHandoff')}
        </button>
      </div>

      <DeveloperHandoffModal
        open={isHandoffOpen}
        onClose={() => setIsHandoffOpen(false)}
        handoffId={handoffId}
      />
    </div>
  );
};

export default React.memo(CollectionCodeOutput);
