import gulp from 'gulp';

import { source, dest } from './config.mjs';

export const copyVendorJavaScript = () =>
  gulp.src(source.vendorJavaScriptFiles)
    .pipe(gulp.dest(dest.vendorJavaScriptFiles));
