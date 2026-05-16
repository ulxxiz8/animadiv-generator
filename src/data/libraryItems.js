import { DEFAULT_ANIMATION_CONFIG } from '../utils/elementSystem';

const animation = (overrides = {}) => ({
  ...DEFAULT_ANIMATION_CONFIG,
  ...overrides,
});

const animations = ({ load = {}, hover = {}, click = {} } = {}) => ({
  load: animation(load),
  hover: animation(hover),
  click: animation(click),
});

const shadow = (overrides = {}) => ({
  shadowEnabled: true,
  shadowColor: '#111827',
  shadowBlur: 24,
  shadowOffsetY: 10,
  shadowOpacity: 0.12,
  ...overrides,
});

const preview = (theme, background = '#F9FAFB', accent = '#D6F854') => ({
  theme,
  background,
  accent,
});

const meta = ({
  id,
  name,
  category,
  collection,
  motionStyle,
  intensity,
  libraryKind = 'element',
  tags = [],
  displayType,
}) => ({
  id,
  name,
  category,
  collection,
  motionStyle,
  intensity,
  libraryKind,
  tags,
  displayType,
});

const template = ({ html, css }) => ({
  templateHtml: html,
  templateCss: css,
});

const templateCode = {
  pressCard: template({
    html: `<article class="animadiv-template press-card-template">
  <span>INTERACTION</span>
  <h2>Press feedback</h2>
  <p>A compact card with tactile down-state motion.</p>
</article>`,
    css: `.animadiv-template.press-card-template {
  width: 320px;
  min-height: 220px;
  box-sizing: border-box;
  display: grid;
  align-content: center;
  gap: 12px;
  padding: 32px;
  border: 1px solid #E5E7EB;
  border-radius: 28px;
  color: #111827;
  background: #FFFFFF;
  box-shadow: 0 18px 42px rgba(17, 24, 39, 0.08);
  animation: press-card-enter 640ms cubic-bezier(0.16, 1, 0.3, 1) both;
  transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease;
}

.press-card-template span {
  color: #6B7280;
  font: 900 10px/1 Inter, system-ui, sans-serif;
  letter-spacing: 1.4px;
}

.press-card-template h2 {
  margin: 0;
  font: 900 30px/1.05 Inter, system-ui, sans-serif;
  letter-spacing: -0.01em;
}

.press-card-template p {
  margin: 0;
  color: #6B7280;
  font: 700 14px/1.5 Inter, system-ui, sans-serif;
}

.press-card-template:hover {
  transform: translateY(-6px);
  border-color: #111827;
  box-shadow: 0 24px 48px rgba(17, 24, 39, 0.1);
}

.press-card-template:active {
  transform: translateY(0) scale(0.98);
}

@keyframes press-card-enter {
  from { opacity: 0; transform: translateY(18px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}`,
  }),
  floatingGlassPanel: template({
    html: `<section class="animadiv-template floating-glass-template">
  <div class="glass-dot"></div>
  <article>
    <span>CINEMATIC</span>
    <h2>Floating glass</h2>
    <p>Layered surface with a calm loop for showcase moments.</p>
  </article>
</section>`,
    css: `.animadiv-template.floating-glass-template {
  position: relative;
  width: 320px;
  min-height: 220px;
  display: grid;
  place-items: center;
  overflow: hidden;
  border-radius: 30px;
  background: linear-gradient(135deg, #F9FAFB 0%, #FFFFFF 58%, #F9FAFB 100%);
}

.floating-glass-template article {
  position: relative;
  z-index: 1;
  width: 232px;
  padding: 28px;
  border: 1px solid #E5E7EB;
  border-radius: 26px;
  color: #111827;
  background: rgba(255, 255, 255, 0.72);
  box-shadow: 0 20px 48px rgba(17, 24, 39, 0.1);
  backdrop-filter: blur(16px);
  animation: floating-glass-loop 3.2s ease-in-out infinite;
  transition: transform 220ms ease, box-shadow 220ms ease;
}

.floating-glass-template .glass-dot {
  position: absolute;
  width: 118px;
  height: 118px;
  border-radius: 999px;
  background: rgba(214, 248, 84, 0.45);
  filter: blur(1px);
  animation: glass-dot-drift 4.4s ease-in-out infinite;
}

.floating-glass-template span {
  color: #6B7280;
  font: 900 10px/1 Inter, system-ui, sans-serif;
  letter-spacing: 1.4px;
}

.floating-glass-template h2 {
  margin: 10px 0 8px;
  font: 900 28px/1.05 Inter, system-ui, sans-serif;
  letter-spacing: -0.01em;
}

.floating-glass-template p {
  margin: 0;
  color: #6B7280;
  font: 700 13px/1.5 Inter, system-ui, sans-serif;
}

.floating-glass-template:hover article {
  transform: translateY(-8px);
  box-shadow: 0 26px 56px rgba(17, 24, 39, 0.12);
}

@keyframes floating-glass-loop {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}

@keyframes glass-dot-drift {
  0%, 100% { transform: translate3d(-58px, -26px, 0) scale(1); }
  50% { transform: translate3d(54px, 28px, 0) scale(1.12); }
}`,
  }),
  parallaxMediaBlock: template({
    html: `<section class="animadiv-template parallax-media-template">
  <img src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=900&auto=format&fit=crop" alt="Modern workspace" />
  <div>
    <span>MEDIA BLOCK</span>
    <h2>Depth on hover</h2>
  </div>
</section>`,
    css: `.animadiv-template.parallax-media-template {
  position: relative;
  width: 320px;
  min-height: 220px;
  overflow: hidden;
  border-radius: 30px;
  background: #111827;
  box-shadow: 0 22px 50px rgba(17, 24, 39, 0.16);
}

.parallax-media-template img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(1) contrast(1.08);
  opacity: 0.74;
  transform: scale(1.06);
  animation: parallax-media-in 820ms cubic-bezier(0.16, 1, 0.3, 1) both;
  transition: transform 420ms ease, filter 420ms ease, opacity 420ms ease;
}

.parallax-media-template div {
  position: absolute;
  left: 24px;
  right: 24px;
  bottom: 24px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 22px;
  color: #FFFFFF;
  background: rgba(17, 24, 39, 0.78);
}

.parallax-media-template span {
  color: #D6F854;
  font: 900 10px/1 Inter, system-ui, sans-serif;
  letter-spacing: 1.4px;
}

.parallax-media-template h2 {
  margin: 8px 0 0;
  font: 900 26px/1.05 Inter, system-ui, sans-serif;
  letter-spacing: -0.01em;
}

.parallax-media-template:hover img {
  transform: scale(1.14) translateY(-8px);
  filter: grayscale(1) contrast(1.18);
  opacity: 0.88;
}

@keyframes parallax-media-in {
  from { opacity: 0; transform: scale(1.18); filter: blur(8px) grayscale(1); }
  to { opacity: 0.74; transform: scale(1.06); filter: blur(0) grayscale(1); }
}`,
  }),
  dashboardCard: template({
    html: `<article class="animadiv-template dashboard-card-template">
  <div class="dash-head">
    <span>REVENUE</span>
    <strong>+24%</strong>
  </div>
  <h2>$48.2k</h2>
  <div class="dash-bars"><i></i><i></i><i></i><i></i></div>
</article>`,
    css: `.animadiv-template.dashboard-card-template {
  width: 320px;
  min-height: 220px;
  box-sizing: border-box;
  padding: 28px;
  border: 1px solid #E5E7EB;
  border-radius: 30px;
  color: #111827;
  background: #FFFFFF;
  box-shadow: 0 18px 42px rgba(17, 24, 39, 0.08);
  animation: dashboard-card-in 620ms cubic-bezier(0.16, 1, 0.3, 1) both;
  transition: transform 220ms ease, box-shadow 220ms ease;
}

.dashboard-card-template .dash-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.dashboard-card-template span {
  color: #6B7280;
  font: 900 10px/1 Inter, system-ui, sans-serif;
  letter-spacing: 1.4px;
}

.dashboard-card-template strong {
  display: inline-flex;
  height: 32px;
  align-items: center;
  padding: 0 12px;
  border-radius: 999px;
  color: #111827;
  background: #D6F854;
  font: 900 13px/1 Inter, system-ui, sans-serif;
}

.dashboard-card-template h2 {
  margin: 0 0 22px;
  font: 900 42px/1 Inter, system-ui, sans-serif;
  letter-spacing: -0.01em;
}

.dashboard-card-template .dash-bars {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  align-items: end;
  gap: 8px;
  height: 58px;
}

.dashboard-card-template i {
  display: block;
  border-radius: 999px;
  background: #111827;
  animation: dashboard-bar 1.6s ease-in-out infinite;
}

.dashboard-card-template i:nth-child(1) { height: 34px; opacity: 0.22; }
.dashboard-card-template i:nth-child(2) { height: 46px; opacity: 0.34; animation-delay: 120ms; }
.dashboard-card-template i:nth-child(3) { height: 28px; opacity: 0.24; animation-delay: 240ms; }
.dashboard-card-template i:nth-child(4) { height: 58px; background: #D6F854; animation-delay: 360ms; }

.dashboard-card-template:hover {
  transform: translateY(-6px);
  box-shadow: 0 24px 54px rgba(17, 24, 39, 0.1);
}

@keyframes dashboard-card-in {
  from { opacity: 0; transform: translateY(18px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes dashboard-bar {
  0%, 100% { transform: scaleY(0.82); }
  50% { transform: scaleY(1); }
}`,
  }),
  bentoFeatureBlock: template({
    html: `<section class="animadiv-template bento-feature-template">
  <span>FEATURE</span>
  <h2>Motion-ready surface</h2>
  <p>Designed for compact product storytelling.</p>
</section>`,
    css: `.animadiv-template.bento-feature-template {
  width: 320px;
  min-height: 220px;
  box-sizing: border-box;
  display: grid;
  align-content: end;
  gap: 10px;
  padding: 30px;
  border: 1px solid #E5E7EB;
  border-radius: 30px;
  color: #111827;
  background:
    linear-gradient(135deg, rgba(214, 248, 84, 0.34), transparent 42%),
    #FFFFFF;
  box-shadow: 0 18px 42px rgba(17, 24, 39, 0.08);
  animation: bento-feature-reveal 700ms cubic-bezier(0.16, 1, 0.3, 1) both;
  transition: transform 220ms ease, border-color 220ms ease, box-shadow 220ms ease;
}

.bento-feature-template span {
  color: #6B7280;
  font: 900 10px/1 Inter, system-ui, sans-serif;
  letter-spacing: 1.4px;
}

.bento-feature-template h2 {
  margin: 0;
  max-width: 230px;
  font: 900 30px/1.05 Inter, system-ui, sans-serif;
  letter-spacing: -0.01em;
}

.bento-feature-template p {
  margin: 0;
  max-width: 220px;
  color: #6B7280;
  font: 700 13px/1.5 Inter, system-ui, sans-serif;
}

.bento-feature-template:hover {
  transform: translateY(-6px);
  border-color: #111827;
  box-shadow: 0 24px 54px rgba(17, 24, 39, 0.1);
}

@keyframes bento-feature-reveal {
  from { opacity: 0; clip-path: inset(18% round 30px); transform: translateY(16px); }
  to { opacity: 1; clip-path: inset(0 round 30px); transform: translateY(0); }
}`,
  }),
  floatingStatPanel: template({
    html: `<article class="animadiv-template floating-stat-template">
  <span>ACTIVE USERS</span>
  <h2>12,840</h2>
  <p>Live engagement is trending upward.</p>
</article>`,
    css: `.animadiv-template.floating-stat-template {
  width: 320px;
  min-height: 220px;
  box-sizing: border-box;
  display: grid;
  align-content: center;
  gap: 12px;
  padding: 30px;
  border: 1px solid #E5E7EB;
  border-radius: 30px;
  color: #111827;
  background: #F9FAFB;
  box-shadow: 0 18px 42px rgba(17, 24, 39, 0.08);
  animation: floating-stat-loop 3s ease-in-out infinite;
  transition: transform 220ms ease, box-shadow 220ms ease;
}

.floating-stat-template span {
  color: #6B7280;
  font: 900 10px/1 Inter, system-ui, sans-serif;
  letter-spacing: 1.4px;
}

.floating-stat-template h2 {
  margin: 0;
  font: 900 44px/1 Inter, system-ui, sans-serif;
  letter-spacing: -0.01em;
}

.floating-stat-template p {
  margin: 0;
  color: #6B7280;
  font: 700 14px/1.5 Inter, system-ui, sans-serif;
}

.floating-stat-template:hover {
  transform: translateY(-8px);
  box-shadow: 0 24px 54px rgba(17, 24, 39, 0.1);
}

@keyframes floating-stat-loop {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}`,
  }),
};

