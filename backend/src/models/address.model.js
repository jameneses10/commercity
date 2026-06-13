const { pool } = require('../config/database');
async function listByUser(userId){ const [r]=await pool.query('SELECT * FROM direcciones WHERE usuario_id=? ORDER BY es_principal DESC, created_at DESC',[userId]); return r; }
async function findById(id){ const [r]=await pool.query('SELECT * FROM direcciones WHERE id=? LIMIT 1',[id]); return r[0]||null; }
async function create(userId,d){ const [r]=await pool.query('INSERT INTO direcciones (usuario_id,departamento,ciudad,direccion,codigo_postal,telefono,es_principal) VALUES (?,?,?,?,?,?,?)',[userId,d.departamento,d.ciudad,d.direccion,d.codigo_postal||null,d.telefono,Boolean(d.es_principal)]); return findById(r.insertId); }
async function update(id,d){ const fields=[]; const vals=[]; for(const k of ['departamento','ciudad','direccion','codigo_postal','telefono','es_principal']) if(Object.prototype.hasOwnProperty.call(d,k)){ fields.push(`${k}=?`); vals.push(k==='es_principal'?Boolean(d[k]):(d[k]||null)); } if(!fields.length) return findById(id); vals.push(id); await pool.query(`UPDATE direcciones SET ${fields.join(', ')} WHERE id=?`, vals); return findById(id); }
async function countOrders(id){ const [[r]]=await pool.query('SELECT COUNT(*) total FROM pedidos WHERE direccion_id=?',[id]); return r.total; }
async function remove(id){ await pool.query('DELETE FROM direcciones WHERE id=?',[id]); }
module.exports={listByUser,findById,create,update,countOrders,remove};
