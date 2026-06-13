const { body, query } = require('express-validator');

const imageUrl = body('imagen_url').optional({ nullable: true, checkFalsy: true }).trim().isURL({ protocols: ['http','https'], require_protocol: true }).withMessage('imagen_url debe ser una URL válida con http o https.');

const createProductValidator = [
  body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio.').isLength({ min: 2, max: 160 }),
  body('descripcion').trim().notEmpty().withMessage('La descripción es obligatoria.').isLength({ min: 10 }).withMessage('La descripción debe tener mínimo 10 caracteres.'),
  body('precio').isFloat({ gt: 0 }).withMessage('El precio debe ser mayor que cero.').toFloat(),
  body('stock').isInt({ min: 0 }).withMessage('El stock debe ser entero mayor o igual a cero.').toInt(),
  body('categoria_id').isInt({ min: 1 }).withMessage('categoria_id es obligatorio y debe ser válido.').toInt(),
  imageUrl,
];
const updateProductValidator = [
  body('nombre').optional().trim().notEmpty().isLength({ min: 2, max: 160 }),
  body('descripcion').optional().trim().notEmpty().isLength({ min: 10 }),
  body('precio').optional().isFloat({ gt: 0 }).withMessage('El precio debe ser mayor que cero.').toFloat(),
  body('stock').optional().isInt({ min: 0 }).withMessage('El stock debe ser entero mayor o igual a cero.').toInt(),
  body('categoria_id').optional().isInt({ min: 1 }).toInt(),
  body('estado').optional().isIn(['activo', 'agotado', 'oculto', 'eliminado']).withMessage('Estado de producto inválido.'),
  imageUrl,
];
const visibilityValidator = [ body('estado').isIn(['activo', 'agotado', 'oculto', 'eliminado']).withMessage('Estado de producto inválido.') ];
const listProductsValidator = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 50 }).toInt(),
  query('category_id').optional().isInt({ min: 1 }).toInt(),
  query('store_id').optional().isInt({ min: 1 }).toInt(),
  query('min_price').optional().isFloat({ min: 0 }).toFloat(),
  query('max_price').optional().isFloat({ min: 0 }).toFloat(),
  query('sort').optional().isIn(['newest', 'price_asc', 'price_desc', 'rating_desc']),
];
module.exports = { createProductValidator, updateProductValidator, visibilityValidator, listProductsValidator };
