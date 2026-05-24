import React, { useState } from 'react';
import {
  Bookmark,
  CheckCircle,
  Code2,
  ExternalLink,
  Trash2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { generateFullCSS } from '../utils/generateCss';
import DeveloperHandoffModal from './DeveloperHandoffModal';

const PARAMS_KEY = 'animadiv-params';
const SAVED_KEY = 'animadiv-saved-items';

const px = (value) => {
  if (value === undefined || value === null) return undefined;
  if (value === 'auto') return 'auto';
  return typeof value === 'number' ? `${value}px` : value;
};

const readSavedItems = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(SAVED_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const colorToRgba = (color = '#111827', opacity = 0.16) => {
  if (String(color).startsWith('rgba(')) return color;
  if (String(color).startsWith('rgb(')) {
    return String(color).replace('rgb(', 'rgba(').replace(')', `, ${opacity})`);
  }
  const hex = String(color).replace('#', '');
  if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(hex)) {
    return `rgba(17, 24, 39, ${opacity})`;
  }
  const normalized =
    hex.length === 3
      ? hex.split('').map((char) => char + char).join('')
      : hex;
  const value = parseInt(normalized, 16);
  return `rgba(${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}, ${opacity})`;
};

const getShadowStyle = (settings = {}) => {
  if (!settings.shadowEnabled) return undefined;
  return `0 ${settings.shadowOffsetY ?? 6}px ${settings.shadowBlur ?? 18}px ${colorToRgba(
    settings.shadowColor,
    settings.shadowOpacity ?? 0.16
  )}`;
};

const getPreviewBackground = (item) => item.preview?.background || '#F9FAFB';
const getAccent = (item) => item.preview?.accent || '#D6F854';

const isDarkPreview = (item) => {
  const background = String(getPreviewBackground(item)).toLowerCase();
  return (
    background.includes('#05101d') ||
    background.includes('#07111f') ||
    background.includes('#082231') ||
    background.includes('#090c1b') ||
    background.includes('#111827') ||
    background.includes('#15122e')
  );
};

const getDisplayType = (item) => {
  if (item.type === 'button') return 'Button';
  if (item.type === 'text') return 'Typography';
  if (item.type === 'input') return 'Input';
  if (item.type === 'textarea') return 'Textarea';
  if (item.type === 'checkbox') return 'Checkbox';
  if (item.type === 'radio') return 'Radio';
  if (item.type === 'image') return 'Image';
  if (item.type === 'link') return 'Link';
  if (item.type === 'block') return 'Block';
  return item.type;
};

const getBaseStyle = (item) => {
  const styles = item.styles || {};
  const settings = item.specificSettings || {};
  return {
    ...styles,
    width: px(styles.width),
    height: px(styles.height),
    minHeight: px(styles.minHeight),
    padding: px(styles.padding),
    borderRadius: px(styles.borderRadius),
    boxSizing: 'border-box',
    border:
      styles.borderWidth > 0
        ? `${styles.borderWidth}px solid ${styles.borderColor || '#E5E7EB'}`
        : 'none',
    boxShadow: getShadowStyle(settings),
    opacity: styles.opacity ?? 1,
    visibility: 'visible',
    fontFamily: settings.fontFamily || 'Inter, system-ui, sans-serif',
  };
};

const getPreviewCss = (uid, item) => {
  const accent = getAccent(item);
  const shadow = colorToRgba(accent, 0.34);
  const effect = item.previewEffect || 'fadeIn';
  const target = `#${uid}`;
  const active = `.is-preview-hovered ${target}`;

  const common = `
${target} {
  transform-origin: center;
  will-change: transform, opacity, filter, box-shadow;
  transition: transform 260ms cubic-bezier(.16,1,.3,1), filter 260ms ease, box-shadow 260ms ease, color 260ms ease;
}
${target} [data-word] { display: inline-block; }
${target} [data-underline] { transform: scaleX(0); transform-origin: left; }
`;

  const keyframes = `
@keyframes ${uid}-fade { from { opacity: .35; } to { opacity: 1; } }
@keyframes ${uid}-slide { from { opacity: .45; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
@keyframes ${uid}-scale { 0% { transform: scale(.94); opacity: .8; } 62% { transform: scale(1.045); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
@keyframes ${uid}-pulse { 0% { transform: scale(1); } 48% { transform: scale(1.045); } 100% { transform: scale(1); } }
@keyframes ${uid}-float { 0% { transform: translateY(0); } 48% { transform: translateY(-9px); } 100% { transform: translateY(0); } }
@keyframes ${uid}-blur { from { opacity: .35; filter: blur(8px); transform: translateY(8px); } to { opacity: 1; filter: blur(0); transform: translateY(0); } }
@keyframes ${uid}-word { from { opacity: 0; transform: translateY(12px); filter: blur(5px); } to { opacity: 1; transform: translateY(0); filter: blur(0); } }
@keyframes ${uid}-type { from { max-width: 0; } to { max-width: 32ch; } }
@keyframes ${uid}-caret { 0%, 48% { opacity: 1; } 49%, 100% { opacity: 0; } }
@keyframes ${uid}-underline { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@keyframes ${uid}-zoom { from { transform: scale(1); } to { transform: scale(1.08); } }
@keyframes ${uid}-tilt { from { transform: perspective(720px) rotateX(0) rotateY(0) translateY(0); } to { transform: perspective(720px) rotateX(5deg) rotateY(-5deg) translateY(-6px); } }
`;

  const effects = {
    fadeIn: `${active} { animation: ${uid}-fade 440ms ease-out both; }`,
    slideUp: `${active} { animation: ${uid}-slide 520ms cubic-bezier(.16,1,.3,1) both; }`,
    softScale: `${active} { animation: ${uid}-scale 520ms cubic-bezier(.16,1,.3,1) both; box-shadow: 0 18px 44px ${shadow}; }`,
    float: `${active} { animation: ${uid}-float 900ms ease-in-out both; box-shadow: 0 18px 44px ${shadow}; }`,
    pulse: `${active} { animation: ${uid}-pulse 700ms ease-in-out both; box-shadow: 0 0 0 8px ${colorToRgba(accent, 0.16)}, 0 18px 44px ${shadow}; }`,
    shadowGlow: `${active} { transform: translateY(-5px); box-shadow: 0 0 0 1px ${colorToRgba(accent, 0.28)}, 0 22px 52px ${shadow}; }`,
    blurReveal: `${active} { animation: ${uid}-blur 560ms cubic-bezier(.16,1,.3,1) both; }`,
    wordFade: `${active} [data-word] { animation: ${uid}-word 520ms cubic-bezier(.16,1,.3,1) both; animation-delay: calc(var(--word-index) * 52ms); }`,
    typewriter: `${active} [data-typewriter] { animation: ${uid}-type 920ms steps(24,end) both; }
${active} [data-caret] { animation: ${uid}-caret 760ms steps(1,end) infinite; }`,
    underlineDraw: `${active} { transform: translateY(-4px); }
${active} [data-underline] { animation: ${uid}-underline 340ms cubic-bezier(.16,1,.3,1) both; }`,
    imageZoom: `${active} img { animation: ${uid}-zoom 680ms cubic-bezier(.16,1,.3,1) both; }
${active} { transform: translateY(-5px); box-shadow: 0 22px 52px ${shadow}; }`,
    imageTilt: `${active} { animation: ${uid}-tilt 520ms cubic-bezier(.16,1,.3,1) both; box-shadow: 0 22px 52px ${shadow}; }`,
  };

  return `${common}\n${keyframes}\n${effects[effect] || effects.fadeIn}`;
};

const WordText = ({ children }) =>
  String(children)
    .split(/(\s+)/)
    .map((part, index) =>
      part.trim() ? (
        <span data-word key={`${part}-${index}`} style={{ '--word-index': index, whiteSpace: 'pre' }}>
          {part}
        </span>
      ) : (
        <span key={`space-${index}`} style={{ whiteSpace: 'pre' }}>{part}</span>
      )
    );

const TextContent = ({ item }) => {
  const settings = item.specificSettings || {};
  const text = settings.content || item.content || item.name;

  if (item.previewEffect === 'typewriter') {
    return (
      <>
        <span data-typewriter style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom', whiteSpace: 'nowrap' }}>
          {text}
        </span>
        <span data-caret style={{ color: getAccent(item), marginLeft: 4 }}>|</span>
      </>
    );
  }
  if (item.previewEffect === 'wordFade' || item.previewEffect === 'blurReveal') {
    return <WordText>{text}</WordText>;
  }
  return text;
};

const PreviewElement = ({ item, uid }) => {
  const settings = item.specificSettings || {};
  const baseStyle = getBaseStyle(item);

  if (item.type === 'button') {
    return (
      <button
        id={uid}
        type="button"
        style={{
          ...baseStyle,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: px(settings.fontSize || 14),
          fontWeight: settings.fontWeight || 850,
        }}
      >
        {settings.text || item.content}
      </button>
    );
  }

  if (item.type === 'text') {
    const textStyle = {
      ...baseStyle,
      margin: 0,
      backgroundColor: 'transparent',
      border: 'none',
      color: item.styles?.color,
      fontSize: px(settings.fontSize || 30),
      fontWeight: settings.fontWeight || 900,
      lineHeight: settings.lineHeight || 1.1,
      textAlign: settings.textAlign || 'center',
      whiteSpace: 'pre-wrap',
    };
    if (settings.tag === 'h1') return <h1 id={uid} style={textStyle}><TextContent item={item} /></h1>;
    if (settings.tag === 'h3') return <h3 id={uid} style={textStyle}><TextContent item={item} /></h3>;
    if (settings.tag === 'span') return <span id={uid} style={textStyle}><TextContent item={item} /></span>;
    return <p id={uid} style={textStyle}><TextContent item={item} /></p>;
  }

  if (item.type === 'input') {
    return (
      <input
        id={uid}
        type={settings.inputType || 'text'}
        placeholder={settings.placeholder || ''}
        readOnly
        style={{
          ...baseStyle,
          display: 'block',
          fontSize: px(settings.fontSize || 14),
          fontWeight: settings.fontWeight || 700,
          outline: 'none',
        }}
      />
    );
  }

  if (item.type === 'textarea') {
    return (
      <textarea
        id={uid}
        rows={settings.rows || 4}
        placeholder={settings.placeholder || ''}
        readOnly
        style={{
          ...baseStyle,
          display: 'block',
          fontSize: px(settings.fontSize || 14),
          fontWeight: settings.fontWeight || 700,
          resize: settings.resize || 'vertical',
          outline: 'none',
        }}
      />
    );
  }

  if (item.type === 'checkbox' || item.type === 'radio') {
    const size = settings.size || 24;
    const checked = Boolean(settings.checked);
    const accent = settings.color || getAccent(item);
    const isRadio = item.type === 'radio';

    return (
      <label
        id={uid}
        style={{
          ...baseStyle,
          width: 'auto',
          height: 'auto',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 12,
          padding: '12px 14px',
          borderRadius: 16,
          background:
            item.preview?.background === '#FFFFFF'
              ? '#F9FAFB'
              : 'rgba(255,255,255,.08)',
          border: `1px solid ${colorToRgba(accent, 0.3)}`,
          color: item.styles?.color || '#111827',
        }}
      >
        <span
          style={{
            width: size,
            height: size,
            borderRadius: isRadio ? '50%' : 8,
            border: `2px solid ${accent}`,
            background: checked && !isRadio ? accent : '#FFFFFF',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: checked ? `0 0 0 5px ${colorToRgba(accent, 0.16)}` : 'none',
          }}
        >
          {checked && isRadio && (
            <span style={{ width: size * 0.48, height: size * 0.48, borderRadius: '50%', background: accent }} />
          )}
          {checked && !isRadio && (
            <span style={{
              width: size * 0.48,
              height: size * 0.28,
              borderLeft: '3px solid #111827',
              borderBottom: '3px solid #111827',
              transform: 'rotate(-45deg) translateY(-1px)',
            }} />
          )}
        </span>
        <span style={{
          fontSize: px(settings.fontSize || 14),
          fontWeight: settings.fontWeight || 850,
          fontFamily: settings.fontFamily || 'Inter, system-ui, sans-serif',
          color: item.styles?.color || '#111827',
        }}>
          {settings.label}
        </span>
      </label>
    );
  }

  if (item.type === 'image') {
    return (
      <div
        id={uid}
        style={{
          width: px(item.styles?.width || 292),
          height: px(item.styles?.height || 188),
          borderRadius: px(item.styles?.borderRadius || 24),
          overflow: 'hidden',
          boxShadow: getShadowStyle(settings),
        }}
      >
        <img
          src={settings.src}
          alt={settings.alt || item.name}
          style={{
            width: '100%',
            height: '100%',
            display: 'block',
            objectFit: settings.objectFit || 'cover',
            objectPosition: settings.objectPosition || 'center',
          }}
        />
      </div>
    );
  }

  if (item.type === 'link') {
    const text = settings.text || item.content;
    return (
      <a
        id={uid}
        href={settings.href || '#'}
        onClick={(event) => event.preventDefault()}
        style={{
          ...baseStyle,
          position: 'relative',
          display: 'inline-flex',
          paddingBottom: 8,
          color: item.styles?.color || '#111827',
          fontSize: px(settings.fontSize || 16),
          fontWeight: settings.fontWeight || 850,
          textDecoration: 'none',
        }}
      >
        {item.previewEffect === 'blurReveal' ? <WordText>{text}</WordText> : text}
        <span
          data-underline
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: 3,
            borderRadius: 999,
            background: getAccent(item),
          }}
        />
      </a>
    );
  }

  if (item.type === 'block') {
    return (
      <div
        id={uid}
        style={{
          ...baseStyle,
          display: 'flex',
          flexDirection: 'column',
          alignItems: settings.alignX || 'center',
          justifyContent: settings.alignY || 'center',
          gap: px(settings.gap || 10),
          overflow: settings.overflow || 'visible',
        }}
      >
        <div style={{
          opacity: 0.42,
          border: '1px dashed currentColor',
          padding: '12px 14px',
          borderRadius: 8,
          color: item.styles?.color || '#111827',
          fontSize: 13,
          fontWeight: 850,
          lineHeight: 1.2,
        }}>
          Inner Content
        </div>
      </div>
    );
  }

  return null;
};

