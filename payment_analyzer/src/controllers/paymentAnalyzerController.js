const axios = require('axios')
const fs = require('fs')
const createCsvWriter = require('csv-writer').createObjectCsvWriter
const { v4: uuidv4 } = require('uuid')

const Payment = require('../models/Payment')
const Report = require('../models/Report')

module.exports = {
    async analyzer(req, res) {
        const {
            from,
            size
        } = req.query

        get_payment_log_data(from, size, (err, paymentData) => {
            if(err) return res.status(502).json(err)
            payment_data = parse_logs_data(paymentData)
            // currency_payment = analyzer_items(payment_data)
            // analyzed_data = generate_analyzed_payment_data(currency_payment)
            write_csv(payment_data)
            return res.status(200).json(payment_data)
        })
    }
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
        console.log('...Done');
    })
}

// function generate_analyzed_payment_data(currency_payment) {
//     analyzed_data = []
//     currency_payment.forEach((value, key) => {
//         const total = sum_values_from_list(value)
//         const average = parseFloat((total / value.length).toFixed(2))
//         analyzed_data.push(
//             new Report(key, total, average)
//         )
//     })
//     return analyzed_data
// }

function sum_values_from_list(list) {
    return list.reduce((acc, value) => {
        return acc + value
    }, 0)
}

function analyzer_items(paymentItems) {
    const map = new Map()
    paymentItems.forEach(pay => {
        const key = pay.currency
        const collection = map.get(key)
        const value = parseFloat(pay.amount)
        if(!collection) map.set(key, [value])
        else collection.push(value)
    })
    return map
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