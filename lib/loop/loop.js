"use strict;";

const isset   = require('../util/isset.js');
const die     = require('../util/die.js');
const resolveCapsPendentes = require('./resolveCapsPendentes.js');
const validarCaps          = require('./validarCaps.js');

var crud;

module.exports.config = function(banco_de_dados) {
	crud = banco_de_dados;
//	console.log(typeof banco_de_dados);
//	console.log(`\n inicio do modulo,\ncarregou banco_de_dados---> `);
};

const addCache = async (dadoscps) => {
	let datanow = new Date().toLocaleString("pt-BR",{timeZone:"America/Sao_Paulo"});
    let data = {
        cookie: dadoscps.cookie,
        img: dadoscps.img,
        key: '',
        solucao : dadoscps.solucao,
        start: datanow,
        count: 0,
        status: 2
    }
	let vai = await crud.add(data);
};

const UpCache = async (id, payload) => {
	let up = await crud.up(payload, id);
	return up;

};










