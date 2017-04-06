var path = require('path'),
  rootPath = path.normalize(__dirname + '/..'),
  env = process.env.NODE_ENV || 'development',
  defaultport = 3001,
  config = {
    token: 'weixin',
    appid: 'wx1434eed5268660c4',
    encodingAESKey: 'ZEtViedarf49EUOCDeu45pqhkZhKPFBjSHI2DynP4vq',
    checkSignature: true // 可选，默认为true。由于微信公众平台接口调试工具在明文模式下不发送签名，所以如要使用该测试工具，请将其设置为false
  };;

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'wechat-node'
    },
    port: process.env.PORT || defaultport,
    db: 'mongodb://localhost/wechat-development',
    wechat: config
  },

  test: {
    root: rootPath,
    app: {
      name: 'wechat-node'
    },
    port: process.env.PORT || defaultport,
    db: 'mongodb://localhost/wechat-node-test',
    wechat: config
  },

  production: {
    root: rootPath,
    app: {
      name: 'wechat-node'
    },
    port: process.env.PORT || defaultport,
    db: 'mongodb://localhost/wechat-node-production',
    wechat: config
  }
};

module.exports = config[env];
