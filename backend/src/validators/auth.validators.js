const { body } = require('express-validator');

const allowedPublicRoles = ['comprador', 'vendedor'];

const registerValidator = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio.')
    .isLength({ min: 2, max: 120 }).withMessage('El nombre debe tener entre 2 y 120 caracteres.'),
  body('correo')
    .trim()
    .notEmpty().withMessage('El correo es obligatorio.')
    .isEmail().withMessage('El correo debe tener un formato válido.')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria.')
    .isLength({ min: 8 }).withMessage('La contraseña debe tener mínimo 8 caracteres.'),
  body('confirmPassword')
    .notEmpty().withMessage('La confirmación de contraseña es obligatoria.')
    .custom((value, { req }) => value === req.body.password).withMessage('La contraseña y su confirmación no coinciden.'),
  body('rol')
    .trim()
    .notEmpty().withMessage('El rol es obligatorio.')
    .customSanitizer((value) => String(value).toLowerCase())
    .isIn(allowedPublicRoles).withMessage('Solo se permite registro público como comprador o vendedor.'),
  body('telefono')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ max: 30 }).withMessage('El teléfono no debe superar 30 caracteres.'),
];

const loginValidator = [
  body('correo')
    .trim()
    .notEmpty().withMessage('El correo es obligatorio.')
    .isEmail().withMessage('El correo debe tener un formato válido.')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria.'),
];

module.exports = {
  registerValidator,
  loginValidator,
};
