var stock = {
    randomAroundZero: function () {
        return Math.random() > 0.5 ? 1 : -1;
    },

    getStockPrice: function (input) {
        let { value, rate, variance } = input;
        if (value < 1) value = 1;
        return value * rate + variance * stock.randomAroundZero();
    }
};

module.exports = stock;
