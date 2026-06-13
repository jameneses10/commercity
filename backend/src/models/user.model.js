const { pool } = require('../config/database');

function sanitizeUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    nombre: user.nombre,
    correo: user.correo,
    telefono: user.telefono,
    estado: user.estado,
    rol: user.rol,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
}

async function findUserByEmail(correo) {
  const [rows] = await pool.query(
    `SELECT u.id, u.rol_id, u.nombre, u.correo, u.password_hash, u.telefono,
            u.estado, u.created_at, u.updated_at, r.nombre AS rol
     FROM usuarios u
     INNER JOIN roles r ON r.id = u.rol_id
     WHERE u.correo = ?
     LIMIT 1`,
    [correo]
  );
  return rows[0] || null;
}

async function findUserById(id) {
  const [rows] = await pool.query(
    `SELECT u.id, u.rol_id, u.nombre, u.correo, u.telefono,
            u.estado, u.created_at, u.updated_at, r.nombre AS rol
     FROM usuarios u
     INNER JOIN roles r ON r.id = u.rol_id
     WHERE u.id = ?
     LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

async function createUser({ rolId, nombre, correo, passwordHash, telefono = null }) {
  const [result] = await pool.query(
    `INSERT INTO usuarios (rol_id, nombre, correo, password_hash, telefono, estado)
     VALUES (?, ?, ?, ?, ?, 'activo')`,
    [rolId, nombre, correo, passwordHash, telefono]
  );

  return findUserById(result.insertId);
}

module.exports = {
  sanitizeUser,
  findUserByEmail,
  findUserById,
  createUser,
};
