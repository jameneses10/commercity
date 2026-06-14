const termsModel=require('../models/terms.model');
const CURRENT_TERMS_VERSION='v1.0';
function normalizeVersion(v){ return (v||CURRENT_TERMS_VERSION).trim(); }
async function record(conn,{usuario_id,version,ip,user_agent}){ await termsModel.recordAcceptance(conn,{usuario_id,version:normalizeVersion(version),ip,user_agent}); }
module.exports={CURRENT_TERMS_VERSION,normalizeVersion,record};
