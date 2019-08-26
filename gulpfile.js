const { src, dest, parallel } = require('gulp');

function html() {
  return src('index.html').pipe(dest('dist/'));
}
function js() {
  return src('script.js').pipe(dest('dist/'));
}

function img() {
  return src('images/*.gif').pipe(dest('dist/images'));
}

exports.js = js;
exports.html = html;
exports.default = parallel(html, js);
