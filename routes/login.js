const express = require('express');
const routes = express.Router();
// const router = express();

routes.get('/', function(req, res) {
    res.status(400);
    res.json({
        'login': 'test'

    });
});

module.exports = routes;