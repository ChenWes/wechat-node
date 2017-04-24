var OAuth = require('wechat-oauth');
var wechatBasicConfig = require('../../config/config').wechatBasic;
var mongoose = require('mongoose');
var Token = mongoose.model('Token');

var client = new OAuth(wechatBasicConfig.appid, wechatBasicConfig.appsecret, function (openid, callback) {
    // 传入一个根据openid获取对应的全局token的方法
    // 在getUser时会通过该方法来获取token
    Token.getToken(openid, function (err, result) {
        console.log(result);
    });
}, function (openid, token, callback) {
    // 持久化时请注意，每个openid都对应一个唯一的token!
    Token.setToken(openid, token, function (err, result) {
        console.log(result);
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
                err ? fail(err) : done(result.data.openid);
            });
        });
    },
    getAccessTgetUseroken: function (openid) {
        return new Promise((done, fail) => {
            client.getUser(openid, function (err, result) {
                err ? fail(err) : done(result);
            });
        });
    },
    refreshAccessToken: function (refreshToken) {
        return new Promise((done, fail) => {
            api.refreshAccessToken(refreshToken, function (err, result) {
                err ? fail(err) : done(result);
            });
        });
    },
    getUser: function (options) {
        return new Promise((done, fail) => {
            api.getUser(options, function (err, result) {
                err ? fail(err) : done(result);
            });
        });
    },
    getUser: function (code) {
        return new Promise((done, fail) => {
            api.getUserByCode(code, function (err, result) {
                err ? fail(err) : done(result);
            });
        });
    }
}