const { findUserById, findUserByEmail, updatePassword, updateBasic, deactivate, upgradeToSeller, sanitizeUser }=require('../models/user.model');
const { findRoleByName }=require('../models/role.model');
const profileModel=require('../models/profile.model');
const { comparePassword, hashPassword }=require('../utils/password');
function err(m,s){const e=new Error(m); e.statusCode=s; return e;}
async function settings(userId){ const user=await findUserById(userId); if(!user) throw err('Usuario no encontrado.',404); const profile=await profileModel.ensureProfile(userId); return {user:sanitizeUser(user),profile}; }
async function updateSettings(userId,data){ const user=await updateBasic(userId,data); const profile=await profileModel.ensureProfile(userId); return {user:sanitizeUser(user),profile}; }
async function changePassword(userId,{currentPassword,newPassword,confirmPassword}){ if(newPassword!==confirmPassword) throw err('La nueva contraseña y su confirmación no coinciden.',400); const user=await findUserById(userId); const full=await findUserByEmail(user.correo); const ok=await comparePassword(currentPassword,full.password_hash); if(!ok) throw err('La contraseña actual no es correcta.',400); const hash=await hashPassword(newPassword); await updatePassword(userId,hash); return {changed:true}; }
async function deactivateAccount(userId){ const user=await deactivate(userId); return {user:sanitizeUser(user)}; }
async function upgrade(userId,{acceptSellerTerms,seller_terms_accepted}){ if(!(acceptSellerTerms||seller_terms_accepted)) throw err('Debe aceptar las condiciones de vendedor.',400); const user=await findUserById(userId); if(!user) throw err('Usuario no encontrado.',404); if(user.rol==='administrador') throw err('Un administrador no puede cambiarse a vendedor desde este flujo.',403); if(user.rol!=='comprador') throw err('Solo compradores activos pueden cambiar a vendedor.',409); if(user.estado!=='activo') throw err('Usuario no activo.',403); const role=await findRoleByName('vendedor'); const updated=await upgradeToSeller(userId,role.id); return {user:sanitizeUser(updated)}; }
module.exports={settings,updateSettings,changePassword,deactivateAccount,upgrade};
