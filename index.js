const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const stock = require("./stock.js");
const axios = require('axios');

const api_uri = process.env.API_URI || "http://localhost:7333";
let figures = [];
(async () => {
    try {
        const test = await axios.get(`${api_uri}/figure/figures`);
        figures = test.data;
    } catch (error) {
        console.log('catch -> error', error);
    }
})();

io.on('connection', async socket => {
    console.log('a user connected');
    
    
    socket.on('close', (code, reason) => {
        console.log("code", code);
    });

    socket.on("buy", async info => {
        console.log("Got emit on socket 'buy'");
		console.log("TCL: info", info);
        let correctFigure = figures.find(figure => figure.name === info.figure.name);
        socket.emit("buying", {correctFigure, user: info.user, count: info.count});
    });

    socket.on("sell", async info => {
        console.log("Got emit on socket 'sell'");
		console.log("TCL: info", info);
        let correctFigure = figures.find(figure => figure.name === info.figure.name);
        socket.emit("selling", {correctFigure, user: info.user, count: info.count});
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
        io.emit("userleave", "someone left");
    });
});

setInterval(() => {
    figures.forEach(figure => {
        figure["value"] = stock.getStockPrice(figure);
        return figure;
    });

    io.emit("stocks", figures);
}, 5000);

// Answer on all http requests
app.use((req, res) => {
    console.log("HTTP request on " + req.url);
    res.send({ msg: "hello" });
});

http.listen(2003, () => {
    console.log('listening on *:2003');
});
