const { pool } = require('../config/database');
async function createMissingForPaidOrder(conn,pedidoId){
 const [orders]=await conn.query('SELECT id,direccion_id,estado_pago FROM pedidos WHERE id=? FOR UPDATE',[pedidoId]); const o=orders[0]; if(!o||o.estado_pago!=='pagado') return 0;
 const [stores]=await conn.query('SELECT DISTINCT tienda_id FROM pedido_detalles WHERE pedido_id=?',[pedidoId]); let created=0;
 for(const s of stores){ const [r]=await conn.query('INSERT IGNORE INTO envios (pedido_id,tienda_id,direccion_id,estado) VALUES (?,?,?,\'pendiente\')',[pedidoId,s.tienda_id,o.direccion_id]); created+=r.affectedRows; }
 return created;
}
async function listBuyer(userId){ const [r]=await pool.query(`SELECT e.*, t.nombre tienda_nombre FROM envios e INNER JOIN pedidos p ON p.id=e.pedido_id INNER JOIN tiendas t ON t.id=e.tienda_id WHERE p.comprador_id=? ORDER BY e.created_at DESC`,[userId]); return r; }
async function listSeller(userId){ const [r]=await pool.query(`SELECT e.*, p.comprador_id FROM envios e INNER JOIN tiendas t ON t.id=e.tienda_id INNER JOIN pedidos p ON p.id=e.pedido_id WHERE t.usuario_id=? ORDER BY e.created_at DESC`,[userId]); return r; }
async function findById(id){ const [r]=await pool.query(`SELECT e.*, t.usuario_id vendedor_id, p.comprador_id FROM envios e INNER JOIN tiendas t ON t.id=e.tienda_id INNER JOIN pedidos p ON p.id=e.pedido_id WHERE e.id=? LIMIT 1`,[id]); return r[0]||null; }
async function updateDispatch(id,{transportadora,numero_guia}){ await pool.query("UPDATE envios SET transportadora=?, numero_guia=?, estado='preparado' WHERE id=?",[transportadora,numero_guia,id]); return findById(id); }
async function updateStatus(id,estado){ const sets=['estado=?']; const vals=[estado]; if(estado==='en_camino') sets.push('fecha_envio=COALESCE(fecha_envio,NOW())'); if(estado==='entregado') sets.push('fecha_entrega=COALESCE(fecha_entrega,NOW())'); vals.push(id); await pool.query(`UPDATE envios SET ${sets.join(', ')} WHERE id=?`,vals); return findById(id); }
async function isDeliveredForProductOrder(productId,pedidoId){ const [[r]]=await pool.query(`SELECT COUNT(*) total FROM envios e INNER JOIN productos p ON p.tienda_id=e.tienda_id WHERE e.pedido_id=? AND p.id=? AND e.estado='entregado'`,[pedidoId,productId]); return r.total>0; }
module.exports={pool,createMissingForPaidOrder,listBuyer,listSeller,findById,updateDispatch,updateStatus,isDeliveredForProductOrder};
