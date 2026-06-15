import {apiRequest} from './client.js';
export const adminSearch=(q)=>apiRequest('/admin/search?'+new URLSearchParams({q}),{auth:true});
