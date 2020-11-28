const axios = require('axios')
const createCsvWriter = require('csv-writer').createObjectCsvWriter
const { v4: uuidv4 } = require('uuid')

const CartItem = require('../models/CartItem')

module.exports = {
    async analyzer(req, res) {
        const {
            from,
            size
        } = req.query

        get_cart_log_data(from, size, (err, cartData) => {
            if(err) return res.status(502).json(err)
            cart_data = parse_logs_data(cartData)
            write_csv(cart_data)
            return res.status(200).json(cart_data)
        })
    }
}

function write_csv(data) {
    const csvWriter = createCsvWriter({
        path: `src/files/${uuidv4()}.csv`,
        header: [
            {id: 'productSKU', title: 'SKU'},
            {id: 'qty', title: 'QUANTITY'}
        ]
    })

    csvWriter.writeRecords(data)
    .then(() => {
        console.log('...Done')
    })
}

function get_cart_log_data(from, size, callback) {
    axios.get(`http://localhost:5000/api/search/cart?from=${from}&size=${size}`)
    .then(data => {
        callback(null, data.data)
    })
    .catch(err => {
        callback(err, {})
    })
}

function parse_logs_data(cartData) {
    return cartData.map(cart => {
        return new CartItem(cart.productSKU, cart.qty)
    })
}