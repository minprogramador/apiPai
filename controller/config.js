"use strict;";

const date = require('../lib/util/date.js');
const isset = require('../lib/util/isset.js');
const app 	  = require('../config/config.js');
const controller = require('../controller');
const fs = require('fs');
const bd  = app.bd;

const allCaps = async () => {

	let allCaps = await bd.getAll();
	return allCaps;
};

const totalCache = () => {
	const folderPath = './.cache';
	try{
		let dadosCache = fs.readdirSync(folderPath);
		return {
			"docs in cache": dadosCache.length
		}
	}catch(e){
		return {
			"docs in cache": "erro ao ler a pasta do cache."
		}
	}
};

const dadosConfig = () => {
    let path    = "./config/global.json";
    try{
		return JSON.parse(fs.readFileSync(path, 'utf8'));
	}catch(e){
		return {};
	}
};

const dadosCaps = async () => {
	let caps = await bd.getAll();

	let capsOn = caps.rows.filter( function( elem, i, array ) {
	  	if(elem.status === 1)
		    return elem;
	});

	let capsOff = caps.rows.filter( function( elem, i, array ) {
	  	if(elem.status === 4)
		    return elem;
	});

	let capsPen = caps.rows.filter( function( elem, i, array ) {
	  	if(elem.status !== 4 && elem.status !== 1)
		    return elem;
	});

	return {
		"captchas": {
			"Total on": capsOn.length,
			"Total off": capsOff.length,
			"Total pendente": capsPen.length
		}
	};
}

module.exports = async function (req, res, next) {

	//console.log(app.dataUpdate);
    var dadosok = controller.init.logStatus();
    let datacountok = {
    	"Ultima consulta": app.dataUpdate,
    	"Total de acertos": app.totalAcertos,
    	"Total de erros": app.totalErros
	};
	dadosok = Object.assign(dadosok, totalCache(), datacountok, dadosConfig());

	let inSistema = {
		"Sistema": dadosok
	}
	//console.log(app.dataStart);
//	console.log(app.dataUpdate);

	var body = Object.assign(inSistema, await dadosCaps());

    res.send(body);
};
