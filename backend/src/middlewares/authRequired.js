const { verifyToken } = require('../utils/jwt');
const { errorResponse } = require('../utils/response');

function authRequired(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json(errorResponse('Token de autenticación requerido.'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verifyToken(token);
    req.user = {
      id: payload.id,
      correo: payload.correo,
      rol: payload.rol,
    };
    return next();
  } catch (error) {
    return res.status(401).json(errorResponse('Token inválido o expirado.'));
  }
}

module.exports = authRequired;
