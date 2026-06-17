
import {api, assetUrl} from './api.js';
import {shell, bindShell, $, money, toast, preview, h, withButtonLoading, emptyState} from './ui.js';
import {requireAuth} from './auth.js';

let user = null;
let profile = null;
let orders = [];
let shipments = [];

async function render() {
  app.innerHTML = await shell('perfil') + `<main class="container"><section class="two-col"><div class="card"><h1 class="text-4xl font-extrabold mb-4">Perfil</h1><div id="info"></div></div><form id="form" class="card grid gap-3"><h2 class="text-2xl font-bold">Actualizar perfil</h2><input class="input" type="file" name="foto" id="foto" accept="image/*"><div id="preview" class="thumbs"></div><textarea class="input" name="descripcion_personal" rows="5" placeholder="Descripción personal"></textarea><button class="btn btn-primary" type="submit">Guardar cambios</button></form></section><section id="orders" class="card mt-6"><div class="flex justify-between gap-3 items-start mb-4"><div><h2 class="text-2xl font-bold">Mis pedidos</h2><p class="muted">Historial de compras y estado general de pedidos.</p></div><button id="reloadOrders" class="btn btn-secondary" type="button">Actualizar</button></div><div id="ordersBox"></div></section><section id="shipments" class="card mt-6"><div class="flex justify-between gap-3 items-start mb-4"><div><h2 class="text-2xl font-bold">Mis envíos</h2><p class="muted">Rastreo independiente de paquetes por tienda.</p></div><button id="reloadShipments" class="btn btn-secondary" type="button">Actualizar</button></div><div id="shipmentsBox"></div></section></main>`;
  bindShell();
  user = await requireAuth(api);
  profile = (await api.get('/profile')).profile;
  drawProfile();
  preview(foto, '#preview');
  form.onsubmit = saveProfile;
  reloadOrders.onclick = loadOrders;
  reloadShipments.onclick = loadShipments;
  await Promise.all([loadOrders(), loadShipments()]);
}

function drawProfile() {
  info.innerHTML = `<img src="${assetUrl(profile.foto_perfil_url || user.foto_perfil_url)}" class="w-28 h-28 rounded-full object-cover mb-4" alt="Foto de perfil"><h2 class="text-2xl font-bold">${h(user.nombre)}</h2><p class="pill">${h(user.rol)}</p><p class="muted mt-3">${h(profile.descripcion_personal || user.descripcion_personal || 'Sin descripción')}</p><p class="mt-4">Seguidores: <b>${Number(profile.total_seguidores) || 0}</b> · Siguiendo: <b>${Number(profile.total_siguiendo) || 0}</b></p><div class="flex gap-2 flex-wrap mt-5"><a class="btn btn-secondary" href="#orders">Ver mis pedidos</a><a class="btn btn-secondary" href="#shipments">Ver envíos</a><a class="btn btn-secondary" href="chat.html">Chat</a></div>`;
  form.descripcion_personal.value = profile.descripcion_personal || '';
}

async function saveProfile(e) {
  e.preventDefault();
  const btn = form.querySelector('button');
  await withButtonLoading(btn, async () => {
    try {
      await api.form('/profile', new FormData(form), {method: 'PATCH'});
      toast('Perfil actualizado');
      location.reload();
    } catch (err) {
      toast(err.message, 'error');
    }
  }, 'Guardando perfil...');
}

async function loadOrders() {
  ordersBox.innerHTML = '<p class="muted">Cargando pedidos...</p>';
  try {
    const d = await api.get('/orders/my-orders');
    orders = d.orders || [];
    drawOrders();
  } catch (e) {
    ordersBox.innerHTML = `<div class="empty-state"><h3 class="font-bold">Pedidos no disponibles</h3><p>${h(e.message)}</p></div>`;
  }
}

function drawOrders() {
  if (!orders.length) {
    ordersBox.innerHTML = emptyState('Aún no tienes pedidos', 'Cuando finalices una compra, aparecerá aquí con su estado de pago y avance general.');
    return;
  }
  ordersBox.innerHTML = orders.map(orderCard).join('');
}

function orderCard(order) {
  const details = order.details || order.detalles || [];
  return `<article class="p-4 rounded-3xl bg-white/70 border border-orange-100 mb-4"><div class="flex flex-wrap justify-between gap-3"><div><h3 class="text-xl font-bold">Orden #${Number(order.id) || ''}</h3><p class="muted text-sm">${formatDate(order.created_at || order.fecha || order.updated_at)}</p></div><div class="text-right"><p class="price text-2xl">${money(order.total)}</p><p><span class="pill">Pago: ${h(order.estado_pago || 'pendiente')}</span> <span class="pill orange">Estado: ${h(order.estado_general || 'creado')}</span></p></div></div><div class="mt-4 grid gap-2">${details.length ? details.map(detailLine).join('') : '<p class="muted">Detalle de productos no devuelto por backend en este listado.</p>'}</div></article>`;
}

function detailLine(d) {
  return `<div class="flex justify-between gap-3 border-t border-orange-100 pt-2"><div><b>${h(d.producto_nombre || d.nombre || `Producto #${d.producto_id}`)}</b><p class="muted text-sm">Tienda: ${h(d.tienda_nombre || d.tienda || `#${d.tienda_id || ''}`)} · Cantidad: ${Number(d.cantidad) || 0}</p></div><b>${money(d.subtotal || Number(d.precio_unitario || 0) * Number(d.cantidad || 0))}</b></div>`;
}

async function loadShipments() {
  shipmentsBox.innerHTML = '<p class="muted">Cargando envíos...</p>';
  try {
    const d = await api.get('/shipments/my-shipments');
    shipments = d.shipments || d.envios || [];
    drawShipments();
  } catch (e) {
    shipmentsBox.innerHTML = `<div class="empty-state"><h3 class="font-bold">Envíos no disponibles</h3><p>${h(e.message)}</p></div>`;
  }
}

function drawShipments() {
  if (!shipments.length) {
    shipmentsBox.innerHTML = emptyState('Sin envíos por rastrear', 'Cuando una orden pagada genere paquetes, verás aquí transportadora, guía, tienda y estado.');
    return;
  }
  shipmentsBox.innerHTML = `<div class="grid md:grid-cols-2 gap-4">${shipments.map((s) => `<article class="card"><div class="flex justify-between gap-2"><h3 class="font-bold">Envío #${Number(s.id) || ''}</h3><span class="pill orange">${h(s.estado || 'pendiente')}</span></div><p class="muted mt-2">Pedido relacionado: <b>#${Number(s.pedido_id) || ''}</b></p><p>Tienda: <b>${h(s.tienda_nombre || `#${s.tienda_id || ''}`)}</b></p><p>Transportadora: <b>${h(s.transportadora || 'Pendiente')}</b></p><p>Número de guía: <b>${h(s.numero_guia || 'Pendiente')}</b></p><p class="text-sm muted mt-2">Creado: ${formatDate(s.created_at)} ${s.fecha_envio ? `· Enviado: ${formatDate(s.fecha_envio)}` : ''} ${s.fecha_entrega ? `· Entregado: ${formatDate(s.fecha_entrega)}` : ''}</p></article>`).join('')}</div>`;
}

function formatDate(value) {
  if (!value) return 'Fecha no disponible';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? h(value) : date.toLocaleString('es-CO');
}

render();
