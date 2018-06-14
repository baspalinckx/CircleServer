const express = require('express');
const routes = express.Router();
const bcrypt = require('bcrypt');
const sha256 = require('sha256');
const users = require('../model/users');
const config = require('../config/env/env');
const jwt = require('jsonwebtoken');
const baseURL = 'rtmp://188.166.29.146/live/';
const keypair = require('keypair');
const rsa = require('node-rsa');

var crypto = require('crypto');




routes.post('/salt', function (req, res) {
    const body = req.body;

    if(body.email){
        users.findOne({"email": body.email}).then((user) => {
            res.status(200).json({
                "status": true,
                "result": {
                    "email": body.email,
                    "salt": user.salt
                }
            })
        }).catch(() => {
            res.status(400).json({
                "status": false,
                "result": "User does not exist"
            })
        })
    }
    else {
        res.status(400).json({
            "status": false,
            "result": "no email given"
        })
    }
});

routes.post('/login', function(req, res) {
    const body = req.body;

    if(body.email && body.hash && body.transparent !== null){
        users.findOne({"email": body.email}).then((user) => {
            if(body.hash.toLowerCase() === user.password){
                if(user.transparent === body.transparent || body.transparent === false){

                    const payload = {
                        transparent: user.transparent,
                        name: user.firstName + " " + user.lastName,
                        id: user._id
                    };

                    let token = jwt.sign(payload, config.env.secret, {
                        expiresIn: 14400
                    });

                    let response;

                    if(user.transparent && body.transparent){
                        let sessionid = sha256('' + Math.random() * 10000000000);
                        response = {
                            'status': true,
                            'result': {
                                'token': token,
                                'streamUrl': baseURL + sessionid
                            }
                        }
                    }
                    else {
                        response = {
                            'status': true,
                            'result': token
                        }
                    }

                    res.status(200).json(response);
                }
                else {
                    res.status(400).json({
                        'status': false,
                        'result': "You are not permitted to stream"
                    })
                }
            }
            else {
                res.status(400).json({
                    'status': false,
                    'result': "password is wrong"
                })
            }
        }).catch((err) => {
            console.log(err);
            res.status(400).json({
                'status': false,
                'result': "user not found"
            })
        })
    }
    else {
        res.status(400).json({
            'status': false,
            'result': "no credentials given"
        })
    }
});

routes.post('/rsaencrypt', function (req, res) {
    const body = req.body;
    const verify = crypto.createVerify('SHA256');
    let keys = keypair();
    const sign = crypto.createSign('SHA256');
    sign.update(body.email).end();
    const signature = sign.sign(keys.private);
    verify.update(body.email);
    verify.end();
    const verified = (verify.verify(keys.public, signature));
    console.log(verified);




});

routes.post('/rsalogin', function (req, res) {
   const body = req.body;
   if(body.email && body.encryptedEmail){
       users.findOne({"email": body.email}).then((user) => {


       })
   }
});

routes.post('/register', function (req, res) {
    let pair = keypair();
    const body = req.body;

    if(body.email && body.firstName && body.lastName  && body.password && body.transparent !== null){
        bcrypt.genSalt(5).then((salt) => {
            let hashedPass = sha256(salt + body.password);

            const userProps = {
                'email': body.email,
                'firstName': body.firstName,
                'lastName': body.lastName,
                'salt': salt,
                'password': hashedPass,
                'transparent': body.transparent,
                'publickey': pair.public
            };

            users.create(userProps)
                .then((user) => {
                    res.status(200).json({
                        "status": true,
                        "result": {
                            "user": user,
                            "privatekey": pair.private
                        }
                    })
                })
                .catch((error) => {
                    console.log(error);
                    res.status(400).json({
                        "status": false,
                        "result": error
                    });
                });
        });
    }
    else {
        res.status(400).json({
            "status": false,
            "result": "Credentials arn't given, the required parameters are: email, firstName, lastName, password, transparent"
        })
    }
});

module.exports = routes;