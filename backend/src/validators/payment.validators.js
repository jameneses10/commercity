const {body}=require('express-validator');
const sandboxPaymentValidator=[body('pedido_id').isInt({min:1}).toInt(),body('card_number').isString().matches(/^\d{13,19}$/).withMessage('card_number de prueba inválido.'),body('card_holder').trim().notEmpty().isLength({max:120}),body('exp_month').isInt({min:1,max:12}).toInt(),body('exp_year').isInt({min:2024,max:2100}).toInt(),body('cvv').isString().matches(/^\d{3,4}$/).withMessage('cvv inválido.')];
const webhookValidator=[body('pedido_id').isInt({min:1}).toInt(),body('approved').isBoolean().toBoolean()];
module.exports={sandboxPaymentValidator,webhookValidator};
