const model = require('../models/webIntegration.model');
const logService = require('./log.service');
function id(value) { const n=Number(value); if(!Number.isInteger(n)||n<1){ const e=new Error('Identificador inválido.'); e.statusCode=400; throw e; } return n; }
async function sellerProducts(user){ return model.sellerProducts(user.id); }
async function sellerReviews(user){ return model.sellerReviews(user.id); }
async function sellerReputation(user){ return model.sellerReputation(user.id); }
async function sellerCommissions(user){ return model.sellerCommissions(user.id); }
async function adminStores(query){ return model.adminStores(query); }
async function adminPayments(query){ return model.adminPayments(query); }
async function adminShipments(query){ return model.adminShipments(query); }
async function adminReviews(query){ return model.adminReviews(query); }
async function adminCommissions(query){ return model.adminCommissions(query); }
async function updateCommissionStatus(admin, commissionId, body, ip){
  const updated = await model.updateCommissionStatus(id(commissionId), body.estado);
  await logService.log(null,{usuario_id:admin.id,accion:'comision_estado_actualizado',entidad:'comisiones',entidad_id:updated.id,detalle:{estado:body.estado},ip});
  return updated;
}
module.exports={sellerProducts,sellerReviews,sellerReputation,sellerCommissions,adminStores,adminPayments,adminShipments,adminReviews,adminCommissions,updateCommissionStatus};
