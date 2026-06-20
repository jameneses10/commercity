
import {api, assetUrl} from './api.js';
import {sidebar, $, $$, money, toast, h, withButtonLoading, emptyState, confirmDialog, promptDialog} from './ui.js';
import {requireAuth} from './auth.js';

let users = [];
let categories = [];
let adminOrders = [];
let products = [];
let reports = [];
let userReports = [];
let logs = [];
let statsData = null;
let adminSearchResults = null;
let adminReturns = [];
let deleteRequests = [];

async function render() {
  app.innerHTML = `<div class="dashboard">${sidebar('admin', 'admin')}<main class="container"><div class="flex justify-between items-center mb-6"><div><h1 class="text-4xl font-extrabold">Panel Ejecutivo</h1><p class="muted">Supervisión operativa de CommerCity.</p></div><button id="reloadAdmin" class="btn btn-primary" type="button">↻ Actualizar panel</button></div><section class="stats mb-6" id="stats"></section><section id="search" class="card mb-6"><h2 class="text-2xl font-bold mb-3">Buscador global</h2><div class="flex gap-2"><input id="q" class="input" placeholder="Buscar usuarios, productos, tiendas..."><button id="go" class="btn btn-secondary" type="button">Buscar</button></div><div id="results" class="grid md:grid-cols-3 gap-3 mt-4"></div></section><section id="categories" class="card mb-6"><div class="flex justify-between gap-3 items-start mb-4"><div><h2 class="text-2xl font-bold">Categorías</h2><p class="muted">CRUD administrativo de categorías.</p></div><button id="reloadCategories" class="btn btn-secondary" type="button">Actualizar</button></div><form id="categoryForm" class="grid md:grid-cols-[1fr_1fr_150px_auto] gap-2 mb-4"><input type="hidden" name="id"><input class="input" name="nombre" placeholder="Nombre categoría" required><input class="input" name="descripcion" placeholder="Descripción"><select class="select" name="estado"><option value="activa">Activa</option><option value="inactiva">Inactiva</option></select><button id="saveCategoryBtn" class="btn btn-primary" type="submit">Crear categoría</button><button id="cancelCategoryEdit" class="btn btn-ghost hidden md:col-span-4" type="button">Cancelar edición</button></form><div id="categoryTable"></div></section><section id="users" class="card mb-6"><div class="flex justify-between gap-3 items-start mb-4"><div><h2 class="text-2xl font-bold">Gobernanza de usuarios</h2><p class="muted">Activar, inactivar o banear según endpoint administrativo.</p></div><input id="userFilter" class="input max-w-sm" placeholder="Filtrar usuarios visualmente"></div><div id="userTable"></div></section><section id="orders" class="card mb-6"><h2 class="text-2xl font-bold mb-3">Órdenes</h2><div class="grid md:grid-cols-3 gap-2 mb-4"><select id="orderFilter" class="select"><option value="">Todos los estados</option><option value="pendiente">Pago pendiente</option><option value="pagado">Pagado</option><option value="creado">Creado</option><option value="procesando">Procesando</option></select></div><div id="ordersBox"></div></section><section id="stores" class="card mb-6"><h2 class="text-2xl font-bold mb-3">Tiendas</h2><p class="muted mb-3">No existe endpoint de listado global de tiendas; se muestran resultados desde búsqueda admin cuando se consulta un término.</p><div id="storesBox"></div></section><section id="products" class="card mb-6"><h2 class="text-2xl font-bold mb-3">Productos globales</h2><div id="productsBox"></div></section><section id="reports" class="card mb-6"><h2 class="text-2xl font-bold mb-3">Productos reportados</h2><div id="reportGrid" class="grid md:grid-cols-3 gap-4"></div></section><section id="userReports" class="card mb-6"><h2 class="text-2xl font-bold mb-3">Reportes de usuarios</h2><div id="userReportGrid" class="grid md:grid-cols-3 gap-4"></div></section><section id="messageReports" class="card mb-6"><h2 class="text-2xl font-bold mb-3">Reportes de mensajes</h2><div class="empty-state"><h3 class="text-xl font-bold mb-2">Pendiente backend</h3><p>No existe GET /admin/reports/messages ni PATCH /admin/reports/messages/:id. Los mensajes sí pueden reportarse desde chat y quedan trazados en logs.</p></div></section><section id="reviewModeration" class="card mb-6"><h2 class="text-2xl font-bold mb-3">Moderación de reseñas</h2><div class="empty-state"><h3 class="text-xl font-bold mb-2">Listado pendiente backend</h3><p>Existe PATCH /admin/reviews/:id/moderate, pero no existe endpoint para listar reseñas pendientes. La acción queda preparada cuando backend entregue el listado.</p></div></section><section id="adminReports" class="grid lg:grid-cols-2 gap-6 mb-6"><div class="card"><h2 class="text-2xl font-bold mb-3">Reportes básicos</h2><div id="reportsSummary"></div></div><div class="card"><h2 class="text-2xl font-bold mb-3">Logs / auditoría</h2><div id="logsBox"></div></div></section></main></div>`;
  document.querySelector('.dashboard main').insertAdjacentHTML('beforeend', `<section id="returnAdmin" class="card mb-6"><h2 class="text-2xl font-bold mb-3">Devoluciones y reembolsos</h2><div id="adminReturnsBox"></div></section><section id="deleteRequests" class="card mb-6"><h2 class="text-2xl font-bold mb-3">Solicitudes de eliminación de cuenta</h2><div id="deleteRequestsBox"></div></section>`);
  await requireAuth(api, ['administrador']);
  reloadAdmin.onclick = load;
  go.onclick = search;
  q.addEventListener('keydown', (e) => { if (e.key === 'Enter') search(); });
  categoryForm.onsubmit = saveCategory;
  cancelCategoryEdit.onclick = resetCategoryForm;
  reloadCategories.onclick = loadCategories;
  userFilter.oninput = drawUsers;
  orderFilter.onchange = drawOrders;
  await load();
}

