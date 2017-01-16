const HtmlWebpackPlugin = require('html-webpack-plugin')
const merge = require('webpack-merge')
const path = require('path')
const manifest = require('../config/manifest')
const config = require('../config')

const baseConfig = {
  module: {
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue'
      },
      {
        test: /\.scss$/,
        loaders: ["style-loader", "css-loader?sourceMap", "sass-loader?sourceMap"]
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        include: [
          config.src
        ],
        babelrc: false,
        query: {
          cacheDirectory: true,
          plugins: [
            ["transform-runtime", {
              "polyfill": false,
              "regenerator": true,
            }]
          ],
          presets: ['es2015', 'stage-0']
        }
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
    ]
  },
  resolve: {
    extensions: ['', '.js', '.vue', '.json'],
    alias: {
      'vue': 'vue/dist/vue.js',
    }
  },
  vue: {
    loaders: {
      scss: 'vue-style-loader!css-loader!sass-loader',
    }
  }
}

function getEntry() {
  const entry = {}
  manifest.js_files.forEach(e=>{
    entry[e.name] = [path.resolve(config.src, e.file)]
  })
  return entry
}

function getHtmlOutput() {
  const htmls = []
  manifest.html_files.forEach(e=>{
    htmls.push(new HtmlWebpackPlugin({
      filename: path.resolve(config.dist, e.name),
      template: path.resolve(config.src, e.file),
      inject: true,
      chunks: e.chunks,
    }))
  })
  return htmls
}

module.exports = merge(baseConfig, {
  entry: getEntry(),
  output: {
    path: path.resolve(config.dist, "../dist"),
    publicPath: "/",
    filename: "[name].[hash].js"
  },
  plugins: getHtmlOutput()
})
