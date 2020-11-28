const express = require('express')
const routes = express()

const paymentAnalyser = require('./paymentAnalyser')

routes.use('/api', paymentAnalyser)

module.exports = routes