const profileModel=require('../models/profile.model');
function err(m,s){const e=new Error(m); e.statusCode=s; return e;}
async function me(userId){ return profileModel.ensureProfile(userId); }
async function updateMe(userId,data){ return profileModel.updateByUserId(userId,data); }
async function publicProfile(userId,viewerId=null){ const p=await profileModel.publicProfile(userId,viewerId); if(!p) throw err('Perfil público no encontrado.',404); return p; }
module.exports={me,updateMe,publicProfile};
