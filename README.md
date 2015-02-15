# karmakontot
main module

## kick the ball
 - edit config.json with correct host&port numbers for your rethink server
 - the classic `npm install`
 - run `node app.js` to fire up server @ localhost:8080

## some notes
 - each folder inside the /modules folder is an express sub app
 - each sub app must be manually mounted at some route inside the app.js
   using app.use('/route', sub-app).
 - if sub app uses rethinkdb, the connection opts should be passed like this:
    `app.use('/route', subapp(opts))`
 - use the package.json file's main-field to indicate which file to load with require('/<>')
