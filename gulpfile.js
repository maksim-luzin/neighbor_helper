const { src, dest } = require('gulp');
const del = require('del');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify-es').default;

exports.default = async () => {
  await del('bin/');
  return (
    src('src/**')
      .pipe(babel())
      .pipe(uglify())
      .pipe(dest('bin/'))
  );
};
