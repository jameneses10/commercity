const { validationResult } = require('express-validator');
const service = require('../services/return.service');
const { successResponse, errorResponse } = require('../utils/response');
const { mapFile } = require('../middlewares/upload.middleware');
function val(req, res) { const e = validationResult(req); if (!e.isEmpty()) { res.status(400).json(errorResponse('Datos de entrada inválidos.', e.array().map(x => ({ field: x.path, message: x.msg })))); return true; } return false; }
function parseBody(req) { if (typeof req.body.items === 'string') { try { req.body.items = JSON.parse(req.body.items); } catch { req.body.items = []; } } return req.body; }
function files(req) { return (req.files || []).map(f => mapFile(f, 'returns')).filter(Boolean); }
async function create(req, res, next) { try { parseBody(req); if (val(req, res)) return; res.status(201).json(successResponse('Solicitud de devolución creada correctamente.', await service.create(req.user, req.body, files(req), { ip:req.ip }))); } catch (e) { next(e); } }
async function myReturns(req, res, next) { try { res.json(successResponse('Devoluciones obtenidas correctamente.', await service.myReturns(req.user))); } catch (e) { next(e); } }
async function detail(req, res, next) { try { if (val(req, res)) return; res.json(successResponse('Devolución obtenida correctamente.', await service.detailForUser(req.user, req.params.id))); } catch (e) { next(e); } }
async function sellerList(req, res, next) { try { res.json(successResponse('Devoluciones de tienda obtenidas correctamente.', await service.sellerReturns(req.user))); } catch (e) { next(e); } }
async function sellerUpdate(req, res, next) { try { if (val(req, res)) return; res.json(successResponse('Devolución actualizada por vendedor.', await service.sellerUpdate(req.user, req.params.id, req.body, { ip:req.ip }))); } catch (e) { next(e); } }
async function adminList(req, res, next) { try { res.json(successResponse('Devoluciones administrativas obtenidas correctamente.', await service.adminReturns(req.user))); } catch (e) { next(e); } }
async function adminResolve(req, res, next) { try { if (val(req, res)) return; res.json(successResponse('Devolución resuelta por administrador.', await service.adminResolve(req.user, req.params.id, req.body, { ip:req.ip }))); } catch (e) { next(e); } }
module.exports = { create, myReturns, detail, sellerList, sellerUpdate, adminList, adminResolve };
