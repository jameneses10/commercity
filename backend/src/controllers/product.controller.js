const { validationResult } = require('express-validator');
const service = require('../services/product.service');
const { successResponse, errorResponse } = require('../utils/response');

function validate(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) { res.status(400).json(errorResponse('Datos de entrada inválidos.', errors.array().map(e => ({ field: e.path, message: e.msg })))); return true; }
  return false;
}

async function list(req,res,next){ try { const result = await service.listPublicProducts(req.query); res.json(successResponse('Catálogo obtenido correctamente.', result)); } catch(e){ next(e); } }
async function getById(req,res,next){ try { const product = await service.getPublicProduct(req.params.id); res.json(successResponse('Producto obtenido correctamente.', { product })); } catch(e){ next(e); } }
async function create(req,res,next){ try { if (validate(req,res)) return; const product = await service.createProductForSeller(req.user.id, req.body); res.status(201).json(successResponse('Producto creado correctamente.', { product })); } catch(e){ next(e); } }
async function update(req,res,next){ try { if (validate(req,res)) return; const product = await service.updateProduct(req.user, req.params.id, req.body); res.json(successResponse('Producto actualizado correctamente.', { product })); } catch(e){ next(e); } }
async function visibility(req,res,next){ try { if (validate(req,res)) return; const product = await service.changeProductVisibility(req.user, req.params.id, req.body.estado); res.json(successResponse('Visibilidad de producto actualizada correctamente.', { product })); } catch(e){ next(e); } }
async function remove(req,res,next){ try { const product = await service.logicalDeleteProduct(req.user, req.params.id); res.json(successResponse('Producto eliminado lógicamente correctamente.', { product })); } catch(e){ next(e); } }

module.exports = { list, getById, create, update, visibility, remove };
