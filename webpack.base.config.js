// @ts-check
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const gameConfigs = [
  { key: "baby-monkey", title: "Baby Monkey" },
  { key: "flappy-bird-cat", title: "Flappy Bird Cat" },
  { key: "goat", title: "G.O.A.T." },
];

const entry = {};
const htmlPlugins = [];

gameConfigs.forEach(({ key, title }) => {
  entry[key] = path.join(__dirname, `src/games/${key}/index.ts`);
  htmlPlugins.push(
    new HtmlWebpackPlugin({
      chunks: [key],
      filename: `${key}/index.html`,
      template: path.join(__dirname, "src/game-template.html"),
      title,
    })
  );
});

module.exports = {
  entry,
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].[hash].js",
  },
  resolve: {
    extensions: [".js", ".ts"],
    alias: {
      pixi: path.join(__dirname, "node_modules/phaser-ce/build/custom/pixi.js"),
      phaser: path.join(
        __dirname,
        "node_modules/phaser-ce/build/custom/phaser-split.js"
      ),
      p2: path.join(__dirname, "node_modules/phaser-ce/build/custom/p2.js"),
    },
  },
  plugins: [
    ...htmlPlugins,
  ],
  module: {
    rules: [
      { test: /\.tsx?$/, use: "awesome-typescript-loader" },
      { test: /\.json$/, use: "json-loader" },
      { test: /\.html$/, use: "html-loader" },
      { test: /\.css$/, use: ["style-loader", "css-loader"] },
      {
        test: /(fonts|assets)(\/|\\)/,
        use: "file-loader?name=/assets/[hash].[ext]",
      },
      { test: /pixi\.js$/, use: "expose-loader?PIXI" },
      { test: /phaser-split\.js$/, use: "expose-loader?Phaser" },
      { test: /p2\.js$/, use: "expose-loader?p2" },
    ],
  },
};
