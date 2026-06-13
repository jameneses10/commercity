const {body}=require('express-validator');
const dispatchValidator=[body('transportadora').trim().notEmpty().isLength({max:120}),body('numero_guia').trim().notEmpty().isLength({max:120})];
const statusValidator=[body('estado').isIn(['preparado','en_camino','entregado','cancelado']).withMessage('Estado de envío inválido.')];
module.exports={dispatchValidator,statusValidator};
