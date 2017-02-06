const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const merge = require('webpack-merge')
const path = require('path')
const manifest = require('../config/manifest')
const config = require('../config')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const baseConfig = {
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            scss: 'vue-style-loader!css-loader!sass-loader'
          }
        }
      },
      {
        test: /\.css$/,
        use: [{loader:'style-loader'}, {loader:'css-loader'}]
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader?sourceMap", "sass-loader?sourceMap"]
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        include: [
          config.src
        ],
        options: {
          babelrc: true,
          cacheDirectory: true,
          plugins: [
            ["transform-runtime", {
              "polyfill": false,
              "regenerator": true,
            }],
            ["component", [
              {
                "libraryName": "element-ui",
                "styleLibraryName": "theme-default"
              }
            ]]
          ],
          presets: [["es2015", { "modules": false }], 'stage-0']
        }
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
        loader: 'file-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?\S*)?$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      },
    ]
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
  },
  plugins: [
    new ExtractTextPlugin({
      filename: "bundle.css",
      disable: false,
      allChunks: true,
    }),
    //new webpack.optimize.CommonsChunkPlugin({
          //name: 'vendor',
    //}),
  ]
}

function getEntry() {
  const entry = {}
  manifest.js_files.forEach(e=>{
    entry[e.name] = [path.resolve(config.src, e.file)]
  })
  //entry['vendor'] = ['vue', 'element-ui']
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
      favicon: false,
      minify: {
        removeComments: true,
        collapseWhitespace: false
      },
    }))
  })
  return htmls
}

module.exports = merge(baseConfig, {
  entry: getEntry(),
  output: {
    path: path.resolve(config.dist, "../dist/"),
    publicPath: "/",
    filename: "static/[name].[hash].js"
  },
  plugins: getHtmlOutput()
})
