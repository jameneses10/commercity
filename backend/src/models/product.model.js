const { pool } = require('../config/database');

const PRICE_EXPR = `ROUND(CASE WHEN p.descuento_porcentaje > 0 THEN p.precio * (1 - p.descuento_porcentaje / 100) ELSE p.precio END, 2)`;
const PRODUCT_FIELDS = `p.id, p.tienda_id, p.categoria_id, p.nombre, p.slug, p.descripcion, p.precio, p.precio_anterior, p.descuento_porcentaje, ${PRICE_EXPR} AS precio_final, p.fecha_publicacion, p.fecha_caducidad, p.reportado, p.total_reportes, p.stock, p.estado, p.imagen_url, p.calificacion_promedio, p.total_resenas, p.created_at, p.updated_at`;

async function findProductById(id) {
  const [rows] = await pool.query(`SELECT *, ROUND(CASE WHEN descuento_porcentaje > 0 THEN precio * (1 - descuento_porcentaje / 100) ELSE precio END, 2) AS precio_final FROM productos WHERE id = ? LIMIT 1`, [id]);
  return rows[0] || null;
}
async function findProductDetailById(id) {
  const [rows] = await pool.query(
    `SELECT ${PRODUCT_FIELDS}, t.nombre AS tienda_nombre, t.slug AS tienda_slug, c.nombre AS categoria_nombre, c.slug AS categoria_slug
     FROM productos p INNER JOIN tiendas t ON t.id = p.tienda_id INNER JOIN categorias c ON c.id = p.categoria_id
     WHERE p.id = ? AND p.estado IN ('activo','agotado') AND t.estado = 'activa' AND c.estado = 'activa' AND (p.fecha_caducidad IS NULL OR p.fecha_caducidad >= NOW()) LIMIT 1`, [id]);
  return rows[0] || null;
}
async function findProductByStoreSlug(tiendaId, slug) { const [rows] = await pool.query('SELECT * FROM productos WHERE tienda_id = ? AND slug = ? LIMIT 1', [tiendaId, slug]); return rows[0] || null; }
async function createProduct(data) {
  const [result] = await pool.query(
    `INSERT INTO productos (tienda_id, categoria_id, nombre, slug, descripcion, precio, precio_anterior, descuento_porcentaje, fecha_publicacion, fecha_caducidad, stock, estado, imagen_url)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, COALESCE(?, NOW()), ?, ?, ?, ?)`,
    [data.tienda_id, data.categoria_id, data.nombre, data.slug, data.descripcion, data.precio, data.precio_anterior || null, data.descuento_porcentaje || 0, data.fecha_publicacion || null, data.fecha_caducidad || null, data.stock, data.estado, data.imagen_url || null]
  );
  return findProductById(result.insertId);
}
async function updateProductById(id, data) {
  const fields = []; const values = [];
  for (const key of ['categoria_id', 'nombre', 'slug', 'descripcion', 'precio', 'precio_anterior', 'descuento_porcentaje', 'fecha_publicacion', 'fecha_caducidad', 'stock', 'estado', 'imagen_url', 'reportado', 'total_reportes']) {
    if (Object.prototype.hasOwnProperty.call(data, key)) { fields.push(`${key} = ?`); values.push(data[key]); }
  }
  if (!fields.length) return findProductById(id);
  values.push(id); await pool.query(`UPDATE productos SET ${fields.join(', ')} WHERE id = ?`, values); return findProductById(id);
}
function buildCatalogWhere(filters) {
  const where = ["p.estado IN ('activo','agotado')", "t.estado = 'activa'", "c.estado = 'activa'", '(p.fecha_caducidad IS NULL OR p.fecha_caducidad >= NOW())'];
  const values = [];
  if (filters.q) { where.push('(p.nombre LIKE ? OR p.descripcion LIKE ? OR t.nombre LIKE ?)'); values.push(`%${filters.q}%`, `%${filters.q}%`, `%${filters.q}%`); }
  if (filters.category_id) { where.push('p.categoria_id = ?'); values.push(filters.category_id); }
  if (filters.store_id) { where.push('p.tienda_id = ?'); values.push(filters.store_id); }
  if (filters.min_price !== undefined) { where.push(`${PRICE_EXPR} >= ?`); values.push(filters.min_price); }
  if (filters.max_price !== undefined) { where.push(`${PRICE_EXPR} <= ?`); values.push(filters.max_price); }
  return { where: where.join(' AND '), values };
}
function sortClause(sort) { switch (sort) { case 'price_asc': return 'precio_final ASC'; case 'price_desc': return 'precio_final DESC'; case 'rating_desc': return 'p.calificacion_promedio DESC'; case 'newest': default: return 'COALESCE(p.fecha_publicacion,p.created_at) DESC'; } }
async function listPublicProducts(filters) {
  const { where, values } = buildCatalogWhere(filters); const orderBy = sortClause(filters.sort);
  const [rows] = await pool.query(`SELECT ${PRODUCT_FIELDS}, t.nombre AS tienda_nombre, t.slug AS tienda_slug, c.nombre AS categoria_nombre, c.slug AS categoria_slug FROM productos p INNER JOIN tiendas t ON t.id = p.tienda_id INNER JOIN categorias c ON c.id = p.categoria_id WHERE ${where} ORDER BY ${orderBy} LIMIT ? OFFSET ?`, [...values, filters.limit, filters.offset]);
  const [[count]] = await pool.query(`SELECT COUNT(*) AS total FROM productos p INNER JOIN tiendas t ON t.id = p.tienda_id INNER JOIN categorias c ON c.id = p.categoria_id WHERE ${where}`, values);
  return { rows, total: count.total };
}
async function incrementReport(id){ await pool.query('UPDATE productos SET total_reportes=total_reportes+1, reportado=TRUE WHERE id=?',[id]); return findProductById(id); }
module.exports = { findProductById, findProductDetailById, findProductByStoreSlug, createProduct, updateProductById, listPublicProducts, incrementReport };
