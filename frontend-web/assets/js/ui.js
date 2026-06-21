
import {currentUser, logout, getToken} from './auth.js';
import {api} from './api.js';

export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];

if (typeof window !== 'undefined' && !window.__COMMERCITY_SIDEBAR_TOGGLE__) {
  window.__COMMERCITY_SIDEBAR_TOGGLE__ = true;
  document.addEventListener('click', (event) => {
    const button = event.target.closest('.side-toggle');
    if (button) button.closest('.sidebar')?.classList.toggle('open');
  });
}

export function h(value) {
  return String(value ?? '').replace(/[&<>'"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c]));
}

export function money(n) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(Number(n || 0));
}

const ICON_FILES = {
  home: 'cc-home.svg', buscar: 'cc-search.svg', carrito: 'cc-shopping-cart.svg', chat: 'cc-chat-messages.svg',
  noti: 'cc-notification-bell.svg', perfil: 'cc-user-profile.svg', tienda: 'cc-store.svg', admin: 'cc-admin-dashboard.svg',
  pedidos: 'cc-order-history.svg', config: 'cc-settings-general.svg', plus: 'cc-action-add-circle.svg', img: 'cc-image-upload-camera.svg',
  login: 'cc-login.svg', logout: 'cc-logout.svg', heart: 'cc-favorites-wishlist.svg', shield: 'cc-privacy-security.svg',
  refund: 'cc-refund.svg', returns: 'cc-return-request.svg', shipping: 'cc-delivery-truck.svg', bank: 'cc-bank-account.svg',
  logs: 'cc-audit-logs.svg', categories: 'cc-categories.svg', products: 'cc-products-management.svg', users: 'cc-users-management.svg',
  reports: 'cc-report-content.svg', security: 'cc-security-lock.svg', evidence: 'cc-evidence-upload.svg'
};

const ICON_TITLES = {
  home: 'Home', buscar: 'Buscar', carrito: 'Carrito', chat: 'Chat', noti: 'Notificaciones', perfil: 'Perfil', tienda: 'Tienda', admin: 'Administración', pedidos: 'Pedidos', config: 'Configuración', plus: 'Agregar', img: 'Imagen', login: 'Ingresar', logout: 'Cerrar sesión', heart: 'Favoritos', refund: 'Reembolsos', returns: 'Devoluciones', shipping: 'Envíos', bank: 'Cuenta bancaria', logs: 'Logs', categories: 'Categorías', products: 'Productos', users: 'Usuarios', reports: 'Reportes', security: 'Seguridad', evidence: 'Evidencias'
};

export function icon(name, title = ICON_TITLES[name] || 'Icono') {
  const file = ICON_FILES[name] || 'cc-notifications.svg';
  return `<img class="cc-icon" src="assets/icons/${file}" alt="${h(title)}" title="${h(title)}" loading="lazy">`;
}

function navLink({active, key, href, label}) {
  return `<a class="nav-icon ${active ? 'active' : ''}" href="${href}" aria-label="${h(label)}" title="${h(label)}">${icon(key, label)}<span class="sr-only">${h(label)}</span></a>`;
}

export function toast(msg, type = 'ok') {
  let w = $('.toast-wrap');
  if (!w) { w = document.createElement('div'); w.className = 'toast-wrap'; document.body.appendChild(w); }
  const t = document.createElement('div');
  t.className = `toast ${type === 'error' ? 'error' : type === 'warn' ? 'warn' : ''}`;
  t.textContent = msg;
  w.appendChild(t);
  setTimeout(() => t.remove(), 4600);
}

export function emptyState(title = 'Sin resultados', detail = 'No hay información para mostrar todavía.') {
  return `<div class="empty-state"><h3 class="text-xl font-bold mb-2">${h(title)}</h3><p>${h(detail)}</p></div>`;
}

export function skeletonProducts(count = 6) {
  return Array.from({ length: count }, () => '<div class="skeleton-card"></div>').join('');
}

export function setLoading(button, isLoading, label = 'Procesando...') {
  if (!button) return;
  if (isLoading) {
    button.dataset.originalText = button.textContent;
    button.disabled = true;
    button.classList.add('is-loading');
    button.textContent = label;
  } else {
    button.disabled = false;
    button.classList.remove('is-loading');
    if (button.dataset.originalText) button.textContent = button.dataset.originalText;
  }
}

export async function withButtonLoading(button, fn, label) {
  setLoading(button, true, label);
  try { return await fn(); }
  finally { setLoading(button, false); }
}

export async function shell(active = 'home') {
  const u = getToken() ? currentUser() : null;
  let count = 0;
  try { if (u && getToken()) count = (await api.get('/notifications/unread-count')).unread_count || 0; } catch {}
  return `<header class="topbar"><a class="brand brand-lockup" href="index.html" aria-label="CommerCity inicio"><img class="brand-logo" src="assets/img/logo-commercity.png" alt="Logo CommerCity"><span class="brand-text"><span>Commer</span><span>City</span></span></a><nav class="nav" aria-label="Navegación principal">${navLink({active: active === 'home', key: 'home', href: 'index.html', label: 'Home'})}${navLink({active: active === 'carrito', key: 'carrito', href: 'carrito.html', label: 'Carrito'})}${u ? navLink({active: active === 'pedidos', key: 'pedidos', href: 'perfil.html#orders', label: 'Historial de pedidos'}) : ''}${navLink({active: active === 'chat', key: 'chat', href: 'chat.html', label: 'Chat'})}${navLink({active: active === 'perfil', key: 'perfil', href: 'perfil.html', label: 'Perfil y ajustes'})}${u?.rol === 'vendedor' ? navLink({active: active === 'vendedor', key: 'tienda', href: 'vendedor.html', label: 'Tienda'}) : ''}${u?.rol === 'administrador' ? navLink({active: active === 'admin', key: 'admin', href: 'admin.html', label: 'Administración'}) : ''}<button class="icon-btn nav-icon" id="notifBtn" type="button" aria-label="Notificaciones" title="Notificaciones">${icon('noti', 'Notificaciones')} <span class="badge">${Number(count) || 0}</span></button>${u ? `<button class="icon-btn nav-icon" id="logoutBtn" type="button" aria-label="Cerrar sesión" title="Cerrar sesión">${icon('logout', 'Cerrar sesión')}<span class="sr-only">Cerrar sesión</span></button>` : navLink({active: active === 'login', key: 'login', href: 'login.html', label: 'Ingresar'})}</nav></header><div id="notificationsPanel" class="notification-panel hidden" aria-live="polite"></div>`;
}

export function bindShell() {
  $('#logoutBtn')?.addEventListener('click', logout);
  let notificationPoll = null;
  async function updateNotificationCount() {
    try {
      if (!getToken()) return;
      const d = await api.get('/notifications/unread-count');
      const badge = $('#notifBtn .badge');
      if (badge) badge.textContent = Number(d.unread_count ?? d.total ?? 0);
    } catch {}
  }
  async function renderNotifications() {
    const p = $('#notificationsPanel');
    if (!p || p.classList.contains('hidden')) return;
    p.innerHTML = '<p class="muted">Cargando notificaciones...</p>';
    try {
      const d = await api.get('/notifications');
      const list = (d.notifications || []).sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
      p.innerHTML = `<div class="notification-header"><h3 class="font-bold">Notificaciones</h3><button id="closeNoti" class="link-button" type="button">Cerrar</button></div><div class="notification-list">${list.map((n) => `<div class="notification-item ${n.leida ? '' : 'unread'}"><b>${h(n.titulo || n.tipo)}</b><p class="text-sm muted">${h(n.mensaje || '')}</p><p class="text-xs muted mt-1">${n.created_at ? new Date(n.created_at).toLocaleString('es-CO') : ''}</p><div class="notification-actions"><button data-id="${Number(n.id) || ''}" class="read" type="button">Marcar leída</button><button data-id="${Number(n.id) || ''}" class="del-noti" type="button">Eliminar</button></div></div>`).join('') || '<p class="muted">Sin notificaciones</p>'}</div><div class="grid grid-cols-2 gap-2 mt-3"><button id="readAll" class="btn btn-secondary" type="button">Marcar todas</button><button id="refreshNoti" class="btn btn-ghost" type="button">Actualizar</button></div><p class="field-hint mt-2">Actualización periódica cada 30 segundos mientras navegas.</p>`;
      $('#closeNoti', p).onclick = () => p.classList.add('hidden');
      $('#refreshNoti', p).onclick = renderNotifications;
      $$('.read', p).forEach((b) => { b.onclick = () => api.patch(`/notifications/${b.dataset.id}/read`, {}).then(async () => { toast('Notificación leída'); await updateNotificationCount(); await renderNotifications(); }).catch((e) => toast(e.message, 'error')); });
      $$('.del-noti', p).forEach((b) => { b.onclick = () => api.delete(`/notifications/${b.dataset.id}`).then(async () => { toast('Notificación eliminada'); await updateNotificationCount(); await renderNotifications(); }).catch((e) => toast(e.message, 'error')); });
      $('#readAll', p).onclick = () => api.patch('/notifications/read-all', {}).then(async () => { toast('Todas leídas'); await updateNotificationCount(); await renderNotifications(); }).catch((e) => toast(e.message, 'error'));
    } catch (e) {
      p.innerHTML = `<p class="text-red-700">${h(e.message || 'Inicia sesión para ver notificaciones.')}</p>`;
    }
  }
  $('#notifBtn')?.addEventListener('click', async () => { const p = $('#notificationsPanel'); p.classList.toggle('hidden'); await renderNotifications(); });
  updateNotificationCount();
  if (!notificationPoll) notificationPoll = setInterval(updateNotificationCount, 30000);
}

export function sidebar(active, role = 'vendedor') {
  const links = role === 'admin'
    ? [['admin', 'Panel', 'admin.html'], ['buscar', 'Búsqueda', 'admin.html#search'], ['perfil', 'Usuarios', 'admin.html#users'], ['noti', 'Reportes', 'admin.html#reports']]
    : [['tienda', 'Mi tienda', 'vendedor.html'], ['plus', 'Productos', 'vendedor.html#products'], ['pedidos', 'Pedidos', 'vendedor.html#orders'], ['chat', 'Chat', 'chat.html'], ['config', 'Perfil', 'perfil.html']];
  return `<aside class="sidebar"><button class="btn btn-secondary mobile-only side-toggle" type="button">Menú</button><div class="side-body"><a class="brand block mb-8" href="index.html"><span>Commer</span><span>City</span></a>${links.map((l) => `<a class="side-link ${active === l[0] ? 'active' : ''}" href="${l[2]}">${icon(l[0], l[1])} ${l[1]}</a>`).join('')}</div></aside>`;
}

export function formDataFrom(form) { return new FormData(form); }

export function preview(input, target) {
  input?.addEventListener('change', () => {
    const box = $(target);
    if (!box) return;
    box.innerHTML = '';
    [...input.files].forEach((f) => {
      const el = document.createElement(f.type.startsWith('image/') ? 'img' : 'div');
      el.className = 'preview';
      if (el.tagName === 'IMG') {
        el.src = URL.createObjectURL(f);
        el.alt = f.name;
      } else {
        el.textContent = f.name;
        el.className += ' grid place-items-center card text-xs';
      }
      box.appendChild(el);
    });
  });
}

export function applyDarkMode(enabled) {
  const legacyKey = ['cc', '_da', 'rk_mode'].join('');
  try { localStorage.removeItem(legacyKey); } catch {}
  document.body.classList.remove(['da', 'rk-mode'].join(''));
  document.body.dataset.solidTheme = enabled ? 'saved' : 'base';
}

export function hydrateDarkMode() {
  applyDarkMode(false);
}

export function confirmDialog({title = 'Confirmar acción', message = '', confirmText = 'Confirmar', danger = false} = {}) {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.className = 'modal-backdrop';
    overlay.innerHTML = `<div class="modal-card"><h2 class="text-2xl font-bold mb-2">${h(title)}</h2><p class="muted mb-5">${h(message)}</p><div class="flex gap-2 justify-end"><button class="btn btn-ghost" data-cancel type="button">Cancelar</button><button class="btn ${danger ? 'btn-danger' : 'btn-primary'}" data-confirm type="button">${h(confirmText)}</button></div></div>`;
    document.body.appendChild(overlay);
    const close = (value) => { overlay.remove(); resolve(value); };
    overlay.querySelector('[data-cancel]').onclick = () => close(false);
    overlay.querySelector('[data-confirm]').onclick = () => close(true);
    overlay.addEventListener('click', (event) => { if (event.target === overlay) close(false); });
    document.addEventListener('keydown', function esc(event) { if (event.key === 'Escape') { document.removeEventListener('keydown', esc); close(false); } }, {once: true});
  });
}

export function promptDialog({title = 'Respuesta requerida', message = '', placeholder = '', textarea = true, confirmText = 'Guardar'} = {}) {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.className = 'modal-backdrop';
    overlay.innerHTML = `<div class="modal-card"><h2 class="text-2xl font-bold mb-2">${h(title)}</h2><p class="muted mb-4">${h(message)}</p>${textarea ? `<textarea class="input" rows="4" placeholder="${h(placeholder)}"></textarea>` : `<input class="input" placeholder="${h(placeholder)}">`}<div class="flex gap-2 justify-end mt-5"><button class="btn btn-ghost" data-cancel type="button">Cancelar</button><button class="btn btn-primary" data-confirm type="button">${h(confirmText)}</button></div></div>`;
    document.body.appendChild(overlay);
    const input = overlay.querySelector('textarea,input');
    input.focus();
    const close = (value) => { overlay.remove(); resolve(value); };
    overlay.querySelector('[data-cancel]').onclick = () => close(null);
    overlay.querySelector('[data-confirm]').onclick = () => close(input.value.trim());
  });
}

hydrateDarkMode();