const Preview = ({ item, replayKey, isHovered }) => {
  const uid = `library_${String(item.id).replace(/[^a-zA-Z0-9]/g, '_')}_${replayKey}`;
  const dark = isDarkPreview(item);

  return (
    <div
      className={isHovered ? 'is-preview-hovered' : undefined}
      style={{
        minHeight: 232,
        background: getPreviewBackground(item),
        borderBottom: dark
          ? '1px solid rgba(255,255,255,0.12)'
          : '1px solid var(--border)',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        padding: 30,
        position: 'relative',
      }}
    >
      <style>{getPreviewCss(uid, item)}</style>
      <PreviewElement item={item} uid={uid} />
    </div>
  );
};

const ActionButton = ({ children, onClick, active = false, primary = false }) => (
  <button
    onClick={onClick}
    style={{
      flex: 'none',
      width: 'auto',
      padding: '8px 12px',
      background: primary || active ? 'var(--card-dark-bg)' : 'var(--surface-subtle)',
      color: primary || active ? 'var(--primary)' : 'var(--button-secondary-text)',
      border: primary || active ? '1px solid var(--card-dark-border)' : '1px solid var(--border)',
      borderRadius: 999,
      fontWeight: 850,
      fontSize: 13,
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      whiteSpace: 'nowrap',
      transition: 'opacity 0.15s',
    }}
    onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.75'; }}
    onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
  >
    {children}
  </button>
);

