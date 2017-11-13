const path = require('path');
const baseConfig = require('./webpack.base.config');
const merge = require('lodash.merge');

module.exports = merge({}, baseConfig, {
  devtool: 'eval',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
    inline: true,
    watchOptions: {
      aggregateTimeout: 300,
      poll: true,
      ignored: /node_modules/
    }
  }
});
