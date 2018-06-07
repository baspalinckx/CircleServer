let http = require('http');
let createError = require('http-errors');
let express = require ('express');
let bodyParser = require('body-parser');
let config = require('./config/config');
let loginRouter = require('./routes/user');

let config = require('./config/env/env');
let loginRouter = require('./routes/login');

let app = express();

app.use(bodyParser.urlencoded({
    'extended': 'true'
}));
app.use(bodyParser.json());
app.use(bodyParser.json({
    type: 'application/vnd.api+json'
}));

app.use('/user', loginRouter);



app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', process.env.ALLOW_ORIGIN || 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use('*', function(req, res){
  res.status(400);
  res.json({
      'error': 'Deze URL is niet beschikbaar'
  })
});

app.listen(config.env.webPort, function () {
  console.log('The server listens: ' + config.env.webPort)
});

module.exports = app;