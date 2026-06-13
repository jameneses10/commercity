const service=require('../services/log.service'); const {successResponse}=require('../utils/response');
async function list(req,res,next){try{res.json(successResponse('Logs obtenidos correctamente.',await service.list(req.query)))}catch(e){next(e)}}
module.exports={list};
