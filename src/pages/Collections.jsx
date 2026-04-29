import React, { useState } from 'react';
import CollectionEditor from '../features/collections/CollectionEditor';
import CollectionControls from '../features/collections/CollectionControls'; // Підключили нову панель

// --- ДАНІ МАКЕТІВ ---
const layoutTemplates = [
  {
    id: 'blank',
    name: 'Blank Canvas',
    subtitle: '(З чистого аркуша)',
    icon: (
      <div
        style={{
          fontSize: '48px',
          fontWeight: '300',
          color: '#9CA3AF',
          letterSpacing: '2px',
        }}
      >
        [ + ]
      </div>
    ),
  },
  {
    id: 'hero',
    name: 'Hero Section',
    subtitle: '',
    icon: (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          width: '100%',
        }}
      >
        <div
          style={{
            width: '60%',
            height: '12px',
            background: '#D1D5DB',
            borderRadius: '4px',
          }}
        />
        <div
          style={{
            width: '40%',
            height: '8px',
            background: '#E5E7EB',
            borderRadius: '4px',
          }}
        />
        <div
          style={{
            width: '80%',
            height: '8px',
            background: '#E5E7EB',
            borderRadius: '4px',
          }}
        />
        <div
          style={{
            width: '36px',
            height: '14px',
            background: '#9CA3AF',
            borderRadius: '4px',
            marginTop: '6px',
          }}
        />
      </div>
    ),
  },
  {
    id: 'article',
    name: 'Article',
    subtitle: '',
    icon: (
      <div
        style={{
          display: 'flex',
          gap: '10px',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: '36px',
            height: '36px',
            background: '#D1D5DB',
            borderRadius: '6px',
          }}
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
            width: '50%',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '6px',
              background: '#D1D5DB',
              borderRadius: '2px',
            }}
          />
          <div
            style={{
              width: '80%',
              height: '6px',
              background: '#E5E7EB',
              borderRadius: '2px',
            }}
          />
        </div>
      </div>
    ),
  },
  {
    id: 'grid',
    name: 'Card Grid',
    subtitle: '',
    icon: (
      <div
        style={{
          display: 'flex',
          gap: '8px',
          width: '100%',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: '26px',
            height: '36px',
            background: '#D1D5DB',
            borderRadius: '4px',
          }}
        />
        <div
          style={{
            width: '26px',
            height: '36px',
            background: '#D1D5DB',
            borderRadius: '4px',
          }}
        />
        <div
          style={{
            width: '26px',
            height: '36px',
            background: '#D1D5DB',
            borderRadius: '4px',
          }}
        />
      </div>
    ),
  },
];

// --- КОМПОНЕНТ БІЧНОЇ ПАНЕЛІ ---
const SidebarPanel = ({ title, placeholderType, isActive, children }) => {
  return (
    <div
      style={{
        flex: 1,
        background: isActive ? '#fff' : '#F3F4F6',
        borderRadius: '12px',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px',
        border: isActive ? '1px solid #E5E7EB' : 'none',
        transition: 'all 0.3s ease',
      }}
    >
      <div
        style={{
          opacity: isActive ? 1 : 0.3,
          filter: isActive ? 'none' : 'blur(2px)',
          pointerEvents: isActive ? 'auto' : 'none',
          transition: 'all 0.3s ease',
          height: '100%',
        }}
      >
        {/* Якщо панель активна і ми передали всередину неї код панелі налаштувань - малюємо її */}
        {isActive && children ? (
          children
        ) : (
          /* Інакше малюємо заглушки */
          <>
            {isActive && (
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: '700',
                  color: '#111827',
                  textTransform: 'uppercase',
                  marginBottom: '24px',
                  letterSpacing: '0.05em',
                }}
              >
                {placeholderType === 'settings'
                  ? 'Налаштування елемента'
                  : 'Скопіювати Bundle'}
              </div>
            )}
            {placeholderType === 'settings' ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                {[1, 2, 3].map((i) => (
                  <div key={i}>
                    <div
                      style={{
                        width: '40%',
                        height: '10px',
                        background: '#D1D5DB',
                        borderRadius: '4px',
                        marginBottom: '8px',
                      }}
                    />
                    <div
                      style={{
                        width: '100%',
                        height: '34px',
                        background: '#E5E7EB',
                        borderRadius: '6px',
                        border: '1px solid #D1D5DB',
                      }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                }}
              >
                <div
                  style={{
                    flex: 1,
                    background: '#111827',
                    borderRadius: '8px',
                    padding: '16px',
                    fontFamily: 'monospace',
                    color: '#9CA3AF',
                    fontSize: '12px',
                  }}
                >
                  <div>.ag-article {'{'} </div>
                  <div style={{ paddingLeft: '16px' }}>
                    display: flex; gap: 10px;
                  </div>
                  <div style={{ paddingLeft: '16px' }}>
                    animation: cascade 0.5s;
                  </div>
                  <div>{'}'}</div>
                </div>
                <div
                  style={{ display: 'flex', gap: '10px', marginTop: '20px' }}
                >
                  <div
                    style={{
                      flex: 1,
                      height: '38px',
                      background: '#D1D5DB',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '13px',
                      color: '#4B5563',
                      fontWeight: '600',
                    }}
                  >
                    Share
                  </div>
                  <div
                    style={{
                      flex: 1,
                      height: '38px',
                      background: '#4F46E5',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '13px',
                      color: '#fff',
                      fontWeight: '600',
                    }}
                  >
                    Copy HTML
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Блюр і текст поверх заблокованої панелі */}
      {!isActive && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(255, 255, 255, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            textAlign: 'center',
            zIndex: 10,
          }}
        >
          <div
            style={{
              background: 'white',
              padding: '12px 20px',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
              color: '#374151',
              fontWeight: '500',
              fontSize: '14px',
              border: '1px solid #E5E7EB',
            }}
          >
            {title}
          </div>
        </div>
      )}
    </div>
  );
};

