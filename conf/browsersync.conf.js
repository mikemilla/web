const conf = require('./gulp.conf');

module.exports = function () {
  return {
    notify: false,
    server: {
      baseDir: [
        conf.paths.tmp,
        conf.paths.src
      ]
    }
  };
};
