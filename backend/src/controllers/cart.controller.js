const { validationResult }=require('express-validator'); const service=require('../services/cart.service'); const {successResponse,errorResponse}=require('../utils/response');
function val(req,res){const e=validationResult(req); if(!e.isEmpty()){res.status(400).json(errorResponse('Datos de entrada inválidos.',e.array().map(x=>({field:x.path,message:x.msg})))); return true} return false}
async function validate(req,res,next){try{if(val(req,res))return; const result=await service.validateCart(req.body.items); res.json(successResponse('Carrito validado correctamente.',result));}catch(e){next(e)}}
module.exports={validate};
