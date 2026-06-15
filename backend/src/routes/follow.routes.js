const express=require('express'); const c=require('../controllers/follow.controller'); const authRequired=require('../middlewares/authRequired');
const router=express.Router();
router.post('/:userId/follow',authRequired,c.follow);
router.delete('/:userId/follow',authRequired,c.unfollow);
router.get('/:userId/followers',c.followers);
router.get('/:userId/following',c.following);
module.exports=router;
