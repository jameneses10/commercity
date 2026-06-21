import {apiRequest} from './client.js';
export const listCategories=()=>apiRequest('/categories');
export const createCategory=(payload)=>apiRequest('/categories',{method:'POST',auth:true,body:payload});
