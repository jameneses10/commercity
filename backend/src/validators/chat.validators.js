const {body}=require('express-validator');
const createConversationValidator=[body('comprador_id').optional({nullable:true}).isInt({min:1}).toInt(),body('vendedor_id').optional({nullable:true}).isInt({min:1}).toInt(),body('tienda_id').optional({nullable:true}).isInt({min:1}).toInt(),body('producto_id').optional({nullable:true}).isInt({min:1}).toInt()];
const messageValidator=[body('mensaje').optional({nullable:true,checkFalsy:true}).trim().isLength({max:1000}),body('contenido').optional({nullable:true,checkFalsy:true}).trim().isLength({max:1000})];
module.exports={createConversationValidator,messageValidator};
