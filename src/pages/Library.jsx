import React, { useState } from 'react';
import { Search, SearchX } from 'lucide-react';
import Card from '../components/Card';
import { libraryItems } from '../data/libraryItems';
import { useTranslation } from '../i18n/useTranslation';

const categoryFilters = [
  { labelKey: 'library.categories.All', value: 'All' },
  { labelKey: 'library.categories.Buttons', value: 'Buttons' },
  { labelKey: 'library.categories.Typography', value: 'Typography' },
  { labelKey: 'library.categories.Inputs', value: 'Inputs' },
  { labelKey: 'library.categories.Images', value: 'Images' },
  { labelKey: 'library.categories.Links', value: 'Links' },
  { labelKey: 'library.categories.Blocks', value: 'Blocks' },
];

const Library = () => {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredItems = libraryItems.filter((item) => {
    const translatedName = t(item.nameKey, { defaultValue: item.name });
    const translatedCategory = t(item.categoryKey, { defaultValue: item.category });
    const translatedTags = (item.tagKeys || []).map((key, index) =>
      t(key, { defaultValue: item.tags?.[index] || '' })
    );
    const matchesCategory =
      activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch =
      !normalizedSearch ||
      [
        item.name,
        translatedName,
        item.motionStyle,
        translatedCategory,
        ...(item.tags || []),
        ...translatedTags,
      ]
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch);
    return matchesCategory && matchesSearch;
  });

  return (
    <main
      style={{
        minHeight: '100%',
        background: 'var(--bg-color)',
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <style>{`
        .lib-search::placeholder { color: var(--text-soft); }
        .lib-search:focus { border-color: var(--text-main) !important; outline: none; }

        .lib-filter-btn { transition: background 0.15s, color 0.15s, border-color 0.15s; }
        .lib-filter-btn:hover { opacity: 0.8; }

        @media (max-width: 600px) {
          .lib-header-row { flex-direction: column !important; align-items: flex-start !important; }
          .lib-search-wrap { width: 100% !important; }
          .lib-grid { grid-template-columns: 1fr !important; }
          .lib-filter-row { flex-direction: column !important; align-items: flex-start !important; }
        }
      `}</style>

      <div
        style={{
          maxWidth: 1180,
          margin: '0 auto',
          padding: '34px 20px 90px',
          boxSizing: 'border-box',
        }}
      >
        <header
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 24,
            padding: 18,
            marginBottom: 22,
            boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
          }}
        >
          <div
            className="lib-header-row"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
              flexWrap: 'wrap',
              marginBottom: 14,
            }}
          >
            <div style={{ minWidth: 220 }}>
              <h1
                style={{
                  margin: '0 0 6px',
                  color: 'var(--text-main)',
                  fontSize: 30,
                  lineHeight: 1.05,
                  fontWeight: 900,
                  letterSpacing: 0,
                }}
              >
                {t('library.title')}
              </h1>
              <p
                style={{
                  margin: 0,
                  color: 'var(--text-muted)',
                  fontSize: 14,
                  lineHeight: 1.45,
                }}
              >
                {t('library.subtitle')}
              </p>
            </div>

            <label
              className="lib-search-wrap"
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                width: 'min(100%, 360px)',
              }}
            >
              <Search
                size={16}
                color="var(--text-muted)"
                style={{ position: 'absolute', left: 14, pointerEvents: 'none' }}
              />
              <input
                type="text"
                value={searchTerm}
                placeholder={t('library.searchPlaceholder')}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="lib-search"
                style={{
                  width: '100%',
                  height: 42,
                  border: '1px solid var(--border)',
                  borderRadius: 999,
                  background: 'var(--bg-color)',
                  color: 'var(--text-main)',
                  outline: 'none',
                  padding: '0 16px 0 40px',
                  fontSize: 14,
                  boxSizing: 'border-box',
                  transition: 'border-color 0.15s',
                }}
              />
            </label>
          </div>

          <div
            className="lib-filter-row"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {categoryFilters.map((filter) => {
                const isActive = activeCategory === filter.value;
                return (
                  <button
                    key={filter.value}
                    onClick={() => setActiveCategory(filter.value)}
                    className="lib-filter-btn"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flex: 'none',
                      height: 34,
                      padding: '0 12px',
                      borderRadius: 999,
                      border: isActive
                        ? '1px solid var(--text-main)'
                        : '1px solid var(--border)',
                      background: isActive ? 'var(--text-main)' : 'var(--surface)',
                      color: isActive ? 'var(--primary)' : 'var(--button-secondary-text)',
                      fontSize: 12,
                      fontWeight: 850,
                      cursor: 'pointer',
                    }}
                  >
                    {t(filter.labelKey)}
                  </button>
                );
              })}
            </div>

            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                height: 34,
                padding: '0 12px',
                borderRadius: 999,
                background: 'var(--text-main)',
                color: 'var(--primary)',
                fontSize: 12,
                fontWeight: 850,
                whiteSpace: 'nowrap',
              }}
            >
              {t('common.items', { count: filteredItems.length })}
            </span>
          </div>
        </header>

        {filteredItems.length === 0 ? (
          <div
            style={{
              background: 'var(--surface)',
              border: '1px dashed var(--control-border)',
              borderRadius: 24,
              padding: '64px 20px',
              textAlign: 'center',
            }}
          >
            <SearchX size={28} color="var(--text-muted)" style={{ marginBottom: 12 }} />
            <div style={{ fontSize: 18, fontWeight: 850, color: 'var(--text-main)' }}>
              {t('library.noResults')}
            </div>
          </div>
        ) : (
          <div
            className="lib-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 292px), 1fr))',
              gap: 22,
              justifyContent: 'stretch',
              alignItems: 'stretch',
              overflowX: 'hidden',
            }}
          >
            {filteredItems.map((item) => (
              <Card key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Library;
