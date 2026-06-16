
import {API_BASE_URL, API_ORIGIN} from './config.js';
import {getToken, clearSession} from './auth.js';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=70';

export function assetUrl(url) {
  if (!url) return FALLBACK_IMAGE;
  if (String(url).startsWith('http')) return url;
  return API_ORIGIN + url;
}

function validationMessage(payload) {
  const errors = payload?.errors || payload?.data?.errors;
  if (Array.isArray(errors) && errors.length) {
    return errors.map((e) => e.message || `${e.field || 'campo'} inválido`).join(' · ');
  }
  return payload?.message || payload?.error || '';
}

function friendlyMessage(status, payload, originalError) {
  if (originalError?.name === 'TypeError') return 'No se pudo conectar con el servidor. Verifica backend, túnel SSH o conexión.';
  if (status === 400) return validationMessage(payload) || 'Datos inválidos. Revisa los campos marcados.';
  if (status === 401) return validationMessage(payload) || 'Tu sesión expiró. Inicia sesión nuevamente.';
  if (status === 403) return validationMessage(payload) || 'Acceso no permitido para tu rol.';
  if (status === 404) return validationMessage(payload) || 'Recurso no encontrado.';
  if (status >= 500) return 'Ocurrió un error del servidor. Intenta de nuevo en unos minutos.';
  return validationMessage(payload) || `Error HTTP ${status}`;
}

async function request(path, { method = 'GET', body, form = false, auth = true } = {}) {
  const headers = {};
  if (!form) headers['Content-Type'] = 'application/json';
  const token = getToken();
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(API_BASE_URL + path, {
      method,
      headers,
      body: form ? body : (body ? JSON.stringify(body) : undefined),
    });
  } catch (originalError) {
    const e = new Error(friendlyMessage(0, null, originalError));
    e.status = 0;
    throw e;
  }

  let json = {};
  try { json = await res.json(); } catch {}

  if (res.status === 401) {
    clearSession();
    if (!location.pathname.endsWith('/login.html')) location.href = 'login.html';
  }

  if (!res.ok) {
    const e = new Error(friendlyMessage(res.status, json));
    e.status = res.status;
    e.payload = json;
    throw e;
  }

  return json.data ?? json;
}

export const api = {
  get: (p, o) => request(p, { ...o, method: 'GET' }),
  post: (p, b, o) => request(p, { ...o, method: 'POST', body: b }),
  patch: (p, b, o) => request(p, { ...o, method: 'PATCH', body: b }),
  delete: (p, o) => request(p, { ...o, method: 'DELETE' }),
  form: (p, fd, { method = 'POST', auth = true } = {}) => request(p, { method, body: fd, form: true, auth }),
};
