import gulp from 'gulp';

import { source, dest } from './config.mjs';

export const copyMisc = (done) => {
  gulp.src(source.misc)
    .pipe(gulp.dest(dest.root));
  done();
};

export const copyImage = (done) => {
  gulp.src(source.imageFiles)
    .pipe(gulp.dest(dest.imageFiles));
  done();
};
