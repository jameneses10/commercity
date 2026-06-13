const express=require('express'); const c=require('../controllers/review.controller'); const authRequired=require('../middlewares/authRequired'); const requireRole=require('../middlewares/requireRole'); const {createReviewValidator,moderateReviewValidator}=require('../validators/review.validators');
const reviewRouter=express.Router(); reviewRouter.post('/',authRequired,requireRole('comprador'),createReviewValidator,c.create);
const adminReviewRouter=express.Router(); adminReviewRouter.patch('/:id/moderate',authRequired,requireRole('administrador'),moderateReviewValidator,c.moderate);
module.exports={reviewRouter,adminReviewRouter};
