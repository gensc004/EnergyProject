'use strict';

var express = require('express');
var controller = require('./data.controller');

var router = express.Router();

router.get('/test', controller.test);


module.exports = router;