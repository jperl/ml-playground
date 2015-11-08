'use strict';

var babel = require('gulp-babel');
var concat = require('gulp-concat');
var eslint = require('gulp-eslint');
var gulp = require('gulp');
var shell = require('gulp-shell')
var sourcemaps = require('gulp-sourcemaps');

gulp.task('lint', function () {
  return gulp.src(['src/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('build', function () {
  return gulp.src('src/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['es2015'],
      plugins: ['transform-runtime', 'transform-strict-mode', 'transform-async-to-generator']
    }))
    .pipe(concat('all.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist'));
});

gulp.task('crawl', ['build'], shell.task('node dist/all.js'));

gulp.task('default', ['crawl']);

// gulp.task('watch', function () {
//   gulp.watch('src/js/**/*.js', ['browserify']);
// });
