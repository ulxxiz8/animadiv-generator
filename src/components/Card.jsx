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
import { generateHtml } from '../utils/generateHtml';

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
      ? hex
          .split('')
          .map((char) => char + char)
          .join('')
      : hex;
  const value = parseInt(normalized, 16);
  return `rgba(${(value >> 16) & 255}, ${(value >> 8) & 255}, ${
    value & 255
  }, ${opacity})`;
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
    background.includes('#020617') ||
    background.includes('#030712') ||
    background.includes('#05101d') ||
    background.includes('#07111f') ||
    background.includes('#08070f') ||
    background.includes('#090c1b') ||
    background.includes('#111827') ||
    background.includes('#0f172a') ||
    background.includes('dark')
  );
};

const getDisplayType = (item) => {
  if (item.displayType) return item.displayType;
  if (item.type === 'button') return 'Button';
  if (item.type === 'text') return 'Typography';
  if (item.type === 'link') return 'Link';
  if (item.type === 'input') return 'Input';
  if (item.type === 'textarea') return 'Textarea';
  if (item.type === 'image') return 'Image';
  if (item.type === 'block') return 'Layout';
  return item.type;
};

const getCategoryLabel = (item) =>
  item.group || item.category || getDisplayType(item);

const getMotionBadges = (item) =>
  [item.motionStyle, item.animations?.load?.presetId, item.animations?.hover?.presetId]
    .filter(Boolean)
    .filter((badge) => badge !== 'none')
    .map((badge) =>
      String(badge)
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (char) => char.toUpperCase())
        .trim()
    );

const getCopyCode = (item) => {
  return `${generateHtml(item)}\n\n<style>\n${generateFullCSS(item)}\n</style>`;
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

const getBasePreviewStyle = (item) => {
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
    fontFamily: settings.fontFamily || 'Inter, system-ui, sans-serif',
  };
};

const getAnimationPreset = (item, state) =>
  item.animations?.[state]?.presetId && item.animations[state].presetId !== 'none'
    ? item.animations[state].presetId
    : null;

const getPrimaryTextPreset = (item) =>
  [getAnimationPreset(item, 'hover'), getAnimationPreset(item, 'load')].find(
    (preset) => ['fadeByWord', 'typewriter', 'blurReveal', 'underlineDraw'].includes(preset)
  );

