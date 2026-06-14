import {apiRequest} from './client.js';
export const getMyProfile=()=>apiRequest('/profiles/me',{auth:true});
export const updateMyProfile=(payload)=>apiRequest('/profiles/me',{method:'PATCH',auth:true,body:payload});
export const getPublicProfile=(userId)=>apiRequest(`/profiles/${userId}`);
