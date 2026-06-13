const express=require('express'); const c=require('../controllers/log.controller'); const authRequired=require('../middlewares/authRequired'); const requireRole=require('../middlewares/requireRole');
const router=express.Router(); router.get('/',authRequired,requireRole('administrador'),c.list); module.exports=router;
