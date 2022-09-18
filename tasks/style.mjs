import gulp from 'gulp';

import dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);

import { source, dest } from './config.mjs';

export const compileSass = (done) => {
  gulp.src(source.sassFiles)
    .pipe(sass())
    .pipe(gulp.dest(dest.styleFiles));
  done();
};

export const copyVendorStyle = (done) => {
  gulp.src(source.vendorStyleFiles)
    .pipe(gulp.dest(dest.styleFiles));
  done();
};
