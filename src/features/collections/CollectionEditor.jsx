import React, { useState, useEffect } from 'react';
import { animationPresets } from '../../data/presets';
import { customLayouts } from './collectionLayoutDefinitions';
import { useTranslation } from '../../i18n/useTranslation';

// Допоміжний компонент для елемента
const EditableElement = ({
  id,
  label,
  isSelected,
  onSelect,
  style,
  index,
  staggerDelay,
  globalPreset,
  isPlaying,
}) => {
  // Вираховуємо затримку
  const delay = index * staggerDelay;
  const preset = animationPresets.find((p) => p.id === globalPreset);
  const animationName = preset ? `ag_${preset.id}` : 'none';

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onSelect(id);
      }}
      style={{
        border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
        borderRadius: '16px',
        background: 'var(--surface)',
        padding: '16px',
        color: isSelected ? 'var(--text-main)' : 'var(--text-muted)',
        fontSize: '13px',
        fontWeight: isSelected ? '900' : '750',
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        position: 'relative',
        transition:
          'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
        boxShadow: isSelected
          ? '0 10px 15px -3px rgba(0, 0, 0, 0.05)'
          : '0 1px 2px rgba(0, 0, 0, 0.03)',

        // КАСКАДНА ЛОГІКА
        animationName: isPlaying ? animationName : 'none',
        animationDuration: '600ms',
        animationDelay: `${delay}ms`,
        animationFillMode: 'both',
        animationTimingFunction: 'ease-out',

        ...style,
      }}
    >
      {label}
    </div>
  );
};

const CollectionEditor = ({
  layoutId,
  onBack,
  globalPreset,
  staggerDelay,
  isPlaying,
  refreshKey,
  onPlay,
  minimalPreview = false,
}) => {
  const { t } = useTranslation();
  const [activeElementId, setActiveElementId] = useState(null);

  const activePreset = animationPresets.find((p) => p.id === globalPreset);
  const keyframesContent =
    activePreset && typeof activePreset.keyframes === 'function'
      ? activePreset.keyframes({ intensity: 100 })
      : '';

  const dynamicStyles =
    activePreset && activePreset.id !== 'none'
      ? `@keyframes ag_${activePreset.id} { \n${keyframesContent}\n }`
      : '';

  // Функція запуску каскаду
  // Автоматично запускаємо при першому відкритті макета або зміні пресету
  useEffect(() => {
    const timer = window.setTimeout(() => onPlay?.(), 0);
    return () => window.clearTimeout(timer);
  }, [globalPreset, onPlay]);

  const renderLayout = () => {
    const commonProps = {
      onSelect: setActiveElementId,
      isSelected: false,
      staggerDelay,
      globalPreset,
      isPlaying,
    };
    const customLayout = customLayouts[layoutId];

    if (customLayout) {
      return (
        <div key={refreshKey} style={customLayout.container}>
          {customLayout.items.map((item, index) => (
            <EditableElement
              {...commonProps}
              key={item.id}
              index={index}
              id={item.id}
              label={item.label}
              isSelected={activeElementId === item.id}
              style={item.style}
            />
          ))}
        </div>
      );
    }

    switch (layoutId) {
      case 'hero':
        return (
          <div
            key={refreshKey}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px',
              width: '100%',
              maxWidth: '450px',
            }}
          >
            <EditableElement
              {...commonProps}
              index={0}
              id="hero-h1"
              label={t('collections.labels.heading')}
              isSelected={activeElementId === 'hero-h1'}
              style={{
                width: '100%',
                height: '50px',
                justifyContent: 'center',
              }}
            />
            <EditableElement
              {...commonProps}
              index={1}
              id="hero-p"
              label={t('collections.labels.text')}
              isSelected={activeElementId === 'hero-p'}
              style={{ width: '85%', height: '40px', justifyContent: 'center' }}
            />
            <EditableElement
              {...commonProps}
              index={2}
              id="hero-btn"
              label={t('collections.labels.button')}
              isSelected={activeElementId === 'hero-btn'}
              style={{
                width: '140px',
                height: '40px',
                justifyContent: 'center',
              }}
            />
          </div>
        );
      case 'article':
        return (
          <div
            key={refreshKey}
            style={{
              display: 'flex',
              gap: '20px',
              width: '100%',
              maxWidth: '500px',
              alignItems: 'center',
            }}
          >
            <EditableElement
              {...commonProps}
              index={0}
              id="art-img"
              label={t('templates.image')}
              isSelected={activeElementId === 'art-img'}
              style={{
                width: '120px',
                height: '120px',
                flexShrink: 0,
                justifyContent: 'center',
              }}
            />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                flex: 1,
              }}
            >
              <EditableElement
                {...commonProps}
                index={1}
                id="art-t1"
                label={t('templates.title')}
                isSelected={activeElementId === 'art-t1'}
                style={{ width: '100%' }}
              />
              <EditableElement
                {...commonProps}
                index={2}
                id="art-p"
                label={t('templates.paragraph')}
                isSelected={activeElementId === 'art-p'}
                style={{ width: '100%', height: '60px' }}
              />
            </div>
          </div>
        );
      case 'grid':
        return (
          <div
            key={refreshKey}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px',
              width: '100%',
              maxWidth: '400px',
            }}
          >
            <EditableElement
              {...commonProps}
              index={0}
              id="grid-1"
              label={t('templates.card', { count: 1 })}
              isSelected={activeElementId === 'grid-1'}
              style={{ height: '100px', justifyContent: 'center' }}
            />
            <EditableElement
              {...commonProps}
              index={1}
              id="grid-2"
              label={t('templates.card', { count: 2 })}
              isSelected={activeElementId === 'grid-2'}
              style={{ height: '100px', justifyContent: 'center' }}
            />
            <EditableElement
              {...commonProps}
              index={2}
              id="grid-3"
              label={t('templates.card', { count: 3 })}
              isSelected={activeElementId === 'grid-3'}
              style={{ height: '100px', justifyContent: 'center' }}
            />
          </div>
        );
      default:
        return null;
    }
  };

  const previewCanvas = (
    <div
      onClick={() => setActiveElementId(null)}
      style={{
        flex: 1,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        background: 'var(--bg-color)',
        minHeight: 0,
        boxSizing: 'border-box',
      }}
    >
      {renderLayout()}
    </div>
  );

  if (minimalPreview) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          minHeight: 0,
          display: 'flex',
          background: 'var(--bg-color)',
        }}
      >
        <style>{dynamicStyles}</style>
        {previewCanvas}
      </div>
    );
  }

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-color)',
        minHeight: 0,
      }}
    >
      <style>{dynamicStyles}</style>

      <div
        style={{
          padding: '14px 18px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--surface)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            color: 'var(--text-main)',
            fontSize: 15,
            fontWeight: 900,
          }}
        >{t('collections.canvas')}</div>
        <button
          type="button"
          onClick={onBack}
          style={{
            color: 'var(--text-muted)',
            background: 'none',
            border: '1px solid transparent',
            borderRadius: 12,
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 800,
            padding: '9px 10px',
          }}
        >{t('common.close')}</button>
      </div>

      {previewCanvas}
    </div>
  );
};

export default CollectionEditor;

