const fs = require('fs');
const express = require('express')

const paymentAnalyzerController = require('../controllers/paymentAnalyzerController')
const cartAnalyzerController = require('../controllers/cartAnalyzerController')

const router = express.Router()

router.post('/payment/analyzer', paymentAnalyzerController.analyzer)
router.post('/cart/analyzer', cartAnalyzerController.analyzer)

module.exports = router