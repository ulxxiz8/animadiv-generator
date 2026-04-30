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
        padding:
          '60px 24px 80px 24px' /* Додав трохи місця знизу перед футером */,
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* HERO SECTION */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1
          style={{
            fontSize: '48px',
            fontWeight: '900',
            color: '#111827',
            letterSpacing: '-0.02em',
            lineHeight: '1.1',
            marginBottom: '16px',
          }}
        >
          Ми створюємо{' '}
          <span
            style={{
              background: '#D6F854',
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
            color: '#6B7280',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.5',
            fontWeight: '400',
          }}
        >
          Animadiv — це візуальний генератор CSS-анімацій, створений для
          подолання прірви між продуктовим дизайном та фронтенд-розробкою.
        </p>
      </div>

      {/* BENTO GRID LAYOUT */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: '16px',
          width: '100%',
        }}
      >
        {/* БЛОК 1: Місія */}
        <section
          style={{
            gridColumn: 'span 8',
            background: '#111827',
            padding: '32px 40px',
            borderRadius: '24px',
            color: '#ffffff',
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
              color: '#D6F854',
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
              color: '#D6F854',
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
              Проблема & Рішення
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
              color: '#9CA3AF',
              lineHeight: '1.5',
              maxWidth: '90%',
              margin: 0,
            }}
          >
            Дизайнери створюють ідеальні концепції, а розробники витрачають
            години на підбір таймінгів у коді. Animadiv генерує оптимізований
            CSS та HTML код миттєво, дозволяючи вам фокусуватися на креативі.
          </p>
        </section>

        {/* БЛОК 2: Автор */}
        <section
          style={{
            gridColumn: 'span 4',
            background: '#ffffff',
            padding: '32px',
            borderRadius: '24px',
            border: '1px solid #E5E7EB',
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
              background: '#F3F4F6',
              color: '#111827',
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
              color: '#111827',
              margin: '0 0 6px 0',
              letterSpacing: '-0.01em',
            }}
          >
            Юлія Рябич
          </h2>
          <p
            style={{
              fontSize: '13px',
              color: '#6B7280',
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
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: '#F3F4F6',
                color: '#374151',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#111827';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#F3F4F6';
                e.currentTarget.style.color = '#374151';
              }}
            >
              <Globe size={16} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: '#F3F4F6',
                color: '#374151',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#0A66C2';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#F3F4F6';
                e.currentTarget.style.color = '#374151';
              }}
            >
              <Briefcase size={16} />
            </a>
          </div>
        </section>

        {/* БЛОК 3: Технології */}
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
              background: '#D6F854',
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
                background: '#111827',
                color: '#D6F854',
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
                color: '#111827',
                marginBottom: '8px',
              }}
            >
              SPA Архітектура
            </h3>
            <p
              style={{
                fontSize: '13px',
                color: '#374151',
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
              background: '#ffffff',
              padding: '24px',
              borderRadius: '24px',
              border: '1px solid #E5E7EB',
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
                background: '#F3F4F6',
                color: '#111827',
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
                color: '#111827',
                marginBottom: '8px',
              }}
            >
              Приватність даних
            </h3>
            <p
              style={{
                fontSize: '13px',
                color: '#6B7280',
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
              background: '#111827',
              padding: '24px',
              borderRadius: '24px',
              border: '1px solid #1F2937',
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
                background: '#1F2937',
                color: '#ffffff',
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
                color: '#ffffff',
                marginBottom: '8px',
              }}
            >
              Динамічний рендер
            </h3>
            <p
              style={{
                fontSize: '13px',
                color: '#9CA3AF',
                lineHeight: '1.5',
                margin: 0,
              }}
            >
              Власні JS-утиліти для розрахунку та ін'єкції CSS Keyframes у DOM у
              реальному часі.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
