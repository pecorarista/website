export const source = {
  misc: [
    'CNAME',
    'favicon/favicon.ico'
  ],
  imageFiles: [
    'images/**/*.*',
    'latex/**/*.svg'
  ],
  sassFiles: 'scss/**/*.scss',
  vendorStyleFiles: [
    'css/**/*.css',
    'node_modules/prismjs/plugins/command-line/prism-command-line.css',
    'node_modules/prismjs/plugins/line-numbers/prism-line-numbers.css'
  ],
  typeScriptFile: 'typescripts/main.ts',
  nunjucks: [
    'nunjucks/**/*.njk',
    '!nunjucks/**/_*.njk'
  ],
  vendorJavaScriptFiles: [
    'node_modules/prismjs/prism.js',
    'node_modules/prismjs/components/prism-bash.min.js',
    'node_modules/prismjs/components/prism-latex.min.js',
    'node_modules/prismjs/components/prism-makefile.min.js',
    'node_modules/prismjs/components/prism-java.min.js',
    'node_modules/prismjs/components/prism-javascript.min.js',
    'node_modules/prismjs/components/prism-scala.min.js',
    'node_modules/prismjs/components/prism-markdown.min.js',
    'node_modules/prismjs/components/prism-apacheconf.min.js',
    'node_modules/prismjs/components/prism-perl.min.js',
    'node_modules/prismjs/components/prism-haskell.min.js',
    'node_modules/prismjs/components/prism-lua.min.js',
    'node_modules/prismjs/plugins/command-line/prism-command-line.min.js',
    'node_modules/prismjs/plugins/line-numbers/prism-line-numbers.min.js'
  ]
};

export const dest = {
  root: 'dist',
  styleFiles: 'dist/static/css',
  typeScriptFile: 'dist/static/js/main.js',
  nunjucks: 'dist/',
  vendorJavaScriptFiles: 'dist/static/js/',
  imageFiles: 'dist/static/images/'
};
