let createError = require('http-errors');
let express = require ('express');
let config = require('./config/config');

let loginRouter = require('./routes/login');

let app = express();

app.use('/login', loginRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.listen(config.env.webPort, function () {
  console.log('The server listens: ' + config.env.webPort)
});

module.exports = app;