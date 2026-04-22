import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { Link } from 'react-router-dom';

const MySets = () => {
  const [activeTab, setActiveTab] = useState('saved');
  const [savedItems, setSavedItems] = useState([]);

  // 1. Завантажуємо дані з localStorage при завантаженні сторінки
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('animadiv_saved') || '[]');
    setSavedItems(data);
  }, []);

  // 2. Функція для оновлення списку після видалення картки
  // Ми будемо викликати її, коли користувач натискає кнопку на картці
  const refreshItems = () => {
    const data = JSON.parse(localStorage.getItem('animadiv_saved') || '[]');
    setSavedItems(data);
  };

  return (
    <div
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px',
        paddingBottom: '100px',
      }}
    >
      <div style={{ marginBottom: '40px' }}>
        <h1
          style={{
            fontSize: '32px',
            fontWeight: '900',
            color: '#111827',
            marginBottom: '8px',
          }}
        >
          Мої набори
        </h1>
        <p style={{ color: '#6B7280', fontSize: '16px' }}>
          Тут зберігаються ваші обрані анімації та готові пресети.
        </p>
      </div>

      {/* ВКЛАДКИ */}
      <div
        style={{
          display: 'flex',
          gap: '32px',
          borderBottom: '1px solid #E5E7EB',
          marginBottom: '40px',
        }}
      >
        <button
          onClick={() => setActiveTab('saved')}
          style={{
            padding: '0 0 16px 0',
            background: 'transparent',
            border: 'none',
            borderBottom:
              activeTab === 'saved'
                ? '2px solid #4F46E5'
                : '2px solid transparent',
            color: activeTab === 'saved' ? '#4F46E5' : '#6B7280',
            fontWeight: activeTab === 'saved' ? '600' : '500',
            cursor: 'pointer',
          }}
        >
          Збережені пресети ({savedItems.length})
        </button>
        <button
          onClick={() => setActiveTab('collections')}
          style={{
            padding: '0 0 16px 0',
            background: 'transparent',
            border: 'none',
            borderBottom:
              activeTab === 'collections'
                ? '2px solid #4F46E5'
                : '2px solid transparent',
            color: activeTab === 'collections' ? '#4F46E5' : '#6B7280',
            fontWeight: activeTab === 'collections' ? '600' : '500',
            cursor: 'pointer',
          }}
        >
          Мої колекції (UI Kits)
        </button>
      </div>

      {/* ЛОГІКА ВІДОБРАЖЕННЯ: АБО КАРТКИ, АБО EMPTY STATE */}
      {activeTab === 'saved' &&
        (savedItems.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '24px',
            }}
          >
            {savedItems.map((anim, index) => (
              <div key={index} onClick={refreshItems}>
                <Card
                  name={anim.name}
                  category={anim.category}
                  preview={anim.preview}
                  animationName={anim.animationName}
                  mode="mysets"
                />
              </div>
            ))}
          </div>
        ) : (
          /* EMPTY STATE (якщо масив порожній) */
          <div
            style={{
              background: '#fff',
              borderRadius: '24px',
              border: '1px dashed #D1D5DB',
              padding: '80px 20px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div style={{ fontSize: '64px', marginBottom: '24px' }}>🔖</div>
            <h2
              style={{
                fontSize: '24px',
                fontWeight: '700',
                marginBottom: '12px',
              }}
            >
              Тут поки порожньо
            </h2>
            <p style={{ color: '#6B7280', marginBottom: '32px' }}>
              Збережіть щось цікаве з бібліотеки.
            </p>
            <Link
              to="/library"
              style={{
                padding: '12px 24px',
                background: '#4F46E5',
                color: '#fff',
                textDecoration: 'none',
                borderRadius: '10px',
                fontWeight: '600',
              }}
            >
              Перейти до Бібліотеки
            </Link>
          </div>
        ))}

      {/* Заглушка для вкладки колекцій */}
      {activeTab === 'collections' && (
        <div style={{ textAlign: 'center', padding: '80px', color: '#9CA3AF' }}>
          Функціонал створення колекцій з'явиться незабаром.
        </div>
      )}
    </div>
  );
};

export default MySets;
