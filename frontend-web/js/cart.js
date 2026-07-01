import { api, token } from './api.js';
import { showMessage, money } from './ui.js';

function localCart(){
  try { return JSON.parse(localStorage.getItem('cc_cart_local') || '[]'); } catch { return []; }
}

function saveCart(list){
  localStorage.setItem('cc_cart_local', JSON.stringify(list));
}

function renderCart(){
  const list=localCart();
  const empty=document.querySelector('[data-cart-empty]');
  const listBox=document.querySelector('[data-cart-list]');
  const subtotal=list.reduce((sum,item)=>sum + Number(item.precio || 0) * Number(item.cantidad || 1),0);
  if(empty) empty.classList.toggle('hidden', list.length>0);
  if(listBox){
    listBox.innerHTML=list.map(item=>`<article class="cc-cart-line"><div><b>${item.nombre}</b><p class="cc-muted">Cantidad: ${item.cantidad}</p></div><strong>${money(Number(item.precio || 0) * Number(item.cantidad || 1))}</strong><button class="cc-btn outline" type="button" data-remove-cart="${item.id}">Quitar</button></article>`).join('');
  }
  document.querySelectorAll('[data-cart-subtotal]').forEach(el=>{ el.textContent=money(subtotal); });
  document.querySelectorAll('[data-cart-total]').forEach(el=>{ el.textContent=money(subtotal); });
}

async function validateCart(){
  const list=localCart();
  if(!list.length){ showMessage('#cartMsg','Agrega productos antes de validar el carrito.'); return; }
  if(!token()){
    showMessage('#cartMsg','Carrito local preparado. Inicia sesión para validarlo con la API real.',true);
    return;
  }
  try{
    await api.post('/cart/validate', { items: list.map(item=>({ producto_id:Number(item.id), cantidad:Number(item.cantidad || 1) })) });
    showMessage('#cartMsg','Carrito validado con la API real.',true);
  }catch(error){
    showMessage('#cartMsg',`${error.message} El carrito local se mantiene sin perder productos.`);
  }
}

export function initCart(){
  renderCart();
  document.querySelector('#validateCart')?.addEventListener('click', validateCart);
  document.addEventListener('click', event=>{
    const btn=event.target.closest('[data-remove-cart]');
    if(!btn) return;
    const list=localCart().filter(item=>String(item.id)!==String(btn.dataset.removeCart));
    saveCart(list);
    renderCart();
  });
}

initCart();
