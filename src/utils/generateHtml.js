export const generateHtml = (params, className = 'ag-animated') => {
  const tag = params.elementType || 'div';

  switch (tag) {
    case 'button':
      return `<button class="${className}">
  Button
</button>`;

    // ТАСКА: Якщо elementType=icon, повернути span з svg
    case 'icon':
      return `<span class="${className}">
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
</span>`;

    case 'article':
      return `<article class="${className}">
  <div style="width: 20px; height: 4px; background: rgba(255,255,255,0.5); border-radius: 2px; margin-bottom: 4px;"></div>
  <div style="width: 30px; height: 4px; background: rgba(255,255,255,0.5); border-radius: 2px;"></div>
</article>`;

    case 'div':
    default:
      return `<div class="${className}">
  ${params.presetId}
</div>`;
  }
};
