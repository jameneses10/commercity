const model=require('../models/adminSearch.model');
function err(m,s){const e=new Error(m);e.statusCode=s;return e;}
async function search(q){ const term=String(q||'').trim(); if(term.length<2) throw err('El término de búsqueda debe tener al menos 2 caracteres.',400); return model.search(term); }
module.exports={search};
