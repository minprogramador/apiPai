"use strict";

module.exports = function(value) {
    const getCaptcha = require('./getCaptcha.js');
    const filtroRes = require('./filtroConsulta.js');
    const consulta = require('./consulta.js');
    const test = require('./test.js');

    return {test, getCaptcha, consulta};
};

