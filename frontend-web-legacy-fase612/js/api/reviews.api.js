import {apiRequest} from './client.js';
export const createReview=(payload)=>apiRequest('/reviews',{method:'POST',auth:true,body:payload});
export const moderateReview=(id,estado)=>apiRequest(`/admin/reviews/${id}/moderate`,{method:'PATCH',auth:true,body:{estado}});
