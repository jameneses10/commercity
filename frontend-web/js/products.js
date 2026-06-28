import { api } from './api.js';
import { productCard, money } from './ui.js';

const fallbackProducts = [
  { id: 101, nombre: 'Morral urbano CommerCity', precio: 129900, categoria_nombre: 'Moda', tienda_nombre: 'Tienda local verificada', calificacion: 4.8 },
  { id: 102, nombre: 'Audífonos inalámbricos', precio: 89900, categoria_nombre: 'Tecnología', tienda_nombre: 'ElectroMarket', calificacion: 4.6 },
  { id: 103, nombre: 'Kit hogar organizado', precio: 159000, categoria_nombre: 'Hogar', tienda_nombre: 'Casa Viva', calificacion: 4.7 },
  { id: 104, nombre: 'Set deportivo esencial', precio: 112000, categoria_nombre: 'Deportes', tienda_nombre: 'Activa Store', calificacion: 4.5 }
];

const fallbackCategories = [
  { id: 1, nombre: 'Tecnología' },
  { id: 2, nombre: 'Moda' },
  { id: 3, nombre: 'Hogar' },
  { id: 4, nombre: 'Deportes' },
  { id: 5, nombre: 'Belleza' },
  { id: 6, nombre: 'Accesorios' },
  { id: 7, nombre: 'Ferretería' },
  { id: 8, nombre: 'Joyería' }
];

let catalogProducts = [];
let catalogCategories = [];

function productFallbackCard(product) {
  return `<article class="cc-product"><div class="cc-product-media"><img src="assets/icons/cc-product-card.svg" alt="Producto destacado"></div><div class="cc-product-body"><span class="cc-chip orange">Vista previa</span><h3 class="text-xl font-bold">${product.nombre}</h3><p class="cc-muted">${product.tienda_nombre}</p><p class="cc-price">${money(product.precio)}</p><p class="cc-muted text-sm">Producto de muestra visual mientras se restablece la conexión pública con la API.</p><div class="grid grid-cols-2 gap-2 mt-auto"><a class="cc-btn outline" href="producto-detalle.html?id=${product.id}">Ver detalle</a><button class="cc-btn"><span class="cc-btn-icon"><img class="cc-icon" src="assets/icons/cc-shopping-cart.svg" alt=""></span>Añadir</button></div></div></article>`;
}

function categoryCard(category) {
  return `<a class="cc-card cc-category-card" href="productos.html?categoria=${category.id}"><img class="cc-icon" src="assets/icons/cc-categories.svg" alt="Categoría"><span><b>${category.nombre}</b><small>Explorar ofertas y tiendas</small></span></a>`;
}

function normalizeList(data, key) {
  const payload = data.data || data;
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload[key])) return payload[key];
  if (Array.isArray(data[key])) return data[key];
  return [];
}

function productCategoryId(product){ return String(product.categoria_id || product.category_id || product.id_categoria || ''); }
function productCategoryName(product){ return String(product.categoria_nombre || product.category_name || product.categoria || ''); }
function productStoreName(product){ return String(product.tienda_nombre || product.vendedor_nombre || product.store_name || product.seller_name || ''); }
function productRating(product){ return Number(product.calificacion || product.rating || product.reputacion || product.reputation || 0); }
function productPrice(product){ return Number(product.precio || product.price || 0); }

function matchesCategory(product, category){
  if(!category) return true;
  const wanted = String(category).toLowerCase();
  return productCategoryId(product) === String(category) || productCategoryName(product).toLowerCase() === wanted;
}

function matchesQuery(product, query){
  if(!query) return true;
  const q = query.toLowerCase();
  return [product.nombre, product.descripcion, productCategoryName(product), productStoreName(product)].some(value => String(value || '').toLowerCase().includes(q));
}

function sortProducts(list, sort){
  const copy=[...list];
  if(sort === 'price-asc') return copy.sort((a,b)=>productPrice(a)-productPrice(b));
  if(sort === 'price-desc') return copy.sort((a,b)=>productPrice(b)-productPrice(a));
  if(sort === 'rating-desc') return copy.sort((a,b)=>productRating(b)-productRating(a));
  return copy;
}

function currentFilters(){
  const params = new URLSearchParams(location.search);
  return {
    q: (document.querySelector('[data-product-search]')?.value || params.get('q') || '').trim(),
    categoria: document.querySelector('[data-category-filter]')?.value || params.get('categoria') || '',
    orden: document.querySelector('[data-product-sort]')?.value || params.get('orden') || 'recent'
  };
}

function setInitialFilters(){
  const params = new URLSearchParams(location.search);
  const search = document.querySelector('[data-product-search]');
  const sort = document.querySelector('[data-product-sort]');
  if(search && params.get('q')) search.value = params.get('q');
  if(sort && params.get('orden')) sort.value = params.get('orden');
}

function renderNoResults(box, filters){
  box.innerHTML = `<section class="cc-card cc-empty-state"><img class="cc-icon-lg" src="assets/icons/cc-search.svg" alt=""><h2 class="text-2xl font-bold">No encontramos productos para tu búsqueda.</h2><p class="cc-muted">Ajusta el texto, cambia la categoría o limpia los filtros para volver al catálogo completo.</p><button class="cc-btn" type="button" data-clear-filters>Limpiar filtros</button></section>`;
  document.querySelector('[data-filter-summary]').textContent = `Sin resultados para “${filters.q || 'todos'}”.`;
  bindClearFilters();
}

