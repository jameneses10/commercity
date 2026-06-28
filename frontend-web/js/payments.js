const button=document.querySelector('[data-payment-prepare]');
const message=document.querySelector('[data-payment-message]');
button?.addEventListener('click',()=>{
  message?.classList.remove('cc-hidden');
  if(message) message.textContent='Pago seguro preparado en modo sandbox. Revisa la confirmación antes de continuar.';
});
