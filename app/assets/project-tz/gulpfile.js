'use strict';

    var gulpVersion = '4';

    var gulp = require('gulp'),
        mainBowerFiles = require('main-bower-files'),
        watch = require('gulp-watch'),
        prefixer = require('gulp-autoprefixer'),
        uglify = require('gulp-uglify'),
        sourcemaps = require('gulp-sourcemaps'),
        sass = require('gulp-sass'),
        cleanCSS = require('gulp-clean-css'),
        imagemin = require('gulp-imagemin'),
        pngquant = require('imagemin-pngquant'),
        rimraf = require('rimraf'),
        browserSync = require("browser-sync"),
        reload = browserSync.reload;

    var path = {
    libs: {
        js: 'app/js/libs/',
        css: 'app/css/libs/'
    },
    dist: {
        html: 'dist/',
        js: 'dist/js/',
        scss: 'dist/css/',
        css: 'dist/css/',
        img: 'dist/img/',
        fonts: 'dist/fonts/'
    },
    app: {
        html: 'app/*.html',
        js: 'app/js/*.js',
        scss: 'app/css/*.scss',
        css: 'app/css/*.css',
        img: 'app/img/**/*.*',
        fonts: 'app/fonts/**/*.*'
    },
    watch: {
        html: 'app/**/*.html',
        js: 'app/js/**/*.js',
        scss: 'app/css/**/*.scss',
        css: 'app/css/**/*.css',
        img: 'app/img/**/*.*',
        fonts: 'app/fonts/**/*.*'
    },
    clean: './dist'
};

gulp.task('webserver', function () {
    browserSync({
        server: {
            baseDir: './dist'
        },
        tunnel: false,
        host: 'localhost',
        port: 4013,
        logPrefix: "W3DZ"
    })
});

gulp.task('libsJs:build', function () {
    gulp.src( mainBowerFiles('**/*.js') )
        .pipe(gulp.dest(path.libs.js))
        .pipe(gulp.dest(path.dist.js))
});

gulp.task('libsCss:build', function () {
    gulp.src( mainBowerFiles('**/*.css') )
        .pipe(gulp.dest(path.libs.css))
        //.pipe(gulp.dest(path.dist.css))
});

gulp.task('html:build', function () {
    gulp.src(path.app.html)
        .pipe(gulp.dest(path.dist.html))
        .pipe(reload({stream: true}));
});

gulp.task('js:build', function () {
    gulp.src(path.app.js)
        .pipe(sourcemaps.init())       
        .pipe(uglify({
            toplevel: true
        }))
        .pipe(sourcemaps.write())        
        .pipe(gulp.dest(path.dist.js))
        .pipe(reload({stream: true}));
});

gulp.task('scss:build', function () {
    gulp.src(path.app.scss)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(prefixer({
            browsers: ['> 0.01%'],
            cascade: false
        }))
        .pipe(cleanCSS({
            level:2
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.dist.scss))
        .pipe(reload({stream: true}));
});

gulp.task('css:build', function () {
    gulp.src(path.app.css)
        .pipe(sourcemaps.init())
        .pipe(cleanCSS({
            level:2
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.dist.css))
        .pipe(reload({stream: true}));
});

gulp.task('image:build', function () {
    gulp.src(path.app.img)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.dist.img))
        .pipe(reload({stream: true}));
});

gulp.task('fonts:build', function() {
    gulp.src(path.app.fonts)
        .pipe(gulp.dest(path.dist.fonts))
});

if (gulpVersion == 3) {
    
    gulp.task('build', [
        'libsCss:build',
        'libsJs:build',
        'html:build',
        'js:build',
        'scss:build',
        'css:build',
        'fonts:build',
        'image:build'
    ]);

    gulp.task('watch', function(){
        watch([path.watch.html], function(event, cb) {
            gulp.start('html:build');
        });
        watch([path.watch.scss], {readDelay: 1000}, function(event, cb) {
            gulp.start('scss:build');
        });
        watch([path.watch.css], function(event, cb) {
            gulp.start('css:build');
        });
        watch([path.watch.js], function(event, cb) {
            gulp.start('js:build');
        });
        watch([path.watch.img], function(event, cb) {
            gulp.start('image:build');
        });
        watch([path.watch.fonts], function(event, cb) {
            gulp.start('fonts:build');
        });
    });

    gulp.task('clean', function (cb) {
        rimraf(path.clean, cb);
    });

    gulp.task('default', ['build', 'webserver', 'watch']);
}

if (gulpVersion == 4) {

    gulp.task('build', gulp.parallel (
        'libsCss:build',
        'libsJs:build',
        'html:build',
        'js:build',
        'scss:build',
        'css:build',
        'fonts:build',
        'image:build'
    ));

    gulp.task('watch', function(){
        watch([path.watch.html], gulp.parallel('html:build'));
        watch([path.watch.scss], {readDelay: 1000}, gulp.parallel('scss:build'));
        watch([path.watch.css], gulp.parallel('css:build'));
        watch([path.watch.js], gulp.parallel('js:build'));
        watch([path.watch.img], gulp.parallel('image:build'));
        watch([path.watch.fonts], gulp.parallel('fonts:build'));
    });

    gulp.task('clean', function (cb) {
        rimraf(path.clean, cb);
    });

    gulp.task('default', gulp.parallel('build', 'watch', 'webserver'));
}