/*
 * Configuración de API para CommerCity frontend web.
 *
 * Escenarios soportados:
 * 1) Desarrollo en el servidor o por túnel SSH:
 *    - Frontend: http://localhost:8080
 *    - API:      http://localhost:3000/api/v1
 *
 * 2) Prueba por IP pública/dominio sin proxy:
 *    - Frontend: http://IP:8080
 *    - API:      http://IP:3000/api/v1
 *
 * 3) Producción con Nginx/reverse proxy:
 *    - Frontend y API bajo el mismo host.
 *    - Cambiar API_MODE a 'same-origin' si Nginx expone /api/v1.
 *
 * 4) Dominio externo de API:
 *    - Cambiar API_MODE a 'custom' y definir CUSTOM_API_ORIGIN.
 *
 * También puede sobreescribirse sin editar este archivo antes de cargar módulos:
 *   window.COMMERCITY_API_ORIGIN = 'https://api.midominio.com'
 */

const API_VERSION_PATH = '/api/v1';

function installSafeInnerHTMLGuard() {
  if (typeof window === 'undefined' || typeof Element === 'undefined' || window.__COMMERCITY_SAFE_HTML__) return;
  window.__COMMERCITY_SAFE_HTML__ = true;
  const descriptor = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
  if (!descriptor?.set || !descriptor?.get) return;
  const sanitize = (html) => {
    const template = document.createElement('template');
    descriptor.set.call(template, String(html ?? ''));
    template.content.querySelectorAll('script, iframe, object, embed').forEach((node) => node.remove());
    template.content.querySelectorAll('*').forEach((node) => {
      [...node.attributes].forEach((attr) => {
        const name = attr.name.toLowerCase();
        const value = String(attr.value || '').trim().toLowerCase();
        if (name.startsWith('on') || value.startsWith('javascript:')) node.removeAttribute(attr.name);
      });
    });
    return descriptor.get.call(template);
  };
  Object.defineProperty(Element.prototype, 'innerHTML', {
    configurable: true,
    enumerable: descriptor.enumerable,
    get: descriptor.get,
    set(value) { descriptor.set.call(this, sanitize(value)); },
  });
}

installSafeInnerHTMLGuard();

const API_MODE = 'auto'; // 'auto' | 'same-origin' | 'custom'
const CUSTOM_API_ORIGIN = ''; // Ejemplo: 'https://api.commercity.com'

const runtimeOrigin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
const runtimeProtocol = typeof window !== 'undefined' ? window.location.protocol : 'http:';
const runtimeHostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
const runtimePort = typeof window !== 'undefined' ? window.location.port : '';
const runtimeOverride = typeof window !== 'undefined' ? window.COMMERCITY_API_ORIGIN : '';

function withoutTrailingSlash(value) {
  return String(value || '').replace(/\/+$/, '');
}

function sameHostApiOrigin() {
  return withoutTrailingSlash(runtimeOrigin);
}

function autoApiOrigin() {
  if (runtimeOverride) return withoutTrailingSlash(runtimeOverride);

  const isLocalHost = ['localhost', '127.0.0.1', '0.0.0.0', '::1'].includes(runtimeHostname);
  const isStaticDevServer = runtimePort === '8080' || runtimePort === '5500';

  if (isLocalHost && isStaticDevServer) {
    return `${runtimeProtocol}//${runtimeHostname}:3000`;
  }

  if (!isLocalHost && isStaticDevServer) {
    return `${runtimeProtocol}//${runtimeHostname}:3000`;
  }

  return sameHostApiOrigin();
}

export const API_ORIGIN = API_MODE === 'custom'
  ? withoutTrailingSlash(CUSTOM_API_ORIGIN)
  : API_MODE === 'same-origin'
    ? sameHostApiOrigin()
    : autoApiOrigin();

export const API_BASE_URL = `${API_ORIGIN}${API_VERSION_PATH}`;

export const UPLOADS_BASE_URL = `${API_ORIGIN}/uploads`;
