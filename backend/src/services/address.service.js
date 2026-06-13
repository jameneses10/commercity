const model=require('../models/address.model');
function err(m,s){const e=new Error(m);e.statusCode=s;return e;}
async function list(user){return model.listByUser(user.id)}
async function create(user,body){return model.create(user.id,body)}
async function own(id,user){const a=await model.findById(id); if(!a) throw err('Dirección no encontrada.',404); if(a.usuario_id!==user.id) throw err('No tiene permisos sobre esta dirección.',403); return a;}
async function update(id,user,body){await own(id,user); return model.update(id,body)}
async function remove(id,user){await own(id,user); const orders=await model.countOrders(id); if(orders>0) throw err('No se puede eliminar una dirección asociada a pedidos históricos.',409); await model.remove(id); return true;}
module.exports={list,create,update,remove,own};
