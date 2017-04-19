// Example model

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var WechatMessageSchema = new Schema({
    msgID: String,
    to_wechat_user: String,
    from_wechat_user: String,
    msgType: String,
    content: String,//for message
    picUrl: String,//for image
    format: String,//for video
    mediaId: String,
    recognition: String,
    thumbMediaId:String,
    created: { type: Date }
});

WechatMessageSchema.virtual('date')
    .get(function () {
        return this._id.getTimestamp();
    });

mongoose.model('wechatmessage', WechatMessageSchema);

