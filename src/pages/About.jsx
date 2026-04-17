import React from 'react';

const About = () => {
  return (
    <div
      style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px 20px 60px',
        color: '#111827',
      }}
    >
      <h1
        style={{
          fontSize: '36px',
          fontWeight: '900',
          textAlign: 'center',
          marginBottom: '40px',
        }}
      >
        Про проєкт <span style={{ color: '#4F46E5' }}>Animadiv.</span>
      </h1>

      {/* БЛОК 1: Місія/Проблема */}
      <section
        style={{
          marginBottom: '32px',
          background: '#fff',
          padding: '32px',
          borderRadius: '16px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        }}
      >
        <h2
          style={{
            fontSize: '22px',
            fontWeight: '700',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <span>🎯</span> Наша місія та проблема
        </h2>
        <p style={{ fontSize: '16px', color: '#4B5563', lineHeight: '1.6' }}>
          Сучасна веброзробка часто стикається з проблемою "Handoff" (передачі
          макетів) між дизайнером та розробником. Дизайнер створює красиву
          концепцію анімації, а фронтенд-розробник витрачає години на її ручне
          відтворення в CSS.
          <br />
          <br />
          <strong>Animadiv</strong> вирішує цю проблему. Це візуальний
          генератор, де ви налаштовуєте рух, а система автоматично генерує
          готовий, оптимізований CSS та HTML код для миттєвої інтеграції в
          проєкт.
        </p>
      </section>

      {/* БЛОК 2: Технології */}
      <section
        style={{
          marginBottom: '48px',
          background: '#fff',
          padding: '32px',
          borderRadius: '16px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        }}
      >
        <h2
          style={{
            fontSize: '22px',
            fontWeight: '700',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <span>⚙️</span> Під капотом (Технології)
        </h2>
        <p
          style={{
            fontSize: '16px',
            color: '#4B5563',
            lineHeight: '1.6',
            marginBottom: '16px',
          }}
        >
          Проєкт розроблено з фокусом на швидкість та повну приватність даних
          користувача. Ми свідомо відмовилися від складних баз даних.
        </p>
        <ul
          style={{
            color: '#4B5563',
            lineHeight: '1.6',
            paddingLeft: '20px',
            fontSize: '16px',
          }}
        >
          <li style={{ marginBottom: '8px' }}>
            <strong>Frontend:</strong> React.js, React Router (SPA архітектура)
          </li>
          <li style={{ marginBottom: '8px' }}>
            <strong>Сховище:</strong> Безпечне збереження у вашому браузері
            (LocalStorage / No Database)
          </li>
          <li style={{ marginBottom: '8px' }}>
            <strong>Генерація:</strong> Власні JS-утиліти для динамічного
            рендерингу CSS Keyframes
          </li>
        </ul>
      </section>

      {/* БЛОК 3: Автор */}
      <section
        style={{
          textAlign: 'center',
          padding: '40px 20px',
          background: '#F9FAFB',
          borderRadius: '16px',
        }}
      >
        <div
          style={{
            width: '90px',
            height: '90px',
            borderRadius: '50%',
            background: '#E5E7EB',
            margin: '0 auto 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '40px',
          }}
        >
          👩‍💻
        </div>
        <h2
          style={{
            fontSize: '24px',
            fontWeight: '700',
            marginBottom: '4px',
            color: '#111827',
          }}
        >
          ЮЛІЧКА Рябич
        </h2>
        <p
          style={{
            fontSize: '15px',
            color: '#6B7280',
            marginBottom: '24px',
            fontWeight: '500',
          }}
        >
          Product Designer & Frontend Developer
        </p>

        {/* Соцмережі */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            style={{
              padding: '10px 24px',
              background: '#111827',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '14px',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => (e.target.style.opacity = '0.8')}
            onMouseLeave={(e) => (e.target.style.opacity = '1')}
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noreferrer"
            style={{
              padding: '10px 24px',
              background: '#0A66C2',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '14px',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => (e.target.style.opacity = '0.8')}
            onMouseLeave={(e) => (e.target.style.opacity = '1')}
          >
            LinkedIn
          </a>
          <a
            href="https://behance.net"
            target="_blank"
            rel="noreferrer"
            style={{
              padding: '10px 24px',
              background: '#1769FF',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '14px',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => (e.target.style.opacity = '0.8')}
            onMouseLeave={(e) => (e.target.style.opacity = '1')}
          >
            Behance
          </a>
        </div>
      </section>
    </div>
  );
};

export default About;
