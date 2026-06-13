async function create(conn,{pedido_id,metodo,referencia,estado,mensaje}){ const [r]=await conn.query('INSERT INTO pagos (pedido_id,metodo,referencia,estado,mensaje) VALUES (?,?,?,?,?)',[pedido_id,metodo,referencia,estado,mensaje]); return r.insertId; }
async function listByOrder(conn,pedidoId){ const [r]=await conn.query('SELECT * FROM pagos WHERE pedido_id=? ORDER BY created_at DESC',[pedidoId]); return r; }
module.exports={create,listByOrder};
