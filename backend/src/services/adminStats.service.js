const model=require('../models/adminStats.model');
const notification=require('./notification.service');
const logService=require('./log.service');
function err(m,s){const e=new Error(m);e.statusCode=s;return e;}
async function dashboardStats(){ return model.dashboardStats(); }
async function listUsers(query){ const limit=Math.min(Math.max(parseInt(query.limit||'50',10),1),100); const page=Math.max(parseInt(query.page||'1',10),1); return {users:await model.listUsers({limit,offset:(page-1)*limit}),pagination:{page,limit}}; }
async function updateUserStatus(admin,id,estado,ip){ if(!['activo','inactivo','baneado'].includes(estado)) throw err('Estado no permitido.',400); if(Number(admin.id)===Number(id) && estado!=='activo') throw err('No puede inactivar o banear su propia cuenta.',400); const user=await model.findUser(id); if(!user) throw err('Usuario no encontrado.',404); const updated=await model.updateUserStatus(id,estado); await notification.create(null,id,{tipo:'estado_cuenta',titulo:'Estado de cuenta actualizado',mensaje:`Tu cuenta ahora está en estado ${estado}.`,entidad_tipo:'usuarios',entidad_id:id,url_destino:'/pages/account-settings.html'}); await logService.log(null,{usuario_id:admin.id,accion:'usuario_estado_actualizado',entidad:'usuarios',entidad_id:id,detalle:{estado},ip}); return updated; }
module.exports={dashboardStats,listUsers,updateUserStatus};
