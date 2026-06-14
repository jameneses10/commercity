const express=require('express'); const c=require('../controllers/productReport.controller'); const authRequired=require('../middlewares/authRequired'); const requireRole=require('../middlewares/requireRole'); const {createReportValidator,updateReportValidator}=require('../validators/productReport.validators');
const productReportRouter=express.Router(); productReportRouter.post('/:id/report',authRequired,createReportValidator,c.report);
const adminProductReportRouter=express.Router(); adminProductReportRouter.get('/reports/products',authRequired,requireRole('administrador'),c.listAdmin); adminProductReportRouter.patch('/reports/products/:id',authRequired,requireRole('administrador'),updateReportValidator,c.updateAdmin);
module.exports={productReportRouter,adminProductReportRouter};
