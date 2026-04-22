import React, { useState, useEffect } from 'react';

const Card = ({ name, category, preview, animationName, mode = 'library' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const savedItems = JSON.parse(
      localStorage.getItem('animadiv_saved') || '[]'
    );
    const exists = savedItems.some((item) => item.name === name);
    setIsSaved(exists);
  }, [name]);

  const toggleSave = () => {
    let savedItems = JSON.parse(localStorage.getItem('animadiv_saved') || '[]');

    if (isSaved) {
      savedItems = savedItems.filter((item) => item.name !== name);
      setIsSaved(false);
    } else {
      savedItems.push({ name, category, preview, animationName });
      setIsSaved(true);
    }

    localStorage.setItem('animadiv_saved', JSON.stringify(savedItems));
  };

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: '16px',
        border: '1px solid #E5E7EB',
        overflow: 'hidden',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        setIsHovered(true);
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 24px -8px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        setIsHovered(false);
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div
        style={{
          height: '180px',
          background: '#F9FAFB',
          borderBottom: '1px solid #E5E7EB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '64px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            animation: isHovered
              ? `${animationName} 1.5s ease-in-out infinite`
              : 'none',
            transformOrigin: 'center',
          }}
        >
          {preview}
        </div>
      </div>

      <div style={{ padding: '20px' }}>
        <div style={{ marginBottom: '16px' }}>
          <h3
            style={{
              fontSize: '18px',
              fontWeight: '700',
              color: '#111827',
              margin: '0 0 4px 0',
            }}
          >
            {name}
          </h3>
          <span
            style={{
              fontSize: '13px',
              color: '#6B7280',
              background: '#F3F4F6',
              padding: '4px 8px',
              borderRadius: '6px',
            }}
          >
            {category}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            style={{
              flex: 1,
              padding: '10px',
              background: '#EEF2FF',
              color: '#4F46E5',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => (e.target.style.background = '#E0E7FF')}
            onMouseLeave={(e) => (e.target.style.background = '#EEF2FF')}
          >
            Copy
          </button>

          <button
            onClick={toggleSave}
            style={{
              flex: 1,
              padding: '10px',
              /* Якщо ми в MySets - колір червоний. Інакше - зелений або чорний */
              background:
                mode === 'mysets' ? '#EF4444' : isSaved ? '#10B981' : '#111827',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => (e.target.style.opacity = '0.8')}
            onMouseLeave={(e) => (e.target.style.opacity = '1')}
          >
            {/* Текст теж залежить від того, де ми знаходимося */}
            {mode === 'mysets'
              ? 'Видалити ✕'
              : isSaved
                ? 'Збережено ✓'
                : 'Зберегти'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
