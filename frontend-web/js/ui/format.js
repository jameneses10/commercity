export const money=(value)=>new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',maximumFractionDigits:0}).format(Number(value||0));
export const date=(value)=>value?new Date(value).toLocaleString('es-CO'):'-';
export const badge=(text)=>`<span class="badge ${['pagado','activo','activa','entregado','aprobada'].includes(text)?'badge-ok':['rechazado','cancelado','ocultada','eliminado'].includes(text)?'badge-bad':'badge-warn'}">${text||'pendiente'}</span>`;
