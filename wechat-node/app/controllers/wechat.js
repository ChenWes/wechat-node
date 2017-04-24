var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  WechatMessage = mongoose.model('wechatmessage'),
  WechatEvent = mongoose.model('wechatevent'),
  UserMapping = mongoose.model('usermapping'),
  wechat = require('wechat'),
  winston = require('winston');

var directlineHelper = require('../manage/directline_manage');
var wechatOAuthHelper = require('../manage/wechat_oauth_helper');
var wechatBasicConfig = require('../../config/config').wechatBasic;
var wechatManageConfig = require('../../config/config').wechatManage;


var OAuth = require('wechat-oauth');
var client = new OAuth(wechatBasicConfig.appid, wechatBasicConfig.appsecret);


//setting logger
var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({ filename: './log/wechat.log' })
  ]
});

// var config = {
//   token: 'weixin',
//   appid: 'wx1434eed5268660c4',
//   encodingAESKey: 'ZEtViedarf49EUOCDeu45pqhkZhKPFBjSHI2DynP4vq',
//   checkSignature: true // 可选，默认为true。由于微信公众平台接口调试工具在明文模式下不发送签名，所以如要使用该测试工具，请将其设置为false
// };

module.exports = function (app) {

  app.use('/wechat', wechat(wechatBasicConfig, wechat.text(function (message, req, res, next) {
    var message = req.weixin;

    logger.log('info', message);

    //new entity
    var newMessage = new WechatMessage({
      msgID: message.MsgId,
      to_wechat_user: message.ToUserName,
      from_wechat_user: message.FromUserName,
      msgType: message.MsgType,
      content: message.Content,
      created: new Date()
    });

    //save to db
    newMessage.save(function (err, wechatmessage) {
      if (err) return next(err);
    });

    //check wechat user have mapping data
    UserMapping.findOne({ wechat_user: message.FromUserName }, function (err, result) {
      if (err) {
        console.log(err);
        res.reply('have error');
      }
      //if no mapping
      if (!result) {
        wechatOAuthHelper.getAuthorizeURL(wechatManageConfig.authUrl, 'STATE', 'snsapi_userinfo')
          .then((url) => {
            console.log(url);
            var newurl = wechatManageConfig.authTextConfig.replace('{@url}', '"' + url + '"');
            console.log(newurl);
            res.reply(newurl);
          })
          .catch((err) => {
            res.reply('get wechat authorize url error:' + err);
          });
      }
      else {
        //if current user have mapping , then send message to bot framework

        var touserid = message.FromUserName;
        //send message entity
        var messageBody = {
          "type": "message",
          "from": {
            "id": message.FromUserName,
            "FromUserName": 'WeChatUser'
          },
          "text": message.Content
        };

        directlineHelper.sendMessageToBotFramework(messageBody, touserid);

        res.reply('');
      }
    });


    //-----------------------------------------------------------------------------------------------------------
  }).image(function (message, req, res, next) {
    var message = req.weixin;

    logger.log('info', message);

    //new entity
    var newMessage = new WechatMessage({
      msgID: message.MsgId,
      to_wechat_user: message.ToUserName,
      from_wechat_user: message.FromUserName,
      msgType: message.MsgType,
      picUrl: message.PicUrl,
      mediaId: message.MediaId,
      created: new Date()
    });

    //save to db
    newMessage.save(function (err, wechatmessage) {
      if (err) return next(err);
    });


    res.reply('图片');
    //-----------------------------------------------------------------------------------------------------------
  }).voice(function (message, req, res, next) {
    var message = req.weixin;

    logger.log('info', message);

    //new entity
    var newMessage = new WechatMessage({
      msgID: message.MsgId,
      to_wechat_user: message.ToUserName,
      from_wechat_user: message.FromUserName,
      msgType: message.MsgType,
      mediaId: message.MediaId,
      format: message.Format,
      created: new Date()
    });

    //save to db
    newMessage.save(function (err, wechatmessage) {
      if (err) return next(err);
    });

    res.reply('声音');
    //-----------------------------------------------------------------------------------------------------------
  }).video(function (message, req, res, next) {
    var message = req.weixin;

    logger.log('info', message);

    //new entity
    var newMessage = new WechatMessage({
      msgID: message.MsgId,
      to_wechat_user: message.ToUserName,
      from_wechat_user: message.FromUserName,
      msgType: message.MsgType,
      mediaId: message.MediaId,
      thumbMediaId: message.ThumbMediaId,
      created: new Date()
    });

    //save to db
    newMessage.save(function (err, wechatmessage) {
      if (err) return next(err);
    });

    res.reply('视频');
    //-----------------------------------------------------------------------------------------------------------
  }).location(function (message, req, res, next) {
    var message = req.weixin;

    logger.log('info', message);


    res.reply('位置信息');
    //-----------------------------------------------------------------------------------------------------------
  }).link(function (message, req, res, next) {
    var message = req.weixin;

    res.reply('链接');
    //-----------------------------------------------------------------------------------------------------------
  }).event(function (message, req, res, next) {
    var message = req.weixin;

    //new entity
    var newEvent = new WechatEvent({
      ToUserName: message.ToUserName,
      FromUserName: message.FromUserName,
      MsgType: message.MsgType,
      Event: message.Event,
      EventKey: message.EventKey,
      created: new Date()
    });

    console.log(newEvent);

    // //save to db
    newEvent.save(function (err, wechatevent) {
      if (err) return next(err);
    });

    res.reply("事件");
    //-----------------------------------------------------------------------------------------------------------
  }).device_text(function (message, req, res, next) {
    var message = req.weixin;

    res.reply('设备信息');
    //-----------------------------------------------------------------------------------------------------------
  }).device_event(function (message, req, res, next) {
    if (message.Event === 'subscribe' || message.Event === 'unsubscribe') {
      var message = req.weixin;

      res.reply("订阅事件");
    } else {
      var message = req.weixin;

      res.reply('取消订阅');
      //-----------------------------------------------------------------------------------------------------------
    }
  })));
};