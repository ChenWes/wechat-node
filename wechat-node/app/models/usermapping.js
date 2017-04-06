// Example model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var UserMappingSchema = new Schema({
  wechat_user: String,
  wechat_name: String,
  azure_userid: String,
  azure_username: String,
  azure_email: String  
});

UserMappingSchema.virtual('date')
  .get(function(){
    return this._id.getTimestamp();
  });

mongoose.model('usermapping', UserMappingSchema);