const buttonItem = ({
  id,
  name,
  collection,
  motionStyle,
  intensity,
  tags,
  text,
  width = 190,
  backgroundColor = '#111827',
  color = '#D6F854',
  borderColor = '#111827',
  radius = 999,
  previewBackground = '#F9FAFB',
  specific = {},
  motion,
}) => ({
  ...meta({
    id,
    name,
    category: 'Button',
    collection,
    motionStyle,
    intensity,
    tags,
    displayType: 'Button',
  }),
  type: 'button',
  tag: 'button',
  preview: preview(collection, previewBackground),
  styles: {
    width,
    height: 52,
    backgroundColor,
    color,
    borderRadius: radius,
    borderWidth: 1,
    borderColor,
    opacity: 1,
    padding: '0 20px',
  },
  content: text,
  specificSettings: {
    text,
    type: 'button',
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: 900,
    hoverBackground: color === '#111827' ? '#D6F854' : '#111827',
    hoverColor: color === '#111827' ? '#111827' : '#D6F854',
    ...shadow({ shadowEnabled: false }),
    ...specific,
  },
  animations: animations(motion),
});

const inputItem = ({
  id,
  name,
  collection,
  motionStyle,
  intensity,
  tags,
  placeholder,
  width = 268,
  radius = 16,
  motion,
}) => ({
  ...meta({
    id,
    name,
    category: 'Input',
    collection,
    motionStyle,
    intensity,
    tags,
    displayType: 'Input',
  }),
  type: 'input',
  tag: 'input',
  preview: preview(collection),
  styles: {
    width,
    height: 50,
    backgroundColor: '#FFFFFF',
    color: '#111827',
    borderRadius: radius,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    opacity: 1,
    padding: '0 18px',
  },
  content: null,
  specificSettings: {
    inputType: 'text',
    placeholder,
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: 700,
    focusBorderColor: '#111827',
    ...shadow({ shadowBlur: 20, shadowOffsetY: 8, shadowOpacity: 0.08 }),
  },
  animations: animations(motion),
});

