const categoryModel = require('../models/category.model');
const { createSlug } = require('../utils/slug');

function httpError(message, statusCode) { const e = new Error(message); e.statusCode = statusCode; return e; }

async function ensureUniqueCategory({ nombre, slug, ignoreId = null }) {
  const byName = await categoryModel.findCategoryByName(nombre);
  if (byName && byName.id !== ignoreId) throw httpError('Ya existe una categoría con ese nombre.', 409);
  const bySlug = await categoryModel.findCategoryBySlug(slug);
  if (bySlug && bySlug.id !== ignoreId) throw httpError('Ya existe una categoría con ese slug.', 409);
}

async function listCategories() { return categoryModel.listActiveCategories(); }

async function createCategory(payload) {
  const nombre = payload.nombre.trim();
  const slug = createSlug(nombre);
  await ensureUniqueCategory({ nombre, slug });
  return categoryModel.createCategory({ nombre, slug, descripcion: payload.descripcion || null, estado: payload.estado || 'activa' });
}

async function updateCategory(id, payload) {
  const category = await categoryModel.findCategoryById(id);
  if (!category) throw httpError('Categoría no encontrada.', 404);
  const data = {};
  if (payload.nombre !== undefined) {
    data.nombre = payload.nombre.trim();
    data.slug = createSlug(payload.nombre);
    await ensureUniqueCategory({ nombre: data.nombre, slug: data.slug, ignoreId: category.id });
  }
  if (payload.descripcion !== undefined) data.descripcion = payload.descripcion || null;
  if (payload.estado !== undefined) data.estado = payload.estado;
  return categoryModel.updateCategoryById(category.id, data);
}

async function deleteCategory(id) {
  const category = await categoryModel.findCategoryById(id);
  if (!category) throw httpError('Categoría no encontrada.', 404);
  const activeProducts = await categoryModel.countActiveProducts(id);
  if (activeProducts > 0) throw httpError('No se puede eliminar/inactivar una categoría con productos activos.', 409);
  return categoryModel.updateCategoryById(category.id, { estado: 'inactiva' });
}

module.exports = { listCategories, createCategory, updateCategory, deleteCategory };
