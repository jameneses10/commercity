const {body}=require('express-validator');
const createUserReportValidator=[body('motivo').trim().notEmpty().isLength({min:3,max:120}),body('descripcion').optional({nullable:true,checkFalsy:true}).trim().isLength({max:1000})];
const updateUserReportValidator=[body('estado').optional().isIn(['pendiente','revisado','rechazado','accionado']),body('respuesta_admin').optional({nullable:true,checkFalsy:true}).trim().isLength({max:1000}),body('inactivar_usuario').optional().isBoolean().toBoolean()];
module.exports={createUserReportValidator,updateUserReportValidator};
