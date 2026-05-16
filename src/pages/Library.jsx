import React, { useState } from 'react';
import { Search, SearchX } from 'lucide-react';
import Card from '../components/Card';
import { libraryItems } from '../data/libraryItems';

const INITIAL_VISIBLE_COUNT = 18;
const LOAD_MORE_COUNT = 9;

const getUniqueValues = (key) => [
  'All',
  ...new Set(libraryItems.map((item) => item[key]).filter(Boolean)),
];

const filterGroups = [
  { id: 'category', label: 'Category', options: getUniqueValues('category') },
  {
    id: 'collection',
    label: 'Collection',
    options: getUniqueValues('collection'),
  },
  {
    id: 'motionStyle',
    label: 'Motion',
    options: getUniqueValues('motionStyle'),
  },
  {
    id: 'intensity',
    label: 'Intensity',
    options: getUniqueValues('intensity'),
  },
];

const sectionDefinitions = [
  {
    id: 'hero',
    title: 'Hero Showcase',
    description: 'High-impact pieces for first-screen motion.',
    matches: (item) =>
      [
        'gradient-blur-title',
        'glass-floating-card',
        'cinematic-image-reveal',
        'neon-cta-block',
      ].includes(item.id),
  },
  {
    id: 'interactive',
    title: 'Interactive Elements',
    description: 'Buttons and inputs tuned for hover, click, and focus.',
    matches: (item) =>
      ['Button', 'Input', 'Link'].includes(item.category) &&
      ![
        'gradient-blur-title',
        'glass-floating-card',
        'cinematic-image-reveal',
        'neon-cta-block',
      ].includes(item.id),
  },
  {
    id: 'typography',
    title: 'Typography Motion',
    description: 'Readable text effects for editorial rhythm.',
    matches: (item) => item.category === 'Typography',
  },
  {
    id: 'images',
    title: 'Image Motion',
    description: 'Cinematic image reveals and hover depth.',
    matches: (item) => item.category === 'Image',
  },
  {
    id: 'layouts',
    title: 'Layout Motion',
    description: 'Exportable sections and structural motion patterns.',
    matches: (item) =>
      item.category === 'Layout' &&
      ![
        'gradient-blur-title',
        'glass-floating-card',
        'cinematic-image-reveal',
        'neon-cta-block',
      ].includes(item.id),
  },
];

const getSectionedItems = (items) =>
  sectionDefinitions
    .map((section) => ({
      ...section,
      items: items.filter(section.matches),
    }))
    .filter((section) => section.items.length > 0);

const Library = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: 'All',
    collection: 'All',
    motionStyle: 'All',
    intensity: 'All',
  });
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

  const filteredItems = libraryItems.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase());
    const matchesFilters = Object.entries(filters).every(
      ([key, value]) => value === 'All' || item[key] === value
    );
    return matchesSearch && matchesFilters;
  });
  const visibleItems = filteredItems.slice(0, visibleCount);
  const visibleSections = getSectionedItems(visibleItems);
  const hasMore = visibleCount < filteredItems.length;

  const handleFilterChange = (filterId, value) => {
    setFilters((current) => ({ ...current, [filterId]: value }));
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  };

  return (
    <div
      style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '48px 24px',
        paddingBottom: 100,
        background: '#F9FAFB',
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <div
        style={{
          display: 'grid',
          gap: 14,
          marginBottom: 24,
          background: '#fff',
          padding: 18,
          borderRadius: 24,
          border: '1px solid #E5E7EB',
          boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 20,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ minWidth: 220, flex: '1 1 320px' }}>
            <h1
              style={{
                fontSize: 30,
                fontWeight: 900,
                color: '#111827',
                lineHeight: 1.1,
                letterSpacing: '-0.01em',
                margin: '0 0 6px',
              }}
            >
              Library
            </h1>
            <p
              style={{
                color: '#6B7280',
                fontSize: 14,
                lineHeight: 1.5,
                margin: 0,
                maxWidth: 520,
              }}
            >
              Animated editable elements for the Generator.
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              flex: '0 1 440px',
              minWidth: 260,
            }}
          >
            <label
              style={{
                position: 'relative',
                flex: '1 1 260px',
                minWidth: 0,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Search
                size={16}
                color="#6B7280"
                style={{
                  position: 'absolute',
                  left: 14,
                  pointerEvents: 'none',
                }}
              />
              <input
                type="text"
                placeholder="Search library"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                style={{
                  width: '100%',
                  height: 44,
                  padding: '0 16px 0 40px',
                  borderRadius: 16,
                  border: '1px solid #E5E7EB',
                  fontSize: 14,
                  outline: 'none',
                  boxSizing: 'border-box',
                  color: '#111827',
                  background: '#F9FAFB',
                }}
              />
            </label>
            <div
              style={{
                height: 40,
                padding: '0 12px',
                borderRadius: 999,
                background: '#111827',
                color: '#D6F854',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                whiteSpace: 'nowrap',
                fontSize: 13,
                fontWeight: 800,
              }}
            >
              {filteredItems.length} items
            </div>
          </div>
        </div>

        <div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 800,
              color: '#6B7280',
              marginBottom: 8,
            }}
          >
            Curated filters
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(136px, 1fr))',
              gap: 8,
            }}
          >
            {filterGroups.map((group) => (
              <label
                key={group.id}
                style={{
                  display: 'grid',
                  gap: 4,
                  minWidth: 0,
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: '#6B7280',
                  }}
                >
                  {group.label}
                </span>
                <select
                  value={filters[group.id]}
                  onChange={(event) =>
                    handleFilterChange(group.id, event.target.value)
                  }
                  style={{
                    height: 36,
                    width: '100%',
                    minWidth: 0,
                    borderRadius: 12,
                    border: '1px solid #E5E7EB',
                    background: '#FFFFFF',
                    color: '#111827',
                    fontSize: 12,
                    fontWeight: 800,
                    padding: '0 12px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                >
                  {group.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div
          style={{
            background: '#fff',
            border: '1px dashed #D1D5DB',
            borderRadius: 24,
            padding: '64px 20px',
            textAlign: 'center',
            color: '#6B7280',
          }}
        >
          <SearchX size={28} color="#6B7280" style={{ marginBottom: 12 }} />
          <div style={{ fontSize: 18, fontWeight: 800, color: '#111827' }}>
            No matching elements found
          </div>
        </div>
      ) : (
        visibleSections.map((section) => (
          <section key={section.id} style={{ marginBottom: 34 }}>
            <div style={{ marginBottom: 14 }}>
              <h2
                style={{
                  margin: '0 0 4px',
                  color: '#111827',
                  fontSize: 22,
                  fontWeight: 900,
                  lineHeight: 1.1,
                  letterSpacing: '-0.01em',
                }}
              >
                {section.title}
              </h2>
              <p
                style={{
                  margin: 0,
                  color: '#6B7280',
                  fontSize: 14,
                  lineHeight: 1.5,
                }}
              >
                {section.description}
              </p>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 340px))',
                gap: 24,
                alignItems: 'stretch',
                justifyContent: 'center',
              }}
            >
              {section.items.map((item) => (
                <Card key={item.id} item={item} />
              ))}
            </div>
          </section>
        ))
      )}

      {hasMore && (
        <div
          style={{ display: 'flex', justifyContent: 'center', marginTop: 36 }}
        >
          <button
            onClick={() => setVisibleCount((count) => count + LOAD_MORE_COUNT)}
            style={{
              padding: '12px 18px',
              borderRadius: 14,
              border: '1px solid #111827',
              background: '#111827',
              color: '#D6F854',
              fontWeight: 800,
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default Library;
