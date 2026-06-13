const { pool } = require('../config/database');

async function findRoleByName(nombre) {
  const [rows] = await pool.query(
    'SELECT id, nombre, descripcion, created_at FROM roles WHERE nombre = ? LIMIT 1',
    [nombre]
  );
  return rows[0] || null;
}

module.exports = {
  findRoleByName,
};
