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
        return `<a ${classAttr} href="${escapeAttr(settings.href || '#')}" target="${escapeAttr(settings.target || '_self')}" role="button">
  ${renderContent(settings.text || content, 'Button')}
</a>`;
      }
      return `<button ${classAttr}>
  ${renderContent(settings.text || content, 'Button')}
</button>`;

    case 'input':
      return `<input ${classAttr} type="${escapeAttr(settings.inputType || 'text')}" placeholder="${escapeAttr(settings.placeholder || '')}"${settings.disabled ? ' disabled' : ''}${settings.validationState === 'error' ? ' aria-invalid="true"' : ''} />`;

    case 'textarea':
      return `<textarea ${classAttr} placeholder="${escapeAttr(settings.placeholder || '')}" rows="${escapeAttr(settings.rows || 4)}"${settings.disabled ? ' disabled' : ''}${settings.validationState === 'error' ? ' aria-invalid="true"' : ''}></textarea>`;

    case 'text': {
      const textTag = getTextTag(settings.tag || tag);
      return `<${textTag} ${classAttr}>
  ${renderContent(settings.content || content, 'Text')}
</${textTag}>`;
    }

    case 'image':
      return `<img ${classAttr} src="${escapeAttr(settings.src || '')}" alt="${escapeAttr(settings.alt || 'image')}" loading="${escapeAttr(settings.loading || 'lazy')}" />`;

    case 'link':
      return `<a ${classAttr} href="${escapeAttr(settings.href || '#')}" target="${escapeAttr(settings.target || '_self')}">
  ${renderContent(settings.text || content, 'Link')}
</a>`;

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
