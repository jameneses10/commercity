const { pool } = require('../config/database');
function safeDetail(d){ return d?JSON.stringify(d).slice(0,2000):null; }
async function create(conn,{usuario_id=null,accion,entidad,entidad_id=null,detalle=null,ip=null}){ const db=conn||pool; await db.query('INSERT INTO logs_acciones (usuario_id,accion,entidad,entidad_id,detalle,ip) VALUES (?,?,?,?,?,?)',[usuario_id,accion,entidad,entidad_id,safeDetail(detalle),ip]); }
async function list({limit,offset}){ const [r]=await pool.query('SELECT * FROM logs_acciones ORDER BY created_at DESC LIMIT ? OFFSET ?',[limit,offset]); return r; }
module.exports={create,list};
