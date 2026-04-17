import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const entryPoints = [
    {
      title: 'Створити анімацію',
      desc: 'Налаштуйте рух окремого елемента.',
      path: '/generator',
      icon: '✨',
    },
    {
      title: 'Бібліотека',
      desc: 'Готові пресети для натхнення.',
      path: '/library',
      icon: '📚',
    },
    {
      title: 'Створити набір',
      desc: 'Каскадні анімації інтерфейсу.',
      path: '/collections',
      icon: '🧱',
    },
  ];

  const animatedElements = [
    { id: 1, type: 'button', label: 'Hover Me', effect: 'pulse' },
    { id: 2, type: 'card', label: 'Slide Up', effect: 'slideUp' },
    { id: 3, type: 'icon', label: '⭐', effect: 'rotate' },
    { id: 4, type: 'button', label: 'Fade In', effect: 'fadeIn' },
    { id: 5, type: 'card', label: 'Bounce', effect: 'bounce' },
  ];

  // Розмножуємо елементи в 4 рази, щоб стрічка НІКОЛИ не пустувала
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
        justifyContent: 'space-between',
        height: 'calc(100vh - 140px)',
        overflow: 'hidden',
      }}
    >
      <style>{`
        /* Уповільнили загальну прокрутку вдвічі */
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); } 
        }
        
        /* Анімації стали значно плавнішими */
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        @keyframes slideUp { 0% { transform: translateY(10px); opacity: 0.8; } 100% { transform: translateY(-5px); opacity: 1; } }
        @keyframes rotate { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        
        .demo-pulse { animation: pulse 4s infinite ease-in-out; }
        .demo-slideUp { animation: slideUp 4s infinite alternate ease-in-out; }
        .demo-rotate { animation: rotate 8s infinite linear; }
        .demo-bounce { animation: bounce 4s infinite ease-in-out; }
        .demo-fadeIn { animation: pulse 5s infinite alternate ease-in; opacity: 0.8; }
      `}</style>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          padding: '0 20px',
          textAlign: 'center',
          maxWidth: '1000px' /* Збільшили контейнер */,
          margin: '0 auto',
        }}
      >
        <h1
          style={{
            fontSize: '42px',
            fontWeight: '900',
            color: '#111827',
            marginBottom: '16px',
            lineHeight: '1.1',
          }}
        >
          Створюйте магію веб-анімацій <br />
          <span style={{ color: '#4F46E5' }}>без написання коду</span>
        </h1>
        <p
          style={{
            fontSize: '16px',
            color: '#4B5563',
            marginBottom: '40px',
            maxWidth: '600px',
          }}
        >
          Animadiv — це візуальний генератор, який спрощує передачу анімацій від
          дизайнера до розробника.
        </p>

        {/* Замінили Grid на Flexbox, щоб картки завжди були в 1 ряд */}
        <div
          style={{
            display: 'flex',
            gap: '20px',
            width: '100%',
            justifyContent: 'center',
          }}
        >
          {entryPoints.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              style={{
                flex: 1 /* Кожна картка займає рівну третину */,
                textDecoration: 'none',
                textAlign: 'left',
                padding: '24px',
                background: '#fff',
                borderRadius: '16px',
                border: '1px solid #E5E7EB',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#4F46E5';
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow =
                  '0 10px 25px -5px rgba(0, 0, 0, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E5E7EB';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ fontSize: '28px', marginBottom: '12px' }}>
                {item.icon}
              </div>
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#111827',
                  marginBottom: '8px',
                }}
              >
                {item.title}
              </h3>
              <p
                style={{
                  fontSize: '13px',
                  color: '#6B7280',
                  lineHeight: '1.4',
                }}
              >
                {item.desc}
              </p>
            </Link>
          ))}
        </div>
      </div>

      <div
        style={{
          width: '100%',
          overflow: 'hidden',
          background: '#F9FAFB',
          padding: '30px 0',
          borderTop: '1px solid #E5E7EB',
          whiteSpace: 'nowrap',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            gap: '60px',
            animation: 'marquee 50s linear infinite' /* Було 25s, стало 50s */,
          }}
        >
          {marqueeList.map((el, index) => (
            <div
              key={index}
              className={`demo-${el.effect}`}
              style={{
                padding:
                  el.type === 'button'
                    ? '12px 24px'
                    : el.type === 'icon'
                      ? '15px'
                      : '20px 40px',
                background: el.type === 'button' ? '#4F46E5' : '#fff',
                color: el.type === 'button' ? '#fff' : '#111827',
                borderRadius: el.type === 'icon' ? '50%' : '8px',
                border: el.type !== 'button' ? '1px solid #E5E7EB' : 'none',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                fontWeight: '600',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {el.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
