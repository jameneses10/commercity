
const TK='cc_modern_token', USER='cc_modern_user';
export const getToken=()=>localStorage.getItem(TK); export const setToken=t=>localStorage.setItem(TK,t); export const clearSession=()=>{localStorage.removeItem(TK);localStorage.removeItem(USER)}; export const saveUser=u=>localStorage.setItem(USER,JSON.stringify(u||{})); export const currentUser=()=>JSON.parse(localStorage.getItem(USER)||'null');
export async function hydrateUser(api){ const d=await api.get('/auth/me'); const u=d.user; saveUser(u); return u; }
export async function requireAuth(api,roles=[]){ if(!getToken()) location.href='login.html'; const u=await hydrateUser(api); if(roles.length && !roles.includes(u.rol)){ alert('Acceso no permitido'); location.href='index.html'; } return u; }
export function logout(){ clearSession(); location.href='login.html'; }
export function redirectByRole(u){ if(u.rol==='administrador') location.href='admin.html'; else if(u.rol==='vendedor') location.href='vendedor.html'; else location.href='index.html'; }
