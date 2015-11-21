require('babel-core/register');

// Webpack config for development
const path = require('path');
const webpack = require('webpack');
const pkg = require('../package.json');
const WebpackNotifierPlugin = require('webpack-notifier');
const config = require('./config');

const _root = path.join(__dirname, '../');

module.exports = {
  // entry points
  entry: _root + '/src/crawl.js',
  cache: true,
  debug: true,
  // more options here: http://webpack.github.io/docs/configuration.html#devtool
  devtool: 'eval',
  output: {
    path: _root + '/dist',
    filename: 'crawl.js',
    libraryTarget: 'umd',
    library: console._app,
  },
  module: {
    loaders: [{
      test: /\.js?$/,
      exclude: /node_modules/,
      loaders: ['babel-loader'],
    }],
  },
  resolve: {
    extensions: ['', '.js'],
  },
  plugins: [
    new WebpackNotifierPlugin({
      alwaysNotify: true,
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      '__DEV__': true,
      'process.env.NODE_ENV': JSON.stringify('development'),
      VERSION: JSON.stringify(pkg.version),
    }),
  ],
  eslint: {
    configFile: _root + '/.eslintrc',
    emitError: true,
    emitWarning: false,
  },
};
