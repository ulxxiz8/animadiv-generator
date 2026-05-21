export const customLayouts = {
  blank: {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      maxWidth: '520px',
    },
    items: [
      {
        id: 'blank-canvas',
        label: 'Blank Canvas',
        style: {
          width: '260px',
          height: '160px',
          justifyContent: 'center',
          borderStyle: 'dashed',
        },
      },
    ],
  },
  'feature-grid': {
    container: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '16px',
      width: '100%',
      maxWidth: '520px',
    },
    items: [1, 2, 3, 4].map((item) => ({
      id: `feature-${item}`,
      label: `Feature ${item}`,
      style: { height: '110px', justifyContent: 'center' },
    })),
  },
  'pricing-cards': {
    container: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '16px',
      width: '100%',
      maxWidth: '560px',
      alignItems: 'end',
    },
    items: [
      {
        id: 'price-basic',
        label: 'Basic Plan',
        style: { height: '150px', justifyContent: 'center' },
      },
      {
        id: 'price-pro',
        label: 'Pro Plan',
        style: { height: '190px', justifyContent: 'center' },
      },
      {
        id: 'price-team',
        label: 'Team Plan',
        style: { height: '165px', justifyContent: 'center' },
      },
    ],
  },
  testimonials: {
    container: {
      display: 'flex',
      flexDirection: 'column',
      gap: '14px',
      width: '100%',
      maxWidth: '520px',
    },
    items: [1, 2, 3].map((item) => ({
      id: `testimonial-${item}`,
      label: `Testimonial ${item}`,
      style: { height: '74px', justifyContent: 'center' },
    })),
  },
  'login-form': {
    container: {
      display: 'flex',
      flexDirection: 'column',
      gap: '14px',
      width: '100%',
      maxWidth: '360px',
    },
    items: [
      {
        id: 'login-title',
        label: 'Title',
        style: { height: '42px', justifyContent: 'center' },
      },
      { id: 'login-email', label: 'Email Input', style: { height: '46px' } },
      {
        id: 'login-password',
        label: 'Password Input',
        style: { height: '46px' },
      },
      {
        id: 'login-button',
        label: 'Login Button',
        style: { height: '46px', justifyContent: 'center' },
      },
    ],
  },
  dashboard: {
    container: {
      display: 'grid',
      gridTemplateColumns: '120px repeat(2, 1fr)',
      gap: '16px',
      width: '100%',
      maxWidth: '680px',
    },
    items: [
      {
        id: 'dash-sidebar',
        label: 'Sidebar',
        style: { height: '220px', gridRow: 'span 2', justifyContent: 'center' },
      },
      {
        id: 'dash-card-1',
        label: 'Metric Card',
        style: { height: '96px', justifyContent: 'center' },
      },
      {
        id: 'dash-card-2',
        label: 'Metric Card',
        style: { height: '96px', justifyContent: 'center' },
      },
      {
        id: 'dash-chart',
        label: 'Chart',
        style: {
          height: '108px',
          gridColumn: 'span 2',
          justifyContent: 'center',
        },
      },
    ],
  },
  navbar: {
    container: {
      display: 'grid',
      gridTemplateColumns: '120px 1fr 120px',
      gap: '14px',
      width: '100%',
      maxWidth: '680px',
      alignItems: 'center',
    },
    items: [
      {
        id: 'nav-logo',
        label: 'Logo',
        style: { height: '48px', justifyContent: 'center' },
      },
      {
        id: 'nav-links',
        label: 'Menu Links',
        style: { height: '48px', justifyContent: 'center' },
      },
      {
        id: 'nav-action',
        label: 'Action',
        style: { height: '48px', justifyContent: 'center' },
      },
    ],
  },
  gallery: {
    container: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '14px',
      width: '100%',
      maxWidth: '560px',
    },
    items: [1, 2, 3, 4, 5, 6].map((item) => ({
      id: `gallery-${item}`,
      label: `Image ${item}`,
      style: { height: item % 2 ? '120px' : '86px', justifyContent: 'center' },
    })),
  },
  'faq-section': {
    container: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      width: '100%',
      maxWidth: '560px',
    },
    items: [1, 2, 3].map((item) => ({
      id: `faq-${item}`,
      label: `Question ${item}`,
      style: { height: '58px' },
    })),
  },
  'cta-block': {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '16px',
      width: '100%',
      maxWidth: '520px',
    },
    items: [
      {
        id: 'cta-title',
        label: 'CTA Title',
        style: { width: '100%', height: '54px', justifyContent: 'center' },
      },
      {
        id: 'cta-text',
        label: 'CTA Text',
        style: { width: '80%', height: '42px', justifyContent: 'center' },
      },
      {
        id: 'cta-button',
        label: 'CTA Button',
        style: { width: '150px', height: '44px', justifyContent: 'center' },
      },
    ],
  },
  'product-card': {
    container: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      width: '100%',
      maxWidth: '280px',
    },
    items: [
      {
        id: 'product-image',
        label: 'Product Image',
        style: { height: '150px', justifyContent: 'center' },
      },
      {
        id: 'product-title',
        label: 'Product Title',
        style: { height: '42px' },
      },
      {
        id: 'product-button',
        label: 'Add To Cart',
        style: { height: '44px', justifyContent: 'center' },
      },
    ],
  },
  'team-section': {
    container: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '16px',
      width: '100%',
      maxWidth: '560px',
    },
    items: [1, 2, 3].map((item) => ({
      id: `team-${item}`,
      label: `Member ${item}`,
      style: { height: '136px', justifyContent: 'center' },
    })),
  },
  'stats-section': {
    container: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '16px',
      width: '100%',
      maxWidth: '560px',
    },
    items: [1, 2, 3].map((item) => ({
      id: `stat-${item}`,
      label: `Stat ${item}`,
      style: { height: '110px', justifyContent: 'center' },
    })),
  },
  newsletter: {
    container: {
      display: 'grid',
      gridTemplateColumns: '1fr 140px',
      gap: '14px',
      width: '100%',
      maxWidth: '560px',
    },
    items: [
      {
        id: 'newsletter-input',
        label: 'Email Input',
        style: { height: '52px' },
      },
      {
        id: 'newsletter-button',
        label: 'Subscribe',
        style: { height: '52px', justifyContent: 'center' },
      },
    ],
  },
  'modal-window': {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      maxWidth: '520px',
    },
    items: [
      {
        id: 'modal-card',
        label: 'Modal Window',
        style: { width: '320px', height: '190px', justifyContent: 'center' },
      },
    ],
  },
  'bento-grid': {
    container: {
      display: 'grid',
      gridTemplateColumns: '1.25fr 1fr 1fr',
      gap: '14px',
      width: '100%',
      maxWidth: '620px',
    },
    items: [
      {
        id: 'bento-main',
        label: 'Main Block',
        style: { height: '180px', gridRow: 'span 2', justifyContent: 'center' },
      },
      {
        id: 'bento-1',
        label: 'Block',
        style: { height: '82px', justifyContent: 'center' },
      },
      {
        id: 'bento-2',
        label: 'Block',
        style: { height: '82px', justifyContent: 'center' },
      },
      {
        id: 'bento-wide',
        label: 'Wide Block',
        style: {
          height: '84px',
          gridColumn: 'span 2',
          justifyContent: 'center',
        },
      },
    ],
  },
  'sidebar-layout': {
    container: {
      display: 'grid',
      gridTemplateColumns: '150px 1fr',
      gap: '16px',
      width: '100%',
      maxWidth: '640px',
    },
    items: [
      {
        id: 'layout-sidebar',
        label: 'Sidebar',
        style: { height: '220px', justifyContent: 'center' },
      },
      {
        id: 'layout-content',
        label: 'Content Area',
        style: { height: '220px', justifyContent: 'center' },
      },
    ],
  },
  'masonry-grid': {
    container: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '14px',
      width: '100%',
      maxWidth: '560px',
      alignItems: 'start',
    },
    items: [120, 84, 148, 96, 132, 90].map((height, index) => ({
      id: `masonry-${index + 1}`,
      label: `Tile ${index + 1}`,
      style: { height: `${height}px`, justifyContent: 'center' },
    })),
  },
  'split-hero': {
    container: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '22px',
      width: '100%',
      maxWidth: '680px',
      alignItems: 'center',
    },
    items: [
      {
        id: 'split-copy',
        label: 'Text Stack',
        style: { height: '150px', justifyContent: 'center' },
      },
      {
        id: 'split-image',
        label: 'Image',
        style: { height: '190px', justifyContent: 'center' },
      },
    ],
  },
  timeline: {
    container: {
      display: 'flex',
      flexDirection: 'column',
      gap: '14px',
      width: '100%',
      maxWidth: '520px',
    },
    items: [1, 2, 3].map((item) => ({
      id: `timeline-${item}`,
      label: `Timeline Item ${item}`,
      style: { height: '70px' },
    })),
  },
  'mobile-app-hero': {
    container: {
      display: 'grid',
      gridTemplateColumns: '160px 1fr',
      gap: '24px',
      width: '100%',
      maxWidth: '620px',
      alignItems: 'center',
    },
    items: [
      {
        id: 'mobile-phone',
        label: 'Phone Mockup',
        style: { height: '250px', justifyContent: 'center' },
      },
      {
        id: 'mobile-copy',
        label: 'Hero Copy',
        style: { height: '160px', justifyContent: 'center' },
      },
    ],
  },
};
