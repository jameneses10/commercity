
import {api, assetUrl} from './api.js';
import {shell, bindShell, $, $$, money, toast, h} from './ui.js';
import {addCart} from './cart-store.js';

const id = new URLSearchParams(location.search).get('id');
let product;
let qty = 1;

async function render() {
  app.innerHTML = await shell() + `<main class="container" id="main"><div class="card">Cargando detalle del producto...</div></main>`;
  bindShell();
  try {
    const d = await api.get(`/products/${id}`, {auth: false});
    product = d.product;
    const rev = await api.get(`/products/${id}/reviews`, {auth: false}).catch(() => ({reviews: []}));
    draw(rev.reviews || []);
  } catch (e) {
    toast(e.message, 'error');
    main.innerHTML = `<div class="card"><h1 class="text-2xl font-bold">Producto no encontrado</h1><p class="muted mt-2">${h(e.message || 'Producto no disponible.')}</p><a class="btn btn-secondary mt-4" href="index.html">Volver al catálogo</a></div>`;
  }
}

function stock() {
  return Math.max(0, Number(product?.stock || 0));
}

function draw(reviews) {
  const imgs = (product.imagenes?.length ? product.imagenes : [{url_imagen: product.imagen_url}]).map((i) => assetUrl(i.url_imagen));
  const availableStock = stock();
  const isOut = availableStock <= 0 || product.estado === 'agotado';
  qty = isOut ? 0 : 1;
  main.innerHTML = `<section class="two-col"><div><img id="mainImg" src="${imgs[0]}" class="w-full rounded-[28px] aspect-square object-cover glass" alt="${h(product.nombre)}"><div class="thumbs mt-4">${imgs.map((u, i) => `<img src="${u}" class="${i ? '' : 'active'}" alt="Imagen ${i + 1} de ${h(product.nombre)}">`).join('')}</div></div><aside class="card"><button id="report" class="float-right text-sm muted" type="button">⚑ Reportar</button><span class="pill orange">${h(product.categoria_nombre || 'Producto')}</span><h1 class="text-4xl font-extrabold my-3">${h(product.nombre)}</h1><p class="muted">★ ${h(product.calificacion_promedio || 'Nuevo')} · ${Number(product.total_resenas) || 0} reseñas · <b class="${isOut ? 'text-red-600' : 'text-green-600'}">${isOut ? 'Producto agotado' : `Stock ${availableStock}`}</b></p><div class="price my-5">${money(product.precio_final || product.precio)}</div><p class="muted mb-5">${h(product.descripcion || '')}</p><div class="mb-4"><label class="font-bold muted">Cantidad</label><div class="flex items-center gap-3 mt-2"><button id="minus" class="btn btn-secondary" type="button" ${isOut ? 'disabled' : ''}>−</button><input id="qtyInput" class="input text-center max-w-28" type="number" min="${isOut ? 0 : 1}" max="${availableStock}" value="${qty}" ${isOut ? 'disabled' : ''}><button id="plus" class="btn btn-secondary" type="button" ${isOut ? 'disabled' : ''}>+</button></div><p id="stockMsg" class="field-hint">${isOut ? 'No puedes añadir este producto porque no tiene stock disponible.' : `Puedes comprar máximo ${availableStock} unidades.`}</p></div><button id="add" class="btn btn-primary w-full mb-3" ${isOut ? 'disabled' : ''}>${isOut ? 'Producto agotado' : 'Añadir al carrito'}</button><button id="chat" class="btn btn-secondary w-full">Chatear con el vendedor</button><div class="mt-6 p-4 rounded-2xl bg-white/70"><a id="storeLink" class="auth-link" href="index.html?store=${Number(product.tienda_id) || ''}" title="Vista pública de tienda pendiente de Fase 6.8"><b>${h(product.tienda_nombre || 'Tienda')}</b></a><p class="text-sm muted">${h(product.tienda_slug || 'Vista pública de tienda preparada para Fase 6.8')}</p></div></aside></section><section class="mt-10"><h2 class="text-3xl font-bold mb-4">Reseñas de Clientes</h2><div class="grid gap-4">${reviews.map(reviewCard).join('') || '<p class="muted">Sin reseñas aún.</p>'}</div></section><dialog id="reportDialog" class="card w-[min(92vw,520px)]"><form id="reportForm" class="grid gap-3"><h2 class="text-2xl font-bold">Reportar producto</h2><p class="muted">Cuéntanos el motivo del reporte. El equipo administrador revisará el caso.</p><label>Motivo<select class="select" name="motivo" required><option value="producto falso">Producto falso</option><option value="contenido inapropiado">Contenido inapropiado</option><option value="precio engañoso">Precio engañoso</option><option value="otro">Otro</option></select></label><label>Descripción opcional<textarea class="input" name="descripcion" maxlength="1000" rows="4" placeholder="Describe el problema si necesitas dar más contexto"></textarea></label><div class="flex gap-2 justify-end"><button id="cancelReport" class="btn btn-ghost" type="button">Cancelar</button><button class="btn btn-danger" type="submit">Enviar reporte</button></div></form></dialog>`;

  bindGallery(imgs);
  bindQuantityControls();
  add.onclick = addToCart;
  chat.onclick = startChat;
  report.onclick = openReport;
  cancelReport.onclick = () => reportDialog.close();
  reportForm.onsubmit = sendReport;
}

