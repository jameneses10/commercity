import { api, token } from './api.js';
import { productCard, money } from './ui.js';
import { UPLOADS_BASE_URL } from './config.js';

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
let usingProductFallback = false;
let usingCategoryFallback = false;

function esc(value){
  return String(value ?? '').replace(/[&<>"]/g, char=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[char]));
}

function normalizeList(data, key) {
  const payload = data?.data || data || {};
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload[key])) return payload[key];
  if (Array.isArray(data?.[key])) return data[key];
  return [];
}

function productCategoryId(product){ return String(product.categoria_id || product.category_id || product.id_categoria || ''); }
function productCategoryName(product){ return String(product.categoria_nombre || product.category_name || product.categoria || product.categoria_slug || 'Categoría general'); }
function productStoreName(product){ return String(product.tienda_nombre || product.vendedor_nombre || product.store_name || product.seller_name || 'Tienda CommerCity'); }
function productRating(product){ return Number(product.calificacion || product.rating || product.calificacion_promedio || product.reputacion || product.reputation || 0); }
function productPrice(product){ return Number(product.precio_final || product.precio || product.price || 0); }
function productImage(product){
  const direct=product.imagen_url || product.image_url || product.imagen || '';
  const first=Array.isArray(product.imagenes) ? product.imagenes[0] : null;
  const fromList=first?.url || first?.ruta || first?.path || '';
  const value=direct || fromList;
  if(!value) return 'assets/icons/cc-product-card.svg';
  if(String(value).startsWith('http') || String(value).startsWith('assets/')) return value;
  if(String(value).startsWith('/uploads')) return `${UPLOADS_BASE_URL}${String(value).replace('/uploads','')}`;
  return `${UPLOADS_BASE_URL}/${String(value).replace(/^\/+/, '')}`;
}

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
  const summary=document.querySelector('[data-filter-summary]');
  if(summary) summary.textContent = `Sin resultados para “${filters.q || 'todos'}”.`;
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
  if(summary){
    const origin=usingProductFallback ? 'vista visual de respaldo' : 'API real';
    summary.textContent = `${filtered.length} producto${filtered.length===1?'':'s'} visible${filtered.length===1?'':'s'} desde ${origin}.`;
  }
}

function categoryName(category){
  return String(category.nombre || category.name || category.slug || 'Categoría CommerCity');
}

function categoryCard(category) {
  const name=categoryName(category);
  return `<a class="cc-card cc-category-card" href="productos.html?categoria=${encodeURIComponent(category.id || name)}"><img class="cc-icon" src="assets/icons/cc-categories.svg" alt="Categoría"><span><b>${esc(name)}</b><small>${usingCategoryFallback ? 'Vista visual' : 'Categoría real'} · Explorar productos</small></span></a>`;
}

function populateCategoryFilter(categories){
  const select=document.querySelector('[data-category-filter]');
  if(!select) return;
  const selected = new URLSearchParams(location.search).get('categoria') || select.value || '';
  select.innerHTML = '<option value="">Todas las categorías</option>' + categories.map(c=>`<option value="${esc(c.id || categoryName(c))}">${esc(categoryName(c))}</option>`).join('');
  select.value = selected;
}

function bindCatalogFilters(){
  const form=document.querySelector('[data-product-filters]');
  if(!form || form.dataset.boundCatalog === 'true') return;
  form.dataset.boundCatalog='true';
  form.addEventListener('submit', event=>{ event.preventDefault(); renderCatalog(); });
  form.querySelectorAll('input,select').forEach(control=>control.addEventListener('change', renderCatalog));
  form.querySelector('[data-product-search]')?.addEventListener('input', renderCatalog);
  bindClearFilters();
}

function bindClearFilters(){
  document.querySelectorAll('[data-clear-filters]').forEach(btn=>{
    if(btn.dataset.boundClear==='true') return;
    btn.dataset.boundClear='true';
    btn.addEventListener('click',()=>{
      const search=document.querySelector('[data-product-search]');
      const category=document.querySelector('[data-category-filter]');
      const sort=document.querySelector('[data-product-sort]');
      if(search) search.value='';
      if(category) category.value='';
      if(sort) sort.value='recent';
      renderCatalog();
    });
  });
}

