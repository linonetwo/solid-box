const HtmlWebpackPlugin = require('html-webpack-plugin');
const CspHtmlWebpackPlugin = require('csp-html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const merge = require('webpack-merge');
const path = require('path');
const base = require('./webpack.config');

module.exports = merge(base, {
  mode: 'production',
  devtool: 'nosources-source-map', // https://webpack.js.org/configuration/devtool/ && https://github.com/webpack/webpack/issues/5627#issuecomment-389492939
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'app/src/index-prod.html'),
      filename: 'index-prod.html',
    }),
    new CspHtmlWebpackPlugin({
      'base-uri': ["'self'"],
      'object-src': ["'none'"],
      'script-src': ["'self'"],
      'style-src': ["'self' 'unsafe-inline'"],
      'frame-src': ["'none'"],
      'worker-src': ["'none'"],
    }),
  ],
});
