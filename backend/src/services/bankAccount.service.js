const model=require('../models/bankAccount.model'); const {sellerStore}=require('./sellerStats.service');
function sanitize(data){ if(!data) return null; return {...data, academic_notice:'Cuenta bancaria simulada para fines académicos. No usar datos reales.'}; }
async function get(userId){const store=await sellerStore(userId); return {store, bank_account:sanitize(await model.findByStore(store.id))};}
async function create(userId,payload){const store=await sellerStore(userId); const existing=await model.findByStore(store.id); if(existing){const e=new Error('La tienda ya tiene cuenta bancaria simulada.'); e.statusCode=409; throw e;} return {store, bank_account:sanitize(await model.create({...payload,tienda_id:store.id,usuario_id:userId}))};}
async function update(userId,payload){const store=await sellerStore(userId); const existing=await model.findByStore(store.id); if(!existing){const e=new Error('No existe cuenta bancaria simulada para actualizar.'); e.statusCode=404; throw e;} return {store, bank_account:sanitize(await model.update(store.id,payload))};}
module.exports={get,create,update};
