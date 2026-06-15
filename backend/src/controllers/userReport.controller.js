const {validationResult}=require('express-validator'); const service=require('../services/userReport.service'); const {successResponse,errorResponse}=require('../utils/response');
function val(req,res){const e=validationResult(req); if(!e.isEmpty()){res.status(400).json(errorResponse('Datos de entrada inválidos.',e.array().map(x=>({field:x.path,message:x.msg})))); return true;} return false;}
async function report(req,res,next){try{if(val(req,res))return; res.status(201).json(successResponse('Usuario reportado correctamente.',{report:await service.report(req.user,req.params.id,req.body,req.ip)}))}catch(e){next(e)}}
async function list(req,res,next){try{res.json(successResponse('Reportes de usuarios obtenidos correctamente.',await service.list(req.query)))}catch(e){next(e)}}
async function update(req,res,next){try{if(val(req,res))return; res.json(successResponse('Reporte de usuario actualizado correctamente.',{report:await service.update(req.user,req.params.id,req.body,req.ip)}))}catch(e){next(e)}}
module.exports={report,list,update};
