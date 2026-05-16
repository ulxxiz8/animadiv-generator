import React, { useMemo, useState } from 'react';
import { Bookmark, CheckCircle, Code2, ExternalLink, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { generateAnimationCSS } from '../utils/animationEngine';
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

const getPreviewStyle = (item) => {
  const styles = item.styles || {};
  const settings = item.specificSettings || {};
  const base = {
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
  };

  if (item.type === 'button') {
    return {
      ...base,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: settings.fontFamily,
      fontSize: px(settings.fontSize),
      fontWeight: settings.fontWeight,
      whiteSpace: 'pre-wrap',
    };
  }

  if (item.type === 'text') {
    return {
      ...base,
      fontFamily: settings.fontFamily,
      fontSize: px(settings.fontSize),
      fontWeight: settings.fontWeight,
      lineHeight: settings.lineHeight,
      letterSpacing: px(settings.letterSpacing),
      textAlign: settings.textAlign,
      textTransform: settings.textTransform,
      whiteSpace: 'pre-wrap',
    };
  }

  if (item.type === 'image') {
    return {
      ...base,
      display: 'block',
      objectFit: settings.objectFit || 'cover',
      objectPosition: settings.objectPosition || 'center',
      padding: 0,
    };
  }

  if (item.type === 'input') {
    return {
      ...base,
      display: 'block',
      fontFamily: settings.fontFamily,
      fontSize: px(settings.fontSize),
      fontWeight: settings.fontWeight,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      outline: 'none',
    };
  }

  if (item.type === 'textarea') {
    return {
      ...base,
      fontFamily: settings.fontFamily,
      fontSize: px(settings.fontSize),
      fontWeight: settings.fontWeight,
      resize: settings.resize || 'vertical',
      outline: 'none',
    };
  }

  if (item.type === 'block') {
    return {
      ...base,
      display: 'flex',
      flexDirection: 'column',
      alignItems: settings.alignX || 'center',
      justifyContent: settings.alignY || 'center',
      gap: px(settings.gap || 0),
      overflow: settings.overflow || 'visible',
    };
  }

  return base;
};

const isDarkPreview = (item) =>
  String(item.preview?.background || '').includes('#020617') ||
  String(item.preview?.background || '').includes('#111827');

const getPreviewBackground = (item) => {
  if (isDarkPreview(item)) return '#111827';
  if (item.category === 'Minimal White') return '#FFFFFF';
  return '#F9FAFB';
};

const getDisplayType = (item) => {
  if (item.displayType) return item.displayType;
  if (item.type === 'button') return 'Button';
  if (item.type === 'text' || item.type === 'link') return 'Typography';
  if (item.type === 'input') return 'Input';
  if (item.type === 'textarea') return 'Textarea';
  if (item.type === 'image') return 'Image';
  if (item.type === 'block') return 'Layout';
  return item.type;
};

const getCategoryLabel = (item) => item.group || item.category || getDisplayType(item);

const getKindLabel = (item) =>
  item.libraryKind === 'template' ? 'Showcase Template' : 'Editable Element';

const getMotionBadges = (item) => {
  if (item.libraryKind === 'template') {
    const css = item.templateCss || '';
    return [
      css.includes('@keyframes') ? 'Load' : null,
      css.includes(':hover') ? 'Hover' : null,
      css.includes(':active') ? 'Click' : null,
      css.includes('infinite') ? 'Loop' : null,
    ].filter(Boolean);
  }

  return [
    item.animations?.load?.presetId && item.animations.load.presetId !== 'none'
      ? 'Load'
      : null,
    item.animations?.hover?.presetId && item.animations.hover.presetId !== 'none'
      ? 'Hover'
      : null,
    item.animations?.click?.presetId && item.animations.click.presetId !== 'none'
      ? 'Click'
      : null,
    ['floatingImage', 'floatingSection', 'kenBurns'].includes(
      item.animations?.load?.presetId
    )
      ? 'Loop'
      : null,
  ].filter(Boolean);
};

const getCopyCode = (item) => {
  if (item.libraryKind === 'template') {
    return `${item.templateHtml || ''}\n\n<style>\n${item.templateCss || ''}\n</style>`;
  }

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

const ensureFinalFillMode = (animationStr = 'none') => {
  if (!animationStr || animationStr === 'none') return 'none';
  if (/\s(both|forwards)(\s*)$/i.test(animationStr)) return animationStr;
  return `${animationStr} both`;
};

const ensureLoopAnimation = (animationStr = 'none') => {
  if (!animationStr || animationStr === 'none') return 'none';
  if (/\sinfinite(\s|$)/i.test(animationStr)) return animationStr;
  return animationStr.replace(/\s(both|forwards)(\s*)$/i, ' both infinite alternate');
};

const isLoopPreview = (item) => item.motionStyle === 'Loop';

const getTemplateCss = (item, isHovered) => {
  const baseCss = item.templateCss || '';
  const hoverBridge = isHovered
    ? `
.library-template-preview.is-hovered .animadiv-template {
  transform: translateY(-4px);
}`
    : '';

  return `${baseCss}\n${hoverBridge}`;
};

const getLibraryLoadFallback = (item, uniqueId, duration = 420) => {
  const preset = item.animations?.load?.presetId;
  if (!preset || preset === 'none') return { keyframes: '', animationStr: 'none' };

  const name = `library_preview_${preset}_${uniqueId}`;

  if (preset === 'slide' || preset === 'slideUpReveal') {
    return {
      keyframes: `@keyframes ${name} { 0% { opacity: 0; transform: translateY(16px); } 100% { opacity: 1; transform: translateY(0); } }`,
      animationStr: `${name} ${duration}ms ease-out 0ms both`,
    };
  }

  if (preset === 'scale' || preset === 'zoomReveal') {
    return {
      keyframes: `@keyframes ${name} { 0% { opacity: 0; transform: scale(0.92); } 100% { opacity: 1; transform: scale(1); } }`,
      animationStr: `${name} ${duration}ms ease-out 0ms both`,
    };
  }

  if (preset === 'blurReveal') {
    return {
      keyframes: `@keyframes ${name} { 0% { opacity: 0; filter: blur(4px); transform: translateY(8px); } 100% { opacity: 1; filter: blur(0); transform: translateY(0); } }`,
      animationStr: `${name} ${duration}ms ease-out 0ms both`,
    };
  }

  return {
    keyframes: `@keyframes ${name} { 0% { opacity: 0; } 100% { opacity: 1; } }`,
    animationStr: `${name} ${duration}ms ease-out 0ms both`,
  };
};

const getLibraryMotion = ({ item, load, hover, uniqueId }) => {
  const generatedLoad = generateAnimationCSS(load.presetId, load, uniqueId, 'load');
  const loadMotion =
    generatedLoad.animationStr && generatedLoad.animationStr !== 'none'
      ? {
          ...generatedLoad,
          animationStr: ensureFinalFillMode(generatedLoad.animationStr),
        }
      : getLibraryLoadFallback(item, uniqueId, load.duration || 420);
  const hoverMotion = generateAnimationCSS(hover.presetId, hover, uniqueId, 'hover');

  return {
    loadMotion,
    hoverMotion,
  };
};

const Preview = ({
  item,
  replayKey = 0,
  isHovered = false,
  shouldReplayLoad = false,
}) => {
  const load = useMemo(() => item.animations?.load || {}, [item.animations]);
  const hover = useMemo(() => item.animations?.hover || {}, [item.animations]);
  const uniqueId = `library_${item.id}_${replayKey}`;
  const { loadMotion, hoverMotion } = useMemo(
    () => getLibraryMotion({ item, load, hover, uniqueId }),
    [item, load, hover, uniqueId]
  );
  const hoverStyles = isHovered ? hoverMotion.transitionStyles || {} : {};
  const shouldLoop = isLoopPreview(item);
  const activeAnimation = shouldLoop
    ? ensureLoopAnimation(loadMotion.animationStr || 'none')
    : shouldReplayLoad
      ? loadMotion.animationStr || 'none'
      : 'none';
  const style = {
    ...getPreviewStyle(item),
    opacity: 1,
    visibility: 'visible',
    transition:
      'transform 260ms ease, filter 260ms ease, opacity 260ms ease, box-shadow 260ms ease, border-color 260ms ease, background-color 260ms ease, color 260ms ease',
    ...hoverStyles,
    animation: activeAnimation,
    animationFillMode: 'both',
  };
  const settings = item.specificSettings || {};
  const darkPreview = isDarkPreview(item);
  const previewAccent = item.preview?.accent || '#111827';
  const previewElementProps = {
    key: replayKey,
    id: uniqueId,
    className: isHovered ? 'is-hovered' : undefined,
    style,
  };

  if (item.libraryKind === 'template') {
    return (
      <div
        key={replayKey}
        className={`library-template-preview${isHovered ? ' is-hovered' : ''}`}
        style={{
          minHeight: 236,
          background: getPreviewBackground(item),
          borderBottom: darkPreview
            ? '1px solid rgba(255, 255, 255, 0.12)'
            : '1px solid #E5E7EB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'visible',
          padding: 28,
          position: 'relative',
        }}
      >
        <style>{getTemplateCss(item, isHovered)}</style>
        <div dangerouslySetInnerHTML={{ __html: item.templateHtml || '' }} />
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: 236,
        background: getPreviewBackground(item),
        borderBottom: darkPreview
          ? '1px solid rgba(255, 255, 255, 0.12)'
          : '1px solid #E5E7EB',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible',
        padding: 34,
        position: 'relative',
      }}
    >
      {(loadMotion.keyframes || hoverMotion.keyframes) && (
        <style>{`${loadMotion.keyframes || ''}\n${hoverMotion.keyframes || ''}`}</style>
      )}
      {item.type === 'image' ? (
        <img
          {...previewElementProps}
          src={settings.src}
          alt={settings.alt || item.name}
        />
      ) : item.type === 'input' ? (
        <input
          {...previewElementProps}
          type={settings.inputType || 'text'}
          placeholder={settings.placeholder || ''}
          readOnly
        />
      ) : item.type === 'textarea' ? (
        <textarea
          {...previewElementProps}
          rows={settings.rows || 4}
          placeholder={settings.placeholder || ''}
          readOnly
        />
      ) : item.type === 'block' ? (
        <div {...previewElementProps}>
          {settings.previewKicker && (
            <span
              style={{
                color: previewAccent,
                fontFamily: 'Inter',
                fontSize: 10,
                fontWeight: 900,
                letterSpacing: 1.4,
              }}
            >
              {settings.previewKicker}
            </span>
          )}
          <span
            style={{
              color: item.styles?.color || '#111827',
              fontFamily: 'Manrope',
              fontSize: 22,
              fontWeight: 900,
              lineHeight: 1.1,
              textAlign: 'center',
            }}
          >
            {settings.previewTitle || 'Motion surface'}
          </span>
          <span
            style={{
              width: 96,
              height: 8,
              borderRadius: 999,
              background: previewAccent,
              opacity: darkPreview ? 0.45 : 0.22,
            }}
          />
          {settings.previewMeta && (
            <span
              style={{
                color: item.styles?.color || '#4B5563',
                fontFamily: 'Inter',
                fontSize: 12,
                fontWeight: 700,
                opacity: darkPreview ? 0.72 : 0.58,
              }}
            >
              {settings.previewMeta}
            </span>
          )}
        </div>
      ) : (
        React.createElement(
          item.type === 'text' ? settings.tag || 'p' : item.tag || 'div',
          previewElementProps,
          item.content || settings.text || settings.content
        )
      )}
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
  const hasHoverPreview =
    item.animations?.hover?.presetId && item.animations.hover.presetId !== 'none';
  const hasLoopPreview = isLoopPreview(item);
  const isTemplate = item.libraryKind === 'template';

  const useInGenerator = () => {
    if (isTemplate) return;
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

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 24,
        border: '1px solid #E5E7EB',
        overflow: 'visible',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: isHovered
          ? '0 10px 15px -3px rgba(0,0,0,0.05)'
          : '0 1px 2px rgba(0,0,0,0.03)',
        transition:
          'transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease',
      }}
      onMouseEnter={() => {
        setIsHovered(true);
        if (!hasHoverPreview && !hasLoopPreview) setReplayKey((key) => key + 1);
      }}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Preview
        item={item}
        replayKey={replayKey}
        isHovered={isHovered}
        shouldReplayLoad={isHovered && !hasHoverPreview}
      />

      <div style={{ padding: 20 }}>
        <div style={{ marginBottom: 18 }}>
          <h3
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: '#111827',
              lineHeight: 1.1,
              letterSpacing: '-0.01em',
              margin: '0 0 10px 0',
            }}
          >
            {item.name}
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <span
              style={{
                fontSize: 12,
                color: '#D6F854',
                background: '#111827',
                border: '1px solid #1F2937',
                padding: '4px 8px',
                borderRadius: 6,
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              {getCategoryLabel(item)}
            </span>
            <span
              style={{
                fontSize: 12,
                color: '#6B7280',
                background: '#F9FAFB',
                border: '1px solid #E5E7EB',
                padding: '4px 8px',
                borderRadius: 6,
                fontWeight: 800,
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              {getKindLabel(item)}
            </span>
            {getDisplayType(item) !== getCategoryLabel(item) && (
              <span
                style={{
                  fontSize: 12,
                  color: '#6B7280',
                  background: '#F9FAFB',
                  border: '1px solid #E5E7EB',
                  padding: '4px 8px',
                  borderRadius: 6,
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                {getDisplayType(item)}
              </span>
            )}
            {getMotionBadges(item).map((badge) => (
              <span
                key={badge}
                style={{
                  fontSize: 12,
                  color: '#6B7280',
                  background: '#F9FAFB',
                  border: '1px solid #E5E7EB',
                  padding: '4px 8px',
                  borderRadius: 6,
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

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {!isTemplate && (
            <button
              onClick={useInGenerator}
              style={{
                flex: '1 1 120px',
                padding: 10,
                background: '#111827',
                color: '#D6F854',
                border: '1px solid #1F2937',
                borderRadius: 12,
                fontWeight: 800,
                fontSize: 13,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
              }}
            >
              <ExternalLink size={14} /> Edit in Generator
            </button>
          )}

          <button
            onClick={toggleSave}
            style={{
              flex: '1 1 110px',
              padding: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              background: isSaved && mode !== 'mysets' ? '#111827' : '#F9FAFB',
              color: isSaved && mode !== 'mysets' ? '#D6F854' : '#374151',
              border: '1px solid #E5E7EB',
              borderRadius: 12,
              fontWeight: 800,
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            {mode === 'mysets' ? (
              <>
                <Trash2 size={14} /> Remove
              </>
            ) : isSaved ? (
              <>
                <CheckCircle size={14} /> Saved
              </>
            ) : (
              <>
              <Bookmark size={14} /> Save
            </>
          )}
          </button>

          <button
            onClick={handleCopyCode}
            style={{
              flex: '1 1 110px',
              padding: 10,
              background: copied ? '#111827' : '#F9FAFB',
              color: copied ? '#D6F854' : '#374151',
              border: '1px solid #E5E7EB',
              borderRadius: 12,
              fontWeight: 800,
              fontSize: 13,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            {copied ? <CheckCircle size={14} /> : <Code2 size={14} />}
            {copied ? 'Copied' : 'Copy Code'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
