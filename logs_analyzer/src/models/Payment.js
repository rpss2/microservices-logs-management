module.exports = class Payment {
    constructor(amount, currency) {
        this.amount = amount
        this.currency = currency
    }

    getAmout() {
        return this.amount
    }

    getCurrency() {
        return this.currency
    }
}