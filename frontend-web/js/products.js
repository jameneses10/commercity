import { api } from './api.js';
import { productCard, money } from './ui.js';

const fallbackProducts = [
  { id: 101, nombre: 'Morral urbano CommerCity', precio: 129900, categoria_nombre: 'Moda', tienda_nombre: 'Tienda local verificada' },
  { id: 102, nombre: 'Audífonos inalámbricos', precio: 89900, categoria_nombre: 'Tecnología', tienda_nombre: 'ElectroMarket' },
  { id: 103, nombre: 'Kit hogar organizado', precio: 159000, categoria_nombre: 'Hogar', tienda_nombre: 'Casa Viva' },
  { id: 104, nombre: 'Set deportivo esencial', precio: 112000, categoria_nombre: 'Deportes', tienda_nombre: 'Activa Store' }
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

export async function loadProducts(limit = 8) {
  const box = document.querySelector('[data-products]');
  if (!box) return;
  box.innerHTML = '<div class="cc-card cc-loading-card">Cargando productos destacados...</div>';
  try {
    const data = await api.get(`/products?page=1&limit=${limit}`);
    const list = normalizeList(data, 'products');
    box.innerHTML = list.length ? list.map(productCard).join('') : fallbackProducts.map(productFallbackCard).join('');
  } catch {
    box.innerHTML = `<div class="cc-card cc-soft-warning"><h3 class="text-xl font-bold">No pudimos cargar los productos en este momento.</h3><p>Intenta nuevamente en unos segundos. Mientras tanto puedes revisar ejemplos visuales del marketplace.</p></div>${fallbackProducts.map(productFallbackCard).join('')}`;
  }
}

export async function loadCategories() {
  const box = document.querySelector('[data-categories]');
  if (!box) return;
  box.innerHTML = '<div class="cc-card cc-loading-card">Cargando categorías...</div>';
  try {
    const data = await api.get('/categories');
    const list = normalizeList(data, 'categories');
    box.innerHTML = (list.length ? list.slice(0, 8) : fallbackCategories).map(categoryCard).join('');
  } catch {
    box.innerHTML = fallbackCategories.map(categoryCard).join('');
  }
}

export async function loadProductDetail() {
  const box = document.querySelector('[data-product-detail]');
  if (!box) return;
  const id = new URLSearchParams(location.search).get('id') || '103';
  try {
    const data = await api.get(`/products/${id}`);
    const p = data.data?.product || data.product || data.producto || data.data || data;
    box.innerHTML = `<div class="cc-grid cols-2"><section class="cc-card"><div class="cc-product-media h-96"><img src="assets/icons/cc-product-detail.svg" alt="Producto"></div></section><section class="cc-card"><span class="cc-chip orange">Detalle verificado</span><h1 class="text-4xl font-bold mt-4">${p.nombre || 'Producto CommerCity'}</h1><p class="cc-muted mt-3">${p.descripcion || 'Producto publicado por vendedor verificado.'}</p><p class="cc-price mt-5">${money(p.precio)}</p><p class="mt-2">Stock: <b>${p.stock ?? 'Disponible'}</b></p><div class="grid md:grid-cols-2 gap-3 mt-6"><button class="cc-btn"><span class="cc-btn-icon"><img class="cc-icon" src="assets/icons/cc-shopping-cart.svg" alt=""></span>Añadir al carrito</button><a class="cc-btn secondary" href="chat.html">Consultar vendedor</a></div></section></div>`;
  } catch {
    const p = fallbackProducts[0];
    box.innerHTML = `<div class="cc-grid cols-2"><section class="cc-card"><div class="cc-product-media h-96"><img src="assets/icons/cc-product-detail.svg" alt="Producto"></div></section><section class="cc-card"><span class="cc-chip orange">Vista previa</span><h1 class="text-4xl font-bold mt-4">${p.nombre}</h1><p class="cc-muted mt-3">No pudimos cargar el producto real en este momento. Esta vista mantiene la experiencia visual lista para revisión.</p><p class="cc-price mt-5">${money(p.precio)}</p><div class="cc-alert mt-4">Cuando el backend público esté disponible, este detalle cargará datos reales.</div></section></div>`;
  }
}
