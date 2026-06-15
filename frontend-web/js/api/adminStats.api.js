import {apiRequest} from './client.js';
export const dashboardStats=()=>apiRequest('/admin/dashboard-stats',{auth:true});
export const listAdminUsers=()=>apiRequest('/admin/users',{auth:true});
export const updateUserStatus=(id,estado)=>apiRequest(`/admin/users/${id}/status`,{method:'PATCH',auth:true,body:{estado}});
