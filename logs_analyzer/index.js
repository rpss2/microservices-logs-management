const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const routes = require('./src/routes')

const PORT = 4000
const app = express()

app.use(cors())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))


app.get('/health', function (req, res) {
    res.status(200).json({message: 'Payment Analyzer Service OK!'})
})

app.use('/', routes)

app.listen(PORT, function() {
    console.log(`Example app listening on port ${PORT}!`)
})