const webpack = require('webpack')

module.exports = {
  //插件项
  plugins: [],
  entry: {
    index : './src/main.js'
  },
  output: {
    path: 'dist/js',
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue'
      }
    ]
  },
  resolve: {
  }
};
