import browserSync from 'browser-sync';

export const sync = (done) => {
  browserSync.init({
    server: {
      baseDir: 'dist/',
      index: 'index.html',
      serveStaticOptions: {
        extensions: ['html']
      }
    },
    open: false
  });
  done();
};

export const reload = (done) => {
  browserSync.reload();
  done();
};
