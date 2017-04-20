var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  User = mongoose.model('user'),
  wechatAPI = require('wechat-api'),
  wechatHelper = require('../manage/wechat_helper');


module.exports = function (app) {
  app.use('/', router);
};


router.get('/admin/user', function (req, res, next) {
  wechatHelper.getFollowers()
    .then((Data) => {
      res.render('admin/user', {
        title: 'WeChat Dashboard - WeChat User',
        listtitle: 'WeChat User List',
        Users: Data
      });
    }).catch((err) => {
      return next(err);
    });
});

router.get('/admin/user/:id', function (req, res, next) {

  wechatHelper.getUser(req.params.id)
    .then((Data) => {
      res.render('admin/viewuser', {
        title: 'WeChat Dashboard - WeChat User',
        listtitle: 'WeChat User',
        User: Data
      });
    }).catch((err) => {
      return next(err);
    });

});