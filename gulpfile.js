const gulp = require('gulp')
const webpack = require('webpack')
const webpackStream = require('webpack-stream')
const named = require('vinyl-named')
const rsync = require('gulp-rsync')
const gutil = require("gulp-util")
const WebpackDevServer = require("webpack-dev-server")
const FriendlyErrors = require('friendly-errors-webpack-plugin')
const server = require('gulp-server-livereload')
const path = require('path')




const targetFiles = ['main.js']

gulp.task("dev", ['watch'], function(callback) {
  gulp.src('dist')
  .pipe(server({
    livereload: true,
    directoryListing: true,
    opem: true
  }))
});

gulp.task('build:webpack', function () {
})

gulp.task('watch', ['watch:rsync', 'watch:webpack'], function() {
})

gulp.task('watch:webpack', function() {
  const entry = {
    entry: {
      main: ["babel-regenerator-runtime", "./src/main.js"]
    },
    output: {
      path: path.join(__dirname, "dist"),
      filename: "[name].js"
    },
    watch: true
  }
  const compiler = webpack(getConfig(entry))
  compiler.watch({
    aggregateTimeout: 300,
    poll: true
  }, function(err, stats) {
  })
})

gulp.task('watch:rsync', ['rsync'], function () {
  gulp.watch(['src/*.html', 'src/static/**'], ['rsync'])
})


function mapFiles(list, extname) {
  return list.map(function (app) {return 'src/' + app})
}

function getConfig(opt) {
  var config = {
    module: {
      cache: true,
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
          loader: 'babel-loader',
          babelrc: false,
          query: {
            cacheDirectory: true,
            plugins: [
              ["transform-runtime", {
                "polyfill": false,
                "regenerator": true
              }]
            ],
            presets: ['es2015', 'stage-0']
          }
        }
      ]
    }, devtool: 'source-map',
    resolve: {
      extensions: ['', '.js', '.vue', '.json'],
      alias: {
        'vue': 'vue/dist/vue.js'
      }
    },
    vue: {
      loaders: {
        scss: 'vue-style-loader!css-loader!sass-loader'
      }
    },
    plugins: [
      new webpack.optimize.OccurrenceOrderPlugin(),
      //new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
      new FriendlyErrors()
    ],
    externals: [
      /^babel-runtime/
    ]
  }
  if (!opt) {
    return config
  }
  for (var i in opt) {
    config[i] = opt[i]
  }
  return config
}

gulp.task('rsync', function() {
  const exclude = ['.*', '*.swp']
  return gulp.src(['src/*.html', 'src/static/**'])
    .pipe(rsync({
      root: 'src/',
      destination: 'dist/',
      exclude: exclude,
      include: ['*.min.js', '*.min.css'],
      recursive: true,
      clean: true,
      times: true,
      update: true
    }))
    .on('error', function(e) {
      console.log('>>> ERROR', e);
      this.emit('end');
    })
})


