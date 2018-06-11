let express = require ('express');
let bodyParser = require('body-parser');
let loginRouter = require('./routes/user');
let chatRouter = require('./routes/chat');
let config = require('./config/env/env');
let mongodb = require('./config/mongodb');
let jwt = require('express-jwt');

let app = express();

app.use(bodyParser.urlencoded({
    'extended': 'true'
}));
app.use(bodyParser.json());
app.use(bodyParser.json({
    type: 'application/vnd.api+json'
}));

app.use(jwt({ secret: config.env.secret}).unless({path: ['/user/register', '/user/login']}));


app.use('/user', loginRouter);
app.use('/', chatRouter);

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({
            'status': false,
            'result': "Token is invalid"

        });
    }
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