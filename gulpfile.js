/* eslint-env es6 */
'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const sassLint = require('gulp-sass-lint')
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const del = require('del');
const rsync = require('gulp-rsync');
const fs = require('fs');
const toml = require('toml');
const nunjucksRender = require('gulp-nunjucks-render');
const data = require('gulp-data');
const htmlBeautify = require('gulp-html-beautify');
const ghPages = require('gulp-gh-pages');

const dirRelease = './dist/';
const nunjucks = ['./nunjucks/**/*.njk', '!./nunjucks/**/_*.njk'];
const sassFiles = './scss/**/*.scss';
const dirModules = './node_modules/'
const images = ['./images/**/*.*', './latex/**/*.svg'];
const vendorStyles = [
  './css/**/*.css',
  `${dirModules}/prismjs/plugins/command-line/prism-command-line.css`,
  `${dirModules}/prismjs/plugins/line-numbers/prism-line-numbers.css`
];
const vendorJavaScripts = [
  `${dirModules}/prismjs/prism.js`,
  `${dirModules}/prismjs/components/prism-bash.min.js`,
  `${dirModules}/prismjs/components/prism-latex.min.js`,
  `${dirModules}/prismjs/components/prism-makefile.min.js`,
  `${dirModules}/prismjs/components/prism-java.min.js`,
  `${dirModules}/prismjs/components/prism-javascript.min.js`,
  `${dirModules}/prismjs/components/prism-scala.min.js`,
  `${dirModules}/prismjs/components/prism-markdown.min.js`,
  `${dirModules}/prismjs/components/prism-apacheconf.min.js`,
  `${dirModules}/prismjs/components/prism-perl.min.js`,
  `${dirModules}/prismjs/components/prism-haskell.min.js`,
  `${dirModules}/prismjs/components/prism-lua.min.js`,
  `${dirModules}/prismjs/plugins/command-line/prism-command-line.min.js`,
  `${dirModules}/prismjs/plugins/line-numbers/prism-line-numbers.min.js`
];
const userTypeScripts = './typescripts/**/*.ts';
const misc = ['CNAME', './favicon/favicon.ico']


const copyMisc = () =>
  gulp.src(misc)
    .pipe(gulp.dest(`${dirRelease}`));


const copyVendorStyles = () =>
  gulp.src(vendorStyles)
    .pipe(gulp.dest(`${dirRelease}/static/css/`));


const copyVendorJavaScripts = () =>
  gulp.src(vendorJavaScripts)
    .pipe(gulp.dest(`${dirRelease}/static/js/`));


const compileTypeScripts = (done) =>
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


const copyImages = () =>
  gulp.src(images)
    .pipe(gulp.dest(`${dirRelease}/static/images/`));


const compileNunjucks = () =>
  gulp.src(nunjucks)
    .pipe(data({
      ExampleOfArabLuaTeX: fs.readFileSync('latex/arab.tex', 'utf-8'),
      ExampleOfRTL: fs.readFileSync('latex/rtl.tex', 'utf-8'),
      SimplePoster: fs.readFileSync('latex/simple-poster.tex', 'utf-8'),
      ComplexPoster: fs.readFileSync('latex/complex-poster.tex', 'utf-8'),
      beamerthemeSimplePoster: fs.readFileSync('latex/beamerthemeSimplePoster.sty', 'utf-8'),
      latexmkrc: fs.readFileSync('latex/latexmkrc.pl', 'utf-8'),
      VocabularyTemplate: fs.readFileSync('latex/vocabulary.tex', 'utf-8'),
      PandocLuaFilter: fs.readFileSync('latex/filter.lua', 'utf-8'),
      VocabularyList: fs.readFileSync('latex/words.md', 'utf-8'),
      InsertionSort: fs.readFileSync('latex/insertion-sort.tex', 'utf-8'),
      InsertionSortForTo: fs.readFileSync('latex/insertion-sort-for-to.tex', 'utf-8'),
      InsertionSortFinal: fs.readFileSync('latex/final.tex', 'utf-8'),
      ExampleOfHakyll: fs.readFileSync('latex/hakyll.md', 'utf-8').replace('...', '---')
    }))
    .pipe(nunjucksRender({
      path: ['./nunjucks/']
    }))
    .pipe(htmlBeautify({
      indent_size: 2,
      indent_char: ' '
    }))
    .pipe(gulp.dest(`${dirRelease}/`));


