import {apiRequest} from './client.js';
export const followUser=(id)=>apiRequest(`/profiles/${id}/follow`,{method:'POST',auth:true,body:{}});
export const unfollowUser=(id)=>apiRequest(`/profiles/${id}/follow`,{method:'DELETE',auth:true});
export const followers=(id)=>apiRequest(`/profiles/${id}/followers`);
export const following=(id)=>apiRequest(`/profiles/${id}/following`);
