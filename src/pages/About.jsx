import React from 'react';
import {
  Target,
  Cpu,
  Code,
  Database,
  Globe,
  Briefcase,
  User,
} from 'lucide-react';

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
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1
          style={{
            fontSize: '48px',
            fontWeight: '900',
            color: 'var(--text-main)',
            letterSpacing: '-0.02em',
            lineHeight: '1.1',
            marginBottom: '16px',
          }}
        >
          Ми створюємо{' '}
          <span
            style={{
              background: 'var(--primary)',
              padding: '2px 12px',
              borderRadius: '10px',
              display: 'inline-block',
              transform: 'rotate(-2deg)',
            }}
          >
            рух.
          </span>
        </h1>
        <p
          style={{
            fontSize: '16px',
            color: 'var(--text-muted)',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.5',
            fontWeight: '400',
          }}
        >
          Animadiv - це візуальний генератор CSS-анімацій, створений для
          подолання прірви між продуктовим дизайном та фронтенд-розробкою.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: '16px',
          width: '100%',
        }}
      >
        <section
          style={{
            gridColumn: 'span 8',
            background: 'var(--text-main)',
            padding: '32px 40px',
            borderRadius: '24px',
            color: 'var(--surface)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            minHeight: '220px',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              opacity: 0.05,
              color: 'var(--primary)',
            }}
          >
            <Target size={200} />
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '16px',
              color: 'var(--primary)',
            }}
          >
            <Target size={20} />
            <h2
              style={{
                fontSize: '13px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                margin: 0,
              }}
            >
              Проблема & рішення
            </h2>
          </div>
          <h3
            style={{
              fontSize: '24px',
              fontWeight: '700',
              marginBottom: '12px',
              lineHeight: '1.3',
              letterSpacing: '-0.01em',
            }}
          >
            Handoff більше не є болем.
          </h3>
          <p
            style={{
              fontSize: '14px',
              color: 'var(--text-soft)',
              lineHeight: '1.5',
              maxWidth: '90%',
              margin: 0,
            }}
          >
            Дизайнери створюють ідеальні концепції, а розробники витрачають
            години на підбір таймінгів у коді. Animadiv генерує оптимізований
            CSS та HTML код миттєво, дозволяючи фокусуватися на креативі.
          </p>
        </section>

        <section
          style={{
            gridColumn: 'span 4',
            background: 'var(--surface)',
            padding: '32px',
            borderRadius: '24px',
            border: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            transition: 'box-shadow 0.3s',
            minHeight: '220px',
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.boxShadow =
              '0 10px 15px -3px rgba(0, 0, 0, 0.05)')
          }
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: 'var(--surface-subtle)',
              color: 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
            }}
          >
            <User size={28} strokeWidth={1.5} />
          </div>
          <h2
            style={{
              fontSize: '18px',
              fontWeight: '800',
              color: 'var(--text-main)',
              margin: '0 0 6px 0',
              letterSpacing: '-0.01em',
            }}
          >
            Юлія Рябич
          </h2>
          <p
            style={{
              fontSize: '13px',
              color: 'var(--text-muted)',
              fontWeight: '500',
              margin: '0 0 20px 0',
            }}
          >
            Product Designer &<br />
            Frontend Developer
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Website"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'var(--surface-subtle)',
                color: 'var(--button-secondary-text)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#0A66C2';
                e.currentTarget.style.color = 'var(--surface)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--surface-subtle)';
                e.currentTarget.style.color = 'var(--button-secondary-text)';
              }}
            >
              <Globe size={16} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'var(--surface-subtle)',
                color: 'var(--button-secondary-text)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--text-main)';
                e.currentTarget.style.color = 'var(--surface)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--surface-subtle)';
                e.currentTarget.style.color = 'var(--button-secondary-text)';
              }}
            >
              <Briefcase size={16} />
            </a>
          </div>
        </section>

        <section
          style={{
            gridColumn: 'span 12',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
          }}
        >
          <div
            style={{
              background: 'var(--primary)',
              padding: '24px',
              borderRadius: '24px',
              border: '1px solid #C4E84A',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'var(--text-main)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
              }}
            >
              <Cpu size={20} />
            </div>
            <h3
              style={{
                fontSize: '16px',
                fontWeight: '800',
                color: 'var(--text-main)',
                marginBottom: '8px',
              }}
            >
              SPA Архітектура
            </h3>
            <p
              style={{
                fontSize: '13px',
                color: 'var(--button-secondary-text)',
                lineHeight: '1.5',
                fontWeight: '500',
                margin: 0,
              }}
            >
              Побудовано на React.js та React Router. Забезпечує миттєвий
              перехід між сторінками.
            </p>
          </div>

          <div
            style={{
              background: 'var(--surface)',
              padding: '24px',
              borderRadius: '24px',
              border: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'var(--surface-subtle)',
                color: 'var(--text-main)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
              }}
            >
              <Database size={20} />
            </div>
            <h3
              style={{
                fontSize: '16px',
                fontWeight: '800',
                color: 'var(--text-main)',
                marginBottom: '8px',
              }}
            >
              Приватність даних
            </h3>
            <p
              style={{
                fontSize: '13px',
                color: 'var(--text-muted)',
                lineHeight: '1.5',
                margin: 0,
              }}
            >
              Безпечне збереження наборів у LocalStorage. Жодних прихованих баз
              даних.
            </p>
          </div>

          <div
            style={{
              background: 'var(--text-main)',
              padding: '24px',
              borderRadius: '24px',
              border: '1px solid var(--border-strong)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'var(--border-strong)',
                color: 'var(--surface)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
              }}
            >
              <Code size={20} />
            </div>
            <h3
              style={{
                fontSize: '16px',
                fontWeight: '700',
                color: 'var(--surface)',
                marginBottom: '8px',
              }}
            >
              Динамічний рендер
            </h3>
            <p
              style={{
                fontSize: '13px',
                color: 'var(--text-soft)',
                lineHeight: '1.5',
                margin: 0,
              }}
            >
              Власні JS-утиліти для розрахунку та ін'єкції CSS Keyframes у DOM
              в реальному часі.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
