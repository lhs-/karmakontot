var express = require('express')
  , r = require('rethinkdb')
  //
  , app = express()
  , conn
  , opts

// enable pretty print
app.set('json spaces', 2)

// Always try to setup database, tables.
app.use(function (req, res, next) {
  r.dbCreate(opts.db).run(conn, function (errdb, resdb) {
    //if (errdb) throw errdb
    r.tableCreate('sometable').run(conn, function (errtb, restb) {
      //if (errtb) throw errdb
      next()
    })
  })
})

app.get('/entries', function (req, res){
  r.table('sometable').run(conn, function (err, cursor){
    if (err) throw err
    cursor.toArray(function (err, lyrics){
      if (err) throw err
      res.json(lyrics)
    })
  })
})

app.get('/insert', function (req, res){
  r.table('sometable').insert({
    a : 'h',
    b : 'ee',
    c : 'ya',
  }).run(conn, function (errin, resin) {
    if (errin) throw errin
    res.json(resin)
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
