const baseConfig = require('./webpack.base.config');
const merge = require('lodash.merge');
const webpack = require('webpack');

module.exports = merge({}, baseConfig, {
  devtool: 'source-map',
  plugins: baseConfig.plugins.concat([
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({ 'process.env': { 'NODE_ENV': JSON.stringify('production') } }),
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      sourceMap: true,
      include: /\.min\.js$/,
    })
  ])
});
