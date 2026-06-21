
import {api, assetUrl} from './api.js';
import {shell, bindShell, $, money, toast, h, icon, skeletonProducts, emptyState, withButtonLoading} from './ui.js';
import {addCart} from './cart-store.js';
import {getToken} from './auth.js';

let page = 1;
let products = [];
let categories = [];
let lastPageProducts = [];
let favoriteIds = new Set();
const initialStoreId = new URLSearchParams(location.search).get('store');

async function render() {
  app.innerHTML = await shell('home') + `<main class="container"><section class="hero mb-8"><h1>Descubre lo Mejor del Comercio en tu Ciudad</h1><p class="text-xl muted max-w-3xl">Accede a un mercado profesional impulsado por fintech. Tiendas locales, pagos sandbox y vendedores verificados.</p><div class="flex gap-3 flex-wrap mt-7"><a class="btn btn-primary" href="#products">Explorar Ahora</a><a class="btn btn-secondary" href="vendedor.html">Vender Artículos</a></div></section><section class="card mb-8"><div class="grid md:grid-cols-[1fr_220px_170px] gap-3 mb-3"><label class="search-pill">⌕<input id="q" class="bg-white outline-none w-full" placeholder="Buscar productos o tiendas..."></label><select id="cat" class="select"><option value="">Todas las categorías</option></select><button id="search" class="btn btn-secondary">Buscar</button></div><div class="grid md:grid-cols-5 gap-3"><select id="sort" class="select"><option value="newest">Más recientes</option><option value="price_asc">Precio menor a mayor</option><option value="price_desc">Precio mayor a menor</option><option value="rating_desc">Mejor calificación</option></select><input id="minPrice" class="input" type="number" min="0" placeholder="Precio mínimo"><input id="maxPrice" class="input" type="number" min="0" placeholder="Precio máximo"><input id="sellerFilter" class="input" placeholder="Tienda o vendedor"><button id="clearFilters" class="btn btn-ghost" type="button">Limpiar filtros</button></div><p class="field-hint mt-3">Precio y orden se envían al backend cuando está soportado. El filtro por tienda también se refuerza en frontend sobre productos cargados.</p></section><h2 class="text-3xl font-bold mb-5" id="products">Recomendado para ti</h2><div id="grid" class="grid-products"></div><div class="text-center mt-8"><button id="more" class="btn btn-secondary">Cargar más</button></div></main><footer class="footer"><b class="brand"><span>Commer</span><span>City</span></b> © 2026 Marketplace</footer>`;
  bindShell();
  await loadCats();
  await loadProducts(true);
  search.onclick = () => loadProducts(true);
  [q, cat, sort, minPrice, maxPrice, sellerFilter].forEach((el) => el.addEventListener('change', () => loadProducts(true)));
  q.addEventListener('keydown', (e) => { if (e.key === 'Enter') loadProducts(true); });
  sellerFilter.addEventListener('keydown', (e) => { if (e.key === 'Enter') loadProducts(true); });
  clearFilters.onclick = () => {
    q.value = '';
    cat.value = '';
    sort.value = 'newest';
    minPrice.value = '';
    maxPrice.value = '';
    sellerFilter.value = '';
    loadProducts(true);
  };
  more.onclick = () => withButtonLoading(more, async () => { page++; await loadProducts(false); }, 'Cargando...');
}

async function loadCats() {
  try {
    categories = (await api.get('/categories', {auth: false})).categories || [];
    cat.innerHTML = '<option value="">Todas las categorías</option>' + categories.map((c) => `<option value="${Number(c.id) || ''}">${h(c.nombre)}</option>`).join('');
  } catch {}
}

function buildQuery() {
  const params = new URLSearchParams();
  params.set('page', page);
  params.set('limit', 9);
  if (q.value) params.set('q', q.value);
  if (cat.value) params.set('category_id', cat.value);
  if (initialStoreId) params.set('store_id', initialStoreId);
  if (sort.value) params.set('sort', sort.value);
  if (minPrice.value) params.set('min_price', minPrice.value);
  if (maxPrice.value) params.set('max_price', maxPrice.value);
  return params.toString();
}

async function loadProducts(reset = false) {
  try {
    if (reset) {
      page = 1;
      products = [];
      grid.innerHTML = skeletonProducts(6);
    }
    const d = await api.get(`/products?${buildQuery()}`, {auth: false});
    if (getToken()) await loadFavorites();
    lastPageProducts = d.products || [];
    products = [...products, ...lastPageProducts];
    drawProducts();
    more.classList.toggle('hidden', lastPageProducts.length === 0 || (d.pagination && page >= d.pagination.pages));
  } catch (e) {
    toast(e.message, 'error');
  }
}

