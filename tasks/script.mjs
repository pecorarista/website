import gulp from 'gulp';

import browserify from 'browserify';
import buffer from 'vinyl-buffer';
import uglify from 'gulp-uglify';
import vinyl from 'vinyl-source-stream';

import { source, dest } from './config.mjs';

export const compileTypeScript = (done) => {
  browserify()
    .add(source.typeScriptFile)
    .plugin('tsify', {
      target: 'ES5',
      removeComments: false
    })
    .bundle()
    .pipe(vinyl('main.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest(dest.typeScriptFile));
  done();
};

export const copyVendorJavaScript = (done) => {
  gulp.src(source.vendorJavaScriptFiles)
    .pipe(gulp.dest(dest.vendorJavaScriptFiles));
  done();
};
