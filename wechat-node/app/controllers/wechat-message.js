var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  WechatMessage = mongoose.model('wechatmessage');


module.exports = function (app) {
  app.use('/', router);
};

//get list
router.get('/admin/wechatmessage', function (req, res, next) {
  var query = WechatMessage.find({});

  // query.where('field', 5);
  query.limit(5);//get 5 record
  query.skip(20);//get from 21

  query.exec(function (err, docs) {
    if (err) return next(err);
    res.render('admin/wechat-message', {
      title: 'WeChat Dashboard - WeChat Message Mapping',
      listtitle: 'WeChat Message List',
      WechatMessages: docs
    });
  });

  // WechatMessage.find(function (err, wechatmessages) {
  //   if (err) return next(err);
  //   res.render('admin/wechat-message', {
  //     title: 'WeChat Dashboard - WeChat Message Mapping',
  //     listtitle: 'WeChat Message List',
  //     WechatMessages: wechatmessages
  //   });
  // });
});

//delete
router.get('/admin/wechatmessage/delete/:id', function (req, res, next) {
  WechatMessage.find({ _id: req.params.id }).remove().exec(function (err) {
    if (err) return next(err);
    res.redirect("/admin/wechatmessage");
  });
  console.log(req.params.id);
});