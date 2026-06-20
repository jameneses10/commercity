
import {api, assetUrl} from './api.js';
import {shell, bindShell, $, $$, money, toast, preview, h, withButtonLoading, emptyState, applyDarkMode, confirmDialog} from './ui.js';
import {requireAuth, clearSession} from './auth.js';

let user = null;
let profile = null;
let accountSettings = null;
let orders = [];
let shipments = [];
let favorites = [];
let returnsRows = [];
let activeSection = location.hash?.replace('#', '') || 'profile';
const sections = ['profile','orders','returns','favorites','shipments','security','settings','privacy'];

async function render() {
  app.innerHTML = await shell('perfil') + `<main class="container"><div class="profile-layout"><aside class="card profile-menu"><h1 class="text-3xl font-extrabold mb-4">Mi cuenta</h1>${menuHtml()}</aside><section id="profileContent" class="grid gap-6"></section></div></main>`;
  bindShell();
  user = await requireAuth(api);
  await loadBase();
  bindMenu();
  routeSection(activeSection);
}

function menuHtml(){
  const items = [
    ['profile','Mi perfil'], ['orders','Mis pedidos'], ['returns','Reembolsos y devoluciones'], ['favorites','Mis favoritos'], ['shipments','Mis envíos'], ['security','Seguridad'], ['settings','Configuración'], ['privacy','Privacidad']
  ];
  return `<nav class="grid gap-2">${items.map(([id,label]) => `<button class="side-link profile-tab ${activeSection===id?'active':''}" data-section="${id}" type="button">${h(label)}</button>`).join('')}</nav>`;
}
function bindMenu(){ $$('.profile-tab').forEach((b)=>{ b.onclick=()=>routeSection(b.dataset.section); }); }
function routeSection(section){ activeSection = sections.includes(section) ? section : 'profile'; history.replaceState(null,'',`#${activeSection}`); $$('.profile-tab').forEach((b)=>b.classList.toggle('active', b.dataset.section===activeSection)); drawSection(); }
async function loadBase(){
  accountSettings = await api.get('/account/settings').catch(()=>null);
  const prof = await api.get('/profile'); profile = prof.profile;
  if (accountSettings?.settings?.modo_oscuro !== undefined) applyDarkMode(Boolean(accountSettings.settings.modo_oscuro));
}
function drawSection(){
  if(activeSection==='profile') return drawProfile();
  if(activeSection==='orders') return loadOrders();
  if(activeSection==='returns') return loadReturns();
  if(activeSection==='favorites') return loadFavorites();
  if(activeSection==='shipments') return loadShipments();
  if(activeSection==='security') return drawSecurity();
  if(activeSection==='settings') return drawSettings();
  if(activeSection==='privacy') return drawPrivacy();
}

function drawProfile() {
  profileContent.innerHTML = `<section class="card"><h2 class="text-3xl font-bold mb-4">Mi perfil</h2><div class="two-col"><div id="info"></div><form id="form" class="grid gap-3"><h3 class="text-xl font-bold">Actualizar perfil público</h3><input class="input" type="file" name="foto" id="foto" accept="image/*"><div id="preview" class="thumbs"></div><textarea class="input" name="descripcion_personal" rows="5" placeholder="Descripción personal"></textarea><button class="btn btn-primary" type="submit">Guardar cambios</button></form></div></section>`;
  info.innerHTML = `<img src="${assetUrl(profile.foto_perfil_url || user.foto_perfil_url)}" class="w-28 h-28 rounded-full object-cover mb-4" alt="Foto de perfil"><h2 class="text-2xl font-bold">${h(user.nombre)}</h2><p class="pill">${h(user.rol)}</p><p class="muted mt-3">${h(profile.descripcion_personal || user.descripcion_personal || 'Sin descripción')}</p><p class="mt-4">Seguidores: <b>${Number(profile.total_seguidores) || 0}</b> · Siguiendo: <b>${Number(profile.total_siguiendo) || 0}</b></p>`;
  form.descripcion_personal.value = profile.descripcion_personal || '';
  preview(foto, '#preview');
  form.onsubmit = saveProfile;
}
async function saveProfile(e) { e.preventDefault(); const btn = form.querySelector('button'); await withButtonLoading(btn, async () => { try { await api.form('/profile', new FormData(form), {method: 'PATCH'}); toast('Perfil actualizado'); await loadBase(); drawProfile(); } catch (err) { toast(err.message, 'error'); } }, 'Guardando perfil...'); }

