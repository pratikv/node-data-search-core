"use strict";
var gulp = require("gulp");
var tsc = require("gulp-typescript");
var sourcemaps = require("gulp-sourcemaps");
var connect = require("gulp-connect"); // run a local dev server

var tsProject = tsc.createProject('tsconfig.json', { sortOutput: true });

var config = {
    port: "9055",
    devBaseUrl: "http://localhost", //'http://localhost'
    paths: {
        html: "./*.html",
        js: "./scripts/**/*.js",
        ts: "./**/*.ts",
        dist: "./dist",
        mainJs: "./src/app.js"
    }
}

gulp.task('compile-ts', function() {
    var errors = 0;
    var tsResult = tsProject.src()//gulp.src()
        .pipe(sourcemaps.init())
        .pipe(tsc(tsProject))
        .on("error", function() {
            errors++;
        })
        .on("finish", function() {
            if (errors !== 0) {
                console.error("Typescript error(s) found. Build Failed");
                process.exit(1);
            }
        });

    tsResult.dts.pipe(gulp.dest("./"));
    return tsResult.js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest("./"));

    //    var tsResult = tsProject.src()//gulp.src()
    //        .pipe(sourcemaps.init())
    //        .pipe(tsc(tsProject));
    //
    //    tsResult.dts.pipe(gulp.dest("./"));
    //    return tsResult.js
    //        .pipe(sourcemaps.write('.'))
    //        .pipe(gulp.dest("."))
    //        .pipe(connect.reload());
});


gulp.task("connect", ["compile-ts"], () => {
    connect.server({
        root: ['./'],
        port: config.port,
        base: config.devBaseUrl,
        livereload: true
    });
});

gulp.task("watch", () => {
    gulp.watch(config.paths.ts, ["compile-ts"]);
})

gulp.task("default", ["connect", "watch"]);
