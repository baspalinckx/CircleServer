const express = require('express');
const routes = express.Router();
const bcrypt = require('bcrypt');
const sha256 = require('sha256');
const users = require('../model/users');

routes.get('/login', function(req, res) {
    res.status(400);
    res.json({
        'login': 'test'
    });
});

routes.post('/register', function(req, res) {
    const body = req.body;
    res.contentType('application/json');

    if(body.email && body.firstName && body.lastName  && body.password ){
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