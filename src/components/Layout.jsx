import React, { useEffect, useRef, useState } from 'react';
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
  Menu,
  X,
  MonitorSmartphone,
} from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';

const LanguageSwitcher = () => {
  const { language, setLanguage, t } = useTranslation();

  return (
    <div
      role="group"
      aria-label={t('language.switcherLabel')}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: 3,
        border: '1px solid var(--border)',
        borderRadius: 10,
        background: 'var(--surface)',
        gap: 2,
      }}
    >
      {['en', 'ua'].map((lang) => {
        const active = language === lang;
        return (
          <button
            key={lang}
            type="button"
            onClick={() => setLanguage(lang)}
            style={{
              height: 32,
              minWidth: 36,
              border: 'none',
              borderRadius: 7,
              background: active ? 'var(--text-main)' : 'transparent',
              color: active ? 'var(--primary)' : 'var(--text-muted)',
              fontSize: 12,
              fontWeight: 900,
              cursor: 'pointer',
              transition: 'background 0.15s, color 0.15s',
            }}
          >
            {t(`language.${lang}`)}
          </button>
        );
      })}
    </div>
  );
};

const MobileBlock = ({ pageName }) => {
  const { t } = useTranslation();

  return (
  <div
    style={{
      minHeight: 'calc(100vh - 72px)',
      background: 'var(--bg-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      boxSizing: 'border-box',
      fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    }}
  >
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 24,
        padding: '48px 32px',
        maxWidth: 360,
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 16,
          background: 'var(--card-dark-bg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
        }}
      >
        <MonitorSmartphone
          size={28}
          color="var(--primary)"
          strokeWidth={1.75}
        />
      </div>

      <h2
        style={{
          fontSize: 22,
          fontWeight: 900,
          color: 'var(--text-main)',
          margin: '0 0 12px',
          lineHeight: 1.15,
          letterSpacing: '-0.01em',
        }}
      >
        {t('mobileBlock.title', { pageName })}
      </h2>

      <p
        style={{
          fontSize: 15,
          color: 'var(--text-muted)',
          lineHeight: 1.55,
          margin: '0 0 32px',
        }}
      >
        {t('mobileBlock.body')}
      </p>

      <Link
        to="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 46,
          padding: '0 24px',
          background: 'var(--card-dark-bg)',
          color: 'var(--primary)',
          borderRadius: 999,
          fontWeight: 800,
          fontSize: 14,
          textDecoration: 'none',
          border: '1px solid var(--card-dark-border)',
          transition: 'opacity 0.15s',
        }}
        onMouseEnter={(event) => {
          event.currentTarget.style.opacity = '0.75';
        }}
        onMouseLeave={(event) => {
          event.currentTarget.style.opacity = '1';
        }}
      >
        {t('mobileBlock.home')}
      </Link>
    </div>
  </div>
  );
};