const getMotionCss = (uid, item, targetSelector) => {
  const load = item.animations?.load || {};
  const hover = item.animations?.hover || {};
  const loadPreset = getAnimationPreset(item, 'load');
  const hoverPreset = getAnimationPreset(item, 'hover');
  const duration = Math.max(load.duration || hover.duration || 640, hover.duration || 0);
  const intensity = Math.max(
    0,
    Math.min(100, hover.intensity ?? load.intensity ?? 50)
  );
  const accent = getAccent(item);
  const lift = Math.round(4 + intensity * 0.08);
  const blur = Math.max(2, Math.round(intensity * 0.09));
  const scale = 1 + intensity * 0.0018;
  const rotate = Math.max(2, Math.round(intensity * 0.08));
  const shadowOpacity = Math.min(0.32, 0.08 + intensity / 420);

  const common = `
${targetSelector} {
  position: relative;
  transform-origin: center;
  transition: transform 260ms ease, box-shadow 260ms ease, filter 260ms ease;
  will-change: transform, opacity, filter;
}
${targetSelector} [data-underline] {
  transform: scaleX(0);
  transform-origin: left;
}
`;

  const keyframes = `
@keyframes ${uid}-blur-reveal {
  0% { opacity: .22; transform: translateY(${lift}px) scale(.98); filter: blur(${blur}px); }
  100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
}
@keyframes ${uid}-fade {
  0% { opacity: .26; }
  100% { opacity: 1; }
}
@keyframes ${uid}-slide {
  0% { opacity: .35; transform: translateY(${lift + 10}px); }
  100% { opacity: 1; transform: translateY(0); }
}
@keyframes ${uid}-scale {
  0% { opacity: .72; transform: scale(.94); }
  58% { opacity: 1; transform: scale(${scale + 0.03}); }
  100% { opacity: 1; transform: scale(1); }
}
@keyframes ${uid}-word-reveal {
  0% { opacity: 0; transform: translateY(${lift + 8}px); filter: blur(${blur}px); }
  100% { opacity: 1; transform: translateY(0); filter: blur(0); }
}
@keyframes ${uid}-typewriter {
  0% { max-width: 0; }
  100% { max-width: 32ch; }
}
@keyframes ${uid}-caret {
  0%, 45% { opacity: 1; }
  46%, 100% { opacity: 0; }
}
@keyframes ${uid}-float {
  0% { transform: translateY(0) scale(1); }
  45% { transform: translateY(-${lift}px) scale(${scale}); }
  100% { transform: translateY(0) scale(1); }
}
@keyframes ${uid}-tilt {
  0% { transform: perspective(700px) rotateX(0) rotateY(0) translateY(0); }
  100% { transform: perspective(700px) rotateX(${rotate}deg) rotateY(-${rotate}deg) translateY(-${lift}px); }
}
@keyframes ${uid}-underline {
  0% { transform: scaleX(0); }
  100% { transform: scaleX(1); }
}
@keyframes ${uid}-image-zoom {
  0% { transform: scale(1); filter: saturate(1); }
  100% { transform: scale(${1.04 + intensity * 0.0018}); filter: saturate(1.15) contrast(1.04); }
}
@keyframes ${uid}-brightness {
  0% { filter: brightness(1) saturate(1); }
  100% { filter: brightness(1.12) saturate(1.12); }
}
@keyframes ${uid}-panel-drift {
  0% { transform: translateY(0) rotate(0); }
  52% { transform: translateY(-${lift}px) rotate(${intensity > 55 ? -1.4 : -0.7}deg); }
  100% { transform: translateY(0) rotate(0); }
}
`;

  const hovered = `.is-preview-hovered ${targetSelector}`;

  const effect = (preset, config = {}, role = 'load') => {
    if (!preset) return '';

    const ms = config.duration || duration;
    const timing = role === 'hover' ? 'cubic-bezier(.16,1,.3,1)' : 'ease-out';
    const liftRule =
      role === 'hover'
        ? `transform: translateY(-${Math.max(3, lift - 2)}px); box-shadow: 0 24px 58px ${colorToRgba(accent, shadowOpacity)};`
        : '';

    const effects = {
      fade: `${hovered} { animation: ${uid}-fade ${ms}ms ${timing} both; ${liftRule} }`,
      slide: `${hovered} { animation: ${uid}-slide ${ms}ms cubic-bezier(.16,1,.3,1) both; ${liftRule} }`,
      scale: `${hovered} { animation: ${uid}-scale ${ms}ms cubic-bezier(.16,1,.3,1) both; box-shadow: 0 20px 46px ${colorToRgba(accent, shadowOpacity)}; }`,
      blurReveal: `${hovered} { animation: ${uid}-blur-reveal ${ms}ms cubic-bezier(.16,1,.3,1) both; ${liftRule} }`,
      fadeByWord: `${hovered} [data-word] { animation: ${uid}-word-reveal ${ms}ms cubic-bezier(.16,1,.3,1) both; animation-delay: calc(var(--word-index) * 58ms); }`,
      typewriter: `${hovered} [data-typewriter] { animation: ${uid}-typewriter ${ms}ms steps(24,end) both; }
${hovered} [data-caret] { animation: ${uid}-caret 780ms steps(1,end) infinite; }`,
      floatingImage: `${hovered} { animation: ${uid}-float ${ms}ms ease-in-out both; box-shadow: 0 20px 46px ${colorToRgba(accent, shadowOpacity)}; }`,
      floatingSection: `${hovered} { animation: ${uid}-panel-drift ${ms}ms ease-in-out both; box-shadow: 0 24px 58px ${colorToRgba(accent, shadowOpacity)}; }`,
      tiltHover: `${hovered} { animation: ${uid}-tilt ${ms}ms cubic-bezier(.16,1,.3,1) both; box-shadow: 0 24px 54px ${colorToRgba(accent, shadowOpacity)}; }`,
      underlineDraw: `${hovered} { transform: translateY(-${Math.max(2, lift - 4)}px); }
${hovered} [data-underline] { animation: ${uid}-underline ${ms}ms cubic-bezier(.16,1,.3,1) both; }`,
      zoomReveal: `${hovered} img, ${hovered}[data-image-target] { animation: ${uid}-image-zoom ${ms}ms cubic-bezier(.16,1,.3,1) both; }
${hovered} { ${liftRule} }`,
      kenBurns: `${hovered} img, ${hovered}[data-image-target] { animation: ${uid}-image-zoom ${ms}ms ease-in-out both; }
${hovered} { box-shadow: 0 24px 58px ${colorToRgba(accent, shadowOpacity)}; }`,
      hoverBrightness: `${hovered} img, ${hovered}[data-image-target] { animation: ${uid}-brightness ${ms}ms ease-out both; }
${hovered} { ${liftRule} }`,
      hoverBlur: `${hovered} img, ${hovered}[data-image-target] { filter: blur(${Math.min(Math.max(config.blurAmount || 2, 0), 4)}px); }
${hovered} { ${liftRule} }`,
    };

    return effects[preset] || '';
  };

  return `${common}\n${keyframes}\n${effect(loadPreset, load, 'load')}\n${effect(
    hoverPreset,
    hover,
    'hover'
  )}`;
};

