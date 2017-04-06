var path = require('path'),
  rootPath = path.normalize(__dirname + '/..'),
  env = process.env.NODE_ENV || 'development',
  defaultport = 3001;

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'wechat-node'
    },
    port: process.env.PORT || defaultport,
    db: 'mongodb://localhost/wechat-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'wechat-node'
    },
    port: process.env.PORT || defaultport,
    db: 'mongodb://localhost/wechat-node-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'wechat-node'
    },
    port: process.env.PORT || defaultport,
    db: 'mongodb://localhost/wechat-node-production'
  }
};

module.exports = config[env];
