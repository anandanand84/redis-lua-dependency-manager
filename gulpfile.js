
/**
 * Created by AAravindan on 7/12/16.
 */
var gulp = require('gulp');
var addLuaDependents = require('./index.js');

gulp.task('default', function() {
  gulp.src(['./lua-scripts/app/*.lua'])
      .pipe(addLuaDependents({noComments : true}))
      .pipe(gulp.dest('./lua-scripts/dist'))
});