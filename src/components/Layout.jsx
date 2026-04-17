import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

const Layout = () => {
  const location = useLocation();

  const getLinkStyle = (path) => ({
    textDecoration: 'none',
    color: location.pathname === path ? '#4F46E5' : '#374151',
    fontWeight: location.pathname === path ? '700' : '500',
    transition: 'color 0.2s ease',
  });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* HEADER */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 40px',
          borderBottom: '1px solid #E5E7EB',
          backgroundColor: '#fff',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <div style={{ fontWeight: '900', fontSize: '22px', color: '#111827' }}>
          Animadiv.
        </div>

        {/* Оновлене меню з доданою сторінкою About */}
        <nav style={{ display: 'flex', gap: '20px', fontSize: '14px' }}>
          <Link to="/" style={getLinkStyle('/')}>
            Home
          </Link>
          <Link to="/generator" style={getLinkStyle('/generator')}>
            Generator
          </Link>
          <Link to="/library" style={getLinkStyle('/library')}>
            Library
          </Link>
          <Link to="/collections" style={getLinkStyle('/collections')}>
            UI Kit
          </Link>
          <Link to="/mysets" style={getLinkStyle('/mysets')}>
            My Sets
          </Link>
          <Link to="/about" style={getLinkStyle('/about')}>
            About
          </Link>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '12px', color: '#6B7280' }}>UA | Dark</span>
        </div>
      </header>

      {/* МАЙДАНЧИК ДЛЯ СТОРІНОК */}
      <main style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer
        style={{
          textAlign: 'center',
          padding: '20px',
          borderTop: '1px solid #E5E7EB',
          fontSize: '13px',
          color: '#9CA3AF',
        }}
      >
        Created by Yuliia Riabych | GitHub | 2026
      </footer>
    </div>
  );
};

export default Layout;
