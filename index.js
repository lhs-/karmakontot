var r = require('rethinkdb')
  , opts = {
    host : '192.168.1.87',
    port : 28015,
  }
  , connection

r.connect(opts, function(err, conn) {
  if (err) throw err

  connection = conn

  // Initiate the whole sequence of events!
  createDatabase()
})

// Dummy function
function chainfn(err, res){
  if (err && err.toString().indexOf('already exists') === -1)
    throw err
  this.next()
}

function createDatabase(){
  // Setup database, a collection of tables. Wohoo
  r.dbCreate('maindb').run(connection, chainfn.bind({ next : createTable }))
}

function createTable(){
  // Setup table: user-table would contain users, ...
  r.db('maindb').tableCreate('sometable').run(connection, chainfn.bind({ next : insertStuff }))
}

function insertStuff(){
  // We set connection to a specific database: connection.use('maindb')
  connection.use('maindb')

  // Removes the need for a query to have a specific db('...')
  r.table('sometable').insert({
    a : 'h',
    b : 'ee',
    c : 'ya',
  }).run(connection, chainfn.bind({ next : printLyrics }))
}

// Crazy lyric printer for good measure
function printLyrics(){
  // First map all the table entries to what we want (lyric parts)
  r.table('sometable').map(function (lyric){
    return [lyric('a'), lyric('b'), lyric('c')]
  }).run(connection, function (err, cursor){
    // Transform the cursor (that selects the queried elements) because it's
    // a better format lol; can also use: each(callb,finally), next(callb)
    cursor.toArray(function (err, lyrics){
      var linelen = 1

      // map    [ [a, b, c], [a, b, c], ... ] --> [ str1, str2, ... ]
      // reduce [ str1, str2, ... ]           --> lyrics (string)

      lyrics = lyrics.map(function (lyric) {
        // Make some lines with extra feeling!
        if (Math.random() < 0.45)
          lyric[1] = [lyric[1], lyric[1], lyric[1]].join('-') + '-'

        return lyric.join('')
      }).reduce(function (lyrica, lyricb){
        var red = lyrica + ', '

        // The only thing that actually makes sense; as in sensible output width
        if (red.length > linelen * 80) {
          red += '\n'
          linelen++
        }

        red += lyricb
        return red
      })

      console.log(lyrics)

      // Close cursor for nice memory usage in our no-gc-environment
      cursor.close()

      // Close rethink connection, allowing nodejs to exit without CTRL-C
      connection.close()
    })
  })
}
