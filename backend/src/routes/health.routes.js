const express = require('express');
const { successResponse } = require('../utils/response');

const router = express.Router();

router.get('/health', (req, res) => {
  return res.status(200).json(
    successResponse('CommerCity API funcionando correctamente', {
      service: 'backend',
      version: '1.0.0',
    })
  );
});

module.exports = router;
