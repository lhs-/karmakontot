var gulp = require('gulp')
  // plugins...
  , jade = require('gulp-jade')
  , less = require('gulp-less')

// Watch views/css and compile saved file
gulp.task('dev', function() {
  gulp.watch('./views/*.jade', function(event) {
    compileJade(event.path)
  })
  gulp.watch('./public/css/*.less', function(event) {
    compileLess(event.path)
  })
})

// Compile all templates
gulp.task('compile', function (){
  compileJade()
  compileLess()
})

// Either compile file or all templates
function compileJade(file){
  gulp.src(file || './views/*.jade')
    .pipe(jade({})) // no locals :3
    .pipe(gulp.dest('./public'))
}

function compileLess(file){
  gulp.src(file || './public/css/*.less')
    .pipe(less())
    .pipe(gulp.dest('./public/css'))
}


