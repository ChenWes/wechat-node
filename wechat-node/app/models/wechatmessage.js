// Example model

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var WechatMessageSchema = new Schema({
    to_wechat_user: String,
    from_wechat_user: String,
    content: String,
    created: { type: Date }
});

WechatMessageSchema.virtual('date')
    .get(function () {
        return this._id.getTimestamp();
    });

mongoose.model('wechatmessage', WechatMessageSchema);

