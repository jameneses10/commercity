import { api, token } from './api.js';
import { showMessage, money } from './ui.js';

let apiCart = null;
function localCart(){ try { return JSON.parse(localStorage.getItem('cc_cart_local') || '[]'); } catch { return []; } }
function saveCart(list){ localStorage.setItem('cc_cart_local', JSON.stringify(list)); }
function localSubtotal(list){ return list.reduce((sum,item)=>sum + Number(item.precio || 0) * Number(item.cantidad || 1),0); }
function renderItems(items, fromApi=false){
  const listBox=document.querySelector('[data-cart-list]');
  const empty=document.querySelector('[data-cart-empty]');
  const subtotal=fromApi ? Number(apiCart?.total||0) : localSubtotal(items);
  if(empty) empty.classList.toggle('hidden', items.length>0);
  if(listBox){
    listBox.innerHTML=items.map(item=>{
      const id=fromApi ? item.id : item.id;
      const price=Number(item.precio || item.precio_unitario || 0);
      const qty=Number(item.cantidad || 1);
      return `<article class="cc-cart-line"><div><b>${item.nombre}</b><p class="cc-muted">${fromApi?'Carrito sincronizado con tu cuenta':'Carrito local sin sesión'} · Stock: ${item.stock ?? 'N/D'}</p><div class="cc-mini-actions"><button type="button" data-cart-dec="${id}">−</button><span>${qty}</span><button type="button" data-cart-inc="${id}">+</button></div></div><strong>${money(Number(item.subtotal || price*qty))}</strong><button class="cc-btn outline" type="button" data-remove-cart="${id}">Quitar</button></article>`;
    }).join('');
  }
  document.querySelectorAll('[data-cart-subtotal]').forEach(el=>{ el.textContent=money(subtotal); });
  document.querySelectorAll('[data-cart-total]').forEach(el=>{ el.textContent=money(subtotal); });
}
async function loadApiCart(){
  apiCart=(await api.get('/cart')).data;
  renderItems(apiCart.items||[], true);
  showMessage('#cartMsg','Carrito sincronizado con tu cuenta.',true);
}
function renderLocal(){ renderItems(localCart(), false); }
async function renderCart(){ if(token()) { try { await loadApiCart(); return; } catch(error) { showMessage('#cartMsg',`${error.message} Se mantiene carrito local sin sesión.`); } } renderLocal(); }
async function validateCart(){
  const items=token() && apiCart ? (apiCart.items||[]).map(i=>({producto_id:i.producto_id,cantidad:i.cantidad})) : localCart().map(i=>({producto_id:Number(i.id),cantidad:Number(i.cantidad||1)}));
  if(!items.length){ showMessage('#cartMsg','Agrega productos antes de validar el carrito.'); return; }
  try{ await api.post('/cart/validate',{items}); showMessage('#cartMsg','Carrito validado con la API real.',true); }
  catch(error){ showMessage('#cartMsg',`${error.message} El carrito se mantiene sin perder productos.`); }
}
async function removeItem(id){ if(token()){ await api.delete(`/cart/items/${id}`); await loadApiCart(); return; } const list=localCart().filter(item=>String(item.id)!==String(id)); saveCart(list); renderLocal(); }
async function changeQty(id, delta){
  if(token()){
    const item=(apiCart?.items||[]).find(i=>String(i.id)===String(id)); if(!item) return;
    const cantidad=Math.max(1, Number(item.cantidad||1)+delta);
    await api.patch(`/cart/items/${id}`,{cantidad}); await loadApiCart(); return;
  }
  const list=localCart(); const item=list.find(i=>String(i.id)===String(id)); if(!item) return; item.cantidad=Math.max(1,Number(item.cantidad||1)+delta); saveCart(list); renderLocal();
}
async function clearCart(){ if(token()){ await api.delete('/cart'); await loadApiCart(); return; } saveCart([]); renderLocal(); }
export function initCart(){
  renderCart();
  document.querySelector('#validateCart')?.addEventListener('click', validateCart);
  document.addEventListener('click', async event=>{
    const remove=event.target.closest('[data-remove-cart]');
    const inc=event.target.closest('[data-cart-inc]');
    const dec=event.target.closest('[data-cart-dec]');
    const clear=event.target.closest('[data-clear-cart]');
    try{
      if(remove) await removeItem(remove.dataset.removeCart);
      if(inc) await changeQty(inc.dataset.cartInc, 1);
      if(dec) await changeQty(dec.dataset.cartDec, -1);
      if(clear) await clearCart();
    }catch(error){ showMessage('#cartMsg',error.message); }
  });
}
initCart();
