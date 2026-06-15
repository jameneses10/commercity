const service=require('../services/adminSearch.service'); const {successResponse}=require('../utils/response');
async function search(req,res,next){try{res.json(successResponse('Búsqueda administrativa completada.',{results:await service.search(req.query.q)}))}catch(e){next(e)}}
module.exports={search};
