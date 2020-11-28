const express = require('express')
const routes = express()

const logsAnalyser = require('./logsAnalyser')

routes.use('/api', logsAnalyser)

module.exports = routes