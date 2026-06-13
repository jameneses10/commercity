const service=require('../services/notification.service'); const {successResponse}=require('../utils/response');
async function list(req,res,next){try{res.json(successResponse('Notificaciones obtenidas correctamente.',{notifications:await service.list(req.user)}))}catch(e){next(e)}}
async function read(req,res,next){try{await service.markRead(req.user,req.params.id); res.json(successResponse('Notificación marcada como leída.',{}))}catch(e){next(e)}}
module.exports={list,read};
