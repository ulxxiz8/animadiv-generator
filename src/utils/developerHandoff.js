import { generateFullCSS } from './generateCss';
import { generateHtml } from './generateHtml';

export const HANDOFF_STORAGE_PREFIX = 'animadiv-developer-handoff:';

const encodePayload = (payload) => {
  const json = JSON.stringify(payload);
  const bytes = new TextEncoder().encode(json);
  const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join(
    ''
  );
  return btoa(binary)
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '');
};

const decodePayload = (value) => {
  try {
    const normalized = String(value || '')
      .replaceAll('-', '+')
      .replaceAll('_', '/');
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      '='
    );
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return null;
  }
};

export const createDeveloperHandoffUrl = (payload) => {
  const url = new URL(window.location.href);
  url.searchParams.delete('handoff');
  url.hash = `handoff=${encodePayload(payload)}`;
  return url.toString();
};

export const createCodeBundle = (params, cssOverride) => {
  const html = generateHtml(params).trim();
  const css = (cssOverride || generateFullCSS(params)).trim();

  return {
    html,
    css,
    combined: `${html}

<style>
${css}
</style>`,
  };
};

export const createDeveloperHandoff = ({ params, css, title }) => {
  const id = `handoff_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  const bundle = createCodeBundle(params, css);
  const payload = {
    id,
    title: title || params?.name || params?.type || 'AnimaDiv element',
    createdAt: new Date().toISOString(),
    params,
    bundle,
  };

  localStorage.setItem(
    `${HANDOFF_STORAGE_PREFIX}${id}`,
    JSON.stringify(payload)
  );

  return {
    ...payload,
    url: createDeveloperHandoffUrl(payload),
  };
};

export const createDeveloperHandoffFromBundle = ({ bundle, title }) => {
  const id = `handoff_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  const payload = {
    id,
    title: title || 'AnimaDiv UI Kit section',
    createdAt: new Date().toISOString(),
    bundle,
  };

  localStorage.setItem(
    `${HANDOFF_STORAGE_PREFIX}${id}`,
    JSON.stringify(payload)
  );

  return {
    ...payload,
    url: createDeveloperHandoffUrl(payload),
  };
};

export const readDeveloperHandoff = (id) => {
  if (!id) return null;

  const decoded = decodePayload(id);
  if (decoded) return decoded;

  try {
    const raw = localStorage.getItem(`${HANDOFF_STORAGE_PREFIX}${id}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
