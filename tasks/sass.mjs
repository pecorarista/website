import gulp from 'gulp';

import dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);
import sassLint from 'gulp-sass-lint';

const sassFiles = './scss/**/*.scss';

export const compileSass = () =>
  gulp.src(sassFiles)
    .pipe(sassLint())
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError())
    .pipe(sass())
    .pipe(gulp.dest(`${dirRelease}/static/css/`));
