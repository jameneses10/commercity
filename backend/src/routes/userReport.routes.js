const express=require('express'); const c=require('../controllers/userReport.controller'); const authRequired=require('../middlewares/authRequired'); const requireRole=require('../middlewares/requireRole'); const {createUserReportValidator,updateUserReportValidator}=require('../validators/userReport.validators');
const userReportRouter=express.Router(); userReportRouter.post('/:id/report',authRequired,createUserReportValidator,c.report);
const adminUserReportRouter=express.Router(); adminUserReportRouter.get('/reports/users',authRequired,requireRole('administrador'),c.list); adminUserReportRouter.patch('/reports/users/:id',authRequired,requireRole('administrador'),updateUserReportValidator,c.update);
module.exports={userReportRouter,adminUserReportRouter};
