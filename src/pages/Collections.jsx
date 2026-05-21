import React, { useCallback, useEffect, useMemo, useState } from 'react';
import CollectionEditor from '../features/collections/CollectionEditor';
import CollectionControls from '../features/collections/CollectionControls';
import CollectionCodeOutput from '../features/collections/CollectionCodeOutput';
import { customLayouts } from '../features/collections/collectionLayoutDefinitions';
import { animationPresets } from '../data/presets';

const Bar = ({ width, height = 8, color = '#D1D5DB' }) => (
  <div style={{ width, height, background: color, borderRadius: 4 }} />
);

const Rect = ({ width, height, color = '#D1D5DB', radius = 6 }) => (
  <div style={{ width, height, background: color, borderRadius: radius }} />
);

const BlankIcon = () => (
  <div
    style={{
      fontSize: 58,
      fontWeight: 300,
      color: '#9CA3AF',
      letterSpacing: 4,
    }}
  >
    [ + ]
  </div>
);

const HeroIcon = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 10,
    }}
  >
    <Bar width={148} height={15} />
    <Bar width={98} height={9} color="#E5E7EB" />
    <Bar width={196} height={10} color="#E5E7EB" />
    <Rect width={45} height={17} color="#9CA3AF" radius={5} />
  </div>
);

const ArticleIcon = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
    <Rect width={46} height={46} radius={8} />
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      <Bar width={120} />
      <Bar width={96} height={7} color="#E5E7EB" />
    </div>
  </div>
);

const CardGridIcon = () => (
  <div style={{ display: 'flex', gap: 10 }}>
    {[0, 1, 2].map((item) => (
      <Rect key={item} width={46} height={46} radius={7} />
    ))}
  </div>
);

const FeatureGridIcon = () => (
  <div
    style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 34px)', gap: 9 }}
  >
    {[0, 1, 2, 3].map((item) => (
      <Rect key={item} width={34} height={34} radius={7} />
    ))}
  </div>
);

const PricingCardsIcon = () => (
  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
    <Rect width={34} height={62} radius={8} />
    <Rect width={34} height={82} radius={8} color="#C7CDD5" />
    <Rect width={34} height={70} radius={8} />
  </div>
);

const TestimonialsIcon = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
    <div
      style={{
        width: 44,
        height: 44,
        borderRadius: '50%',
        background: '#D1D5DB',
      }}
    />
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Bar width={126} />
      <Bar width={92} height={7} color="#E5E7EB" />
    </div>
  </div>
);

const LoginFormIcon = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 10,
    }}
  >
    <Rect width={164} height={18} color="#E5E7EB" radius={5} />
    <Rect width={94} height={20} color="#9CA3AF" radius={6} />
  </div>
);

const DashboardIcon = () => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: '34px 120px',
      gap: 10,
      alignItems: 'stretch',
    }}
  >
    <Rect width={34} height={82} color="#C7CDD5" radius={7} />
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
      <Rect width={56} height={34} radius={7} />
      <Rect width={56} height={34} radius={7} />
      <div
        style={{ gridColumn: '1 / span 2', height: 34, position: 'relative' }}
      >
        <Bar width={118} height={2} color="#E5E7EB" />
        <div
          style={{
            position: 'absolute',
            left: 8,
            top: 20,
            width: 96,
            height: 2,
            background: '#9CA3AF',
            transform: 'rotate(-8deg)',
            borderRadius: 4,
          }}
        />
      </div>
    </div>
  </div>
);

const NavbarIcon = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
    <Rect width={34} height={34} color="#9CA3AF" radius={8} />
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      <Bar width={120} />
      <Bar width={92} height={7} color="#E5E7EB" />
      <Bar width={108} height={7} color="#E5E7EB" />
    </div>
  </div>
);

const GalleryIcon = () => (
  <div
    style={{ display: 'grid', gridTemplateColumns: '42px 42px 42px', gap: 7 }}
  >
    <Rect width={42} height={58} radius={7} />
    <Rect width={42} height={38} radius={7} />
    <Rect width={42} height={52} radius={7} />
    <Rect width={42} height={34} radius={7} />
    <Rect width={42} height={54} radius={7} />
    <Rect width={42} height={40} radius={7} />
  </div>
);

const FAQIcon = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
    {[132, 164, 118].map((width) => (
      <div
        key={width}
        style={{ display: 'flex', gap: 10, alignItems: 'center' }}
      >
        <Rect width={10} height={10} color="#9CA3AF" radius={5} />
        <Bar width={width} />
      </div>
    ))}
  </div>
);

const CTAIcon = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 11,
    }}
  >
    <Bar width={158} height={13} />
    <Bar width={108} height={8} color="#E5E7EB" />
    <Rect width={66} height={22} color="#9CA3AF" radius={6} />
  </div>
);

