import gulp from 'gulp';

import dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);
import sassLint from 'gulp-sass-lint';

import { source, dest } from './config.mjs';

export const compileSass = () =>
  gulp.src(source.sassFiles)
    .pipe(sassLint())
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError())
    .pipe(sass())
    .pipe(gulp.dest(dest.styleFiles));

export const copyVendorStyle = () =>
  gulp.src(source.vendorStyleFiles)
    .pipe(gulp.dest(dest.styleFiles));
