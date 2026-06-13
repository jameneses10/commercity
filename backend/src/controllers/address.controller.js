const { validationResult }=require('express-validator'); const service=require('../services/address.service'); const {successResponse,errorResponse}=require('../utils/response');
function val(req,res){const e=validationResult(req); if(!e.isEmpty()){res.status(400).json(errorResponse('Datos de entrada inválidos.',e.array().map(x=>({field:x.path,message:x.msg})))); return true} return false}
async function list(req,res,next){try{res.json(successResponse('Direcciones obtenidas correctamente.',{addresses:await service.list(req.user)}))}catch(e){next(e)}}
async function create(req,res,next){try{if(val(req,res))return; res.status(201).json(successResponse('Dirección creada correctamente.',{address:await service.create(req.user,req.body)}))}catch(e){next(e)}}
async function update(req,res,next){try{if(val(req,res))return; res.json(successResponse('Dirección actualizada correctamente.',{address:await service.update(req.params.id,req.user,req.body)}))}catch(e){next(e)}}
async function remove(req,res,next){try{await service.remove(req.params.id,req.user); res.json(successResponse('Dirección eliminada correctamente.',{}))}catch(e){next(e)}}
module.exports={list,create,update,remove};
