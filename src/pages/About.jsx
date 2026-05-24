import React from 'react';
import { Target, Cpu, Code, Database, Globe, Briefcase, User } from 'lucide-react';

const About = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '60px 24px 80px 24px',
        fontFamily: 'Inter, system-ui, sans-serif',
        boxSizing: 'border-box',
      }}
    >
      <style>{`
        /* ── Bento grid ── */
        .about-bento {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 16px;
          width: 100%;
        }
        .ab-problem { grid-column: span 8; }
        .ab-author  { grid-column: span 4; }
        .ab-tech    {
          grid-column: span 12;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        @media (max-width: 900px) {
          .ab-problem { grid-column: span 7; }
          .ab-author  { grid-column: span 5; }
        }
        @media (max-width: 640px) {
          .about-bento { grid-template-columns: 1fr; gap: 12px; }
          .ab-problem, .ab-author, .ab-tech { grid-column: span 1; }
          .ab-tech { grid-template-columns: 1fr; }
        }

        /* ── Surface cards (adapt to theme) ── */
        .about-card-surface {
          background: var(--surface);
          border: 1px solid var(--border);
          padding: 32px;
          border-radius: 24px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          transition: box-shadow 0.3s;
        }
        .about-card-surface:hover {
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.07);
        }

        /* ── Dark cards (always dark regardless of theme) ── */
        .about-card-dark {
          background: var(--card-dark-bg);
          border: 1px solid var(--card-dark-border);
          padding: 32px;
          border-radius: 24px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
          overflow: hidden;
          min-height: 220px;
        }

        /* ── Social icon buttons ── */
        .about-social {
          width: 36px; height: 36px;
          border-radius: 50%;
          background: var(--surface-subtle);
          color: var(--text-muted);
          display: flex; align-items: center; justify-content: center;
          text-decoration: none;
          transition: all 0.2s;
        }
        .about-social:hover {
          background: var(--card-dark-bg);
          color: var(--primary);
        }

        /* ── Heading ── */
        .about-h1 {
          font-size: clamp(28px, 5vw, 48px);
          font-weight: 900;
          color: var(--text-main);
          letter-spacing: -0.02em;
          line-height: 1.1;
          margin-bottom: 16px;
        }
      `}</style>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 className="about-h1">
          Ми створюємо{' '}
          <span style={{
            background: 'var(--primary)',
            color: '#111827',
            padding: '2px 12px',
            borderRadius: '10px',
            display: 'inline-block',
            transform: 'rotate(-2deg)',
          }}>
            рух.
          </span>
        </h1>
        <p style={{ fontSize: '16px', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', lineHeight: '1.5' }}>
          Animadiv - це візуальний генератор CSS-анімацій, створений для
          подолання прірви між продуктовим дизайном та фронтенд-розробкою.
        </p>
      </div>

      <div className="about-bento">

        {/* ── Problem & Solution — DARK card ── */}
        <section className="about-card-dark ab-problem">
          {/* Decorative bg icon */}
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.06, color: 'var(--primary)', pointerEvents: 'none' }}>
            <Target size={200} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', color: 'var(--primary)' }}>
            <Target size={20} />
            <h2 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
              Проблема & рішення
            </h2>
          </div>
          <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px', lineHeight: '1.3', letterSpacing: '-0.01em', color: 'var(--card-dark-text)', margin: '0 0 12px 0' }}>
            Handoff більше не є болем.
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--card-dark-soft)', lineHeight: '1.5', maxWidth: '90%', margin: 0 }}>
            Дизайнери створюють ідеальні концепції, а розробники витрачають
            години на підбір таймінгів у коді. Animadiv генерує оптимізований
            CSS та HTML код миттєво, дозволяючи фокусуватися на креативі.
          </p>
        </section>

        {/* ── Author — surface card ── */}
        <section
          className="about-card-surface ab-author"
          style={{ alignItems: 'center', textAlign: 'center', minHeight: '220px' }}
        >
          <div style={{
            width: '64px', height: '64px', borderRadius: '16px',
            background: 'var(--surface-subtle)',
            color: 'var(--text-main)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '16px',
          }}>
            <User size={28} strokeWidth={1.5} />
          </div>
          <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 6px 0', letterSpacing: '-0.01em' }}>
            Юлія Рябич
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '500', margin: '0 0 20px 0' }}>
            Product Designer &<br />Frontend Developer
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="Website" className="about-social">
              <Globe size={16} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="about-social">
              <Briefcase size={16} />
            </a>
          </div>
        </section>

        {/* ── Tech cards row ── */}
        <section className="ab-tech">

          {/* SPA — accent */}
          <div style={{
            background: 'var(--primary)',
            padding: '24px',
            borderRadius: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '10px',
              background: '#111827', color: 'var(--primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '16px',
            }}>
              <Cpu size={20} />
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#111827', marginBottom: '8px' }}>
              SPA Архітектура
            </h3>
            <p style={{ fontSize: '13px', color: '#374151', lineHeight: '1.5', fontWeight: '500', margin: 0 }}>
              Побудовано на React.js та React Router. Забезпечує миттєвий перехід між сторінками.
            </p>
          </div>

          {/* Privacy — surface */}
          <div className="about-card-surface" style={{ padding: '24px', minHeight: 'auto' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '10px',
              background: 'var(--surface-subtle)', color: 'var(--text-main)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '16px',
            }}>
              <Database size={20} />
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px' }}>
              Приватність даних
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>
              Безпечне збереження наборів у LocalStorage. Жодних прихованих баз даних.
            </p>
          </div>

          {/* Dynamic render — DARK card */}
          <div style={{
            background: 'var(--card-dark-bg)',
            border: '1px solid var(--card-dark-border)',
            padding: '24px',
            borderRadius: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '10px',
              background: 'rgba(255,255,255,0.08)', color: 'var(--card-dark-text)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '16px',
            }}>
              <Code size={20} />
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--card-dark-text)', marginBottom: '8px' }}>
              Динамічний рендер
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--card-dark-soft)', lineHeight: '1.5', margin: 0 }}>
              Власні JS-утиліти для розрахунку та ін'єкції CSS Keyframes у DOM в реальному часі.
            </p>
          </div>

        </section>
      </div>
    </div>
  );
};

export default About;
