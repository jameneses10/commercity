
import {api, assetUrl} from './api.js';
import {sidebar, $, $$, money, toast, preview, h, emptyState, withButtonLoading} from './ui.js';
import {requireAuth} from './auth.js';

let store = null;
let products = [];
let editingProduct = null;
let categories = [];

async function render() {
  app.innerHTML = `<div class="dashboard">${sidebar('tienda', 'vendedor')}<main class="container"><section id="hero" class="hero glass mb-6"></section><section class="stats mb-6" id="stats"></section><section class="grid lg:grid-cols-2 gap-6"><form id="storeForm" class="card grid gap-3"><h2 class="text-2xl font-bold">Crear / editar tienda</h2><input class="input" name="nombre" placeholder="Nombre tienda" required><textarea class="input" name="descripcion" placeholder="Descripción"></textarea><div class="grid md:grid-cols-2 gap-3"><label>Logo<input class="input" id="logo" name="logo" type="file" accept="image/*"></label><label>Banner<input class="input" id="banner" name="banner" type="file" accept="image/*"></label></div><div id="storePreview" class="thumbs"></div><div id="storeActions" class="grid md:grid-cols-2 gap-2"></div><button class="btn btn-primary" type="submit">Guardar tienda</button></form><form id="productForm" class="card grid gap-3"><div class="flex justify-between gap-3 items-start"><div><h2 id="productFormTitle" class="text-2xl font-bold">Crear producto</h2><p id="productGuard" class="muted text-sm mt-1"></p></div><button id="cancelEdit" class="btn btn-ghost hidden" type="button">Cancelar edición</button></div><input type="hidden" name="product_id"><label>Nombre<input class="input" name="nombre" placeholder="Nombre producto" required></label><label>Descripción<textarea class="input" name="descripcion" placeholder="Descripción" required></textarea></label><div class="grid md:grid-cols-3 gap-3"><label>Categoría<select class="select" name="categoria_id" id="cat" required></select></label><label>Precio<input class="input" name="precio" type="number" min="1" step="0.01" placeholder="Precio" required></label><label>Stock<input class="input" name="stock" type="number" min="0" step="1" placeholder="Stock" required></label></div><label>Visibilidad al editar<select class="select" name="estado" id="productState"><option value="activo">Visible</option><option value="oculto">Oculto</option><option value="agotado">Agotado</option></select></label><p class="field-hint">La visibilidad se aplica al guardar cambios o desde el botón Visible/Oculto de cada producto.</p><input class="input" id="images" name="images" type="file" multiple accept="image/*"><div id="productPreview" class="thumbs"></div><button id="saveProductBtn" class="btn btn-primary" type="submit">Crear producto</button></form></section><section class="card mt-6"><h2 class="text-2xl font-bold mb-4">Inventario</h2><div id="products"></div></section></main></div>`;
  await requireAuth(api, ['vendedor']);
  preview(logo, '#storePreview');
  preview(banner, '#storePreview');
  preview(images, '#productPreview');
  storeForm.onsubmit = saveStore;
  productForm.onsubmit = saveProduct;
  cancelEdit.onclick = resetProductForm;
  await load();
}

async function load() {
  await loadStore();
  await loadCategories();
  await loadStats();
  await loadProducts();
  drawStore();
  updateProductFormAvailability();
}

async function loadStore() {
  try {
    store = (await api.get('/stores/me')).store;
  } catch {
    store = null;
  }
}

async function loadCategories() {
  try {
    categories = (await api.get('/categories', {auth: false})).categories || [];
    cat.innerHTML = categories.map((c) => `<option value="${Number(c.id) || ''}">${h(c.nombre)}</option>`).join('') || '<option value="">Sin categorías</option>';
  } catch (e) {
    toast(e.message, 'error');
  }
}

async function loadStats() {
  stats.innerHTML = '';
  if (!store) {
    stats.innerHTML = '<div class="card"><b>Estado</b><div class="stat-value">—</div><p class="muted mt-2">Crea tu tienda para ver estadísticas.</p></div>';
    return;
  }
  try {
    const s = await api.get('/seller/store/stats');
    stats.innerHTML = `<div class="card"><b>Productos</b><div class="stat-value">${Number(s.stats?.total_productos) || 0}</div></div><div class="card"><b>Activos</b><div class="stat-value">${Number(s.stats?.productos_activos) || 0}</div></div><div class="card"><b>Agotados</b><div class="stat-value">${Number(s.stats?.productos_agotados) || 0}</div></div><div class="card"><b>Estado tienda</b><div class="stat-value text-2xl">${h(store.estado || 'activa')}</div></div>`;
  } catch {
    stats.innerHTML = `<div class="card"><b>Estado tienda</b><div class="stat-value text-2xl">${h(store.estado || 'activa')}</div></div>`;
  }
}

