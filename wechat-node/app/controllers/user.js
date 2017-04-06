var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  User = mongoose.model('user');  
  

module.exports = function (app) {
  app.use('/', router);
};

router.get('/admin/user', function (req, res, next) {
  User.find(function (err, users) {
    // res.json(users);
    if (err) return next(err);
    res.render('admin/user', {    
      title:'WeChat Dashboard - WeChat User',
      listtitle:'WeChat User List',  
      Users: users
    });
  });
});