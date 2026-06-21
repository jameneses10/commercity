import {apiRequest} from './client.js';
export const sellerStats=()=>apiRequest('/seller/store/stats',{auth:true});
export const sellerEarnings=(params={})=>apiRequest('/seller/store/earnings?'+new URLSearchParams(params),{auth:true});
export const outOfStockProducts=()=>apiRequest('/seller/store/out-of-stock-products',{auth:true});
export const soldProducts=()=>apiRequest('/seller/store/sold-products',{auth:true});
