const { body } = require('express-validator');

const urlValidation = (field) => body(field).optional({ nullable: true, checkFalsy: true }).trim().isURL({ protocols: ['http','https'], require_protocol: true }).withMessage(`${field} debe ser una URL válida con http o https.`);

const createStoreValidator = [
  body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio.').isLength({ min: 2, max: 120 }).withMessage('El nombre debe tener entre 2 y 120 caracteres.'),
  body('descripcion').optional({ nullable: true, checkFalsy: true }).trim().isLength({ max: 2000 }).withMessage('La descripción no debe superar 2000 caracteres.'),
  urlValidation('logo_url'),
  urlValidation('banner_url'),
];
const updateStoreValidator = [
  body('nombre').optional().trim().notEmpty().withMessage('El nombre no puede estar vacío.').isLength({ min: 2, max: 120 }),
  body('descripcion').optional({ nullable: true, checkFalsy: true }).trim().isLength({ max: 2000 }),
  urlValidation('logo_url'),
  urlValidation('banner_url'),
];
module.exports = { createStoreValidator, updateStoreValidator };
