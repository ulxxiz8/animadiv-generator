import React, { useMemo, useState } from 'react';
import { generateHtml } from '../../utils/generateHtml';
import DeveloperHandoffModal from '../../components/DeveloperHandoffModal';
import { useTranslation } from '../../i18n/useTranslation';

const CODE_FONT =
  'JetBrains Mono, SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace';

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
        minHeight: '260px',
        overflow: 'auto',
        padding: '16px 0',
        tabSize: 2,
        fontFamily: CODE_FONT,
        fontSize: '12.5px',
        lineHeight: 1.6,
        outline: 'none',
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
  );
};

const CodePanel = ({ label, value, copied, onCopy }) => {
  const { t } = useTranslation();
  const copyLabel = label === 'HTML' ? t('handoff.copyHtml') : t('handoff.copyCss');

  return (
  <section
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      minWidth: 0,
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
      <h3
        style={{
          margin: 0,
          color: 'var(--text-main)',
          fontSize: '13px',
          fontWeight: 850,
          letterSpacing: '0.01em',
        }}
      >
        {label}
      </h3>

      <button
        type="button"
        onClick={onCopy}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 34,
          background: copied ? '#D6F854' : 'var(--button-bg)',
          color: copied ? '#111827' : 'var(--button-text)',
          border: '1px solid',
          borderColor: copied ? '#D6F854' : 'var(--button-bg)',
          padding: '8px 12px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '12px',
          fontWeight: 850,
          lineHeight: 1,
          whiteSpace: 'nowrap',
          transition: 'all 0.15s ease',
        }}
      >
        {copied ? t('common.copied') : copyLabel}
      </button>
    </div>

    <div
      style={{
        background: 'var(--code-bg)',
        color: 'var(--code-text)',
        border: '1px solid var(--border)',
        borderRadius: '10px',
        flex: 1,
        minWidth: 0,
        minHeight: 0,
        overflow: 'hidden',
      }}
    >
      <CodeBlock value={value} label={t('codeOutput.generatedCode')} />
    </div>
  </section>
  );
};

const CodeOutput = ({ params, code, activePreviewState }) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState('');
  const [isHandoffOpen, setIsHandoffOpen] = useState(false);

  const htmlCode = useMemo(() => generateHtml(params), [params]);
  const cleanCSS = useMemo(() => (code ? code.trim() : ''), [code]);
  const cleanHTML = useMemo(
    () => (htmlCode ? htmlCode.trim() : ''),
    [htmlCode]
  );

  const handleCopy = async (type, value) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(type);
      window.setTimeout(() => setCopied(''), 1600);
    } catch (err) {
      console.error('Copy failed', err);
      setCopied('');
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
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
          gap: '12px',
          flex: 1,
          minWidth: 0,
          minHeight: 0,
        }}
      >
        <CodePanel
          label="HTML"
          value={cleanHTML}
          copied={copied === 'html'}
          onCopy={() => handleCopy('html', cleanHTML)}
        />
        <CodePanel
          label="CSS"
          value={cleanCSS}
          copied={copied === 'css'}
          onCopy={() => handleCopy('css', cleanCSS)}
        />
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
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
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
            lineHeight: 1,
            transition: 'opacity 0.15s ease',
          }}
        >
          {t('codeOutput.developerHandoff')}</button>
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

