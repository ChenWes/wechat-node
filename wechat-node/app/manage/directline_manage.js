var client = require('./directline-api-v3');
var schedule = require('node-schedule');
var _ = require("underscore");
var co = require('co');
var url = require("url");
var fs = require('fs');

var wechatHelper = require('./wechat_helper');

var _tokenObject;
var _conversationWss;
var _watermark = 0;

var secret;
var wechatConfig;

module.exports = {
    getTokenAndGetConverstation: function (pi_secret, pi_wechatConfig) {
        //get secret
        secret = pi_secret;
        wechatConfig = pi_wechatConfig;

        //wechat init
        wechatHelper.init(wechatConfig);

        // console.log('==get wechat config==>' + new Date());
        // console.log(wechatConfig);
        // console.log('==get secret==>' + new Date());
        // console.log(secret);
        // console.log('==start get get token==>' + new Date());

        client.getTokenObject(secret).subscribe(
            (tokenObject) => {
                _tokenObject = tokenObject;
                // console.log(_tokenObject);
                //conversation stream
                module.exports.getConversationStream();
            },
            (err) => console.log(err),
            () => console.log('1.1:get token successfully')
        )
    },
    getConversationStream: function () {
        //create Conversation
        client.initConversationStream(_tokenObject).subscribe(
            (message) => {
                _conversationWss = message;
                // console.log(_conversationWss);

                //setting schedule refresh token
                module.exports.settingScheduleRefreshToken();
            },
            (err) => console.log(err),
            () => console.log("1.2:get conversation successfully")
        )
    },
    settingScheduleRefreshToken: function () {
        //refresh token,every 15 min refreshToken
        var rule = new schedule.RecurrenceRule();
        rule.minute = [0, 15, 30, 45];
        _refershSchedule = schedule.scheduleJob(rule, function () {
            console.log('==start refresh token==>' + new Date());

            module.exports.refreshToken();
        });
    },
    refreshToken: function () {
        client.refTokenObject(_tokenObject).subscribe(
            (tokenObject) => {
                _tokenObject = tokenObject;
                console.log(_tokenObject);
            },
            (err) => {
                //cancel schedule
                _refershSchedule.cancel();
            },
            () => console.log('1.3:refresh token successfully')
        )
    },
    sendMessageToBotFramework: function (messageBody, touserid) {
        client.sendMessage(_tokenObject, messageBody).subscribe(
            (data) => {
                var sendMessageid = data.id;

                //time out function get message from botframework
                setTimeout(function () {
                    module.exports.getMessageFromBotFramework(touserid, _tokenObject, sendMessageid, _watermark)
                }, 10000);

            },
            (err) => {
                logger.log('error', err);
            },
            () => {
                console.log("2.2:send message to bot botframework successfully");
            }
        );
    },
    getMessageFromBotFramework: function (senduserid, tokenobject, sendmsgid, sendwatermark) {
        client.getMessage(tokenobject, sendwatermark).subscribe(
            (result) => {

                _watermark = result.watermark;

                //filter activities
                var getResponseMessages = _.where(result.activities, { replyToId: sendmsgid });

                //send message to wechat client
                module.exports.sendMessageToClient(senduserid, getResponseMessages);

                //if send message max , then restart the converstation
                if (sendmsgid) {
                    var arr = sendmsgid.split('|');

                    // console.log(arr[1]);
                    if (arr[1] == '9999999') {
                        module.exports.getTokenAndGetConverstation();
                    }
                }

            },
            (err) => {
                logger.log('error', err);
            },
            () => console.log("3.1:get message from botframework successfully")
        )
    },
    sendMessageToClient: function (senduserid, getResponseMessages) {
        if (getResponseMessages) {

            co(function* () {
                for (let getmessageItem of getResponseMessages) {
                    yield module.exports.processMessageItem(senduserid, getmessageItem);
                }
            }).catch(function (err) {
                console.log(err);
            });

        }
        else {
            //no message get from botframework
            api.sendText(senduserid, 'time out , but bot framework no response', function (err, result) {
            });
        }
    },
    processMessageItem: function* (senduserid, messageItem) {

        //master text
        if (messageItem.text) {
            yield wechatHelper.sendTextToClient(senduserid, messageItem.text);
        }

        if (messageItem.attachments) {
            let attachmentItems = messageItem.attachments;

            // logger.log('error', messageItem.attachments);
            for (let key in attachmentItems) {
                if (attachmentItems[key].contentType == 'application/vnd.microsoft.card.thumbnail' || attachmentItems[key].contentType == 'application/vnd.microsoft.card.hero') {

                    //attachment text
                    let message = '';
                    if (attachmentItems[key].content.title) {
                        message = message + attachmentItems[key].content.title;
                    }
                    if (attachmentItems[key].content.subtitle) {
                        message = message + '\r' + attachmentItems[key].content.subtitle;
                    }
                    if (attachmentItems[key].content.text) {
                        message = message + '\r' + attachmentItems[key].content.text;
                    }
                    if (message) {
                        yield wechatHelper.sendTextToClient(senduserid, message);
                    }

                    //image
                    let images = attachmentItems[key].content.images;
                    for (let imgkey in images) {
                        let imageurl = images[imgkey].url;
                        if (imageurl) {
                            //down load image to local
                            let imageTempName = url.parse(imageurl, true).query.fileName;
                            yield wechatHelper.downloadImageToLocal(imageurl, './tempImage/' + imageTempName);
                            //upload to wechat server
                            let serverresult = yield wechatHelper.uploadImageToServer('./tempImage/' + imageTempName, 'image');
                            fs.unlink('tempImage/' + imageTempName);
                            //send image
                            if (serverresult) {
                                yield wechatHelper.sendImageToClient(senduserid, serverresult.media_id);
                            }
                        }
                    }
                }
            }
        }
    }
}