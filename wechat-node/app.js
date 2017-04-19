

var express = require('express'),
  config = require('./config/config'),
  glob = require('glob'),
  mongoose = require('mongoose'),
  directline_manage = require('./app/manage/directline_manage');

//mongo db connect
mongoose.Promise = global.Promise;
mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
});

//add all models
var models = glob.sync(config.root + '/app/models/*.js');
models.forEach(function (model) {
  require(model);
});

//create express and setting express
var app = express();
module.exports = require('./config/express')(app, config);

//first time directline get token
directline_manage.getTokenAndGetConverstation(config.directlineSecret, config.wechat);


app.listen(config.port, function () {
  console.log('Express server listening on port ' + config.port);
});

