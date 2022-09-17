import gulp from 'gulp';

import buffer from 'vinyl-buffer';
import uglify from 'gulp-uglify';

const userTypeScripts = './typescripts/**/*.ts';

export const compileTypeScripts = () =>
  browserify()
    .add('./typescripts/main.ts')
    .plugin('tsify', {
      target: 'ES5',
      removeComments: false
    })
    .bundle()
    .pipe(source('main.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest(`${dirRelease}/static/js/`));
