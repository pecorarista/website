import gulp from 'gulp';

import { source, dest } from './tasks/config.mjs';
import { compileSass, copyVendorStyle } from './tasks/style.mjs';
import { compileTypeScript, copyVendorJavaScript  } from './tasks/script.mjs';
import { compileNunjucks } from './tasks/nunjucks.mjs';
import { writeContents } from './tasks/content.mjs';
import { copyMisc, copyImage } from './tasks/resource.mjs';
import { clean } from './tasks/util.mjs';
import { sync, reload } from './tasks/sync.mjs';


export const watch = (done) => {
  gulp.watch(source.imageFiles, gulp.series(copyImage, reload));
  gulp.watch(
    ['nunjucks/**/*.njk', '!nunjucks/**/_*.njk', 'latex/**/*.svg', 'data/**/*.json'],
    gulp.series(writeContents, compileNunjucks, reload)
  );
  gulp.watch(source.sassFiles, gulp.series(compileSass, reload));
  gulp.watch(source.typeScriptFile, gulp.series(compileTypeScript, reload));
  gulp.watch(source.vendorJavaScriptFiles, gulp.series(copyVendorJavaScript, reload));
  done();
};

export const build =
  gulp.series(
    clean,
    gulp.parallel(
      copyMisc,
      copyImage,
      copyVendorStyle,
      compileSass,
      compileTypeScript,
      gulp.series(
        writeContents,
        compileNunjucks
      ),
      copyVendorJavaScript
    )
  );

export default gulp.series(build, sync, watch);
