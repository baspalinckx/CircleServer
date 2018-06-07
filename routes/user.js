const express = require('express');
const routes = express.Router();
const bcrypt = require('bcrypt');
const sha256 = require('sha256');

routes.get('/login', function(req, res) {
    res.status(400);
    res.json({
        'login': 'test'
    });
});

routes.post('/register', function(req, res) {
    const body = req.body;

    if(body.email && body.lastName && body.firstName && body.password){
        bcrypt.genSalt(5).then((salt) => {
            let hashedPass = sha256(salt + body.password);
            res.status(400).json({
                'hash': hashedPass,
                'salt': salt
            })
        })
    }
    else {
        res.status(400);
        res.json({
            'login': 'test'
        });
    }

});

module.exports = routes;