import React, { useCallback, useEffect, useMemo, useState } from 'react';
import CollectionEditor from '../features/collections/CollectionEditor';
import CollectionControls from '../features/collections/CollectionControls';
import CollectionCodeOutput from '../features/collections/CollectionCodeOutput';
import { customLayouts } from '../features/collections/collectionLayoutDefinitions';
import { animationPresets } from '../data/presets';
import { useTranslation } from '../i18n/useTranslation';

/* ─── Skeleton icon primitives ────────────────────────────────────────────── */

const Bar = ({ width, height = 8, color }) => (
  <div
    style={{
      width,
      height,
      background: color || 'var(--control-border)',
      borderRadius: 4,
    }}
  />
);

const Rect = ({ width, height, color, radius = 6 }) => (
  <div
    style={{
      width,
      height,
      background: color || 'var(--control-border)',
      borderRadius: radius,
    }}
  />
);

/* ─── Layout icons ─────────────────────────────────────────────────────────── */

const BlankIcon = () => (
  <div
    style={{
      fontSize: 58,
      fontWeight: 300,
      color: 'var(--text-soft)',
      letterSpacing: 4,
    }}
  >
    [ + ]
  </div>
);

const HeroIcon = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
    <Bar width={148} height={15} />
    <Bar width={98} height={9} color="var(--border)" />
    <Bar width={196} height={10} color="var(--border)" />
    <Rect width={45} height={17} color="var(--text-soft)" radius={5} />
  </div>
);

const ArticleIcon = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
    <Rect width={46} height={46} radius={8} />
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      <Bar width={120} />
      <Bar width={96} height={7} color="var(--border)" />
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
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 34px)', gap: 9 }}>
    {[0, 1, 2, 3].map((item) => (
      <Rect key={item} width={34} height={34} radius={7} />
    ))}
  </div>
);

const PricingCardsIcon = () => (
  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
    <Rect width={34} height={62} radius={8} />
    <Rect width={34} height={82} radius={8} color="var(--text-soft)" />
    <Rect width={34} height={70} radius={8} />
  </div>
);

const TestimonialsIcon = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
    <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--control-border)' }} />
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Bar width={126} />
      <Bar width={92} height={7} color="var(--border)" />
    </div>
  </div>
);

const LoginFormIcon = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
    <Rect width={164} height={18} color="var(--border)" radius={5} />
    <Rect width={94} height={20} color="var(--text-soft)" radius={6} />
  </div>
);

const DashboardIcon = () => (
  <div style={{ display: 'grid', gridTemplateColumns: '34px 120px', gap: 10, alignItems: 'stretch' }}>
    <Rect width={34} height={82} color="var(--text-soft)" radius={7} />
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
      <Rect width={56} height={34} radius={7} />
      <Rect width={56} height={34} radius={7} />
      <div style={{ gridColumn: '1 / span 2', height: 34, position: 'relative' }}>
        <Bar width={118} height={2} color="var(--border)" />
        <div
          style={{
            position: 'absolute',
            left: 8,
            top: 20,
            width: 96,
            height: 2,
            background: 'var(--text-soft)',
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
    <Rect width={34} height={34} color="var(--text-soft)" radius={8} />
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      <Bar width={120} />
      <Bar width={92} height={7} color="var(--border)" />
      <Bar width={108} height={7} color="var(--border)" />
    </div>
  </div>
);

const GalleryIcon = () => (
  <div style={{ display: 'grid', gridTemplateColumns: '42px 42px 42px', gap: 7 }}>
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
      <div key={width} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <Rect width={10} height={10} color="var(--text-soft)" radius={5} />
        <Bar width={width} />
      </div>
    ))}
  </div>
);

const CTAIcon = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 11 }}>
    <Bar width={158} height={13} />
    <Bar width={108} height={8} color="var(--border)" />
    <Rect width={66} height={22} color="var(--text-soft)" radius={6} />
  </div>
);

const ProductCardIcon = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
    <Rect width={58} height={58} radius={9} />
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Bar width={96} />
      <Bar width={70} height={7} color="var(--border)" />
      <Rect width={58} height={17} color="var(--text-soft)" radius={5} />
    </div>
  </div>
);

const TeamIcon = () => (
  <div style={{ display: 'flex', gap: 14 }}>
    {[0, 1, 2].map((item) => (
      <div key={item} style={{ width: 46, height: 46, borderRadius: '50%', background: 'var(--control-border)' }} />
    ))}
  </div>
);

const StatsIcon = () => (
  <div style={{ display: 'flex', gap: 10 }}>
    {[0, 1, 2].map((item) => (
      <div key={item} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <Bar width={38} height={16} color="var(--text-soft)" />
        <Rect width={46} height={34} radius={7} />
      </div>
    ))}
  </div>
);

