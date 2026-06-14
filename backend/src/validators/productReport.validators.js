const {body}=require('express-validator');
const createReportValidator=[body('motivo').trim().isLength({min:3,max:120}).withMessage('El motivo debe tener entre 3 y 120 caracteres.'),body('descripcion').optional({nullable:true,checkFalsy:true}).trim().isLength({max:1000}).withMessage('La descripción no debe superar 1000 caracteres.')];
const updateReportValidator=[body('estado').optional().isIn(['pendiente','revisado','rechazado','accionado']).withMessage('Estado inválido.'),body('respuesta_admin').optional({nullable:true,checkFalsy:true}).trim().isLength({max:1000}),body('ocultar_producto').optional().isBoolean().toBoolean()];
module.exports={createReportValidator,updateReportValidator};
