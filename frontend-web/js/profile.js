import { api, currentUser, token, updateStoredUser } from './api.js';
import { showMessage } from './ui.js';

function renderProfile(user){
  if(!user) return;
  document.querySelectorAll('[data-profile-name]').forEach(el=>{ el.textContent=user.nombre || 'Usuario CommerCity'; });
  document.querySelectorAll('[data-profile-email]').forEach(el=>{ el.textContent=user.correo || 'correo no disponible'; });
  document.querySelectorAll('[data-profile-role]').forEach(el=>{ el.textContent=user.rol || 'comprador'; });
  document.querySelectorAll('[data-profile-status]').forEach(el=>{ el.textContent=user.estado || 'activo'; });
  const form=document.querySelector('[data-profile-form]');
  if(form){
    form.querySelector('[name="nombre"]')?.setAttribute('value', user.nombre || '');
    form.querySelector('[name="correo"]')?.setAttribute('value', user.correo || '');
    form.querySelector('[name="telefono"]')?.setAttribute('value', user.telefono || '');
  }
}

export async function initProfile(){
  const box=document.querySelector('[data-profile-root]');
  if(!box) return;
  if(!token()){
    showMessage('#profileMsg','Inicia sesión para ver tu perfil real.');
    renderProfile(currentUser());
    return;
  }
  try{
    const data=await api.get('/auth/me');
    const user=data?.data?.user || data?.user;
    updateStoredUser(user);
    renderProfile(user);
    showMessage('#profileMsg','Perfil real cargado desde la API.',true);
  }catch(error){
    renderProfile(currentUser());
    showMessage('#profileMsg',error.message || 'No pudimos cargar el perfil real.');
  }
}

initProfile();