async function loadOrders(){
  profileContent.innerHTML = `<section class="card"><div class="flex justify-between gap-3 items-start mb-4"><div><h2 class="text-3xl font-bold">Mis pedidos</h2><p class="muted">Historial de compras y acceso a devoluciones para pedidos entregados.</p></div><button id="reloadOrders" class="btn btn-secondary" type="button">Actualizar</button></div><div id="ordersBox"></div></section>`;
  reloadOrders.onclick = loadOrders;
  ordersBox.innerHTML = '<p class="muted">Cargando pedidos...</p>';
  try { const d=await api.get('/orders/my-orders'); orders=d.orders||[]; drawOrders(); } catch(e){ ordersBox.innerHTML=`<div class="empty-state"><h3 class="font-bold">Pedidos no disponibles</h3><p>${h(e.message)}</p></div>`; }
}
function drawOrders(){ if(!orders.length){ordersBox.innerHTML=emptyState('Aún no tienes pedidos','Cuando finalices una compra aparecerá aquí.'); return;} ordersBox.innerHTML=orders.map(orderCard).join(''); $$('.return-order').forEach((b)=>{b.onclick=()=>openReturnForm(b.dataset.id);}); }
function orderCard(order){ const delivered = order.estado_general === 'completado' || shipments.some((s)=>Number(s.pedido_id)===Number(order.id)&&s.estado==='entregado'); return `<article class="p-4 rounded-3xl bg-white/70 border border-orange-100 mb-4"><div class="flex flex-wrap justify-between gap-3"><div><h3 class="text-xl font-bold">Orden #${Number(order.id)||''}</h3><p class="muted text-sm">${formatDate(order.created_at||order.fecha||order.updated_at)}</p></div><div class="text-right"><p class="price text-2xl">${money(order.total)}</p><p><span class="pill">Pago: ${h(order.estado_pago||'pendiente')}</span> <span class="pill orange">Estado: ${h(order.estado_general||'creado')}</span></p></div></div><div class="mt-4 grid gap-2"><p class="muted">Abre devolución para seleccionar productos del detalle del pedido.</p></div><button class="btn btn-secondary return-order mt-3" type="button" data-id="${Number(order.id)||''}" ${order.estado_pago!=='pagado' ? 'disabled' : ''}>Solicitar devolución</button></article>`; }
async function openReturnForm(orderId){
  try{
    const d=await api.get(`/orders/${orderId}`); const order=d.order; const details=order.details||[];
    profileContent.insertAdjacentHTML('beforeend', `<dialog id="returnDialog" class="card w-[min(94vw,760px)]"><form id="returnForm" class="grid gap-3"><h2 class="text-2xl font-bold">Solicitar devolución pedido #${Number(orderId)}</h2><input type="hidden" name="pedido_id" value="${Number(orderId)}"><label>Producto<select class="select" name="pedido_detalle_id" required>${details.map((x)=>`<option value="${Number(x.id)}">${h(x.producto_nombre||`Producto #${x.producto_id}`)} · Cant. ${Number(x.cantidad)||0}</option>`).join('')}</select></label><label>Cantidad<input class="input" name="cantidad" type="number" min="1" value="1" required></label><label>Motivo<select class="select" name="motivo" required><option>producto defectuoso</option><option>producto equivocado</option><option>no corresponde a la descripción</option><option>arrepentimiento</option><option>otro</option></select></label><textarea class="input" name="descripcion" rows="4" maxlength="2000" placeholder="Describe la solicitud"></textarea><label>Evidencias opcionales<input class="input" name="evidencias" type="file" multiple accept="image/*,.pdf,.doc,.docx"></label><div class="flex gap-2 justify-end"><button id="cancelReturn" class="btn btn-ghost" type="button">Cancelar</button><button class="btn btn-primary" type="submit">Enviar solicitud</button></div></form></dialog>`);
    returnDialog.showModal(); cancelReturn.onclick=()=>returnDialog.remove(); returnForm.onsubmit=submitReturn;
  }catch(e){toast(e.message,'error');}
}
const RETURN_ALLOWED_EXT = new Set(['jpg','jpeg','png','webp','pdf','doc','docx']);
const RETURN_BLOCKED_EXT = new Set(['exe','sh','bat','php','js','html']);
function validateReturnFiles(files) {
  if (files.length > 5) return 'Puedes adjuntar máximo 5 evidencias.';
  for (const file of files) {
    const ext = (file.name.split('.').pop() || '').toLowerCase();
    if (RETURN_BLOCKED_EXT.has(ext) || !RETURN_ALLOWED_EXT.has(ext)) return `Archivo no permitido: ${file.name}. Usa jpg, jpeg, png, webp, pdf, doc o docx.`;
  }
  return '';
}
async function submitReturn(e){
  e.preventDefault();
  const form=e.currentTarget;
  const btn=form.querySelector('button[type="submit"]');
  const items=[{pedido_detalle_id:Number(form.pedido_detalle_id.value),cantidad:Number(form.cantidad.value)}];
  const files=[...form.evidencias.files];
  const validation=validateReturnFiles(files);
  if(validation) return toast(validation, 'error');
  await withButtonLoading(btn, async()=>{
    try{
      if(files.length){
        const fd=new FormData();
        fd.set('pedido_id',form.pedido_id.value);
        fd.set('motivo',form.motivo.value);
        fd.set('descripcion',form.descripcion.value);
        fd.set('items',JSON.stringify(items));
        files.forEach((file)=>fd.append('evidencias',file));
        await api.form('/returns',fd);
      } else {
        await api.post('/returns',{pedido_id:Number(form.pedido_id.value),motivo:form.motivo.value,descripcion:form.descripcion.value,items});
      }
      toast('Solicitud de devolución creada correctamente');
      document.getElementById('returnDialog')?.remove();
      routeSection('returns');
    }catch(err){toast(err.message,'error');}
  }, 'Enviando...');
}

