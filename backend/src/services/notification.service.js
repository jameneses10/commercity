const model=require('../models/notification.model');
function err(m,s){const e=new Error(m);e.statusCode=s;return e;}
async function create(conn,userId,payload){ if(!userId) return null; return model.createForUser(conn,userId,payload); }
async function list(user){ return model.list(user.id); }
async function unreadCount(user){ return {unread_count:await model.unreadCount(user.id)}; }
async function markRead(user,id){ const ok=await model.markRead(id,user.id); if(!ok) throw err('Notificación no encontrada.',404); return true; }
async function markAllRead(user){ return {updated:await model.markAllRead(user.id)}; }
async function remove(user,id){ const ok=await model.remove(id,user.id); if(!ok) throw err('Notificación no encontrada.',404); return true; }
async function removeAll(user){ return {deleted:await model.removeAll(user.id)}; }
module.exports={create,list,unreadCount,markRead,markAllRead,remove,removeAll};
