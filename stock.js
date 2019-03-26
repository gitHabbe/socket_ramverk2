var stock = {
    randomAroundZero: function () {
        return Math.random() > 0.5 ? 1 : -1;
    },

    getStockPrice: function (input) {
        let { value, rate, variance } = input;
        let newValue = value * rate + variance * stock.randomAroundZero();
        while (newValue < 0.1) {
            newValue = value * rate + variance * stock.randomAroundZero();
        }
        return newValue;
    }
};

module.exports = stock;
