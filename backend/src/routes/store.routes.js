const express = require('express');
const controller = require('../controllers/store.controller');
const authRequired = require('../middlewares/authRequired');
const requireRole = require('../middlewares/requireRole');
const { storeUpload, multerErrorHandler } = require('../middlewares/upload.middleware');
const { createStoreValidator, updateStoreValidator } = require('../validators/store.validators');

const router = express.Router();

router.post('/', authRequired, requireRole('vendedor'), storeUpload.fields([{ name: 'logo', maxCount: 1 }, { name: 'banner', maxCount: 1 }]), multerErrorHandler, createStoreValidator, controller.create);
router.get('/me', authRequired, requireRole('vendedor'), controller.me);
router.patch('/me', authRequired, requireRole('vendedor'), storeUpload.fields([{ name: 'logo', maxCount: 1 }, { name: 'banner', maxCount: 1 }]), multerErrorHandler, updateStoreValidator, controller.updateMe);
router.get('/:id/products', controller.products);
router.get('/:id/reputation', controller.reputation);
router.patch('/:id/pause', authRequired, requireRole('vendedor', 'administrador'), controller.pause);
router.patch('/:id/activate', authRequired, requireRole('vendedor', 'administrador'), controller.activate);
router.get('/:id', controller.getById);

module.exports = router;
