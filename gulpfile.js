'use strict';

var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')({
        DEBUG: false,
        lazy: true,
        rename: {
            'gulp-autoprefixer': 'prefixer',
            'gulp-angular-templatecache': 'templateCache',
            'gulp-html-replace': 'replace',
            'gulp-version-tag': 'versionTag',
            'gulp-css-str2base64': 'str2base64',
            'gulp-image-optimization': 'imageop'
        }
    }),
    del = require('del'),
    gutil = require('gulp-util'),
    mainBowerFiles = require('main-bower-files'),
    mergeStream = require('merge-stream'),
    browserSync = require('browser-sync'),
    spa = require('browser-sync-spa'),
    reload = browserSync.reload,
    notifier = require('node-notifier');

// тип сборки. Если --prod, то файлы минифицируются
var prod = (gutil.env.prod);

// Имя проекта по умолчанию. Задается как --project=<name>
var project = (gutil.env.project) ? gutil.env.project : "app";

var base = 'src/';
// var sourceRoot = base + project + '/';

// webserver config
var config = {
    server: {
        baseDir: "./public"
    },
    open: false,
    host: "localhost",
    tunnel: false,
    port: 9000,
    logPrefix: "CW_daemon"
};

// Pathes
var sources = {
    main: {
        idx: base + 'index.pug',
        compile: base + "app/**/**.*",
        json: [
            base + 'json/**.json'
        ],
        styles: base + 'scss/main.scss',
        vendor: base + 'scss/vendor.scss',
        img: base + 'img/**',
        fonts: [
            'bower_components/roboto-fontface/fonts/**/**.*'
        ]
    }
};

var build = {
    idx: 'public/',
    compile: 'public/app',
    json: 'public/json/',
    styles: 'public/css/',
    img: 'public/img/',
    fonts: 'public/fonts/'
};

// Changes monitoring
gulp.task('watch', function () {
    gulp.watch(sources.main.idx, ['build:index']);
    gulp.watch(sources.main.compile, ['build:compile']);
    gulp.watch(sources.main.json, ['build:json']);
    gulp.watch([sources.main.styles, base + 'scss/styles/*.*'], ['build:css']);
    gulp.watch(sources.main.img, ['build:images']);
});

gutil.log(
    prod
        ? gutil.colors.yellow("WARNING!")
        : gutil.colors.gray("Hi!"),
    gutil.colors.green("We compile project"),
    gutil.colors.red(project),
    gutil.colors.gray("["),
    prod
        ? gutil.colors.red("Production build")
        : gutil.colors.gray("Dev build"),
    gutil.colors.gray("]")
);

var sendMessage = function(message) {
    gutil.log( gutil.colors.green(message) );

    notifier.notify({
        title: 'Gulp notification',
        message: message,
        onLast: true
    })
};

// На сервере собирается только редактор. Остальное в ручном режиме
gulp.task('default', plugins.sequence('vendor', 'build'));

// При разработке делаем полный перекомпил каждый раз
gulp.task('run', plugins.sequence('clean', 'vendor', 'build', 'webserver', 'watch'));

// Start Webserver
gulp.task('webserver', function () {
    browserSync.use(spa({
        selector: "[ng-app]"
    }));
    browserSync.init(config);
});

gulp.task('bump', function () {
    return gulp.src(['./bower.json', './package.json'])
    //.pipe(plugins.bump({type: 'major'}))  // x.0.0
    //.pipe(plugins.bump({type: 'minor'}))  // 0.x.0
        .pipe(plugins.bump({type: 'patch'}))    // 0.0.x
        .pipe(gulp.dest('./'))
});

