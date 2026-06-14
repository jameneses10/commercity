const { pool } = require('../config/database');
async function recordAcceptance(conn,{usuario_id,version,ip,user_agent}){ await conn.query('INSERT INTO terminos_aceptaciones (usuario_id,version,aceptado_at,ip,user_agent) VALUES (?,?,NOW(),?,?)',[usuario_id,version,ip||null,(user_agent||'').slice(0,255)||null]); }
module.exports={recordAcceptance};