function reviewCard(r) {
  const stars = Number(r.calificacion || r.estrellas || 5);
  return `<div class="card"><b>${h(r.usuario_nombre || r.comprador_nombre || 'Cliente')}</b><p class="text-amber-500">${'★'.repeat(Math.max(1, Math.min(stars, 5)))}</p><p>${h(r.comentario || '')}</p></div>`;
}

function bindGallery(imgs) {
  $$('.thumbs img').forEach((t, i) => {
    t.onclick = () => {
      mainImg.src = imgs[i];
      $$('.thumbs img').forEach((x) => x.classList.remove('active'));
      t.classList.add('active');
    };
  });
}

function setQty(value) {
  const availableStock = stock();
  if (availableStock <= 0) {
    qty = 0;
    qtyInput.value = 0;
    return;
  }
  const requested = Number(value || 1);
  if (requested > availableStock) {
    qty = availableStock;
    qtyInput.value = availableStock;
    stockMsg.textContent = `Solo hay ${availableStock} unidades disponibles. Ajusté la cantidad al máximo permitido.`;
    toast('La cantidad no puede superar el stock disponible.', 'warn');
    return;
  }
  qty = Math.max(1, requested);
  qtyInput.value = qty;
  stockMsg.textContent = `Puedes comprar máximo ${availableStock} unidades.`;
}

function bindQuantityControls() {
  plus.onclick = () => setQty(qty + 1);
  minus.onclick = () => setQty(qty - 1);
  qtyInput.oninput = () => setQty(qtyInput.value);
  qtyInput.onblur = () => setQty(qtyInput.value);
}

function addToCart() {
  if (stock() <= 0) return toast('Producto agotado. No se puede añadir al carrito.', 'error');
  if (qty > stock()) return toast('La cantidad supera el stock disponible.', 'error');
  addCart(product, qty);
  toast('Agregado al carrito');
}

async function startChat() {
  try {
    const c = await api.post('/chat/conversations', {producto_id: product.id});
    location.href = `chat.html?id=${c.conversation.id}`;
  } catch (e) {
    toast('Inicia sesión para chatear', 'error');
  }
}

function openReport() {
  if (typeof reportDialog.showModal === 'function') reportDialog.showModal();
  else reportDialog.setAttribute('open', 'open');
}

async function sendReport(e) {
  e.preventDefault();
  const btn = reportForm.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.textContent = 'Enviando...';
  try {
    await api.post(`/products/${product.id}/report`, Object.fromEntries(new FormData(reportForm)));
    toast('Reporte enviado correctamente');
    reportForm.reset();
    reportDialog.close();
  } catch (err) {
    toast(err.message, 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Enviar reporte';
  }
}

render();