const Layout = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const isGeneratorPage = location.pathname.startsWith('/generator');
  const isCollectionsPage = location.pathname.startsWith('/collections');
  const isMobileBlockedPage = isGeneratorPage || isCollectionsPage;
  const [isMobile, setIsMobile] = useState(() =>
    typeof window === 'undefined' ? false : window.innerWidth < 860
  );

  const getCurrentHandoffId = () =>
    new URLSearchParams(window.location.hash.replace(/^#/, '')).get('handoff') ||
    new URLSearchParams(window.location.search).get('handoff');

  const handoffId =
    new URLSearchParams(location.hash.replace(/^#/, '')).get('handoff') ||
    new URLSearchParams(location.search).get('handoff') ||
    getCurrentHandoffId();

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('animadiv-theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileMenuClosing, setMobileMenuClosing] = useState(false);
  const mobileMenuTimerRef = useRef(null);

  const isDark = theme === 'dark';

  const navItems = [
    { labelKey: 'nav.about',       path: '/about',       icon: Info },
    { labelKey: 'nav.generator',   path: '/generator',   icon: PlaySquare },
    { labelKey: 'nav.library',     path: '/library',     icon: Library },
    { labelKey: 'nav.collections', path: '/collections', icon: LayoutTemplate },
    { labelKey: 'nav.mysets',      path: '/mysets',      icon: Layers },
  ];

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('animadiv-theme', theme);
  }, [theme]);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 860);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(
    () => () => {
      if (mobileMenuTimerRef.current) {
        window.clearTimeout(mobileMenuTimerRef.current);
      }
    },
    []
  );

  const toggleTheme = () =>
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  const openMobileMenu = () => {
    if (mobileMenuTimerRef.current) {
      window.clearTimeout(mobileMenuTimerRef.current);
    }

    setMobileMenuClosing(false);
    setMobileMenuOpen(true);
  };

  const closeMobileMenu = () => {
    if (!mobileMenuOpen || mobileMenuClosing) return;

    setMobileMenuClosing(true);
    mobileMenuTimerRef.current = window.setTimeout(() => {
      setMobileMenuOpen(false);
      setMobileMenuClosing(false);
      mobileMenuTimerRef.current = null;
    }, 220);
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

  const mobileBlockName = isGeneratorPage ? t('nav.generator') : t('nav.collections');

  return (
    <div
      className={
        isGeneratorPage && !isMobile
          ? 'app-shell app-shell--generator'
          : 'app-shell'
      }
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: isGeneratorPage && !isMobile ? '100vh' : 'auto',
        minHeight: '100vh',
        overflow: isGeneratorPage && !isMobile ? 'hidden' : 'visible',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <style>{`
        /* ── Header responsive ── */
        .header-nav-desktop { display: flex; gap: 4px; }
        .header-burger.theme-btn { display: none; }

        @media (max-width: 860px) {
          .header-nav-desktop { display: none; }
          .header-burger.theme-btn { display: inline-flex; }
        }

        /* ── Mobile drawer ── */
        .mobile-drawer {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          z-index: 200;
          display: flex;
          justify-content: flex-end;
          animation: drawerFadeIn 180ms ease-out both;
        }
        .mobile-drawer.is-closing {
          animation: drawerFadeOut 180ms ease-in both;
        }
        .mobile-drawer-backdrop {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(2px);
        }
        .mobile-drawer-panel {
          position: relative;
          margin-left: auto;
          background: var(--surface);
          border-left: 1px solid var(--border);
          width: min(280px, 80vw);
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: 24px 20px;
          box-sizing: border-box;
          gap: 6px;
          overflow-y: auto;
          box-shadow: -24px 0 60px rgba(0,0,0,0.22);
          animation: drawerSlideInRight 220ms cubic-bezier(0.16, 1, 0.3, 1) both;
          will-change: transform;
        }
        .mobile-drawer.is-closing .mobile-drawer-panel {
          animation: drawerSlideOutRight 220ms cubic-bezier(0.7, 0, 0.84, 0) both;
        }
        @keyframes drawerFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes drawerFadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes drawerSlideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes drawerSlideOutRight {
          from { transform: translateX(0); }
          to { transform: translateX(100%); }
        }
        .mobile-drawer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .mobile-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 12px;
          text-decoration: none;
          font-size: 15px;
          font-weight: 600;
          color: var(--text-muted);
          transition: all 0.15s;
        }
        .mobile-nav-item:hover,
        .mobile-nav-item.active {
          background: var(--nav-active);
          color: var(--text-main);
        }
        .mobile-nav-item--disabled {
          opacity: 0.42;
          pointer-events: none;
        }

        /* ── Desktop nav link ── */
        .nav-link {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 8px 14px;
          border-radius: 8px;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.15s ease;
          white-space: nowrap;
        }
        .nav-link:hover { background: var(--nav-active); }

        /* ── Theme button ── */
        .theme-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 40px; height: 40px;
          border: 1px solid var(--border);
          border-radius: 8px;
          background: var(--surface);
          color: var(--text-main);
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }
        .theme-btn:hover { background: var(--nav-active); }
      `}</style>

      {/* ── HEADER ── */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 24px',
          height: '72px',
          borderBottom: '1px solid var(--border)',
          backgroundColor: 'var(--surface)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          flexShrink: 0,
          transition: 'background-color 0.2s ease, border-color 0.2s ease',
          boxSizing: 'border-box',
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{
            fontWeight: '800',
            fontSize: '22px',
            color: 'var(--text-main)',
            textDecoration: 'none',
            letterSpacing: '-0.01em',
            flexShrink: 0,
          }}
        >
          Animadiv<span style={{ color: 'var(--primary)' }}>.</span>
        </Link>

        {/* Desktop nav */}
        <nav className="header-nav-desktop">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="nav-link"
                style={{
                  color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                  background: isActive ? 'var(--nav-active)' : 'transparent',
                }}
              >
                <Icon size={15} strokeWidth={isActive ? 2.5 : 2} />
                {t(item.labelKey)}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <LanguageSwitcher />

          <button
            type="button"
            onClick={toggleTheme}
            className="theme-btn"
            aria-label={isDark ? t('aria.switchToLight') : t('aria.switchToDark')}
          >
            {isDark ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* Burger — mobile only */}
          <button
            type="button"
            className="header-burger theme-btn"
            onClick={openMobileMenu}
            aria-label={t('aria.openMenu')}
          >
            <Menu size={18} />
          </button>
        </div>
      </header>

      {/* ── MOBILE DRAWER ── */}
      {mobileMenuOpen && (
        <div className={`mobile-drawer${mobileMenuClosing ? ' is-closing' : ''}`}>
          <div
            className="mobile-drawer-backdrop"
            onClick={closeMobileMenu}
          />
          <div className="mobile-drawer-panel">
            <div className="mobile-drawer-header">
              <span style={{ fontWeight: '800', fontSize: '20px', color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
                Animadiv<span style={{ color: 'var(--primary)' }}>.</span>
              </span>
              <button
                type="button"
                className="theme-btn"
                onClick={closeMobileMenu}
                aria-label={t('aria.closeMenu')}
                style={{ width: '36px', height: '36px' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ marginBottom: 14 }}>
              <LanguageSwitcher />
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              const isBlocked =
                isMobile &&
                (item.path === '/generator' || item.path === '/collections');
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`mobile-nav-item${isActive ? ' active' : ''}${
                    isBlocked ? ' mobile-nav-item--disabled' : ''
                  }`}
                  onClick={(event) => {
                    if (isBlocked) {
                      event.preventDefault();
                      return;
                    }

                    closeMobileMenu();
                  }}
                >
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                  {t(item.labelKey)}
                  {isBlocked && (
                    <span
                      style={{
                        marginLeft: 'auto',
                        fontSize: 10,
                        fontWeight: 800,
                        background: 'var(--border)',
                        color: 'var(--text-soft)',
                        padding: '2px 7px',
                        borderRadius: 999,
                      }}
                    >
                      {t('common.pc')}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* ── MAIN ── */}
      <main
        style={{
          flex: 1,
          minHeight: 0,
          backgroundColor: 'var(--bg-color)',
          overflow: isGeneratorPage && !isMobile ? 'hidden' : 'visible',
        }}
      >
        {isMobile && isMobileBlockedPage ? (
          <MobileBlock pageName={mobileBlockName} />
        ) : (
          <Outlet />
        )}
      </main>

      {/* ── FOOTER ── */}
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
          {t('common.createdBy')}
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
