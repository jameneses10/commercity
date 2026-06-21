export function saveSession(data){ localStorage.setItem('cc_token',data.token); localStorage.setItem('cc_user',JSON.stringify(data.user)); }
export function getUser(){ try{return JSON.parse(localStorage.getItem('cc_user')||'null')}catch{return null} }
export function getToken(){ return localStorage.getItem('cc_token'); }
export function isLoggedIn(){ return Boolean(getToken()&&getUser()); }
export function clearSession(){ localStorage.removeItem('cc_token'); localStorage.removeItem('cc_user'); localStorage.removeItem('cc_cart_validated'); }
export function logout(){ clearSession(); location.href=location.pathname.includes('/pages/')?'login.html':'pages/login.html'; }
export function dashboardFor(role){ return role==='vendedor'?'seller-dashboard.html':role==='administrador'?'admin-dashboard.html':'buyer-dashboard.html'; }
