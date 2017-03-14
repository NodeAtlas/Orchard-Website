/* jshint node: true */
var gulp = require('gulp'),
	browserSync = require('browser-sync'),
	nodemon = require('gulp-nodemon');

gulp.task('default', ['browser-sync']);

gulp.task('browser-sync', ['nodemon'], function() {
	browserSync.init(null, {
		proxy: "http://localhost:7777",
        files: ["views/**", "assets/**", "variations/**"],
        port: 57777,
	});
});
gulp.task('nodemon', function (next) {
	var started = false;

	return nodemon({
		script: 'server.en-us.na',
		ext: 'js json',
		ignore: ['gulpfile.js', 'variations/**', 'views/**', 'assets/**']
	}).on('restart', function() {
		setTimeout(function () {
			browserSync.reload();
		}, 500);
	}).on('start', function () {
		if (!started) {
			next();
			started = true; 
		} 
	});
});