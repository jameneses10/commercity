const {validationResult}=require('express-validator'); const service=require('../services/productReport.service'); const {successResponse,errorResponse}=require('../utils/response');
function val(req,res){const e=validationResult(req); if(!e.isEmpty()){res.status(400).json(errorResponse('Datos de entrada inválidos.',e.array().map(x=>({field:x.path,message:x.msg})))); return true} return false}
async function report(req,res,next){try{if(val(req,res))return; const r=await service.report(req.user,{producto_id:req.params.id,...req.body}); res.status(201).json(successResponse('Reporte de producto creado correctamente.',{report:r}))}catch(e){next(e)}}
async function listAdmin(req,res,next){try{res.json(successResponse('Reportes de productos obtenidos correctamente.',await service.listAdmin(req.query)))}catch(e){next(e)}}
async function updateAdmin(req,res,next){try{if(val(req,res))return; const r=await service.updateAdmin(req.user,req.params.id,req.body); res.json(successResponse('Reporte de producto actualizado correctamente.',{report:r}))}catch(e){next(e)}}
module.exports={report,listAdmin,updateAdmin};
