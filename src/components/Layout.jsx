import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutTemplate,
  PlaySquare,
  Library,
  Layers,
  Info,
} from 'lucide-react'; // Іконки

const Layout = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Generator', path: '/generator', icon: PlaySquare },
    { name: 'Library', path: '/library', icon: Library },
    { name: 'UI Kit', path: '/collections', icon: LayoutTemplate },
    { name: 'My Sets', path: '/mysets', icon: Layers },
    { name: 'About', path: '/about', icon: Info },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* HEADER (ОНОВЛЕНИЙ) */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 32px',
          height: '80px',
          borderBottom: '1px solid #E5E7EB',
          backgroundColor: '#fff',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        {/* Логотип */}
        <Link
          to="/"
          style={{
            fontWeight: '800',
            fontSize: '24px',
            color: '#111827',
            textDecoration: 'none',
            letterSpacing: '-0.02em',
          }}
        >
          Animadiv<span style={{ color: '#4F46E5' }}>.</span>
        </Link>

        {/* Навігація з іконками */}
        <nav style={{ display: 'flex', gap: '8px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: isActive ? '#111827' : '#6B7280',
                  background: isActive ? '#F3F4F6' : 'transparent',
                  transition: 'all 0.2s ease',
                }}
              >
                <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Темна тема (поки що просто текст) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span
            style={{ fontSize: '13px', color: '#6B7280', fontWeight: '500' }}
          >
            UA | Dark
          </span>
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
          padding: '24px',
          borderTop: '1px solid #E5E7EB',
          fontSize: '13px',
          color: '#9CA3AF',
          backgroundColor: '#fff',
        }}
      >
        Created by Yuliia Riabych | 2026
      </footer>
    </div>
  );
};

export default Layout;
