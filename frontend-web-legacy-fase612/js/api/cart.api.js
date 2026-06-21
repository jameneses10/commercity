import {apiRequest} from './client.js';
export const validateCart=(items)=>apiRequest('/cart/validate',{method:'POST',auth:true,body:{items}});
