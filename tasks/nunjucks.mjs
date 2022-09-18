import gulp from 'gulp';
import nunjucksRender from 'gulp-nunjucks-render';
import data from 'gulp-data';
import prettyHtml from 'gulp-pretty-html';
import fs from 'fs';

import { source, dest } from './config.mjs';

export const compileNunjucks = (done) => {
  gulp.src(source.nunjucks)
    .pipe(data({
      ExampleOfArabLuaTeX: fs.readFileSync('latex/arab.tex'),
      ExampleOfRTL: fs.readFileSync('latex/rtl.tex'),
      SimplePoster: fs.readFileSync('latex/simple-poster.tex'),
      ComplexPoster: fs.readFileSync('latex/complex-poster.tex'),
      beamerthemeSimplePoster: fs.readFileSync('latex/beamerthemeSimplePoster.sty'),
      latexmkrc: fs.readFileSync('latex/latexmkrc.pl'),
      VocabularyTemplate: fs.readFileSync('latex/vocabulary.tex'),
      PandocLuaFilter: fs.readFileSync('latex/filter.lua'),
      VocabularyList: fs.readFileSync('latex/words.md'),
      InsertionSort: fs.readFileSync('latex/insertion-sort.tex'),
      InsertionSortForTo: fs.readFileSync('latex/insertion-sort-for-to.tex'),
      InsertionSortFinal: fs.readFileSync('latex/final.tex'),
      ExampleOfHakyll: fs.readFileSync('latex/hakyll.md')
    }))
    .pipe(nunjucksRender({
      'path': 'nunjucks/'
    }))
    .pipe(prettyHtml({
      indent_size: 2,
      indent_char: ' '
    }))
    .pipe(gulp.dest(dest.nunjucks));
  done();
};
