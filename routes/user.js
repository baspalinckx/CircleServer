const express = require('express');
const routes = express.Router();
const bcrypt = require('bcrypt');

routes.get('/login', function(req, res) {
    res.status(400);
    res.json({
        'login': 'test'
    });
});

routes.post('/register', function(req, res) {
    const body = req.body;

    if(body.email && body.name && body.password){
        console.log(body.email);
        console.log(body.firstName);
        console.log(body.lastName);
        console.log(body.password);

        bcrypt.genSalt(10).then((salt) => {
            bcrypt.hash(body.password, salt).then((hashedPass) => {
                console.log(hashedPass);
                res.status(400).json({
                    'hash': hashedPass,
                    'salt': salt
                })
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