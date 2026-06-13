const {validationResult}=require('express-validator'); const service=require('../services/shipment.service'); const {successResponse,errorResponse}=require('../utils/response');
function v(req,res){const e=validationResult(req); if(!e.isEmpty()){res.status(400).json(errorResponse('Datos de entrada inválidos.',e.array().map(x=>({field:x.path,message:x.msg})))); return true} return false}
async function my(req,res,next){try{res.json(successResponse('Envíos del comprador obtenidos correctamente.',{shipments:await service.listBuyer(req.user)}))}catch(e){next(e)}}
async function seller(req,res,next){try{res.json(successResponse('Envíos del vendedor obtenidos correctamente.',{shipments:await service.listSeller(req.user)}))}catch(e){next(e)}}
async function dispatch(req,res,next){try{if(v(req,res))return; res.json(successResponse('Envío preparado correctamente.',{shipment:await service.dispatch(req.params.id,req.user,req.body,req.ip)}))}catch(e){next(e)}}
async function status(req,res,next){try{if(v(req,res))return; res.json(successResponse('Estado de envío actualizado correctamente.',{shipment:await service.updateStatus(req.params.id,req.user,req.body.estado,req.ip)}))}catch(e){next(e)}}
module.exports={my,seller,dispatch,status};
