import gulp from 'gulp';

import { deleteSync } from 'del';

import { source, dest } from './tasks/config.mjs';
import { compileSass } from './tasks/sass.mjs';
import { compileTypeScript } from './tasks/typescript.mjs';
import { compileNunjucks } from './tasks/nunjucks.mjs';
import { copyVendorJavaScript } from './tasks/javascript.mjs';
import { writeContents } from './tasks/content.mjs';
import { copyMisc } from './tasks/misc.mjs';

export const clean = (done) => {
  deleteSync([ dest.root ]);
  done();
};

export default
  gulp.series(
    clean,
    writeContents,
    gulp.parallel(
      copyMisc,
      compileSass,
      compileTypeScript,
      compileNunjucks,
      copyVendorJavaScript
    )
  );
