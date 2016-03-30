/*
npm install --save-dev gulp gulp-typescript gulp-sourcemaps gulp-connect browserify reactify vinyl-source-stream vinyl-buffer
*/


"use strict";
var gulp = require("gulp");
var tsc = require("gulp-typescript");
var sourcemaps = require("gulp-sourcemaps");
var connect = require("gulp-connect"); // run a local dev server
//var buffer = require("vinyl-buffer");

var tsProject = tsc.createProject('tsconfig.json', { sortOutput: true });

var config = {
    port: "9055",
    devBaseUrl: "http://localhost", //'http://localhost'
    paths: {
        html: "./*.html",
        js: "./scripts/**/*.js",
        ts: "./**/*.ts",
        dist: "./dist",
        mainJs: "./scripts/app.js"
    }
}

gulp.task('compile-ts', function () {
    var tsResult = tsProject.src()//gulp.src()
        .pipe(sourcemaps.init())
        .pipe(tsc(tsProject));

    tsResult.dts.pipe(gulp.dest("./"));
    return tsResult.js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest("."))
        .pipe(connect.reload())
        ;
});


gulp.task("connect", ["compile-ts"],function () {
    connect.server({
        root: ['./'],
        port: config.port,
        base: config.devBaseUrl,
        livereload: true
    });
});

gulp.task("watch", function () {
    gulp.watch(config.paths.ts, ["compile-ts"]);
})

gulp.task("default", ["connect", "watch"]);
