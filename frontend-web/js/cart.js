import { showMessage } from './ui.js';
export function initCart(){ const btn=document.querySelector('#validateCart'); if(btn) btn.addEventListener('click',()=>showMessage('#cartMsg','Carrito validado visualmente. La compra se confirma en checkout.',true)); }
initCart();
