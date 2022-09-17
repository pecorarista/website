import gulp from 'gulp';

import { source, dest } from './config.mjs';

export const copyMisc = () =>
  gulp.src(source.misc)
    .pipe(gulp.dest(dest.root));
