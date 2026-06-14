const {validationResult}=require('express-validator'); const service=require('../services/bankAccount.service'); const {successResponse,errorResponse}=require('../utils/response');
function val(req,res){const e=validationResult(req); if(!e.isEmpty()){res.status(400).json(errorResponse('Datos de entrada inválidos.',e.array().map(x=>({field:x.path,message:x.msg})))); return true} return false}
async function get(req,res,next){try{res.json(successResponse('Cuenta bancaria simulada obtenida correctamente.',await service.get(req.user.id)))}catch(e){next(e)}}
async function create(req,res,next){try{if(val(req,res))return; res.status(201).json(successResponse('Cuenta bancaria simulada creada correctamente.',await service.create(req.user.id,req.body)))}catch(e){next(e)}}
async function update(req,res,next){try{if(val(req,res))return; res.json(successResponse('Cuenta bancaria simulada actualizada correctamente.',await service.update(req.user.id,req.body)))}catch(e){next(e)}}
module.exports={get,create,update};