// Компилим все шаблоны и JS
gulp.task('build:compile', function () {
    var options = {
        'module': 'cwm.templates',
        'templateHeader': 'angular.module("<%= module %>"<%= standalone %>, []).run(["$templateCache", function($templateCache) {'
    };

    var jsStream = gulp.src(sources.main.compile)
        .pipe(plugins.filter(['**/*.js']));

    var tplStream = gulp.src(sources.main.compile)
        .pipe(plugins.filter(['**/*.pug']))
        .pipe(plugins.pug({basedir: './src/app/'}))
        .pipe(prod ? plugins.htmlmin({collapseWhitespace: true}) : gutil.noop())
        .pipe(plugins.templateCache('app.min.js', options));

    return mergeStream(jsStream, tplStream)
        .pipe(plugins.concat('app.min.js'))
        .pipe(plugins.ngAnnotate())
        .pipe(prod ? plugins.uglify() : gutil.noop())
        .pipe(gulp.dest(build.compile))
        .pipe(reload({stream: true}));
});
// Собираем изображения
gulp.task('build:images', function () {
    return gulp.src(sources.main.img)
        .pipe(prod ? plugins.imagemin({
            optimizationLevel: 5,
            progressive: true,
            interlaced: true
        }) : gutil.noop())
        .pipe(gulp.dest(build.img))
        .pipe(reload({stream: true}));
});
// Собираем CSS
gulp.task('build:css', function () {
    return gulp.src(sources.main.styles)
        .pipe(plugins.sass({
                style: 'compressed'
            })
                .on("error", plugins.notify.onError(function (error) {
                    return "Error: " + error.message;
                }))
        )
        .pipe(plugins.concatCss('style.min.css'))
        .pipe(plugins.prefixer())
        .pipe(prod ? plugins.csso() : gutil.noop())
        .pipe(gulp.dest(build.styles))
        .pipe(reload({stream: true}));
});

gulp.task('build:json', function () {
    return gulp.src(sources.main.json)
        .pipe(prod ? plugins.jsonminify() : gutil.noop())
        .pipe(gulp.dest(build.json))
        .pipe(reload({stream: true}));
});

// index.html строится отдельно
gulp.task('build:index', function () {
    return gulp.src(sources.main.idx)
        .pipe(plugins.pug({pretty: true}))
        .pipe(prod ? plugins.htmlmin({collapseWhitespace: true}) : gutil.noop())
        .pipe(gulp.dest(build.idx))
        .pipe(reload({stream: true}));
});

// Сборка проекта
gulp.task('build', function(done) {
    plugins.sequence(['build:compile', 'build:images', 'build:css', 'build:json'], 'build:index', function(){
        done();
        sendMessage('Build Finished');
    })
});

// Bower update
gulp.task('bower:update', function () {
    return plugins.bower();
});
// Bower: JS
gulp.task("vendor:js", function () {
    return gulp.src(mainBowerFiles())
        .pipe(plugins.filter('**/*.js'))
        .pipe(plugins.concat('vendor.min.js'))
        .pipe(prod ? plugins.uglify() : gutil.noop())
        .pipe(gulp.dest(build.compile));
});
// Bower: CSS
gulp.task("vendor:css", function () {
    var vendorFiles = mainBowerFiles();
    vendorFiles.push(sources.main.vendor);
    var sassStream = gulp.src(vendorFiles)
        .pipe(plugins.filter('**/*.scss'))
        .pipe(plugins.sass({
                style: 'compressed'
            }).on("error", plugins.notify.onError(function (error) {
                return "Error: " + error.message;
            }))
        );

    var cssStream = gulp.src(mainBowerFiles()).pipe(plugins.filter('**/*.css'));

    return mergeStream(sassStream, cssStream)
        .pipe(plugins.concatCss('vendor.min.css', {rebaseUrls: false}))
        .pipe(plugins.prefixer())
        .pipe(prod ? plugins.csso() : gutil.noop())
        .pipe(gulp.dest(build.styles));
});
// Bower: Fonts
gulp.task("vendor:fonts", function () {
    return gulp.src(sources.main.fonts)
        .pipe(gulp.dest(build.fonts));
});
// сборка vendor
gulp.task('vendor', function(done) {
    plugins.sequence(['vendor:css', 'vendor:js', 'vendor:fonts'], function(){
        done();
        sendMessage('Vendor compiled!');
    })
});

// Красивая зачистка папок
gulp.task('clean', function () {
    return del([
        build.compile,
        build.styles,
        build.img,
        build.fonts
    ]).then(function(paths) {
        if(paths.length > 0) {
            gutil.log(
                gutil.colors.green('Next old files removed:') + "\n",
                gutil.colors.gray(paths.join("\n "))
            );
        }
    });
});