function filteredProducts() {
  const seller = sellerFilter.value.trim().toLowerCase();
  let result = [...products];
  if (seller) {
    result = result.filter((p) => `${p.tienda_nombre || ''} ${p.vendedor_nombre || ''} ${p.tienda_slug || ''}`.toLowerCase().includes(seller));
  }
  const min = minPrice.value === '' ? null : Number(minPrice.value);
  const max = maxPrice.value === '' ? null : Number(maxPrice.value);
  if (min !== null) result = result.filter((p) => Number(p.precio_final || p.precio || 0) >= min);
  if (max !== null) result = result.filter((p) => Number(p.precio_final || p.precio || 0) <= max);
  if (sort.value === 'price_asc') result.sort((a, b) => Number(a.precio_final || a.precio || 0) - Number(b.precio_final || b.precio || 0));
  if (sort.value === 'price_desc') result.sort((a, b) => Number(b.precio_final || b.precio || 0) - Number(a.precio_final || a.precio || 0));
  if (sort.value === 'rating_desc') result.sort((a, b) => Number(b.calificacion_promedio || 0) - Number(a.calificacion_promedio || 0));
  return result;
}

function drawProducts() {
  const view = filteredProducts();
  grid.innerHTML = view.length ? view.map(card).join('') : emptyState('Sin productos disponibles', 'Ajusta la búsqueda, filtros de precio o tienda.');
  bindProductImageFallbacks();
  grid.querySelectorAll('.add').forEach((b) => {
    b.onclick = () => {
      const product = products.find((p) => p.id == b.dataset.id);
      if (Number(product?.stock || 0) <= 0) return toast('Producto agotado', 'error');
      addCart(product);
      toast('Producto agregado al carrito');
    };
  });
  grid.querySelectorAll('.fav-btn').forEach((b) => { b.onclick = () => toggleFavorite(b.dataset.id); });
}

async function loadFavorites() {
  try {
    const d = await api.get('/favorites');
    favoriteIds = new Set((d.favorites || []).map((f) => Number(f.producto_id)));
  } catch { favoriteIds = new Set(); }
}

async function toggleFavorite(productId) {
  if (!getToken()) {
    toast('Inicia sesión para guardar favoritos', 'warn');
    setTimeout(() => { location.href = 'login.html'; }, 900);
    return;
  }
  const id = Number(productId);
  const liked = favoriteIds.has(id);
  try {
    if (liked) { await api.delete(`/favorites/${id}`); favoriteIds.delete(id); toast('Producto quitado de favoritos'); }
    else { await api.post(`/favorites/${id}`, {}); favoriteIds.add(id); toast('Producto guardado en favoritos'); }
    drawProducts();
  } catch (e) { toast(e.message, 'error'); }
}

function card(p) {
  const img = assetUrl(p.imagenes?.[0]?.url_imagen || p.imagen_url);
  const id = Number(p.id) || '';
  const fallback = 'assets/img/logo-commercity.png';
  const out = Number(p.stock || 0) <= 0 || p.estado === 'agotado';
  return `<article class="product-card"><div class="product-media"><a href="producto.html?id=${id}"><img src="${img}" alt="${h(p.nombre)}" data-fallback-src="${fallback}"></a><button class="fav-btn ${favoriteIds.has(id) ? 'active' : ''}" type="button" data-id="${id}" aria-label="${favoriteIds.has(id) ? 'Quitar de favoritos' : 'Guardar en favoritos'}">${icon('heart', 'Favorito')}</button></div><div class="mt-4"><a class="pill orange" href="tienda.html?id=${Number(p.tienda_id) || ''}">${h(p.tienda_nombre || 'Vendedor')}</a> <span class="text-amber-500 text-sm">★ ${h(p.calificacion_promedio || 'Nuevo')}</span><h3 class="text-xl font-bold mt-2">${h(p.nombre)}</h3><p class="muted line-clamp-2">${h(p.descripcion || '')}</p><div class="flex justify-between items-center mt-3"><div class="price">${money(p.precio_final || p.precio)}</div><span class="text-sm ${out ? 'text-red-700' : 'text-green-700'}">${out ? 'Agotado' : `Stock ${Number(p.stock) || 0}`}</span></div><div class="product-card-actions"><button class="btn btn-cart add" type="button" data-id="${id}" ${out ? 'disabled' : ''} aria-label="Añadir ${h(p.nombre)} al carrito">${icon('carrito', 'Carrito')} ${out ? 'Agotado' : 'Añadir al carrito'}</button><a class="btn btn-secondary" href="producto.html?id=${id}" aria-label="Ver detalle de ${h(p.nombre)}">Ver detalle</a></div></div></article>`;
}

function bindProductImageFallbacks() {
  grid.querySelectorAll('img[data-fallback-src]').forEach((img) => {
    const fallback = img.dataset.fallbackSrc;
    img.addEventListener('error', () => {
      if (img.src.endsWith(fallback)) return;
      img.src = fallback;
      img.classList.add('product-img-fallback');
    }, {once: true});
    if (img.complete && img.naturalWidth === 0) img.dispatchEvent(new Event('error'));
  });
}

render();
