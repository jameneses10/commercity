const express=require('express'); const c=require('../controllers/notification.controller'); const authRequired=require('../middlewares/authRequired');
const router=express.Router();
router.get('/',authRequired,c.list);
router.get('/unread-count',authRequired,c.unreadCount);
router.patch('/read-all',authRequired,c.readAll);
router.patch('/:id/read',authRequired,c.read);
router.delete('/:id',authRequired,c.remove);
router.delete('/',authRequired,c.removeAll);
module.exports=router;
