// This app demonstrates the benefits of create_module.sh
var express = require('express')
  , r = require('rethinkdb')
  , app = express()
  , options = {
    root: __dirname + '/public/',
    dotfiles: 'deny'
  }
  , opts
  , conn

app.get('/', function (req, res) {
  res.sendFile('index.html', options)
})

app.get('/admin', function (req, res) {
  // RethinkDB admin interface is hosted @ port 8080
  res.redirect('http://' + opts.host + ':8080/')
})

app.get('/tables', function (req, res) {
  r.tableList().run(conn, function (err, results){
    res.json(results)
  })
})

module.exports = function (optsx) {
  opts = optsx
  r.connect(opts, function (err, cnn){
    if (err) throw err
    conn = cnn
  })

  return app
}
