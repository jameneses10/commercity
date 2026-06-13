import {apiRequest} from './client.js';
export const listNotifications=()=>apiRequest('/notifications',{auth:true});
export const markNotificationRead=(id)=>apiRequest(`/notifications/${id}/read`,{method:'PATCH',auth:true,body:{}});
export const adminLogs=(params={})=>apiRequest('/admin/logs?'+new URLSearchParams(params),{auth:true});
