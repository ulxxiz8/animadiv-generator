import React, { useState, useEffect } from 'react';
import { animationPresets } from '../../data/presets';

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
        border: isSelected ? '2px solid #4F46E5' : '1px solid #D1D5DB',
        borderRadius: '8px',
        background: '#fff',
        padding: '16px',
        color: isSelected ? '#111827' : '#6B7280',
        fontSize: '13px',
        fontWeight: isSelected ? '700' : '500',
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        position: 'relative',
        transition: 'all 0.2s ease',
        boxShadow: isSelected ? '0 4px 12px rgba(79, 70, 229, 0.15)' : 'none',

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
      {isSelected && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            console.log(`Видалити ${id}`);
          }}
          style={{
            position: 'absolute',
            top: '-10px',
            right: '-10px',
            width: '24px',
            height: '24px',
            background: '#EF4444',
            color: '#fff',
            borderRadius: '50%',
            border: '2px solid #fff',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
};

const CollectionEditor = ({ layoutId, onBack, globalPreset, staggerDelay }) => {
  const [activeElementId, setActiveElementId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // 1. ДІСТАЄМО KEYFRAMES ДЛЯ ОБРАНОГО ПРЕСЕТУ
  const activePreset = animationPresets.find((p) => p.id === globalPreset);
  // Передаємо дефолтні параметри для генерації keyframes (інтенсивність тощо)
  const keyframesContent =
    activePreset && typeof activePreset.keyframes === 'function'
      ? activePreset.keyframes({ intensity: 100 })
      : '';

  const dynamicStyles =
    activePreset && activePreset.id !== 'none'
      ? `@keyframes ag_${activePreset.id} { \n${keyframesContent}\n }`
      : '';

  // Функція запуску каскаду
  const handlePlay = () => {
    setIsPlaying(false);
    // Даємо браузеру мілісекунду, щоб "забути" стару анімацію і запустити нову
    setTimeout(() => {
      setRefreshKey((prev) => prev + 1);
      setIsPlaying(true);
    }, 10);
  };

  // Автоматично запускаємо при першому відкритті макета або зміні пресету
  useEffect(() => {
    handlePlay();
  }, [globalPreset]);

  const renderLayout = () => {
    const commonProps = {
      onSelect: setActiveElementId,
      isSelected: false,
      staggerDelay,
      globalPreset,
      isPlaying,
    };

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
        return <div style={{ color: '#9CA3AF' }}>Макет у розробці</div>;
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {/* 2. ІН'ЄКЦІЯ СТИЛІВ */}
      <style>{dynamicStyles}</style>

      <div
        style={{
          padding: '12px 20px',
          borderBottom: '1px solid #E5E7EB',
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={handlePlay}
            style={{
              padding: '8px 16px',
              background: '#111827',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            ▶ Play Sequence
          </button>
          <button
            onClick={() => setIsPlaying(false)}
            style={{
              padding: '8px',
              background: 'transparent',
              border: '1px solid #D1D5DB',
              borderRadius: '8px',
              color: '#6B7280',
              cursor: 'pointer',
            }}
          >
            🔄 Reset
          </button>
        </div>
        <button
          onClick={onBack}
          style={{
            color: '#6B7280',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          ✕ Close
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
        }}
      >
        {renderLayout()}
      </div>
    </div>
  );
};

export default CollectionEditor;
