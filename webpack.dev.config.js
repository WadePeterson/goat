const path = require('path');
const baseConfigs = require('./webpack.base.config');
const merge = require('lodash.merge');

module.exports = Object.keys(baseConfigs).map(gameName => {
  const baseConfig = baseConfigs[gameName];
  return merge({}, baseConfig, {
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
});
