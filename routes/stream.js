const express = require('express');
const request = require('request-promise');
const routes = express.Router();
const users = require('../model/users');
const Promise = require('bluebird');
let streamStatsUrl = "http://localhost:8000/api/streams";
let baseURL;

if(process.platform=== 'win32'){
    baseURL = "http://localhost:8000/live/";
}else {
    baseURL = "http://188.166.29.146:8000/live/"
}

let options = {
    uri: streamStatsUrl,
    json: true
};

routes.get('/list', function (req, res) {
    request(options)
        .then((response) => {
            let streams = response.live;
            let streamList = [];
            let promises = [];
            for (let i in streams) {
                if (streams.hasOwnProperty(i)) {
                    let name = streams[i].publisher.stream;
                    let promise = users.findOne({"email": name}).then((user) => {
                        if(user) {
                            streamList.push({
                                "name": user.firstName + ' ' + user.lastName,
                                "email": name,
                                "source": baseURL + name + "/index.m3u8"
                            })
                        }else {
                            streamList.push({
                                "name": name,
                                "email": name,
                                "source": baseURL + name + "/index.m3u8"
                            })
                        }
                    }).catch(() => {
                        streamList.push({
                            "name": name,
                            "email": name,
                            "source": baseURL + name + "/index.m3u8"
                        })
                    });
                    promises.push(promise)
                }
            }
            Promise.all(promises).then(() => {
                res.status(200).json({
                    "status": true,
                    "result": streamList
                })
            })
        })
        .catch((err) => {
            res.status(400).json({
                "status": false,
                "result": err
            })
        })
});

routes.post('/satoshi', function (req, res) {
    const email = req.body.email;

    users.findOne({"email": email}).then((user) => {
        console.log(user);
        res.status(200).json({
            "status": true,
            "result": user.satoshi
        })
    }).catch(() => {
        res.status(200).json({
            "status": false,
            "result": false
        })
    })
});

routes.post('/stats', function (req, res) {
    const email = req.body.email;

    request(options)
        .then((response) => {
            let stats = response.live[email];
            if(stats){
                res.status(200).json({
                    "status": true,
                    "result": stats.subscribers.length
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