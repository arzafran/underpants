import gulp from 'gulp';
import processhtml from 'gulp-processhtml';
import sass from 'gulp-sass';
import browserSync from 'browser-sync';

const paths = {
  development: {
    sass: 'development/sass',
    css: 'development/css',
    templates: 'development/templates'
  },
  build: 'build/'
}

const reload = browserSync.reload;

export function server() {
  browserSync({
    server: {
      baseDir: paths.build
    }
  });
}

export function buildSass() {
    return gulp.src(paths.development.sass.concat('/**/*.scss'), {since: gulp.lastRun(buildSass)})
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(gulp.dest(paths.development.css))
    .pipe(reload({ stream: true }));
}
export function copyGlobal() {
  return gulp.src(paths.development.css.concat('/global/global.css'), {since: gulp.lastRun(copyGlobal)})
  .pipe(gulp.dest(paths.build.concat('/css')));
}

export function buildHtml() {
    return gulp.src(paths.development.templates.concat('/*.html'))
    .pipe(processhtml({
      recursive: true
    }))
    .pipe(gulp.dest(paths.build))
    .pipe(reload({ stream: true }));
}

export function watch() {
  gulp.watch(paths.development.css, buildHtml);
  gulp.watch(paths.development.templates, buildHtml);
  gulp.watch(paths.development.sass, gulp.series(buildSass, copyGlobal));
}

const build = gulp.series(buildSass, copyGlobal, buildHtml);
export { build };

const run = gulp.series(build, gulp.parallel(server, watch));
export { run };