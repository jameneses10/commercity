
import {currentUser, logout} from './auth.js';
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

export function icon(name) {
  const m = { home: '⌂', buscar: '⌕', carrito: '🛒', chat: '▣', noti: '🔔', perfil: '◉', tienda: '▤', admin: '▦', pedidos: '↺', config: '⚙', plus: '＋', img: '▧' };
  return `<span aria-hidden="true">${m[name] || '•'}</span>`;
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
  const u = currentUser();
  let count = 0;
  try { if (u) count = (await api.get('/notifications/unread-count')).unread_count || 0; } catch {}
  return `<header class="topbar"><a class="brand" href="index.html"><span>Commer</span><span>City</span></a><nav class="nav"><a class="${active === 'home' ? 'active' : ''}" href="index.html">${icon('home')} Home</a><a class="${active === 'carrito' ? 'active' : ''}" href="carrito.html">${icon('carrito')} Carrito</a><a class="${active === 'chat' ? 'active' : ''}" href="chat.html">${icon('chat')} Chat</a><a class="${active === 'perfil' ? 'active' : ''}" href="perfil.html">${icon('perfil')} Perfil</a>${u?.rol === 'vendedor' ? `<a class="${active === 'vendedor' ? 'active' : ''}" href="vendedor.html">${icon('tienda')} Tienda</a>` : ''}${u?.rol === 'administrador' ? `<a class="${active === 'admin' ? 'active' : ''}" href="admin.html">${icon('admin')} Admin</a>` : ''}<button class="icon-btn" id="notifBtn" type="button">${icon('noti')} <span class="badge">${Number(count) || 0}</span></button>${u ? '<button class="icon-btn" id="logoutBtn" type="button">Salir</button>' : '<a href="login.html">Ingresar</a>'}</nav></header><div id="notificationsPanel" class="hidden fixed right-4 top-20 z-50 w-80 card"></div>`;
}

export function bindShell() {
  $('#logoutBtn')?.addEventListener('click', logout);
  $('#notifBtn')?.addEventListener('click', async () => {
    const p = $('#notificationsPanel');
    p.classList.toggle('hidden');
    if (p.classList.contains('hidden')) return;
    p.innerHTML = '<p class="muted">Cargando notificaciones...</p>';
    try {
      const d = await api.get('/notifications');
      const list = d.notifications || [];
      p.innerHTML = `<h3 class="font-bold mb-3">Notificaciones</h3><div class="grid gap-2">${list.map((n) => `<div class="p-3 rounded-2xl bg-white/70"><b>${h(n.titulo || n.tipo)}</b><p class="text-sm muted">${h(n.mensaje || '')}</p><button data-id="${Number(n.id) || ''}" class="read text-blue-600 text-sm">Marcar leída</button></div>`).join('') || '<p class="muted">Sin notificaciones</p>'}</div><button id="readAll" class="btn btn-secondary mt-3 w-full" type="button">Marcar todas</button>`;
      $$('.read', p).forEach((b) => { b.onclick = () => api.patch(`/notifications/${b.dataset.id}/read`, {}).then(() => toast('Notificación leída')).catch((e) => toast(e.message, 'error')); });
      $('#readAll', p).onclick = () => api.patch('/notifications/read-all', {}).then(() => toast('Todas leídas')).catch((e) => toast(e.message, 'error'));
    } catch (e) {
      p.innerHTML = `<p class="text-red-700">${h(e.message || 'Inicia sesión para ver notificaciones.')}</p>`;
    }
  });
}

export function sidebar(active, role = 'vendedor') {
  const links = role === 'admin'
    ? [['admin', 'Panel', 'admin.html'], ['buscar', 'Búsqueda', 'admin.html#search'], ['perfil', 'Usuarios', 'admin.html#users'], ['noti', 'Reportes', 'admin.html#reports']]
    : [['tienda', 'Mi tienda', 'vendedor.html'], ['plus', 'Productos', 'vendedor.html#products'], ['pedidos', 'Pedidos', 'vendedor.html#orders'], ['chat', 'Chat', 'chat.html'], ['config', 'Perfil', 'perfil.html']];
  return `<aside class="sidebar"><button class="btn btn-secondary mobile-only side-toggle" type="button">Menú</button><div class="side-body"><a class="brand block mb-8" href="index.html"><span>Commer</span><span>City</span></a>${links.map((l) => `<a class="side-link ${active === l[0] ? 'active' : ''}" href="${l[2]}">${icon(l[0])} ${l[1]}</a>`).join('')}</div></aside>`;
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