async function load() {
  await Promise.all([loadStats(), loadCategories(), loadUsers(), loadOrders(), loadProducts(), loadProductReports(), loadUserReports(), loadLogs(), loadAdminReturns(), loadDeleteRequests()]);
  drawStores();
}

async function loadStats() {
  try {
    const d = await api.get('/admin/dashboard-stats');
    statsData = d.stats || d;
    stats.innerHTML = `<div class="card"><b>Usuarios activos</b><div class="stat-value">${Number(statsData.total_usuarios_activos) || 0}</div></div><div class="card"><b>Ventas totales</b><div class="stat-value">${money(statsData.ventas_totales || 0)}</div></div><div class="card"><b>Comisiones</b><div class="stat-value">${money(statsData.comisiones_totales || 0)}</div></div><div class="card"><b>Pedidos</b><div class="stat-value">${Number(statsData.total_pedidos) || 0}</div></div><div class="card"><b>Productos</b><div class="stat-value">${Number(statsData.total_productos) || 0}</div></div><div class="card"><b>Reportes pendientes</b><div class="stat-value">${(Number(statsData.reportes_productos_pendientes) || 0) + (Number(statsData.reportes_usuarios_pendientes) || 0)}</div></div>`;
    drawReportsSummary();
  } catch (e) {
    toast(e.message, 'error');
  }
}

async function loadCategories() {
  categoryTable.innerHTML = '<p class="muted">Cargando categorías...</p>';
  try {
    const d = await api.get('/categories', {auth: false});
    categories = d.categories || [];
    drawCategories();
  } catch (e) {
    categoryTable.innerHTML = `<p class="text-red-700">${h(e.message)}</p>`;
  }
}

function drawCategories() {
  if (!categories.length) {
    categoryTable.innerHTML = emptyState('Sin categorías activas', 'Crea una categoría para que los vendedores publiquen productos.');
    return;
  }
  categoryTable.innerHTML = `<table class="table"><thead><tr><th>ID</th><th>Nombre</th><th>Descripción</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>${categories.map((c) => `<tr><td>${Number(c.id) || ''}</td><td><b>${h(c.nombre)}</b><p class="muted text-sm">${h(c.slug || '')}</p></td><td>${h(c.descripcion || '')}</td><td><span class="pill">${h(c.estado || 'activa')}</span></td><td><div class="flex flex-wrap gap-2"><button class="btn btn-secondary edit-category" type="button" data-id="${Number(c.id) || ''}">Editar</button><button class="btn btn-danger delete-category" type="button" data-id="${Number(c.id) || ''}">Eliminar</button></div></td></tr>`).join('')}</tbody></table>`;
  $$('.edit-category').forEach((b) => { b.onclick = () => editCategory(categories.find((c) => c.id == b.dataset.id)); });
  $$('.delete-category').forEach((b) => { b.onclick = () => deleteCategory(b.dataset.id); });
}