const WordText = ({ children }) =>
  String(children)
    .split(' ')
    .map((word, index) => (
      <span
        data-word
        key={`${word}-${index}`}
        style={{
          '--word-index': index,
          display: 'inline-block',
          marginRight: '0.25em',
        }}
      >
        {word}
      </span>
    ));

const TextPreview = ({ item, uid }) => {
  const settings = item.specificSettings || {};
  const Tag = settings.tag || item.tag || 'h2';
  const motionType = getPrimaryTextPreset(item);
  const content = settings.content || item.content || item.name;

  return (
    <Tag
      id={uid}
      className="library-preview-target"
      style={{
        ...getBasePreviewStyle(item),
        maxWidth: px(item.styles?.width || 320),
        margin: 0,
        color: item.styles?.color || '#111827',
        fontSize: px(settings.fontSize || 32),
        fontWeight: settings.fontWeight || 900,
        lineHeight: settings.lineHeight || 1.08,
        letterSpacing: px(settings.letterSpacing ?? -0.2),
        textAlign: settings.textAlign || 'center',
        backgroundColor: 'transparent',
        border: 'none',
        overflow: 'visible',
      }}
    >
      {['fadeByWord', 'blurReveal', 'underlineDraw'].includes(motionType) ? (
        <WordText>{content}</WordText>
      ) : motionType === 'typewriter' ? (
        <>
          <span
            data-typewriter
            style={{
              display: 'inline-block',
              overflow: 'hidden',
              verticalAlign: 'bottom',
              whiteSpace: 'nowrap',
            }}
          >
            {content}
          </span>
          <span data-caret style={{ color: getAccent(item), marginLeft: 4 }}>
            |
          </span>
        </>
      ) : (
        content
      )}
    </Tag>
  );
};

