const gulp = require('gulp');
const nunjucksRender = require('gulp-nunjucks-render');

gulp.task('default', () => {
    return gulp.src('src/pages/*')
        .pipe(nunjucksRender({
            path: ['src/templates']
        }))
        .pipe(gulp.dest('.'));
})