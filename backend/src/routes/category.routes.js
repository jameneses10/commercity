const express = require('express');
const controller = require('../controllers/category.controller');
const authRequired = require('../middlewares/authRequired');
const requireRole = require('../middlewares/requireRole');
const { createCategoryValidator, updateCategoryValidator } = require('../validators/category.validators');

const router = express.Router();

router.get('/', controller.list);
router.post('/', authRequired, requireRole('administrador'), createCategoryValidator, controller.create);
router.patch('/:id', authRequired, requireRole('administrador'), updateCategoryValidator, controller.update);
router.delete('/:id', authRequired, requireRole('administrador'), controller.remove);

module.exports = router;
