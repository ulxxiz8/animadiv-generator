import { DEFAULT_ANIMATION_CONFIG } from '../utils/elementSystem';

// ─── helpers (copied from original libraryItems.js) ───────────────────────────

const animation = (overrides = {}) => ({
  ...DEFAULT_ANIMATION_CONFIG,
  ...overrides,
});

const animations = ({ load = {}, hover = {}, click = {} } = {}) => ({
  load: animation(load),
  hover: animation({ presetId: 'none', ...hover }),
  click: animation({ presetId: 'none', ...click }),
});

const withInteractionDefaults = (item) => {
  const styles = item.styles || {};
  const settings = item.specificSettings || {};
  const isGradient = Boolean(styles.background);

  const byType = {
    button:   { settings: { actionType: 'none', href: '#', target: '_self', cursor: 'pointer' } },
    input:    { settings: { validationState: 'none', errorBorderColor: '#111827', disabled: false } },
    textarea: { settings: { validationState: 'none', errorBorderColor: '#111827', disabled: false } },
    text:     { settings: {} },
    image:    { settings: { loading: 'lazy' } },
    link:     { settings: { target: '_self' } },
    block:    { settings: {} },
    checkbox: { settings: { disabled: false } },
    radio:    { settings: { disabled: false } },
  };

  const defaults = byType[item.type] || { settings: {} };
  const nextAnimations = {
    load:  animation(item.animations?.load),
    hover: animation(item.animations?.hover),
    click: animation(item.animations?.click),
  };

  return {
    ...item,
    styles: { margin: 0, position: 'relative', zIndex: 1, ...styles },
    specificSettings: {
      backgroundMode: isGradient ? 'gradient' : 'color',
      backgroundGradient: styles.background || '',
      backgroundImage: '',
      ...defaults.settings,
      ...settings,
    },
    animations: nextAnimations,
  };
};

const preview = (background, accent) => ({ background, accent });

const baseMeta = ({ id, name, category, collection, motionStyle, intensity, tags, previewEffect, previewBackground, previewAccent }) => ({
  id, name, category, collection, motionStyle, intensity, tags, previewEffect,
  preview: preview(previewBackground, previewAccent),
});

const shadow = (overrides = {}) => ({
  shadowEnabled: false,
  shadowColor: '#111827',
  shadowBlur: 20,
  shadowOffsetY: 8,
  shadowOpacity: 0.12,
  ...overrides,
});

// ─── item factories ────────────────────────────────────────────────────────────

const buttonItem = ({ id, name, collection, motionStyle, intensity, tags, text, background, backgroundColor, color, borderColor = 'transparent', previewBackground, previewAccent, previewEffect, motion }) => ({
  ...baseMeta({ id, name, category: 'Buttons', collection, motionStyle, intensity, tags, previewEffect, previewBackground, previewAccent }),
  type: 'button', tag: 'button',
  styles: {
    width: 184, height: 52, background, backgroundColor, color,
    borderRadius: 999,
    borderWidth: borderColor === 'transparent' ? 0 : 1,
    borderColor, opacity: 1, padding: '0 22px',
  },
  content: text,
  specificSettings: { text, type: 'button', fontFamily: 'Inter', fontSize: 14, fontWeight: 850, hoverBackground: backgroundColor, hoverColor: color, ...shadow() },
  animations: animations(motion),
});

const textItem = ({ id, name, collection, motionStyle, intensity, tags, content, tag = 'h2', fontSize = 30, fontWeight = 900, color, width = 300, previewBackground, previewAccent, previewEffect, motion }) => ({
  ...baseMeta({ id, name, category: 'Typography', collection, motionStyle, intensity, tags, previewEffect, previewBackground, previewAccent }),
  type: 'text', tag,
  styles: { width, height: 'auto', backgroundColor: 'transparent', color, borderWidth: 0, borderColor: 'transparent', opacity: 1, padding: 0 },
  content,
  specificSettings: { content, tag, fontFamily: 'Inter', fontSize, fontWeight, textAlign: 'center', lineHeight: tag === 'p' ? 1.45 : 1.08, letterSpacing: 0, textTransform: 'none' },
  animations: animations(motion),
});

const inputItem = ({ id, name, collection, motionStyle, intensity, tags, type = 'input', placeholder, backgroundColor, color, borderColor, previewBackground, previewAccent, previewEffect, motion }) => ({
  ...baseMeta({ id, name, category: 'Inputs', collection, motionStyle, intensity, tags, previewEffect, previewBackground, previewAccent }),
  type, tag: type === 'textarea' ? 'textarea' : 'input',
  styles: {
    width: 286, height: type === 'textarea' ? 112 : 52, backgroundColor, color,
    borderRadius: 18, borderWidth: 1, borderColor, opacity: 1,
    padding: type === 'textarea' ? '14px 16px' : '0 18px',
  },
  content: null,
  specificSettings: { inputType: 'text', placeholder, rows: 4, resize: 'vertical', fontFamily: 'Inter', fontSize: 14, fontWeight: 700, focusBorderColor: borderColor, ...shadow({ shadowEnabled: true, shadowBlur: 18, shadowOffsetY: 8 }) },
  animations: animations(motion),
});

const imageItem = ({ id, name, collection, motionStyle, intensity, tags, src, alt, previewBackground, previewAccent, previewEffect, motion }) => ({
  ...baseMeta({ id, name, category: 'Images', collection, motionStyle, intensity, tags, previewEffect, previewBackground, previewAccent }),
  type: 'image', tag: 'img',
  styles: { width: 292, height: 188, backgroundColor: '#E5E7EB', borderRadius: 24, borderWidth: 0, borderColor: 'transparent', opacity: 1 },
  content: null,
  specificSettings: { src, alt, objectFit: 'cover', objectPosition: 'center', ...shadow({ shadowEnabled: true, shadowBlur: 28, shadowOffsetY: 14 }) },
  animations: animations(motion),
});

const linkItem = ({ id, name, collection, motionStyle, intensity, tags, text, color, previewBackground, previewAccent, previewEffect, motion }) => ({
  ...baseMeta({ id, name, category: 'Links', collection, motionStyle, intensity, tags, previewEffect, previewBackground, previewAccent }),
  type: 'link', tag: 'a',
  styles: { width: 'auto', height: 'auto', backgroundColor: 'transparent', color, borderWidth: 0, borderColor: 'transparent', opacity: 1, padding: 0 },
  content: text,
  specificSettings: { text, href: '#', underline: 'hover', fontFamily: 'Inter', fontSize: 16, fontWeight: 850, hoverColor: previewAccent },
  animations: animations(motion),
});

