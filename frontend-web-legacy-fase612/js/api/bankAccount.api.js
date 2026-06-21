import {apiRequest} from './client.js';
export const getBankAccount=()=>apiRequest('/seller/bank-account',{auth:true});
export const createBankAccount=(payload)=>apiRequest('/seller/bank-account',{method:'POST',auth:true,body:payload});
export const updateBankAccount=(payload)=>apiRequest('/seller/bank-account',{method:'PATCH',auth:true,body:payload});