async function loadReturns(){ profileContent.innerHTML=`<section class="card"><div class="flex justify-between gap-3 items-start mb-4"><div><h2 class="text-3xl font-bold">Reembolsos y devoluciones</h2><p class="muted">Historial y estado de tus solicitudes.</p></div><button id="reloadReturns" class="btn btn-secondary" type="button">Actualizar</button></div><div id="returnsBox"></div></section>`; reloadReturns.onclick=loadReturns; returnsBox.innerHTML='<p class="muted">Cargando devoluciones...</p>'; try{const d=await api.get('/returns/my-returns'); returnsRows=d.returns||[]; drawReturns();}catch(e){returnsBox.innerHTML=`<p class="text-red-700">${h(e.message)}</p>`;} }
function drawReturns(){ if(!returnsRows.length){returnsBox.innerHTML=emptyState('Sin devoluciones','Cuando solicites una devolución aparecerá aquí.');return;} returnsBox.innerHTML=`<div class="grid gap-3">${returnsRows.map(returnCard).join('')}</div>`; $$('.return-detail').forEach((b)=>{b.onclick=()=>showReturnDetail(b.dataset.id);}); }
function returnCard(r){ return `<article class="card"><div class="flex flex-wrap justify-between gap-3"><div><h3 class="font-bold">${h(r.numero_solicitud||`DEV-${r.id}`)}</h3><p class="muted">Pedido #${Number(r.pedido_id)||''} · Tienda #${Number(r.tienda_id)||''}</p></div><span class="status-badge ${h(r.estado)}">${h(r.estado)}</span></div><p>Motivo: <b>${h(r.motivo)}</b></p><p>Monto estimado: <b>${money(r.monto_estimado)}</b></p><p class="muted text-sm">${formatDate(r.creado_en)}</p>${r.respuesta_vendedor?`<p>Vendedor: ${h(r.respuesta_vendedor)}</p>`:''}${r.respuesta_admin?`<p>Admin: ${h(r.respuesta_admin)}</p>`:''}<button class="btn btn-secondary return-detail mt-3" data-id="${Number(r.id)}" type="button">Ver detalle</button></article>`; }
async function showReturnDetail(id){ try{const d=await api.get(`/returns/${id}`); const r=d.return; profileContent.insertAdjacentHTML('beforeend',`<dialog id="returnDetail" class="card w-[min(94vw,760px)]"><h2 class="text-2xl font-bold">${h(r.numero_solicitud)}</h2><p><span class="status-badge ${h(r.estado)}">${h(r.estado)}</span></p><div class="grid gap-2 mt-3">${(r.items||[]).map((i)=>`<p><b>${h(i.producto_nombre)}</b> x ${Number(i.cantidad)} · ${money(i.subtotal)}</p>`).join('')||'<p class="muted">Sin items.</p>'}</div><p class="mt-3">${h(r.descripcion||'')}</p><button class="btn btn-secondary mt-4" id="closeReturnDetail">Cerrar</button></dialog>`); returnDetail.showModal(); closeReturnDetail.onclick=()=>returnDetail.remove(); }catch(e){toast(e.message,'error');} }

