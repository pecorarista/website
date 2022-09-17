import gulp from 'gulp';

import { source, dest } from './config.mjs';

export const copyMisc = () =>
  gulp.src(source.misc)
    .pipe(gulp.dest(dest.root));

export const copyImage = () =>
  gulp.src(source.imageFiles)
    .pipe(gulp.dest(dest.imageFiles));
