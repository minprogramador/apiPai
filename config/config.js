"use strict;";

const http   = require('http');
const isset = require('../lib/util/isset.js');
const Router = require('../lib/node-router');
const Sqlite = require('../lib/sqlite');
const Init   = require('../controller/init');
const date   = require('../lib/util/date.js');

var dataStart = date();
var dataUpdate   = '';
var totalErros   = 0;
var totalAcertos = 0;

let config = {
    tabela: 'captchas',
    file: 'database.sqlite'
};

var bd = new Sqlite(config);


setTimeout(async () => {
    let sqlinit1 = `
    CREATE TABLE IF NOT EXISTS captchas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cookie text,
        img text,
        key text,
        solucao text, 
        start text, 
        count INTEGER, 
        status INTEGER
    );
    `;
	const inst = await bd.install(sqlinit1);
}, 150);


Init.setConfig(bd);

const router = Router();
const route  = router.push;


const server = http.createServer(router);

server.setTimeout(10000);

exports.bd = bd;
exports.route = route;
exports.server = server;
exports.dataStart = dataStart;
exports.dataUpdate = dataUpdate;
exports.totalAcertos = totalAcertos;
exports.totalErros = totalErros;


