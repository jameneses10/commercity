const service=require('../services/follow.service'); const {successResponse}=require('../utils/response');
async function follow(req,res,next){try{res.status(201).json(successResponse('Usuario seguido correctamente.',await service.follow(req.user,req.params.userId,req.ip)))}catch(e){next(e)}}
async function unfollow(req,res,next){try{res.json(successResponse('Usuario dejado de seguir correctamente.',await service.unfollow(req.user,req.params.userId,req.ip)))}catch(e){next(e)}}
async function followers(req,res,next){try{res.json(successResponse('Seguidores obtenidos correctamente.',await service.followers(req.params.userId,req.query)))}catch(e){next(e)}}
async function following(req,res,next){try{res.json(successResponse('Seguidos obtenidos correctamente.',await service.following(req.params.userId,req.query)))}catch(e){next(e)}}
module.exports={follow,unfollow,followers,following};
