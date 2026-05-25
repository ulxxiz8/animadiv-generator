import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  CheckCircle,
  Copy,
  ExternalLink,
  Link as LinkIcon,
  MonitorSmartphone,
  MousePointer2,
  Pointer,
  RotateCcw,
  X,
} from 'lucide-react';
import {
  createCodeBundle,
  createDeveloperHandoff,
  createDeveloperHandoffUrl,
  readDeveloperHandoff,
} from '../utils/developerHandoff';
import {
  getPreferredPreviewState,
  getPreviewStatesForType,
} from '../utils/previewState';
import { useTranslation } from '../i18n/useTranslation';

const modalButtonBase = {
  height: 40,
  borderRadius: 12,
  padding: '0 14px',
  cursor: 'pointer',
  fontSize: 12,
  fontWeight: 850,
  lineHeight: 'normal',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 7,
  whiteSpace: 'nowrap',
  flex: '0 0 auto',
  verticalAlign: 'middle',
};

const getPrimaryButtonStyle = (active = false) => ({
  ...modalButtonBase,
  minWidth: 118,
  border: '1px solid var(--button-bg, #111827)',
  background: active ? '#D6F854' : 'var(--button-bg, #111827)',
  color: active ? '#111827' : '#D6F854',
});

const secondaryButtonStyle = {
  ...modalButtonBase,
  minWidth: 94,
  border: '1px solid var(--border, #E5E7EB)',
  background: 'var(--surface, #FFFFFF)',
  color: 'var(--text-main, #111827)',
};

const MobileUnavailableBlock = () => {
  const { t } = useTranslation();

  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 24,
        padding: '48px 32px',
        maxWidth: 360,
        width: '100%',
        textAlign: 'center',
        boxShadow: 'rgba(0, 0, 0, 0.06) 0px 4px 24px',
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 16,
          background: 'var(--card-dark-bg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0px auto 24px',
        }}
      >
        <MonitorSmartphone
          size={28}
          color="var(--primary)"
          strokeWidth={1.75}
        />
      </div>
      <h2
        style={{
          fontSize: 22,
          fontWeight: 900,
          color: 'var(--text-main)',
          margin: '0px 0px 12px',
          lineHeight: 1.15,
          letterSpacing: '-0.01em',
        }}
      >
        {t('handoff.unavailableTitle')}
      </h2>
      <p
        style={{
          fontSize: 15,
          color: 'var(--text-muted)',
          lineHeight: 1.55,
          margin: '0px 0px 32px',
        }}
      >
        {t('mobileBlock.body')}
      </p>
      <a
        href="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 46,
          padding: '0px 24px',
          background: 'var(--card-dark-bg)',
          color: 'var(--primary)',
          borderRadius: 999,
          fontWeight: 800,
          fontSize: 14,
          textDecoration: 'none',
          border: '1px solid var(--card-dark-border)',
          transition: 'opacity 0.15s',
        }}
        onMouseEnter={(event) => {
          event.currentTarget.style.opacity = '0.75';
        }}
        onMouseLeave={(event) => {
          event.currentTarget.style.opacity = '1';
        }}
      >
        {t('mobileBlock.home')}
      </a>
    </div>
  );
};

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
        borderRadius: 14,
        height: 320,
        minHeight: 0,
        maxHeight: 320,
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

const CodePanel = ({ label, value, copied, onCopy }) => {
  const { t } = useTranslation();
  const copyLabel = label === 'HTML' ? t('handoff.copyHtml') : t('handoff.copyCss');

  return (
  <section
    aria-label={`${label} code`}
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
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        minHeight: 40,
      }}
    >
      <strong
        style={{
          color: 'var(--text-main, #111827)',
          fontSize: 13,
          fontWeight: 900,
          lineHeight: 1,
        }}
      >
        {label}
      </strong>
      <button
        type="button"
        onClick={onCopy}
        style={getPrimaryButtonStyle(copied)}
      >
        {copied ? (
          <CheckCircle size={15} style={{ flex: '0 0 auto' }} />
        ) : (
          <Copy size={15} style={{ flex: '0 0 auto' }} />
        )}
        <span style={{ lineHeight: 1 }}>{copyLabel}</span>
      </button>
    </div>

    <CodeBlock value={value} />
  </section>
  );
};

const escapePreviewHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const getTextContent = (params = {}) =>
  params.specificSettings?.content || params.content || params.name || 'Text';

const splitTextByWord = (text) => {
  let wordIndex = 0;

  return String(text)
    .split(/(\s+)/)
    .map((part) => {
      if (!part.trim()) return `<span style="white-space: pre;">${part}</span>`;

      const currentIndex = wordIndex;
      wordIndex += 1;

      return `<span class="anim-word" style="display: inline-block; vertical-align: bottom;"><span class="anim-inner" style="display: inline-block; --word-index: ${currentIndex};">${escapePreviewHtml(part)}</span></span>`;
    })
    .join('');
};

const splitTextByLetter = (text) => {
  let charIndex = 0;

  return String(text)
    .split(/(\s+)/)
    .map((part) => {
      if (!part.trim()) return `<span style="white-space: pre;">${part}</span>`;

      const letters = Array.from(part)
        .map((char) => {
          const currentIndex = charIndex;
          charIndex += 1;
          return `<span class="anim-char" style="display: inline-block; --char-index: ${currentIndex};">${escapePreviewHtml(char)}</span>`;
        })
        .join('');

      return `<span class="anim-word" style="display: inline-block; white-space: nowrap; vertical-align: bottom;">${letters}</span>`;
    })
    .join('');
};

const getPreviewHtml = (bundle = {}, params) => {
  const html = bundle.html || bundle.combined || '';
  const presetId = params?.animations?.load?.presetId;

  if (params?.type === 'button') {
    return html.replace(
      /(<(?:button|a)\b[^>]*class="animadiv-element"[^>]*>)([\s\S]*?)(<\/(?:button|a)>)/,
      (_, openTag, content, closeTag) =>
        `${openTag}<span class="animadiv-button-label">${content.trim()}</span>${closeTag}`
    );
  }

  if (params?.type !== 'text') return html;

  const splitPresets = new Set([
    'fadeByWord',
    'blurReveal',
    'underlineDraw',
    'fadeByLetter',
    'typewriter',
  ]);

  if (!splitPresets.has(presetId)) return html;

  const text = getTextContent(params);
  const splitHtml =
    presetId === 'fadeByLetter' || presetId === 'typewriter'
      ? splitTextByLetter(text)
      : splitTextByWord(text);

  return html.replace(
    /(<(?:p|span|h1|h2|h3|h4|h5|h6)\b[^>]*class="animadiv-element"[^>]*>)([\s\S]*?)(<\/(?:p|span|h1|h2|h3|h4|h5|h6)>)/,
    `$1\n  ${splitHtml}\n$3`
  );
};

const PREVIEW_CANVAS_BACKGROUND = '#F9FAFB';

const PREVIEW_THEME_CSS = `
:root {
  --primary: #D6F854;
  --bg-color: #F9FAFB;
  --surface: #FFFFFF;
  --surface-alt: #F9FAFB;
  --surface-subtle: #F3F4F6;
  --text-main: #111827;
  --text-muted: #6B7280;
  --text-soft: #9CA3AF;
  --border: #E5E7EB;
  --border-strong: #1F2937;
  --control-border: #D1D5DB;
  --button-bg: #111827;
  --button-text: #D6F854;
  --button-secondary-text: #374151;
  --card-dark-bg: #111827;
  --card-dark-text: #FFFFFF;
  --card-dark-soft: #9CA3AF;
  --card-dark-border: #1F2937;
}
`;

