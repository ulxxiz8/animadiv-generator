import React, { useMemo, useState } from 'react';
import { generateHtml } from '../../utils/generateHtml';
import DeveloperHandoffModal from '../../components/DeveloperHandoffModal';
import { useTranslation } from '../../i18n/useTranslation';

const CODE_FONT =
  'JetBrains Mono, SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace';

const tabs = ['html', 'css'];

const getTabLabel = (tab) => tab.toUpperCase();

const CodeBlock = ({ value, label }) => {
  const lines = useMemo(() => String(value || '').split('\n'), [value]);

  return (
    <div
      role="textbox"
      aria-label={label}
      aria-multiline="true"
      tabIndex={0}
      style={{
        height: '100%',
        minHeight: '280px',
        overflowY: 'auto',
        overflowX: 'hidden',
        padding: '18px 0',
        tabSize: 2,
        fontFamily: CODE_FONT,
        fontSize: '12.5px',
        lineHeight: 1.65,
        outline: 'none',
        boxSizing: 'border-box',
      }}
    >
      {lines.map((line, index) => (
        <div
          key={`${label}-${index}-${line}`}
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
              paddingRight: '9px',
              borderRight: '1px solid rgba(148, 163, 184, 0.22)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {index + 1}
          </span>
          <code
            style={{
              display: 'block',
              minWidth: 0,
              paddingLeft: '12px',
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
  );
};

const CodeOutput = ({ params, code, activePreviewState }) => {
  const { t, language } = useTranslation();
  const [activeTab, setActiveTab] = useState('html');
  const [copied, setCopied] = useState(false);
  const [isHandoffOpen, setIsHandoffOpen] = useState(false);

  const htmlCode = useMemo(() => generateHtml(params), [params]);
  const cleanCSS = useMemo(() => (code ? code.trim() : ''), [code]);
  const cleanHTML = useMemo(
    () => (htmlCode ? htmlCode.trim() : ''),
    [htmlCode]
  );

  const visibleCode = activeTab === 'html' ? cleanHTML : cleanCSS;
  const copyLabel = t('common.copy', { defaultValue: 'Copy' });
  const copiedLabel = language === 'ua' ? 'Готово' : t('common.copied', { defaultValue: 'Copied' });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(visibleCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch (err) {
      console.error('Copy failed', err);
      setCopied(false);
    }
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
      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          flex: 1,
          minWidth: 0,
          minHeight: 0,
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) 88px',
            alignItems: 'stretch',
            gap: '10px',
          }}
        >
          <div
            role="tablist"
            aria-label={t('codeOutput.exportCodeFormat')}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              width: '100%',
              minWidth: 0,
              background: 'var(--surface-subtle)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              padding: 4,
              gap: 4,
              boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
              boxSizing: 'border-box',
            }}
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab;

              return (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    minWidth: 0,
                    minHeight: 44,
                    border: 'none',
                    borderRadius: '12px',
                    background: isActive ? '#D6F854' : 'transparent',
                    color: isActive ? '#111827' : 'var(--text-muted)',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 900,
                    lineHeight: 1,
                    letterSpacing: '0.02em',
                    textAlign: 'center',
                    transition: 'background-color 0.15s ease, color 0.15s ease',
                    boxSizing: 'border-box',
                    padding: '0 10px',
                  }}
                >
                  {getTabLabel(tab)}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleCopy}
            title={copied ? copiedLabel : copyLabel}
            aria-label={copyLabel}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 88,
              minWidth: 88,
              minHeight: 52,
              background: copied ? 'var(--button-bg)' : '#D6F854',
              color: copied ? 'var(--button-text)' : '#111827',
              border: copied ? '1px solid var(--button-bg)' : '1px solid #D6F854',
              padding: '0 10px',
              borderRadius: '14px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 900,
              lineHeight: 1,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              textAlign: 'center',
              boxSizing: 'border-box',
              transition: 'background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease',
            }}
          >
            {copied ? copiedLabel : copyLabel}
          </button>
        </div>

        <div
          style={{
            background: 'var(--code-bg)',
            color: 'var(--code-text)',
            border: '1px solid var(--border)',
            borderRadius: '14px',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
            flex: 1,
            minWidth: 0,
            minHeight: 0,
            overflow: 'hidden',
          }}
        >
          <CodeBlock
            value={visibleCode}
            label={`${getTabLabel(activeTab)} ${t('codeOutput.generatedCode')}`}
          />
        </div>
      </section>

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
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            minHeight: 42,
            background: 'var(--button-bg)',
            color: 'var(--button-text)',
            border: '1px solid var(--button-bg)',
            padding: '0 14px',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 850,
            whiteSpace: 'normal',
            lineHeight: 1.15,
            textAlign: 'center',
            boxSizing: 'border-box',
            transition: 'opacity 0.15s ease',
          }}
        >
          {t('codeOutput.developerHandoff')}
        </button>
      </div>

      <DeveloperHandoffModal
        open={isHandoffOpen}
        onClose={() => setIsHandoffOpen(false)}
        params={params}
        css={cleanCSS}
        title={params?.name || t('handoff.generatedCode')}
        previewState={activePreviewState}
      />
    </div>
  );
};

export default React.memo(CodeOutput);
