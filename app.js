var express = require('express')
  // other stuff ??
  , http = require('http')
  // sub-apps
  , root = require('./modules/root')
  , subapp = require('./modules/subapp')
  // main app
  , app = express()

// Default rethinkdb opts settings
var opts = {
  host : '192.168.1.87',
  port : 28015
}

// Try to load opts from config.json file
try { opts = require('./config.json') }
catch (e) { console.log(e) }

// Mount root
app.use('/', root(opts))

// Mount subapp
app.use('/api', subapp(opts))

http.createServer(app).listen(8080, function () {
  console.log('Listening on port 8080')
})
