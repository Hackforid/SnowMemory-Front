const gulp = require('gulp')
const webpack = require('gulp-webpack')
const named = require('vinyl-named')
const rsync = require('gulp-rsync')



const targetFiles = ['main.js']

gulp.task('build', function () {
  return gulp.src(mapFiles(targetFiles))
          .pipe(named())
          .pipe(webpack(getConfig()))
          .pipe(gulp.dest('dist/'))
})

gulp.task('watch', ['watch:rsync', 'watch:webpack'], function() {
})

gulp.task('watch:webpack', function() {
  gulp.src(mapFiles(targetFiles))
          .pipe(named())
          .pipe(webpack(getConfig({watch: true})))
          .pipe(gulp.dest('dist/'))
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
      loaders: [
        { test: /\.vue$/, loader: 'vue',
          options: {
            loaders: {
              scss: 'vue-style-loader!css-loader!sass-loader',
              sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
            }
          }
        },
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'babel-loader',
          query: {
            presets: ['es2015']
          }
        }
      ]
    },
    devtool: 'source-map'
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
      times: true,
      update: true
    }))
    .on('error', function(e) {
      console.log('>>> ERROR', e);
      this.emit('end');
    })
})


