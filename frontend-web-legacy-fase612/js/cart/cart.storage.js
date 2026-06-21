const KEY='cc_cart';
export function getCart(){ return JSON.parse(localStorage.getItem(KEY)||'[]'); }
export function saveCart(items){ localStorage.setItem(KEY,JSON.stringify(items)); }
export function addToCart(product,cantidad=1){ const items=getCart(); const id=product.id||product.producto_id; const found=items.find(i=>i.producto_id==id); if(found) found.cantidad+=cantidad; else items.push({producto_id:id,nombre:product.nombre,precio:Number(product.precio||product.precio_unitario||0),imagen_url:product.imagen_url,tienda:product.tienda_nombre||product.tienda||'',cantidad}); saveCart(items); }
export function updateQty(id,cantidad){ const items=getCart().map(i=>i.producto_id==id?{...i,cantidad}:i).filter(i=>i.cantidad>0); saveCart(items); }
export function removeItem(id){ saveCart(getCart().filter(i=>i.producto_id!=id)); }
export function clearCart(){ saveCart([]); localStorage.removeItem('cc_cart_validated'); }
export function itemCount(){ return getCart().reduce((a,b)=>a+Number(b.cantidad),0); }