// --- ГОЛОВНИЙ КОМПОНЕНТ СТОРІНКИ ---
const Collections = () => {
  const [selectedLayoutId, setSelectedLayoutId] = useState(null);

  // Стейт (пам'ять) для керування каскадом і пресетами
  const [globalPreset, setGlobalPreset] = useState('fade');
  const [staggerDelay, setStaggerDelay] = useState(100);

  return (
    <main
      style={{
        display: 'flex',
        gap: '20px',
        height: 'calc(100vh - 80px)',
        padding: '20px',
        boxSizing: 'border-box',
        background: '#ffffff',
      }}
    >
      {/* ЛІВА ПАНЕЛЬ */}
      <div style={{ width: '300px', display: 'flex' }}>
        <SidebarPanel
          title="Оберіть макет, щоб розблокувати налаштування"
          placeholderType="settings"
          isActive={!!selectedLayoutId}
        >
          {/* Вставляємо справжню панель керування, яку ми створили */}
          <CollectionControls
            globalPreset={globalPreset}
            setGlobalPreset={setGlobalPreset}
            staggerDelay={staggerDelay}
            setStaggerDelay={setStaggerDelay}
          />
        </SidebarPanel>
      </div>

      {/* ЦЕНТРАЛЬНА ОБЛАСТЬ */}
      <div
        style={{
          flex: 1,
          background: '#F9FAFB',
          borderRadius: '12px',
          border: '1px solid #E5E7EB',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* СТАН 1: ВИБІР МАКЕТА */}
        {!selectedLayoutId && (
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2
                style={{
                  fontSize: '28px',
                  color: '#111827',
                  marginBottom: '12px',
                  fontWeight: '600',
                }}
              >
                З чого почнемо?
              </h2>
              <p
                style={{
                  color: '#6B7280',
                  fontSize: '15px',
                  maxWidth: '400px',
                  margin: '0 auto',
                  lineHeight: '1.5',
                }}
              >
                Оберіть базовий макет для каскадної анімації або почніть з
                чистого аркуша
              </p>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '24px',
                width: '100%',
                maxWidth: '500px',
              }}
            >
              {layoutTemplates.map((layout) => (
                <div
                  key={layout.id}
                  onClick={() => setSelectedLayoutId(layout.id)}
                  style={{
                    background: '#ffffff',
                    border: '2px solid transparent',
                    borderRadius: '12px',
                    padding: '30px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                    transition: 'all 0.2s ease',
                    textAlign: 'center',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow =
                      '0 10px 15px -3px rgba(0,0,0,0.1)';
                    e.currentTarget.style.borderColor = '#4F46E5';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow =
                      '0 4px 6px -1px rgba(0,0,0,0.05)';
                    e.currentTarget.style.borderColor = 'transparent';
                  }}
                >
                  <div
                    style={{
                      height: '80px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      marginBottom: '16px',
                    }}
                  >
                    {layout.icon}
                  </div>
                  <h3
                    style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1F2937',
                      margin: 0,
                    }}
                  >
                    {layout.name}
                  </h3>
                  {layout.subtitle && (
                    <span
                      style={{
                        fontSize: '13px',
                        color: '#6B7280',
                        marginTop: '4px',
                      }}
                    >
                      {layout.subtitle}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* СТАН 2: РЕДАКТОР НАБОРУ */}
        {selectedLayoutId && (
          <CollectionEditor
            layoutId={selectedLayoutId}
            onBack={() => setSelectedLayoutId(null)}
            globalPreset={globalPreset} // ПЕРЕДАЄМО ПРЕСЕТ
            staggerDelay={staggerDelay} // ПЕРЕДАЄМО ЗАТРИМКУ
          />
        )}
      </div>

      {/* ПРАВА ПАНЕЛЬ */}
      <div style={{ width: '300px', display: 'flex' }}>
        <SidebarPanel
          title="Оберіть макет, щоб розблокувати налаштування"
          placeholderType="code"
          isActive={!!selectedLayoutId}
        />
      </div>
    </main>
  );
};

export default Collections;
