const express=require('express'); const c=require('../controllers/notification.controller'); const authRequired=require('../middlewares/authRequired');
const router=express.Router(); router.get('/',authRequired,c.list); router.patch('/:id/read',authRequired,c.read); module.exports=router;
