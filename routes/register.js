const express = require('express');
const routes = express.Router();

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
        console.log(body.name);
        console.log(body.password);
    }
    else {
        console.log(body)
    }
    res.status(400);
    res.json({
        'login': 'test'
    });
});

module.exports = routes;