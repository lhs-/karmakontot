var express = require('express')
  , r = require('rethinkdb')
  // other stuff ??
  , http = require('http')
  //
  , app = express()

// should be relocated to external file
var opts = {
    host : '192.168.1.87',
    port : 28015,
  }
  , conn

app.get('/', function (req, res) {
    // RethinkDB admin interface is hosted @ port 8080
    var options = {
      root: __dirname + '/public/',
      dotfiles: 'deny',
      headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
      }
    }

    res.sendFile('index.html', options)
  })

app.get('/admin', function (req, res) {
  // RethinkDB admin interface is hosted @ port 8080
  res.redirect('http://192.168.1.87:8080/')
})

app.get('/tables', function (req, res) {
  r.db('maindb').tableList().run(conn, function (err, results){
    res.json(results)
  })
})

r.connect(opts, function(err, cnn) {
  if (err) throw err
  conn = cnn
})

http.createServer(app).listen(8080, function () {
  console.log('Listening on port 8080')
})
