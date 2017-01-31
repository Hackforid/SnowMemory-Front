const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const FriendlyErrors = require('friendly-errors-webpack-plugin')

module.exports = {
  "module": {
    cache: true,
    "rules": [
      {
        "test": /\.vue$/,
        "loader": "vue-loader",
        "options": {
          loaders: {
            scss: 'vue-style-loader!css-loader!sass-loader' // <style lang="scss">
          }
        }
      },
      {
        "test": /\.css$/,
        "use": [
          {
            "loader": "style-loader"
          },
          {
            "loader": "css-loader"
          }
        ]
      },
      {
        "test": /\.scss$/,
        "use": [
          "style-loader",
          "css-loader?sourceMap",
          "sass-loader?sourceMap"
        ]
      },
      {
        "test": /\.js$/,
        "exclude": /(node_modules|bower_components)/,
        "loader": "babel-loader",
        "include": [
          "/Users/kleist/code/snowball/front/src"
        ],
        "options": {
          "babelrc": false,
          "cacheDirectory": true,
          "plugins": [
            [
              "transform-runtime",
              {
                "polyfill": false,
                "regenerator": true
              }
            ],
            [
              "component",
              [
                {
                  "libraryName": "element-ui",
                  "styleLibraryName": "theme-default"
                }
              ]
            ]
          ],
          "presets": [
            "es2015",
            "stage-0"
          ]
        }
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
        "loader": "file-loader"
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?\S*)?$/,
        "loader": "file-loader",
        "options": {
          "name": "[name].[ext]?[hash]"
        }
      }
    ]
  },
  "resolve": {
    "extensions": [
      ".js",
      ".vue",
      ".json"
    ],
    "alias": {
      "vue": "vue/dist/vue.js"
    }
  },
  "entry": {
    "index": [
      "/Users/kleist/code/snowball/front/src/index.js"
    ]
  },
  "output": {
    "path": "/Users/kleist/code/snowball/front/dist",
    "publicPath": "/",
    "filename": "[name].[hash].js"
  },
  devtool: 'source-map',
  "plugins": [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html',
      inject: true,
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new FriendlyErrors(),
  ]
}
