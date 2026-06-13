const {body}=require('express-validator');
const createReviewValidator=[body('producto_id').isInt({min:1}).toInt(),body('pedido_id').isInt({min:1}).toInt(),body('estrellas').isInt({min:1,max:5}).toInt(),body('comentario').optional({nullable:true,checkFalsy:true}).trim().isLength({max:2000})];
const moderateReviewValidator=[body('estado').isIn(['aprobada','rechazada','ocultada']).withMessage('Estado de reseña inválido.')];
module.exports={createReviewValidator,moderateReviewValidator};