export async function addCart(product){
  const id=String(product.id || product.producto_id || product.product_id || '');
  if(token()){
    await api.post('/cart/items', { product_id:Number(id), cantidad:1 });
    return { api:true };
  }
  const key='cc_cart_local';
  const list=JSON.parse(localStorage.getItem(key) || '[]');
  const found=list.find(item=>String(item.id)===id);
  if(found) found.cantidad += 1;
  else list.push({ id, nombre: product.nombre || 'Producto CommerCity', precio: productPrice(product), cantidad:1 });
  localStorage.setItem(key, JSON.stringify(list));
  return { local:true };
}

export function addLocalCart(product){ return addCart(product); }

function localFavorites(){
  try { return JSON.parse(localStorage.getItem('cc_favorites_local') || '[]'); } catch { return []; }
}
function saveLocalFavorites(list){
  localStorage.setItem('cc_favorites_local', JSON.stringify(list));
}

export async function addFavorite(product){
  const id=String(product.id || product.producto_id || product.product_id || '');
  if(!id) return { local:false };
  if(!token()){
    const list=localFavorites();
    if(!list.some(item=>String(item.id)===id)) list.push({ id, nombre: product.nombre || 'Producto CommerCity', precio: productPrice(product), tienda_nombre: productStoreName(product) });
    saveLocalFavorites(list);
    return { local:true };
  }
  try{
    await api.post(`/favorites/${encodeURIComponent(id)}`, {});
    return { api:true };
  }catch(error){
    if(error.status===409) return { api:true, duplicate:true };
    const list=localFavorites();
    if(!list.some(item=>String(item.id)===id)) list.push({ id, nombre: product.nombre || 'Producto CommerCity', precio: productPrice(product), tienda_nombre: productStoreName(product) });
    saveLocalFavorites(list);
    return { local:true };
  }
}

function bindProductActions(){
  document.addEventListener('click', async event=>{
    const cartBtn=event.target.closest('[data-cart]');
    if(cartBtn && cartBtn.dataset.boundCart!=='true'){
      const id=String(cartBtn.dataset.cart);
      const product=catalogProducts.find(item=>String(item.id || item.producto_id || item.product_id)===id) || { id, nombre:'Producto CommerCity', precio:0 };
      try{
        const result=await addCart(product);
        cartBtn.dataset.boundCart='true';
        cartBtn.innerHTML=`<span class="cc-btn-icon"><img class="cc-icon" src="assets/icons/cc-shopping-cart.svg" alt=""></span>${result.api?'Sincronizado':'Añadido'}`;
      }catch(error){
        cartBtn.dataset.boundCart='true';
        cartBtn.innerHTML='<span class="cc-btn-icon"><img class="cc-icon" src="assets/icons/cc-shopping-cart.svg" alt=""></span>Sin stock';
      }
      setTimeout(()=>{ cartBtn.dataset.boundCart=''; cartBtn.innerHTML='<span class="cc-btn-icon"><img class="cc-icon" src="assets/icons/cc-shopping-cart.svg" alt=""></span>Añadir'; },1200);
    }
    const favBtn=event.target.closest('[data-favorite]');
    if(favBtn && favBtn.dataset.busyFavorite!=='true'){
      favBtn.dataset.busyFavorite='true';
      const id=String(favBtn.dataset.favorite);
      const product=catalogProducts.find(item=>String(item.id || item.producto_id || item.product_id)===id) || { id, nombre:'Producto CommerCity', precio:0 };
      const result=await addFavorite(product);
      favBtn.classList.add('saved');
      favBtn.setAttribute('aria-label', 'Quitar de favoritos');
      favBtn.setAttribute('title', result.api ? 'Favorito guardado' : 'Favorito guardado localmente');
      favBtn.innerHTML='<span class="cc-btn-icon"><img class="cc-icon" src="assets/icons/cc-favorites-wishlist.svg" alt=""></span>';
      setTimeout(()=>{ favBtn.dataset.busyFavorite=''; favBtn.setAttribute('title', 'Quitar de favoritos'); },1400);
    }
  });
}