const LinkPreview = ({ item, uid }) => {
  const settings = item.specificSettings || {};
  const content = settings.text || item.content;
  const motionType = getPrimaryTextPreset(item);

  return (
    <a
      id={uid}
      className="library-preview-target"
      href={settings.href || '#'}
      onClick={(event) => event.preventDefault()}
      style={{
        ...getBasePreviewStyle(item),
        position: 'relative',
        display: 'inline-flex',
        paddingBottom: 8,
        color: item.styles?.color || (isDarkPreview(item) ? '#fff' : '#111827'),
        fontSize: px(settings.fontSize || 16),
        fontWeight: settings.fontWeight || 900,
        textDecoration: 'none',
        transition: 'transform 220ms ease, color 220ms ease',
      }}
    >
      {['fadeByWord', 'blurReveal'].includes(motionType) ? (
        <WordText>{content}</WordText>
      ) : (
        content
      )}
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
};

const ButtonPreview = ({ item, uid }) => {
  const settings = item.specificSettings || {};

  return (
    <button
      id={uid}
      className="library-preview-target"
      type="button"
      style={{
        ...getBasePreviewStyle(item),
        position: 'relative',
        overflow: 'hidden',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: px(settings.fontSize || 14),
        fontWeight: settings.fontWeight || 900,
        transition:
          'transform 260ms cubic-bezier(.16,1,.3,1), box-shadow 260ms ease',
      }}
    >
      <span style={{ position: 'relative', zIndex: 2 }}>
        {settings.text || item.content}
      </span>
    </button>
  );
};

const ImagePreview = ({ item, uid }) => {
  const settings = item.specificSettings || {};

  return (
    <div
      id={uid}
      className="library-preview-target"
      style={{
        position: 'relative',
        width: px(item.styles?.width || 292),
        height: px(item.styles?.height || 190),
        borderRadius: px(item.styles?.borderRadius || 26),
        overflow: 'hidden',
        boxShadow: getShadowStyle(settings),
        transition: 'transform 260ms ease, box-shadow 260ms ease',
      }}
    >
      <img
        data-image-target
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
};

const InputPreview = ({ item, uid }) => {
  const settings = item.specificSettings || {};
  const isTextarea = item.type === 'textarea';
  const Field = isTextarea ? 'textarea' : 'input';

  return (
    <div
      id={uid}
      className="library-preview-target"
      style={{ position: 'relative', display: 'inline-flex' }}
    >
      <Field
        type={isTextarea ? undefined : settings.inputType || 'text'}
        rows={isTextarea ? settings.rows || 4 : undefined}
        placeholder={settings.placeholder || ''}
        readOnly
        style={{
          ...getBasePreviewStyle(item),
          display: 'block',
          fontSize: px(settings.fontSize || 14),
          fontWeight: settings.fontWeight || 800,
          outline: 'none',
          resize: isTextarea ? settings.resize || 'vertical' : undefined,
        }}
      />
      <span
        data-underline
        style={{
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: isTextarea ? 10 : 8,
          height: 2,
          borderRadius: 999,
          background: getAccent(item),
        }}
      />
    </div>
  );
};

const BlockPreview = ({ item, uid }) => {
  const settings = item.specificSettings || {};
  const dark = isDarkPreview(item);

  return (
    <div
      id={uid}
      className="library-preview-target"
      style={{
        ...getBasePreviewStyle(item),
        display: 'flex',
        flexDirection: 'column',
        alignItems: settings.alignX || 'center',
        justifyContent: settings.alignY || 'center',
        gap: px(settings.gap || 12),
        overflow: 'hidden',
        position: 'relative',
        color: item.styles?.color || '#111827',
        transition: 'transform 260ms ease, box-shadow 260ms ease',
      }}
    >
      <span
        style={{
          color: getAccent(item),
          fontSize: 10,
          fontWeight: 900,
          letterSpacing: 1.4,
          textTransform: 'uppercase',
        }}
      >
        {settings.previewKicker || 'Motion'}
      </span>
      <span
        style={{
          color: item.styles?.color || '#111827',
          fontSize: 23,
          fontWeight: 900,
          lineHeight: 1.08,
          textAlign: 'center',
          maxWidth: 210,
        }}
      >
        {getPrimaryTextPreset(item) === 'fadeByWord' ? (
          <WordText>{settings.previewTitle || 'Animated surface'}</WordText>
        ) : (
          settings.previewTitle || 'Animated surface'
        )}
      </span>
      <span
        data-underline
        style={{
          width: 112,
          height: 8,
          borderRadius: 999,
          background: getAccent(item),
          opacity: dark ? 0.5 : 0.34,
        }}
      />
      {settings.previewMeta && (
        <span
          style={{
            color: item.styles?.color || '#4B5563',
            fontSize: 12,
            fontWeight: 700,
            opacity: dark ? 0.72 : 0.58,
          }}
        >
          {settings.previewMeta}
        </span>
      )}
    </div>
  );
};

const Preview = ({ item, replayKey, isHovered }) => {
  const uid = `lib_${String(item.id).replace(/[^a-zA-Z0-9]/g, '_')}_${replayKey}`;
  const targetSelector = `#${uid}`;
  const darkPreview = isDarkPreview(item);

  const renderPreview = () => {
    if (item.type === 'button') return <ButtonPreview item={item} uid={uid} />;
    if (item.type === 'text') return <TextPreview item={item} uid={uid} />;
    if (item.type === 'link') return <LinkPreview item={item} uid={uid} />;
    if (item.type === 'image') return <ImagePreview item={item} uid={uid} />;
    if (item.type === 'input' || item.type === 'textarea') {
      return <InputPreview item={item} uid={uid} />;
    }
    if (item.type === 'block') return <BlockPreview item={item} uid={uid} />;
    return null;
  };

  return (
    <div
      className={isHovered ? 'is-preview-hovered' : undefined}
      style={{
        minHeight: 238,
        background: getPreviewBackground(item),
        borderBottom: darkPreview
          ? '1px solid rgba(255, 255, 255, 0.12)'
          : '1px solid #E5E7EB',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        padding: 34,
        position: 'relative',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
      }}
    >
      <style>{getMotionCss(uid, item, targetSelector)}</style>
      {renderPreview()}
    </div>
  );
};

const Card = ({ item, mode = 'library', onSavedChange }) => {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(() =>
    readSavedItems().some((saved) => saved.id === item.id)
  );
  const [isHovered, setIsHovered] = useState(false);
  const [replayKey, setReplayKey] = useState(0);
  const [copied, setCopied] = useState(false);

  const useInGenerator = () => {
    localStorage.setItem(PARAMS_KEY, JSON.stringify(item));
    navigate('/generator');
  };

  const handleCopyCode = async () => {
    await copyText(getCopyCode(item));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
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

  const actionButtonStyle = {
    minWidth: 0,
    flex: 'none',
    width: 'auto',
    padding: '8px 12px',
    borderRadius: 999,
    fontWeight: 800,
    fontSize: 12,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    lineHeight: 1,
    whiteSpace: 'nowrap',
  };

  return (
    <article
      style={{
        background: '#fff',
        borderRadius: 24,
        border: isHovered ? '1px solid #D1D5DB' : '1px solid #E5E7EB',
        overflow: 'hidden',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: isHovered
          ? '0 16px 34px -12px rgba(17,24,39,0.18)'
          : '0 1px 2px rgba(0,0,0,0.03)',
        transition:
          'transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease',
      }}
      onMouseEnter={() => {
        setIsHovered(true);
        setReplayKey((key) => key + 1);
      }}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Preview item={item} replayKey={replayKey} isHovered={isHovered} />

      <div style={{ padding: 18 }}>
        <div style={{ marginBottom: 16 }}>
          <h3
            style={{
              fontSize: 18,
              fontWeight: 900,
              color: '#111827',
              lineHeight: 1.1,
              letterSpacing: '-0.01em',
              margin: '0 0 10px 0',
            }}
          >
            {item.name}
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            <span
              style={{
                fontSize: 11,
                color: '#D6F854',
                background: '#111827',
                border: '1px solid #1F2937',
                padding: '4px 8px',
                borderRadius: 999,
                fontWeight: 800,
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              {getCategoryLabel(item)}
            </span>
            <span
              style={{
                fontSize: 11,
                color: '#6B7280',
                background: '#F9FAFB',
                border: '1px solid #E5E7EB',
                padding: '4px 8px',
                borderRadius: 999,
                fontWeight: 800,
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              Editable Element
            </span>
            {getDisplayType(item) !== getCategoryLabel(item) && (
              <span
                style={{
                  fontSize: 11,
                  color: '#6B7280',
                  background: '#F9FAFB',
                  border: '1px solid #E5E7EB',
                  padding: '4px 8px',
                  borderRadius: 999,
                  fontWeight: 800,
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                {getDisplayType(item)}
              </span>
            )}
            {getMotionBadges(item)
              .slice(0, 2)
              .map((badge) => (
                <span
                  key={badge}
                  style={{
                    fontSize: 11,
                    color: '#6B7280',
                    background: '#F9FAFB',
                    border: '1px solid #E5E7EB',
                    padding: '4px 8px',
                    borderRadius: 999,
                    fontWeight: 800,
                    display: 'inline-flex',
                    alignItems: 'center',
                  }}
                >
                  {badge}
                </span>
              ))}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
            alignItems: 'center',
          }}
        >
          <button
            onClick={useInGenerator}
            style={{
              ...actionButtonStyle,
              background: '#111827',
              color: '#D6F854',
              border: '1px solid #1F2937',
            }}
          >
            <ExternalLink size={13} /> Edit
          </button>

          <button
            onClick={toggleSave}
            style={{
              ...actionButtonStyle,
              background: isSaved && mode !== 'mysets' ? '#111827' : '#F9FAFB',
              color: isSaved && mode !== 'mysets' ? '#D6F854' : '#374151',
              border: '1px solid #E5E7EB',
            }}
          >
            {mode === 'mysets' ? (
              <>
                <Trash2 size={13} /> Remove
              </>
            ) : isSaved ? (
              <>
                <CheckCircle size={13} /> Saved
              </>
            ) : (
              <>
                <Bookmark size={13} /> Save
              </>
            )}
          </button>

          <button
            onClick={handleCopyCode}
            style={{
              ...actionButtonStyle,
              background: copied ? '#111827' : '#F9FAFB',
              color: copied ? '#D6F854' : '#374151',
              border: '1px solid #E5E7EB',
            }}
          >
            {copied ? <CheckCircle size={13} /> : <Code2 size={13} />}
            {copied ? 'Copied' : 'Code'}
          </button>
        </div>
      </div>
    </article>
  );
};

export default Card;
