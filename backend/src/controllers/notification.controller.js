const service=require('../services/notification.service'); const {successResponse}=require('../utils/response');
async function list(req,res,next){try{res.json(successResponse('Notificaciones obtenidas correctamente.',{notifications:await service.list(req.user)}))}catch(e){next(e)}}
async function unreadCount(req,res,next){try{res.json(successResponse('Contador de notificaciones obtenido correctamente.',await service.unreadCount(req.user)))}catch(e){next(e)}}
async function read(req,res,next){try{await service.markRead(req.user,req.params.id); res.json(successResponse('Notificación marcada como leída.',{}))}catch(e){next(e)}}
async function readAll(req,res,next){try{res.json(successResponse('Notificaciones marcadas como leídas.',await service.markAllRead(req.user)))}catch(e){next(e)}}
async function remove(req,res,next){try{await service.remove(req.user,req.params.id); res.json(successResponse('Notificación eliminada correctamente.',{}))}catch(e){next(e)}}
async function removeAll(req,res,next){try{res.json(successResponse('Notificaciones eliminadas correctamente.',await service.removeAll(req.user)))}catch(e){next(e)}}
module.exports={list,unreadCount,read,readAll,remove,removeAll};
