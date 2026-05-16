import React, { useMemo, useState } from 'react';
import Card from '../components/Card';
import { libraryItems } from '../data/libraryItems';

const Library = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');

  const categories = useMemo(
    () => [...new Set(libraryItems.map((item) => item.category))],
    []
  );
  const types = useMemo(() => [...new Set(libraryItems.map((item) => item.type))], []);

  const filteredItems = libraryItems.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase());
    const matchesCategory = !category || item.category === category;
    const matchesType = !type || item.type === type;
    return matchesSearch && matchesCategory && matchesType;
  });

  return (
    <div
      style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '40px 20px',
        paddingBottom: 100,
      }}
    >
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            fontSize: 32,
            fontWeight: 900,
            color: '#111827',
            marginBottom: 8,
          }}
        >
          Library
        </h1>
        <p style={{ color: '#6B7280', fontSize: 16 }}>
          Ready-to-use animated elements built from the same params the generator edits.
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 16,
          marginBottom: 40,
          background: '#fff',
          padding: 20,
          borderRadius: 16,
          border: '1px solid #E5E7EB',
          alignItems: 'center',
          flexWrap: 'wrap',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <div style={{ flex: 1, minWidth: 260 }}>
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: 10,
              border: '1px solid #D1D5DB',
              fontSize: 14,
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          style={{
            padding: '12px 16px',
            borderRadius: 10,
            border: '1px solid #D1D5DB',
            fontSize: 14,
            background: '#fff',
            outline: 'none',
          }}
        >
          <option value="">All categories</option>
          {categories.map((itemCategory) => (
            <option key={itemCategory} value={itemCategory}>
              {itemCategory}
            </option>
          ))}
        </select>
        <select
          value={type}
          onChange={(event) => setType(event.target.value)}
          style={{
            padding: '12px 16px',
            borderRadius: 10,
            border: '1px solid #D1D5DB',
            fontSize: 14,
            background: '#fff',
            outline: 'none',
            textTransform: 'capitalize',
          }}
        >
          <option value="">All types</option>
          {types.map((itemType) => (
            <option key={itemType} value={itemType}>
              {itemType}
            </option>
          ))}
        </select>
        <div
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: '#111827',
            marginLeft: 'auto',
          }}
        >
          {filteredItems.length} results
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 24,
        }}
      >
        {filteredItems.map((item) => (
          <Card key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Library;
