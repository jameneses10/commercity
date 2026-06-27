import { showMessage } from './ui.js';
export function initPayment(){ const form=document.querySelector('#checkoutForm'); if(form) form.addEventListener('submit',e=>{e.preventDefault(); showMessage('#payMsg','Pago sandbox preparado. No se creó pedido en esta maqueta inicial.',true);}); }
initPayment();
