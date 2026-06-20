const { validationResult } = require('express-validator');
const service = require('../services/favorite.service');
const { successResponse, errorResponse } = require('../utils/response');
function val(req, res) { const e = validationResult(req); if (!e.isEmpty()) { res.status(400).json(errorResponse('Datos de entrada inválidos.', e.array().map(x => ({ field: x.path, message: x.msg })))); return true; } return false; }
async function list(req, res, next) { try { res.json(successResponse('Favoritos obtenidos correctamente.', await service.list(req.user))); } catch (e) { next(e); } }
async function add(req, res, next) { try { if (val(req, res)) return; res.status(201).json(successResponse('Producto agregado a favoritos.', await service.add(req.user, req.params.productId, { ip: req.ip }))); } catch (e) { next(e); } }
async function remove(req, res, next) { try { if (val(req, res)) return; res.json(successResponse('Producto removido de favoritos.', await service.remove(req.user, req.params.productId, { ip: req.ip }))); } catch (e) { next(e); } }
module.exports = { list, add, remove };
