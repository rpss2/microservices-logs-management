const fs = require('fs');
const express = require('express')

const paymentAnalyzerController = require('../controllers/paymentAnalyzerController')

const router = express.Router()

router.post('/payment/analyzer', paymentAnalyzerController.analyzer)

module.exports = router