const model=require('../models/log.model');
async function log(conn,payload){ return model.create(conn,payload); }
async function list(query){ const page=Math.max(parseInt(query.page||'1',10),1); const limit=Math.min(Math.max(parseInt(query.limit||'20',10),1),100); const offset=(page-1)*limit; return {logs:await model.list({limit,offset}),pagination:{page,limit}}; }
module.exports={log,list};