function editCategory(c) {
  if (!c) return;
  categoryForm.id.value = c.id;
  categoryForm.nombre.value = c.nombre || '';
  categoryForm.descripcion.value = c.descripcion || '';
  categoryForm.estado.value = c.estado || 'activa';
  saveCategoryBtn.textContent = 'Guardar categoría';
  cancelCategoryEdit.classList.remove('hidden');
}

function resetCategoryForm() {
  categoryForm.reset();
  categoryForm.id.value = '';
  categoryForm.estado.value = 'activa';
  saveCategoryBtn.textContent = 'Crear categoría';
  cancelCategoryEdit.classList.add('hidden');
}

async function saveCategory(e) {
  e.preventDefault();
  const id = categoryForm.id.value;
  const body = Object.fromEntries(new FormData(categoryForm));
  delete body.id;
  await withButtonLoading(saveCategoryBtn, async () => {
    try {
      if (id) await api.patch(`/categories/${id}`, body);
      else await api.post('/categories', body);
      toast(id ? 'Categoría actualizada' : 'Categoría creada');
      resetCategoryForm();
      await loadCategories();
    } catch (err) {
      toast(err.message, 'error');
    }
  }, id ? 'Guardando...' : 'Creando...');
}

async function deleteCategory(id) {
  if (!confirm('¿Eliminar/inactivar esta categoría? Si tiene productos activos, el backend lo bloqueará.')) return;
  try {
    await api.delete(`/categories/${id}`);
    toast('Categoría eliminada o inactivada');
    await loadCategories();
  } catch (e) {
    toast(e.status === 409 ? 'No se puede eliminar una categoría con productos activos.' : e.message, 'error');
  }
}

async function loadUsers() {
  try {
    const d = await api.get('/admin/users');
    users = d.users || [];
    drawUsers();
  } catch (e) {
    userTable.innerHTML = `<p class="text-red-700">${h(e.message)}</p>`;
  }
}

function drawUsers() {
  const term = (userFilter?.value || '').toLowerCase();
  const view = users.filter((u) => `${u.nombre} ${u.correo} ${u.rol} ${u.estado}`.toLowerCase().includes(term));
  userTable.innerHTML = view.length ? `<table class="table"><thead><tr><th>Usuario</th><th>Rol</th><th>Estado</th><th>Acción</th></tr></thead><tbody>${view.map((u) => `<tr><td><b>${h(u.nombre)}</b><p class="muted text-sm">${h(u.correo)}</p></td><td><span class="pill">${h(u.rol)}</span></td><td>${h(u.estado)}</td><td><select class="select status" data-id="${Number(u.id) || ''}"><option value="activo">activo</option><option value="inactivo">inactivo</option><option value="baneado">baneado</option></select></td></tr>`).join('')}</tbody></table>` : emptyState('Sin usuarios', 'No hay usuarios que coincidan con el filtro.');
  $$('.status').forEach((s) => { s.value = users.find((u) => u.id == s.dataset.id)?.estado || 'activo'; s.onchange = () => updateUserStatus(s.dataset.id, s.value); });
}

async function updateUserStatus(id, estado) {
  try {
    await api.patch(`/admin/users/${id}/status`, {estado});
    toast('Estado de usuario actualizado');
    await loadUsers();
  } catch (e) {
    toast(e.message, 'error');
  }
}

async function loadOrders() {
  ordersBox.innerHTML = '<p class="muted">Cargando órdenes...</p>';
  try {
    const d = await api.get('/admin/orders');
    adminOrders = d.orders || [];
    drawOrders();
  } catch (e) {
    ordersBox.innerHTML = `<p class="text-red-700">${h(e.message)}</p>`;
  }
}

