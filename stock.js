var stock = {
    randomAroundZero: function () {
        return Math.random() > 0.5 ? 1 : -1;
    },

    getStockPrice: function (input) {
        let { value, rate, variance } = input;
        return value * rate + variance * stock.randomAroundZero();

    }
};

module.exports = stock;
