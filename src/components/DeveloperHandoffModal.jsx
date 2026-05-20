import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle, Copy, ExternalLink, Link as LinkIcon, X } from 'lucide-react';
import {
  createCodeBundle,
  createDeveloperHandoff,
  readDeveloperHandoff,
} from '../utils/developerHandoff';

const TABS = [
  { id: 'html', label: 'HTML' },
  { id: 'css', label: 'CSS' },
  { id: 'combined', label: 'Combined' },
];

const copyText = async (text) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
};

const CodeBlock = ({ value }) => {
  const lines = String(value || '').split('\n');

  return (
    <div
      style={{
        background: 'var(--code-bg, #111827)',
        color: 'var(--code-text, #F9FAFB)',
        border: '1px solid var(--border, #E5E7EB)',
        borderRadius: 16,
        height: 330,
        minHeight: 0,
        maxHeight: 330,
        overflow: 'auto',
        padding: '14px 0',
        fontFamily:
          'JetBrains Mono, SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace',
        fontSize: 12.5,
        lineHeight: 1.6,
      }}
    >
      {lines.map((line, index) => (
        <div
          key={`${index}-${line}`}
          style={{
            display: 'grid',
            gridTemplateColumns: '38px minmax(0, 1fr)',
            paddingRight: 12,
          }}
        >
          <span
            style={{
              color: 'var(--text-muted, #9CA3AF)',
              opacity: 0.72,
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
              paddingLeft: 10,
              whiteSpace: 'pre-wrap',
              overflowWrap: 'anywhere',
            }}
          >
            {line || ' '}
          </code>
        </div>
      ))}
    </div>
  );
};

