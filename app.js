let http = require('http');
let createError = require('http-errors');
let express = require ('express');
let config = require('./config/env/env');
let loginRouter = require('./routes/login');

let app = express();

app.use('/login', loginRouter);


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