
import {api, assetUrl} from './api.js';
import {shell, bindShell, $, money, toast, h, emptyState, icon} from './ui.js';
import {currentUser} from './auth.js';

const id = new URLSearchParams(location.search).get('id');
let store = null;
let reputation = null;
let products = [];

async function render() {
  app.innerHTML = await shell('home') + `<main class="container"><div id="storeBox" class="card">Cargando tienda...</div><section class="mt-8"><h2 class="text-3xl font-bold mb-4">Productos de la tienda</h2><div id="productGrid" class="grid-products"></div></section></main>`;
  bindShell();
  await load();
}

async function load() {
  try {
    const [s, r, p] = await Promise.all([
      api.get(`/stores/${id}`, {auth: false}),
      api.get(`/stores/${id}/reputation`, {auth: false}).catch(() => ({})),
      api.get(`/stores/${id}/products?limit=50`, {auth: false}).catch(() => ({products: []})),
    ]);
    store = s.store;
    reputation = r.reputation || r;
    products = p.products || [];
    drawStore();
    drawProducts();
  } catch (e) {
    storeBox.innerHTML = `<h1 class="text-2xl font-bold">Tienda no encontrada</h1><p class="muted mt-2">${h(e.message)}</p><a class="btn btn-secondary mt-4" href="index.html">Volver al catálogo</a>`;
  }
}

function reputationLevel() {
  const explicit = store?.nivel_reputacion || reputation?.nivel_reputacion;
  if (explicit) return explicit;
  const avg = Number(reputation?.promedio || store?.reputacion_promedio || 0);
  if (avg >= 4.5) return 'Platino';
  if (avg >= 4) return 'Oro';
  return 'Regular';
}

function drawStore() {
  const avg = Number(reputation?.promedio || store?.reputacion_promedio || 0);
  const total = Number(reputation?.total || store?.total_resenas || 0);
  storeBox.innerHTML = `<section class="hero"><div class="min-h-56 rounded-[28px] p-8 flex items-end" style="background:#2276ff"><div><img src="${assetUrl(store.logo_url)}" class="w-24 h-24 rounded-3xl object-cover bg-white p-2" alt="Logo ${h(store.nombre)}"><h1 class="text-4xl font-extrabold text-white mt-3">${h(store.nombre)}</h1><div class="flex gap-2 flex-wrap mt-3"><span class="pill">Estado: ${h(store.estado)}</span><span class="pill orange">Nivel: ${h(reputationLevel())}</span><span class="pill">★ ${avg.toFixed(1)} · ${total} reseñas</span></div></div></div><p class="mt-5 muted text-lg">${h(store.descripcion || 'Tienda sin descripción pública.')}</p><div class="flex gap-3 flex-wrap mt-5"><button id="chatStore" class="btn btn-primary" type="button">${icon('chat', 'Chat')} Chatear con vendedor</button>${store.usuario_id ? `<a class="btn btn-secondary" href="perfil-publico.html?id=${Number(store.usuario_id)}">Ver perfil del vendedor</a>` : ''}${store.usuario_id ? `<button id="followSeller" class="btn btn-ghost" type="button">Seguir vendedor</button>` : ''}</div></section>`;
  $('#chatStore')?.addEventListener('click', startChat);
  $('#followSeller')?.addEventListener('click', followSeller);
}

function drawProducts() {
  productGrid.innerHTML = products.length ? products.map(card).join('') : emptyState('Sin productos activos', 'Esta tienda no tiene productos visibles actualmente.');
}

function card(p) {
  const out = Number(p.stock || 0) <= 0 || p.estado === 'agotado';
  return `<article class="product-card"><a href="producto.html?id=${Number(p.id) || ''}"><img src="${assetUrl(p.imagenes?.[0]?.url_imagen || p.imagen_url)}" alt="${h(p.nombre)}"></a><div class="mt-4"><span class="pill orange">${h(p.categoria_nombre || 'Producto')}</span><h3 class="text-xl font-bold mt-2">${h(p.nombre)}</h3><p class="muted line-clamp-2">${h(p.descripcion || '')}</p><div class="flex justify-between items-center mt-3"><div class="price">${money(p.precio_final || p.precio)}</div><span class="text-sm ${out ? 'text-red-700' : 'text-green-700'}">${out ? 'Agotado' : `Stock ${Number(p.stock) || 0}`}</span></div><a class="btn btn-secondary mt-4 w-full" href="producto.html?id=${Number(p.id) || ''}">Ver detalle</a></div></article>`;
}

async function startChat() {
  try {
    const d = await api.post('/chat/conversations', {tienda_id: store.id});
    location.href = `chat.html?id=${d.conversation.id}`;
  } catch (e) {
    toast('Inicia sesión como comprador para chatear con el vendedor.', 'error');
  }
}

async function followSeller() {
  if (!store.usuario_id) return;
  if (currentUser()?.id === store.usuario_id) return toast('No puedes seguirte a ti mismo.', 'warn');
  try {
    await api.post(`/profiles/${store.usuario_id}/follow`, {});
    toast('Ahora sigues a este vendedor');
    $('#followSeller').textContent = 'Siguiendo';
  } catch (e) {
    toast(e.message, 'error');
  }
}

render();
