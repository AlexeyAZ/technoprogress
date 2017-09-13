const properties = {
    folders: {
      build: 'build',
      src: 'src',
    }
}

const plugins = {
    js: [
        'bower_components/jquery/dist/jquery.min.js',
        'bower_components/swiper/dist/js/swiper.min.js',
    ],
    css: [
        'bower_components/reset-css/reset.css',
        'bower_components/swiper/dist/css/swiper.min.css',
    ]
}

const gulp = require('gulp'),
    connect = require('gulp-connect')
    bs = require("browser-sync").create(),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    pug = require('gulp-pug'),
    sass = require('gulp-sass'),
    prefix = require('gulp-autoprefixer'),
    babel = require('gulp-babel'),
    watch = require('gulp-watch'),
    svgSprite = require('gulp-svg-sprite'),
    svgmin = require('gulp-svgmin'),
    cheerio = require('gulp-cheerio'),
    replace = require('gulp-replace'),
    typograf = require('gulp-typograf'),
    eslint = require('gulp-eslint'),
    devip = require('dev-ip'),
    webpack = require("webpack-stream");

const filesList = ["img", "video", "fonts", "json"];


console.log("ip list: " + devip()); // show all ip list. Need for browsersynv host option

function onError(err) {
    console.log(err);
    this.emit('end');
}

gulp.task('browserSync', function() {
  bs.init({
    server: {
      baseDir: "./build"
    },
    //port: 8080,
    open: true,
    notify: false,
    https: true
  });
});

gulp.task('lint', function () {
    return gulp.src(properties.folders.src + '/scripts/**/*.*')
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('scripts', function() {
    return gulp.src([properties.folders.src + '/scripts/app.js'])
        .pipe(webpack({
            module: {
                rules: [
                    { 
                        test: /\.js$/, 
                        exclude: /(node_modules|bower_components|vendor.js)/, 
                        loader: "babel-loader"
                    }
                ]
            },
            output: {
                filename: 'app.js',
            },
            devtool: 'source-map'
        }))
        .pipe(gulp.dest(properties.folders.build + '/scripts'))
        .pipe(bs.stream());
});

gulp.task('vendor', function () {
    gulp.src(plugins.css)
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest(properties.folders.build + '/styles/'));
    gulp.src(plugins.js)
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest(properties.folders.build + '/scripts/'));
});

gulp.task('pug', function() {
    gulp.src(properties.folders.src + '/views/pages/*.pug')
          .pipe(pug({}))
    .on('error', onError)
    .pipe(gulp.dest(properties.folders.build))
    .on('end', function(){
        gulp.src(properties.folders.build + '/**/*.html')
            .pipe(typograf({
                locale: ['ru', 'en-US'],
                enableRule: ["common/nbsp/afterNumber"],
                disableRule: ["ru/other/phone-number"]
            }))
            .pipe(gulp.dest(properties.folders.build))
            .pipe(bs.stream({once: true}));
    });
});

gulp.task('sass', function () {
    gulp.src(properties.folders.src + '/styles/main.scss')
    .pipe(sourcemaps.init())
		.pipe(sass.sync().on('error', sass.logError))
		.pipe(prefix("last 3 version", "> 1%", "ie 8", "ie 7"))
    .pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(properties.folders.build + '/styles'))
        .pipe(bs.stream());
});


gulp.task('files', function () {

    let moveFiles = (arr, el) => {
        
        if (el) {
            gulp.src(properties.folders.src + '/' + el + '/**/*.*')
                .pipe(gulp.dest(properties.folders.build + '/' + el))
        } else {
            arr.forEach((el) => {

                gulp.src(properties.folders.src + '/' + el + '/**/*.*')
                    .pipe(gulp.dest(properties.folders.build + '/' + el))
            });
        }
    }

    moveFiles(filesList);
});



gulp.task('svgSpriteBuild', function () {
	  return gulp.src(properties.folders.src + '/img/**/*.svg')
    // minify svg
    .pipe(svgmin({
        js2svg: {
            pretty: true
        }
    }))
    // remove all fill, style and stroke declarations in out shapes
    .pipe(cheerio({
        run: function ($) {
            $('[fill]').removeAttr('fill');
            $('[stroke]').removeAttr('stroke');
            $('[style]').removeAttr('style');
        },
        parserOptions: {xmlMode: true}
    }))
    // cheerio plugin create unnecessary string '&gt;', so replace it.
    .pipe(replace('&gt;', '>'))
    // build svg sprite
    .pipe(svgSprite({
        mode: {
            symbol: {
                sprite: "../sprite.svg",
                render: {
                    scss: {
                        dest: '../../styles/_sprite.scss',
                        template: properties.folders.src + "/styles/svg-templates/_sprite_template.scss"
                    }
                }
            }
        }
    }))
    .pipe(gulp.dest(properties.folders.src + '/sprite/'));
});


gulp.task('server', function() {
    connect.server({
        port: properties.port,
        root: properties.folders.build,
        livereload: true
    });
});


gulp.task('build', [
    'pug',
    'sass',
    'scripts',
    'lint',
    'vendor',
    'files',
    'svgSpriteBuild'
]);

gulp.task('watch', function() {

    watch(properties.folders.src + '/views/**/*.pug', function() {
        gulp.start('pug');
    });
    
    watch(properties.folders.src + '/styles/**/*.scss', function() {
        gulp.start('sass');
    });

    watch(properties.folders.src + '/scripts/**/*.js', function() {
        gulp.start(['lint', 'scripts']);
    });

    watch(filesList.map(function(el) {return (properties.folders.src + '/' + el + '/**/*.*')}), function() {
        gulp.start('files');
    });

    watch(properties.folders.src + '/img/slide5/**/*.svg', function() {
        gulp.start('svgSpriteBuild');
    });
});

gulp.task('default', ['lint', 'build', 'browserSync', 'watch']);
