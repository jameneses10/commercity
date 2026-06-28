import { showMessage } from './ui.js';
export function initCart(){
  const btn=document.querySelector('#validateCart');
  if(btn) btn.addEventListener('click',()=>showMessage('#cartMsg','Carrito validado visualmente. Cuando el endpoint de carrito esté disponible, aquí se mostrarán productos reales.',true));
}
initCart();
