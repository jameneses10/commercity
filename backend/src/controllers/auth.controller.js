const { validationResult } = require('express-validator');
const { registerUser, loginUser, getAuthenticatedUser } = require('../services/auth.service');
const { successResponse, errorResponse } = require('../utils/response');

function handleValidation(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(
      errorResponse('Datos de entrada inválidos.', errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
      })))
    );
  }
  return null;
}

async function register(req, res, next) {
  try {
    const validationResponse = handleValidation(req, res);
    if (validationResponse) return validationResponse;

    const user = await registerUser(req.body);
    return res.status(201).json(successResponse('Usuario registrado correctamente.', { user }));
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const validationResponse = handleValidation(req, res);
    if (validationResponse) return validationResponse;

    const result = await loginUser(req.body);
    return res.status(200).json(successResponse('Inicio de sesión correcto.', result));
  } catch (error) {
    next(error);
  }
}

async function me(req, res, next) {
  try {
    const user = await getAuthenticatedUser(req.user.id);
    return res.status(200).json(successResponse('Perfil autenticado obtenido correctamente.', { user }));
  } catch (error) {
    next(error);
  }
}

async function adminTest(req, res) {
  return res.status(200).json(
    successResponse('Ruta temporal de administrador funcionando correctamente.', {
      user: req.user,
      temporary: true,
    })
  );
}

module.exports = {
  register,
  login,
  me,
  adminTest,
};
