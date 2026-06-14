const {validationResult}=require('express-validator'); const service=require('../services/profile.service'); const {successResponse,errorResponse}=require('../utils/response');
function val(req,res){const e=validationResult(req); if(!e.isEmpty()){res.status(400).json(errorResponse('Datos de entrada inválidos.',e.array().map(x=>({field:x.path,message:x.msg})))); return true} return false}
async function me(req,res,next){try{res.json(successResponse('Perfil propio obtenido correctamente.',{profile:await service.me(req.user.id)}))}catch(e){next(e)}}
async function updateMe(req,res,next){try{if(val(req,res))return; res.json(successResponse('Perfil actualizado correctamente.',{profile:await service.updateMe(req.user.id,req.body)}))}catch(e){next(e)}}
async function publicProfile(req,res,next){try{res.json(successResponse('Perfil público obtenido correctamente.',{profile:await service.publicProfile(req.params.userId)}))}catch(e){next(e)}}
module.exports={me,updateMe,publicProfile};