function renderCatalog(){
  const box=document.querySelector('[data-products]');
  if(!box || !document.querySelector('[data-product-filters]')) return;
  const filters=currentFilters();
  const filtered = sortProducts(catalogProducts.filter(p=>matchesQuery(p, filters.q) && matchesCategory(p, filters.categoria)), filters.orden);
  if(!filtered.length){ renderNoResults(box, filters); return; }
  box.innerHTML = filtered.map(productCard).join('');
  const summary = document.querySelector('[data-filter-summary]');
  if(summary) summary.textContent = `${filtered.length} producto${filtered.length===1?'':'s'} visible${filtered.length===1?'':'s'} con los filtros actuales.`;
}

function populateCategoryFilter(categories){
  const select=document.querySelector('[data-category-filter]');
  if(!select) return;
  const selected = new URLSearchParams(location.search).get('categoria') || select.value || '';
  select.innerHTML = '<option value="">Todas las categorías</option>' + categories.map(c=>`<option value="${c.id || c.nombre}">${c.nombre}</option>`).join('');
  select.value = selected;
}

function bindCatalogFilters(){
  const form=document.querySelector('[data-product-filters]');
  if(!form) return;
  form.addEventListener('submit', event=>{ event.preventDefault(); renderCatalog(); });
  form.querySelectorAll('input,select').forEach(control=>control.addEventListener('change', renderCatalog));
  form.querySelector('[data-product-search]')?.addEventListener('input', renderCatalog);
  bindClearFilters();
}

function bindClearFilters(){
  document.querySelectorAll('[data-clear-filters]').forEach(btn=>btn.addEventListener('click',()=>{
    const search=document.querySelector('[data-product-search]');
    const category=document.querySelector('[data-category-filter]');
    const sort=document.querySelector('[data-product-sort]');
    if(search) search.value='';
    if(category) category.value='';
    if(sort) sort.value='recent';
    renderCatalog();
  }));
}

export async function loadProducts(limit = 8) {
  const box = document.querySelector('[data-products]');
  if (!box) return;
  box.innerHTML = '<div class="cc-card cc-loading-card">Cargando productos destacados...</div>';
  try {
    const data = await api.get(`/products?page=1&limit=${limit}`);
    const list = normalizeList(data, 'products');
    catalogProducts = list.length ? list : fallbackProducts;
    if(document.querySelector('[data-product-filters]')){
      setInitialFilters();
      bindCatalogFilters();
      renderCatalog();
    } else {
      box.innerHTML = catalogProducts.length ? catalogProducts.map(productCard).join('') : fallbackProducts.map(productFallbackCard).join('');
    }
  } catch {
    catalogProducts = fallbackProducts;
    if(document.querySelector('[data-product-filters]')){
      setInitialFilters();
      bindCatalogFilters();
      renderCatalog();
    } else {
      box.innerHTML = `<div class="cc-card cc-soft-warning"><h3 class="text-xl font-bold">No pudimos cargar los productos en este momento.</h3><p>Intenta nuevamente en unos segundos. Mientras tanto puedes revisar ejemplos visuales del marketplace.</p></div>${fallbackProducts.map(productFallbackCard).join('')}`;
    }
  }
}

export async function loadCategories() {
  const box = document.querySelector('[data-categories]');
  try {
    const data = await api.get('/categories');
    const list = normalizeList(data, 'categories');
    catalogCategories = list.length ? list : fallbackCategories;
  } catch {
    catalogCategories = fallbackCategories;
  }
  populateCategoryFilter(catalogCategories);
  if (box) box.innerHTML = catalogCategories.slice(0, 8).map(categoryCard).join('');
}

export async function loadProductDetail() {
  const box = document.querySelector('[data-product-detail]');
  if (!box) return;
  const id = new URLSearchParams(location.search).get('id') || '103';
  try {
    const data = await api.get(`/products/${id}`);
    const p = data.data?.product || data.product || data.producto || data.data || data;
    box.innerHTML = `<div class="cc-grid cols-2"><section class="cc-card"><div class="cc-product-media h-96"><img src="assets/icons/cc-product-detail.svg" alt="Producto"></div></section><section class="cc-card"><span class="cc-chip orange">Detalle verificado</span><h1 class="text-4xl font-bold mt-4">${p.nombre || 'Producto CommerCity'}</h1><p class="cc-muted mt-3">${p.descripcion || 'Producto publicado por vendedor verificado.'}</p><p class="cc-price mt-5">${money(p.precio)}</p><p class="mt-2">Stock: <b>${p.stock ?? 'Disponible'}</b></p><p class="cc-muted mt-2">Tienda: <b>${productStoreName(p) || 'Vendedor verificado'}</b></p><div class="grid md:grid-cols-2 gap-3 mt-6"><button class="cc-btn"><span class="cc-btn-icon"><img class="cc-icon" src="assets/icons/cc-shopping-cart.svg" alt=""></span>Añadir al carrito</button><a class="cc-btn secondary" href="chat.html">Consultar vendedor</a></div></section></div>`;
  } catch {
    const p = fallbackProducts[0];
    box.innerHTML = `<div class="cc-grid cols-2"><section class="cc-card"><div class="cc-product-media h-96"><img src="assets/icons/cc-product-detail.svg" alt="Producto"></div></section><section class="cc-card"><span class="cc-chip orange">Vista previa</span><h1 class="text-4xl font-bold mt-4">${p.nombre}</h1><p class="cc-muted mt-3">No pudimos cargar el producto real en este momento. Esta vista mantiene la experiencia visual lista para revisión.</p><p class="cc-price mt-5">${money(p.precio)}</p><div class="cc-alert mt-4">Cuando el backend público esté disponible, este detalle cargará datos reales.</div><a class="cc-btn mt-4" href="productos.html">Volver al catálogo</a></section></div>`;
  }
}
