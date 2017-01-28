"use strict"

const gulp = require('gulp');
const runSequence = require('run-sequence');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const image = require('gulp-image');
const rename = require("gulp-rename");
const gulpCopy = require('gulp-copy');
const concat = require('gulp-concat-util');
const minify = require('gulp-minify-css');
const gutil = require('gulp-util');
const critical = require('critical').stream;
const autoprefixer = require('gulp-autoprefixer');
const cachebust = require('gulp-cache-bust');
const clean = require('gulp-clean');
const awspublish = require('gulp-awspublish');
const awspublishRouter = require("gulp-awspublish-router");
const cloudfront = require('gulp-cloudfront-invalidate-aws-publish');

// Clean out the dist folder
gulp.task('clean', () => {
  return gulp.src('./dist/', {
    read: false,
    force: true
  })
  .pipe(clean());
});

// Copy files
gulp.task('copy', () => {
   return gulp.src([
     'src/*.html',
     'src/*.xml',
     'src/*.json',
     'src/*.ico',
     'src/*.png',
     'src/*.svg'
   ])
   .pipe(gulp.dest('dist'));
});

// SASS compile
gulp.task('sass', () => {
  // Autoprefixer configuration
  var autoprefixerOptions = {
    browsers: [
      'last 2 versions',
      '> 5%',
      'Firefox ESR'
    ]
  };

  return gulp
    .src('src/assets/scss/**/*.scss')
    // .pipe(sourcemaps.init())
    .pipe(sass({
      errLogToConsole: true,
      outputStyle: 'compressed',
      includePaths: [
        'node_modules/foundation-sites/_vendor',
        'node_modules/foundation-sites/scss',
        'node_modules/animate-sass'
      ]
    }))
    .on('error', sass.logError)
    .pipe(autoprefixer(autoprefixerOptions))
    // .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/assets/css'))
  ;
});

// Minify images
gulp.task('image', () => {
  return gulp.src('src/assets/image/*')
    .pipe(image())
    .pipe(gulp.dest('dist/assets/image'));
});

// Generate & Inline Critical-path CSS
gulp.task('critical', () => {
  return gulp.src('dist/*.html')
    .pipe(critical({
      base: 'dist/',
      inline: true,
      css: [
        'dist/assets/css/style.css'
      ],
      minify: true
    }))
    .on('error', (err) => {
      gutil.log(gutil.colors.red(err.message));
    })
    .pipe(gulp.dest('dist'));
});

// Publish files to S3
gulp.task("cachebuster", () => {
  gulp.src('dist/*.html')
    .pipe(cachebust({
      type: 'timestamp'
    }))
    .pipe(gulp.dest('dist'));
});

// Publish files to S3
gulp.task("publish", () => {

  // AWS configuration
  var publisher = awspublish.create(require('./aws-credentials.json'));

  gulp.src("dist/**/*", { cwd: "." })
    .pipe(awspublishRouter({
      cache: {
        // cache for 5 minutes by default
        cacheTime: 300
      },
      routes: {
        "^assets/(?:.+)\\.(?:js|css|svg|ttf)$": {
          // don't modify original key. this is the default
          key: "$&",
          // use gzip for assets that benefit from it
          gzip: true,
          // cache static assets for 20 years
          cacheTime: 630720000
        },
        "^assets/.+$": {
          // cache static assets for 20 years
          cacheTime: 630720000
        },
        // pass-through for anything that wasn't matched by routes above, to be uploaded with default options
        "^.+$": "$&"
      }
    })
  )
  .pipe(publisher.publish())
  .pipe(publisher.sync())
  .pipe(awspublish.reporter())
});

gulp.task('invalidate', () => {
  // AWS configuration
  var publisher = awspublish.create(require('./aws-credentials.json'));

  return gulp.src('dist/**/*')
    .pipe(publisher.publish({
      'Cache-Control': 'max-age=315360000, no-transform, public'
    }))
    .pipe(cloudfront({
      distribution: publisher.config.cloudfront.distribution,
      wait: true,
      indexRootPath: true
    }))
    .pipe(publisher.cache())
    .pipe(awspublish.reporter());
});

// Watch tasks
gulp.task('watch', function () {
    gulp.watch('src/assets/scss/**/*.scss', ['default']);
    gulp.watch('src/**/*.html', ['default']);
});

// Default task
gulp.task('default', (callback) => {
  runSequence('clean', 'copy', 'sass', 'image', 'cachebuster', 'critical')
});