const Card = ({ item, mode = 'library', onSavedChange }) => {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(() =>
    readSavedItems().some((saved) => saved.id === item.id)
  );
  const [isHovered, setIsHovered] = useState(false);
  const [replayKey, setReplayKey] = useState(0);
  const [isHandoffOpen, setIsHandoffOpen] = useState(false);

  const useInGenerator = () => {
    localStorage.setItem(PARAMS_KEY, JSON.stringify(item));
    navigate('/generator');
  };

  const toggleSave = () => {
    const savedItems = readSavedItems();
    const exists = savedItems.some((saved) => saved.id === item.id);
    const nextItems =
      mode === 'mysets' || exists
        ? savedItems.filter((saved) => saved.id !== item.id)
        : [...savedItems, item];
    localStorage.setItem(SAVED_KEY, JSON.stringify(nextItems));
    setIsSaved(!exists && mode !== 'mysets');
    onSavedChange?.(nextItems);
  };

  return (
    <>
      <article
        style={{
          background: 'var(--surface)',
          borderRadius: 24,
          border: isHovered ? '1px solid var(--control-border)' : '1px solid var(--border)',
          overflow: 'hidden',
          transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
          boxShadow: isHovered
            ? '0 16px 34px -14px rgba(0,0,0,0.25)'
            : '0 1px 2px rgba(0,0,0,0.03)',
          transition: 'transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease',
        }}
        onMouseEnter={() => { setIsHovered(true); setReplayKey((key) => key + 1); }}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Preview item={item} replayKey={replayKey} isHovered={isHovered} />

        <div style={{ padding: 18 }}>
          <h3
            style={{
              fontSize: 18,
              fontWeight: 850,
              color: 'var(--text-main)',
              lineHeight: 1.12,
              letterSpacing: 0,
              margin: '0 0 10px',
            }}
          >
            {item.name}
          </h3>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 16 }}>
            {[item.category, getDisplayType(item), item.motionStyle].map((badge) => (
              <span
                key={badge}
                style={{
                  fontSize: 11,
                  color: badge === item.category ? 'var(--primary)' : 'var(--text-muted)',
                  background: badge === item.category ? 'var(--card-dark-bg)' : 'var(--surface-subtle)',
                  border: badge === item.category ? '1px solid var(--card-dark-border)' : '1px solid var(--border)',
                  padding: '4px 8px',
                  borderRadius: 999,
                  fontWeight: 850,
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                {badge}
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
            <ActionButton onClick={useInGenerator} primary>
              <ExternalLink size={14} /> Edit
            </ActionButton>

            <ActionButton onClick={toggleSave} active={isSaved && mode !== 'mysets'}>
              {mode === 'mysets' ? (
                <><Trash2 size={14} /> Remove</>
              ) : (
                <>{isSaved ? <CheckCircle size={14} /> : <Bookmark size={14} />} Save</>
              )}
            </ActionButton>

            <ActionButton onClick={() => setIsHandoffOpen(true)}>
              <Code2 size={14} /> Code
            </ActionButton>
          </div>
        </div>
      </article>

      <DeveloperHandoffModal
        open={isHandoffOpen}
        onClose={() => setIsHandoffOpen(false)}
        params={item}
        css={generateFullCSS(item)}
        title={item.name}
      />
    </>
  );
};

export default Card;
