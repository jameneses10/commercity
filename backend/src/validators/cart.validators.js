const {body}=require('express-validator');
const cartValidator=[body('items').isArray({min:1}).withMessage('items debe ser un arreglo con al menos un producto.'),body('items.*.producto_id').isInt({min:1}).withMessage('producto_id inválido.').toInt(),body('items.*.cantidad').isInt({min:1}).withMessage('cantidad debe ser mayor que cero.').toInt()];
module.exports={cartValidator};
