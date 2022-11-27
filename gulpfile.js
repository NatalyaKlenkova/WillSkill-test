const gulp = require('gulp');
const { src, dest, series, watch } = require('gulp');
const concat = require('gulp-concat');
const htmlMin = require('gulp-htmlmin');
const autoPrefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const svgSprite = require('gulp-svg-sprite');
const image = require('gulp-image');
const pug = require('gulp-pug');
const stylus = require('gulp-stylus');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify-es').default;
const notify = require('gulp-notify')
const browserSync = require('browser-sync').create();
const ghPages = require('gulp-gh-pages');

gulp.task('style', function () {
    return src('src/css/**/*.styl')
        .pipe(stylus())
        .pipe(concat('main.css'))
        .pipe(autoPrefixer({
            cascade: false
        }))
        .pipe(cleanCSS({
            level: 2
        }))
        .pipe(dest('dist/css'))
})

gulp.task('htmlCompile', function () {
    return src('src/**/*.pug')
        .pipe(pug({
            pretty: true
        }))
        .pipe(htmlMin({
            collapseWhitespace: true,
        }))
        .pipe(dest('dist'))
})

gulp.task('svgSprites', function () {
    return src('src/img/svg/**/*.svg')
        .pipe(svgSprite({
            mode: {
                stack: {
                    sprite: '../sprite.svg'
                }
            }
        }))
        .pipe(dest('dist/img'))
})

gulp.task('scripts', function () {
    return src([
        'src/js/components/**/*.js',
        'src/js/main.js'
    ])
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(concat('app.js'))
    .pipe(uglify().on('error', notify.onError()))
    .pipe(dest('dist/js'))
})

gulp.task('images', function () {
    return src([
        'src/img/**/*.jpg',
        'src/img/**/*.png',
        'src/img/*.svg',
        'src/img/**/*.jpeg'
    ])
        .pipe(image())
        .pipe(dest('dist/img'))
})

gulp.task('build', gulp.series(gulp.parallel('htmlCompile', 'style', 'svgSprites', 'scripts', 'images')));

gulp.task('watch', function(){
    gulp.watch('src/**/*.*', gulp.series('style'));
    gulp.watch('src/**/*.*', gulp.series('htmlCompile'));
    gulp.watch('src/img/svg/**/*.svg', gulp.series('svgSprites'));
    gulp.watch('src/js/**/*.js', gulp.series('scripts'));
  });

gulp.task('serve', function () {
    browserSync.init({
        server: 'dist'
    })

    browserSync.watch('dist/**/*.*').on('change', browserSync.reload);
});

gulp.task('tree', function(){
    return gulp.src('*.*',{read: false})
      .pipe(gulp.dest('./src'))
      .pipe(gulp.dest('./src/img'))
      .pipe(gulp.dest('./src/img/svg'))
      .pipe(gulp.dest('./src/css'))
      .pipe(gulp.dest('./dist'))
      .pipe(gulp.dest('./dist/css'))
      .pipe(gulp.dest('./dist/js'))
      .pipe(gulp.dest('./dist/fonts'))
      .pipe(gulp.dest('./dist/img'))
  })
  
  gulp.task('dev', gulp.series('tree', 'build', gulp.parallel('watch', 'serve')));

  gulp.task('deploy', function () {
    return gulp.src('./dist/**/*')
        .pipe(ghPages())
  })