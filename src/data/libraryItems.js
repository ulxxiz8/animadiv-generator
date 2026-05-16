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

const preview = (theme, background, accent = '#D6F854') => ({
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

const imgOffice =
  'https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=900&auto=format&fit=crop';
const imgInterior =
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=900&auto=format&fit=crop';
const imgAbstract =
  'https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=900&auto=format&fit=crop';
const imgDesk =
  'https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa?q=80&w=900&auto=format&fit=crop';
const imgStudio =
  'https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=900&auto=format&fit=crop';
const imgNature =
  'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=900&auto=format&fit=crop';

const buttonItem = ({
  id,
  name,
  collection,
  motionStyle = 'Mixed',
  intensity = 'Medium',
  tags = [],
  text,
  width = 196,
  height = 54,
  background,
  backgroundColor,
  color = '#111827',
  borderColor = 'transparent',
  radius = 999,
  previewBackground,
  previewAccent,
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
  preview: preview(collection, previewBackground, previewAccent),
  styles: {
    width,
    height,
    background,
    backgroundColor: backgroundColor || color,
    color,
    borderRadius: radius,
    borderWidth: borderColor === 'transparent' ? 0 : 1,
    borderColor,
    opacity: 1,
    padding: '0 22px',
  },
  content: text,
  specificSettings: {
    text,
    type: 'button',
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: 900,
    hoverBackground: specific.hoverBackground || backgroundColor || '#111827',
    hoverColor: specific.hoverColor || color,
    ...shadow({ shadowEnabled: false }),
    ...specific,
  },
  animations: animations(motion),
});

const textItem = ({
  id,
  name,
  collection,
  motionStyle = 'Load',
  intensity = 'Medium',
  tags = [],
  content,
  tag = 'h2',
  fontSize = 32,
  weight = 900,
  color = '#111827',
  width = 304,
  previewBackground,
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
  preview: preview(collection, previewBackground),
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
    letterSpacing: -0.2,
    textTransform: 'none',
  },
  animations: animations(motion),
});

const linkItem = ({ id, name, collection, content, previewBackground, motion }) => ({
  ...meta({
    id,
    name,
    category: 'Link',
    collection,
    motionStyle: 'Hover',
    intensity: 'Subtle',
    tags: ['Link', 'Micro', 'Hover'],
    displayType: 'Link',
  }),
  type: 'link',
  tag: 'a',
  preview: preview(collection, previewBackground),
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
  content,
  specificSettings: {
    text: content,
    href: '#',
    underline: 'hover',
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: 900,
    hoverColor: '#111827',
  },
  animations: animations(motion),
});

const inputItem = ({
  id,
  name,
  collection,
  motionStyle = 'Mixed',
  intensity = 'Medium',
  tags = [],
  type = 'input',
  placeholder,
  width = 284,
  height = 52,
  backgroundColor = '#FFFFFF',
  color = '#111827',
  borderColor = '#E5E7EB',
  radius = 18,
  previewBackground,
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
    displayType: type === 'textarea' ? 'Textarea' : 'Input',
  }),
  type,
  tag: type === 'textarea' ? 'textarea' : 'input',
  preview: preview(collection, previewBackground),
  styles: {
    width,
    height,
    backgroundColor,
    color,
    borderRadius: radius,
    borderWidth: 1,
    borderColor,
    opacity: 1,
    padding: type === 'textarea' ? '14px 16px' : '0 18px',
  },
  content: null,
  specificSettings: {
    inputType: 'text',
    placeholder,
    rows: 4,
    resize: 'vertical',
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: 800,
    focusBorderColor: borderColor,
    ...shadow({ shadowBlur: 22, shadowOffsetY: 10, shadowOpacity: 0.1 }),
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
  previewBackground,
  radius = 26,
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
  preview: preview(collection, previewBackground),
  styles: {
    width: 292,
    height: 190,
    backgroundColor: '#111827',
    borderRadius: radius,
    borderWidth: 0,
    borderColor: 'transparent',
    opacity: 1,
  },
  content: null,
  specificSettings: {
    src,
    alt,
    objectFit: 'cover',
    objectPosition: 'center',
    ...shadow({ shadowBlur: 34, shadowOffsetY: 16, shadowOpacity: 0.2 }),
  },
  animations: animations(motion),
});

