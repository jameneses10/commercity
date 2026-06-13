import {apiRequest} from './client.js';
export const getStore=(id)=>apiRequest(`/stores/${id}`);
export const getMyStore=()=>apiRequest('/stores/me',{auth:true});
export const createStore=(payload)=>apiRequest('/stores',{method:'POST',auth:true,body:payload});
export const updateStore=(payload)=>apiRequest('/stores/me',{method:'PATCH',auth:true,body:payload});
export const storeProducts=(id,params={})=>apiRequest(`/stores/${id}/products?`+new URLSearchParams(params));
export const storeReputation=(id)=>apiRequest(`/stores/${id}/reputation`);
