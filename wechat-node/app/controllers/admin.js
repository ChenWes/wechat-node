var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  UserMapping = mongoose.model('usermapping');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
  UserMapping.find(function (err, usermappings) {
    // res.json(usermappings);
    if (err) return next(err);
    res.render('admin/index', {    
      title:'WeChat Dashboard - WeChat User Mapping',
      listtitle:'WeChat User Mapping List',  
      UserMappings: usermappings
    });
  });
});
