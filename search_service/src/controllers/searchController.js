const { Client } = require('@elastic/elasticsearch')
const esb = require('elastic-builder')

const Payment = require('../models/Payment')
const CartItem = require('../models/CartItem')

module.exports = {
    async getPaymentData(req, res) {
        const {
            from,
            size
        } = req.query
        const client = start_es_client()
        let query = {
            index: "filebeat-*",
            body: generate_query(from, size)
        }
        client.search(query, (err, result) => {
            if (err) {
                return res.status(502).json(err)
            }
            parse_search_payment_hit_result(result, (data) => {
                return res.status(200).json(data)
            })
        })
    },

    async getCartData(req, res) {
        const {
            from,
            size
        } = req.query
        const client = start_es_client()
        let query = {
            index: "filebeat-*",
            body: generate_cart_query(from, size)
        }
        client.search(query, (err, result) => {
            if (err) {
                return res.status(502).json(err)
            }
            parse_search_cart_hit_result(result, (data) => {
                return res.status(200).json(data)
            })
        })
    }
}

function start_es_client() {
    return new Client({ node: 'http://localhost:9200' })
}

function generate_query(from, size) {
    return new esb.RequestBodySearch().query(
        new esb.MatchQuery('message', "PaymentService#Charge invoked with request")
    )
    .from(from)
    .size(size)
    .toJSON()
}

function generate_cart_query(from, size) {
    return new esb.RequestBodySearch().query(
        new esb.MatchQuery('message', "AddItemAsync called with userId=")
    )
    .from(from)
    .size(size)
    .toJSON()
}

function parse_search_payment_hit_result(result, callback) {
    let data = result.body.hits.hits
    parsed_results = data.map(hit => {
        log_information = hit._source.message
        log_information_str = log_information.split("PaymentService#Charge invoked with request ")[1]
        log_information_str = log_information_str.replace('\'', '\"')
        log_information_str = log_information_str.split("\",\"pid")[0]

        log_information_str_json = log_information_str.replace(/[^A-Za-z{}_0-9:," ]/g, '')
        log_information_str_json = JSON.parse(Object.assign(log_information_str_json, {}))

        return parse_parsed_result(log_information_str_json)
    })

    callback(parsed_results)

    function parse_parsed_result(parsed_search) {
        return new Payment(parsed_search.amount.units, parsed_search.amount.currency_code)
    }
}

function parse_search_cart_hit_result(result, callback) {
    let data = result.body.hits.hits
    parsed_results = data.map(hit => {
        log_information = hit._source.message
        log_information_str = log_information.split(", ")
        log_information_str_product = log_information_str[1]
        log_information_str_qty = log_information_str[2]

        log_information_str_json = {
            productId: log_information_str_product.split("=")[1],
            quantity: log_information_str_qty.split("=")[1]
        }

        return parse_parsed_result(log_information_str_json)
    })

    callback(parsed_results)

    function parse_parsed_result(parsed_search) {
        return new CartItem(parsed_search.productId, parsed_search.quantity)
    }
}