async function loadProducts() {
  products = [];
  if (!store) {
    drawProducts();
    return;
  }
  try {
    const d = await api.get(`/products?store_id=${store.id}&limit=50`, {auth: false});
    products = d.products || [];
  } catch (e) {
    toast(e.message, 'error');
  }
  drawProducts();
}

function drawStore() {
  const status = store?.estado || 'sin tienda';
  hero.innerHTML = `<div class="min-h-48 rounded-[28px] p-8 flex items-end" style="background:linear-gradient(90deg,rgba(0,112,234,.65),rgba(255,128,0,.65)),url('${assetUrl(store?.banner_url)}') center/cover"><div><img src="${assetUrl(store?.logo_url)}" class="w-24 h-24 rounded-3xl object-cover bg-white p-2" alt="Logo tienda"><h1 class="text-4xl font-extrabold text-white mt-3">${h(store?.nombre || 'Mi Tienda')}</h1><p class="pill mt-3">Estado: ${h(status)}</p></div></div><p class="mt-4 muted">${h(store?.descripcion || 'Primero debes crear tu tienda para publicar productos.')}</p>`;
  storeForm.nombre.value = store?.nombre || storeForm.nombre.value || '';
  storeForm.descripcion.value = store?.descripcion || storeForm.descripcion.value || '';
  drawStoreActions();
}

function drawStoreActions() {
  if (!store) {
    storeActions.innerHTML = '<div class="p-3 rounded-2xl bg-orange-50 text-orange-900 md:col-span-2"><b>Primero debes crear tu tienda para publicar productos.</b></div>';
    return;
  }
  const paused = store.estado !== 'activa';
  storeActions.innerHTML = `<button id="pauseStore" class="btn btn-secondary" type="button" ${paused ? 'disabled' : ''}>Pausar tienda</button><button id="activateStore" class="btn btn-primary" type="button" ${!paused ? 'disabled' : ''}>Reactivar tienda</button>`;
  pauseStore.onclick = () => changeStoreStatus('pause');
  activateStore.onclick = () => changeStoreStatus('activate');
}

function updateProductFormAvailability() {
  const disabled = !store || store.estado !== 'activa';
  [...productForm.elements].forEach((el) => {
    if (el.id !== 'cancelEdit') el.disabled = disabled;
  });
  productGuard.textContent = !store
    ? 'Primero debes crear tu tienda para publicar productos.'
    : store.estado !== 'activa'
      ? 'Tu tienda está pausada. Reactívala para crear o editar productos.'
      : 'Gestión de productos habilitada.';
}

function drawProducts() {
  if (!store) {
    productsEl().innerHTML = emptyState('Primero crea tu tienda', 'Cuando tengas una tienda activa, aquí podrás gestionar tus productos.');
    return;
  }
  if (!products.length) {
    productsEl().innerHTML = emptyState('Sin productos visibles', 'Crea tu primer producto. Si ocultas o eliminas productos, dejarán de aparecer en el catálogo público.');
    return;
  }
  productsEl().innerHTML = `<table class="table"><thead><tr><th>Producto</th><th>Stock</th><th>Precio</th><th>Estado</th><th>Imágenes</th><th>Acciones</th></tr></thead><tbody>${products.map((p) => productRow(p)).join('')}</tbody></table>`;
  $$('.edit-product').forEach((b) => { b.onclick = () => startEdit(products.find((p) => p.id == b.dataset.id)); });
  $$('.delete-product').forEach((b) => { b.onclick = () => deleteProduct(b.dataset.id); });
  $$('.toggle-visibility').forEach((b) => { b.onclick = () => toggleVisibility(products.find((p) => p.id == b.dataset.id)); });
  $$('.del-img').forEach((b) => { b.onclick = () => deleteImage(b.dataset.p, b.dataset.i); });
}

function productsEl() {
  return document.getElementById('products');
}

function productRow(p) {
  const state = p.estado || 'activo';
  const nextState = state === 'oculto' ? 'activo' : 'oculto';
  const visibilityLabel = state === 'oculto' ? 'Visible' : 'Oculto';
  return `<tr><td><div class="flex gap-3"><img src="${assetUrl(p.imagenes?.[0]?.url_imagen || p.imagen_url)}" class="w-14 h-14 rounded-2xl object-cover" alt="${h(p.nombre)}"><div><b>${h(p.nombre)}</b><p class="muted text-sm">ID ${Number(p.id) || ''}</p><p class="muted text-xs">${h(p.categoria_nombre || '')}</p></div></div></td><td>${Number(p.stock) || 0}</td><td>${money(p.precio_final || p.precio)}</td><td><span class="pill ${state === 'oculto' ? '' : 'orange'}">${h(state)}</span></td><td>${(p.imagenes || []).filter((i) => i.id).map((i) => `<button class="text-red-600 del-img" type="button" data-p="${Number(p.id) || ''}" data-i="${Number(i.id) || ''}">Eliminar imagen ${Number(i.id) || ''}</button>`).join('<br>') || '—'}</td><td><div class="grid gap-2 min-w-40"><button class="btn btn-secondary edit-product" type="button" data-id="${Number(p.id) || ''}">Editar</button><button class="btn btn-ghost toggle-visibility" type="button" data-id="${Number(p.id) || ''}" data-next="${nextState}">${visibilityLabel}</button><button class="btn btn-danger delete-product" type="button" data-id="${Number(p.id) || ''}">Eliminar</button></div></td></tr>`;
}

