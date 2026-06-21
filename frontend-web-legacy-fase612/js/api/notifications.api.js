import {apiRequest} from './client.js';
export const listNotifications=()=>apiRequest('/notifications',{auth:true});
export const unreadCount=()=>apiRequest('/notifications/unread-count',{auth:true});
export const markNotificationRead=(id)=>apiRequest(`/notifications/${id}/read`,{method:'PATCH',auth:true,body:{}});
export const markAllNotificationsRead=()=>apiRequest('/notifications/read-all',{method:'PATCH',auth:true,body:{}});
export const deleteNotification=(id)=>apiRequest(`/notifications/${id}`,{method:'DELETE',auth:true});
export const deleteAllNotifications=()=>apiRequest('/notifications',{method:'DELETE',auth:true});
export const adminLogs=(params={})=>apiRequest('/admin/logs?'+new URLSearchParams(params),{auth:true});