const textItem = ({
  id,
  name,
  collection,
  motionStyle,
  intensity,
  tags,
  content,
  tag = 'h2',
  fontSize = 32,
  weight = 900,
  color = '#111827',
  width = 292,
  motion,
}) => ({
  ...meta({
    id,
    name,
    category: 'Typography',
    collection,
    motionStyle,
    intensity,
    tags,
    displayType: 'Typography',
  }),
  type: 'text',
  tag,
  preview: preview(collection),
  styles: {
    width,
    height: 'auto',
    backgroundColor: 'transparent',
    color,
    borderWidth: 0,
    borderColor: 'transparent',
    opacity: 1,
    padding: 0,
  },
  content,
  specificSettings: {
    content,
    tag,
    fontFamily: 'Inter',
    fontSize,
    fontWeight: weight,
    textAlign: 'center',
    lineHeight: tag === 'p' ? 1.5 : 1.08,
    letterSpacing: 0,
    textTransform: 'none',
  },
  animations: animations(motion),
});

const imageItem = ({
  id,
  name,
  collection,
  motionStyle,
  intensity,
  tags,
  src,
  alt,
  width = 286,
  height = 184,
  motion,
}) => ({
  ...meta({
    id,
    name,
    category: 'Image',
    collection,
    motionStyle,
    intensity,
    tags,
    displayType: 'Image',
  }),
  type: 'image',
  tag: 'img',
  preview: preview(collection, '#111827'),
  styles: {
    width,
    height,
    backgroundColor: '#111827',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    opacity: 1,
  },
  content: null,
  specificSettings: {
    src,
    alt,
    objectFit: 'cover',
    objectPosition: 'center',
    ...shadow({ shadowBlur: 30, shadowOffsetY: 14, shadowOpacity: 0.16 }),
  },
  animations: animations(motion),
});

