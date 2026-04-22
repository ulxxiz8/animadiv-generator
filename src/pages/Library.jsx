import React, { useState } from 'react';
import Card from '../components/Card'; // Імпортуємо нашу нову картку

const Library = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Додаємо поле animationName до мокових даних
  const mockAnimations = [
    {
      id: 1,
      name: 'Fade In',
      category: 'Entrance',
      preview: '✨',
      animationName: 'anim-fadeIn',
    },
    {
      id: 2,
      name: 'Slide Up',
      category: 'Entrance',
      preview: '⬆️',
      animationName: 'anim-slideUp',
    },
    {
      id: 3,
      name: 'Bounce',
      category: 'Emphasis',
      preview: '🏀',
      animationName: 'anim-bounce',
    },
    {
      id: 4,
      name: 'Rotate',
      category: 'Emphasis',
      preview: '🔄',
      animationName: 'anim-rotate',
    },
    {
      id: 5,
      name: 'Pulse',
      category: 'Emphasis',
      preview: '💓',
      animationName: 'anim-pulse',
    },
    {
      id: 6,
      name: 'Shake',
      category: 'Emphasis',
      preview: '👋',
      animationName: 'anim-shake',
    },
  ];

  return (
    <div
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px',
        paddingBottom: '100px',
      }}
    >
      {/* ГЛОБАЛЬНІ СТИЛІ АНІМАЦІЙ ДЛЯ БІБЛІОТЕКИ */}
      <style>{`
        @keyframes anim-fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }
        @keyframes anim-slideUp { 0% { transform: translateY(20px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
        @keyframes anim-bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        @keyframes anim-rotate { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes anim-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.2); } }
        @keyframes anim-shake { 
          0%, 100% { transform: translateX(0); } 
          25% { transform: translateX(-10px) rotate(-5deg); } 
          75% { transform: translateX(10px) rotate(5deg); } 
        }
      `}</style>

      <div style={{ marginBottom: '32px' }}>
        <h1
          style={{
            fontSize: '32px',
            fontWeight: '900',
            color: '#111827',
            marginBottom: '8px',
          }}
        >
          Бібліотека анімацій
        </h1>
        <p style={{ color: '#6B7280', fontSize: '16px' }}>
          Наведіть курсор на картку, щоб побачити анімацію.
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          gap: '16px',
          marginBottom: '40px',
          background: '#fff',
          padding: '20px',
          borderRadius: '16px',
          border: '1px solid #E5E7EB',
          alignItems: 'center',
          flexWrap: 'wrap',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <div style={{ flex: 1, minWidth: '280px' }}>
          <input
            type="text"
            placeholder="Пошук за назвою..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '10px',
              border: '1px solid #D1D5DB',
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>
        <select
          style={{
            padding: '12px 16px',
            borderRadius: '10px',
            border: '1px solid #D1D5DB',
            fontSize: '14px',
            background: '#fff',
            outline: 'none',
          }}
        >
          <option value="">Усі стилі</option>
          <option value="entrance">Поява</option>
        </select>
        <select
          style={{
            padding: '12px 16px',
            borderRadius: '10px',
            border: '1px solid #D1D5DB',
            fontSize: '14px',
            background: '#fff',
            outline: 'none',
          }}
        >
          <option value="">Тип елемента</option>
          <option value="icon">Іконки</option>
        </select>
        <div
          style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#4F46E5',
            marginLeft: 'auto',
          }}
        >
          {mockAnimations.length} результатів
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '24px',
        }}
      >
        {/* Рендеримо наш новий компонент Card */}
        {mockAnimations.map((anim) => (
          <Card
            key={anim.id}
            name={anim.name}
            category={anim.category}
            preview={anim.preview}
            animationName={anim.animationName}
          />
        ))}
      </div>
    </div>
  );
};

export default Library;