const blockItem = ({
  id,
  name,
  collection,
  motionStyle,
  intensity,
  tags,
  previewKicker,
  previewTitle,
  previewMeta,
  background,
  backgroundColor,
  color,
  borderColor = 'transparent',
  previewBackground,
  motion,
}) => ({
  ...meta({
    id,
    name,
    category: 'Layout',
    collection,
    motionStyle,
    intensity,
    tags,
    displayType: 'Layout',
  }),
  type: 'block',
  tag: 'div',
  preview: preview(collection, previewBackground),
  styles: {
    width: 292,
    height: 178,
    background,
    backgroundColor,
    color,
    borderRadius: 28,
    borderWidth: borderColor === 'transparent' ? 0 : 1,
    borderColor,
    opacity: 1,
    padding: 26,
  },
  content: null,
  specificSettings: {
    alignX: 'center',
    alignY: 'center',
    gap: 12,
    overflow: 'visible',
    previewKicker,
    previewTitle,
    previewMeta,
    ...shadow({ shadowBlur: 30, shadowOffsetY: 14, shadowOpacity: 0.14 }),
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
  previewBackground,
  templateHtml,
  templateCss,
}) => ({
  ...meta({
    id,
    name,
    category: 'Template',
    collection,
    motionStyle,
    intensity,
    libraryKind: 'template',
    tags,
    displayType: 'Template',
  }),
  type: 'block',
  tag: 'div',
  preview: preview(collection, previewBackground),
  styles: {
    width: 292,
    height: 178,
    backgroundColor: '#FFFFFF',
    color: '#111827',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    opacity: 1,
    padding: 26,
  },
  content: null,
  specificSettings: {
    alignX: 'center',
    alignY: 'center',
    gap: 12,
    overflow: 'visible',
  },
  animations: animations({ load: { presetId: 'fade', duration: 420 } }),
  templateHtml,
  templateCss,
});

const signalTemplate = (className, { title, kicker, value, bg, accent, text }) => ({
  templateHtml: `<article class="animadiv-template ${className}">
  <span>${kicker}</span>
  <strong>${value}</strong>
  <h2>${title}</h2>
  <p>${text}</p>
  <i></i><i></i>
</article>`,
  templateCss: `.animadiv-template.${className} {
  width: 320px;
  min-height: 220px;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  padding: 30px;
  border-radius: 30px;
  color: ${bg === '#111827' ? '#FFFFFF' : '#111827'};
  background: ${bg};
  box-shadow: 0 24px 60px rgba(17,24,39,.18);
  animation: ${className}-in 720ms cubic-bezier(.16,1,.3,1) both;
  transition: transform 260ms ease, box-shadow 260ms ease;
}
.${className} span { color: ${accent}; font: 900 10px/1 Inter, system-ui, sans-serif; letter-spacing: 1.5px; }
.${className} strong { display:inline-flex; margin-top:16px; height:34px; align-items:center; padding:0 12px; border-radius:999px; color:#111827; background:${accent}; font:900 13px/1 Inter, system-ui, sans-serif; }
.${className} h2 { margin:22px 0 8px; max-width:230px; font:900 31px/1.04 Inter, system-ui, sans-serif; letter-spacing:-.01em; }
.${className} p { margin:0; max-width:220px; color:${bg === '#111827' ? 'rgba(255,255,255,.7)' : '#6B7280'}; font:700 13px/1.5 Inter, system-ui, sans-serif; }
.${className} i { position:absolute; display:block; border-radius:999px; background:${accent}; opacity:.34; animation:${className}-float 3.6s ease-in-out infinite; }
.${className} i:nth-of-type(1){ width:92px;height:92px;right:-26px;top:28px; }
.${className} i:nth-of-type(2){ width:36px;height:120px;left:28px;bottom:-34px;animation-delay:360ms; }
.animadiv-template.${className}:hover { transform: translateY(-8px); box-shadow:0 30px 70px rgba(17,24,39,.22); }
@keyframes ${className}-in { from { opacity:0; transform:translateY(22px) scale(.96); filter:blur(10px); } to { opacity:1; transform:translateY(0) scale(1); filter:blur(0); } }
@keyframes ${className}-float { 0%,100% { transform:translateY(0) scale(1); } 50% { transform:translateY(-14px) scale(1.08); } }`,
});

export const libraryItems = [
  // 8 buttons
  buttonItem({
    id: 'neon-glow-cta',
    name: 'Neon Glow CTA',
    collection: 'Interactive',
    motionStyle: 'Mixed',
    intensity: 'Bold',
    tags: ['CTA', 'Hero', 'Glow'],
    text: 'Launch now',
    background: 'linear-gradient(135deg, #1b1534 0%, #571c7a 48%, #11f5c6 100%)',
    backgroundColor: '#571c7a',
    color: '#ffffff',
    previewBackground:
      'radial-gradient(circle at 20% 10%, rgba(17,245,198,.42), transparent 32%), linear-gradient(135deg,#08070f,#16112c 58%,#26113b)',
    previewAccent: '#11f5c6',
    motion: {
      load: { presetId: 'scale', duration: 460, intensity: 70 },
      hover: { presetId: 'glowHover', duration: 260, intensity: 76 },
      click: { presetId: 'pressEffect', duration: 120, intensity: 90 },
    },
  }),
  buttonItem({
    id: 'peach-ripple-button',
    name: 'Peach Ripple Button',
    collection: 'Interactive',
    motionStyle: 'Click',
    intensity: 'Medium',
    tags: ['Ripple', 'Button', 'Peach'],
    text: 'Reserve seat',
    background: 'linear-gradient(135deg,#ff9a8b,#ff6a88)',
    backgroundColor: '#ff7a8a',
    color: '#321017',
    previewBackground: 'linear-gradient(135deg,#fff4ef,#ffe1d6)',
    previewAccent: '#ff6a88',
    motion: {
      load: { presetId: 'slide', duration: 460, direction: 'bottom', intensity: 28 },
      hover: { presetId: 'magneticHover', duration: 240, intensity: 24 },
      click: { presetId: 'ripple', duration: 460 },
    },
  }),
  buttonItem({
    id: 'fresh-green-button',
    name: 'Fresh Green Button',
    collection: 'Modern UI',
    motionStyle: 'Mixed',
    intensity: 'Medium',
    tags: ['Button', 'Fresh', 'CTA'],
    text: 'Grow plan',
    backgroundColor: '#b7f66a',
    color: '#13210d',
    borderColor: '#7bd83d',
    previewBackground: 'linear-gradient(135deg,#f5ffe8,#d9ffc2)',
    previewAccent: '#7bd83d',
    motion: {
      load: { presetId: 'fade', duration: 360 },
      hover: { presetId: 'glowHover', duration: 240, intensity: 46 },
      click: { presetId: 'pressEffect', duration: 120, intensity: 78 },
    },
  }),
  buttonItem({
    id: 'warm-minimal-button',
    name: 'Warm Minimal Button',
    collection: 'Minimal',
    motionStyle: 'Hover',
    intensity: 'Subtle',
    tags: ['Minimal', 'Warm', 'Button'],
    text: 'View story',
    backgroundColor: '#fff8ec',
    color: '#3f2d1f',
    borderColor: '#e7d5bd',
    previewBackground: '#fbf1df',
    previewAccent: '#c97833',
    motion: {
      load: { presetId: 'fade', duration: 360 },
      hover: { presetId: 'magneticHover', duration: 240, intensity: 16 },
      click: { presetId: 'pressEffect', duration: 110, intensity: 44 },
    },
  }),
  buttonItem({
    id: 'cyan-depth-button',
    name: 'Cyan Depth Button',
    collection: 'Interactive',
    motionStyle: 'Mixed',
    intensity: 'Bold',
    tags: ['Cyan', 'Depth', 'Button'],
    text: 'Sync data',
    background: 'linear-gradient(135deg,#0ea5e9,#22d3ee)',
    backgroundColor: '#0ea5e9',
    color: '#03151f',
    previewBackground: 'linear-gradient(135deg,#071826,#0b3442)',
    previewAccent: '#22d3ee',
    motion: {
      load: { presetId: 'scale', duration: 430, intensity: 58 },
      hover: { presetId: 'glowHover', duration: 240, intensity: 66 },
      click: { presetId: 'ripple', duration: 420 },
    },
  }),
  buttonItem({
    id: 'deep-orange-press-button',
    name: 'Deep Orange Press Button',
    collection: 'Interactive',
    motionStyle: 'Click',
    intensity: 'Bold',
    tags: ['Press', 'Orange', 'Action'],
    text: 'Publish',
    backgroundColor: '#f97316',
    color: '#fff7ed',
    previewBackground: 'linear-gradient(135deg,#2b1206,#7c2d12)',
    previewAccent: '#fb923c',
    motion: {
      load: { presetId: 'blurReveal', duration: 520, blurAmount: 4 },
      hover: { presetId: 'magneticHover', duration: 240, intensity: 28 },
      click: { presetId: 'pressEffect', duration: 120, intensity: 92 },
    },
  }),
  buttonItem({
    id: 'glass-pill-button',
    name: 'Glass Pill Button',
    collection: 'Cinematic',
    motionStyle: 'Mixed',
    intensity: 'Medium',
    tags: ['Glass', 'Button', 'Hover'],
    text: 'Open panel',
    backgroundColor: 'rgba(255,255,255,.56)',
    color: '#1f2937',
    borderColor: 'rgba(255,255,255,.72)',
    previewBackground: 'linear-gradient(135deg,#dbeafe,#f5d0fe)',
    previewAccent: '#ffffff',
    specific: shadow({ shadowColor: '#7c3aed', shadowBlur: 30, shadowOffsetY: 14, shadowOpacity: 0.18 }),
    motion: {
      load: { presetId: 'slide', duration: 460, direction: 'bottom', intensity: 24 },
      hover: { presetId: 'glowHover', duration: 240, intensity: 36 },
      click: { presetId: 'pressEffect', duration: 110, intensity: 56 },
    },
  }),
  buttonItem({
    id: 'editorial-black-button',
    name: 'Editorial Black Button',
    collection: 'Editorial',
    motionStyle: 'Hover',
    intensity: 'Subtle',
    tags: ['Editorial', 'Button', 'Black'],
    text: 'Read essay',
    backgroundColor: '#111111',
    color: '#f7efe3',
    previewBackground: '#efe4d3',
    previewAccent: '#111111',
    motion: {
      load: { presetId: 'fade', duration: 360 },
      hover: { presetId: 'magneticHover', duration: 260, intensity: 18 },
      click: { presetId: 'pressEffect', duration: 110, intensity: 52 },
    },
  }),

  // 6 typography
  textItem({
    id: 'gradient-hero-title',
    name: 'Animated Gradient Hero Title',
    collection: 'Cinematic',
    motionStyle: 'Load',
    intensity: 'Bold',
    tags: ['Hero', 'Gradient', 'Title'],
    content: 'Motion that feels alive',
    fontSize: 35,
    color: '#ffffff',
    previewBackground: 'linear-gradient(135deg,#ff6a88,#7c3aed 54%,#22d3ee)',
    motion: { load: { presetId: 'blurReveal', duration: 780, blurAmount: 5, stagger: 72 }, hover: { presetId: 'fadeByWord', duration: 260, stagger: 22 } },
  }),
  textItem({
    id: 'typewriter-heading',
    name: 'Typewriter Heading',
    collection: 'Editorial',
    motionStyle: 'Load',
    intensity: 'Medium',
    tags: ['Typewriter', 'Heading', 'Editorial'],
    content: 'The story types itself',
    fontSize: 30,
    previewBackground: '#f5ead8',
    motion: { load: { presetId: 'typewriter', duration: 900, stagger: 38 }, hover: { presetId: 'underlineDraw', duration: 260 } },
  }),
  textItem({
    id: 'fade-word-quote',
    name: 'Fade By Word Quote',
    collection: 'Editorial',
    motionStyle: 'Mixed',
    intensity: 'Medium',
    tags: ['Quote', 'Words', 'Fade'],
    tag: 'p',
    fontSize: 20,
    width: 300,
    color: '#3b2f2f',
    content: 'Good motion gives interface language a pulse.',
    previewBackground: 'linear-gradient(135deg,#fff7ed,#ffe4e6)',
    motion: { load: { presetId: 'fadeByWord', duration: 640, intensity: 56 }, hover: { presetId: 'fadeByWord', duration: 360, intensity: 30 } },
  }),
  textItem({
    id: 'neon-word-title',
    name: 'Neon Word Title',
    collection: 'Interactive',
    motionStyle: 'Load',
    intensity: 'Bold',
    tags: ['Neon', 'Title', 'Words'],
    content: 'Signal in the dark',
    fontSize: 34,
    color: '#7fffd4',
    previewBackground: '#07111f',
    motion: { load: { presetId: 'fadeByWord', duration: 620, stagger: 60 }, hover: { presetId: 'blurReveal', duration: 260, blurAmount: 2 } },
  }),
  textItem({
    id: 'soft-caption',
    name: 'Soft Pastel Caption',
    collection: 'Minimal',
    motionStyle: 'Load',
    intensity: 'Subtle',
    tags: ['Caption', 'Pastel', 'Fade'],
    tag: 'p',
    fontSize: 15,
    weight: 800,
    color: '#6f5870',
    content: 'A small note with a gentle entrance.',
    previewBackground: '#f9e7f0',
    motion: { load: { presetId: 'blurReveal', duration: 520, blurAmount: 3 }, hover: { presetId: 'fadeByWord', duration: 240, stagger: 18 } },
  }),
  textItem({
    id: 'stagger-title',
    name: 'Stagger Title',
    collection: 'Editorial',
    motionStyle: 'Load',
    intensity: 'Bold',
    tags: ['Stagger', 'Title', 'Editorial'],
    content: 'Systems for animated reading',
    fontSize: 32,
    previewBackground: '#fffaf0',
    motion: { load: { presetId: 'slideUpReveal', duration: 720, stagger: 80 }, hover: { presetId: 'underlineDraw', duration: 280 } },
  }),

  // 6 images / cards
  imageItem({ id: 'cinematic-image-reveal', name: 'Cinematic Image Reveal', collection: 'Cinematic', motionStyle: 'Mixed', intensity: 'Bold', tags: ['Hero', 'Image', 'Reveal'], src: imgAbstract, alt: 'Abstract architecture', previewBackground: 'linear-gradient(135deg,#0f172a,#312e81)', motion: { load: { presetId: 'zoomReveal', duration: 760, zoomIntensity: 50 }, hover: { presetId: 'hoverBrightness', duration: 260, intensity: 48 } } }),
  imageItem({ id: 'ken-burns-card', name: 'Ken Burns Image Card', collection: 'Cinematic', motionStyle: 'Loop', intensity: 'Medium', tags: ['Ken Burns', 'Image', 'Loop'], src: imgInterior, alt: 'Interior', previewBackground: '#111827', motion: { load: { presetId: 'kenBurns', duration: 1600, zoomIntensity: 30 }, hover: { presetId: 'hoverBrightness', duration: 260 } } }),
  imageItem({ id: 'tilt-media-card', name: 'Tilt Media Card', collection: 'Interactive', motionStyle: 'Hover', intensity: 'Medium', tags: ['Tilt', 'Image', 'Hover'], src: imgDesk, alt: 'Desk', previewBackground: '#f0f9ff', motion: { load: { presetId: 'fade', duration: 420 }, hover: { presetId: 'tiltHover', duration: 280, rotationAngle: 5, hoverDepth: 18 } } }),
  imageItem({ id: 'floating-nature-card', name: 'Floating Nature Card', collection: 'Cinematic', motionStyle: 'Loop', intensity: 'Medium', tags: ['Floating', 'Image', 'Loop'], src: imgNature, alt: 'Nature', previewBackground: '#ecfdf5', motion: { load: { presetId: 'floatingImage', duration: 1600, floatingAmount: 18 }, hover: { presetId: 'tiltHover', duration: 260, rotationAngle: 4 } } }),
  imageItem({ id: 'warm-editorial-image', name: 'Warm Editorial Image', collection: 'Editorial', motionStyle: 'Load', intensity: 'Subtle', tags: ['Image', 'Warm', 'Editorial'], src: imgOffice, alt: 'Workspace', previewBackground: '#f5ead8', motion: { load: { presetId: 'zoomReveal', duration: 620, zoomIntensity: 26 }, hover: { presetId: 'hoverBrightness', duration: 260 } } }),
  imageItem({ id: 'cyan-blur-card', name: 'Cyan Blur Card', collection: 'Interactive', motionStyle: 'Mixed', intensity: 'Bold', tags: ['Cyan', 'Blur', 'Image'], src: imgStudio, alt: 'Studio', previewBackground: 'linear-gradient(135deg,#071826,#0e7490)', motion: { load: { presetId: 'blurReveal', duration: 620, blurAmount: 5 }, hover: { presetId: 'hoverBlur', duration: 260, blurAmount: 2 } } }),

  // 6 inputs / forms
  inputItem({ id: 'glass-form-input', name: 'Glass Form Input', collection: 'Modern UI', tags: ['Input', 'Glass', 'Focus'], placeholder: 'studio@motion.dev', backgroundColor: 'rgba(255,255,255,.72)', borderColor: 'rgba(255,255,255,.8)', previewBackground: 'linear-gradient(135deg,#dbeafe,#f5d0fe)', motion: { load: { presetId: 'slide', duration: 420, direction: 'bottom', intensity: 18 }, hover: { presetId: 'focusGlow', duration: 240 }, click: { presetId: 'errorShake', duration: 240 } } }),
  inputItem({ id: 'neon-search-input', name: 'Neon Search Input', collection: 'Interactive', tags: ['Input', 'Neon', 'Search'], placeholder: 'Search signals', backgroundColor: '#09111f', color: '#e0f2fe', borderColor: '#22d3ee', previewBackground: '#05101d', motion: { load: { presetId: 'fade', duration: 360 }, hover: { presetId: 'borderSlide', duration: 240 }, click: { presetId: 'errorShake', duration: 220 } } }),
  inputItem({ id: 'pastel-input', name: 'Pastel Signup Input', collection: 'Minimal', intensity: 'Subtle', tags: ['Input', 'Pastel', 'Signup'], placeholder: 'Your name', borderColor: '#ffc7d1', previewBackground: '#fff1f2', motion: { load: { presetId: 'scale', duration: 380, intensity: 24 }, hover: { presetId: 'focusGlow', duration: 220 }, click: { presetId: 'errorShake', duration: 220 } } }),
  inputItem({ id: 'green-filter-input', name: 'Fresh Filter Input', collection: 'Modern UI', intensity: 'Subtle', tags: ['Input', 'Filter', 'Green'], placeholder: 'Filter datasets', borderColor: '#86efac', previewBackground: '#ecfdf5', motion: { load: { presetId: 'fade', duration: 360 }, hover: { presetId: 'borderSlide', duration: 220 }, click: { presetId: 'errorShake', duration: 220 } } }),
  inputItem({ id: 'orange-note-textarea', name: 'Warm Note Textarea', collection: 'Editorial', type: 'textarea', tags: ['Textarea', 'Warm', 'Note'], placeholder: 'Write a launch note...', borderColor: '#fdba74', previewBackground: '#fff7ed', height: 118, motion: { load: { presetId: 'slide', duration: 420, direction: 'bottom', intensity: 18 }, hover: { presetId: 'focusGlow', duration: 220 }, click: { presetId: 'errorShake', duration: 220 } } }),
  inputItem({ id: 'dark-command-input', name: 'Dark Command Input', collection: 'Interactive', tags: ['Command', 'Input', 'Dark'], placeholder: 'Run /animate', backgroundColor: '#111827', color: '#ffffff', borderColor: '#D6F854', previewBackground: '#111827', motion: { load: { presetId: 'blurReveal', duration: 440, blurAmount: 3 }, hover: { presetId: 'focusGlow', duration: 240 }, click: { presetId: 'errorShake', duration: 220 } } }),

  // 6 layout blocks
  blockItem({ id: 'glass-floating-card', name: 'Glass Floating Card', collection: 'Cinematic', motionStyle: 'Loop', intensity: 'Medium', tags: ['Hero', 'Panel', 'Glass'], previewKicker: 'GLASS', previewTitle: 'Floating card', previewMeta: 'Looped drift', backgroundColor: 'rgba(255,255,255,.72)', color: '#111827', borderColor: 'rgba(255,255,255,.84)', previewBackground: 'linear-gradient(135deg,#e0f2fe,#fae8ff)', motion: { load: { presetId: 'floatingSection', duration: 1500, floatingAmount: 14 }, hover: { presetId: 'glowHover', duration: 240, intensity: 26 } } }),
  blockItem({ id: 'neon-cta-block', name: 'Neon CTA Block', collection: 'Interactive', motionStyle: 'Mixed', intensity: 'Bold', tags: ['Hero', 'CTA', 'Neon'], previewKicker: 'LIVE', previewTitle: 'Ship vivid motion', previewMeta: 'Hover activated', background: 'linear-gradient(135deg,#111827,#312e81)', backgroundColor: '#111827', color: '#ffffff', previewBackground: '#090c1b', motion: { load: { presetId: 'scale', duration: 520, intensity: 58 }, hover: { presetId: 'glowHover', duration: 260, intensity: 58 } } }),
  blockItem({ id: 'warm-stat-block', name: 'Warm Stat Block', collection: 'Modern UI', motionStyle: 'Load', intensity: 'Medium', tags: ['Stats', 'Warm', 'Block'], previewKicker: 'GROWTH', previewTitle: '+38%', previewMeta: 'This month', backgroundColor: '#fff7ed', color: '#431407', borderColor: '#fed7aa', previewBackground: '#ffedd5', motion: { load: { presetId: 'slide', duration: 520, direction: 'bottom', intensity: 26 }, hover: { presetId: 'glowHover', duration: 220, intensity: 22 } } }),
  blockItem({ id: 'pastel-feature-block', name: 'Pastel Feature Block', collection: 'Minimal', motionStyle: 'Mixed', intensity: 'Subtle', tags: ['Feature', 'Pastel', 'Block'], previewKicker: 'FEATURE', previewTitle: 'Soft surfaces', previewMeta: 'Gentle hover', backgroundColor: '#fff1f2', color: '#4c1d2f', borderColor: '#fecdd3', previewBackground: '#fdf2f8', motion: { load: { presetId: 'fade', duration: 420 }, hover: { presetId: 'magneticHover', duration: 220, intensity: 14 } } }),
  blockItem({ id: 'green-dashboard-block', name: 'Fresh Dashboard Block', collection: 'Modern UI', motionStyle: 'Loop', intensity: 'Medium', tags: ['Dashboard', 'Green', 'Loop'], previewKicker: 'ACTIVE', previewTitle: '12.8k', previewMeta: 'Users online', backgroundColor: '#dcfce7', color: '#052e16', borderColor: '#86efac', previewBackground: '#f0fdf4', motion: { load: { presetId: 'floatingSection', duration: 1600, floatingAmount: 10 }, hover: { presetId: 'glowHover', duration: 220, intensity: 24 } } }),
  blockItem({ id: 'editorial-layout-block', name: 'Editorial Layout Block', collection: 'Editorial', motionStyle: 'Load', intensity: 'Medium', tags: ['Editorial', 'Layout', 'Stagger'], previewKicker: 'ARTICLE', previewTitle: 'Reading rhythm', previewMeta: 'Stagger reveal', backgroundColor: '#f5ead8', color: '#1c1917', borderColor: '#d6c0a2', previewBackground: '#efe4d3', motion: { load: { presetId: 'staggerReveal', duration: 620, stagger: 110 }, hover: { presetId: 'magneticHover', duration: 240, intensity: 16 } } }),

  // 4 links/micro
  linkItem({ id: 'micro-underline-link', name: 'Micro Underline Link', collection: 'Minimal', content: 'View documentation', previewBackground: '#ffffff', motion: { load: { presetId: 'fade', duration: 320 }, hover: { presetId: 'underlineDraw', duration: 260 } } }),
  linkItem({ id: 'editorial-more-link', name: 'Editorial More Link', collection: 'Editorial', content: 'Continue reading', previewBackground: '#f5ead8', motion: { load: { presetId: 'fade', duration: 320 }, hover: { presetId: 'underlineDraw', duration: 300 } } }),
  linkItem({ id: 'neon-route-link', name: 'Neon Route Link', collection: 'Interactive', content: 'Enter system', previewBackground: '#07111f', motion: { load: { presetId: 'blurReveal', duration: 420, blurAmount: 3 }, hover: { presetId: 'underlineDraw', duration: 280 } } }),
  linkItem({ id: 'pastel-nav-link', name: 'Pastel Nav Link', collection: 'Modern UI', content: 'Open workspace', previewBackground: '#fdf2f8', motion: { load: { presetId: 'slide', duration: 360, direction: 'bottom', intensity: 14 }, hover: { presetId: 'underlineDraw', duration: 260 } } }),

  // 4 templates/showcase compositions
  templateItem({
    id: 'gradient-hero-template',
    name: 'Gradient Hero Template',
    collection: 'Cinematic',
    motionStyle: 'Mixed',
    intensity: 'Bold',
    tags: ['Hero', 'Template', 'Gradient'],
    previewBackground: 'linear-gradient(135deg,#ff6a88,#7c3aed 55%,#22d3ee)',
    ...signalTemplate('gradient-hero-template', { title: 'Animated hero block', kicker: 'SHOWCASE', value: 'Hero', text: 'A colorful composition with animated orbs.', bg: 'linear-gradient(135deg,#111827,#4c1d95 54%,#be185d)', accent: '#f9a8d4' }),
  }),
  templateItem({
    id: 'glass-panel-template',
    name: 'Glass Panel Template',
    collection: 'Cinematic',
    motionStyle: 'Loop',
    intensity: 'Medium',
    tags: ['Hero', 'Panel', 'Glass'],
    previewBackground: 'linear-gradient(135deg,#dbeafe,#fae8ff)',
    templateHtml: `<section class="animadiv-template glass-panel-template"><i></i><article><span>GLASS</span><h2>Floating clarity</h2><p>Soft glass layers with continuous motion.</p></article></section>`,
    templateCss: `.animadiv-template.glass-panel-template{position:relative;width:320px;min-height:220px;display:grid;place-items:center;overflow:hidden;border-radius:30px;background:linear-gradient(135deg,#dbeafe,#fae8ff)}.glass-panel-template article{position:relative;z-index:1;width:230px;padding:28px;border:1px solid rgba(255,255,255,.8);border-radius:26px;background:rgba(255,255,255,.68);backdrop-filter:blur(16px);box-shadow:0 24px 60px rgba(67,56,202,.18);animation:glass-float 3.2s ease-in-out infinite}.glass-panel-template i{position:absolute;width:130px;height:130px;border-radius:999px;background:rgba(34,211,238,.35);animation:glass-orb 4.2s ease-in-out infinite}.glass-panel-template span{color:#6b7280;font:900 10px/1 Inter,sans-serif;letter-spacing:1.4px}.glass-panel-template h2{margin:10px 0 8px;font:900 28px/1.05 Inter,sans-serif}.glass-panel-template p{margin:0;color:#6b7280;font:700 13px/1.5 Inter,sans-serif}.glass-panel-template:hover article{transform:translateY(-8px)}@keyframes glass-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}@keyframes glass-orb{0%,100%{transform:translate(-60px,-20px) scale(1)}50%{transform:translate(58px,28px) scale(1.12)}}`,
  }),
  templateItem({
    id: 'neon-status-template',
    name: 'Neon Status Template',
    collection: 'Interactive',
    motionStyle: 'Loop',
    intensity: 'Bold',
    tags: ['Neon', 'Template', 'Signal'],
    previewBackground: '#07111f',
    ...signalTemplate('neon-status-template', { title: 'Realtime motion signal', kicker: 'LIVE SIGNAL', value: '+64%', text: 'A dark composition for dashboards and launch pages.', bg: '#07111f', accent: '#22d3ee' }),
  }),
  templateItem({
    id: 'warm-editorial-template',
    name: 'Warm Editorial Template',
    collection: 'Editorial',
    motionStyle: 'Load',
    intensity: 'Medium',
    tags: ['Editorial', 'Template', 'Warm'],
    previewBackground: '#f5ead8',
    ...signalTemplate('warm-editorial-template', { title: 'Reading in motion', kicker: 'EDITORIAL', value: 'Story', text: 'A warm article card with cinematic reveal.', bg: '#fff7ed', accent: '#f97316' }),
  }),
];
