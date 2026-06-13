const { pool } = require('../config/database');
async function createForUser(conn,userId,{tipo,titulo,mensaje}){ const db=conn||pool; const [r]=await db.query('INSERT INTO notificaciones (usuario_id,tipo,titulo,mensaje) VALUES (?,?,?,?)',[userId,tipo,titulo,mensaje]); return r.insertId; }
async function list(userId){ const [r]=await pool.query('SELECT * FROM notificaciones WHERE usuario_id=? ORDER BY created_at DESC',[userId]); return r; }
async function markRead(id,userId){ const [r]=await pool.query('UPDATE notificaciones SET leida=TRUE WHERE id=? AND usuario_id=?',[id,userId]); return r.affectedRows>0; }
module.exports={createForUser,list,markRead};
