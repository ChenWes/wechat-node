var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  User = mongoose.model('user'),
  wechatAPI = require('wechat-api');

var api = new wechatAPI('wx1434eed5268660c4', '30a5f51682755652e6e02879757a0fb1');

module.exports = function (app) {
  app.use('/', router);
};


router.get('/admin/user', function (req, res, next) {
  // User.find(function (err, users) {
  //   if (err) return next(err);

  api.getFollowers((err, result) => {
    // res.json(result);
    res.render('admin/user', {
      title: 'WeChat Dashboard - WeChat User',
      listtitle: 'WeChat User List',
      Users: result
    });
  });

  // });
});

router.get('/admin/user/:id', function (req, res, next) {
  api.getUser({ openid: req.params.id, lang: 'en' }, (err, result) => {
    // res.json(result);
    res.render('admin/viewuser', {
      title: 'WeChat Dashboard - WeChat User',
      listtitle: 'WeChat User',
      User: result
    });
  });
});