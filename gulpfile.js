var gulp = require('gulp');
var util = require('gulp-util');
//concatenar
var concat = require('gulp-concat');
//minify
var uglify = require('gulp-uglify');
//para o unglify funcionar no angular
var ngAnnotate = require('gulp-ng-annotate');

// Compacta os js presentes na pasta js/ e minifica
// desconsidera os arquivos dentro de js/vendor
// descosidera o arquivo js/dashboard.min.js ( que eh o resultado dessa tarefa)
gulp.task('scripts', function () {
  return gulp.src(['js/**/*.js', '!js/dashboard.min.js', '!js/vendor/*.js'])
    .pipe(concat('dashboard.min.js'))
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(gulp.dest('js/'));
});

// Observa as modificacoes nos arquivos dentro de js/
// e aplica a tarefa scripts
gulp.task('scripts-watch', function () {
  gulp.watch(['js/**/*.js', '!js/dashboard.min.js', '!js/vendor/*.js'], ['scripts']);
});