const blockItem = ({ id, name, collection, motionStyle, intensity, tags, background, backgroundColor, color, borderColor = 'transparent', previewBackground, previewAccent, previewEffect, motion }) => ({
  ...baseMeta({ id, name, category: 'Blocks', collection, motionStyle, intensity, tags, previewEffect, previewBackground, previewAccent }),
  type: 'block', tag: 'div',
  styles: {
    width: 292, height: 174, background, backgroundColor, color,
    borderRadius: 24,
    borderWidth: borderColor === 'transparent' ? 0 : 1,
    borderColor, opacity: 1, padding: 24,
  },
  content: null,
  specificSettings: { alignX: 'center', alignY: 'center', gap: 10, overflow: 'visible', ...shadow({ shadowEnabled: true, shadowBlur: 26, shadowOffsetY: 12 }) },
  animations: animations(motion),
});

const choiceItem = ({ id, name, type, collection, motionStyle, intensity, tags, label, checked, color, previewBackground, previewAccent, previewEffect, motion }) => ({
  ...baseMeta({ id, name, category: 'Inputs', collection, motionStyle, intensity, tags, previewEffect, previewBackground, previewAccent }),
  type, tag: 'input',
  styles: { width: 'auto', height: 'auto', backgroundColor: 'transparent', color: '#111827', borderRadius: type === 'radio' ? 50 : 8, borderWidth: 0, borderColor: 'transparent', opacity: 1, padding: 0 },
  content: null,
  specificSettings: { checked, label, name: type === 'radio' ? 'libraryOptions' : undefined, color, checkColor: '#111827', size: 26, fontFamily: 'Inter', fontSize: 14, fontWeight: 850 },
  animations: animations(motion),
});

// ─── image sources ─────────────────────────────────────────────────────────────

const imgAbstract  = 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=900&auto=format&fit=crop';
const imgInterior  = 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=900&auto=format&fit=crop';
const imgDesk      = 'https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa?q=80&w=900&auto=format&fit=crop';
const imgGradient  = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=900&auto=format&fit=crop';
const imgCity      = 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=900&auto=format&fit=crop';
const imgNature    = 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=900&auto=format&fit=crop';

// ─── raw items ─────────────────────────────────────────────────────────────────

