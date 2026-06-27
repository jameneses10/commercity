function normalizeOrigin(value) {
  return String(value || '').trim().replace(/\/$/, '');
}

function browserApiOrigin() {
  const explicit = normalizeOrigin(window.COMMERCITY_API_ORIGIN || localStorage.getItem('cc_api_origin'));
  if (explicit) return explicit;

  const { protocol, hostname, port, origin } = window.location;
  const localHosts = new Set(['localhost', '127.0.0.1', '0.0.0.0', '']);

  if (localHosts.has(hostname)) {
    return port === '8080' ? 'http://localhost:3000' : origin;
  }

  if (port === '8080') {
    return `${protocol}//${hostname}`;
  }

  return origin;
}

export const API_ORIGIN = browserApiOrigin();
export const API_BASE_URL = `${API_ORIGIN}/api/v1`;
export const UPLOADS_BASE_URL = `${API_ORIGIN}/uploads`;
export const APP_NAME = 'CommerCity';
