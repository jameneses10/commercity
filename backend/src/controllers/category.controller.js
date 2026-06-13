const { validationResult } = require('express-validator');
const service = require('../services/category.service');
const { successResponse, errorResponse } = require('../utils/response');

function validate(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) { res.status(400).json(errorResponse('Datos de entrada inválidos.', errors.array().map(e => ({ field: e.path, message: e.msg })))); return true; }
  return false;
}

async function list(req,res,next){ try { const categories = await service.listCategories(); res.json(successResponse('Categorías obtenidas correctamente.', { categories })); } catch(e){ next(e); } }
async function create(req,res,next){ try { if (validate(req,res)) return; const category = await service.createCategory(req.body); res.status(201).json(successResponse('Categoría creada correctamente.', { category })); } catch(e){ next(e); } }
async function update(req,res,next){ try { if (validate(req,res)) return; const category = await service.updateCategory(req.params.id, req.body); res.json(successResponse('Categoría actualizada correctamente.', { category })); } catch(e){ next(e); } }
async function remove(req,res,next){ try { const category = await service.deleteCategory(req.params.id); res.json(successResponse('Categoría inactivada correctamente.', { category })); } catch(e){ next(e); } }

module.exports = { list, create, update, remove };
