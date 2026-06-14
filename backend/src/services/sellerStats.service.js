const storeModel=require('../models/store.model'); const model=require('../models/sellerStats.model');
function err(m,s){const e=new Error(m); e.statusCode=s; return e;}
async function sellerStore(userId){const store=await storeModel.findStoreBySellerId(userId); if(!store) throw err('El vendedor no tiene tienda registrada.',404); return store;}
async function stats(userId){const store=await sellerStore(userId); return {store, stats: await model.stats(store.id)};}
async function earnings(userId,q={}){const store=await sellerStore(userId); const page=Math.max(parseInt(q.page||'1',10),1), limit=Math.min(Math.max(parseInt(q.limit||'20',10),1),50); return {store, earnings: await model.earnings(store.id,{limit,offset:(page-1)*limit}), pagination:{page,limit}};}
async function outOfStock(userId){const store=await sellerStore(userId); return {store, products: await model.outOfStock(store.id)};}
async function soldProducts(userId){const store=await sellerStore(userId); return {store, products: await model.soldProducts(store.id)};}
module.exports={stats,earnings,outOfStock,soldProducts,sellerStore};