function startEdit(p) {
  if (!p) return;
  editingProduct = p;
  productForm.product_id.value = p.id;
  productForm.nombre.value = p.nombre || '';
  productForm.descripcion.value = p.descripcion || '';
  productForm.precio.value = Number(p.precio || p.precio_final || 0);
  productForm.stock.value = Number(p.stock || 0);
  productForm.categoria_id.value = p.categoria_id || '';
  productState.value = p.estado || 'activo';
  productFormTitle.textContent = `Editar producto #${p.id}`;
  saveProductBtn.textContent = 'Guardar cambios';
  cancelEdit.classList.remove('hidden');
  productForm.scrollIntoView({behavior: 'smooth', block: 'start'});
}

function resetProductForm() {
  editingProduct = null;
  productForm.reset();
  productForm.product_id.value = '';
  productState.value = 'activo';
  productPreview.innerHTML = '';
  productFormTitle.textContent = 'Crear producto';
  saveProductBtn.textContent = 'Crear producto';
  cancelEdit.classList.add('hidden');
  updateProductFormAvailability();
}

async function changeStoreStatus(action) {
  if (!store) return;
  const label = action === 'pause' ? 'pausar' : 'reactivar';
  if (!confirm(`¿Confirmas ${label} esta tienda?`)) return;
  try {
    const d = await api.patch(`/stores/${store.id}/${action}`, {});
    store = d.store || d;
    toast(action === 'pause' ? 'Tienda pausada' : 'Tienda reactivada');
    await load();
  } catch (e) {
    toast(e.message, 'error');
  }
}

async function saveStore(e) {
  e.preventDefault();
  const btn = storeForm.querySelector('button[type="submit"]');
  const fd = new FormData(storeForm);
  if (!fd.get('nombre') && store?.nombre) fd.set('nombre', store.nombre);
  await withButtonLoading(btn, async () => {
    try {
      const d = store ? await api.form('/stores/me', fd, {method: 'PATCH'}) : await api.form('/stores', fd);
      store = d.store || d;
      toast('Tienda guardada');
      await load();
    } catch (err) {
      toast(err.message, 'error');
    }
  }, 'Guardando tienda...');
}

async function saveProduct(e) {
  e.preventDefault();
  if (!store) return toast('Primero debes crear tu tienda para publicar productos.', 'error');
  if (store.estado !== 'activa') return toast('Reactiva tu tienda para gestionar productos.', 'error');
  const btn = productForm.querySelector('button[type="submit"]');
  const fd = new FormData(productForm);
  const id = fd.get('product_id');
  fd.delete('product_id');
  if (!id) fd.delete('estado');
  await withButtonLoading(btn, async () => {
    try {
      await api.form(id ? `/products/${id}` : '/products', fd, {method: id ? 'PATCH' : 'POST'});
      toast(id ? 'Producto actualizado' : 'Producto creado');
      resetProductForm();
      await load();
    } catch (err) {
      toast(err.message, 'error');
    }
  }, id ? 'Guardando cambios...' : 'Creando producto...');
}

async function deleteProduct(id) {
  if (!confirm('¿Eliminar este producto? Se hará una eliminación lógica y dejará de verse en el catálogo.')) return;
  try {
    await api.delete(`/products/${id}`);
    toast('Producto eliminado');
    await load();
  } catch (e) {
    toast(e.message, 'error');
  }
}

async function toggleVisibility(p) {
  if (!p) return;
  const estado = p.estado === 'oculto' ? 'activo' : 'oculto';
  if (estado === 'activo' && Number(p.stock) <= 0) return toast('No se puede activar un producto sin stock.', 'error');
  try {
    await api.patch(`/products/${p.id}/visibility`, {estado});
    toast(estado === 'activo' ? 'Producto visible' : 'Producto oculto');
    await load();
  } catch (e) {
    toast(e.message, 'error');
  }
}

async function deleteImage(productId, imageId) {
  if (!confirm('¿Eliminar esta imagen del producto?')) return;
  try {
    await api.delete(`/products/${productId}/images/${imageId}`);
    toast('Imagen eliminada');
    await load();
  } catch (e) {
    toast(e.message, 'error');
  }
}

render();
