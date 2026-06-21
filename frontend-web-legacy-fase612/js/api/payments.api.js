import {apiRequest} from './client.js';
export const sandboxPayment=(payload)=>apiRequest('/payments/sandbox',{method:'POST',auth:true,body:payload});
