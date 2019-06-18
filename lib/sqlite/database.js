"use strict";

var sqlite3 = require('sqlite3').verbose()

module.exports = function(file='') {
    
    var dbfile = '';
    if(file === '') {
        dbfile = 'x.sqlite';
    }else{
        dbfile = file;
    }
    
    return new sqlite3.Database(dbfile, (err) => {
        if (err) {
          console.error(err.message)
          throw err
        }else{
            //console.log(`-->Connected to > ${dbfile}`)
        }
    });
};