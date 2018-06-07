const express = require('express');
const routes = express.Router();
const bcrypt = require('bcrypt');
const sha256 = require('sha256');
const users = require('../model/users');
const config = require('../config/env/env');
const jwt = require('express-jwt');

routes.post('/login', function(req, res) {
    const body = req.body;

    if(body.email && body.password && body.transparent !== null){
        users.findOne({"email": body.email}).then((user) => {
            let passHash = sha256(user.salt + body.password);
            if(passHash === user.password){
                if(user.transparent === body.transparent || body.transparent === false){

                    const payload = {
                        transparent: user.transparent,
                        name: user.firstName + " " + user.lastName
                    };

                    let token = jwt.sign(payload, config.env.secret, {
                        expiresInMinutes: 14400
                    });

                    res.status(200).json({
                        'status': true,
                        'result': token
                    })
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

routes.post('/register', function(req, res) {
    const body = req.body;
    res.contentType('application/json');

    if(body.email && body.firstName && body.lastName  && body.password && body.transparent !== null){
        bcrypt.genSalt(5).then((salt) => {
            let hashedPass = sha256(salt + body.password);
            const userProps = {
                'email': body.email,
                'firstName': body.firstName,
                'lastName': body.lastName,
                'salt': salt,
                'password': hashedPass,
                'transparent': body.transparent
            };

            users.create(userProps)
                .then((user) => {
                    res.status(200).json({
                        "status": true,
                        "result": user
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