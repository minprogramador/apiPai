"use strict;";

const app = require('./config/config.js');

const bd     = app.bd;
const route  = app.route;
const server = app.server;
const controller = require('./controller');

setTimeout(controller.init.run, 1000);

route('POST', '/post', controller.post);
route('GET', '/test', controller.test);
route('GET', '/config', controller.config);
route('GET', '/consultar', controller.consultar);

route('GET', '/cache', async function (req, res, next) {
  let vaiValidador = await bd.getAll();

  var uniqueProducts = vaiValidador.rows.filter( function( elem, i, array ) {
    elem.img = '....';
    return elem;
  });

  res.send(uniqueProducts);
});


route(controller.routeHandler);
route(controller.errorHandler);

server.on('error', controller.error);


server.listen(3000);