const ElementPreview = ({ bundle }) => {
  const srcDoc = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      * { box-sizing: border-box; }
      html, body { width: 100%; height: 100%; margin: 0; }
      body {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 220px;
        padding: 32px;
        background: #F9FAFB;
        color: #111827;
        font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
      ${bundle?.css || ''}
    </style>
  </head>
  <body>
    ${bundle?.html || ''}
  </body>
</html>`;

  return (
    <div
      style={{
        background: 'var(--surface-subtle, #F3F4F6)',
        border: '1px solid var(--border, #E5E7EB)',
        borderRadius: 24,
        padding: 12,
        minHeight: 0,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          marginBottom: 10,
          padding: '0 4px',
        }}
      >
        <strong
          style={{
            color: 'var(--text-main, #111827)',
            fontSize: 13,
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: '-0.01em',
          }}
        >
          Preview
        </strong>
        <span
          style={{
            color: 'var(--text-muted, #6B7280)',
            fontSize: 12,
            fontWeight: 800,
          }}
        >
          Rendered from generated HTML + CSS
        </span>
      </div>
      <iframe
        title="Developer handoff element preview"
        sandbox=""
        srcDoc={srcDoc}
        style={{
          width: '100%',
          height: 330,
          maxHeight: 330,
          display: 'block',
          border: '1px solid var(--border, #E5E7EB)',
          borderRadius: 16,
          background: '#F9FAFB',
        }}
      />
    </div>
  );
};

const DeveloperHandoffModal = ({
  open,
  onClose,
  params,
  css,
  title,
  handoffId,
}) => {
  const [activeTab, setActiveTab] = useState('html');
  const [copied, setCopied] = useState('');

  const handoff = useMemo(() => {
    if (!open) return null;
    if (handoffId) {
      const saved = readDeveloperHandoff(handoffId);
      if (saved) {
        const url = new URL(window.location.href);
        return { ...saved, url: url.toString() };
      }
    }

    if (params) {
      return createDeveloperHandoff({ params, css, title });
    }

    return null;
  }, [css, handoffId, open, params, title]);

  useEffect(() => {
    if (!open) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [onClose, open]);

  const bundle = useMemo(() => {
    if (handoff?.bundle) return handoff.bundle;
    if (params) return createCodeBundle(params, css);
    return { html: '', css: '', combined: '' };
  }, [css, handoff, params]);

  if (!open) return null;

  const currentCode = bundle[activeTab] || '';

  const handleCopy = async (kind, value) => {
    await copyText(value);
    setCopied(kind);
    window.setTimeout(() => setCopied(''), 1400);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Передати розробнику"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(15, 23, 42, 0.54)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        overflow: 'hidden',
      }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose?.();
      }}
    >
      <section
        style={{
          width: 'min(1320px, 100%)',
          maxHeight: 'calc(100vh - 40px)',
          background: 'var(--surface, #FFFFFF)',
          color: 'var(--text-main, #111827)',
          border: '1px solid var(--border, #E5E7EB)',
          borderRadius: 24,
          boxShadow: '0 30px 80px rgba(15, 23, 42, 0.28)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <header
          style={{
            padding: '18px 20px',
            borderBottom: '1px solid var(--border, #E5E7EB)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 900 }}>
              Передати розробнику
            </h2>
            <p
              style={{
                margin: '4px 0 0',
                color: 'var(--text-muted, #6B7280)',
                fontSize: 13,
              }}
            >
              {handoff?.title || title || 'Generated AnimaDiv code'}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              width: 36,
              height: 36,
              border: '1px solid var(--border, #E5E7EB)',
              borderRadius: 12,
              background: 'transparent',
              color: 'currentColor',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={18} />
          </button>
        </header>

        <div
          style={{
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            minHeight: 0,
            flex: 1,
            overflow: 'auto',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) auto auto',
              gap: 10,
              alignItems: 'center',
            }}
          >
            <input
              readOnly
              value={handoff?.url || ''}
              style={{
                height: 40,
                minWidth: 0,
                border: '1px solid var(--border, #E5E7EB)',
                borderRadius: 12,
                padding: '0 12px',
                background: 'var(--control-bg, #F9FAFB)',
                color: 'var(--text-main, #111827)',
                fontSize: 13,
              }}
            />
            <button
              type="button"
              onClick={() => handleCopy('link', handoff?.url || '')}
              style={{
                height: 40,
                border: '1px solid var(--button-bg, #111827)',
                borderRadius: 8,
                background:
                  copied === 'link' ? '#D6F854' : 'var(--button-bg, #111827)',
                color: copied === 'link' ? '#111827' : '#D6F854',
                padding: '0 12px',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 850,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                whiteSpace: 'nowrap',
              }}
            >
              {copied === 'link' ? <CheckCircle size={15} /> : <LinkIcon size={15} />}
              Copy link
            </button>
            <button
              type="button"
              onClick={() => {
                if (handoff?.url) window.open(handoff.url, '_blank', 'noopener,noreferrer');
              }}
              style={{
                height: 40,
                border: '1px solid var(--border, #E5E7EB)',
                borderRadius: 12,
                background: '#FFFFFF',
                color: '#111827',
                padding: '0 12px',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 850,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                whiteSpace: 'nowrap',
              }}
            >
              <ExternalLink size={15} />
              Open
            </button>
          </div>

          <div
            style={{
              background: '#F9FAFB',
              border: '1px solid #E5E7EB',
              borderRadius: 16,
              padding: '14px 16px',
              color: '#6B7280',
              fontSize: 13,
              lineHeight: 1.5,
            }}
          >
            <strong
              style={{
                display: 'block',
                color: '#111827',
                fontSize: 13,
                fontWeight: 900,
                lineHeight: 1.1,
                letterSpacing: '-0.01em',
                marginBottom: 6,
              }}
            >
              Інструкція для розробника
            </strong>
            Скопіюйте `Combined` і вставте його у потрібний HTML-файл. Якщо
            HTML і CSS зберігаються окремо, скопіюйте вкладку `HTML` у
            розмітку, а вкладку `CSS` у stylesheet. Посилання `Copy link`
            відкриває цю саму модалку з кодом без додаткового експорту.
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))',
              gap: 14,
              alignItems: 'stretch',
              minHeight: 0,
              overflow: 'hidden',
            }}
          >
            <ElementPreview bundle={bundle} />
            <div
              style={{
                minWidth: 0,
                minHeight: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  gap: 10,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                }}
              >
            <div
              role="tablist"
              aria-label="Developer handoff code tabs"
              style={{
                display: 'flex',
                gap: 4,
                background: 'var(--surface-subtle, #F3F4F6)',
                border: '1px solid var(--border, #E5E7EB)',
                padding: 4,
                borderRadius: 12,
              }}
            >
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      background: isActive
                        ? 'var(--button-bg, #111827)'
                        : 'transparent',
                      color: isActive
                        ? 'var(--button-text, #D6F854)'
                        : 'var(--text-muted, #6B7280)',
                      border: 'none',
                      padding: '8px 12px',
                      borderRadius: 7,
                      cursor: 'pointer',
                      fontSize: 12,
                      fontWeight: 850,
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => handleCopy('code', currentCode)}
              style={{
                height: 38,
                border: '1px solid var(--button-bg, #111827)',
                borderRadius: 12,
                background:
                  copied === 'code' ? '#D6F854' : 'var(--button-bg, #111827)',
                color: copied === 'code' ? '#111827' : '#D6F854',
                padding: '0 12px',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 850,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              {copied === 'code' ? <CheckCircle size={15} /> : <Copy size={15} />}
              Copy code
            </button>
              </div>

              <CodeBlock value={currentCode} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DeveloperHandoffModal;
