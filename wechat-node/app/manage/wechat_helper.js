var wechatAPI = require('wechat-api');
var request = require('request');
var fs = require('fs');
var api;
var _wechat_appsecret;
var _wechat_appid;

module.exports = {
    init: function (pi_wechatConfig) {
        _wechat_appsecret = pi_wechatConfig.appsecret;
        _wechat_appid = pi_wechatConfig.appid;

        // console.log('wechat get config-------------' + _wechat_appid + '-------' + _wechat_appsecret);
        api = new wechatAPI(_wechat_appid, _wechat_appsecret);

        // if (pi_wechatConfig.logWechat) {
        //     module.exports.sendTextToClient(pi_wechatConfig.manageUser, 'wechat init ' + new Date());
        // }
    },
    sendTextToClient: function (senduserid, text) {
        return new Promise((done, fail) => {
            api.sendText(senduserid, text, (err, result) => {
                err ? fail(err) : done(result);
            });
        })
    },
    sendImageToClient: function (senduserid, mediaid) {
        return new Promise((done, fail) => {
            api.sendImage(senduserid, mediaid, (err, result) => {
                err ? fail(err) : done(result);
            });
        })
    },
    uploadImageToServer: function (filename, filetype) {
        return new Promise((done, fail) => {
            api.uploadMedia(filename, filetype, (err, result) => {
                err ? fail(err) : done(result);
            })
        })
    },
    downloadImageToLocal: function (url, filename) {
        return new Promise((done, fail) => {
            request(url).on('error', fail).pipe(fs.createWriteStream(filename).on('finish', () => {
                done();
            }));
        })
    }
}