const ProductCardIcon = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
    <Rect width={58} height={58} radius={9} />
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Bar width={96} />
      <Bar width={70} height={7} color="#E5E7EB" />
      <Rect width={58} height={17} color="#9CA3AF" radius={5} />
    </div>
  </div>
);

const TeamIcon = () => (
  <div style={{ display: 'flex', gap: 14 }}>
    {[0, 1, 2].map((item) => (
      <div
        key={item}
        style={{
          width: 46,
          height: 46,
          borderRadius: '50%',
          background: '#D1D5DB',
        }}
      />
    ))}
  </div>
);

const StatsIcon = () => (
  <div style={{ display: 'flex', gap: 10 }}>
    {[0, 1, 2].map((item) => (
      <div
        key={item}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Bar width={38} height={16} color="#9CA3AF" />
        <Rect width={46} height={34} radius={7} />
      </div>
    ))}
  </div>
);

const NewsletterIcon = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    <Rect width={118} height={24} color="#E5E7EB" radius={6} />
    <Rect width={58} height={24} color="#9CA3AF" radius={6} />
  </div>
);

const ModalIcon = () => (
  <div
    style={{
      width: 168,
      height: 94,
      borderRadius: 13,
      background: '#E5E7EB',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Rect width={92} height={48} color="#C7CDD5" radius={9} />
  </div>
);

const BentoIcon = () => (
  <div
    style={{ display: 'grid', gridTemplateColumns: '70px 44px 44px', gap: 8 }}
  >
    <Rect width={70} height={70} radius={8} />
    <Rect width={44} height={30} radius={7} />
    <Rect width={44} height={70} radius={7} />
    <Rect width={70} height={34} radius={7} />
    <Rect width={96} height={34} radius={7} />
  </div>
);

const SidebarLayoutIcon = () => (
  <div style={{ display: 'flex', gap: 10 }}>
    <Rect width={38} height={86} color="#C7CDD5" radius={8} />
    <Rect width={132} height={86} radius={8} />
  </div>
);

const MasonryIcon = () => (
  <div
    style={{ display: 'grid', gridTemplateColumns: '42px 42px 42px', gap: 8 }}
  >
    <Rect width={42} height={72} radius={7} />
    <Rect width={42} height={42} radius={7} />
    <Rect width={42} height={60} radius={7} />
    <Rect width={42} height={46} radius={7} />
    <Rect width={42} height={78} radius={7} />
    <Rect width={42} height={48} radius={7} />
  </div>
);

const SplitHeroIcon = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Bar width={86} height={13} />
      <Bar width={68} height={7} color="#E5E7EB" />
      <Rect width={42} height={17} color="#9CA3AF" radius={5} />
    </div>
    <Rect width={76} height={66} radius={9} />
  </div>
);

const TimelineIcon = () => (
  <div style={{ display: 'flex', gap: 13 }}>
    <div style={{ width: 16, height: 86, position: 'relative' }}>
      <div
        style={{
          position: 'absolute',
          left: 7,
          top: 0,
          width: 2,
          height: 86,
          background: '#D1D5DB',
        }}
      />
      {[8, 38, 68].map((top) => (
        <div
          key={top}
          style={{
            position: 'absolute',
            left: 2,
            top,
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: '#9CA3AF',
          }}
        />
      ))}
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Bar width={130} />
      <Bar width={96} />
      <Bar width={116} />
    </div>
  </div>
);

const MobileHeroIcon = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
    <Rect width={54} height={86} color="#C7CDD5" radius={12} />
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Bar width={96} height={13} />
      <Bar width={74} height={7} color="#E5E7EB" />
      <Rect width={48} height={17} color="#9CA3AF" radius={5} />
    </div>
  </div>
);

