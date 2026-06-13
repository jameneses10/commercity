const { pool } = require('../config/database');

async function findCategoryById(id) {
  const [rows] = await pool.query('SELECT * FROM categorias WHERE id = ? LIMIT 1', [id]);
  return rows[0] || null;
}

async function findActiveCategoryById(id) {
  const [rows] = await pool.query('SELECT * FROM categorias WHERE id = ? AND estado = \'activa\' LIMIT 1', [id]);
  return rows[0] || null;
}

async function findCategoryBySlug(slug) {
  const [rows] = await pool.query('SELECT * FROM categorias WHERE slug = ? LIMIT 1', [slug]);
  return rows[0] || null;
}

async function findCategoryByName(nombre) {
  const [rows] = await pool.query('SELECT * FROM categorias WHERE nombre = ? LIMIT 1', [nombre]);
  return rows[0] || null;
}

async function listActiveCategories() {
  const [rows] = await pool.query(
    'SELECT id, nombre, slug, descripcion, estado, created_at, updated_at FROM categorias WHERE estado = \'activa\' ORDER BY nombre ASC'
  );
  return rows;
}

async function createCategory(data) {
  const [result] = await pool.query(
    'INSERT INTO categorias (nombre, slug, descripcion, estado) VALUES (?, ?, ?, ?)',
    [data.nombre, data.slug, data.descripcion || null, data.estado || 'activa']
  );
  return findCategoryById(result.insertId);
}

async function updateCategoryById(id, data) {
  const fields = [];
  const values = [];
  for (const key of ['nombre', 'slug', 'descripcion', 'estado']) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      fields.push(`${key} = ?`);
      values.push(data[key]);
    }
  }
  if (!fields.length) return findCategoryById(id);
  values.push(id);
  await pool.query(`UPDATE categorias SET ${fields.join(', ')} WHERE id = ?`, values);
  return findCategoryById(id);
}

async function countActiveProducts(categoryId) {
  const [[row]] = await pool.query(
    'SELECT COUNT(*) AS total FROM productos WHERE categoria_id = ? AND estado = \'activo\'',
    [categoryId]
  );
  return row.total;
}

module.exports = {
  findCategoryById,
  findActiveCategoryById,
  findCategoryBySlug,
  findCategoryByName,
  listActiveCategories,
  createCategory,
  updateCategoryById,
  countActiveProducts,
};