export async function loadProducts(limit = 8) {
  const box = document.querySelector('[data-products]');
  if (!box) return;
  box.innerHTML = '<div class="cc-card cc-loading-card">Cargando productos desde la API...</div>';
  try {
    const data = await api.get(`/products?page=1&limit=${limit}`);
    const list = normalizeList(data, 'products');
    usingProductFallback = false;
    catalogProducts = list;
    if(!catalogProducts.length){
      box.innerHTML = '<section class="cc-card cc-empty-state"><img class="cc-icon-lg" src="assets/icons/cc-product-card.svg" alt=""><h2>No hay productos disponibles.</h2><p class="cc-muted">La API respondió correctamente, pero no devolvió productos activos.</p></section>';
      return;
    }
    if(document.querySelector('[data-product-filters]')){
      setInitialFilters(); bindCatalogFilters(); renderCatalog();
    } else {
      box.innerHTML = catalogProducts.map(productCard).join('');
    }
  } catch(error) {
    usingProductFallback = true;
    catalogProducts = fallbackProducts;
    if(document.querySelector('[data-product-filters]')){
      setInitialFilters(); bindCatalogFilters(); renderCatalog();
    } else {
      box.innerHTML = `<div class="cc-card cc-soft-warning"><h3 class="text-xl font-bold">No pudimos cargar productos reales.</h3><p>${esc(error.message)} Se muestra respaldo visual controlado.</p></div>${fallbackProducts.map(productCard).join('')}`;
    }
  } finally {
    bindProductActions();
  }
}

export async function loadCategories() {
  const box = document.querySelector('[data-categories]');
  try {
    const data = await api.get('/categories');
    const list = normalizeList(data, 'categories').filter(c=>categoryName(c).trim());
    usingCategoryFallback = false;
    catalogCategories = list;
  } catch {
    usingCategoryFallback = true;
    catalogCategories = fallbackCategories;
  }
  if(!catalogCategories.length){
    usingCategoryFallback = true;
    catalogCategories = fallbackCategories;
  }
  populateCategoryFilter(catalogCategories);
  if (box) box.innerHTML = catalogCategories.slice(0, 12).map(categoryCard).join('');
}

export async function loadProductDetail() {
  const box = document.querySelector('[data-product-detail]');
  if (!box) return;
  const id = new URLSearchParams(location.search).get('id');
  if(!id){
    box.innerHTML = `<section class="cc-card cc-empty-state"><img class="cc-icon-lg" src="assets/icons/cc-product-detail.svg" alt=""><h1 class="text-3xl font-bold">Producto no especificado.</h1><p class="cc-muted">Abre el detalle desde el catálogo para consultar un producto real.</p><a class="cc-btn" href="productos.html">Volver al catálogo</a></section>`;
    return;
  }
  box.innerHTML = '<div class="cc-card cc-loading-card">Cargando producto real...</div>';
  try {
    const data = await api.get(`/products/${encodeURIComponent(id)}`);
    const p = data.data?.product || data.product || data.producto || data.data || data;
    box.innerHTML = `<div class="cc-grid cols-2"><section class="cc-card"><div class="cc-product-media h-96"><img src="${esc(productImage(p))}" alt="${esc(p.nombre || 'Producto CommerCity')}"></div></section><section class="cc-card"><span class="cc-chip orange">Producto real</span><h1 class="text-4xl font-bold mt-4">${esc(p.nombre || 'Producto CommerCity')}</h1><p class="cc-muted mt-3">${esc(p.descripcion || 'Producto publicado por vendedor verificado.')}</p><p class="cc-price mt-5">${money(productPrice(p))}</p><p class="mt-2">Stock: <b>${esc(p.stock ?? 'Disponible')}</b></p><p class="cc-muted mt-2">Categoría: <b>${esc(productCategoryName(p))}</b></p><p class="cc-muted mt-2">Tienda: <b>${esc(productStoreName(p))}</b></p><div class="grid md:grid-cols-3 gap-3 mt-6"><button class="cc-btn" data-cart="${esc(p.id || id)}"><span class="cc-btn-icon"><img class="cc-icon" src="assets/icons/cc-shopping-cart.svg" alt=""></span>Añadir al carrito</button><button class="cc-btn outline" data-favorite="${esc(p.id || id)}" type="button"><span class="cc-btn-icon"><img class="cc-icon" src="assets/icons/cc-favorites-wishlist.svg" alt=""></span>Favorito</button><a class="cc-btn secondary" href="chat.html">Consultar vendedor</a></div></section></div>`;
    catalogProducts=[p];
    bindProductActions();
  } catch(error) {
    box.innerHTML = `<section class="cc-card cc-empty-state"><img class="cc-icon-lg" src="assets/icons/cc-product-detail.svg" alt=""><h1 class="text-3xl font-bold">No pudimos cargar este producto.</h1><p class="cc-muted">${esc(error.message)}</p><a class="cc-btn" href="productos.html">Volver al catálogo</a></section>`;
  }
}