async function loadFavorites(){ profileContent.innerHTML=`<section class="card"><div class="flex justify-between gap-3 items-start mb-4"><div><h2 class="text-3xl font-bold">Mis favoritos</h2><p class="muted">Productos guardados para comprar después.</p></div><button id="reloadFav" class="btn btn-secondary" type="button">Actualizar</button></div><div id="favoritesBox"></div></section>`; reloadFav.onclick=loadFavorites; favoritesBox.innerHTML='<p class="muted">Cargando favoritos...</p>'; try{const d=await api.get('/favorites'); favorites=d.favorites||[]; drawFavorites();}catch(e){favoritesBox.innerHTML=`<p class="text-red-700">${h(e.message)}</p>`;} }
function drawFavorites(){ if(!favorites.length){favoritesBox.innerHTML=emptyState('Sin favoritos','Guarda productos desde el home o detalle.');return;} favoritesBox.innerHTML=`<div class="grid-products">${favorites.map((f)=>`<article class="product-card"><img src="${assetUrl(f.imagen_url)}" alt="${h(f.nombre)}"><div class="mt-3"><h3 class="font-bold">${h(f.nombre)}</h3><p class="muted">${h(f.tienda_nombre||'Tienda')}</p><p class="price">${money(f.precio)}</p><div class="grid gap-2 mt-3"><a class="btn btn-secondary" href="producto.html?id=${Number(f.producto_id)}">Ver detalle</a><button class="btn btn-danger remove-fav" data-id="${Number(f.producto_id)}" type="button">Quitar favorito</button></div></div></article>`).join('')}</div>`; $$('.remove-fav').forEach((b)=>{b.onclick=()=>removeFavorite(b.dataset.id);}); }
async function removeFavorite(id){ try{await api.delete(`/favorites/${id}`); toast('Favorito eliminado'); await loadFavorites();}catch(e){toast(e.message,'error');} }

