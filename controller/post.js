"use strict;";

module.exports = function (req, res, next) {
    var errorpost = 0;
    var body = '';

    req.on('data', function(data) {
        if(body.length > 2048) {
            errorpost++;
        }else{
            body += data
        }
    });

    req.on('end', function() {
        if(body.length > 2048) {
            res.send('payload mt grande, ze mane! 1');
        }else if(errorpost > 0) {
            res.send('payload mt grande, ze mane! 2');
        }else{
            res.send(body);
        }

    });
}