const NewsletterIcon = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    <Rect width={118} height={24} color="var(--border)" radius={6} />
    <Rect width={58} height={24} color="var(--text-soft)" radius={6} />
  </div>
);

const ModalIcon = () => (
  <div
    style={{
      width: 168,
      height: 94,
      borderRadius: 13,
      background: 'var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Rect width={92} height={48} color="var(--text-soft)" radius={9} />
  </div>
);

const BentoIcon = () => (
  <div style={{ display: 'grid', gridTemplateColumns: '70px 44px 44px', gap: 8 }}>
    <Rect width={70} height={70} radius={8} />
    <Rect width={44} height={30} radius={7} />
    <Rect width={44} height={70} radius={7} />
    <Rect width={70} height={34} radius={7} />
    <Rect width={96} height={34} radius={7} />
  </div>
);

const SidebarLayoutIcon = () => (
  <div style={{ display: 'flex', gap: 10 }}>
    <Rect width={38} height={86} color="var(--text-soft)" radius={8} />
    <Rect width={132} height={86} radius={8} />
  </div>
);

const MasonryIcon = () => (
  <div style={{ display: 'grid', gridTemplateColumns: '42px 42px 42px', gap: 8 }}>
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
      <Bar width={68} height={7} color="var(--border)" />
      <Rect width={42} height={17} color="var(--text-soft)" radius={5} />
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
          background: 'var(--control-border)',
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
            background: 'var(--text-soft)',
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
    <Rect width={54} height={86} color="var(--text-soft)" radius={12} />
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Bar width={96} height={13} />
      <Bar width={74} height={7} color="var(--border)" />
      <Rect width={48} height={17} color="var(--text-soft)" radius={5} />
    </div>
  </div>
);

/* ─── Layout template definitions ──────────────────────────────────────────── */

const layoutTemplates = [
  { id: 'hero', titleKey: 'templates.heroSection', subtitleKey: '', layoutId: 'hero', icon: <HeroIcon /> },
  { id: 'article', titleKey: 'templates.article', subtitleKey: '', layoutId: 'article', icon: <ArticleIcon /> },
  { id: 'grid', titleKey: 'templates.cardGrid', subtitleKey: '', layoutId: 'grid', icon: <CardGridIcon /> },
  { id: 'feature-grid', titleKey: 'templates.featureGrid', subtitleKey: '', layoutId: 'feature-grid', icon: <FeatureGridIcon /> },
  { id: 'pricing-cards', titleKey: 'templates.pricingCards', subtitleKey: '', layoutId: 'pricing-cards', icon: <PricingCardsIcon /> },
  { id: 'login-form', titleKey: 'templates.loginForm', subtitleKey: '', layoutId: 'login-form', icon: <LoginFormIcon /> },
  { id: 'dashboard', titleKey: 'templates.dashboard', subtitleKey: '', layoutId: 'dashboard', icon: <DashboardIcon /> },
  { id: 'faq-section', titleKey: 'templates.faqSection', subtitleKey: '', layoutId: 'faq-section', icon: <FAQIcon /> },
  { id: 'product-card', titleKey: 'templates.productCard', subtitleKey: '', layoutId: 'product-card', icon: <ProductCardIcon /> },
  { id: 'newsletter', titleKey: 'templates.newsletter', subtitleKey: '', layoutId: 'newsletter', icon: <NewsletterIcon /> },
  { id: 'sidebar-layout', titleKey: 'templates.sidebarLayout', subtitleKey: '', layoutId: 'sidebar-layout', icon: <SidebarLayoutIcon /> },
];

/* ─── Fallback layout definitions ──────────────────────────────────────────── */

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
      { id: 'hero-h1', labelKey: 'collections.labels.heading', label: 'Heading', style: { width: '100%', height: '50px', justifyContent: 'center' } },
      { id: 'hero-p', labelKey: 'collections.labels.text', label: 'Text', style: { width: '85%', height: '40px', justifyContent: 'center' } },
      { id: 'hero-btn', labelKey: 'collections.labels.button', label: 'Button', style: { width: '140px', height: '40px', justifyContent: 'center' } },
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
      { id: 'art-img', labelKey: 'templates.image', label: 'Image', style: { width: '120px', height: '120px', flexShrink: 0, justifyContent: 'center' } },
      { id: 'art-t1', labelKey: 'templates.title', label: 'Title', style: { width: '100%' } },
      { id: 'art-p', labelKey: 'templates.paragraph', label: 'Paragraph', style: { width: '100%', height: '60px' } },
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
      labelKey: 'templates.card',
      labelParams: { count: item },
      label: `Card ${item}`,
      style: { height: '100px', justifyContent: 'center' },
    })),
  },
};

/* ─── Utilities ────────────────────────────────────────────────────────────── */

