const {validationResult}=require('express-validator'); const service=require('../services/account.service'); const {successResponse,errorResponse}=require('../utils/response');
function val(req,res){const e=validationResult(req); if(!e.isEmpty()){res.status(400).json(errorResponse('Datos de entrada inválidos.',e.array().map(x=>({field:x.path,message:x.msg})))); return true} return false}
async function getSettings(req,res,next){try{res.json(successResponse('Ajustes obtenidos correctamente.',await service.settings(req.user.id)))}catch(e){next(e)}}
async function updateSettings(req,res,next){try{if(val(req,res))return; res.json(successResponse('Ajustes actualizados correctamente.',await service.updateSettings(req.user.id,req.body)))}catch(e){next(e)}}
async function deactivate(req,res,next){try{res.json(successResponse('Cuenta inactivada correctamente.',await service.deactivateAccount(req.user.id)))}catch(e){next(e)}}
async function upgrade(req,res,next){try{if(val(req,res))return; res.json(successResponse('Usuario convertido a vendedor correctamente.',await service.upgrade(req.user.id,req.body)))}catch(e){next(e)}}
module.exports={getSettings,updateSettings,deactivate,upgrade};
