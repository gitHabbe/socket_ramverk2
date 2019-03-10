const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const stock = require("./stock.js");
const axios = require('axios');


// var princessTarta = {
//     name: "Princesstårta",
//     rate: 1.002,
//     variance: 0.6,
//     startingPoint: 20
// };

// var mandelKubb = {
//     name: "Mandel kubb",
//     rate: 1.001,
//     variance: 0.4,
//     startingPoint: 20
// };

// var cakes = [ princessTarta, mandelKubb ];
const api_uri = process.env.API_URI || "http://localhost:8333";
let figures = [];
(async () => {
    try {
        const test = await axios.get(`${api_uri}/figure/figures`);
        figures = test.data;
        console.log('TCL: figures.data', figures.data);
    } catch (error) {
        console.log('catch -> error', error);
    }
})();

io.on('connection', async socket => {
    console.log('a user connected');
    
    
    socket.on('close', (code, reason) => {
        console.log("code", code);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
        io.emit("userleave", "someone left");
    });
});

setInterval(function () {
    console.log('TCL: figures', figures);
    figures.forEach(cake => {
        cake["value"] = stock.getStockPrice(cake);
        return cake;
    });

    io.emit("stocks", figures);
}, 5000);

// Answer on all http requests
app.use((req, res) => {
    console.log("HTTP request on " + req.url);
    res.send({ msg: "hello" });
});

http.listen(3002, () => {
    console.log('listening on *:3002');
});
