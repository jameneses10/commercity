
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

const ICON_PATHS = {
  home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10.5V20h13v-9.5"/><path d="M9.5 20v-5.5h5V20"/>',
  buscar: '<path d="m21 21-4.35-4.35"/><circle cx="11" cy="11" r="6.5"/>',
  carrito: '<path d="M4 5h2.2l2.05 10.2a2 2 0 0 0 2 1.6h6.6a2 2 0 0 0 1.95-1.55L20 9H7.05"/><circle cx="10" cy="20" r="1.4"/><circle cx="17" cy="20" r="1.4"/>',
  chat: '<path d="M5 6.5A3.5 3.5 0 0 1 8.5 3h7A3.5 3.5 0 0 1 19 6.5v5A3.5 3.5 0 0 1 15.5 15H11l-4.5 4v-4.2A3.5 3.5 0 0 1 5 11.5z"/>',
  noti: '<path d="M18 9.6A6 6 0 0 0 6 9.6c0 6-2 6.9-2 6.9h16s-2-.9-2-6.9"/><path d="M10 20a2 2 0 0 0 4 0"/>',
  perfil: '<circle cx="12" cy="8" r="4"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/>',
  tienda: '<path d="M4 10h16l-1.5-5h-13z"/><path d="M6 10v10h12V10"/><path d="M9 20v-6h6v6"/>',
  admin: '<path d="M12 3 5 6v5c0 4.55 2.9 8.75 7 10 4.1-1.25 7-5.45 7-10V6z"/><path d="M9.5 12.2 11.3 14l3.7-4"/>',
  pedidos: '<path d="M7 7h10v10H7z"/><path d="M9 3h6v4H9z"/><path d="M9 12h6"/><path d="M9 15h4"/>',
  config: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.05.05-1.9 3.29-.07-.02a1.65 1.65 0 0 0-1.9.44l-.08.08-3.8-2.2.02-.11a1.65 1.65 0 0 0-.95-1.75h-.1l-3.8 2.2-.08-.08a1.65 1.65 0 0 0-1.9-.44l-.07.02-1.9-3.29.05-.05A1.65 1.65 0 0 0 4.6 15l-.02-.1v-4l.02-.1a1.65 1.65 0 0 0-.33-1.82l-.05-.05 1.9-3.29.07.02a1.65 1.65 0 0 0 1.9-.44l.08-.08 3.8 2.2-.02.11a1.65 1.65 0 0 0 .95 1.75h.1l3.8-2.2.08.08a1.65 1.65 0 0 0 1.9.44l.07-.02 1.9 3.29-.05.05a1.65 1.65 0 0 0-.33 1.82l.02.1v4z"/>',
  plus: '<path d="M12 5v14"/><path d="M5 12h14"/>',
  img: '<rect x="4" y="5" width="16" height="14" rx="2"/><circle cx="9" cy="10" r="1.5"/><path d="m7 17 4-4 3 3 2-2 3 3"/>',
  login: '<path d="M10 17l5-5-5-5"/><path d="M15 12H3"/><path d="M14 4h4a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-4"/>',
  logout: '<path d="M14 17l5-5-5-5"/><path d="M19 12H8"/><path d="M10 20H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h4"/>'
};

const ICON_TITLES = {
  home: 'Home', buscar: 'Buscar', carrito: 'Carrito', chat: 'Chat', noti: 'Notificaciones', perfil: 'Perfil', tienda: 'Tienda', admin: 'Administración', pedidos: 'Pedidos', config: 'Configuración', plus: 'Agregar', img: 'Imagen', login: 'Ingresar', logout: 'Cerrar sesión'
};

export function icon(name, title = ICON_TITLES[name] || 'Icono') {
  return `<svg class="cc-icon" viewBox="0 0 24 24" role="img" aria-hidden="true" focusable="false"><title>${h(title)}</title>${ICON_PATHS[name] || '<circle cx="12" cy="12" r="3"/>'}</svg>`;
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
  return `<header class="topbar"><a class="brand brand-lockup" href="index.html" aria-label="CommerCity inicio"><img class="brand-logo" src="assets/img/logo-commercity.png" alt="Logo CommerCity"><span class="brand-text"><span>Commer</span><span>City</span></span></a><nav class="nav" aria-label="Navegación principal">${navLink({active: active === 'home', key: 'home', href: 'index.html', label: 'Home'})}${navLink({active: active === 'carrito', key: 'carrito', href: 'carrito.html', label: 'Carrito'})}${u ? navLink({active: active === 'pedidos', key: 'pedidos', href: 'perfil.html#orders', label: 'Historial de pedidos'}) : ''}${navLink({active: active === 'chat', key: 'chat', href: 'chat.html', label: 'Chat'})}${navLink({active: active === 'perfil', key: 'perfil', href: 'perfil.html', label: 'Perfil y ajustes'})}${u?.rol === 'vendedor' ? navLink({active: active === 'vendedor', key: 'tienda', href: 'vendedor.html', label: 'Tienda'}) : ''}${u?.rol === 'administrador' ? navLink({active: active === 'admin', key: 'admin', href: 'admin.html', label: 'Administración'}) : ''}<button class="icon-btn nav-icon" id="notifBtn" type="button" aria-label="Notificaciones" title="Notificaciones">${icon('noti', 'Notificaciones')} <span class="badge">${Number(count) || 0}</span></button>${u ? `<button class="icon-btn nav-icon" id="logoutBtn" type="button" aria-label="Cerrar sesión" title="Cerrar sesión">${icon('logout', 'Cerrar sesión')}<span class="sr-only">Cerrar sesión</span></button>` : navLink({active: active === 'login', key: 'login', href: 'login.html', label: 'Ingresar'})}</nav></header><div id="notificationsPanel" class="hidden fixed right-4 top-20 z-50 w-80 card"></div>`;
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
      p.innerHTML = `<div class="flex justify-between items-center mb-3"><h3 class="font-bold">Notificaciones</h3><button id="closeNoti" class="text-sm muted" type="button">Cerrar</button></div><div class="grid gap-2 max-h-96 overflow-auto">${list.map((n) => `<div class="p-3 rounded-2xl ${n.leida ? 'bg-white/70' : 'bg-orange-50 border border-orange-200'}"><b>${h(n.titulo || n.tipo)}</b><p class="text-sm muted">${h(n.mensaje || '')}</p><p class="text-xs muted mt-1">${n.created_at ? new Date(n.created_at).toLocaleString('es-CO') : ''}</p><div class="flex gap-2 mt-2"><button data-id="${Number(n.id) || ''}" class="read text-blue-600 text-sm" type="button">Marcar leída</button><button data-id="${Number(n.id) || ''}" class="del-noti text-red-600 text-sm" type="button">Eliminar</button></div></div>`).join('') || '<p class="muted">Sin notificaciones</p>'}</div><div class="grid grid-cols-2 gap-2 mt-3"><button id="readAll" class="btn btn-secondary" type="button">Marcar todas</button><button id="refreshNoti" class="btn btn-ghost" type="button">Actualizar</button></div><p class="field-hint mt-2">Actualización periódica cada 30 segundos mientras navegas.</p>`;
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
