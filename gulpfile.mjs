import gulp from 'gulp';

import { deleteSync } from 'del';

import { source, dest } from './tasks/config.mjs';
import { compileSass, copyVendorStyle } from './tasks/style.mjs';
import { compileTypeScript, copyVendorJavaScript  } from './tasks/script.mjs';
import { compileNunjucks } from './tasks/nunjucks.mjs';
import { writeContents } from './tasks/content.mjs';
import { copyMisc, copyImage } from './tasks/resource.mjs';
import { sync } from './tasks/sync.mjs';

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
      copyImage,
      copyVendorStyle,
      compileSass,
      compileTypeScript,
      compileNunjucks,
      copyVendorJavaScript
    )
  );

export { sync };
