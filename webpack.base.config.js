const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const gameNames = ['BabyMonkey'];

function getConfigForGame(gameName) {
  return {
    entry: {
      [gameName]: path.join(__dirname, `src/games/${gameName}/index.ts`)
    },
    output: {
      path: path.join(__dirname, 'dist', gameName),
      filename: '[name].[hash].js'
    },
    resolve: {
      extensions: ['.js', '.ts'],
      alias: {
        pixi: path.join(__dirname, 'node_modules/phaser-ce/build/custom/pixi.js'),
        phaser: path.join(__dirname, 'node_modules/phaser-ce/build/custom/phaser-split.js'),
        p2: path.join(__dirname, 'node_modules/phaser-ce/build/custom/p2.js'),
        assets: path.join(__dirname, 'assets/')
      }
    },
    plugins: [
      new HtmlWebpackPlugin({ template: path.join(__dirname, 'src/index.html') })
    ],
    module: {
      rules: [
        { test: /\.tsx?$/, use: 'awesome-typescript-loader' },
        { test: /\.json$/, use: 'json-loader' },
        { test: /\.html$/, use: 'html-loader' },
        { test: /\.css$/, use: [ 'style-loader', 'css-loader' ] },
        { test: /assets(\/|\\)/, use: 'file-loader?name=assets/[hash].[ext]' },
        { test: /pixi\.js$/, use: 'expose-loader?PIXI' },
        { test: /phaser-split\.js$/, use: 'expose-loader?Phaser' },
        { test: /p2\.js$/, use: 'expose-loader?p2' }
      ]
    }
  };
};

module.exports = gameNames.map(getConfigForGame);
