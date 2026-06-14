const service=require('../services/sellerStats.service'); const {successResponse}=require('../utils/response');
async function stats(req,res,next){try{res.json(successResponse('Estadísticas de tienda obtenidas correctamente.',await service.stats(req.user.id)))}catch(e){next(e)}}
async function earnings(req,res,next){try{res.json(successResponse('Ganancias de tienda obtenidas correctamente.',await service.earnings(req.user.id,req.query)))}catch(e){next(e)}}
async function outOfStock(req,res,next){try{res.json(successResponse('Productos agotados obtenidos correctamente.',await service.outOfStock(req.user.id)))}catch(e){next(e)}}
async function soldProducts(req,res,next){try{res.json(successResponse('Productos vendidos obtenidos correctamente.',await service.soldProducts(req.user.id)))}catch(e){next(e)}}
module.exports={stats,earnings,outOfStock,soldProducts};