const UI_KIT_THEME = {
  background: '#F9FAFB',
  surface: '#FFFFFF',
  surfaceSubtle: '#F3F4F6',
  textMain: '#111827',
  textMuted: '#6B7280',
  textSoft: '#9CA3AF',
  border: '#E5E7EB',
  accent: '#D6F854',
  dark: '#111827',
};

const resolveCssValue = (value) => {
  if (typeof value !== 'string') return value;

  return value
    .replaceAll('var(--surface)', UI_KIT_THEME.surface)
    .replaceAll('var(--surface-alt)', UI_KIT_THEME.background)
    .replaceAll('var(--surface-subtle)', UI_KIT_THEME.surfaceSubtle)
    .replaceAll('var(--bg-color)', UI_KIT_THEME.background)
    .replaceAll('var(--text-main)', UI_KIT_THEME.textMain)
    .replaceAll('var(--text-muted)', UI_KIT_THEME.textMuted)
    .replaceAll('var(--text-soft)', UI_KIT_THEME.textSoft)
    .replaceAll('var(--border)', UI_KIT_THEME.border)
    .replaceAll('var(--control-border)', '#D1D5DB')
    .replaceAll('var(--primary)', UI_KIT_THEME.accent)
    .replaceAll('var(--button-bg)', UI_KIT_THEME.dark)
    .replaceAll('var(--button-text)', UI_KIT_THEME.accent);
};

const toKebabCase = (value) =>
  String(value).replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);

const normalizeCssValue = (key, value) => {
  if (value === undefined || value === null || value === '') return null;
  if (typeof value === 'number') {
    const unitless = new Set(['opacity', 'zIndex', 'fontWeight', 'lineHeight', 'flexGrow', 'flexShrink']);
    return unitless.has(key) ? String(value) : `${value}px`;
  }
  return resolveCssValue(value);
};

const styleToCss = (styles = {}, indent = '  ') =>
  Object.entries(styles)
    .map(([key, value]) => {
      const resolved = normalizeCssValue(key, value);
      if (resolved === null) return '';
      return `${indent}${toKebabCase(key)}: ${resolved};`;
    })
    .filter(Boolean)
    .join('\n');

const getLayoutDefinition = (layoutId) =>
  customLayouts[layoutId] || fallbackLayouts[layoutId] || fallbackLayouts.hero;

const getItemLabel = (item, t) =>
  item.labelKey ? t(item.labelKey, item.labelParams || {}) : item.label;

const createAnimationCss = (globalPreset, staggerDelay) => {
  const preset = animationPresets.find((item) => item.id === globalPreset);
  if (!preset || preset.id === 'none') {
    return { keyframes: '', animationName: '', baseAnimation: '' };
  }

  const animationName = `animadiv_${preset.id.replace(/[^a-zA-Z0-9_-]/g, '_')}`;
  const keyframes =
    typeof preset.keyframes === 'function'
      ? `@keyframes ${animationName} {\n${preset.keyframes({ intensity: 72 })}\n}\n\n`
      : '';

  return {
    keyframes,
    animationName,
    baseAnimation: `\n  animation-name: ${animationName};\n  animation-duration: 640ms;\n  animation-fill-mode: both;\n  animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);`,
    staggerDelay,
  };
};

const createCollectionBundle = (layoutId, globalPreset, staggerDelay, t) => {
  const definition = getLayoutDefinition(layoutId);
  const { keyframes, baseAnimation } = createAnimationCss(globalPreset, staggerDelay);
  const className = `animadiv-${layoutId}`;

  const itemMarkup = definition.items
    .map(
      (item) =>
        `    <div class="animadiv-item" data-block="${item.id}">${getItemLabel(item, t)}</div>`
    )
    .join('\n');

  const html = `<div class="animadiv-stage">\n  <section class="animadiv-ui-kit ${className}">\n${itemMarkup}\n  </section>\n</div>`;

  const itemCss = definition.items
    .map((item, index) => {
      const delay = Number(staggerDelay) * index;
      const delayRule = baseAnimation ? `\n  animation-delay: ${delay}ms;` : '';
      return `.${className} .animadiv-item:nth-child(${index + 1}) {\n${styleToCss(item.style)}${delayRule}\n}`;
    })
    .join('\n\n');

  const css = `${keyframes}html, body {\n  margin: 0;\n  width: 100%;\n  min-height: 100vh;\n  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;\n  background: ${UI_KIT_THEME.background};\n  color: ${UI_KIT_THEME.textMain};\n}\n\n.animadiv-stage {\n  width: 100%;\n  min-height: 100vh;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  box-sizing: border-box;\n  padding: 40px;\n}\n\n.${className} {\n${styleToCss(definition.container)}\n}\n\n.${className} .animadiv-item {\n  box-sizing: border-box;\n  border: 1px solid ${UI_KIT_THEME.border};\n  border-radius: 16px;\n  background: ${UI_KIT_THEME.surface};\n  padding: 16px;\n  color: ${UI_KIT_THEME.textMain};\n  font-size: 13px;\n  font-weight: 750;\n  line-height: 1.2;\n  display: flex;\n  align-items: center;\n  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);${baseAnimation}\n}\n\n${itemCss}\n\n@media (max-width: 720px) {\n  .animadiv-stage {\n    padding: 24px;\n  }\n\n  .${className} {\n    width: 100%;\n    max-width: 100%;\n  }\n}`;

  return {
    html,
    css,
    combined: `${html}\n\n<style>\n${css}\n</style>`,
  };
};

