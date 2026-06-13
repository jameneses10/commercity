const { errorResponse } = require('../utils/response');

function requireRole(...allowedRoles) {
  return function roleMiddleware(req, res, next) {
    if (!req.user) {
      return res.status(401).json(errorResponse('Usuario no autenticado.'));
    }

    if (!allowedRoles.includes(req.user.rol)) {
      return res.status(403).json(errorResponse('No tiene permisos para acceder a este recurso.'));
    }

    return next();
  };
}

module.exports = requireRole;