const layoutTemplates = [
  {
    id: 'hero',
    name: 'Hero Section',
    subtitle: '',
    layoutId: 'hero',
    icon: <HeroIcon />,
  },
  {
    id: 'article',
    name: 'Article',
    subtitle: '',
    layoutId: 'article',
    icon: <ArticleIcon />,
  },
  {
    id: 'grid',
    name: 'Card Grid',
    subtitle: '',
    layoutId: 'grid',
    icon: <CardGridIcon />,
  },
  {
    id: 'feature-grid',
    name: 'Feature Grid',
    subtitle: '',
    layoutId: 'feature-grid',
    icon: <FeatureGridIcon />,
  },
  {
    id: 'pricing-cards',
    name: 'Pricing Cards',
    subtitle: '',
    layoutId: 'pricing-cards',
    icon: <PricingCardsIcon />,
  },
  {
    id: 'login-form',
    name: 'Login Form',
    subtitle: '',
    layoutId: 'login-form',
    icon: <LoginFormIcon />,
  },
  {
    id: 'dashboard',
    name: 'Dashboard',
    subtitle: '',
    layoutId: 'dashboard',
    icon: <DashboardIcon />,
  },
  {
    id: 'faq-section',
    name: 'FAQ Section',
    subtitle: '',
    layoutId: 'faq-section',
    icon: <FAQIcon />,
  },
  {
    id: 'product-card',
    name: 'Product Card',
    subtitle: '',
    layoutId: 'product-card',
    icon: <ProductCardIcon />,
  },
  {
    id: 'newsletter',
    name: 'Newsletter',
    subtitle: '',
    layoutId: 'newsletter',
    icon: <NewsletterIcon />,
  },
  {
    id: 'sidebar-layout',
    name: 'Sidebar Layout',
    subtitle: '',
    layoutId: 'sidebar-layout',
    icon: <SidebarLayoutIcon />,
  },
];

const TemplateCard = ({ template, onSelect }) => (
  <article
    onClick={() => onSelect(template.layoutId)}
    style={{
      background: 'var(--surface)',
      border: '2px solid transparent',
      borderRadius: 12,
      padding: '30px 20px',
      minHeight: 222,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
      transition: 'all 0.2s ease',
      textAlign: 'center',
    }}
    onMouseEnter={(event) => {
      event.currentTarget.style.transform = 'translateY(-4px)';
      event.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)';
      event.currentTarget.style.borderColor = '#E5E7EB';
    }}
    onMouseLeave={(event) => {
      event.currentTarget.style.transform = 'translateY(0)';
      event.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.05)';
      event.currentTarget.style.borderColor = 'transparent';
    }}
  >
    <div
      style={{
        height: 82,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginBottom: 18,
      }}
    >
      {template.icon}
    </div>
    <h3
      style={{
        fontSize: 21,
        fontWeight: 850,
        color: '#111827',
        lineHeight: 1.12,
        letterSpacing: 0,
        margin: '0 0 6px',
      }}
    >
      {template.name}
    </h3>
    {template.subtitle && (
      <span style={{ fontSize: 16, color: '#6B7280', lineHeight: 1.35 }}>
        {template.subtitle}
      </span>
    )}
  </article>
);

const fallbackLayouts = {
  hero: {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px',
      width: '100%',
      maxWidth: '450px',
    },
    items: [
      {
        id: 'hero-h1',
        label: 'Heading (Заголовок)',
        style: { width: '100%', height: '50px', justifyContent: 'center' },
      },
      {
        id: 'hero-p',
        label: 'Text (Опис)',
        style: { width: '85%', height: '40px', justifyContent: 'center' },
      },
      {
        id: 'hero-btn',
        label: 'Button (Кнопка)',
        style: { width: '140px', height: '40px', justifyContent: 'center' },
      },
    ],
  },
  article: {
    container: {
      display: 'flex',
      gap: '20px',
      width: '100%',
      maxWidth: '500px',
      alignItems: 'center',
    },
    items: [
      {
        id: 'art-img',
        label: 'Image',
        style: {
          width: '120px',
          height: '120px',
          flexShrink: 0,
          justifyContent: 'center',
        },
      },
      { id: 'art-t1', label: 'Title', style: { width: '100%' } },
      {
        id: 'art-p',
        label: 'Paragraph',
        style: { width: '100%', height: '60px' },
      },
    ],
  },
  grid: {
    container: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '16px',
      width: '100%',
      maxWidth: '400px',
    },
    items: [1, 2, 3].map((item) => ({
      id: `grid-${item}`,
      label: `Card ${item}`,
      style: { height: '100px', justifyContent: 'center' },
    })),
  },
};

const toKebabCase = (value) =>
  String(value).replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);

const styleToCss = (styles = {}, indent = '  ') =>
  Object.entries(styles)
    .map(
      ([key, value]) =>
        `${indent}${toKebabCase(key)}: ${typeof value === 'number' ? `${value}px` : value};`
    )
    .join('\n');

const getLayoutDefinition = (layoutId) =>
  customLayouts[layoutId] || fallbackLayouts[layoutId] || fallbackLayouts.hero;

