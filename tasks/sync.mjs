import browserSync from 'browser-sync';

export const sync = (done) => {
  browserSync.init({
    server: {
      baseDir: 'dist/',
      index: 'index.html'
    },
    open: false
  });
  done();
};
