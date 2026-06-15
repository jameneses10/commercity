const { pool } = require('../config/database');
async function ensureProfile(usuario_id, conn=pool){
  await conn.query('INSERT IGNORE INTO perfiles_usuarios (usuario_id) VALUES (?)',[usuario_id]);
  return findByUserId(usuario_id, conn);
}
async function findByUserId(usuario_id, conn=pool){
  const [rows]=await conn.query('SELECT id, usuario_id, foto_url, foto_perfil_url, COALESCE(foto_perfil_url,foto_url) AS foto_publica_url, descripcion, descripcion_personal, COALESCE(descripcion_personal,descripcion) AS descripcion_publica, ciudad, departamento, sitio_web, created_at, updated_at FROM perfiles_usuarios WHERE usuario_id=? LIMIT 1',[usuario_id]);
  return rows[0] || null;
}
async function updateByUserId(usuario_id, data){
  await ensureProfile(usuario_id);
  const allowed=['foto_url','foto_perfil_url','descripcion','descripcion_personal','ciudad','departamento','sitio_web'];
  const sets=[]; const vals=[];
  for(const k of allowed){ if(Object.prototype.hasOwnProperty.call(data,k)){ sets.push(`${k}=?`); vals.push(data[k] || null); } }
  if(sets.length){ vals.push(usuario_id); await pool.query(`UPDATE perfiles_usuarios SET ${sets.join(', ')} WHERE usuario_id=?`, vals); }
  return findByUserId(usuario_id);
}
async function publicProfile(userId, viewerId=null){
 const [[user]]=await pool.query(`SELECT u.id,u.nombre,u.estado,r.nombre rol FROM usuarios u INNER JOIN roles r ON r.id=u.rol_id WHERE u.id=? AND u.estado='activo' LIMIT 1`,[userId]);
 if(!user) return null;
 const profile=await ensureProfile(userId);
 const [[seg]]=await pool.query('SELECT COUNT(*) total FROM seguimientos WHERE seguido_id=?',[userId]);
 const [[sig]]=await pool.query('SELECT COUNT(*) total FROM seguimientos WHERE seguidor_id=?',[userId]);
 let is_following=false; if(viewerId){ const [[f]]=await pool.query('SELECT id FROM seguimientos WHERE seguidor_id=? AND seguido_id=? LIMIT 1',[viewerId,userId]); is_following=Boolean(f); }
 let store=null, products=[];
 if(user.rol==='vendedor'){
  const [stores]=await pool.query(`SELECT id,nombre,slug,descripcion,reputacion_promedio,nivel_reputacion,estado FROM tiendas WHERE usuario_id=? LIMIT 1`,[userId]);
  store=stores[0] || null;
  if(store){ const [items]=await pool.query(`SELECT id,nombre,precio,precio_anterior,descuento_porcentaje,ROUND(precio*(1-(descuento_porcentaje/100)),2) precio_final,imagen_url,stock,estado,calificacion_promedio,total_resenas FROM productos WHERE tienda_id=? AND estado IN ('activo','agotado') ORDER BY created_at DESC LIMIT 12`,[store.id]); products=items; }
 }
 return { id:user.id, nombre:user.nombre, rol:user.rol, foto_url:profile.foto_publica_url, foto_perfil_url:profile.foto_publica_url, descripcion:profile.descripcion_publica, descripcion_personal:profile.descripcion_publica, ciudad:profile.ciudad, departamento:profile.departamento, sitio_web:profile.sitio_web, total_seguidores:Number(seg.total||0), total_siguiendo:Number(sig.total||0), is_following, tienda:store, productos_publicados:products };
}
module.exports={ensureProfile,findByUserId,updateByUserId,publicProfile};
