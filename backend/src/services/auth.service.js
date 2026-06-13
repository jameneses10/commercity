const { findRoleByName } = require('../models/role.model');
const { createUser, findUserByEmail, findUserById, sanitizeUser } = require('../models/user.model');
const { hashPassword, comparePassword } = require('../utils/password');
const { signToken } = require('../utils/jwt');

const PUBLIC_REGISTER_ROLES = ['comprador', 'vendedor'];

async function registerUser({ nombre, correo, password, confirmPassword, rol, telefono = null }) {
  const normalizedEmail = correo.toLowerCase().trim();
  const normalizedRole = rol.toLowerCase().trim();

  if (!PUBLIC_REGISTER_ROLES.includes(normalizedRole)) {
    const error = new Error('El rol solicitado no está permitido para registro público.');
    error.statusCode = 403;
    throw error;
  }

  if (password !== confirmPassword) {
    const error = new Error('La contraseña y su confirmación no coinciden.');
    error.statusCode = 400;
    throw error;
  }

  const existingUser = await findUserByEmail(normalizedEmail);
  if (existingUser) {
    const error = new Error('El correo electrónico ya está registrado.');
    error.statusCode = 409;
    throw error;
  }

  const role = await findRoleByName(normalizedRole);
  if (!role) {
    const error = new Error('Rol no configurado en base de datos.');
    error.statusCode = 500;
    throw error;
  }

  const passwordHash = await hashPassword(password);
  const user = await createUser({
    rolId: role.id,
    nombre: nombre.trim(),
    correo: normalizedEmail,
    passwordHash,
    telefono,
  });

  return sanitizeUser(user);
}

async function loginUser({ correo, password }) {
  const normalizedEmail = correo.toLowerCase().trim();
  const user = await findUserByEmail(normalizedEmail);
  const invalidCredentialsError = new Error('Credenciales inválidas.');
  invalidCredentialsError.statusCode = 401;

  if (!user) {
    throw invalidCredentialsError;
  }

  if (user.estado !== 'activo') {
    const error = new Error('Usuario no activo.');
    error.statusCode = 403;
    throw error;
  }

  const passwordIsValid = await comparePassword(password, user.password_hash);
  if (!passwordIsValid) {
    throw invalidCredentialsError;
  }

  const safeUser = sanitizeUser(user);
  const token = signToken(safeUser);

  return {
    token,
    user: safeUser,
  };
}

async function getAuthenticatedUser(userId) {
  const user = await findUserById(userId);
  if (!user) {
    const error = new Error('Usuario autenticado no encontrado.');
    error.statusCode = 401;
    throw error;
  }

  return sanitizeUser(user);
}

module.exports = {
  registerUser,
  loginUser,
  getAuthenticatedUser,
};
