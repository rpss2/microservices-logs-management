module.exports = class CartItem {
    constructor(productSKU, qty) {
        this.productSKU = productSKU
        this.qty = qty
    }

    getProductSKU() {
        return this.productSKU
    }

    getQty() {
        return this.qty
    }
}