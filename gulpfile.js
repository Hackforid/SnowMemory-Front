const gulp = require('gulp')
const webpack = require('webpack')
const rsync = require('gulp-rsync')
const gutil = require("gulp-util")
const path = require('path')
const clean = require('gulp-clean')


gulp.task('rsync', function() {
  const exclude = ['.*', '*.swp']
  return gulp.src(['src/static/**'])
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

gulp.task('clean', function () {
  return gulp.src('dist')
        .pipe(clean({force: true}))
})


gulp.task('build', ['clean', 'rsync'], function() {
  const conf = require('./build/webpack.prod.conf')
  console.log(JSON.stringify(conf))
  webpack(conf).run((err, stats)=>{
    if (err || stats.hasErrors()) {
      console.log(stats.toString({
        colors: true
      }))
    }
  })
})


gulp.task("dev", function(callback) {
  const express = require('express')
  const app = express()
  const history = require('connect-history-api-fallback')
  const config = require('./build/webpack.dev.conf')
  console.log(JSON.stringify(config))
  const compiler = webpack(config)
  var devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: config.output.publicPath,
    stats: {
      colors: true,
      chunks: false
    }
  })
  var hotMiddleware = require('webpack-hot-middleware')(compiler)

  compiler.plugin('compilation', function (compilation) {
    compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
      hotMiddleware.publish({ action: 'reload' })
      cb()
    })
  })

  app.use(devMiddleware)
  app.use(hotMiddleware)
  app.use(history({
    index: '/'
  }))
  app.use('/static', express.static('./src/static'))

  app.listen(8888, function (err) {
    if (err) {
      console.log(err)
      return
    }
    console.log('Listening at http://localhost:8888')
  })

})

