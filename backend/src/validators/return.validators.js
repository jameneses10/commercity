const { body, param } = require('express-validator');
const idParam = [param('id').isInt({ min: 1 }).withMessage('Identificador inválido.')];
const createValidator = [
  body('pedido_id').isInt({ min: 1 }).withMessage('Pedido inválido.'),
  body('motivo').trim().isLength({ min: 3, max: 160 }).withMessage('El motivo debe tener entre 3 y 160 caracteres.'),
  body('descripcion').optional({ nullable:true, checkFalsy:true }).trim().isLength({ max: 2000 }).withMessage('La descripción no debe superar 2000 caracteres.'),
  body('items').isArray({ min: 1 }).withMessage('Debe enviar al menos un item.'),
  body('items.*.pedido_detalle_id').isInt({ min: 1 }).withMessage('Detalle de pedido inválido.'),
  body('items.*.cantidad').optional().isInt({ min: 1 }).withMessage('Cantidad inválida.'),
];
const sellerStatusValidator = [...idParam, body('estado').isIn(['en_revision','aprobada','rechazada']).withMessage('Estado no permitido.'), body('respuesta_vendedor').optional({ nullable:true, checkFalsy:true }).trim().isLength({ max: 2000 }).withMessage('Respuesta muy larga.')];
const adminResolveValidator = [...idParam, body('estado').isIn(['en_revision','aprobada','rechazada','reembolso_simulado','cerrada']).withMessage('Estado no permitido.'), body('respuesta_admin').optional({ nullable:true, checkFalsy:true }).trim().isLength({ max: 2000 }).withMessage('Respuesta muy larga.')];
module.exports = { idParam, createValidator, sellerStatusValidator, adminResolveValidator };
