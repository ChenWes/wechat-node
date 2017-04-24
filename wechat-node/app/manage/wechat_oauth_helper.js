var OAuth = require('wechat-oauth');
var wechatBasicConfig = require('../../config/config').wechatBasic;
var mongoose = require('mongoose');
var Token = mongoose.model('token');

var client = new OAuth(wechatBasicConfig.appid, wechatBasicConfig.appsecret, function (openid, callback) {
    // 传入一个根据openid获取对应的全局token的方法
    // 在getUser时会通过该方法来获取token
    Token.getToken(openid, function (err, result) {
        if (err) callback(err);
        callback(null, result);
    });
}, function (openid, token, callback) {
    // 持久化时请注意，每个openid都对应一个唯一的token!
    Token.setToken(openid, token, function (err, result) {
        if (err) callback(err);
        callback(null, result);
    });
});

module.exports = {
    getAuthorizeURL: function (redirectUrl, state, scope) {
        return new Promise((done, fail) => {
            var url = client.getAuthorizeURL(redirectUrl, state, scope);
            url ? done(url) : fail(new Error('[getAuthorizeURL Error]:AuthorizeURL Is Null'));
        });
    },
    getAuthorizeURLForWebsite: function (redirectUrl, state, scope) {
        return new Promise((done, fail) => {
            var url = client.getAuthorizeURLForWebsite(redirectUrl, state, scope);
            url ? done(url) : fail(new Error('[getAuthorizeURL Error]:AuthorizeURL Is Null'));
        });
    },
    getAccessToken: function (code) {
        return new Promise((done, fail) => {
            client.getAccessToken(code, function (err, result) {
                // var accessToken = result.data.access_token;
                // var openid = result.data.openid;
                err ? done(result.data) : fail(err);
            });
        });
    },
    refreshAccessToken: function (refreshToken) {
        return new Promise((done, fail) => {
            client.refreshAccessToken(refreshToken, function (err, result) {
                err ? fail(err) : done(result);
            });
        });
    },
    getUser: function (openid) {
        return new Promise((done, fail) => {
            client.getUser(openid, function (err, result) {
                err ? fail(err) : done(result);
            });
        });
    },
    getUserByCode: function (code) {
        return new Promise((done, fail) => {
            client.getUserByCode(code, function (err, result) {
                err ? fail(err) : done(result);
            });
        });
    }
}