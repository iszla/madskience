/// <reference path="typings/tsd.d.ts" />

var gulp = require('gulp');
var typescript = require('gulp-tsc');

gulp.task('compile', function () {
	gulp.src(['ts/app.ts'])
	.pipe(typescript())
	.pipe(gulp.dest('js/'))
});

gulp.task('watch', function () {
	gulp.watch('ts/*.ts', ['compile']);
});