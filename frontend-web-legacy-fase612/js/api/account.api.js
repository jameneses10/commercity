import {apiRequest} from './client.js';
export const getSettings=()=>apiRequest('/account/settings',{auth:true});
export const updateSettings=(payload)=>apiRequest('/account/settings',{method:'PATCH',auth:true,body:payload});
export const deactivateAccount=()=>apiRequest('/account/deactivate',{method:'PATCH',auth:true});
export const upgradeToSeller=(payload)=>apiRequest('/account/upgrade-to-seller',{method:'POST',auth:true,body:payload});
export const changePassword=(payload)=>apiRequest('/auth/change-password',{method:'POST',auth:true,body:payload});
