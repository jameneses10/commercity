const { pool } = require('../src/config/database');
const shipmentModel = require('../src/models/shipment.model');

async function main() {
  const conn = await pool.getConnection();
  let checked = 0;
  let created = 0;
  try {
    await conn.beginTransaction();
    const [orders] = await conn.query(`
      SELECT p.id
      FROM pedidos p
      WHERE p.estado_pago = 'pagado'
        AND EXISTS (SELECT 1 FROM pedido_detalles d WHERE d.pedido_id = p.id)
    `);
    for (const order of orders) {
      checked += 1;
      created += await shipmentModel.createMissingForPaidOrder(conn, order.id);
    }
    await conn.commit();
    console.log(JSON.stringify({ ok: true, checked_orders: checked, created_shipments: created }));
  } catch (error) {
    await conn.rollback();
    console.error(JSON.stringify({ ok: false, message: error.message }));
    process.exitCode = 1;
  } finally {
    conn.release();
    await pool.end();
  }
}

main();
