# Prevent basic faulty usage
if [[ ! $1 ]]; then
  echo "Usage: create_module.sh <module name>"
  exit
fi

# Prevent naughty incorrect usage
if [[ -d $1 ]]; then
  echo "Error: Module '$1' already exists!"
  exit
fi

# First arg is the
mkdir $1 && cd $1

# Setup package.json
echo "{ \"name\" : \"unknown\", \"main\" : \"$1.js\" }" >> package.json

# Setup <module>.js
echo "var express = require('express')
  , app = express()
  , options = {
    root: __dirname + '/public/',
    dotfiles: 'deny'
  }

app.get('/', function (req, res) {
  res.sendFile('index.html', options)
})

app.get('/:html', function (req, res) {
  res.sendFile(req.url + '.html', options)
})

app.get('/css/:file', function (req, res) {
  res.sendFile(req.url, options)
})

app.get('/js/:file', function (req, res) {
  res.sendFile(req.url, options)
})

// required module must be called to be 'instantiated'
module.exports = function (opts) {
  // opts <=> config.json
  return app
}
" >> "./$1.js"

# Setup gulpfile.js
echo "var gulp = require('gulp')
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

" >> "./gulpfile.js"

# Setup public resources
mkdir public && cd public
mkdir js && touch "./js/core.js"
mkdir css && touch "./css/core.less"
mkdir img
cd ..

# Setup views
mkdir views && cd views

# Setup html template
echo "doctype html
html(lang=\"en\")
  head
    link(href='/css/core.css', rel='stylesheet')
    title karmakontot
  body
    h1 Karmakontot
    p We're on fire!
    a(href='/test') some page link
    script(src='/js/core.js')
" >> "./index.jade"

echo "doctype html
html(lang=\"en\")
  head
    link(href='/css/core.css', rel='stylesheet')
    title karmakontot
  body
    h1 Testing
    a(href='/') back
    script(src='/js/core.js')
" >> "./test.jade"

# Do initial compilation
echo "Running first-time compilation 'gulp compile':"
gulp compile

echo "Created module $1, run 'cd $1 && gulp dev' to start hacking!"
