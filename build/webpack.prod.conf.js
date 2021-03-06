const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.conf')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const config = require('../config')
const path = require('path')
const CompressionWebpackPlugin = require('compression-webpack-plugin')

class CDNPlugin {
  apply(compiler) {
    compiler.plugin('compilation', function(compilation) {

    compilation.plugin('html-webpack-plugin-after-html-processing', function(htmlPluginData, callback) {
      let html = htmlPluginData.html
      html = html.replace(/(src=")(.*?\.js)(")/g, "$1//ojgpsx1q3.bkt.clouddn.com$2$3")
      htmlPluginData.html = html
      callback(null, htmlPluginData);
    });
  });
  }
}

module.exports = merge(baseConfig, {
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.common.js'
    }
  }, module: {
    rules: [
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"' }
    }),
    new webpack.optimize.UglifyJsPlugin({
      comments: false, 
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    new CompressionWebpackPlugin({ //gzip 压缩
        asset: '[path].gz[query]',
        algorithm: 'gzip',
        test: new RegExp(
            '\\.(js|css|html)$'    //压缩 js 与 css
        ),
        threshold: 10240,
        minRatio: 0.8
    }),
    new CDNPlugin(),
  ]
})
