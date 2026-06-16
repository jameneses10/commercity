
import {api, assetUrl} from './api.js';
import {shell, bindShell, $, money, toast, h, icon, skeletonProducts, emptyState, withButtonLoading} from './ui.js';
import {addCart} from './cart-store.js';

let page = 1;
let products = [];
let categories = [];

async function render() {
  app.innerHTML = await shell('home') + `<main class="container"><section class="hero glass mb-8"><h1>Descubre lo Mejor del Comercio en tu Ciudad</h1><p class="text-xl muted max-w-3xl">Accede a un mercado profesional impulsado por fintech. Tiendas locales, pagos sandbox y vendedores verificados.</p><div class="flex gap-3 flex-wrap mt-7"><a class="btn btn-primary" href="#products">Explorar Ahora</a><a class="btn btn-secondary" href="vendedor.html">Vender Artículos</a></div></section><section class="card mb-8"><div class="grid md:grid-cols-[1fr_220px_170px] gap-3"><label class="search-pill">⌕<input id="q" class="bg-transparent outline-none w-full" placeholder="Buscar productos de alto rendimiento..."></label><select id="cat" class="select"><option value="">Todas las categorías</option></select><button id="search" class="btn btn-secondary">Buscar</button></div></section><h2 class="text-3xl font-bold mb-5" id="products">Recomendado para ti</h2><div id="grid" class="grid-products"></div><div class="text-center mt-8"><button id="more" class="btn btn-secondary">Cargar más</button></div></main><footer class="footer"><b class="brand"><span>Commer</span><span>City</span></b> © 2026 Marketplace</footer>`;
  bindShell();
  await loadCats();
  await loadProducts(true);
  search.onclick = () => loadProducts(true);
  more.onclick = () => withButtonLoading(more, async () => { page++; await loadProducts(false); }, 'Cargando...');
}

async function loadCats() {
  try {
    categories = (await api.get('/categories', {auth: false})).categories || [];
    cat.innerHTML = '<option value="">Todas las categorías</option>' + categories.map((c) => `<option value="${Number(c.id) || ''}">${h(c.nombre)}</option>`).join('');
  } catch {}
}

async function loadProducts(reset = false) {
  try {
    if (reset) {
      page = 1;
      products = [];
      grid.innerHTML = skeletonProducts(6);
    }
    const d = await api.get(`/products?page=${page}&limit=9&q=${encodeURIComponent(q.value || '')}${cat.value ? `&category_id=${cat.value}` : ''}`, {auth: false});
    products = [...products, ...(d.products || [])];
    grid.innerHTML = products.length ? products.map(card).join('') : emptyState('Sin productos disponibles', 'Ajusta la búsqueda o vuelve más tarde.');
    bindProductImageFallbacks();
    grid.querySelectorAll('.add').forEach((b) => {
      b.onclick = () => {
        addCart(products.find((p) => p.id == b.dataset.id));
        toast('Producto agregado al carrito');
      };
    });
  } catch (e) {
    toast(e.message, 'error');
  }
}

function card(p) {
  const img = assetUrl(p.imagenes?.[0]?.url_imagen || p.imagen_url);
  const id = Number(p.id) || '';
  const fallback = 'assets/img/logo-commercity.png';
  return `<article class="product-card"><a href="producto.html?id=${id}"><img src="${img}" alt="${h(p.nombre)}" data-fallback-src="${fallback}"></a><div class="mt-4"><span class="pill orange">${h(p.tienda_nombre || 'Vendedor')}</span> <span class="text-amber-500 text-sm">★ ${h(p.calificacion_promedio || 'Nuevo')}</span><h3 class="text-xl font-bold mt-2">${h(p.nombre)}</h3><p class="muted line-clamp-2">${h(p.descripcion || '')}</p><div class="flex justify-between items-center mt-3"><div class="price">${money(p.precio_final || p.precio)}</div></div><div class="product-card-actions"><button class="btn btn-cart add" type="button" data-id="${id}" aria-label="Añadir ${h(p.nombre)} al carrito">${icon('carrito', 'Carrito')} Añadir al carrito</button><a class="btn btn-secondary" href="producto.html?id=${id}" aria-label="Ver detalle de ${h(p.nombre)}">Ver detalle</a></div></div></article>`;
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
