const { body, param } = require('express-validator');
const settingsValidator=[
  body('nombre').optional().trim().isLength({min:2,max:120}).withMessage('El nombre debe tener entre 2 y 120 caracteres.'),
  body('telefono').optional({nullable:true,checkFalsy:true}).trim().isLength({max:30}).withMessage('El teléfono no debe superar 30 caracteres.'),
  body('modo_oscuro').optional().isBoolean().withMessage('Modo oscuro inválido.').toBoolean(),
  body('preferencias_notificaciones').optional().isObject().withMessage('Las preferencias deben ser un objeto JSON.')
];
const changePasswordValidator=[body('currentPassword').notEmpty().withMessage('La contraseña actual es obligatoria.'), body('newPassword').isLength({min:8,max:100}).withMessage('La nueva contraseña debe tener al menos 8 caracteres.'), body('confirmPassword').notEmpty().withMessage('Debe confirmar la nueva contraseña.')];
const changeEmailValidator=[body('currentPassword').notEmpty().withMessage('La contraseña actual es obligatoria.'), body('newEmail').isEmail().withMessage('Correo inválido.').normalizeEmail()];
const deleteRequestValidator=[body('motivo').optional({nullable:true,checkFalsy:true}).trim().isLength({max:500}).withMessage('El motivo no debe superar 500 caracteres.')];
const resolveDeleteRequestValidator=[param('id').isInt({min:1}).withMessage('Usuario inválido.'), body('estado').isIn(['aprobada','rechazada']).withMessage('Estado no permitido.'), body('respuesta_admin').optional({nullable:true,checkFalsy:true}).trim().isLength({max:2000}).withMessage('Respuesta muy larga.')];
const upgradeValidator=[ body('acceptSellerTerms').custom((v,{req})=>v===true || req.body.seller_terms_accepted===true).withMessage('Debe aceptar las condiciones de vendedor.') ];
module.exports={settingsValidator,changePasswordValidator,changeEmailValidator,deleteRequestValidator,resolveDeleteRequestValidator,upgradeValidator};
