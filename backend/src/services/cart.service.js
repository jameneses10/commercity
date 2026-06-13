const { pool } = require('../config/database');
function err(m,s){const e=new Error(m);e.statusCode=s;return e;}
async function validateCart(items){
 if(!Array.isArray(items)||!items.length) throw err('El carrito debe contener items.',400);
 const valid_items=[]; const invalid_items=[];
 for(const raw of items){
  const producto_id=Number(raw.producto_id), cantidad=Number(raw.cantidad);
  if(!producto_id||!Number.isInteger(cantidad)||cantidad<=0){ invalid_items.push({producto_id:raw.producto_id,cantidad:raw.cantidad,reason:'Cantidad o producto inválido.'}); continue; }
  const [rows]=await pool.query(`SELECT p.id producto_id,p.nombre,p.precio,p.stock,p.estado,p.tienda_id,t.estado tienda_estado,t.nombre tienda_nombre,c.estado categoria_estado FROM productos p INNER JOIN tiendas t ON t.id=p.tienda_id INNER JOIN categorias c ON c.id=p.categoria_id WHERE p.id=? LIMIT 1`,[producto_id]);
  const p=rows[0];
  if(!p){ invalid_items.push({producto_id,cantidad,reason:'Producto no existe.'}); continue; }
  if(p.estado!=='activo'){ invalid_items.push({producto_id,cantidad,reason:'Producto no está activo.',estado:p.estado}); continue; }
  if(p.tienda_estado!=='activa'){ invalid_items.push({producto_id,cantidad,reason:'La tienda no está activa.',estado_tienda:p.tienda_estado}); continue; }
  if(p.categoria_estado!=='activa'){ invalid_items.push({producto_id,cantidad,reason:'La categoría no está activa.'}); continue; }
  if(Number(p.stock)<cantidad){ invalid_items.push({producto_id,cantidad,reason:'Stock insuficiente.',stock_actual:p.stock}); continue; }
  const precio_unitario=Number(p.precio); const subtotal=precio_unitario*cantidad;
  valid_items.push({producto_id,cantidad,nombre:p.nombre,tienda_id:p.tienda_id,tienda_nombre:p.tienda_nombre,precio_unitario,stock_actual:p.stock,subtotal});
 }
 const total=valid_items.reduce((a,b)=>a+b.subtotal,0);
 return {valid_items,invalid_items,total,advertencias:invalid_items.map(i=>i.reason)};
}
module.exports={validateCart};
