import React, { useState } from 'react';
import Card from '../components/Card';
import { Link } from 'react-router-dom';
import { useTranslation } from '../i18n/useTranslation';

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
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('saved');
  const [savedItems, setSavedItems] = useState(readSavedItems);

  return (
    <div
      style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '40px 20px',
        paddingBottom: 100,
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <style>{`
        .mysets-tab {
          padding: 0 0 16px 0;
          background: transparent;
          border: none;
          border-bottom: 2px solid transparent;
          font-size: 14px;
          font-family: inherit;
          cursor: pointer;
          transition: color 0.15s, border-color 0.15s;
          color: var(--text-muted);
          font-weight: 600;
        }
        .mysets-tab.active {
          border-bottom-color: var(--text-main);
          color: var(--text-main);
          font-weight: 800;
        }
        .mysets-tab:hover { color: var(--text-main); }

        .mysets-cta {
          display: inline-block;
          padding: 12px 24px;
          background: var(--text-main);
          color: var(--primary);
          text-decoration: none;
          border-radius: 10px;
          font-weight: 800;
          font-size: 14px;
          transition: opacity 0.15s;
        }
        .mysets-cta:hover { opacity: 0.8; }

        @media (max-width: 600px) {
          .mysets-grid { grid-template-columns: 1fr !important; gap: 16px !important; }
          .mysets-title { font-size: 26px !important; }
        }
      `}</style>

      <div style={{ marginBottom: 40 }}>
        <h1
          className="mysets-title"
          style={{
            fontSize: 32,
            fontWeight: 900,
            color: 'var(--text-main)',
            marginBottom: 8,
            letterSpacing: '-0.01em',
            lineHeight: 1.1,
          }}
        >
          {t('mysets.title')}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 16, margin: 0 }}>
          {t('mysets.subtitle')}
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 32,
          borderBottom: '1px solid var(--border)',
          marginBottom: 40,
        }}
      >
        <button
          onClick={() => setActiveTab('saved')}
          className={`mysets-tab${activeTab === 'saved' ? ' active' : ''}`}
        >
          {t('mysets.savedPresets', { count: savedItems.length })}
        </button>
        <button
          onClick={() => setActiveTab('collections')}
          className={`mysets-tab${activeTab === 'collections' ? ' active' : ''}`}
        >
          {t('mysets.collections')}
        </button>
      </div>

      {activeTab === 'saved' &&
        (savedItems.length > 0 ? (
          <div
            className="mysets-grid"
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
              background: 'var(--surface)',
              borderRadius: 24,
              border: '1px dashed var(--control-border)',
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
                color: 'var(--text-main)',
              }}
            >
              {t('mysets.emptyTitle')}
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: 32, margin: '0 0 32px' }}>
              {t('mysets.emptyText')}
            </p>
            <Link to="/library" className="mysets-cta">
              {t('mysets.openLibrary')}
            </Link>
          </div>
        ))}

      {activeTab === 'collections' && (
        <div style={{ textAlign: 'center', padding: 80, color: 'var(--text-soft)' }}>
          {t('mysets.collectionsUnavailable')}
        </div>
      )}
    </div>
  );
};

export default MySets;
