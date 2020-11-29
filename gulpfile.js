const { src, dest } = require('gulp');
const del = require('del');
const gulpIf = require('gulp-if');
const uglify = require('gulp-uglify-es').default;

exports.default = async () => {
  await del('bin/');
  return (
    src('src/**')
      .pipe(gulpIf('*.js', uglify()))
      .pipe(dest('bin/'))
  );
};