const rawLibraryItems = [

  // ── BUTTONS ──────────────────────────────────────────────────────────────────

  buttonItem({
    id: 'button-load-pop',
    name: 'Load Pop CTA',
    collection: 'Buttons', motionStyle: 'Load: Pop in', intensity: 'Bold',
    tags: ['button', 'load', 'pop'],
    text: 'Launch',
    background: 'linear-gradient(135deg,#111827,#334155)', backgroundColor: '#111827', color: '#D6F854',
    previewBackground: '#F8FAFC', previewAccent: '#D6F854', previewEffect: 'softScale',
    motion: { load: { presetId: 'popIn', duration: 420, intensity: 72 } },
  }),

  buttonItem({
    id: 'button-load-glow',
    name: 'Load Glow Appear',
    collection: 'Buttons', motionStyle: 'Load: Glow appear', intensity: 'Bold',
    tags: ['button', 'load', 'glow'],
    text: 'Get started',
    backgroundColor: '#4F46E5', color: '#fff',
    previewBackground: '#EEF2FF', previewAccent: '#4F46E5', previewEffect: 'shadowGlow',
    motion: { load: { presetId: 'glowAppear', duration: 600, intensity: 80 } },
  }),

  buttonItem({
    id: 'button-load-scale',
    name: 'Load Scale Up',
    collection: 'Buttons', motionStyle: 'Load: Scale up', intensity: 'Medium',
    tags: ['button', 'load', 'scale'],
    text: 'Connect',
    backgroundColor: '#0EA5E9', color: '#fff',
    previewBackground: '#F0F9FF', previewAccent: '#0EA5E9', previewEffect: 'softScale',
    motion: { load: { presetId: 'scaleIn', duration: 380, intensity: 60 } },
  }),

  buttonItem({
    id: 'button-load-slide',
    name: 'Load Slide In',
    collection: 'Buttons', motionStyle: 'Load: Slide in', intensity: 'Medium',
    tags: ['button', 'load', 'slide'],
    text: 'Explore',
    background: 'linear-gradient(135deg,#f97316,#ec4899)', backgroundColor: '#f97316', color: '#fff',
    previewBackground: '#FFF7ED', previewAccent: '#f97316', previewEffect: 'slideUp',
    motion: { load: { presetId: 'slideIn', duration: 400, direction: 'bottom', intensity: 55 } },
  }),

  buttonItem({
    id: 'button-load-bounce',
    name: 'Load Bounce In',
    collection: 'Buttons', motionStyle: 'Load: Bounce in', intensity: 'Bold',
    tags: ['button', 'load', 'bounce'],
    text: 'Join now',
    backgroundColor: '#111827', color: '#D6F854',
    previewBackground: '#F8FAFC', previewAccent: '#D6F854', previewEffect: 'bounce',
    motion: { load: { presetId: 'bounceIn', duration: 500, intensity: 80 } },
  }),

  buttonItem({
    id: 'button-hover-magnetic',
    name: 'Hover Magnetic',
    collection: 'Buttons', motionStyle: 'Hover: Magnetic', intensity: 'Medium',
    tags: ['button', 'hover', 'magnetic'],
    text: 'Explore',
    background: 'linear-gradient(135deg,#2563eb,#14b8a6)', backgroundColor: '#2563eb', color: '#fff',
    previewBackground: '#EEF6FF', previewAccent: '#14B8A6', previewEffect: 'float',
    motion: { hover: { presetId: 'magneticHover', duration: 260, intensity: 58 } },
  }),

  buttonItem({
    id: 'button-hover-lift',
    name: 'Hover Shadow Lift',
    collection: 'Buttons', motionStyle: 'Hover: Shadow lift', intensity: 'Medium',
    tags: ['button', 'hover', 'lift', 'shadow'],
    text: 'Discover',
    backgroundColor: '#111827', color: '#fff',
    previewBackground: '#F8FAFC', previewAccent: '#111827', previewEffect: 'shadowGlow',
    motion: { hover: { presetId: 'shadowLift', duration: 240, intensity: 52 } },
  }),

  buttonItem({
    id: 'button-hover-glow',
    name: 'Hover Border Glow',
    collection: 'Buttons', motionStyle: 'Hover: Border glow', intensity: 'Subtle',
    tags: ['button', 'hover', 'glow', 'border'],
    text: 'Learn more',
    backgroundColor: '#fff', color: '#4F46E5', borderColor: '#4F46E5',
    previewBackground: '#EEF2FF', previewAccent: '#4F46E5', previewEffect: 'shadowGlow',
    motion: { hover: { presetId: 'borderGlow', duration: 220, intensity: 44 } },
  }),

  buttonItem({
    id: 'button-hover-color',
    name: 'Hover Color Transition',
    collection: 'Buttons', motionStyle: 'Hover: Color transition', intensity: 'Subtle',
    tags: ['button', 'hover', 'color'],
    text: 'Read docs',
    backgroundColor: '#F1F5F9', color: '#111827',
    previewBackground: '#F8FAFC', previewAccent: '#64748B', previewEffect: 'softScale',
    motion: { hover: { presetId: 'colorTransition', duration: 200, intensity: 40 } },
  }),

  buttonItem({
    id: 'button-hover-scale',
    name: 'Hover Scale Up',
    collection: 'Buttons', motionStyle: 'Hover: Scale up', intensity: 'Subtle',
    tags: ['button', 'hover', 'scale'],
    text: 'View all',
    background: 'linear-gradient(135deg,#7c3aed,#4F46E5)', backgroundColor: '#7c3aed', color: '#fff',
    previewBackground: '#F5F3FF', previewAccent: '#7c3aed', previewEffect: 'softScale',
    motion: { hover: { presetId: 'scaleUp', duration: 180, intensity: 36, scaleRange: [1, 1.06] } },
  }),

  buttonItem({
    id: 'button-click-press',
    name: 'Click Press Effect',
    collection: 'Buttons', motionStyle: 'Click: Press effect', intensity: 'Subtle',
    tags: ['button', 'click', 'press'],
    text: 'Confirm',
    backgroundColor: '#D6F854', color: '#111827',
    previewBackground: '#111827', previewAccent: '#D6F854', previewEffect: 'pulse',
    motion: { click: { presetId: 'pressEffect', duration: 140, intensity: 80 } },
  }),

  buttonItem({
    id: 'button-click-ripple',
    name: 'Click Ripple',
    collection: 'Buttons', motionStyle: 'Click: Ripple', intensity: 'Medium',
    tags: ['button', 'click', 'ripple'],
    text: 'Submit',
    backgroundColor: '#4F46E5', color: '#fff',
    previewBackground: '#EEF2FF', previewAccent: '#4F46E5', previewEffect: 'ripple',
    motion: { click: { presetId: 'ripple', duration: 380 } },
  }),

  buttonItem({
    id: 'button-click-bounce',
    name: 'Click Bounce In',
    collection: 'Buttons', motionStyle: 'Click: Bounce in', intensity: 'Bold',
    tags: ['button', 'click', 'bounce'],
    text: 'Done ✓',
    backgroundColor: '#111827', color: '#D6F854',
    previewBackground: '#F8FAFC', previewAccent: '#111827', previewEffect: 'bounce',
    motion: { click: { presetId: 'bounceIn', duration: 300, intensity: 70 } },
  }),

  buttonItem({
    id: 'button-click-shake',
    name: 'Click Shake',
    collection: 'Buttons', motionStyle: 'Click: Shake', intensity: 'Bold',
    tags: ['button', 'click', 'shake', 'error'],
    text: 'Try again',
    backgroundColor: '#EF4444', color: '#fff',
    previewBackground: '#FFF5F5', previewAccent: '#EF4444', previewEffect: 'shake',
    motion: { click: { presetId: 'shake', duration: 300 } },
  }),

  buttonItem({
    id: 'button-click-pulse',
    name: 'Click Pulse',
    collection: 'Buttons', motionStyle: 'Click: Pulse', intensity: 'Medium',
    tags: ['button', 'click', 'pulse'],
    text: 'Save',
    background: 'linear-gradient(135deg,#10b981,#059669)', backgroundColor: '#10b981', color: '#fff',
    previewBackground: '#ECFDF5', previewAccent: '#10b981', previewEffect: 'pulse',
    motion: { click: { presetId: 'pulse', duration: 260, intensity: 50 } },
  }),

  // ── INPUTS ───────────────────────────────────────────────────────────────────

  inputItem({
    id: 'input-load-slide',
    name: 'Load Slide Input',
    collection: 'Inputs', motionStyle: 'Load: Slide', intensity: 'Medium',
    tags: ['input', 'load', 'slide'],
    placeholder: 'name@company.com',
    backgroundColor: '#FFFFFF', color: '#111827', borderColor: '#CBD5E1',
    previewBackground: '#F8FAFC', previewAccent: '#8b5cf6', previewEffect: 'slideUp',
    motion: { load: { presetId: 'slide', duration: 420, direction: 'bottom' } },
  }),

  inputItem({
    id: 'input-load-expand',
    name: 'Load Expand Width',
    collection: 'Inputs', motionStyle: 'Load: Expand width', intensity: 'Medium',
    tags: ['input', 'load', 'expand'],
    placeholder: 'Search...',
    backgroundColor: '#F8FAFC', color: '#111827', borderColor: '#94A3B8',
    previewBackground: '#F8FAFC', previewAccent: '#64748B', previewEffect: 'expand',
    motion: { load: { presetId: 'expandWidth', duration: 360 } },
  }),

  inputItem({
    id: 'input-load-fade',
    name: 'Load Fade In Input',
    collection: 'Inputs', motionStyle: 'Load: Fade in', intensity: 'Subtle',
    tags: ['input', 'load', 'fade'],
    placeholder: 'Your full name',
    backgroundColor: '#fff', color: '#111827', borderColor: '#E2E8F0',
    previewBackground: '#FFFFFF', previewAccent: '#CBD5E1', previewEffect: 'fadeIn',
    motion: { load: { presetId: 'fadeIn', duration: 320 } },
  }),

  inputItem({
    id: 'input-hover-focus',
    name: 'Hover Focus Glow',
    collection: 'Inputs', motionStyle: 'Hover: Focus glow', intensity: 'Subtle',
    tags: ['input', 'hover', 'focus', 'glow'],
    placeholder: 'Search project',
    backgroundColor: '#FFFFFF', color: '#111827', borderColor: '#4F46E5',
    previewBackground: '#EEF2FF', previewAccent: '#4F46E5', previewEffect: 'shadowGlow',
    motion: { hover: { presetId: 'focusGlow', duration: 220 } },
  }),

  inputItem({
    id: 'input-hover-border',
    name: 'Hover Border Slide',
    collection: 'Inputs', motionStyle: 'Hover: Border slide', intensity: 'Subtle',
    tags: ['input', 'hover', 'border'],
    placeholder: 'Enter email',
    backgroundColor: '#fff', color: '#111827', borderColor: '#0EA5E9',
    previewBackground: '#F0F9FF', previewAccent: '#0EA5E9', previewEffect: 'underlineDraw',
    motion: { hover: { presetId: 'borderSlide', duration: 200 } },
  }),

  inputItem({
    id: 'input-click-border',
    name: 'Click Border Animation',
    collection: 'Inputs', motionStyle: 'Click: Border animation', intensity: 'Subtle',
    tags: ['input', 'click', 'border'],
    placeholder: 'Tap to edit',
    backgroundColor: '#FAFAFA', color: '#111827', borderColor: '#111827',
    previewBackground: '#FFFFFF', previewAccent: '#111827', previewEffect: 'underlineDraw',
    motion: { click: { presetId: 'borderAnimation', duration: 240 } },
  }),

  inputItem({
    id: 'input-click-error',
    name: 'Click Error Shake',
    collection: 'Inputs', motionStyle: 'Click: Error shake', intensity: 'Bold',
    tags: ['input', 'click', 'error', 'shake', 'validation'],
    placeholder: 'invalid@',
    backgroundColor: '#FFF5F5', color: '#7f1d1d', borderColor: '#EF4444',
    previewBackground: '#FFF5F5', previewAccent: '#EF4444', previewEffect: 'shake',
    motion: { click: { presetId: 'errorShake', duration: 300 } },
  }),

  // ── TEXTAREAS ─────────────────────────────────────────────────────────────────

  inputItem({
    id: 'textarea-load-expand',
    name: 'Load Expand Textarea',
    collection: 'Textareas', motionStyle: 'Load: Expand height', intensity: 'Medium',
    tags: ['textarea', 'load', 'expand'],
    type: 'textarea',
    placeholder: 'Write a launch note...',
    backgroundColor: '#FFF7ED', color: '#431407', borderColor: '#FDBA74',
    previewBackground: '#FFF7ED', previewAccent: '#F97316', previewEffect: 'slideUp',
    motion: { load: { presetId: 'expandHeight', duration: 380 } },
  }),

  inputItem({
    id: 'textarea-load-fade',
    name: 'Load Fade Textarea',
    collection: 'Textareas', motionStyle: 'Load: Fade in', intensity: 'Subtle',
    tags: ['textarea', 'load', 'fade'],
    type: 'textarea',
    placeholder: 'Your message here...',
    backgroundColor: '#fff', color: '#111827', borderColor: '#E2E8F0',
    previewBackground: '#fff', previewAccent: '#CBD5E1', previewEffect: 'fadeIn',
    motion: { load: { presetId: 'fadeIn', duration: 340 } },
  }),

  inputItem({
    id: 'textarea-hover-border',
    name: 'Hover Border Glow',
    collection: 'Textareas', motionStyle: 'Hover: Border glow', intensity: 'Medium',
    tags: ['textarea', 'hover', 'border', 'glow'],
    type: 'textarea',
    placeholder: 'Describe the task...',
    backgroundColor: '#FFFFFF', color: '#111827', borderColor: '#0EA5E9',
    previewBackground: '#F0F9FF', previewAccent: '#0EA5E9', previewEffect: 'shadowGlow',
    motion: { hover: { presetId: 'borderGlow', duration: 220, intensity: 42 } },
  }),

  inputItem({
    id: 'textarea-hover-focus',
    name: 'Hover Focus Glow',
    collection: 'Textareas', motionStyle: 'Hover: Focus glow', intensity: 'Subtle',
    tags: ['textarea', 'hover', 'focus'],
    type: 'textarea',
    placeholder: 'Project details...',
    backgroundColor: '#fff', color: '#111827', borderColor: '#7c3aed',
    previewBackground: '#F5F3FF', previewAccent: '#7c3aed', previewEffect: 'shadowGlow',
    motion: { hover: { presetId: 'focusGlow', duration: 220 } },
  }),

  inputItem({
    id: 'textarea-click-auto',
    name: 'Click Auto Expand',
    collection: 'Textareas', motionStyle: 'Click: Auto expand', intensity: 'Medium',
    tags: ['textarea', 'click', 'expand'],
    type: 'textarea',
    placeholder: 'Click to expand',
    backgroundColor: '#F8FAFC', color: '#111827', borderColor: '#94A3B8',
    previewBackground: '#F8FAFC', previewAccent: '#64748B', previewEffect: 'softScale',
    motion: { click: { presetId: 'autoExpand', duration: 260 } },
  }),

  inputItem({
    id: 'textarea-click-error',
    name: 'Click Error Shake',
    collection: 'Textareas', motionStyle: 'Click: Error shake', intensity: 'Bold',
    tags: ['textarea', 'click', 'error', 'validation'],
    type: 'textarea',
    placeholder: 'Required field...',
    backgroundColor: '#FFF5F5', color: '#7f1d1d', borderColor: '#EF4444',
    previewBackground: '#FFF5F5', previewAccent: '#EF4444', previewEffect: 'shake',
    motion: { click: { presetId: 'errorShake', duration: 300 } },
  }),

  // ── CHECKBOXES ────────────────────────────────────────────────────────────────

  choiceItem({
    id: 'checkbox-load-scale',
    name: 'Load Scale Checkbox',
    type: 'checkbox',
    collection: 'Checkboxes', motionStyle: 'Load: Scale in', intensity: 'Subtle',
    tags: ['checkbox', 'load', 'scale'],
    label: 'Receive updates', checked: true, color: '#D6F854',
    previewBackground: '#111827', previewAccent: '#D6F854', previewEffect: 'softScale',
    motion: { load: { presetId: 'scaleIn', duration: 320, intensity: 36 } },
  }),

  choiceItem({
    id: 'checkbox-load-fade',
    name: 'Load Fade Checkbox',
    type: 'checkbox',
    collection: 'Checkboxes', motionStyle: 'Load: Fade in', intensity: 'Subtle',
    tags: ['checkbox', 'load', 'fade'],
    label: 'Remember me', checked: true, color: '#4F46E5',
    previewBackground: '#EEF2FF', previewAccent: '#4F46E5', previewEffect: 'fadeIn',
    motion: { load: { presetId: 'fadeIn', duration: 300 } },
  }),

  choiceItem({
    id: 'checkbox-hover-glow',
    name: 'Hover Glow Checkbox',
    type: 'checkbox',
    collection: 'Checkboxes', motionStyle: 'Hover: Glow', intensity: 'Medium',
    tags: ['checkbox', 'hover', 'glow'],
    label: 'Enable sync', checked: false, color: '#22D3EE',
    previewBackground: '#082231', previewAccent: '#22D3EE', previewEffect: 'shadowGlow',
    motion: { hover: { presetId: 'glowHover', duration: 220, intensity: 42 } },
  }),

  choiceItem({
    id: 'checkbox-hover-border',
    name: 'Hover Border Highlight',
    type: 'checkbox',
    collection: 'Checkboxes', motionStyle: 'Hover: Border highlight', intensity: 'Subtle',
    tags: ['checkbox', 'hover', 'border'],
    label: 'Auto-save', checked: false, color: '#7c3aed',
    previewBackground: '#F5F3FF', previewAccent: '#7c3aed', previewEffect: 'softScale',
    motion: { hover: { presetId: 'borderHighlight', duration: 180 } },
  }),

  choiceItem({
    id: 'checkbox-click-bounce',
    name: 'Click Bounce Check',
    type: 'checkbox',
    collection: 'Checkboxes', motionStyle: 'Click: Bounce check', intensity: 'Medium',
    tags: ['checkbox', 'click', 'bounce', 'check'],
    label: 'Mark complete', checked: false, color: '#111827',
    previewBackground: '#F8FAFC', previewAccent: '#111827', previewEffect: 'pulse',
    motion: { click: { presetId: 'bounceCheck', duration: 220 } },
  }),

  choiceItem({
    id: 'checkbox-click-smooth',
    name: 'Click Smooth Check',
    type: 'checkbox',
    collection: 'Checkboxes', motionStyle: 'Click: Smooth check', intensity: 'Subtle',
    tags: ['checkbox', 'click', 'smooth'],
    label: 'Accept terms', checked: false, color: '#10b981',
    previewBackground: '#ECFDF5', previewAccent: '#10b981', previewEffect: 'softScale',
    motion: { click: { presetId: 'smoothCheck', duration: 200 } },
  }),

  // ── RADIOS ────────────────────────────────────────────────────────────────────

  choiceItem({
    id: 'radio-load-fade',
    name: 'Load Fade Radio',
    type: 'radio',
    collection: 'Radios', motionStyle: 'Load: Fade in', intensity: 'Subtle',
    tags: ['radio', 'load', 'fade'],
    label: 'Starter plan', checked: true, color: '#4F46E5',
    previewBackground: '#EEF2FF', previewAccent: '#4F46E5', previewEffect: 'fadeIn',
    motion: { load: { presetId: 'fadeIn', duration: 300 } },
  }),

  choiceItem({
    id: 'radio-load-scale',
    name: 'Load Scale Radio',
    type: 'radio',
    collection: 'Radios', motionStyle: 'Load: Scale in', intensity: 'Subtle',
    tags: ['radio', 'load', 'scale'],
    label: 'Pro plan', checked: false, color: '#7c3aed',
    previewBackground: '#F5F3FF', previewAccent: '#7c3aed', previewEffect: 'softScale',
    motion: { load: { presetId: 'scaleIn', duration: 280 } },
  }),

  choiceItem({
    id: 'radio-hover-pulse',
    name: 'Hover Pulse Radio',
    type: 'radio',
    collection: 'Radios', motionStyle: 'Hover: Radio pulse', intensity: 'Medium',
    tags: ['radio', 'hover', 'pulse'],
    label: 'Agency plan', checked: false, color: '#D6F854',
    previewBackground: '#0B0F17', previewAccent: '#D6F854', previewEffect: 'pulse',
    motion: { hover: { presetId: 'radioPulse', duration: 220 } },
  }),

  choiceItem({
    id: 'radio-hover-glow',
    name: 'Hover Glow Radio',
    type: 'radio',
    collection: 'Radios', motionStyle: 'Hover: Glow', intensity: 'Subtle',
    tags: ['radio', 'hover', 'glow'],
    label: 'Enterprise', checked: false, color: '#0EA5E9',
    previewBackground: '#F0F9FF', previewAccent: '#0EA5E9', previewEffect: 'shadowGlow',
    motion: { hover: { presetId: 'glowHover', duration: 200, intensity: 38 } },
  }),

  choiceItem({
    id: 'radio-click-dot',
    name: 'Click Dot Expand',
    type: 'radio',
    collection: 'Radios', motionStyle: 'Click: Dot expand', intensity: 'Subtle',
    tags: ['radio', 'click', 'dot'],
    label: 'Custom plan', checked: false, color: '#111827',
    previewBackground: '#FFFFFF', previewAccent: '#111827', previewEffect: 'softScale',
    motion: { click: { presetId: 'dotExpand', duration: 180 } },
  }),

  choiceItem({
    id: 'radio-click-pulse',
    name: 'Click Pulse Radio',
    type: 'radio',
    collection: 'Radios', motionStyle: 'Click: Pulse', intensity: 'Medium',
    tags: ['radio', 'click', 'pulse'],
    label: 'Free tier', checked: false, color: '#10b981',
    previewBackground: '#ECFDF5', previewAccent: '#10b981', previewEffect: 'pulse',
    motion: { click: { presetId: 'pulse', duration: 220, intensity: 44 } },
  }),

  // ── TYPOGRAPHY ────────────────────────────────────────────────────────────────

  textItem({
    id: 'type-load-typewriter',
    name: 'Load Typewriter',
    collection: 'Typography', motionStyle: 'Load: Typewriter', intensity: 'Medium',
    tags: ['text', 'load', 'typewriter'],
    content: 'The story types itself', color: '#111827',
    previewBackground: '#F8FAFC', previewAccent: '#111827', previewEffect: 'typewriter',
    motion: { load: { presetId: 'typewriter', duration: 900, stagger: 38 } },
  }),

  textItem({
    id: 'type-load-blur',
    name: 'Load Blur Reveal',
    collection: 'Typography', motionStyle: 'Load: Blur reveal', intensity: 'Medium',
    tags: ['text', 'load', 'blur'],
    content: 'Clarity emerges.', fontSize: 28, color: '#111827',
    previewBackground: '#FFFFFF', previewAccent: '#111827', previewEffect: 'blurReveal',
    motion: { load: { presetId: 'blurReveal', duration: 600, blurAmount: 12 } },
  }),

  textItem({
    id: 'type-load-word',
    name: 'Load Fade by Word',
    collection: 'Typography', motionStyle: 'Load: Fade by word', intensity: 'Medium',
    tags: ['text', 'load', 'word', 'stagger'],
    content: 'Word by word reveal', fontSize: 20, color: '#4F46E5',
    previewBackground: '#EEF2FF', previewAccent: '#4F46E5', previewEffect: 'fadeByWord',
    motion: { load: { presetId: 'fadeByWord', duration: 500, stagger: 80 } },
  }),

  textItem({
    id: 'type-load-letter',
    name: 'Load Fade by Letter',
    collection: 'Typography', motionStyle: 'Load: Fade by letter', intensity: 'Bold',
    tags: ['text', 'load', 'letter', 'stagger'],
    content: 'Letter perfect', fontSize: 26, fontWeight: 900, color: '#111827',
    previewBackground: '#F8FAFC', previewAccent: '#111827', previewEffect: 'fadeByLetter',
    motion: { load: { presetId: 'fadeByLetter', duration: 600, stagger: 40 } },
  }),

  textItem({
    id: 'type-load-slide-up',
    name: 'Load Slide Up Reveal',
    collection: 'Typography', motionStyle: 'Load: Slide up reveal', intensity: 'Medium',
    tags: ['text', 'load', 'slide'],
    content: 'Rising to the top', fontSize: 22, color: '#7c3aed',
    previewBackground: '#F5F3FF', previewAccent: '#7c3aed', previewEffect: 'slideUp',
    motion: { load: { presetId: 'slideUpReveal', duration: 480 } },
  }),

  textItem({
    id: 'type-load-pop',
    name: 'Load Pop In Heading',
    collection: 'Typography', motionStyle: 'Load: Pop in', intensity: 'Bold',
    tags: ['text', 'load', 'pop'],
    content: 'Big impact.', fontSize: 32, color: '#111827',
    previewBackground: '#FFF7ED', previewAccent: '#F97316', previewEffect: 'popIn',
    motion: { load: { presetId: 'popIn', duration: 400, intensity: 70 } },
  }),

  textItem({
    id: 'type-hover-shift',
    name: 'Hover Text Shift',
    collection: 'Typography', motionStyle: 'Hover: Text shift', intensity: 'Subtle',
    tags: ['text', 'hover', 'shift'],
    content: 'Move with intent', color: '#111827',
    previewBackground: '#FFF7ED', previewAccent: '#F97316', previewEffect: 'slideUp',
    motion: { hover: { presetId: 'textShift', duration: 220, direction: 'right', intensity: 26 } },
  }),

  textItem({
    id: 'type-hover-underline',
    name: 'Hover Underline Draw',
    collection: 'Typography', motionStyle: 'Hover: Underline draw', intensity: 'Subtle',
    tags: ['text', 'hover', 'underline'],
    content: 'Hover to reveal', fontSize: 22, color: '#111827',
    previewBackground: '#FFFFFF', previewAccent: '#111827', previewEffect: 'underlineDraw',
    motion: { hover: { presetId: 'underlineDraw', duration: 260 } },
  }),

  textItem({
    id: 'type-hover-color',
    name: 'Hover Color Transition',
    collection: 'Typography', motionStyle: 'Hover: Color transition', intensity: 'Subtle',
    tags: ['text', 'hover', 'color'],
    content: 'Color shifts here', fontSize: 20, color: '#64748B',
    previewBackground: '#F8FAFC', previewAccent: '#4F46E5', previewEffect: 'softScale',
    motion: { hover: { presetId: 'colorTransition', duration: 200 } },
  }),

  textItem({
    id: 'type-click-pulse',
    name: 'Click Pulse Caption',
    collection: 'Typography', motionStyle: 'Click: Pulse', intensity: 'Medium',
    tags: ['text', 'click', 'pulse'],
    tag: 'p', content: 'Tap to emphasize feedback.', fontSize: 19, fontWeight: 800, color: '#3B2F2F',
    previewBackground: '#FFF1E8', previewAccent: '#FB7185', previewEffect: 'pulse',
    motion: { click: { presetId: 'pulse', duration: 260, intensity: 42 } },
  }),

  textItem({
    id: 'type-click-flash',
    name: 'Click Flash Text',
    collection: 'Typography', motionStyle: 'Click: Flash', intensity: 'Bold',
    tags: ['text', 'click', 'flash'],
    content: 'Flash highlight!', fontSize: 22, color: '#111827',
    previewBackground: '#FFFBEB', previewAccent: '#F59E0B', previewEffect: 'pulse',
    motion: { click: { presetId: 'flash', duration: 200, intensity: 60 } },
  }),

  // ── IMAGES ────────────────────────────────────────────────────────────────────

  imageItem({
    id: 'image-load-zoom',
    name: 'Load Zoom Reveal',
    collection: 'Images', motionStyle: 'Load: Zoom reveal', intensity: 'Bold',
    tags: ['image', 'load', 'zoom'],
    src: imgAbstract, alt: 'Abstract architecture',
    previewBackground: '#15122E', previewAccent: '#A78BFA', previewEffect: 'imageZoom',
    motion: { load: { presetId: 'zoomReveal', duration: 760, zoomIntensity: 50 } },
  }),

  imageItem({
    id: 'image-load-blur',
    name: 'Load Blur Reveal',
    collection: 'Images', motionStyle: 'Load: Blur reveal', intensity: 'Bold',
    tags: ['image', 'load', 'blur'],
    src: imgDesk, alt: 'Workspace desk',
    previewBackground: '#F0F9FF', previewAccent: '#0EA5E9', previewEffect: 'blurReveal',
    motion: { load: { presetId: 'blurReveal', duration: 600, blurAmount: 16 } },
  }),

  imageItem({
    id: 'image-load-fade',
    name: 'Load Fade In',
    collection: 'Images', motionStyle: 'Load: Fade in', intensity: 'Subtle',
    tags: ['image', 'load', 'fade'],
    src: imgNature, alt: 'Nature forest',
    previewBackground: '#ECFDF5', previewAccent: '#10b981', previewEffect: 'fadeIn',
    motion: { load: { presetId: 'fadeIn', duration: 500 } },
  }),

  imageItem({
    id: 'image-load-slide',
    name: 'Load Slide In',
    collection: 'Images', motionStyle: 'Load: Slide in', intensity: 'Medium',
    tags: ['image', 'load', 'slide'],
    src: imgCity, alt: 'City skyline',
    previewBackground: '#F0F9FF', previewAccent: '#0EA5E9', previewEffect: 'slideUp',
    motion: { load: { presetId: 'slideIn', duration: 480, direction: 'bottom' } },
  }),

  imageItem({
    id: 'image-load-floating',
    name: 'Load Floating Image',
    collection: 'Images', motionStyle: 'Load: Floating image', intensity: 'Medium',
    tags: ['image', 'load', 'float'],
    src: imgGradient, alt: 'Gradient abstract',
    previewBackground: '#F8FAFC', previewAccent: '#A78BFA', previewEffect: 'float',
    motion: { load: { presetId: 'floatingImage', duration: 2000, floatingAmount: 12 } },
  }),

  imageItem({
    id: 'image-load-ken-burns',
    name: 'Load Ken Burns',
    collection: 'Images', motionStyle: 'Load: Ken Burns', intensity: 'Bold',
    tags: ['image', 'load', 'kenburns', 'zoom', 'pan'],
    src: imgInterior, alt: 'Interior space',
    previewBackground: '#F5EAD8', previewAccent: '#A16207', previewEffect: 'imageZoom',
    motion: { load: { presetId: 'kenBurns', duration: 5000, zoomIntensity: 40 } },
  }),

  imageItem({
    id: 'image-hover-tilt',
    name: 'Hover Tilt',
    collection: 'Images', motionStyle: 'Hover: Tilt hover', intensity: 'Medium',
    tags: ['image', 'hover', 'tilt'],
    src: imgDesk, alt: 'Workspace desk',
    previewBackground: '#F0F9FF', previewAccent: '#0EA5E9', previewEffect: 'imageTilt',
    motion: { hover: { presetId: 'tiltHover', duration: 280, rotationAngle: 5, hoverDepth: 18 } },
  }),

  imageItem({
    id: 'image-hover-zoom',
    name: 'Hover Zoom',
    collection: 'Images', motionStyle: 'Hover: Zoom', intensity: 'Subtle',
    tags: ['image', 'hover', 'zoom'],
    src: imgCity, alt: 'City',
    previewBackground: '#F0F9FF', previewAccent: '#0EA5E9', previewEffect: 'softScale',
    motion: { hover: { presetId: 'zoom', duration: 260, hoverDepth: 10 } },
  }),

  imageItem({
    id: 'image-hover-brightness',
    name: 'Hover Brightness',
    collection: 'Images', motionStyle: 'Hover: Brightness', intensity: 'Subtle',
    tags: ['image', 'hover', 'brightness'],
    src: imgNature, alt: 'Nature',
    previewBackground: '#ECFDF5', previewAccent: '#10b981', previewEffect: 'softScale',
    motion: { hover: { presetId: 'hoverBrightness', duration: 200, intensity: 40 } },
  }),

  imageItem({
    id: 'image-hover-parallax',
    name: 'Hover Parallax',
    collection: 'Images', motionStyle: 'Hover: Parallax', intensity: 'Medium',
    tags: ['image', 'hover', 'parallax'],
    src: imgAbstract, alt: 'Abstract',
    previewBackground: '#15122E', previewAccent: '#A78BFA', previewEffect: 'imageTilt',
    motion: { hover: { presetId: 'parallaxHover', duration: 260, hoverDepth: 20 } },
  }),

  imageItem({
    id: 'image-click-expand',
    name: 'Click Expand',
    collection: 'Images', motionStyle: 'Click: Expand', intensity: 'Medium',
    tags: ['image', 'click', 'expand'],
    src: imgInterior, alt: 'Interior',
    previewBackground: '#F5EAD8', previewAccent: '#A16207', previewEffect: 'softScale',
    motion: { click: { presetId: 'expand', duration: 220, intensity: 52 } },
  }),

  imageItem({
    id: 'image-click-flip',
    name: 'Click Flip',
    collection: 'Images', motionStyle: 'Click: Flip', intensity: 'Bold',
    tags: ['image', 'click', 'flip'],
    src: imgGradient, alt: 'Gradient',
    previewBackground: '#F5F3FF', previewAccent: '#7c3aed', previewEffect: 'softScale',
    motion: { click: { presetId: 'flip', duration: 300, rotationAngle: 180 } },
  }),

  // ── LINKS ─────────────────────────────────────────────────────────────────────

  linkItem({
    id: 'link-load-slide',
    name: 'Load Slide In',
    collection: 'Links', motionStyle: 'Load: Slide in', intensity: 'Subtle',
    tags: ['link', 'load', 'slide'],
    text: 'Read release notes', color: '#334155',
    previewBackground: '#F8FAFC', previewAccent: '#334155', previewEffect: 'slideUp',
    motion: { load: { presetId: 'slide', duration: 320, direction: 'bottom' } },
  }),

  linkItem({
    id: 'link-load-fade',
    name: 'Load Fade In',
    collection: 'Links', motionStyle: 'Load: Fade in', intensity: 'Subtle',
    tags: ['link', 'load', 'fade'],
    text: 'View changelog', color: '#4F46E5',
    previewBackground: '#EEF2FF', previewAccent: '#4F46E5', previewEffect: 'fadeIn',
    motion: { load: { presetId: 'fadeIn', duration: 300 } },
  }),

  linkItem({
    id: 'link-hover-underline',
    name: 'Hover Underline Draw',
    collection: 'Links', motionStyle: 'Hover: Underline draw', intensity: 'Subtle',
    tags: ['link', 'hover', 'underline'],
    text: 'View documentation', color: '#111827',
    previewBackground: '#FFFFFF', previewAccent: '#111827', previewEffect: 'underlineDraw',
    motion: { hover: { presetId: 'underlineDraw', duration: 260 } },
  }),

  linkItem({
    id: 'link-hover-arrow',
    name: 'Hover Arrow Move',
    collection: 'Links', motionStyle: 'Hover: Arrow move', intensity: 'Subtle',
    tags: ['link', 'hover', 'arrow'],
    text: 'Open project →', color: '#4F46E5',
    previewBackground: '#EEF2FF', previewAccent: '#4F46E5', previewEffect: 'slideUp',
    motion: { hover: { presetId: 'arrowMove', duration: 220, direction: 'right', intensity: 30 } },
  }),

  linkItem({
    id: 'link-hover-color',
    name: 'Hover Color Shift',
    collection: 'Links', motionStyle: 'Hover: Color transition', intensity: 'Subtle',
    tags: ['link', 'hover', 'color'],
    text: 'Browse all items', color: '#64748B',
    previewBackground: '#F8FAFC', previewAccent: '#4F46E5', previewEffect: 'softScale',
    motion: { hover: { presetId: 'colorTransition', duration: 200 } },
  }),

  linkItem({
    id: 'link-hover-glow',
    name: 'Hover Glow Link',
    collection: 'Links', motionStyle: 'Hover: Glow', intensity: 'Medium',
    tags: ['link', 'hover', 'glow'],
    text: 'Open in new tab', color: '#0EA5E9',
    previewBackground: '#F0F9FF', previewAccent: '#0EA5E9', previewEffect: 'shadowGlow',
    motion: { hover: { presetId: 'glowHover', duration: 220, intensity: 40 } },
  }),

  linkItem({
    id: 'link-click-press',
    name: 'Click Press Effect',
    collection: 'Links', motionStyle: 'Click: Press effect', intensity: 'Subtle',
    tags: ['link', 'click', 'press'],
    text: 'Open billing', color: '#4F46E5',
    previewBackground: '#EEF2FF', previewAccent: '#4F46E5', previewEffect: 'softScale',
    motion: { click: { presetId: 'pressEffect', duration: 140, intensity: 50 } },
  }),

  linkItem({
    id: 'link-click-ripple',
    name: 'Click Ripple Link',
    collection: 'Links', motionStyle: 'Click: Ripple', intensity: 'Medium',
    tags: ['link', 'click', 'ripple'],
    text: 'Download PDF', color: '#7c3aed',
    previewBackground: '#F5F3FF', previewAccent: '#7c3aed', previewEffect: 'ripple',
    motion: { click: { presetId: 'ripple', duration: 340 } },
  }),

  // ── BLOCKS ────────────────────────────────────────────────────────────────────

  blockItem({
    id: 'block-load-float',
    name: 'Load Floating Section',
    collection: 'Containers', motionStyle: 'Load: Floating section', intensity: 'Medium',
    tags: ['block', 'load', 'float'],
    backgroundColor: 'rgba(255,255,255,.78)', borderColor: 'rgba(255,255,255,.9)',
    previewBackground: 'linear-gradient(135deg,#E0F2FE,#FAE8FF)', previewAccent: '#8B5CF6', previewEffect: 'float',
    motion: { load: { presetId: 'floatingSection', duration: 1400, floatingAmount: 14 } },
  }),

  blockItem({
    id: 'block-load-stagger',
    name: 'Load Stagger Reveal',
    collection: 'Containers', motionStyle: 'Load: Stagger reveal', intensity: 'Medium',
    tags: ['block', 'load', 'stagger'],
    backgroundColor: '#F8FAFC', borderColor: '#E2E8F0',
    previewBackground: '#F8FAFC', previewAccent: '#4F46E5', previewEffect: 'slideUp',
    motion: { load: { presetId: 'staggerReveal', duration: 480, stagger: 60 } },
  }),

  blockItem({
    id: 'block-load-bounce',
    name: 'Load Bounce In',
    collection: 'Containers', motionStyle: 'Load: Bounce in', intensity: 'Bold',
    tags: ['block', 'load', 'bounce'],
    backgroundColor: '#111827',
    previewBackground: '#111827', previewAccent: '#D6F854', previewEffect: 'bounce',
    motion: { load: { presetId: 'bounceIn', duration: 560, intensity: 70 } },
  }),

  blockItem({
    id: 'block-load-zoom',
    name: 'Load Zoom Reveal',
    collection: 'Containers', motionStyle: 'Load: Zoom reveal', intensity: 'Bold',
    tags: ['block', 'load', 'zoom'],
    background: 'linear-gradient(135deg,#4F46E5,#7c3aed)', backgroundColor: '#4F46E5',
    previewBackground: '#EEF2FF', previewAccent: '#7c3aed', previewEffect: 'imageZoom',
    motion: { load: { presetId: 'zoomReveal', duration: 520, zoomIntensity: 40 } },
  }),

  blockItem({
    id: 'block-load-slide-up',
    name: 'Load Slide Up',
    collection: 'Containers', motionStyle: 'Load: Slide up', intensity: 'Medium',
    tags: ['block', 'load', 'slide'],
    backgroundColor: '#fff', borderColor: '#E2E8F0',
    previewBackground: '#F8FAFC', previewAccent: '#111827', previewEffect: 'slideUp',
    motion: { load: { presetId: 'slideUp', duration: 420 } },
  }),

  blockItem({
    id: 'block-hover-lift',
    name: 'Hover Lift',
    collection: 'Containers', motionStyle: 'Hover: Lift', intensity: 'Medium',
    tags: ['block', 'hover', 'lift'],
    background: 'linear-gradient(135deg,#111827,#312E81)', backgroundColor: '#111827',
    previewBackground: '#090C1B', previewAccent: '#22D3EE', previewEffect: 'shadowGlow',
    motion: { hover: { presetId: 'lift', duration: 260, intensity: 48 } },
  }),

  blockItem({
    id: 'block-hover-scale',
    name: 'Hover Scale Up',
    collection: 'Containers', motionStyle: 'Hover: Scale up', intensity: 'Subtle',
    tags: ['block', 'hover', 'scale'],
    backgroundColor: '#fff', borderColor: '#E2E8F0',
    previewBackground: '#FFFFFF', previewAccent: '#4F46E5', previewEffect: 'softScale',
    motion: { hover: { presetId: 'scaleUp', duration: 200, intensity: 36, scaleRange: [1, 1.04] } },
  }),

  blockItem({
    id: 'block-hover-glow',
    name: 'Hover Border Glow',
    collection: 'Containers', motionStyle: 'Hover: Border glow', intensity: 'Subtle',
    tags: ['block', 'hover', 'glow', 'border'],
    backgroundColor: '#fff', borderColor: '#4F46E5',
    previewBackground: '#EEF2FF', previewAccent: '#4F46E5', previewEffect: 'shadowGlow',
    motion: { hover: { presetId: 'borderGlow', duration: 220, intensity: 38 } },
  }),

  blockItem({
    id: 'block-hover-bg',
    name: 'Hover BG Change',
    collection: 'Containers', motionStyle: 'Hover: Background change', intensity: 'Subtle',
    tags: ['block', 'hover', 'background'],
    backgroundColor: '#F1F5F9', borderColor: '#CBD5E1',
    previewBackground: '#F8FAFC', previewAccent: '#64748B', previewEffect: 'softScale',
    motion: { hover: { presetId: 'backgroundChange', duration: 200, intensity: 36 } },
  }),

  blockItem({
    id: 'block-hover-shadow',
    name: 'Hover Shadow Increase',
    collection: 'Containers', motionStyle: 'Hover: Shadow increase', intensity: 'Medium',
    tags: ['block', 'hover', 'shadow'],
    backgroundColor: '#fff', borderColor: '#E2E8F0',
    previewBackground: '#F8FAFC', previewAccent: '#111827', previewEffect: 'shadowGlow',
    motion: { hover: { presetId: 'shadowIncrease', duration: 240, intensity: 50 } },
  }),

  blockItem({
    id: 'block-hover-tilt',
    name: 'Hover Tilt',
    collection: 'Containers', motionStyle: 'Hover: Tilt', intensity: 'Medium',
    tags: ['block', 'hover', 'tilt'],
    background: 'linear-gradient(135deg,#f97316,#ec4899)', backgroundColor: '#f97316',
    previewBackground: '#FFF7ED', previewAccent: '#f97316', previewEffect: 'imageTilt',
    motion: { hover: { presetId: 'tilt', duration: 240, rotationAngle: 3 } },
  }),

  blockItem({
    id: 'block-click-press',
    name: 'Click Press Down',
    collection: 'Containers', motionStyle: 'Click: Press down', intensity: 'Subtle',
    tags: ['block', 'click', 'press'],
    backgroundColor: '#FFF7ED', borderColor: '#FED7AA',
    previewBackground: '#FFEDD5', previewAccent: '#F97316', previewEffect: 'pulse',
    motion: { click: { presetId: 'pressDown', duration: 140, intensity: 54 } },
  }),

  blockItem({
    id: 'block-click-ripple',
    name: 'Click Ripple',
    collection: 'Containers', motionStyle: 'Click: Ripple', intensity: 'Medium',
    tags: ['block', 'click', 'ripple'],
    backgroundColor: '#4F46E5',
    previewBackground: '#EEF2FF', previewAccent: '#4F46E5', previewEffect: 'ripple',
    motion: { click: { presetId: 'ripple', duration: 400 } },
  }),

  blockItem({
    id: 'block-click-shake',
    name: 'Click Shake',
    collection: 'Containers', motionStyle: 'Click: Shake', intensity: 'Bold',
    tags: ['block', 'click', 'shake', 'error'],
    backgroundColor: '#FFF5F5', borderColor: '#FCA5A5',
    previewBackground: '#FFF5F5', previewAccent: '#EF4444', previewEffect: 'shake',
    motion: { click: { presetId: 'shake', duration: 300 } },
  }),

  blockItem({
    id: 'block-click-pulse',
    name: 'Click Pulse',
    collection: 'Containers', motionStyle: 'Click: Pulse', intensity: 'Medium',
    tags: ['block', 'click', 'pulse'],
    background: 'linear-gradient(135deg,#10b981,#059669)', backgroundColor: '#10b981',
    previewBackground: '#ECFDF5', previewAccent: '#10b981', previewEffect: 'pulse',
    motion: { click: { presetId: 'pulse', duration: 260, intensity: 46 } },
  }),

  blockItem({
    id: 'block-click-elastic',
    name: 'Click Elastic Bounce',
    collection: 'Containers', motionStyle: 'Click: Elastic bounce', intensity: 'Bold',
    tags: ['block', 'click', 'elastic', 'bounce'],
    backgroundColor: '#111827',
    previewBackground: '#111827', previewAccent: '#D6F854', previewEffect: 'bounce',
    motion: { click: { presetId: 'elasticBounce', duration: 380, intensity: 70 } },
  }),

  blockItem({
    id: 'block-click-rotate',
    name: 'Click Rotate Tap',
    collection: 'Containers', motionStyle: 'Click: Rotate tap', intensity: 'Medium',
    tags: ['block', 'click', 'rotate'],
    background: 'linear-gradient(135deg,#7c3aed,#4F46E5)', backgroundColor: '#7c3aed',
    previewBackground: '#F5F3FF', previewAccent: '#7c3aed', previewEffect: 'softScale',
    motion: { click: { presetId: 'rotateTap', duration: 220, rotationAngle: 8 } },
  }),
];

export const libraryItems = rawLibraryItems.map(withInteractionDefaults);