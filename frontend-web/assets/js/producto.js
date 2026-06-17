
import {api, assetUrl} from './api.js';
import {shell, bindShell, $, $$, money, toast, h} from './ui.js';
import {addCart} from './cart-store.js';
import {currentUser} from './auth.js';

const id = new URLSearchParams(location.search).get('id');
let product;
let reviews = [];
let qty = 1;

async function render() {
  app.innerHTML = await shell() + `<main class="container" id="main"><div class="card">Cargando detalle del producto...</div></main>`;
  bindShell();
  try {
    const d = await api.get(`/products/${id}`, {auth: false});
    product = d.product;
    const rev = await api.get(`/products/${id}/reviews`, {auth: false}).catch(() => ({reviews: []}));
    reviews = rev.reviews || [];
    draw();
  } catch (e) {
    toast(e.message, 'error');
    main.innerHTML = `<div class="card"><h1 class="text-2xl font-bold">Producto no encontrado</h1><p class="muted mt-2">${h(e.message || 'Producto no disponible.')}</p><a class="btn btn-secondary mt-4" href="index.html">Volver al catálogo</a></div>`;
  }
}

function stock() { return Math.max(0, Number(product?.stock || 0)); }
function avgReviews() { return reviews.length ? (reviews.reduce((s, r) => s + Number(r.estrellas || r.calificacion || 0), 0) / reviews.length).toFixed(1) : Number(product.calificacion_promedio || 0).toFixed(1); }

function draw() {
  const imgs = (product.imagenes?.length ? product.imagenes : [{url_imagen: product.imagen_url}]).map((i) => assetUrl(i.url_imagen));
  const availableStock = stock();
  const isOut = availableStock <= 0 || product.estado === 'agotado';
  qty = isOut ? 0 : 1;
  main.innerHTML = `<section class="two-col"><div><img id="mainImg" src="${imgs[0]}" class="w-full rounded-[28px] aspect-square object-cover glass" alt="${h(product.nombre)}"><div class="thumbs mt-4">${imgs.map((u, i) => `<img src="${u}" class="${i ? '' : 'active'}" alt="Imagen ${i + 1} de ${h(product.nombre)}">`).join('')}</div></div><aside class="card"><button id="report" class="float-right text-sm muted" type="button">⚑ Reportar</button><span class="pill orange">${h(product.categoria_nombre || 'Producto')}</span><h1 class="text-4xl font-extrabold my-3">${h(product.nombre)}</h1><p class="muted">★ ${avgReviews()} · ${reviews.length || Number(product.total_resenas) || 0} reseñas aprobadas · <b class="${isOut ? 'text-red-600' : 'text-green-600'}">${isOut ? 'Producto agotado' : `Stock ${availableStock}`}</b></p><div class="price my-5">${money(product.precio_final || product.precio)}</div><p class="muted mb-5">${h(product.descripcion || '')}</p><div class="mb-4"><label class="font-bold muted">Cantidad</label><div class="flex items-center gap-3 mt-2"><button id="minus" class="btn btn-secondary" type="button" ${isOut ? 'disabled' : ''}>−</button><input id="qtyInput" class="input text-center max-w-28" type="number" min="${isOut ? 0 : 1}" max="${availableStock}" value="${qty}" ${isOut ? 'disabled' : ''}><button id="plus" class="btn btn-secondary" type="button" ${isOut ? 'disabled' : ''}>+</button></div><p id="stockMsg" class="field-hint">${isOut ? 'No puedes añadir este producto porque no tiene stock disponible.' : `Puedes comprar máximo ${availableStock} unidades.`}</p></div><button id="add" class="btn btn-primary w-full mb-3" ${isOut ? 'disabled' : ''}>${isOut ? 'Producto agotado' : 'Añadir al carrito'}</button><button id="chat" class="btn btn-secondary w-full">Chatear con el vendedor</button><div class="mt-6 p-4 rounded-2xl bg-white/70"><a id="storeLink" class="auth-link" href="tienda.html?id=${Number(product.tienda_id) || ''}"><b>${h(product.tienda_nombre || 'Tienda')}</b></a><p class="text-sm muted"><a href="tienda.html?id=${Number(product.tienda_id) || ''}">Ver perfil público de tienda</a></p></div></aside></section><section class="mt-10 grid lg:grid-cols-[1fr_420px] gap-6"><div><h2 class="text-3xl font-bold mb-4">Reseñas verificadas</h2><div class="grid gap-4">${reviews.map(reviewCard).join('') || '<p class="muted">Sin reseñas aprobadas aún.</p>'}</div></div><form id="reviewForm" class="card grid gap-3"><h2 class="text-2xl font-bold">Escribir reseña</h2><p class="muted">Solo compradores con pedido pagado y envío entregado pueden reseñar. Si no cumples la condición, el backend lo rechazará y mostraremos el motivo.</p><input class="input" name="pedido_id" type="number" min="1" placeholder="Número de pedido" required><input type="hidden" name="producto_id" value="${Number(product.id) || ''}"><label>Calificación<select class="select" name="estrellas" required><option value="5">★★★★★ 5</option><option value="4">★★★★ 4</option><option value="3">★★★ 3</option><option value="2">★★ 2</option><option value="1">★ 1</option></select></label><textarea class="input" name="comentario" rows="4" maxlength="2000" placeholder="Comentario de reseña"></textarea><button class="btn btn-primary" type="submit">Publicar reseña</button><p id="reviewMsg" class="field-hint"></p></form></section>${reportDialogHtml()}`;
  bindGallery(imgs); bindQuantityControls(); add.onclick = addToCart; chat.onclick = startChat; report.onclick = openReport; cancelReport.onclick = () => reportDialog.close(); reportForm.onsubmit = sendReport; reviewForm.onsubmit = sendReview;
}

