const productModel = require('../models/product.model');
const storeModel = require('../models/store.model');
const categoryModel = require('../models/category.model');
const { createSlug } = require('../utils/slug');

function httpError(message, statusCode) { const e = new Error(message); e.statusCode = statusCode; return e; }

async function getSellerActiveStore(userId) {
  const store = await storeModel.findStoreBySellerId(userId);
  if (!store) throw httpError('El vendedor no tiene tienda registrada.', 404);
  if (store.estado !== 'activa') throw httpError('La tienda debe estar activa para gestionar productos.', 409);
  return store;
}

async function ensureActiveCategory(categoryId) {
  const category = await categoryModel.findActiveCategoryById(categoryId);
  if (!category) throw httpError('La categoría no existe o no está activa.', 404);
  return category;
}

async function ensureUniqueProductSlug(tiendaId, slug, ignoreId = null) {
  const product = await productModel.findProductByStoreSlug(tiendaId, slug);
  if (product && product.id !== ignoreId) throw httpError('Ya existe un producto con ese nombre en la tienda.', 409);
}

function normalizeProductState(stock, currentState = 'activo') {
  const numericStock = Number(stock);
  if (numericStock === 0 && currentState === 'activo') return 'agotado';
  if (numericStock > 0 && currentState === 'agotado') return 'activo';
  return currentState;
}

async function listPublicProducts(query) {
  const page = Math.max(parseInt(query.page || '1', 10), 1);
  const limit = Math.min(Math.max(parseInt(query.limit || '12', 10), 1), 50);
  const offset = (page - 1) * limit;
  const filters = {
    q: query.q || null,
    category_id: query.category_id ? Number(query.category_id) : null,
    store_id: query.store_id ? Number(query.store_id) : null,
    min_price: query.min_price !== undefined ? Number(query.min_price) : undefined,
    max_price: query.max_price !== undefined ? Number(query.max_price) : undefined,
    sort: query.sort || 'newest',
    limit,
    offset,
  };
  const { rows, total } = await productModel.listPublicProducts(filters);
  return { products: rows, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
}

async function getPublicProduct(id) {
  const product = await productModel.findProductDetailById(id);
  if (!product) throw httpError('Producto no encontrado o no disponible.', 404);
  return product;
}

async function createProductForSeller(userId, payload) {
  const store = await getSellerActiveStore(userId);
  await ensureActiveCategory(payload.categoria_id);
  const slug = createSlug(payload.nombre);
  await ensureUniqueProductSlug(store.id, slug);
  const stock = Number(payload.stock);
  const estado = stock === 0 ? 'agotado' : 'activo';
  return productModel.createProduct({
    tienda_id: store.id,
    categoria_id: payload.categoria_id,
    nombre: payload.nombre.trim(),
    slug,
    descripcion: payload.descripcion.trim(),
    precio: payload.precio,
    stock,
    estado,
    imagen_url: payload.imagen_url || null,
  });
}

async function assertProductPermission(product, user) {
  if (!product) throw httpError('Producto no encontrado.', 404);
  if (user.rol === 'administrador') return;
  if (user.rol !== 'vendedor') throw httpError('No tiene permisos para modificar este producto.', 403);
  const store = await storeModel.findStoreBySellerId(user.id);
  if (!store || store.id !== product.tienda_id) throw httpError('No tiene permisos para modificar productos de otra tienda.', 403);
}

async function updateProduct(user, productId, payload) {
  const product = await productModel.findProductById(productId);
  await assertProductPermission(product, user);
  const data = {};
  if (payload.categoria_id !== undefined) { await ensureActiveCategory(payload.categoria_id); data.categoria_id = payload.categoria_id; }
  if (payload.nombre !== undefined) { data.nombre = payload.nombre.trim(); data.slug = createSlug(payload.nombre); await ensureUniqueProductSlug(product.tienda_id, data.slug, product.id); }
  if (payload.descripcion !== undefined) data.descripcion = payload.descripcion.trim();
  if (payload.precio !== undefined) data.precio = payload.precio;
  if (payload.stock !== undefined) data.stock = Number(payload.stock);
  if (payload.imagen_url !== undefined) data.imagen_url = payload.imagen_url || null;
  if (payload.estado !== undefined) data.estado = payload.estado;
  const finalStock = data.stock !== undefined ? data.stock : product.stock;
  const finalState = data.estado !== undefined ? data.estado : product.estado;
  data.estado = normalizeProductState(finalStock, finalState);
  return productModel.updateProductById(product.id, data);
}

async function changeProductVisibility(user, productId, estado) {
  if (!['activo', 'oculto', 'agotado', 'eliminado'].includes(estado)) throw httpError('Estado de producto inválido.', 400);
  const product = await productModel.findProductById(productId);
  await assertProductPermission(product, user);
  if (estado === 'activo' && Number(product.stock) === 0) throw httpError('No se puede activar un producto sin stock.', 409);
  return productModel.updateProductById(product.id, { estado });
}

async function logicalDeleteProduct(user, productId) {
  const product = await productModel.findProductById(productId);
  await assertProductPermission(product, user);
  return productModel.updateProductById(product.id, { estado: 'eliminado' });
}

module.exports = { listPublicProducts, getPublicProduct, createProductForSeller, updateProduct, changeProductVisibility, logicalDeleteProduct };
