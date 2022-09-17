import gulp from 'gulp';
import nunjucksRender from 'gulp-nunjucks-render';
import htmlBeautify from 'gulp-html-beautify';

import { source, dest } from './config.mjs';

export const compileNunjucks = () =>
  gulp.src(source.nunjucks)
    .pipe(nunjucksRender({
      'path': 'nunjucks/'
    }))
    .pipe(htmlBeautify({
      indent_size: 2,
      indent_char: ' '
    }))
    .pipe(gulp.dest(dest.nunjucks));
