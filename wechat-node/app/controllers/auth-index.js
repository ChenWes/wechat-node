var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  User = mongoose.model('user'),
  wechatAPI = require('wechat-api'),
  wechatHelper = require('../manage/wechat_helper');


module.exports = function (app) {
  app.use('/auth', router);
};


router.get('/', function (req, res, next) {
  // var code = req.params.code;

  console.log(req.param.code);
  console.log(req.params.code);
  
  res.render('auth/index', {
    code: req.params.code
  });
    
});