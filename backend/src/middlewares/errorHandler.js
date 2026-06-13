const { errorResponse } = require('../utils/response');
const env = require('../config/env');

function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const payload = errorResponse(
    statusCode === 500 ? 'Error interno del servidor' : err.message,
    env.nodeEnv === 'development' ? [{ message: err.message, stack: err.stack }] : []
  );

  return res.status(statusCode).json(payload);
}

module.exports = errorHandler;
