var _push = require('./push');
var _request = require('./request');
var _response = require('./response');
var _handler = require('./handler');
var _receiver = require('./receiver');

module.exports = function () {
  var stack = [];

  function router(request, response, receiver) {
    receiver = receiver || _receiver;
    _request(request, response);
    _response(request, response);


    // let svtimeout = request.client._server.timeout - 3000;

    // //#start - verifica timeout!!
    // let start_time = new Date().getTime();

    // var tempoTimeout = setInterval(function() {

    //   let now = (new Date().getTime() - start_time);
    //   if(now > svtimeout) {
    //     clearInterval(tempoTimeout);
    //     response.send(`a consulta demorou mais que ${svtimeout} ms`);
    //   }
    // }, 2000);
    // //#end - verifica timeout, a cada 2s..


    var path = request.path.toLowerCase();
    var index = 0;
    next();

    function next(error) {
      var layer = stack[index++];
      if (!layer) {
        setImmediate(receiver, error, request, response);
        return;
      }

      var method = layer.method;
      if (method !== '*' && method !== request.method) {
        return next(error);
      }

      var anchor = layer.anchor;
      var marker = anchor.length;
      //console.log('--> anchor %O', layer);
//      console.log('----> %s', path.substr(0, marker));



      if (path.substr(0, marker) !== anchor) {
        return next(error);
      }

      var border = path[marker];
      if (border !== undefined && border !== '/' && border !== '.') {
        return next(error);
      }

      var handler = layer.handler;
      _handler(handler, error, request, response, next);
    }
  }

  router.push = _push(stack);
  return router;
};
