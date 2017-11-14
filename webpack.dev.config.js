const path = require('path');
const baseConfig = require('./webpack.base.config');
const merge = require('lodash.merge');

module.exports = merge({}, baseConfig, {
  devtool: 'eval',
  devServer: {
    compress: true,
    port: 9000,
    inline: true,
    publicPath: '/'
  }
});