function drawOrders() {
  const filter = orderFilter.value;
  const view = adminOrders.filter((o) => !filter || o.estado_pago === filter || o.estado_general === filter);
  ordersBox.innerHTML = view.length ? `<table class="table"><thead><tr><th>Orden</th><th>Comprador</th><th>Total</th><th>Pago</th><th>Estado envío/general</th><th>Fecha</th></tr></thead><tbody>${view.map((o) => `<tr><td>#${Number(o.id) || ''}</td><td>#${Number(o.comprador_id) || ''}</td><td>${money(o.total)}</td><td><span class="pill">${h(o.estado_pago || 'pendiente')}</span></td><td><span class="pill orange">${h(o.estado_general || 'creado')}</span></td><td>${formatDate(o.created_at)}</td></tr>`).join('')}</tbody></table>` : emptyState('Sin órdenes', 'No hay órdenes para el filtro seleccionado.');
}

async function loadProducts() {
  productsBox.innerHTML = '<p class="muted">Cargando productos...</p>';
  try {
    const d = await api.get('/products?limit=50', {auth: false});
    products = d.products || [];
    drawProducts();
  } catch (e) {
    productsBox.innerHTML = `<p class="text-red-700">${h(e.message)}</p>`;
  }
}

function drawProducts() {
  productsBox.innerHTML = products.length ? `<table class="table"><thead><tr><th>Producto</th><th>Tienda</th><th>Stock</th><th>Precio</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>${products.map((p) => `<tr><td><div class="flex gap-3"><img src="${assetUrl(p.imagenes?.[0]?.url_imagen || p.imagen_url)}" class="w-12 h-12 rounded-2xl object-cover" alt="${h(p.nombre)}"><div><b>${h(p.nombre)}</b><p class="muted text-sm">#${Number(p.id) || ''}</p></div></div></td><td>${h(p.tienda_nombre || `#${p.tienda_id || ''}`)}</td><td>${Number(p.stock) || 0}</td><td>${money(p.precio_final || p.precio)}</td><td><span class="pill">${h(p.estado)}</span></td><td><button class="btn btn-ghost toggle-product" type="button" data-id="${Number(p.id) || ''}" data-state="${p.estado === 'oculto' ? 'activo' : 'oculto'}">${p.estado === 'oculto' ? 'Reactivar' : 'Ocultar'}</button></td></tr>`).join('')}</tbody></table>` : emptyState('Sin productos', 'No hay productos visibles en catálogo público.');
  $$('.toggle-product').forEach((b) => { b.onclick = () => toggleProduct(b.dataset.id, b.dataset.state); });
}

async function toggleProduct(id, estado) {
  try {
    await api.patch(`/products/${id}/visibility`, {estado});
    toast(estado === 'activo' ? 'Producto reactivado' : 'Producto ocultado');
    await loadProducts();
  } catch (e) {
    toast(e.message, 'error');
  }
}

async function loadProductReports() {
  try {
    const d = await api.get('/admin/reports/products');
    reports = d.reports || [];
    drawProductReports();
  } catch (e) {
    reportGrid.innerHTML = `<p class="text-red-700">${h(e.message)}</p>`;
  }
}

