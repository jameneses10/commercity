const { body } = require('express-validator');
const categoryValidator = [
  body('nombre').optional().trim().notEmpty().withMessage('El nombre no puede estar vacío.').isLength({ min: 2, max: 120 }).withMessage('El nombre debe tener entre 2 y 120 caracteres.'),
  body('descripcion').optional({ nullable: true, checkFalsy: true }).trim().isLength({ max: 2000 }).withMessage('La descripción no debe superar 2000 caracteres.'),
  body('estado').optional().isIn(['activa', 'inactiva']).withMessage('Estado de categoría inválido.'),
];
const createCategoryValidator = [
  body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio.').isLength({ min: 2, max: 120 }).withMessage('El nombre debe tener entre 2 y 120 caracteres.'),
  body('descripcion').optional({ nullable: true, checkFalsy: true }).trim().isLength({ max: 2000 }),
  body('estado').optional().isIn(['activa', 'inactiva']).withMessage('Estado de categoría inválido.'),
];
module.exports = { createCategoryValidator, updateCategoryValidator: categoryValidator };
