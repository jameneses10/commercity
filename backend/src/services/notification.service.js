const model=require('../models/notification.model');
function err(m,s){const e=new Error(m);e.statusCode=s;return e;}
async function create(conn,userId,payload){ if(!userId) return null; return model.createForUser(conn,userId,payload); }
async function list(user){ return model.list(user.id); }
async function markRead(user,id){ const ok=await model.markRead(id,user.id); if(!ok) throw err('Notificación no encontrada.',404); return true; }
module.exports={create,list,markRead};
