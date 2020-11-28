module.exports = class Report {
    constructor(currency, total, average) {
        this.currency = currency
        this.total = total
        this.average = average
    }

    getCurrency() {
        return this.currency
    }

    getTotal() {
        return this.total
    }

    getAverage() {
        return this.average
    }
}