const HtmlWebpackPlugin = require('html-webpack-plugin');
const CspHtmlWebpackPlugin = require('csp-html-webpack-plugin');
const merge = require('webpack-merge');
const path = require('path');
const base = require('./webpack.config');

module.exports = merge(base, {
  mode: 'development',
  devtool: 'source-map', // Show the source map so we can debug when developing locally
  devServer: {
    host: 'localhost',
    port: '40992',
    hot: true, // Hot-reload this server if changes are detected
    compress: true, // Compress (gzip) files that are served
    contentBase: path.resolve(__dirname, 'app/dist'), // Where we serve the local dev server's files from
    watchContentBase: true, // Watch the content base for changes
    watchOptions: {
      ignored: /node_modules/, // Ignore this path, probably not needed since we define contentBase above
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'app/src/index.html'),
      filename: 'index.html',
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
