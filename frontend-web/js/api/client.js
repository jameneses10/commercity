import { API_BASE_URL } from '../../assets/js/config.js';

export { API_BASE_URL };

export function getToken(){ return localStorage.getItem('cc_token') || localStorage.getItem('cc_modern_token'); }
export async function apiRequest(path,{method='GET',body,auth=false}={}){
  const headers={'Content-Type':'application/json'};
  const token=getToken(); if(auth&&token) headers.Authorization=`Bearer ${token}`;
  const res=await fetch(`${API_BASE_URL}${path}`,{method,headers,body:body?JSON.stringify(body):undefined});
  const data=await res.json().catch(()=>({ok:false,message:'Respuesta inválida del servidor'}));
  if(res.status===401){ localStorage.removeItem('cc_token'); localStorage.removeItem('cc_user'); localStorage.removeItem('cc_modern_token'); localStorage.removeItem('cc_modern_user'); if(!location.pathname.includes('login.html')) location.href=(location.pathname.includes('/pages/')?'':'pages/')+'login.html'; }
  if(!res.ok) throw Object.assign(new Error(data.message||'Error de API'),{status:res.status,data});
  return data;
}
