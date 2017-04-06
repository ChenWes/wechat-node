// Example model

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var WechatEventSchema = new Schema({
    ToUserName: String,
    FromUserName: String,
    MsgType: String,
    Event: String,
    EventKey: String,
    created: { type: Date }
});

WechatEventSchema.virtual('date')
    .get(function () {
        return this._id.getTimestamp();
    });

mongoose.model('wechatevent', WechatEventSchema);