const extractKeyframes = (css = '') =>
  String(css)
    .match(/@keyframes[^{]+{(?:[^{}]+{[^{}]*}\s*)+}/g)
    ?.join('\n\n') || '';

const extractPseudoRules = (css = '', pseudo) =>
  String(css)
    .match(/[^{}]+{[^{}]*}/g)
    ?.filter((rule) => rule.includes(pseudo))
    .join('\n\n') || '';

const removePseudoRules = (css = '', pseudos = []) =>
  String(css).replace(/[^{}]+{[^{}]*}/g, (rule) =>
    pseudos.some((pseudo) => rule.includes(pseudo)) ? '' : rule
  );

const getStateCss = (css = '', state = 'load') => {
  if (state === 'load') return removePseudoRules(css, [':hover', ':active']);

  const disableLoadAnimation = `
.animadiv-preview-root .animadiv-element {
  animation: none !important;
}

.animadiv-preview-root .animadiv-item {
  animation: none !important;
}
`;

  if (state === 'static') {
    return `${removePseudoRules(css, [':hover', ':active'])}\n${disableLoadAnimation}`;
  }

  const pseudo = state === 'click' ? ':active' : ':hover';
  const suppressedPseudo = state === 'click' ? ':hover' : ':active';
  const keyframes = extractKeyframes(css);
  const stateCss = extractPseudoRules(css, pseudo);
  const baseCss = removePseudoRules(css, [':hover', ':active']);

  return `${baseCss}\n${disableLoadAnimation}\n${keyframes}\n${removePseudoRules(stateCss, [suppressedPseudo])}`;
};

const createPreviewDocument = (bundle = {}, params, state = 'load') => {
  const html = getPreviewHtml(bundle, params);
  const css = getStateCss(bundle.css || '', state);
  const previewBackground = PREVIEW_CANVAS_BACKGROUND;

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Playfair+Display:wght@400;600;700&family=JetBrains+Mono:wght@400;600&display=swap');

    * {
      box-sizing: border-box;
    }

    html,
    body {
      width: 100%;
      min-height: 100%;
      margin: 0;
    }

    body {
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: ${previewBackground};
      background-size: 24px 24px;
      color: #111827;
      padding: 28px;
    }

    .animadiv-preview-root {
      width: 100%;
      min-height: calc(100vh - 56px);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .animadiv-preview-root > * {
      max-width: 100%;
    }

    ${PREVIEW_THEME_CSS}

    ${css}

    .animadiv-preview-root button.animadiv-element,
    .animadiv-preview-root a.animadiv-element[role="button"] {
      appearance: none;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      flex-direction: row !important;
      line-height: 1 !important;
      text-align: center !important;
      vertical-align: middle;
      font-family: inherit;
      padding-top: 0 !important;
      padding-bottom: 0 !important;
      margin: 0;
    }

    .animadiv-preview-root button.animadiv-element {
      border-style: solid;
    }

    .animadiv-preview-root button.animadiv-element > *,
    .animadiv-preview-root a.animadiv-element[role="button"] > * {
      line-height: 1 !important;
    }

    .animadiv-button-label {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 1em;
      line-height: 1 !important;
      transform: translateY(-1px);
      white-space: inherit;
    }
  </style>
</head>
<body>
  <main class="animadiv-preview-root">
${html}
  </main>
  <script>
    window.__animadivReplayLoad = function () {
      var element = document.querySelector('.animadiv-preview-root .animadiv-element');
      if (!element || !element.parentNode) return false;

      var clone = element.cloneNode(true);
      element.parentNode.replaceChild(clone, element);
      return true;
    };

    window.addEventListener('message', function (event) {
      if (!event.data || event.data.type !== 'animadiv:replay-load') return;
      window.__animadivReplayLoad();
    });
  </script>
</body>
</html>`;
};

const PreviewHint = ({ state }) => {
  if (state !== 'hover' && state !== 'click') return null;

  const Icon = state === 'click' ? Pointer : MousePointer2;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        right: 22,
        bottom: 20,
        width: 38,
        height: 38,
        borderRadius: 999,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#111827',
        background: 'rgba(255, 255, 255, 0.72)',
        boxShadow: '0 18px 42px rgba(15, 23, 42, 0.14)',
        pointerEvents: 'none',
      }}
    >
      <Icon size={24} strokeWidth={2.4} />
    </div>
  );
};

const HandoffPreview = ({ bundle, params, previewState }) => {
  const { t } = useTranslation();
  const iframeRef = useRef(null);
  const [iframeReplayKey, setIframeReplayKey] = useState(0);
  const states = useMemo(
    () =>
      params
        ? getPreviewStatesForType(params?.type)
        : [{ id: 'static', label: 'Static' }],
    [params]
  );
  const selectedState = useMemo(() => {
    if (states.some((state) => state.id === previewState)) {
      return previewState;
    }

    const preferred = getPreferredPreviewState(params);
    return states.some((state) => state.id === preferred)
      ? preferred
      : states[0]?.id || 'static';
  }, [params, previewState, states]);
  const srcDoc = useMemo(
    () => createPreviewDocument(bundle, params, selectedState),
    [bundle, params, selectedState]
  );
  const replayLoadAnimation = () => {
    const frameWindow = iframeRef.current?.contentWindow;

    if (!frameWindow) {
      setIframeReplayKey((value) => value + 1);
      return;
    }

    try {
      if (frameWindow.__animadivReplayLoad?.()) {
        return;
      }

      frameWindow.postMessage({ type: 'animadiv:replay-load' }, '*');

      const element = frameWindow.document?.querySelector(
        '.animadiv-preview-root .animadiv-element'
      );

      if (element?.parentNode) {
        element.parentNode.replaceChild(element.cloneNode(true), element);
        return;
      }
    } catch {
      // Fall through to iframe-level replay when browser access is restricted.
    }

    setIframeReplayKey((value) => value + 1);
  };

  return (
    <section
      aria-label={t('aria.preview')}
      style={{
        minWidth: 0,
        background: 'var(--surface-alt, #F9FAFB)',
        border: '1px solid var(--border, #E5E7EB)',
        borderRadius: 16,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          minHeight: 44,
          padding: '10px 14px',
          borderBottom: '1px solid var(--border, #E5E7EB)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <strong
          style={{
            color: 'var(--text-main, #111827)',
            fontSize: 13,
            fontWeight: 900,
            lineHeight: 1.1,
          }}
        >
          {t('common.preview')}
        </strong>
      </div>

      <div
        style={{
          minHeight: 300,
          background: 'var(--surface-alt, #F9FAFB)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {selectedState === 'load' && (
          <button
            type="button"
            onClick={replayLoadAnimation}
            style={{
              position: 'absolute',
              top: 12,
              right: 14,
              zIndex: 3,
              height: 34,
              minWidth: 82,
              border: '1px solid var(--button-bg, #111827)',
              borderRadius: 10,
              background: 'var(--button-bg, #111827)',
              color: 'var(--button-text, #D6F854)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 7,
              padding: '0 12px',
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 900,
              lineHeight: 'normal',
            }}
          >
            <RotateCcw size={15} style={{ flex: '0 0 auto' }} />
            <span style={{ lineHeight: 1 }}>{t('common.play')}</span>
          </button>
        )}

        <iframe
          key={`${selectedState}-${iframeReplayKey}`}
          ref={iframeRef}
          title={t('handoff.previewTitle')}
          srcDoc={srcDoc}
          style={{
            display: 'block',
            width: '100%',
            height: 300,
            border: 0,
            background: '#F9FAFB',
          }}
        />

        <PreviewHint state={selectedState} />
      </div>
    </section>
  );
};

const DeveloperHandoffModal = ({
  open,
  onClose,
  params,
  css,
  title,
  handoffId,
  bundle: bundleOverride,
  previewState,
}) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState('');
  const [isMobile, setIsMobile] = useState(() =>
    typeof window === 'undefined' ? false : window.innerWidth < 860
  );

  const handoff = useMemo(() => {
    if (!open) return null;

    if (handoffId) {
      const saved = readDeveloperHandoff(handoffId);
      if (saved) {
        return { ...saved, url: createDeveloperHandoffUrl(saved) };
      }
    }

    if (bundleOverride) {
      const payload = {
        id: 'inline-ui-kit-bundle',
        title: title || t('templates.uiKitSection'),
        createdAt: '',
        bundle: bundleOverride,
        previewState,
      };
      return { ...payload, url: createDeveloperHandoffUrl(payload) };
    }

    if (params) {
      return createDeveloperHandoff({ params, css, title, previewState });
    }

    return null;
  }, [bundleOverride, css, handoffId, open, params, previewState, t, title]);

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

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 860);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const bundle = useMemo(() => {
    if (bundleOverride) return bundleOverride;
    if (handoff?.bundle) return handoff.bundle;
    if (params) return createCodeBundle(params, css);
    return { html: '', css: '', combined: '' };
  }, [bundleOverride, css, handoff, params]);
  const previewParams = params || handoff?.params;
  const activePreviewState = previewState || handoff?.previewState;

  if (!open) return null;

  const handleCopy = async (kind, value) => {
    await copyText(value);
    setCopied(kind);
    window.setTimeout(() => setCopied(''), 1400);
  };

  if (isMobile) {
    return (
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t('aria.developerHandoff')}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1000,
          background: 'var(--bg-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 24px',
          overflow: 'auto',
          boxSizing: 'border-box',
        }}
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) onClose?.();
        }}
      >
        <MobileUnavailableBlock />
      </div>
    );
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t('aria.developerHandoff')}
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
          width: 'min(1280px, 100%)',
          maxHeight: 'calc(100vh - 40px)',
          background: 'var(--surface, #FFFFFF)',
          color: 'var(--text-main, #111827)',
          border: '1px solid var(--border, #E5E7EB)',
          borderRadius: 22,
          boxShadow: '0 30px 80px rgba(15, 23, 42, 0.28)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <header
          style={{
            padding: '18px 22px',
            borderBottom: '1px solid var(--border, #E5E7EB)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 900 }}>
              {t('handoff.title')}</h2>
            <p
              style={{
                margin: '4px 0 0',
                color: 'var(--text-muted, #6B7280)',
                fontSize: 13,
              }}
            >
              {handoff?.title || title || t('handoff.generatedCode')}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t('aria.close')}
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
              gap: 12,
              alignItems: 'center',
            }}
          >
            <input
              readOnly
              value={handoff?.url || ''}
              style={{
                height: 42,
                minWidth: 0,
                border: '1px solid var(--border, #E5E7EB)',
                borderRadius: 12,
                padding: '0 14px',
                background: 'var(--control-bg, #F9FAFB)',
                color: 'var(--text-main, #111827)',
                fontSize: 13,
                outline: 'none',
              }}
            />
            <button
              type="button"
              onClick={() => handleCopy('link', handoff?.url || '')}
              style={getPrimaryButtonStyle(copied === 'link')}
            >
              {copied === 'link' ? (
                <CheckCircle size={15} style={{ flex: '0 0 auto' }} />
              ) : (
                <LinkIcon size={15} style={{ flex: '0 0 auto' }} />
              )}
              <span style={{ lineHeight: 1 }}>{t('handoff.copyLink')}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (handoff?.url) {
                  window.open(handoff.url, '_blank', 'noopener,noreferrer');
                }
              }}
              style={secondaryButtonStyle}
            >
              <ExternalLink size={15} style={{ flex: '0 0 auto' }} />
              <span style={{ lineHeight: 1 }}>{t('common.open')}</span>
            </button>
          </div>

          <div
            style={{
              background: 'var(--surface-alt, #F9FAFB)',
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
                color: 'var(--text-main, #111827)',
                fontSize: 13,
                fontWeight: 900,
                lineHeight: 1.1,
                letterSpacing: '-0.01em',
                marginBottom: 6,
              }}
            >
              {t('handoff.instructionTitle')}
            </strong>
            {t('handoff.instructionText')}
          </div>

          <HandoffPreview
            bundle={bundle}
            params={previewParams}
            previewState={activePreviewState}
          />

          <div
            style={{
              minWidth: 0,
              minHeight: 0,
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fit, minmax(min(100%, 420px), 1fr))',
              gap: 14,
              alignItems: 'start',
            }}
          >
            <CodePanel
              label="HTML"
              value={bundle.html || ''}
              copied={copied === 'html'}
              onCopy={() => handleCopy('html', bundle.html || '')}
            />
            <CodePanel
              label="CSS"
              value={bundle.css || ''}
              copied={copied === 'css'}
              onCopy={() => handleCopy('css', bundle.css || '')}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default DeveloperHandoffModal;