async function loadShipments(){ profileContent.innerHTML=`<section class="card"><div class="flex justify-between gap-3 items-start mb-4"><div><h2 class="text-3xl font-bold">Mis envíos</h2><p class="muted">Rastreo independiente de paquetes por tienda.</p></div><button id="reloadShipments" class="btn btn-secondary" type="button">Actualizar</button></div><div id="shipmentsBox"></div></section>`; reloadShipments.onclick=loadShipments; shipmentsBox.innerHTML='<p class="muted">Cargando envíos...</p>'; try{const d=await api.get('/shipments/my-shipments'); shipments=d.shipments||d.envios||[]; drawShipments();}catch(e){shipmentsBox.innerHTML=`<p class="text-red-700">${h(e.message)}</p>`;} }
function drawShipments(){ if(!shipments.length){shipmentsBox.innerHTML=emptyState('Sin envíos por rastrear','Cuando una orden pagada genere paquetes aparecerán aquí.'); return;} shipmentsBox.innerHTML=`<div class="grid md:grid-cols-2 gap-4">${shipments.map((s)=>`<article class="card"><h3 class="font-bold">Envío #${Number(s.id)||''}</h3><span class="pill orange">${h(s.estado||'pendiente')}</span><p>Pedido: <b>#${Number(s.pedido_id)||''}</b></p><p>Tienda: <b>${h(s.tienda_nombre||`#${s.tienda_id||''}`)}</b></p><p>Transportadora: <b>${h(s.transportadora||'Pendiente')}</b></p><p>Guía: <b>${h(s.numero_guia||'Pendiente')}</b></p></article>`).join('')}</div>`; }

function drawSettings(){ const s=accountSettings?.settings||{}; profileContent.innerHTML=`<section class="card"><h2 class="text-3xl font-bold mb-4">Configuración</h2><form id="settingsForm" class="grid gap-3"><label>Nombre<input class="input" name="nombre" value="${h(user.nombre||'')}"></label><label>Teléfono<input class="input" name="telefono" value="${h(user.telefono||'')}"></label><label class="role-card"><input name="modo_oscuro" type="checkbox" ${s.modo_oscuro?'checked':''}> Activar modo oscuro</label><h3 class="font-bold mt-3">Preferencias de notificación</h3><div class="grid md:grid-cols-3 gap-2">${['pedidos','pagos','envíos','chat','devoluciones','promociones'].map((k)=>`<label class="role-card"><input type="checkbox" name="pref_${k}" ${s.preferencias_notificaciones?.[k]!==false?'checked':''}> ${h(k)}</label>`).join('')}</div><button class="btn btn-primary" type="submit">Guardar configuración</button></form></section>`; settingsForm.onsubmit=saveSettings; }
async function saveSettings(e){ e.preventDefault(); const prefs={}; ['pedidos','pagos','envíos','chat','devoluciones','promociones'].forEach((k)=>{prefs[k]=settingsForm[`pref_${k}`].checked;}); const body={nombre:settingsForm.nombre.value,telefono:settingsForm.telefono.value,modo_oscuro:settingsForm.modo_oscuro.checked,preferencias_notificaciones:prefs}; await withButtonLoading(settingsForm.querySelector('button'), async()=>{try{const d=await api.patch('/account/settings',body); accountSettings=d; applyDarkMode(Boolean(body.modo_oscuro)); toast('Configuración guardada');}catch(err){toast(err.message,'error');}}, 'Guardando...'); }

function drawSecurity(){ profileContent.innerHTML=`<section class="grid gap-6"><form id="passwordForm" class="card grid gap-3"><h2 class="text-3xl font-bold">Cambiar contraseña</h2><input class="input" name="currentPassword" type="password" placeholder="Contraseña actual" required><input class="input" name="newPassword" type="password" placeholder="Nueva contraseña" required><input class="input" name="confirmPassword" type="password" placeholder="Confirmar nueva contraseña" required><button class="btn btn-primary" type="submit">Actualizar contraseña</button></form><form id="emailForm" class="card grid gap-3"><h2 class="text-3xl font-bold">Cambiar correo</h2><input class="input" name="newEmail" type="email" placeholder="Nuevo correo" required><input class="input" name="currentPassword" type="password" placeholder="Contraseña actual" required><button class="btn btn-secondary" type="submit">Actualizar correo</button></form></section>`; passwordForm.onsubmit=changePassword; emailForm.onsubmit=changeEmail; }
async function changePassword(e){ e.preventDefault(); if(passwordForm.newPassword.value!==passwordForm.confirmPassword.value) return toast('La nueva contraseña y confirmación no coinciden','error'); await withButtonLoading(passwordForm.querySelector('button'), async()=>{try{await api.patch('/account/change-password',Object.fromEntries(new FormData(passwordForm))); toast('Contraseña actualizada'); passwordForm.reset();}catch(err){toast(err.message,'error');}}, 'Actualizando...'); }
async function changeEmail(e){ e.preventDefault(); await withButtonLoading(emailForm.querySelector('button'), async()=>{try{await api.patch('/account/change-email',Object.fromEntries(new FormData(emailForm))); toast('Correo actualizado. Inicia sesión de nuevo si el token conserva correo anterior.'); emailForm.reset();}catch(err){toast(err.message,'error');}}, 'Actualizando...'); }

function drawPrivacy(){ const s=accountSettings?.settings||{}; profileContent.innerHTML=`<section class="grid gap-6"><div class="card"><h2 class="text-3xl font-bold">Privacidad</h2><p class="muted mt-2">Estado solicitud eliminación: <b>${h(s.solicitud_eliminacion_estado||'ninguna')}</b></p><div class="grid md:grid-cols-2 gap-3 mt-5"><button id="deactivateBtn" class="btn btn-danger" type="button">Desactivar cuenta</button><button id="deleteReqBtn" class="btn btn-secondary" type="button">Solicitar eliminación de cuenta</button></div><p class="field-hint mt-3">La eliminación no borra historial transaccional; si admin aprueba, se anonimizan datos personales.</p></div></section>`; deactivateBtn.onclick=deactivateAccount; deleteReqBtn.onclick=requestDelete; }
async function deactivateAccount(){ const ok=await confirmDialog({title:'Desactivar cuenta',message:'Tu cuenta quedará inactiva y no podrás iniciar sesión hasta que sea reactivada por administración.',confirmText:'Desactivar',danger:true}); if(!ok)return; try{await api.patch('/account/deactivate',{}); toast('Cuenta desactivada'); clearSession(); setTimeout(()=>{location.href='login.html';},800);}catch(e){toast(e.message,'error');} }
async function requestDelete(){ const ok=await confirmDialog({title:'Solicitar eliminación',message:'No se borrarán pedidos, pagos, logs ni auditoría. Si admin aprueba, se anonimizarán datos personales.',confirmText:'Enviar solicitud',danger:true}); if(!ok)return; try{await api.post('/account/delete-request',{motivo:'Solicitud enviada desde frontend web'}); toast('Solicitud enviada'); await loadBase(); drawPrivacy();}catch(e){toast(e.message,'error');} }

function formatDate(value) { if (!value) return 'Fecha no disponible'; const date = new Date(value); return Number.isNaN(date.getTime()) ? h(value) : date.toLocaleString('es-CO'); }
render();
