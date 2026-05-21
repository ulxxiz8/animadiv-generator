import React, { useState, useEffect } from 'react';
import { animationPresets } from '../../data/presets';
import { customLayouts } from './collectionLayoutDefinitions';

// Р”РѕРїРѕРјС–Р¶РЅРёР№ РєРѕРјРїРѕРЅРµРЅС‚ РґР»СЏ РµР»РµРјРµРЅС‚Р°
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
  // Р’РёСЂР°С…РѕРІСѓС”РјРѕ Р·Р°С‚СЂРёРјРєСѓ
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
        border: isSelected ? '2px solid #111827' : '1px solid #E5E7EB',
        borderRadius: '16px',
        background: '#FFFFFF',
        padding: '16px',
        color: isSelected ? '#111827' : '#6B7280',
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

        // РљРђРЎРљРђР”РќРђ Р›РћР“Р†РљРђ
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
}) => {
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

  // Р¤СѓРЅРєС†С–СЏ Р·Р°РїСѓСЃРєСѓ РєР°СЃРєР°РґСѓ
  // РђРІС‚РѕРјР°С‚РёС‡РЅРѕ Р·Р°РїСѓСЃРєР°С”РјРѕ РїСЂРё РїРµСЂС€РѕРјСѓ РІС–РґРєСЂРёС‚С‚С– РјР°РєРµС‚Р° Р°Р±Рѕ Р·РјС–РЅС– РїСЂРµСЃРµС‚Сѓ
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
              label="Heading (Заголовок)"
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
              label="Text (Опис)"
              isSelected={activeElementId === 'hero-p'}
              style={{ width: '85%', height: '40px', justifyContent: 'center' }}
            />
            <EditableElement
              {...commonProps}
              index={2}
              id="hero-btn"
              label="Button (Кнопка)"
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
              label="Image"
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
                label="Title"
                isSelected={activeElementId === 'art-t1'}
                style={{ width: '100%' }}
              />
              <EditableElement
                {...commonProps}
                index={2}
                id="art-p"
                label="Paragraph"
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
              label="Card 1"
              isSelected={activeElementId === 'grid-1'}
              style={{ height: '100px', justifyContent: 'center' }}
            />
            <EditableElement
              {...commonProps}
              index={1}
              id="grid-2"
              label="Card 2"
              isSelected={activeElementId === 'grid-2'}
              style={{ height: '100px', justifyContent: 'center' }}
            />
            <EditableElement
              {...commonProps}
              index={2}
              id="grid-3"
              label="Card 3"
              isSelected={activeElementId === 'grid-3'}
              style={{ height: '100px', justifyContent: 'center' }}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        background: '#F9FAFB',
        minHeight: 0,
      }}
    >
      {/* 2. Р†Рќ'Р„РљР¦Р†РЇ РЎРўРР›Р†Р’ */}
      <style>{dynamicStyles}</style>

      <div
        style={{
          padding: '14px 18px',
          borderBottom: '1px solid #E5E7EB',
          background: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            color: '#111827',
            fontSize: 15,
            fontWeight: 900,
          }}
        >
          Canvas
        </div>
        <button
          type="button"
          onClick={onBack}
          style={{
            color: '#6B7280',
            background: 'none',
            border: '1px solid transparent',
            borderRadius: 12,
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 800,
            padding: '9px 10px',
          }}
        >
          Close
        </button>
      </div>

      <div
        onClick={() => setActiveElementId(null)}
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          background: '#F9FAFB',
          minHeight: 0,
        }}
      >
        {renderLayout()}
      </div>
    </div>
  );
};

export default CollectionEditor;
