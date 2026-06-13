import {apiRequest} from './client.js';
export const myShipments=()=>apiRequest('/shipments/my-shipments',{auth:true});
export const sellerShipments=()=>apiRequest('/seller/shipments',{auth:true});
export const dispatchShipment=(id,payload)=>apiRequest(`/shipments/${id}/dispatch`,{method:'PATCH',auth:true,body:payload});
export const updateShipmentStatus=(id,estado)=>apiRequest(`/shipments/${id}/status`,{method:'PATCH',auth:true,body:{estado}});