/* ─── TemplateCard ─────────────────────────────────────────────────────────── */

const TemplateCard = ({ template, onSelect }) => {
  const { t } = useTranslation();
  const title = t(template.titleKey);

  return (
  <article
    onClick={() => onSelect(template.layoutId)}
    className="coll-template-card"
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
      event.currentTarget.style.borderColor = 'var(--border)';
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
        color: 'var(--text-main)',
        lineHeight: 1.12,
        letterSpacing: '-0.01em',
        margin: '0 0 6px',
      }}
    >
      {title}
    </h3>
    {template.subtitleKey && (
      <span style={{ fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.35 }}>
        {t(template.subtitleKey)}
      </span>
    )}
  </article>
  );
};

/* ─── Collections page ─────────────────────────────────────────────────────── */

const Collections = () => {
  const { t } = useTranslation();
  const [selectedLayoutId, setSelectedLayoutId] = useState(null);
  const [globalPreset, setGlobalPreset] = useState('fade-in');
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
        staggerDelay,
        t
      ),
    [globalPreset, selectedLayoutId, staggerDelay, t]
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

  /* ── Template selection screen ── */
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
        <style>{`
          .coll-template-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(220px, 1fr));
            gap: 30px;
            width: 100%;
          }

          /* Tablet */
          @media (max-width: 860px) {
            .coll-template-grid {
              grid-template-columns: repeat(2, 1fr);
              gap: 20px;
            }
          }

          /* Mobile */
          @media (max-width: 560px) {
            .coll-template-grid {
              grid-template-columns: 1fr;
              gap: 16px;
            }

            .coll-header h2 {
              font-size: 26px !important;
            }

            .coll-header p {
              font-size: 16px !important;
            }
          }

          /* Hover shadow on dark theme */
          [data-theme="dark"] .coll-template-card:hover {
            box-shadow: 0 10px 24px -4px rgba(0,0,0,0.35) !important;
          }
        `}</style>

        <div
          style={{
            maxWidth: 1180,
            margin: '0 auto',
            padding: '34px 20px 90px',
            boxSizing: 'border-box',
          }}
        >
          <header
            className="coll-header"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 24,
              padding: 28,
              marginBottom: 22,
              textAlign: 'center',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
          >
            <h2
              style={{
                fontSize: 34,
                color: 'var(--text-main)',
                margin: '0 0 14px',
                fontWeight: 900,
                lineHeight: 1.1,
                letterSpacing: '-0.01em',
              }}
            >
              {t('collections.startTitle')}</h2>
            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: 18,
                maxWidth: 520,
                margin: '0 auto',
                lineHeight: 1.5,
              }}
            >
              {t('collections.startSubtitle')}</p>
          </header>

          <div className="coll-template-grid">
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

  /* ── Editor screen ── */
  return (
    <main
      className="coll-editor-main"
      style={{
        display: 'flex',
        gap: 24,
        height: 'calc(100vh - 80px)',
        minHeight: 0,
        padding: 24,
        boxSizing: 'border-box',
        background: 'var(--bg-color)',
        overflow: 'hidden',
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <style>{`
        /* On narrow screens stack columns vertically and allow scroll */
        @media (max-width: 900px) {
          .coll-editor-main {
            flex-direction: column !important;
            overflow-y: auto !important;
            height: auto !important;
          }

          .coll-settings-panel,
          .coll-code-panel {
            width: 100% !important;
            flex-shrink: 0 !important;
          }

          .coll-preview-panel {
            min-height: 420px;
            flex-shrink: 0 !important;
          }
        }
      `}</style>

      <div
        className="column settings-panel coll-settings-panel"
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
        className="column preview-panel coll-preview-panel"
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
        className="column code-panel coll-code-panel"
        style={{ display: 'flex', background: 'var(--surface)' }}
      >
        <CollectionCodeOutput
          bundle={codeBundle}
          title={selectedTemplate?.titleKey ? t(selectedTemplate.titleKey) : t('templates.uiKitSection')}
        />
      </div>
    </main>
  );
};

export default Collections;


