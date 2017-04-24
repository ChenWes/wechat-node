var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  UserMapping = mongoose.model('usermapping'),
  wechatOAuthHelper = require('../manage/wechat_oauth_helper');


module.exports = function (app) {
  app.use('/auth', router);
};

router.get('/', function (req, res, next) {

  var accessCode = req.query.code

  wechatOAuthHelper.getAccessToken(accessCode)
    .then((result) => {
      //get user and send to page
      res.render('auth/index', {
        openid: result.openid
      });
    })
    .catch((err) => {
      next(err);
    });
});

//post info save to db
router.post('/', function (req, res, next) {
  console.log(req.body.wechat);
  console.log(req.body.email);


  res.redirect('/auth/authorized');
});

//send post back
router.get('/authorized', function (req, res, next) {
  res.render('auth/authorized', {
  });
})