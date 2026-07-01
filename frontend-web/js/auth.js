import { api, saveSession, clearSession, currentUser, updateStoredUser, token } from './api.js';
import { showMessage } from './ui.js';

function targetByRole(role){
  if(role==='administrador') return 'admin.html';
  if(role==='vendedor') return 'vendedor.html';
  return 'comprador.html';
}

function setLoading(form, loading, label='Procesando...'){
  const btn=form?.querySelector('button[type="submit"]');
  if(!btn) return;
  if(loading){ btn.dataset.originalText=btn.textContent; btn.textContent=label; btn.disabled=true; }
  else { btn.textContent=btn.dataset.originalText || btn.textContent; btn.disabled=false; }
}

export async function refreshSession(){
  if(!token()) return null;
  const data=await api.get('/auth/me');
  const user=data?.data?.user || data?.user || null;
  return updateStoredUser(user);
}

export function initLogin(){
  const form=document.querySelector('#loginForm');
  if(!form) return;
  form.addEventListener('submit', async e=>{
    e.preventDefault();
    const body=Object.fromEntries(new FormData(form));
    if(!body.correo || !body.password){ showMessage('#formMsg','Ingresa correo y contraseña.'); return; }
    setLoading(form,true,'Ingresando...');
    try{
      const data=await api.post('/auth/login', { correo: body.correo, password: body.password });
      const session=saveSession(data);
      showMessage('#formMsg','Ingreso correcto. Redirigiendo...',true);
      setTimeout(()=>{ location.href=targetByRole(session.user?.rol); },500);
    }catch(err){
      showMessage('#formMsg',err.message || 'No pudimos iniciar sesión. Revisa tus credenciales.');
    }finally{
      setLoading(form,false);
    }
  });
}

export function initRegister(){
  const form=document.querySelector('#registerForm');
  if(!form) return;
  form.addEventListener('submit', async e=>{
    e.preventDefault();
    const body=Object.fromEntries(new FormData(form));
    const accepted=form.querySelector('[name="acepta_terminos"]')?.checked;
    if(!body.nombre || !body.correo || !body.password || !body.confirmPassword || !body.rol){ showMessage('#formMsg','Completa los campos obligatorios.'); return; }
    if(!accepted){ showMessage('#formMsg','Debes aceptar los términos y la política de privacidad.'); return; }
    if(body.password!==body.confirmPassword){ showMessage('#formMsg','Las contraseñas no coinciden.'); return; }
    if(body.rol==='vendedor'){
      if(!body.fecha_nacimiento){ showMessage('#formMsg','La fecha de nacimiento es obligatoria para vendedores.'); return; }
      const years=(Date.now()-new Date(body.fecha_nacimiento).getTime())/31557600000;
      if(years<18){ showMessage('#formMsg','Para vender en CommerCity debes ser mayor de edad.'); return; }
    }
    body.acepta_terminos=true;
    body.terminos_version=body.terminos_version || 'v1.0';
    setLoading(form,true,'Creando cuenta...');
    try{
      await api.post('/auth/register', body);
      showMessage('#formMsg','Registro creado con la API real. Ahora puedes iniciar sesión.',true);
      form.reset();
    }catch(err){
      showMessage('#formMsg',err.message || 'No fue posible completar el registro.');
    }finally{
      setLoading(form,false);
    }
  });
}

export function initRecovery(){
  const form=document.querySelector('#recoveryForm');
  if(!form) return;
  form.addEventListener('submit', async e=>{
    e.preventDefault();
    const body=Object.fromEntries(new FormData(form));
    if(!body.correo){ showMessage('#formMsg','Ingresa el correo registrado para continuar.'); return; }
    try{
      await api.post('/auth/forgot-password', body);
      showMessage('#formMsg','Si el correo existe, la API generará instrucciones de recuperación.',true);
      form.reset();
    }catch(err){
      showMessage('#formMsg',err.message || 'No fue posible solicitar recuperación.');
    }
  });
}

export function logout(){
  clearSession();
  location.href='login.html';
}

export function requireSession(roles=[]){
  const user=currentUser();
  if(!token() || !user){ location.href='login.html'; return null; }
  if(roles.length && !roles.includes(user.rol)){ location.href=targetByRole(user.rol); return null; }
  return user;
}

window.CommerCityAuth={logout,currentUser,refreshSession};