const compileSass = () =>
  gulp.src(sassFiles)
    .pipe(sassLint())
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError())
    .pipe(sass())
    .pipe(gulp.dest(`${dirRelease}/static/css/`));


const sync = (done) => {
  browserSync.init({
    server: {
      baseDir: dirRelease,
      index: 'index.html'
    },
    open: false
  });
  done();
};


const reload = (done) => {
  browserSync.reload();
  done();
};


const clean = () => del([dirRelease]);


const transfer = () => {
  const config = JSON.parse(fs.readFileSync('config.json', 'utf-8'));
  return gulp.src(dirRelease)
    .pipe(rsync({
      root: dirRelease,
      hostname: config.hostname,
      username: config.username,
      destination: config.destination,
      recursive: true,
      compress: true
    }));
};


const write = (done) => {
  const abbrev = JSON.parse(fs.readFileSync('./data/abbreviations.json', 'utf-8')).categories.map(category =>
    `<li>〈${category.translation}〉`
      + `<ul class="list-inline">`
      + category.subcategories.map(subcategory =>
        `<li class="list-inline-item">` + [
          `<span class="grammar">${subcategory.abbrev}</span>`,
          `<em class="serif">${subcategory.term}</em>`,
          `<span class="translation">${subcategory.translation}</span>`,
        ].join(`<span class="widespace"> </span>`)
        + `</li>`
      ).join('')
      + `</ul>`
      + `</li>`
  ).join('');
  fs.writeFileSync(
    `./nunjucks/posts/_include/_abbreviations.njk`,
    `<ul style="list-style-type: none; padding-left: 1.08rem;">` + abbrev + `</ul>`
  );

  let content = JSON.parse(fs.readFileSync('./data/inner-universe.json', 'utf-8'));
  let htmls = content.sections.map(section => {
    return '<ul>' + section.vocabulary.map(entry => {
      const w = entry.word;
      let elements = [
       `<span class="russian">${w.surface}</span>`
      ];

      if (w.pronunciation) {
        elements.push(`<span class="ipa">/${w.pronunciation}/</span>`);
      }

      let grammar = [];

      switch (w.grammar.pos) {
        case 'noun':
          elements.push(`<span class="grammar">${w.grammar.gender + " " + w.grammar.animacy}</span>`);
          grammar.push(w.grammar.number),
          grammar.push(w.grammar.case);
          break;
        case 'verb':
          elements.push(`<span class="grammar">${w.grammar.aspect}</span>`);
          if (w.grammar.isinf) {
            grammar.push('inf');
          } else {
            grammar.push(w.grammar.gender);
            if ((w.grammar.person || "") + w.grammar.number != "") {
              grammar.push(w.grammar.person + w.grammar.number);
            }
            if (w.grammar.tense) {
              grammar.push(w.grammar.tense);
            }
          }
          break;
        case 'adj':
        case 'adv':
        case 'pron':
          if (w.translation) {
            // e.g., я /ja/ (pron) (私) (1sg nom)
            elements.push(`<span class="grammar">${w.grammar.pos}</span>`);
          } else {
            // e.g., я /ja/ () () (pron 1sg nom)
            grammar.push(w.grammar.pos);
          }

          if ((w.grammar.person || "") + w.grammar.number != "") {
            grammar.push(w.grammar.person + w.grammar.number);
          }
          if (w.grammar.gender) {
            grammar.push(w.grammar.gender);
          }
          if (w.grammar.case) {
            grammar.push(w.grammar.case);
          }
          if (w.grammar.degree) {
            grammar.push(w.grammar.degree);
          }
          break;
        default:
          elements.push(`<span class="grammar">${w.grammar.pos}</span>`);
          break;
      }

      if (w.args) {
        elements.push('[+ ' + w.args.join(', ') + ']');
      }

      if (w.translation) {
        elements.push(`<span class="translation">${w.translation}</span>`);
      }
      elements.push(`<span class="grammar">${grammar.join(' ')}</span>`);

      if (entry.lemma) {
        let lemma = entry.lemma;
        elements.push(`←`);
        elements.push(`<span class="russian">${lemma.surface}</span>`);
        elements.push(`<span class="ipa">/${lemma.pronunciation}/</span>`);
      }

      if (entry.note) {
        elements.push(`${entry.note}`);
      }

      return '<li>' + elements.join(`<span class="widespace"> </span>`) + '</li>';

    }).join('') + '</ul>\n';
  });

  htmls.forEach((html, index) => {
    fs.writeFileSync(`./nunjucks/posts/_include/_inner-universe-vocabulary-${index + 1}.njk`, html);
  });

  let rows = [];
  let symbols = [];
  JSON.parse(fs.readFileSync('./data/phonetic-alphabets.json', 'utf-8')).alphabets.forEach(alphabet => {
    symbols.push(alphabet.symbol);
    rows.push(
      `<tr>
        <td class="ipa">
          ${alphabet.symbol}
        </td>
        <td>
          ${alphabet.name}
        </td>
        <td>
          ${alphabet.vim.length > 0 ? '<kbd>' + alphabet.vim.join("</kbd> <kbd>") + '</kbd>' : ''}
        </td>
        <td class="monospace">
          ${alphabet.tipa}
        </td>
        <td>
            ${alphabet.compose.length > 0 ? '<kbd>' + alphabet.compose.join("</kbd> <kbd>") + '</kbd>' : ''}
        </td>
        <td>
          ${alphabet.xsampa.length > 0 ? '<kbd>' + alphabet.xsampa.join("</kbd> <kbd>") + '</kbd>' : ''}
        </td>
      </tr>`
    );
  });

  const table = `
    <table class="table table-bordered table-striped">
      <thead>
        <tr>
          <th>Symbol</th><th>Name</th><th>Vim</th><th>TIPA</th><th>Compose</th><th>X-SAMPA</th>
        </tr>
      </thead>
    `
    + rows.join('')
    + '</table>'
  const font = `<link href="https://fonts.googleapis.com/css?family=Judson&amp;subset=latin-ext,vietnamese&text=${encodeURIComponent('abcdefghijklmnopqrstuvwxyz' + symbols.join(''))}" rel="stylesheet">`
  fs.writeFileSync(`./nunjucks/posts/_include/_ipa-table.njk`, table);
  fs.writeFileSync(`./nunjucks/_layout/_ipa-font.njk`, font);

  done();
};


gulp.task('watch', (done) => {
  gulp.watch(images, gulp.series(copyImages, reload));
  gulp.watch(
    [
      './nunjucks/**/*.njk',
      '!./nunjucks/**/_*.njk',
      './latex/**/*.svg',
      './data/**/*.json'
    ],
    gulp.series(write, compileNunjucks, reload));
  gulp.watch(sassFiles, gulp.series(compileSass, reload));
  gulp.watch(userTypeScripts, gulp.series(compileTypeScripts, reload));
  gulp.watch(vendorJavaScripts, gulp.series(copyVendorJavaScripts, reload));
  done();
});


gulp.task('build',
  gulp.series(
    clean,
    write,
    copyMisc,
    compileNunjucks,
    compileSass,
    copyVendorStyles,
    copyVendorJavaScripts,
    compileTypeScripts,
    copyImages
  )
);


gulp.task('default',
  gulp.series(
    'build',
    sync,
    'watch'
  )
);
