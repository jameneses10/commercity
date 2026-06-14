const { body }=require('express-validator');
const settingsValidator=[ body('nombre').optional().trim().isLength({min:2,max:120}).withMessage('El nombre debe tener entre 2 y 120 caracteres.'), body('telefono').optional({nullable:true,checkFalsy:true}).trim().isLength({max:30}).withMessage('El teléfono no debe superar 30 caracteres.') ];
const upgradeValidator=[ body('acceptSellerTerms').custom((v,{req})=>v===true || req.body.seller_terms_accepted===true).withMessage('Debe aceptar las condiciones de vendedor.') ];
module.exports={settingsValidator,upgradeValidator};
