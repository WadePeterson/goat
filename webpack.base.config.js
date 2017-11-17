const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: [
    path.join(__dirname, `src/index.ts`)
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].[hash].js'
  },
  resolve: {
    extensions: ['.js', '.ts']
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.join(__dirname, 'src/index.html')
    })
  ],
  module: {
    rules: [
      { test: /\.tsx?$/, use: 'awesome-typescript-loader' },
      { test: /\.json$/, use: 'json-loader' },
      { test: /\.html$/, use: 'html-loader' },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      { test: /(fonts|assets)(\/|\\)/, use: 'file-loader?name=assets/[hash].[ext]' }
      // { test: /pixi\.js$/, use: 'expose-loader?PIXI' },
      // { test: /phaser-split\.js$/, use: 'expose-loader?Phaser' },
      // { test: /p2\.js$/, use: 'expose-loader?p2' }
    ]
  }
};