const createCollectionBundle = (layoutId, globalPreset, staggerDelay) => {
  const definition = getLayoutDefinition(layoutId);
  const preset = animationPresets.find((item) => item.id === globalPreset);
  const animationName = preset && preset.id !== 'none' ? `ag_${preset.id}` : '';
  const keyframes =
    animationName && typeof preset.keyframes === 'function'
      ? `@keyframes ${animationName} {\n${preset.keyframes({ intensity: 100 })}\n}\n\n`
      : '';
  const className = `animadiv-${layoutId}`;
  const itemMarkup = definition.items
    .map(
      (item) =>
        `  <div class="animadiv-item" data-block="${item.id}">${item.label}</div>`
    )
    .join('\n');
  const html = `<section class="animadiv-ui-kit ${className}">\n${itemMarkup}\n</section>`;
  const itemCss = definition.items
    .map(
      (item, index) =>
        `.${className} .animadiv-item:nth-child(${index + 1}) {\n${styleToCss(item.style)}\n  animation-delay: ${index * staggerDelay}ms;\n}`
    )
    .join('\n\n');
  const animationCss = animationName
    ? `\n  animation-name: ${animationName};\n  animation-duration: 600ms;\n  animation-fill-mode: both;\n  animation-timing-function: ease-out;`
    : '';
  const css = `${keyframes}.${className} {\n${styleToCss(definition.container)}\n}\n\n.${className} .animadiv-item {\n  border: 1px solid #E5E7EB;\n  border-radius: 16px;\n  background: #FFFFFF;\n  padding: 16px;\n  color: #111827;\n  font-size: 13px;\n  font-weight: 750;\n  display: flex;\n  align-items: center;${animationCss}\n}\n\n${itemCss}`;

  return {
    html,
    css,
    combined: `${html}\n\n<style>\n${css}\n</style>`,
  };
};

const Collections = () => {
  const [selectedLayoutId, setSelectedLayoutId] = useState(null);
  const [globalPreset, setGlobalPreset] = useState('fade');
  const [staggerDelay, setStaggerDelay] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handlePlay = useCallback(() => {
    setIsPlaying(false);
    window.setTimeout(() => {
      setRefreshKey((prev) => prev + 1);
      setIsPlaying(true);
    }, 10);
  }, []);

  const handleReset = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const selectedTemplate = layoutTemplates.find(
    (template) => template.layoutId === selectedLayoutId
  );
  const codeBundle = useMemo(
    () =>
      createCollectionBundle(
        selectedLayoutId || 'hero',
        globalPreset,
        staggerDelay
      ),
    [globalPreset, selectedLayoutId, staggerDelay]
  );

  useEffect(() => {
    if (!selectedLayoutId) return undefined;

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [selectedLayoutId]);

  if (!selectedLayoutId) {
    return (
      <main
        style={{
          minHeight: '100%',
          background: 'var(--bg-color)',
          fontFamily:
            'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        <div
          style={{
            maxWidth: 1180,
            margin: '0 auto',
            padding: '34px 20px 90px',
            boxSizing: 'border-box',
          }}
        >
          <header
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 24,
              padding: 28,
              marginBottom: 22,
              textAlign: 'center',
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
            }}
          >
            <h2
              style={{
                fontSize: 34,
                color: '#111827',
                margin: '0 0 14px',
                fontWeight: 850,
                lineHeight: 1.1,
                letterSpacing: 0,
              }}
            >
              З чого почнемо?
            </h2>
            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: 20,
                maxWidth: 520,
                margin: '0 auto',
                lineHeight: 1.45,
              }}
            >
              Оберіть базовий макет для каскадної анімації або почніть з чистого
              аркуша
            </p>
          </header>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(220px, 1fr))',
              gap: 30,
              width: '100%',
            }}
          >
            {layoutTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onSelect={setSelectedLayoutId}
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        display: 'flex',
        gap: 24,
        height: 'calc(100vh - 80px)',
        minHeight: 0,
        padding: 24,
        boxSizing: 'border-box',
        background: 'var(--bg-color)',
        overflow: 'hidden',
      }}
    >
      <div
        className="column settings-panel"
        style={{ display: 'flex', background: 'var(--surface)' }}
      >
        <CollectionControls
          globalPreset={globalPreset}
          setGlobalPreset={setGlobalPreset}
          staggerDelay={staggerDelay}
          setStaggerDelay={setStaggerDelay}
          onPlay={handlePlay}
          onReset={handleReset}
        />
      </div>

      <div
        className="column preview-panel"
        style={{
          flex: 1,
          background: 'var(--bg-color)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          minWidth: 0,
          minHeight: 0,
        }}
      >
        <CollectionEditor
          layoutId={selectedLayoutId}
          onBack={() => setSelectedLayoutId(null)}
          globalPreset={globalPreset}
          staggerDelay={staggerDelay}
          isPlaying={isPlaying}
          refreshKey={refreshKey}
          onPlay={handlePlay}
        />
      </div>

      <div
        className="column code-panel"
        style={{ display: 'flex', background: 'var(--surface)' }}
      >
        <CollectionCodeOutput
          bundle={codeBundle}
          title={selectedTemplate?.name || 'UI Kit section'}
        />
      </div>
    </main>
  );
};

export default Collections;
