const express = require('express');
const routes = express.Router();

routes.post('/start', function(req, res) {
    let randomNumber = "" + Math.round(Math.random() * 1000000000);
    console.log(randomNumber);

    res.status(200).json({
        "status": true,
        "result": {
            "url": "rtmp://localhost/live",
            "secretKey": randomNumber
        }
    });
});


module.exports = routes;