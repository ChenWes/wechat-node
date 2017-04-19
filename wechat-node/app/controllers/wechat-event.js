var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  WechatEvent = mongoose.model('wechatevent');


module.exports = function (app) {
  app.use('/', router);
};

//get list
router.get('/admin/wechatevent', function (req, res, next) {
  WechatEvent.find(function (err, wechatevents) {
    if (err) return next(err);
    res.render('admin/wechat-event', {
      title: 'WeChat Dashboard - WeChat Event Mapping',
      listtitle: 'WeChat Event List',
      WechatEvents: wechatevents
    });
  });
});

//delete
router.get('/admin/wechatevent/delete/:id', function (req, res, next) {
  WechatEvent.find({ _id: req.params.id }).remove().exec(function (err) {
    if (err) return next(err);
    res.redirect("/admin/wechatevent");
  });
  console.log(req.params.id);
});