const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const escapeAttr = escapeHtml;

const getClassAttr = () => 'class="animadiv-element"';

const renderContent = (value, fallback = '') => {
  const text = value || fallback;
  return escapeHtml(text);
};

const TYPOGRAPHY_PRESETS = new Set([
  'fadeByLine',
  'slideUpReveal',
  'fadeByWord',
  'blurReveal',
  'underlineDraw',
  'fadeByLetter',
  'typewriter',
]);

const getTypographyPreset = (params = {}) => {
  const animations = params.animations || {};
  const states = ['load', 'hover', 'click'];
  return (
    states
      .map((state) => animations[state]?.presetId)
      .find((presetId) => TYPOGRAPHY_PRESETS.has(presetId)) || 'none'
  );
};

const splitTextByLine = (text) =>
  String(text)
    .split('\n')
    .map(
      (line, index) =>
        `<span class="anim-line" style="display: block; --line-index: ${index};"><span class="anim-inner" style="display: block;">${line ? escapeHtml(line) : '&nbsp;'}</span></span>`
    )
    .join('');

const splitTextByWord = (text) => {
  let wordIndex = 0;

  return String(text)
    .split(/(\s+)/)
    .map((part) => {
      if (!part.trim()) {
        return `<span style="white-space: pre;">${escapeHtml(part)}</span>`;
      }

      const currentIndex = wordIndex;
      wordIndex += 1;

      return `<span class="anim-word" style="display: inline-block; vertical-align: bottom;"><span class="anim-inner" style="display: inline-block; --word-index: ${currentIndex};">${escapeHtml(part)}</span></span>`;
    })
    .join('');
};

const splitTextByLetter = (text) => {
  let charIndex = 0;

  return String(text)
    .split(/(\s+)/)
    .map((part) => {
      if (!part.trim()) {
        return `<span style="white-space: pre;">${escapeHtml(part)}</span>`;
      }

      const letters = Array.from(part)
        .map((char) => {
          const currentIndex = charIndex;
          charIndex += 1;

          return `<span class="anim-char" style="display: inline-block; --char-index: ${currentIndex};">${escapeHtml(char)}</span>`;
        })
        .join('');

      return `<span class="anim-word" style="display: inline-block; white-space: nowrap; vertical-align: bottom;">${letters}</span>`;
    })
    .join('');
};

const renderAnimatedContent = (params, value, fallback = '') => {
  const text = value || fallback;
  const presetId = getTypographyPreset(params);

  if (presetId === 'fadeByLine' || presetId === 'slideUpReveal') {
    return splitTextByLine(text);
  }

  if (
    presetId === 'fadeByWord' ||
    presetId === 'blurReveal' ||
    presetId === 'underlineDraw'
  ) {
    return splitTextByWord(text);
  }

  if (presetId === 'fadeByLetter' || presetId === 'typewriter') {
    return splitTextByLetter(text);
  }

  return renderContent(text);
};


const renderInlineContent = (params, value, fallback = '') =>
  renderAnimatedContent(params, value, fallback).trim();

const getTextTag = (tag) => {
  const allowedTags = new Set(['p', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']);
  return allowedTags.has(tag) ? tag : 'p';
};

export const generateHtml = (params = {}) => {
  const type = params.type || 'block';
  const tag = params.tag || 'div';
  const settings = params.specificSettings || {};
  const content = params.content || '';
  const classAttr = getClassAttr();

  switch (type) {
    case 'button':
      if (settings.actionType === 'link') {
        return `<a ${classAttr} href="${escapeAttr(settings.href || '#')}" target="${escapeAttr(settings.target || '_self')}" role="button"><span class="animadiv-content">${renderInlineContent(params, settings.text || content, 'Button')}</span></a>`;
      }
      return `<button ${classAttr} type="button"><span class="animadiv-content">${renderInlineContent(params, settings.text || content, 'Button')}</span></button>`;

    case 'input':
      return `<input ${classAttr} type="${escapeAttr(settings.inputType || 'text')}" placeholder="${escapeAttr(settings.placeholder || '')}"${settings.disabled ? ' disabled' : ''}${settings.validationState === 'error' ? ' aria-invalid="true"' : ''} />`;

    case 'textarea':
      return `<textarea ${classAttr} placeholder="${escapeAttr(settings.placeholder || '')}" rows="${escapeAttr(settings.rows || 4)}"${settings.disabled ? ' disabled' : ''}${settings.validationState === 'error' ? ' aria-invalid="true"' : ''}></textarea>`;

    case 'text': {
      const textTag = getTextTag(settings.tag || tag);
      return `<${textTag} ${classAttr}>${renderInlineContent(params, settings.content || content, 'Text')}</${textTag}>`;
    }

    case 'image':
      return `<img ${classAttr} src="${escapeAttr(settings.src || '')}" alt="${escapeAttr(settings.alt || 'image')}" loading="${escapeAttr(settings.loading || 'lazy')}" />`;

    case 'link':
      return `<a ${classAttr} href="${escapeAttr(settings.href || '#')}" target="${escapeAttr(settings.target || '_self')}"><span class="animadiv-content">${renderInlineContent(params, settings.text || content, 'Link')}</span></a>`;

    case 'checkbox':
      return `<label ${classAttr}>
  <input type="checkbox"${settings.checked ? ' checked' : ''}${settings.disabled ? ' disabled' : ''} />
  <span>${renderContent(settings.label || content, 'Checkbox')}</span>
</label>`;

    case 'radio':
      return `<label ${classAttr}>
  <input type="radio" name="${escapeAttr(settings.name || 'radioGroup')}"${settings.checked ? ' checked' : ''}${settings.disabled ? ' disabled' : ''} />
  <span>${renderContent(settings.label || content, 'Radio')}</span>
</label>`;

    case 'block':
    default:
      return `<div ${classAttr}>
  ${renderContent(content, 'Inner Content')}
</div>`;
  }
};
