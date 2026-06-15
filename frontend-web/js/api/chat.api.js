import {apiRequest} from './client.js';
export const listConversations=()=>apiRequest('/chat/conversations',{auth:true});
export const createConversation=(payload)=>apiRequest('/chat/conversations',{method:'POST',auth:true,body:payload});
export const getMessages=(id)=>apiRequest(`/chat/conversations/${id}/messages`,{auth:true});
export const sendMessage=(id,payload)=>apiRequest(`/chat/conversations/${id}/messages`,{method:'POST',auth:true,body:payload});
export const markConversationRead=(id)=>apiRequest(`/chat/conversations/${id}/read`,{method:'PATCH',auth:true,body:{}});
