import {apiRequest} from './client.js';
export const listProducts=(params={})=>apiRequest('/products?'+new URLSearchParams(Object.entries(params).filter(([,v])=>v!==''&&v!=null)).toString());
export const getProduct=(id)=>apiRequest(`/products/${id}`);
export const createProduct=(payload)=>apiRequest('/products',{method:'POST',auth:true,body:payload});
export const updateProduct=(id,payload)=>apiRequest(`/products/${id}`,{method:'PATCH',auth:true,body:payload});
export const getProductReviews=(id)=>apiRequest(`/products/${id}/reviews`);
