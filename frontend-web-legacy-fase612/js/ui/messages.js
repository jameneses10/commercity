export function showMessage(el,msg,type='ok'){ el.innerHTML=`<div class="p-3 rounded-xl ${type==='error'?'bg-red-50 text-red-700 border border-red-200':'bg-green-50 text-green-700 border border-green-200'}">${msg}</div>`; }
export function errorText(e){ return e?.data?.message || e.message || 'Error inesperado'; }
