const { pool } = require('../config/database');
async function createForUser(conn,userId,{tipo,titulo,mensaje,entidad_tipo=null,entidad_id=null,url_destino=null}){ const db=conn||pool; const [r]=await db.query('INSERT INTO notificaciones (usuario_id,tipo,titulo,mensaje,entidad_tipo,entidad_id,url_destino) VALUES (?,?,?,?,?,?,?)',[userId,tipo,titulo,mensaje,entidad_tipo,entidad_id,url_destino]); return r.insertId; }
async function list(userId){ const [r]=await pool.query('SELECT * FROM notificaciones WHERE usuario_id=? AND deleted_at IS NULL ORDER BY created_at DESC',[userId]); return r; }
async function unreadCount(userId){ const [[r]]=await pool.query('SELECT COUNT(*) total FROM notificaciones WHERE usuario_id=? AND leida=FALSE AND deleted_at IS NULL',[userId]); return Number(r.total||0); }
async function markRead(id,userId){ const [r]=await pool.query('UPDATE notificaciones SET leida=TRUE WHERE id=? AND usuario_id=? AND deleted_at IS NULL',[id,userId]); return r.affectedRows>0; }
async function markAllRead(userId){ const [r]=await pool.query('UPDATE notificaciones SET leida=TRUE WHERE usuario_id=? AND deleted_at IS NULL',[userId]); return r.affectedRows; }
async function remove(id,userId){ const [r]=await pool.query('UPDATE notificaciones SET deleted_at=NOW() WHERE id=? AND usuario_id=? AND deleted_at IS NULL',[id,userId]); return r.affectedRows>0; }
async function removeAll(userId){ const [r]=await pool.query('UPDATE notificaciones SET deleted_at=NOW() WHERE usuario_id=? AND deleted_at IS NULL',[userId]); return r.affectedRows; }
module.exports={createForUser,list,unreadCount,markRead,markAllRead,remove,removeAll};
