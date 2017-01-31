const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.conf')
const webpack = require('webpack')

module.exports = merge(baseConfig, {
  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
  ]
})
