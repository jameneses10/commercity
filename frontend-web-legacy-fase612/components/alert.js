export const alertBox=(msg,type='info')=>`<div class="p-3 rounded-xl ${type==='error'?'bg-red-50 text-red-700':'bg-blue-50 text-blue-700'}">${msg}</div>`;
