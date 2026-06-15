const express=require('express'); const c=require('../controllers/adminSearch.controller'); const authRequired=require('../middlewares/authRequired'); const requireRole=require('../middlewares/requireRole');
const router=express.Router(); router.get('/search',authRequired,requireRole('administrador'),c.search); module.exports=router;
