const express = require('express');
const request = require('request-promise');
const routes = express.Router();
const streamStatsUrl = "http://localhost:8000/api/streams";

let options = {
    uri: streamStatsUrl,
    json: true
};

routes.post('/start', function(req, res) {
    let randomNumber = "" + Math.round(Math.random() * 1000000000);
    console.log(randomNumber);

    res.status(200).json({
        "status": true,
        "result": {
            "url": "rtmp://localhost/live",
            "secretKey": randomNumber,
            "deprecated": 'Deze endpoint is niet meer nodig, deze informatie krijg je nu gewoon bij het inloggen met een transparent account'
        }
    });
});

routes.get('/list', function (req, res) {
    request(options)
        .then((response) => {
            let streams = response.live;
            let streamList = [];

            for (let i in streams) {
                if (streams.hasOwnProperty(i)) {
                    let name = streamList[i].publisher.stream;
                        let streamObj = {
                        "name": name,
                        "source": "http://localhost:8000/live/" + name +".flv"
                    };
                    streamList.push(streamObj);
                }
            }

            res.status(200).json({
                "status": true,
                "result": streamList
            })

        })
        .catch((err) => {
            res.status(400).json({
                "status": false,
                "result": err
            })
        })
});

routes.get('/stats/:streamid', function (req, res) {
    const streamid = req.params.streamid;

    request(options)
        .then((response) => {
            let stats = response.live[streamid];
            if(stats){
                let viewerscount = stats.subscribers.length;
                res.status(200).json({
                    "status": true,
                    "result": {
                        "viewercount": viewerscount
                    }
                })
            }
            else {
                res.status(500).json({
                    "status": false,
                    "result": "This stream doesn't exist"
                })
            }
        }).catch((err) => {
            res.status(400).json({
                "status": false,
                "result": err
            })
    })
});

module.exports = routes;