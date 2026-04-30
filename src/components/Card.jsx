import React, { useState, useEffect } from 'react';
import { Copy, Bookmark, Trash2, CheckCircle } from 'lucide-react'; // Підключили іконки

const Card = ({ name, category, preview, animationName, mode = 'library' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const savedItems = JSON.parse(
      localStorage.getItem('animadiv_saved') || '[]'
    );
    setIsSaved(savedItems.some((item) => item.name === name));
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
        transition: 'all 0.3s ease',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        setIsHovered(true);
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow =
          '0 12px 24px -8px rgba(17, 24, 39, 0.1)';
        e.currentTarget.style.borderColor = '#D1D5DB';
      }}
      onMouseLeave={(e) => {
        setIsHovered(false);
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = '#E5E7EB';
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
            color: '#4F46E5',
          }}
        >
          {preview}
        </div>
      </div>

      <div style={{ padding: '20px' }}>
        <div style={{ marginBottom: '20px' }}>
          <h3
            style={{
              fontSize: '18px',
              fontWeight: '700',
              color: '#111827',
              margin: '0 0 6px 0',
              letterSpacing: '-0.01em',
            }}
          >
            {name}
          </h3>
          <span
            style={{
              fontSize: '12px',
              color: '#6B7280',
              background: '#F3F4F6',
              padding: '4px 8px',
              borderRadius: '6px',
              fontWeight: '500',
            }}
          >
            {category}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {/* Кнопка COPY */}
          <button
            style={{
              flex: 1,
              padding: '10px',
              background: '#F3F4F6',
              color: '#374151',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#E5E7EB';
              e.target.style.color = '#111827';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#F3F4F6';
              e.target.style.color = '#374151';
            }}
          >
            <Copy size={14} /> Copy
          </button>

          {/* Кнопка SAVE/DELETE */}
          <button
            onClick={toggleSave}
            style={{
              flex: 1,
              padding: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              background:
                mode === 'mysets' ? '#FEE2E2' : isSaved ? '#D1FAE5' : '#111827',
              color:
                mode === 'mysets' ? '#EF4444' : isSaved ? '#10B981' : '#fff',
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
            {mode === 'mysets' ? (
              <>
                <Trash2 size={14} /> Delete
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
