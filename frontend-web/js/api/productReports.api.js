import {apiRequest} from './client.js';
export const reportProduct=(id,payload)=>apiRequest(`/products/${id}/report`,{method:'POST',auth:true,body:payload});
export const adminProductReports=(params={})=>apiRequest('/admin/reports/products?'+new URLSearchParams(params),{auth:true});
export const updateProductReport=(id,payload)=>apiRequest(`/admin/reports/products/${id}`,{method:'PATCH',auth:true,body:payload});
