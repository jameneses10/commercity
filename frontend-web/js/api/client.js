export const API_BASE_URL = 'http://localhost:3000/api/v1';
export function getToken(){ return localStorage.getItem('cc_token'); }
export async function apiRequest(path,{method='GET',body,auth=false}={}){
  const headers={'Content-Type':'application/json'};
  const token=getToken(); if(auth&&token) headers.Authorization=`Bearer ${token}`;
  const res=await fetch(`${API_BASE_URL}${path}`,{method,headers,body:body?JSON.stringify(body):undefined});
  const data=await res.json().catch(()=>({ok:false,message:'Respuesta inválida del servidor'}));
  if(res.status===401){ localStorage.removeItem('cc_token'); localStorage.removeItem('cc_user'); if(!location.pathname.includes('login.html')) location.href=(location.pathname.includes('/pages/')?'':'pages/')+'login.html'; }
  if(!res.ok) throw Object.assign(new Error(data.message||'Error de API'),{status:res.status,data});
  return data;
}
