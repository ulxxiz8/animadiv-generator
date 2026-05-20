import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import DeveloperHandoffModal from './DeveloperHandoffModal';
import {
  LayoutTemplate,
  PlaySquare,
  Library,
  Layers,
  Info,
  Moon,
  Sun,
} from 'lucide-react'; // Іконки

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isGeneratorPage = location.pathname.startsWith('/generator');
  const getCurrentHandoffId = () =>
    new URLSearchParams(window.location.hash.replace(/^#/, '')).get('handoff') ||
    new URLSearchParams(window.location.search).get('handoff');
  const handoffId =
    new URLSearchParams(location.hash.replace(/^#/, '')).get('handoff') ||
    new URLSearchParams(location.search).get('handoff') ||
    getCurrentHandoffId();
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('animadiv-theme');

    if (savedTheme === 'dark' || savedTheme === 'light') {
      return savedTheme;
    }

    return window.matchMedia?.('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  const isDark = theme === 'dark';

  const navItems = [
    { name: 'About', path: '/about', icon: Info },
    { name: 'Generator', path: '/generator', icon: PlaySquare },
    { name: 'Library', path: '/library', icon: Library },
    { name: 'UI Kit', path: '/collections', icon: LayoutTemplate },
    { name: 'My Sets', path: '/mysets', icon: Layers },
  ];

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('animadiv-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'));
  };

  const closeHandoff = () => {
    const params = new URLSearchParams(location.search);
    params.delete('handoff');
    navigate(
      {
        pathname: location.pathname,
        search: params.toString() ? `?${params.toString()}` : '',
        hash: '',
      },
      { replace: true }
    );
  };

  return (
    <div
      className={isGeneratorPage ? 'app-shell app-shell--generator' : 'app-shell'}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: isGeneratorPage ? '100vh' : 'auto',
        minHeight: '100vh',
        overflow: isGeneratorPage ? 'hidden' : 'visible',
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
          borderBottom: '1px solid var(--border)',
          backgroundColor: 'var(--surface)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          flexShrink: 0,
          transition: 'background-color 0.2s ease, border-color 0.2s ease',
        }}
      >
        {/* Логотип */}
        <Link
          to="/"
          style={{
            fontWeight: '800',
            fontSize: '24px',
            color: 'var(--text-main)',
            textDecoration: 'none',
            letterSpacing: 0,
          }}
        >
          Animadiv<span style={{ color: 'var(--primary)' }}>.</span>
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
                  color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                  background: isActive ? 'var(--nav-active)' : 'transparent',
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
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            title={isDark ? 'Light theme' : 'Dark theme'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              background: 'var(--surface)',
              color: 'var(--text-main)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      {/* МАЙДАНЧИК ДЛЯ СТОРІНОК */}
      <main
        style={{
          flex: 1,
          minHeight: 0,
          backgroundColor: 'var(--bg-color)',
          overflow: isGeneratorPage ? 'hidden' : 'visible',
        }}
      >
        <Outlet />
      </main>

      {/* FOOTER */}
      {!isGeneratorPage && (
        <footer
          style={{
            textAlign: 'center',
            padding: '24px',
            borderTop: '1px solid var(--border)',
            fontSize: '13px',
            color: 'var(--text-muted)',
            backgroundColor: 'var(--surface)',
            transition: 'background-color 0.2s ease, border-color 0.2s ease',
          }}
        >
          Created by Yuliia Riabych | 2026
        </footer>
      )}

      <DeveloperHandoffModal
        open={Boolean(handoffId)}
        onClose={closeHandoff}
        handoffId={handoffId}
      />
    </div>
  );
};

export default Layout;
