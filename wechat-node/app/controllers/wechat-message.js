var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  WechatMessage = mongoose.model('wechatmessage');


module.exports = function (app) {
  app.use('/', router);
};

//get list
router.get('/admin/wechatmessage', function (req, res, next) {
  WechatMessage.find(function (err, wechatmessages) {
    if (err) return next(err);
    res.render('admin/wechat-message', {
      title: 'WeChat Dashboard - WeChat Message Mapping',
      listtitle: 'WeChat Message List',
      WechatMessages: wechatmessages
    });
  });
});

//delete
router.get('/admin/wechatmessage/delete/:id', function (req, res, next) {
  WechatMessage.find({ _id: req.params.id }).remove().exec(function (err) {
    if (err) return next(err);
    res.redirect("/admin/wechatmessage");
  });
  console.log(req.params.id);
});