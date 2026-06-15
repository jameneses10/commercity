import {apiRequest} from './client.js';
export const reportUser=(id,payload)=>apiRequest(`/users/${id}/report`,{method:'POST',auth:true,body:payload});
export const adminUserReports=(params={})=>apiRequest('/admin/reports/users?'+new URLSearchParams(params),{auth:true});
export const updateUserReport=(id,payload)=>apiRequest(`/admin/reports/users/${id}`,{method:'PATCH',auth:true,body:payload});
