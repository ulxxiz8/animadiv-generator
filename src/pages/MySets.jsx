import React, { useState } from 'react';
import Card from '../components/Card';
import { Link } from 'react-router-dom';

const SAVED_KEY = 'animadiv-saved-items';

const readSavedItems = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(SAVED_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const MySets = () => {
  const [activeTab, setActiveTab] = useState('saved');
  const [savedItems, setSavedItems] = useState(readSavedItems);

  return (
    <div
      style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '40px 20px',
        paddingBottom: 100,
      }}
    >
      <div style={{ marginBottom: 40 }}>
        <h1
          style={{
            fontSize: 32,
            fontWeight: 900,
            color: '#111827',
            marginBottom: 8,
          }}
        >
          My Sets
        </h1>
        <p style={{ color: '#6B7280', fontSize: 16 }}>
          Saved library elements that can be reopened in the generator.
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 32,
          borderBottom: '1px solid #E5E7EB',
          marginBottom: 40,
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
                ? '2px solid #111827'
                : '2px solid transparent',
            color: activeTab === 'saved' ? '#111827' : '#6B7280',
            fontWeight: activeTab === 'saved' ? 800 : 600,
            cursor: 'pointer',
          }}
        >
          Saved presets ({savedItems.length})
        </button>
        <button
          onClick={() => setActiveTab('collections')}
          style={{
            padding: '0 0 16px 0',
            background: 'transparent',
            border: 'none',
            borderBottom:
              activeTab === 'collections'
                ? '2px solid #111827'
                : '2px solid transparent',
            color: activeTab === 'collections' ? '#111827' : '#6B7280',
            fontWeight: activeTab === 'collections' ? 800 : 600,
            cursor: 'pointer',
          }}
        >
          Collections
        </button>
      </div>

      {activeTab === 'saved' &&
        (savedItems.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 24,
            }}
          >
            {savedItems.map((item) => (
              <Card
                key={item.id}
                item={item}
                mode="mysets"
                onSavedChange={setSavedItems}
              />
            ))}
          </div>
        ) : (
          <div
            style={{
              background: '#fff',
              borderRadius: 24,
              border: '1px dashed #D1D5DB',
              padding: '80px 20px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <h2
              style={{
                fontSize: 24,
                fontWeight: 800,
                marginBottom: 12,
                color: '#111827',
              }}
            >
              Nothing saved yet
            </h2>
            <p style={{ color: '#6B7280', marginBottom: 32 }}>
              Save a library element to keep it here.
            </p>
            <Link
              to="/library"
              style={{
                padding: '12px 24px',
                background: '#111827',
                color: '#D6F854',
                textDecoration: 'none',
                borderRadius: 10,
                fontWeight: 800,
              }}
            >
              Open Library
            </Link>
          </div>
        ))}

      {activeTab === 'collections' && (
        <div style={{ textAlign: 'center', padding: 80, color: '#9CA3AF' }}>
          Collections are not available yet.
        </div>
      )}
    </div>
  );
};

export default MySets;