const templateItem = ({
  id,
  name,
  collection,
  motionStyle,
  intensity,
  tags,
  code,
  previewBackground = '#F9FAFB',
}) => ({
  ...meta({
    id,
    name,
    category: 'Layout',
    collection,
    motionStyle,
    intensity,
    libraryKind: 'template',
    tags,
    displayType: 'Layout',
  }),
  type: 'block',
  tag: 'div',
  preview: preview(collection, previewBackground),
  styles: {
    width: 286,
    height: 176,
    backgroundColor: '#FFFFFF',
    color: '#111827',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    opacity: 1,
    padding: 24,
  },
  content: null,
  specificSettings: {
    alignX: 'center',
    alignY: 'center',
    gap: 12,
    overflow: 'visible',
    ...shadow({ shadowBlur: 24, shadowOffsetY: 10, shadowOpacity: 0.1 }),
  },
  animations: animations({
    load: { presetId: 'fade', duration: 420 },
  }),
  ...code,
});

export const libraryItems = [
  buttonItem({
    id: 'minimal-soft-fade-button',
    name: 'Soft Fade Button',
    collection: 'Minimal',
    motionStyle: 'Mixed',
    intensity: 'Subtle',
    tags: ['Fade', 'Button', 'Minimal'],
    text: 'Continue',
    backgroundColor: '#FFFFFF',
    color: '#111827',
    borderColor: '#E5E7EB',
    motion: {
      load: { presetId: 'fade', duration: 420, easing: 'ease-out' },
      hover: { presetId: 'magneticHover', duration: 220, intensity: 14 },
      click: { presetId: 'pressEffect', duration: 120, intensity: 48 },
    },
  }),
  inputItem({
    id: 'minimal-input',
    name: 'Minimal Input',
    collection: 'Minimal',
    motionStyle: 'Hover',
    intensity: 'Subtle',
    tags: ['Input', 'Form', 'Minimal'],
    placeholder: 'Search workspace',
    radius: 999,
    motion: {
      load: { presetId: 'fade', duration: 360 },
      hover: { presetId: 'borderSlide', duration: 240 },
    },
  }),
  {
    ...meta({
      id: 'minimal-quiet-link-hover',
      name: 'Quiet Link Hover',
      category: 'Typography',
      collection: 'Minimal',
      motionStyle: 'Hover',
      intensity: 'Subtle',
      tags: ['Link', 'Underline', 'Minimal'],
      displayType: 'Typography',
    }),
    type: 'link',
    tag: 'a',
    preview: preview('Minimal'),
    styles: {
      width: 'auto',
      height: 'auto',
      backgroundColor: 'transparent',
      color: '#111827',
      borderWidth: 0,
      borderColor: 'transparent',
      opacity: 1,
      padding: 0,
    },
    content: 'Read the notes',
    specificSettings: {
      text: 'Read the notes',
      href: '#',
      underline: 'hover',
      fontFamily: 'Inter',
      fontSize: 16,
      fontWeight: 900,
      hoverColor: '#111827',
    },
    animations: animations({
      load: { presetId: 'fade', duration: 360 },
      hover: { presetId: 'underlineDraw', duration: 260 },
    }),
  },
  textItem({
    id: 'minimal-editorial-paragraph',
    name: 'Editorial Paragraph',
    collection: 'Minimal',
    motionStyle: 'Load',
    intensity: 'Subtle',
    tags: ['Paragraph', 'Editorial', 'Fade'],
    tag: 'p',
    fontSize: 17,
    weight: 700,
    width: 286,
    color: '#6B7280',
    content: 'Small motion can make a quiet interface feel considered.',
    motion: {
      load: { presetId: 'fadeByWord', duration: 520, intensity: 26 },
    },
  }),
  templateItem({
    id: 'minimal-hero-surface',
    name: 'Minimal Hero Surface',
    collection: 'Minimal',
    motionStyle: 'Load',
    intensity: 'Subtle',
    tags: ['Hero', 'Minimal', 'Layout'],
    code: templateCode.bentoFeatureBlock,
  }),

  buttonItem({
    id: 'interactive-magnetic-cta',
    name: 'Magnetic CTA',
    collection: 'Interactive',
    motionStyle: 'Mixed',
    intensity: 'Bold',
    tags: ['CTA', 'Magnetic', 'Interactive'],
    text: 'Start building',
    width: 210,
    motion: {
      load: { presetId: 'scale', duration: 420, intensity: 44 },
      hover: { presetId: 'magneticHover', duration: 240, intensity: 42 },
      click: { presetId: 'ripple', duration: 420 },
    },
  }),
  buttonItem({
    id: 'interactive-glow-hover-button',
    name: 'Glow Hover Button',
    collection: 'Interactive',
    motionStyle: 'Mixed',
    intensity: 'Bold',
    tags: ['Glow', 'Button', 'Hover'],
    text: 'Launch',
    width: 174,
    backgroundColor: '#111827',
    color: '#D6F854',
    borderColor: '#111827',
    specific: shadow({
      shadowColor: '#D6F854',
      shadowBlur: 26,
      shadowOffsetY: 0,
      shadowOpacity: 0.2,
    }),
    motion: {
      load: { presetId: 'slide', duration: 440, direction: 'bottom', intensity: 22 },
      hover: { presetId: 'glowHover', duration: 260, intensity: 58 },
      click: { presetId: 'pressEffect', duration: 120, intensity: 78 },
    },
  }),
  templateItem({
    id: 'interactive-press-card',
    name: 'Press Card',
    collection: 'Interactive',
    motionStyle: 'Mixed',
    intensity: 'Medium',
    tags: ['Card', 'Press', 'Interactive'],
    code: templateCode.pressCard,
  }),
  buttonItem({
    id: 'interactive-ripple-action-button',
    name: 'Ripple Action Button',
    collection: 'Interactive',
    motionStyle: 'Click',
    intensity: 'Medium',
    tags: ['Ripple', 'Action', 'Button'],
    text: 'Confirm',
    width: 176,
    backgroundColor: '#D6F854',
    color: '#111827',
    borderColor: '#D6F854',
    motion: {
      load: { presetId: 'fade', duration: 360 },
      hover: { presetId: 'magneticHover', duration: 220, intensity: 22 },
      click: { presetId: 'ripple', duration: 460 },
    },
  }),
  imageItem({
    id: 'interactive-tilt-media-card',
    name: 'Tilt Media Card',
    collection: 'Interactive',
    motionStyle: 'Hover',
    intensity: 'Medium',
    tags: ['Tilt', 'Image', 'Hover'],
    src: 'https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa?q=80&w=900&auto=format&fit=crop',
    alt: 'Design materials on a desk',
    motion: {
      load: { presetId: 'fade', duration: 420 },
      hover: { presetId: 'tiltHover', duration: 280, rotationAngle: 5, hoverDepth: 18 },
    },
  }),

  textItem({
    id: 'cinematic-blur-reveal-hero',
    name: 'Blur Reveal Hero',
    collection: 'Cinematic',
    motionStyle: 'Load',
    intensity: 'Bold',
    tags: ['Hero', 'Blur', 'Reveal'],
    content: 'A sharper first impression',
    fontSize: 36,
    motion: {
      load: { presetId: 'blurReveal', duration: 820, blurAmount: 5, stagger: 76 },
    },
  }),
  imageItem({
    id: 'cinematic-ken-burns-image-card',
    name: 'Ken Burns Image Card',
    collection: 'Cinematic',
    motionStyle: 'Loop',
    intensity: 'Medium',
    tags: ['Ken Burns', 'Image', 'Loop'],
    src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=900&auto=format&fit=crop',
    alt: 'Sunlit interior lounge',
    motion: {
      load: { presetId: 'kenBurns', duration: 1200, zoomIntensity: 42 },
    },
  }),
  templateItem({
    id: 'cinematic-floating-glass-panel',
    name: 'Floating Glass Panel',
    collection: 'Cinematic',
    motionStyle: 'Loop',
    intensity: 'Medium',
    tags: ['Panel', 'Floating', 'Glass'],
    code: templateCode.floatingGlassPanel,
  }),
  templateItem({
    id: 'cinematic-parallax-media-block',
    name: 'Parallax Media Block',
    collection: 'Cinematic',
    motionStyle: 'Mixed',
    intensity: 'Bold',
    tags: ['Media', 'Parallax', 'Hover'],
    code: templateCode.parallaxMediaBlock,
    previewBackground: '#111827',
  }),
  imageItem({
    id: 'cinematic-zoom-reveal-frame',
    name: 'Zoom Reveal Frame',
    collection: 'Cinematic',
    motionStyle: 'Mixed',
    intensity: 'Bold',
    tags: ['Zoom', 'Reveal', 'Image'],
    src: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=900&auto=format&fit=crop',
    alt: 'Architectural forms',
    motion: {
      load: { presetId: 'zoomReveal', duration: 760, zoomIntensity: 48 },
      hover: { presetId: 'hoverBrightness', duration: 260, intensity: 44 },
    },
  }),

  textItem({
    id: 'editorial-typewriter-heading',
    name: 'Typewriter Heading',
    collection: 'Editorial',
    motionStyle: 'Load',
    intensity: 'Medium',
    tags: ['Typewriter', 'Heading', 'Editorial'],
    content: 'Words arrive with rhythm',
    fontSize: 30,
    motion: {
      load: { presetId: 'typewriter', duration: 900, stagger: 38 },
    },
  }),
  textItem({
    id: 'editorial-fade-by-word-quote',
    name: 'Fade By Word Quote',
    collection: 'Editorial',
    motionStyle: 'Mixed',
    intensity: 'Medium',
    tags: ['Quote', 'Words', 'Fade'],
    tag: 'p',
    fontSize: 19,
    width: 296,
    content: 'Motion gives language a sense of pacing and intent.',
    motion: {
      load: { presetId: 'fadeByWord', duration: 660, intensity: 54 },
      hover: { presetId: 'fadeByWord', duration: 420, intensity: 30 },
    },
  }),
  {
    ...meta({
      id: 'editorial-underline-reveal-link',
      name: 'Underline Reveal Link',
      category: 'Typography',
      collection: 'Editorial',
      motionStyle: 'Hover',
      intensity: 'Subtle',
      tags: ['Link', 'Underline', 'Editorial'],
      displayType: 'Typography',
    }),
    type: 'link',
    tag: 'a',
    preview: preview('Editorial'),
    styles: {
      width: 'auto',
      height: 'auto',
      backgroundColor: 'transparent',
      color: '#111827',
      borderWidth: 0,
      borderColor: 'transparent',
      opacity: 1,
      padding: 0,
    },
    content: 'Explore the essay',
    specificSettings: {
      text: 'Explore the essay',
      href: '#',
      underline: 'hover',
      fontFamily: 'Inter',
      fontSize: 16,
      fontWeight: 900,
      hoverColor: '#111827',
    },
    animations: animations({
      load: { presetId: 'fade', duration: 360 },
      hover: { presetId: 'underlineDraw', duration: 300 },
    }),
  },
  textItem({
    id: 'editorial-stagger-title',
    name: 'Stagger Title',
    collection: 'Editorial',
    motionStyle: 'Load',
    intensity: 'Bold',
    tags: ['Stagger', 'Title', 'Editorial'],
    content: 'Systems for animated reading',
    fontSize: 34,
    motion: {
      load: { presetId: 'slideUpReveal', duration: 720, stagger: 80 },
      hover: { presetId: 'underlineDraw', duration: 280 },
    },
  }),
  textItem({
    id: 'editorial-blur-caption',
    name: 'Blur Caption',
    collection: 'Editorial',
    motionStyle: 'Load',
    intensity: 'Subtle',
    tags: ['Caption', 'Blur', 'Editorial'],
    tag: 'p',
    fontSize: 14,
    weight: 800,
    color: '#6B7280',
    content: 'A soft reveal for supporting context.',
    motion: {
      load: { presetId: 'blurReveal', duration: 560, blurAmount: 3, stagger: 42 },
    },
  }),

  templateItem({
    id: 'modern-dashboard-card',
    name: 'Dashboard Card',
    collection: 'Modern UI',
    motionStyle: 'Loop',
    intensity: 'Medium',
    tags: ['Dashboard', 'Stats', 'Loop'],
    code: templateCode.dashboardCard,
  }),
  templateItem({
    id: 'modern-bento-feature-block',
    name: 'Bento Feature Block',
    collection: 'Modern UI',
    motionStyle: 'Mixed',
    intensity: 'Medium',
    tags: ['Bento', 'Feature', 'Hover'],
    code: templateCode.bentoFeatureBlock,
  }),
  templateItem({
    id: 'modern-floating-stat-panel',
    name: 'Floating Stat Panel',
    collection: 'Modern UI',
    motionStyle: 'Loop',
    intensity: 'Medium',
    tags: ['Stats', 'Panel', 'Floating'],
    code: templateCode.floatingStatPanel,
  }),
  inputItem({
    id: 'modern-premium-form-input',
    name: 'Premium Form Input',
    collection: 'Modern UI',
    motionStyle: 'Mixed',
    intensity: 'Medium',
    tags: ['Input', 'Premium', 'Focus'],
    placeholder: 'team@animadiv.app',
    width: 282,
    motion: {
      load: { presetId: 'slide', duration: 480, direction: 'bottom', intensity: 22 },
      hover: { presetId: 'focusGlow', duration: 240 },
      click: { presetId: 'errorShake', duration: 280 },
    },
  }),
  buttonItem({
    id: 'modern-soft-press-button',
    name: 'Soft Press Button',
    collection: 'Modern UI',
    motionStyle: 'Click',
    intensity: 'Subtle',
    tags: ['Press', 'Button', 'Micro'],
    text: 'Save changes',
    width: 184,
    backgroundColor: '#FFFFFF',
    color: '#111827',
    borderColor: '#E5E7EB',
    motion: {
      load: { presetId: 'fade', duration: 360 },
      hover: { presetId: 'glowHover', duration: 220, intensity: 20 },
      click: { presetId: 'pressEffect', duration: 120, intensity: 84 },
    },
  }),
];