function reviewCard(r) { const stars = Number(r.estrellas || r.calificacion || 5); return `<div class="card"><div class="flex justify-between"><b>${h(r.comprador_nombre || r.usuario_nombre || 'Cliente')}</b><span class="text-amber-500">${'★'.repeat(Math.max(1, Math.min(stars, 5)))}</span></div><p class="mt-2">${h(r.comentario || '')}</p><p class="muted text-sm mt-2">Reseña verificada · ${formatDate(r.created_at)}</p></div>`; }
function reportDialogHtml(){return `<dialog id="reportDialog" class="card w-[min(92vw,520px)]"><form id="reportForm" class="grid gap-3"><h2 class="text-2xl font-bold">Reportar producto</h2><label>Motivo<select class="select" name="motivo" required><option value="producto falso">Producto falso</option><option value="contenido inapropiado">Contenido inapropiado</option><option value="precio engañoso">Precio engañoso</option><option value="otro">Otro</option></select></label><textarea class="input" name="descripcion" maxlength="1000" rows="4" placeholder="Describe el problema"></textarea><div class="flex gap-2 justify-end"><button id="cancelReport" class="btn btn-ghost" type="button">Cancelar</button><button class="btn btn-danger" type="submit">Enviar reporte</button></div></form></dialog>`;}
function bindGallery(imgs){ $$('.thumbs img').forEach((t,i)=>{t.onclick=()=>{mainImg.src=imgs[i]; $$('.thumbs img').forEach(x=>x.classList.remove('active')); t.classList.add('active');};});}
function setQty(value){ const s=stock(); if(s<=0){qty=0; qtyInput.value=0; return;} const req=Number(value||1); if(req>s){qty=s; qtyInput.value=s; stockMsg.textContent=`Solo hay ${s} unidades disponibles. Ajusté la cantidad al máximo permitido.`; return toast('La cantidad no puede superar el stock disponible.','warn');} qty=Math.max(1,req); qtyInput.value=qty; stockMsg.textContent=`Puedes comprar máximo ${s} unidades.`;}
function bindQuantityControls(){ plus.onclick=()=>setQty(qty+1); minus.onclick=()=>setQty(qty-1); qtyInput.oninput=()=>setQty(qtyInput.value); qtyInput.onblur=()=>setQty(qtyInput.value);}
function addToCart(){ if(stock()<=0)return toast('Producto agotado. No se puede añadir al carrito.','error'); if(qty>stock())return toast('La cantidad supera el stock disponible.','error'); addCart(product,qty); toast('Agregado al carrito');}
async function startChat(){ try{const c=await api.post('/chat/conversations',{producto_id:product.id}); location.href=`chat.html?id=${c.conversation.id}`;}catch(e){toast('Inicia sesión para chatear','error');}}
function openReport(){ if(typeof reportDialog.showModal==='function')reportDialog.showModal(); else reportDialog.setAttribute('open','open');}
async function sendReport(e){ e.preventDefault(); const btn=reportForm.querySelector('button[type="submit"]'); btn.disabled=true; try{await api.post(`/products/${product.id}/report`,Object.fromEntries(new FormData(reportForm))); toast('Reporte enviado correctamente'); reportForm.reset(); reportDialog.close();}catch(err){toast(err.message,'error');}finally{btn.disabled=false;}}
async function sendReview(e){ e.preventDefault(); if(!currentUser()) return toast('Inicia sesión para escribir reseñas.','error'); const btn=reviewForm.querySelector('button'); btn.disabled=true; try{await api.post('/reviews',Object.fromEntries(new FormData(reviewForm))); toast('Reseña creada correctamente'); reviewMsg.textContent='Reseña publicada y promedio actualizado.'; const rev=await api.get(`/products/${id}/reviews`,{auth:false}); reviews=rev.reviews||[]; draw();}catch(err){reviewMsg.textContent=err.message; toast(err.message,'error');}finally{btn.disabled=false;}}
function formatDate(v){ if(!v)return ''; const d=new Date(v); return Number.isNaN(d.getTime())?h(v):d.toLocaleString('es-CO');}
render();
