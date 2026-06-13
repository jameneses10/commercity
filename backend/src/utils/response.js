function successResponse(message, data = null) {
  return {
    ok: true,
    message,
    data,
  };
}

function errorResponse(message, errors = []) {
  return {
    ok: false,
    message,
    errors,
  };
}

module.exports = {
  successResponse,
  errorResponse,
};
