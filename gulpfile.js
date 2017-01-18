var gulp = require('gulp');
var util = require('gulp-util');
var rename = require("gulp-rename");
//concatenar
var concat = require('gulp-concat');
//minify
var uglify = require('gulp-uglify');
//para o unglify funcionar no angular
var ngAnnotate = require('gulp-ng-annotate');
var autoprefixer = require('gulp-autoprefixer');
var cssnano = require('gulp-cssnano');
var concatCss = require('gulp-concat-css');
//Otimiza as imagens
var imagemin = require('gulp-imagemin');

var shell = require('gulp-shell');

// Compacta os js presentes na pasta app/ e minifica
// desconsidera os arquivos dentro de js/vendor
gulp.task('js', function () {
  return gulp.src('app/**/*.js', {
      base: './'
    })
    .pipe(concat('dashboard.js'))
    .pipe(gulp.dest('js/'))
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(rename('dashboard.min.js'))
    .pipe(gulp.dest('js/'));
});
//Reduz o tamanho das imagens dentro de /image
gulp.task('image', function () {
  return gulp.src('image/*', {
      base: './'
    })
    .pipe(imagemin());
});

gulp.task('css', function () {
  return gulp.src('app/**/*.css', {
      base: './'
    })
    .pipe(concatCss('style.css'))
    .pipe(autoprefixer({
      browsers: ['> 1%', 'ie 7', 'ie 8'],
      cascade: false
    }))
    .pipe(gulp.dest('css/'))
    .pipe(cssnano())
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('css/'));
});

gulp.task('docs', shell.task([
  'node node_modules/jsdoc/jsdoc.js ' +
  '-c ./node_modules/angular-jsdoc/common/conf.json ' +
  '-t ./node_modules/angular-jsdoc/angular-template ' +
  '-d ./docs ' +
  './README.md ' +
  '-r ./js/dashboard.js'
]));

gulp.task('watch', function () {
  gulp.watch(['app/**/*.js'], ['js']);
  gulp.watch(['image/*'], ['image']);
  gulp.watch(['app/**/*.css'], ['css']);
});