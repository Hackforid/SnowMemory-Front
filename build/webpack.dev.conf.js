const merge = require('webpack-merge')
const FriendlyErrors = require('friendly-errors-webpack-plugin')
const webpack = require('webpack')

const baseConfig = require('./webpack.base.conf.js')

Object.keys(baseConfig.entry).forEach(function (name) {
  baseConfig.entry[name] = ['webpack-hot-middleware/client'].concat(baseConfig.entry[name])
})


module.exports = merge(baseConfig, {
  module: {
    cache: true,
  },
  devtool: 'source-map',
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new FriendlyErrors(),
  ],
})
