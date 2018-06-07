var express = require('express');
var router = express();

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express'});

});

module.express = router;