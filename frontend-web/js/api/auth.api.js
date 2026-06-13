import {apiRequest} from './client.js';
export const login=(correo,password)=>apiRequest('/auth/login',{method:'POST',body:{correo,password}});
export const register=(payload)=>apiRequest('/auth/register',{method:'POST',body:payload});
export const me=()=>apiRequest('/auth/me',{auth:true});
