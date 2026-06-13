const { errorResponse } = require('../utils/response');

function notFound(req, res, next) {
  return res.status(404).json(
    errorResponse(`Ruta no encontrada: ${req.method} ${req.originalUrl}`)
  );
}

module.exports = notFound;
