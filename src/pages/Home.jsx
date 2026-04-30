import React from 'react';
import { Link } from 'react-router-dom';
import {
  PlaySquare,
  Library,
  LayoutTemplate,
  Zap,
  ArrowUpRight,
} from 'lucide-react';

const Home = () => {
  const animatedElements = [
    {
      id: 1,
      type: 'accent',
      label: 'Hover Effect',
      effect: 'pulse',
      icon: <Zap size={16} />,
    },
    {
      id: 2,
      type: 'dark',
      label: 'Slide Sequence',
      effect: 'slideUp',
      icon: null,
    },
    {
      id: 3,
      type: 'light',
      label: 'Loading State',
      effect: 'rotate',
      icon: <PlaySquare size={16} />,
    },
    {
      id: 4,
      type: 'dark',
      label: 'Fade Entrance',
      effect: 'fadeIn',
      icon: null,
    },
    {
      id: 5,
      type: 'accent',
      label: 'Bounce Physics',
      effect: 'bounce',
      icon: null,
    },
  ];

  const marqueeList = [
    ...animatedElements,
    ...animatedElements,
    ...animatedElements,
    ...animatedElements,
  ];

  return (
    // Використовуємо точний розрахунок (100vh мінус Header та Footer), щоб уникнути скролу
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: 'calc(100vh - 155px)',
        backgroundColor: '#F9FAFB',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        @keyframes slideUp { 0% { transform: translateY(10px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
        @keyframes rotate { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes fadeIn { 0% { opacity: 0.3; } 100% { opacity: 1; } }
        
        .demo-pulse { animation: pulse 3s infinite ease-in-out; }
        .demo-slideUp { animation: slideUp 2s infinite alternate ease-in-out; }
        .demo-rotate { animation: rotate 6s infinite linear; }
        .demo-bounce { animation: bounce 3s infinite ease-in-out; }
        .demo-fadeIn { animation: fadeIn 2s infinite alternate ease-in-out; }
      `}</style>

      {/* ГОЛОВНИЙ БЛОК (HERO) - займає весь доступний простір, щоб притиснути Marquee донизу */}
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
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#111827',
            color: '#D6F854',
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

        <h1
          style={{
            fontSize: '48px',
            fontWeight: '900',
            color: '#111827',
            marginBottom: '16px',
            lineHeight: '1.1',
            letterSpacing: '-0.02em',
          }}
        >
          Анімація інтерфейсів <br />
          <span
            style={{
              background: '#D6F854',
              color: '#111827',
              padding: '2px 12px',
              borderRadius: '10px',
              display: 'inline-block',
              transform: 'rotate(-2deg)',
            }}
          >
            без написання коду.
          </span>
        </h1>

        <p
          style={{
            fontSize: '16px',
            color: '#6B7280',
            marginBottom: '40px',
            maxWidth: '600px',
            lineHeight: '1.5',
            fontWeight: '400',
          }}
        >
          Візуальний інструмент для дизайнерів та розробників. Створюйте,
          налаштовуйте та експортуйте оптимізований CSS-код в один клік.
        </p>

        {/* BENTO GRID (1 РЯДОК) - Зміна логіки розташування для економії висоти */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '16px',
            width: '100%',
            textAlign: 'left',
          }}
        >
          {/* КАРТКА 1: ГЕНЕРАТОР (span 5) */}
          <Link
            to="/generator"
            style={{
              gridColumn: 'span 5',
              background: '#111827',
              padding: '24px',
              borderRadius: '24px',
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'transform 0.2s',
              minHeight: '180px',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = 'translateY(-4px)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = 'translateY(0)')
            }
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '16px',
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: '#1F2937',
                  color: '#D6F854',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <PlaySquare size={22} strokeWidth={2} />
              </div>
              <ArrowUpRight size={22} color="#4B5563" />
            </div>
            <div>
              <h3
                style={{
                  fontSize: '20px',
                  fontWeight: '800',
                  color: '#ffffff',
                  marginBottom: '6px',
                  letterSpacing: '-0.01em',
                }}
              >
                Генератор
              </h3>
              <p
                style={{
                  fontSize: '13px',
                  color: '#9CA3AF',
                  lineHeight: '1.4',
                  margin: 0,
                }}
              >
                Створюйте складні CSS-анімації для окремих елементів за
                допомогою візуальних контролерів.
              </p>
            </div>
          </Link>

          {/* КАРТКА 2: UI НАБОРИ (span 4) */}
          <Link
            to="/collections"
            style={{
              gridColumn: 'span 4',
              background: '#ffffff',
              border: '1px solid #E5E7EB',
              padding: '24px',
              borderRadius: '24px',
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'box-shadow 0.2s, transform 0.2s',
              minHeight: '180px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow =
                '0 10px 15px -3px rgba(0, 0, 0, 0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '16px',
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: '#F3F4F6',
                  color: '#111827',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <LayoutTemplate size={22} strokeWidth={2} />
              </div>
              <ArrowUpRight size={22} color="#D1D5DB" />
            </div>
            <div>
              <h3
                style={{
                  fontSize: '20px',
                  fontWeight: '800',
                  color: '#111827',
                  marginBottom: '6px',
                  letterSpacing: '-0.01em',
                }}
              >
                UI Набори
              </h3>
              <p
                style={{
                  fontSize: '13px',
                  color: '#6B7280',
                  lineHeight: '1.4',
                  margin: 0,
                }}
              >
                Оживляйте цілі блоки. Налаштовуйте каскадні затримки та
                створюйте UI-патерни.
              </p>
            </div>
          </Link>

          {/* КАРТКА 3: БІБЛІОТЕКА (span 3) */}
          <Link
            to="/library"
            style={{
              gridColumn: 'span 3',
              background: '#D6F854',
              padding: '24px',
              borderRadius: '24px',
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'transform 0.2s',
              minHeight: '180px',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = 'translateY(-4px)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = 'translateY(0)')
            }
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '16px',
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: '#111827',
                  color: '#D6F854',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Library size={22} strokeWidth={2} />
              </div>
              <ArrowUpRight size={22} color="#111827" opacity={0.3} />
            </div>
            <div>
              <h3
                style={{
                  fontSize: '20px',
                  fontWeight: '800',
                  color: '#111827',
                  marginBottom: '6px',
                  letterSpacing: '-0.01em',
                }}
              >
                Бібліотека
              </h3>
              <p
                style={{
                  fontSize: '13px',
                  color: '#374151',
                  lineHeight: '1.4',
                  margin: 0,
                  fontWeight: '500',
                }}
              >
                Колекція пресетів для швидкого використання.
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* АНІМОВАНА СТРІЧКА (MARQUEE) */}
      <div
        style={{
          width: '100%',
          overflow: 'hidden',
          background: '#f1f1f1',
          padding: '16px 0',
          borderTop: '1px solid #f1f1f1',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            gap: '32px',
            animation: 'marquee 40s linear infinite',
          }}
        >
          {marqueeList.map((el, index) => {
            let bg =
              el.type === 'accent'
                ? '#D6F854'
                : el.type === 'dark'
                  ? '#1F2937'
                  : '#ffffff';
            let color = el.type === 'dark' ? '#ffffff' : '#111827';
            let border = el.type === 'dark' ? '1px solid #374151' : 'none';

            return (
              <div
                key={index}
                className={`demo-${el.effect}`}
                style={{
                  padding: '10px 20px',
                  background: bg,
                  color: color,
                  borderRadius: '12px',
                  border: border,
                  fontWeight: '700',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  whiteSpace: 'nowrap',
                }}
              >
                {el.icon}
                {el.label}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
