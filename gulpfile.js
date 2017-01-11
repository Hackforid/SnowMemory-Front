const gulp = require('gulp')
const webpack = require('gulp-webpack')
const named = require('vinyl-named')
const syncy = require('syncy')


const targetFiles = ['main.js']

gulp.task('build', function () {
  return gulp.src(mapFiles(targetFiles))
          .pipe(named())
          .pipe(webpack())
          .pipe(gulp.dest('dist/'))
})

gulp.task('watch', ['sync:watch', 'webpack:watch'])

gulp.task('webpack:watch', function() {
  return null
  gulp.src(mapFiles(targetFiles))
          .pipe(named())
          .pipe(webpack({watch: true}))
          .pipe(gulp.dest('dist/'))
})

gulp.task('sync:watch', function () {
  gulp.watch('src/*.html, src/static/**', ['sync'])
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
gulp.task('sync', function() {
  syncFile()
})

function syncFile() {
  syncy(['src/*.html', 'src/static/**'], 'dist',
    {base: 'src',
      updateAndDelete: false
    })
    .then(() => {
      console.log('Done!');
    })
    .catch(console.error);
}
