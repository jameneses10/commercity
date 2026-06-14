const { pool } = require('../config/database');
async function ensureProfile(usuario_id, conn=pool){
  await conn.query('INSERT IGNORE INTO perfiles_usuarios (usuario_id) VALUES (?)',[usuario_id]);
  return findByUserId(usuario_id, conn);
}
async function findByUserId(usuario_id, conn=pool){
  const [rows]=await conn.query('SELECT id, usuario_id, foto_url, descripcion, ciudad, departamento, sitio_web, created_at, updated_at FROM perfiles_usuarios WHERE usuario_id=? LIMIT 1',[usuario_id]);
  return rows[0] || null;
}
async function updateByUserId(usuario_id, data){
  await ensureProfile(usuario_id);
  const allowed=['foto_url','descripcion','ciudad','departamento','sitio_web'];
  const sets=[]; const vals=[];
  for(const k of allowed){ if(Object.prototype.hasOwnProperty.call(data,k)){ sets.push(`${k}=?`); vals.push(data[k] || null); } }
  if(sets.length){ vals.push(usuario_id); await pool.query(`UPDATE perfiles_usuarios SET ${sets.join(', ')} WHERE usuario_id=?`, vals); }
  return findByUserId(usuario_id);
}
async function publicProfile(userId){
 const [[user]]=await pool.query(`SELECT u.id,u.nombre,u.estado,r.nombre rol FROM usuarios u INNER JOIN roles r ON r.id=u.rol_id WHERE u.id=? AND u.estado='activo' LIMIT 1`,[userId]);
 if(!user) return null;
 const profile=await ensureProfile(userId);
 let store=null, products=[];
 if(user.rol==='vendedor'){
  const [stores]=await pool.query(`SELECT id,nombre,slug,descripcion,reputacion_promedio,nivel_reputacion,total_resenas,estado FROM tiendas WHERE usuario_id=? LIMIT 1`,[userId]);
  store=stores[0] || null;
  if(store){ const [items]=await pool.query(`SELECT id,nombre,precio,imagen_url,stock,estado,calificacion_promedio,total_resenas FROM productos WHERE tienda_id=? AND estado IN ('activo','agotado') ORDER BY created_at DESC LIMIT 12`,[store.id]); products=items; }
 }
 return { id:user.id, nombre:user.nombre, rol:user.rol, foto_url:profile.foto_url, descripcion:profile.descripcion, ciudad:profile.ciudad, departamento:profile.departamento, sitio_web:profile.sitio_web, tienda:store, productos_publicados:products };
}
module.exports={ensureProfile,findByUserId,updateByUserId,publicProfile};
