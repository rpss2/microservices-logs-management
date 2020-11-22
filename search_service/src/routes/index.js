const express = require('express')
const routes = express()

const search = require('./search')

routes.use('/api', search)

module.exports = routes