function drawProductReports() {
  reportGrid.innerHTML = reports.length ? reports.slice(0, 12).map((r) => `<article class="card"><h3 class="font-bold">${h(r.producto_nombre || `Producto #${r.producto_id || ''}`)}</h3><p class="muted">Motivo: ${h(r.motivo)}</p><p class="text-sm">${h(r.descripcion || '')}</p><p class="text-sm muted">Estado: ${h(r.estado || 'pendiente')}</p><div class="grid gap-2 mt-3"><select class="select report-state" data-id="${Number(r.id) || ''}"><option value="pendiente">pendiente</option><option value="revisado">revisado</option><option value="rechazado">rechazado</option><option value="accionado">accionado</option></select><button class="btn btn-danger hide-reported" type="button" data-id="${Number(r.id) || ''}">Accionar y ocultar producto</button></div></article>`).join('') : emptyState('Sin reportes pendientes', 'La cola administrativa está limpia.');
  $$('.report-state').forEach((s) => { s.value = reports.find((r) => r.id == s.dataset.id)?.estado || 'pendiente'; s.onchange = () => updateReport(s.dataset.id, {estado: s.value}); });
  $$('.hide-reported').forEach((b) => { b.onclick = () => updateReport(b.dataset.id, {estado: 'accionado', ocultar_producto: true, respuesta_admin: 'Producto ocultado desde panel administrativo.'}); });
}

async function updateReport(id, body) {
  try {
    await api.patch(`/admin/reports/products/${id}`, body);
    toast('Reporte actualizado');
    await Promise.all([loadProductReports(), loadProducts(), loadStats()]);
  } catch (e) {
    toast(e.message, 'error');
  }
}

async function loadUserReports() {
  try {
    const d = await api.get('/admin/reports/users');
    userReports = d.reports || d.user_reports || [];
    drawUserReports();
  } catch (e) {
    if (typeof userReportGrid !== 'undefined') userReportGrid.innerHTML = `<p class="text-red-700">${h(e.message)}</p>`;
  }
}

function drawUserReports() {
  userReportGrid.innerHTML = userReports.length ? userReports.slice(0, 12).map((r) => `<article class="card"><h3 class="font-bold">${h(r.usuario_reportado_nombre || `Usuario #${r.usuario_reportado_id || ''}`)}</h3><p class="muted">Motivo: ${h(r.motivo)}</p><p class="text-sm">${h(r.descripcion || '')}</p><p class="text-sm muted">Estado: ${h(r.estado || 'pendiente')}</p><div class="grid gap-2 mt-3"><select class="select user-report-state" data-id="${Number(r.id) || ''}"><option value="pendiente">pendiente</option><option value="revisado">revisado</option><option value="rechazado">rechazado</option><option value="accionado">accionado</option></select><button class="btn btn-danger ban-reported-user" type="button" data-id="${Number(r.id) || ''}" data-user="${Number(r.usuario_reportado_id) || ''}">Accionar e inactivar usuario</button></div></article>`).join('') : emptyState('Sin reportes de usuarios', 'No hay reportes de usuarios pendientes.');
  $$('.user-report-state').forEach((s) => { s.value = userReports.find((r) => r.id == s.dataset.id)?.estado || 'pendiente'; s.onchange = () => updateUserReport(s.dataset.id, {estado: s.value}); });
  $$('.ban-reported-user').forEach((b) => { b.onclick = () => actionUserReport(b.dataset.id, b.dataset.user); });
}

async function updateUserReport(id, body) {
  try { await api.patch(`/admin/reports/users/${id}`, body); toast('Reporte de usuario actualizado'); await loadUserReports(); } catch (e) { toast(e.message, 'error'); }
}

async function actionUserReport(reportId, userId) {
  try {
    await api.patch(`/admin/users/${userId}/status`, {estado: 'inactivo'});
    await api.patch(`/admin/reports/users/${reportId}`, {estado: 'accionado', respuesta_admin: 'Usuario inactivado desde moderación.'});
    toast('Usuario inactivado y reporte accionado');
    await Promise.all([loadUsers(), loadUserReports(), loadLogs()]);
  } catch (e) { toast(e.message, 'error'); }
}

function drawReportsSummary() {
  if (!reportsSummary || !statsData) return;
  reportsSummary.innerHTML = `<div class="grid gap-2"><p>Ventas totales: <b>${money(statsData.ventas_totales || 0)}</b></p><p>Comisiones plataforma: <b>${money(statsData.comisiones_totales || 0)}</b></p><p>Usuarios activos: <b>${Number(statsData.total_usuarios_activos) || 0}</b></p><p>Compradores: <b>${Number(statsData.total_compradores) || 0}</b> · Vendedores: <b>${Number(statsData.total_vendedores) || 0}</b> · Admins: <b>${Number(statsData.total_administradores) || 0}</b></p><p>Productos agotados: <b>${Number(statsData.total_productos_agotados) || 0}</b></p></div><p class="muted mt-3">Productos más vendidos requieren endpoint agregado de ranking global; queda pendiente backend.</p>`;
}

async function loadLogs() {
  try {
    const d = await api.get('/admin/logs');
    logs = d.logs || [];
    drawLogs();
  } catch (e) {
    logsBox.innerHTML = `<p class="text-red-700">${h(e.message)}</p>`;
  }
}

function drawLogs() {
  logsBox.innerHTML = logs.length ? `<div class="grid gap-2">${logs.slice(0, 12).map((l) => `<div class="p-3 rounded-2xl bg-white/70"><b>${h(l.accion || 'acción')}</b><p class="text-sm">Usuario: ${h(l.usuario_nombre || l.usuario_id || 'sistema')} · Módulo: ${h(l.entidad || l.modulo || '')}</p><p class="muted text-sm">${formatDate(l.created_at || l.fecha)}</p></div>`).join('')}</div>` : emptyState('Sin logs', 'Aún no hay eventos de auditoría para mostrar.');
}

async function search() {
  await withButtonLoading(go, async () => {
    try {
      const d = await api.get(`/admin/search?q=${encodeURIComponent(q.value)}`);
      adminSearchResults = d.results || d;
      results.innerHTML = ['usuarios', 'productos', 'tiendas'].map((k) => `<div class="card"><h3 class="font-bold capitalize">${h(k)}</h3>${(adminSearchResults[k] || []).slice(0, 5).map((x) => `<p>${h(x.nombre || x.correo || 'Resultado')} <span class="muted text-sm">${h(x.estado || '')}</span></p>`).join('') || '<p class="muted">Sin resultados</p>'}</div>`).join('');
      drawStores();
    } catch (e) {
      toast(e.message, 'error');
    }
  }, 'Buscando...');
}

function drawStores() {
  const stores = adminSearchResults?.tiendas || [];
  storesBox.innerHTML = stores.length ? `<table class="table"><thead><tr><th>Tienda</th><th>Estado</th><th>Reputación</th><th>Acciones</th></tr></thead><tbody>${stores.map((s) => `<tr><td><b>${h(s.nombre)}</b><p class="muted text-sm">${h(s.slug || '')} · #${Number(s.id) || ''}</p></td><td>${h(s.estado)}</td><td>${h(s.reputacion_promedio || s.nivel_reputacion || '—')}</td><td><div class="flex gap-2"><button class="btn btn-secondary store-action" data-id="${Number(s.id) || ''}" data-action="pause" type="button">Pausar</button><button class="btn btn-primary store-action" data-id="${Number(s.id) || ''}" data-action="activate" type="button">Reactivar</button></div></td></tr>`).join('')}</tbody></table>` : emptyState('Listado global pendiente backend', 'Busca una tienda por nombre para operar resultados devueltos por /admin/search. No existe endpoint dedicado de listado global de tiendas.');
  $$('.store-action').forEach((b) => { b.onclick = () => changeStoreStatus(b.dataset.id, b.dataset.action); });
}

async function changeStoreStatus(id, action) {
  try {
    await api.patch(`/stores/${id}/${action}`, {});
    toast(action === 'pause' ? 'Tienda pausada' : 'Tienda reactivada');
    if (q.value) await search();
  } catch (e) {
    toast(e.message, 'error');
  }
}

async function loadAdminReturns() {
  adminReturnsBox.innerHTML = '<p class="muted">Cargando devoluciones...</p>';
  try { const d = await api.get('/admin/returns'); adminReturns = d.returns || []; drawAdminReturns(); }
  catch (e) { adminReturnsBox.innerHTML = `<p class="text-red-700">${h(e.message)}</p>`; }
}
function drawAdminReturns() {
  if (!adminReturns.length) { adminReturnsBox.innerHTML = emptyState('Sin devoluciones', 'No hay solicitudes de devolución o reembolso.'); return; }
  adminReturnsBox.innerHTML = `<table class="table"><thead><tr><th>Solicitud</th><th>Comprador/Tienda</th><th>Pedido</th><th>Estado</th><th>Monto</th><th>Acciones</th></tr></thead><tbody>${adminReturns.map((r)=>`<tr><td><b>${h(r.numero_solicitud || `#${r.id}`)}</b><p class="muted text-sm">${h(r.motivo)} · ${formatDate(r.creado_en)}</p></td><td>${h(r.comprador_nombre || `#${r.comprador_id}`)}<p class="muted text-sm">${h(r.tienda_nombre || `Tienda #${r.tienda_id}`)}</p></td><td>#${Number(r.pedido_id)||''}</td><td><span class="status-badge ${h(r.estado)}">${h(r.estado)}</span></td><td>${money(r.monto_estimado)}</td><td><div class="grid gap-2 min-w-44">${['en_revision','aprobada','rechazada','reembolso_simulado','cerrada'].map((s)=>`<button class="btn ${s==='rechazada'?'btn-danger':s==='reembolso_simulado'?'btn-primary':'btn-secondary'} admin-return-action" data-id="${Number(r.id)}" data-state="${s}" type="button">${h(s)}</button>`).join('')}</div></td></tr>`).join('')}</tbody></table>`;
  $$('.admin-return-action').forEach((b)=>{ b.onclick=()=>resolveAdminReturn(b.dataset.id,b.dataset.state); });
}
async function resolveAdminReturn(id, estado) {
  const respuesta_admin = await promptDialog({title:'Resolver devolución', message:`Respuesta administrativa para estado ${estado}.`, placeholder:'Respuesta para comprador/vendedor'});
  if (respuesta_admin === null) return;
  try { await api.patch(`/admin/returns/${id}/resolve`, {estado, respuesta_admin}); toast('Devolución actualizada'); await Promise.all([loadAdminReturns(), loadLogs()]); }
  catch (e) { toast(e.message, 'error'); }
}

async function loadDeleteRequests() {
  deleteRequestsBox.innerHTML = '<p class="muted">Cargando solicitudes...</p>';
  try { const d = await api.get('/admin/account-delete-requests'); deleteRequests = d.requests || []; drawDeleteRequests(); }
  catch (e) { deleteRequestsBox.innerHTML = `<p class="text-red-700">${h(e.message)}</p>`; }
}
function drawDeleteRequests() {
  if (!deleteRequests.length) { deleteRequestsBox.innerHTML = emptyState('Sin solicitudes', 'No hay solicitudes de eliminación de cuenta.'); return; }
  deleteRequestsBox.innerHTML = `<table class="table"><thead><tr><th>Usuario</th><th>Correo</th><th>Estado</th><th>Fecha</th><th>Acciones</th></tr></thead><tbody>${deleteRequests.map((r)=>`<tr><td><b>${h(r.nombre)}</b><p class="muted text-sm">#${Number(r.id)||''} · ${h(r.rol||'')}</p></td><td>${h(r.anonimizado ? 'anonimizado' : r.correo)}</td><td><span class="status-badge ${h(r.solicitud_eliminacion_estado)}">${h(r.solicitud_eliminacion_estado)}</span></td><td>${formatDate(r.solicitud_eliminacion_fecha)}</td><td><div class="flex gap-2"><button class="btn btn-danger delete-req-action" data-id="${Number(r.id)}" data-state="aprobada" type="button" ${r.solicitud_eliminacion_estado!=='pendiente'?'disabled':''}>Aprobar</button><button class="btn btn-secondary delete-req-action" data-id="${Number(r.id)}" data-state="rechazada" type="button" ${r.solicitud_eliminacion_estado!=='pendiente'?'disabled':''}>Rechazar</button></div></td></tr>`).join('')}</tbody></table>`;
  $$('.delete-req-action').forEach((b)=>{ b.onclick=()=>resolveDeleteRequest(b.dataset.id,b.dataset.state); });
}
async function resolveDeleteRequest(id, estado) {
  if (estado === 'aprobada') {
    const ok = await confirmDialog({title:'Anonimizar cuenta', message:'Esta acción anonimizará datos personales sin borrar historial transaccional. ¿Deseas continuar?', confirmText:'Anonimizar', danger:true});
    if (!ok) return;
  }
  const respuesta_admin = await promptDialog({title:'Responder solicitud', message:`Respuesta para solicitud ${estado}.`, placeholder:'Motivo o respuesta administrativa'});
  if (respuesta_admin === null) return;
  try { await api.patch(`/admin/account-delete-requests/${id}`, {estado, respuesta_admin}); toast('Solicitud actualizada'); await Promise.all([loadDeleteRequests(), loadUsers(), loadLogs()]); }
  catch (e) { toast(e.message, 'error'); }
}

function formatDate(value) {
  if (!value) return 'Fecha no disponible';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? h(value) : d.toLocaleString('es-CO');
}

render();
