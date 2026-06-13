const {validationResult}=require('express-validator'); const service=require('../services/review.service'); const {successResponse,errorResponse}=require('../utils/response');
function v(req,res){const e=validationResult(req); if(!e.isEmpty()){res.status(400).json(errorResponse('Datos de entrada inválidos.',e.array().map(x=>({field:x.path,message:x.msg})))); return true} return false}
async function create(req,res,next){try{if(v(req,res))return; res.status(201).json(successResponse('Reseña creada correctamente.',{review:await service.createReview(req.user,req.body,req.ip)}))}catch(e){next(e)}}
async function listProduct(req,res,next){try{res.json(successResponse('Reseñas del producto obtenidas correctamente.',{reviews:await service.listProduct(req.params.id)}))}catch(e){next(e)}}
async function moderate(req,res,next){try{if(v(req,res))return; res.json(successResponse('Reseña moderada correctamente.',{review:await service.moderate(req.user,req.params.id,req.body.estado,req.ip)}))}catch(e){next(e)}}
module.exports={create,listProduct,moderate};
