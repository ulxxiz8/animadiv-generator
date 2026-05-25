import React from 'react';
import { Link } from 'react-router-dom';
import {
  PlaySquare,
  Library,
  LayoutTemplate,
  Zap,
  ArrowUpRight,
} from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';

const Home = () => {
  const { t } = useTranslation();
  const animatedElements = [
    { id: 1, type: 'accent', labelKey: 'home.marqueeHoverEffect', effect: 'pulse', icon: <Zap size={16} /> },
    { id: 2, type: 'dark', labelKey: 'home.marqueeSlideSequence', effect: 'slideUp', icon: null },
    { id: 3, type: 'light', labelKey: 'home.marqueeLoadingState', effect: 'rotate', icon: <PlaySquare size={16} /> },
    { id: 4, type: 'dark', labelKey: 'home.marqueeFadeEntrance', effect: 'fadeIn', icon: null },
    { id: 5, type: 'accent', labelKey: 'home.marqueeBouncePhysics', effect: 'bounce', icon: null },
  ];

  const marqueeList = [
    ...animatedElements,
    ...animatedElements,
    ...animatedElements,
    ...animatedElements,
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: 'calc(100vh - 155px)',
        backgroundColor: 'var(--bg-color)',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <style>{`
        @keyframes marquee  { 0%   { transform: translateX(0);      } 100% { transform: translateX(-50%);   } }
        @keyframes pulse    { 0%, 100% { transform: scale(1);       } 50%  { transform: scale(1.05);        } }
        @keyframes slideUp  { 0%   { transform: translateY(10px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
        @keyframes rotate   { 0%   { transform: rotate(0deg);       } 100% { transform: rotate(360deg);     } }
        @keyframes bounce   { 0%, 100% { transform: translateY(0);  } 50%  { transform: translateY(-8px);   } }
        @keyframes fadeIn   { 0%   { opacity: 0.3;                  } 100% { opacity: 1;                    } }

        .demo-pulse   { animation: pulse   3s infinite ease-in-out; }
        .demo-slideUp { animation: slideUp 2s infinite alternate ease-in-out; }
        .demo-rotate  { animation: rotate  6s infinite linear; }
        .demo-bounce  { animation: bounce  3s infinite ease-in-out; }
        .demo-fadeIn  { animation: fadeIn  2s infinite alternate ease-in-out; }

        .home-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 16px;
          width: 100%;
          text-align: left;
        }
        .hg-gen { grid-column: span 5; }
        .hg-ui  { grid-column: span 4; }
        .hg-lib { grid-column: span 3; }

        @media (max-width: 900px) {
          .hg-gen { grid-column: span 6; }
          .hg-ui  { grid-column: span 6; }
          .hg-lib { grid-column: span 12; }
        }
        @media (max-width: 580px) {
          .home-grid { grid-template-columns: 1fr; gap: 12px; }
          .hg-gen, .hg-ui, .hg-lib { grid-column: span 1; }
        }

        .home-card {
          padding: 24px;
          border-radius: 24px;
          text-decoration: none;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 180px;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .home-card:hover { transform: translateY(-4px); }
        .home-card--light:hover {
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.07);
        }

        .home-h1 {
          font-size: clamp(28px, 4.5vw, 48px);
          font-weight: 900;
          color: var(--text-main);
          margin-bottom: 16px;
          line-height: 1.1;
          letter-spacing: -0.02em;
        }
        .home-sub {
          font-size: clamp(14px, 2vw, 16px);
          color: var(--text-muted);
          margin-bottom: 40px;
          max-width: 600px;
          line-height: 1.5;
          font-weight: 400;
        }
      `}</style>

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px 24px',
          textAlign: 'center',
          maxWidth: '1100px',
          margin: '0 auto',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--card-dark-bg)',
            color: 'var(--primary)',
            padding: '6px 16px',
            borderRadius: '100px',
            fontSize: '13px',
            fontWeight: '700',
            marginBottom: '24px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          <Zap size={14} /> Animadiv v1.0
        </div>

        <h1 className="home-h1">
          {t('home.heroTitle')} <br />
          <span
            style={{
              background: 'var(--primary)',
              color: '#111827',
              padding: '2px 12px',
              borderRadius: '10px',
              display: 'inline-block',
              transform: 'rotate(-2deg)',
            }}
          >
            {t('home.heroHighlight')}
          </span>
        </h1>

        <p className="home-sub">{t('home.subtitle')}</p>

        <div className="home-grid">
          <Link
            to="/generator"
            className="home-card hg-gen"
            style={{
              background: 'var(--card-dark-bg)',
              border: '1px solid var(--card-dark-border)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px',
                background: 'rgba(255,255,255,0.08)',
                color: 'var(--primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <PlaySquare size={22} strokeWidth={2} />
              </div>
              <ArrowUpRight size={22} color="#4B5563" />
            </div>
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--card-dark-text)', marginBottom: '6px', letterSpacing: '-0.01em' }}>
                {t('home.generatorTitle')}
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--card-dark-soft)', lineHeight: '1.4', margin: 0 }}>
                {t('home.generatorText')}
              </p>
            </div>
          </Link>

          <Link
            to="/collections"
            className="home-card home-card--light hg-ui"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px',
                background: 'var(--surface-subtle)',
                color: 'var(--text-main)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <LayoutTemplate size={22} strokeWidth={2} />
              </div>
              <ArrowUpRight size={22} color="var(--control-border)" />
            </div>
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '6px', letterSpacing: '-0.01em' }}>
                {t('home.collectionsTitle')}
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.4', margin: 0 }}>
                {t('home.collectionsText')}
              </p>
            </div>
          </Link>

          <Link
            to="/library"
            className="home-card hg-lib"
            style={{ background: 'var(--primary)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px',
                background: '#111827',
                color: 'var(--primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Library size={22} strokeWidth={2} />
              </div>
              <ArrowUpRight size={22} color="#111827" opacity={0.3} />
            </div>
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#111827', marginBottom: '6px', letterSpacing: '-0.01em' }}>
                {t('home.libraryTitle')}
              </h3>
              <p style={{ fontSize: '13px', color: '#374151', lineHeight: '1.4', margin: 0, fontWeight: '500' }}>
                {t('home.libraryText')}
              </p>
            </div>
          </Link>
        </div>
      </div>

      <div
        style={{
          width: '100%',
          overflow: 'hidden',
          background: 'var(--marquee-bg)',
          padding: '16px 0',
          borderTop: '1px solid var(--marquee-border)',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'inline-flex', gap: '32px', animation: 'marquee 40s linear infinite' }}>
          {marqueeList.map((el, index) => {
            const bg =
              el.type === 'accent' ? 'var(--primary)'
              : el.type === 'dark' ? 'var(--card-dark-bg)'
              : 'var(--surface)';
            const color =
              el.type === 'accent' ? '#111827'
              : el.type === 'dark' ? 'var(--card-dark-text)'
              : 'var(--text-main)';
            const border =
              el.type === 'light' ? '1px solid var(--border)' : 'none';

            return (
              <div
                key={index}
                className={`demo-${el.effect}`}
                style={{
                  padding: '10px 20px',
                  background: bg,
                  color,
                  borderRadius: '12px',
                  border,
                  fontWeight: '700',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  whiteSpace: 'nowrap',
                }}
              >
                {el.icon}
                {t(el.labelKey)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
