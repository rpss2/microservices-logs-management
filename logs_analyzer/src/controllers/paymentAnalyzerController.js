const axios = require('axios')
const createCsvWriter = require('csv-writer').createObjectCsvWriter
const { v4: uuidv4 } = require('uuid')
const {Cashify} = require('cashify')

const Payment = require('../models/Payment')

module.exports = {
    async analyzer(req, res) {
        const {
            from,
            size
        } = req.query

        get_payment_log_data(from, size, (err, paymentData) => {
            if(err) return res.status(502).json(err)
            payment_data = parse_logs_data(paymentData)
            payment_data = currency_convert(payment_data)
            write_csv(payment_data)
            return res.status(200).json(payment_data)
        })
    }
}

function currency_convert(data) {
    const rates = {
        CAD: 1.30,
        EUR: 0.84,
        JPY: 104.07,
        USD: 1.00
    }
    const cashify = new Cashify({base: 'USD', rates})
    
    return data.map(transaction => {
        const result = cashify.convert(transaction.amount, {from: transaction.currency, to: 'USD'})
        return new Payment(result.toFixed(2), transaction.currency)
    })
    
}

function write_csv(data) {
    const csvWriter = createCsvWriter({
        path: `src/files/${uuidv4()}.csv`,
        header: [
            {id: 'currency', title: 'CURRENCY'},
            {id: 'amount', title: 'TOTAL'}
        ]
    })

    csvWriter.writeRecords(data)
    .then(() => {
        console.log('...Done')
    })
}

function get_payment_log_data(from, size, callback) {
    axios.get(`http://localhost:5000/api/search/payment?from=${from}&size=${size}`)
    .then(data => {
        callback(null, data.data)
    })
    .catch(err => {
        callback(err, {})
    })
}

function parse_logs_data(paymentData) {
    return paymentData.map(pay => {
        return new Payment(pay.amount, pay.currency)
    })
}