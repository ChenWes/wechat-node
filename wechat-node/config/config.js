var path = require('path'),
  rootPath = path.normalize(__dirname + '/..'),
  env = process.env.NODE_ENV || 'development',
  defaultport = 3001,
  bot_secret = 'UEa5EW2iyKI.cwA.a6M.-4dB90kHdYYrVRS288ZiSkmyhRKE9dAVB4uGJKA30bQ',
  wechatBasicConfig = {
    appsecret: '30a5f51682755652e6e02879757a0fb1',
    token: 'weixin',
    appid: 'wx1434eed5268660c4',
    encodingAESKey: 'ZEtViedarf49EUOCDeu45pqhkZhKPFBjSHI2DynP4vq',
    checkSignature: true // 可选，默认为true。由于微信公众平台接口调试工具在明文模式下不发送签名，所以如要使用该测试工具，请将其设置为false
  };
wechatManageConfig = {
  manageUser: 'oykr00-hJ_yxEMPnAUDHoSfsWymc',//wechat manage user id
  logWechat: true,//log flag    
  authUrl: 'http://weschen.imwork.net/auth/',
  authTextConfig: 'Your Current Wechat Account Is Not Authorized \r\n/:coffee<a href={@url}>Get WeChat Authorization</a>\r\nEsquel LPD Bot WeChat Channel'
};

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'wechat-node'
    },
    port: process.env.PORT || defaultport,
    db: 'mongodb://localhost/wechat-development',
    directlineSecret: bot_secret,
    wechatBasic: wechatBasicConfig,
    wechatManage: wechatManageConfig
  },

  test: {
    root: rootPath,
    app: {
      name: 'wechat-node'
    },
    port: process.env.PORT || defaultport,
    db: 'mongodb://localhost/wechat-node-test',
    directlineSecret: bot_secret,
    wechatBasic: wechatBasicConfig,
    wechatManage: wechatManageConfig
  },

  production: {
    root: rootPath,
    app: {
      name: 'wechat-node'
    },
    port: process.env.PORT || defaultport,
    db: 'mongodb://localhost/wechat-node-production',
    directlineSecret: bot_secret,
    wechatBasic: wechatBasicConfig,
    wechatManage: wechatManageConfig
  }
};

module.exports = config[env];
