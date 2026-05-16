import React, { useMemo, useState } from 'react';
import { Bookmark, CheckCircle, ExternalLink, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { generateAnimationCSS } from '../utils/animationEngine';
import { renderSplitText } from '../utils/typographyMotion';

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

const Preview = ({ item }) => {
  const load = useMemo(() => item.animations?.load || {}, [item.animations]);
  const motion = useMemo(
    () => generateAnimationCSS(load.presetId, load, `library_${item.id}`, 'load'),
    [item.id, load]
  );
  const style = {
    ...getPreviewStyle(item),
    animation: motion.animationStr || 'none',
  };
  const settings = item.specificSettings || {};

  return (
    <div
      style={{
        height: 190,
        background: '#F9FAFB',
        borderBottom: '1px solid #E5E7EB',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        padding: 20,
      }}
    >
      {motion.keyframes && <style>{motion.keyframes}</style>}
      {item.type === 'image' ? (
        <img src={settings.src} alt={settings.alt || item.name} style={style} />
      ) : item.type === 'input' ? (
        <input
          type={settings.inputType || 'text'}
          placeholder={settings.placeholder || ''}
          readOnly
          style={style}
        />
      ) : item.type === 'textarea' ? (
        <textarea
          rows={settings.rows || 4}
          placeholder={settings.placeholder || ''}
          readOnly
          style={style}
        />
      ) : item.type === 'block' ? (
        <div style={style}>
          <span
            style={{
              width: 42,
              height: 8,
              borderRadius: 999,
              background: '#111827',
              opacity: 0.18,
            }}
          />
          <span
            style={{
              width: 84,
              height: 8,
              borderRadius: 999,
              background: '#111827',
              opacity: 0.1,
            }}
          />
        </div>
      ) : (
        React.createElement(
          item.type === 'text' ? settings.tag || 'p' : item.tag || 'div',
          { style },
          renderSplitText(item.content || settings.text || settings.content, load.presetId)
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
    <div
      style={{
        background: '#fff',
        borderRadius: 16,
        border: '1px solid #E5E7EB',
        overflow: 'hidden',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
      }}
    >
      <Preview item={item} />

      <div style={{ padding: 20 }}>
        <div style={{ marginBottom: 18 }}>
          <h3
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: '#111827',
              margin: '0 0 8px 0',
            }}
          >
            {item.name}
          </h3>
          <span
            style={{
              fontSize: 12,
              color: '#6B7280',
              background: '#F3F4F6',
              padding: '4px 8px',
              borderRadius: 6,
              fontWeight: 700,
              textTransform: 'capitalize',
            }}
          >
            {item.category} / {item.type}
          </span>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={useInGenerator}
            style={{
              flex: 1,
              padding: 10,
              background: '#111827',
              color: '#D6F854',
              border: 'none',
              borderRadius: 8,
              fontWeight: 800,
              fontSize: 13,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <ExternalLink size={14} /> Use
          </button>

          <button
            onClick={toggleSave}
            style={{
              flex: 1,
              padding: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              background:
                mode === 'mysets' ? '#FEE2E2' : isSaved ? '#D1FAE5' : '#F3F4F6',
              color:
                mode === 'mysets' ? '#B91C1C' : isSaved ? '#047857' : '#374151',
              border: 'none',
              borderRadius: 8,
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
        </div>
      </div>
    </div>
  );
};

export default Card;
