
"use strict;";

module.exports = function (req, res, next) {

    res.on('timeout', (server) => {
      console.log('socket timeout, destruiu interno.');
      res.send('se fudeu');
    });

    setTimeout(function() {
        res.send('hello timeout....');
    }, 10000);

}

/*
if (req.query.id === 'test')
next(new Error('This is an error message.'));
*/
