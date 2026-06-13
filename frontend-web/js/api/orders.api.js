import {apiRequest} from './client.js';
export const createOrder=(payload)=>apiRequest('/orders',{method:'POST',auth:true,body:payload});
export const myOrders=()=>apiRequest('/orders/my-orders',{auth:true});
export const getOrder=(id)=>apiRequest(`/orders/${id}`,{auth:true});
export const sellerOrders=()=>apiRequest('/seller/orders',{auth:true});
export const adminOrders=()=>apiRequest('/admin/orders',{auth:true});
