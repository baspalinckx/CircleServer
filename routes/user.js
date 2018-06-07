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
            console.log(userProps);

            users.create(userProps)
                .then((users) => {
                    res.status(200).send(users)
                })
                .catch((error) => res.status(400).json(error))
        });
    }
    else {
        res.status(400);
        res.json({
            'login': 'test'
        });
    }

});

module.exports = routes;