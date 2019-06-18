"use strict;";

const app 	  = require('../config/config.js');
const isset   = require('../lib/util/isset.js');
const leftPad = require('../lib/util/leftPad.js');
const Pai 	  = require('../lib/pai/pai.js');
const receita = require('../lib/receita/cpf.js');
const file 	  = require('../lib/util/file.js');
const date = require('../lib/util/date.js');

const ColetarCaps    = require('../lib/loop/coletarCaps.js');

const bd  = app.bd;
const pai = new Pai();

ColetarCaps.setConfig(bd);

const consultar = async (doc) => {
	var pedidoreload = 0;
	var resConsok = '';
	let opcoes = await bd.getporStatus(1);

	let dadosReceita = await receita.consultar(doc);

	if(isset(dadosReceita) && isset(dadosReceita.msg)) {
		app.totalErros++;
		return dadosReceita;
	}

	if(opcoes.rows.length < 1) {
		if(ColetarCaps.getStatus() === 'off') {
			ColetarCaps.loop('on');
		}
		app.totalErros++;
		return {doc: doc, msg: 'error, tente novamente.', status: false};
	}
	
	for (let index = 0; index < opcoes.rows.length; index++) {

		let xx = opcoes.rows[index];

		let dados = {
			doc: dadosReceita.doc,
			nome: dadosReceita.nome,
			data: dadosReceita.nascimento,
			mae: dadosReceita.mae,
			cap: xx.solucao,
			cookie: xx.cookie
		};

		let teste = await pai.consulta(dados);

		if(typeof teste === 'string' && teste === 'reload') {
			pedidoreload++;
		}else if(teste !== 'indefinido') {
			resConsok = teste;
			break;
		}else{
//			console.log('indefinido........ else.');
		}
	}

	if(resConsok === '') {
		if(pedidoreload > 0) {

			if(ColetarCaps.getStatus() === 'off') {
				ColetarCaps.loop('on');
			}
			app.totalErros++;
			return {msg: 'error, tente novamente.', status: false};
		}else{
			app.totalAcertos++;
			return {msg: 'nada encontrado'};
		}
	}else{
		resConsok.doc = doc;
		if(doc !== '11111111111') {
			if(isset(resConsok.titulo) && resConsok.pai !== 'NADA CONSTA') {
				if(isset(resConsok.mae)) {
					file.save(resConsok, doc);
				}
			}
		}

		if(isset(resConsok.titulo)) {
			delete resConsok.titulo;
		}
		app.totalAcertos++;
		return resConsok;
	}
};

module.exports = function (req, res, next) {

//	app.dataUpdate = date();


	app.dataUpdate = date();

	let doc = req.url.split('/');

	if(isset(doc) && isset(doc[2])) {
		let docok = leftPad(Number(doc[2]), 11);

		if(docok.match(/[0-9]{11,}/g)) {
			res.on('timeout', (server) => {
				app.totalErros++;
				//console.log('socket timeout, destruiu interno.');
				res.send({doc: docok, msg: 'servidor instavel, tente novamente em breve..', status: false});
		    });

	  	let docCache = file.find(docok);

	  	if(docCache !== false) {
			let resultok = JSON.parse(docCache);
			if(resultok.titulo) {
				delete resultok.titulo;
			}

			if(isset(resultok.pai)) {
				if(resultok.pai !== 'NADA CONSTA'){
					app.totalAcertos++;
				}else{
					app.totalErros++;
				}
			}else{
				app.totalErros++;
			}

			res.send(resultok);
	  	}else{
		  	consultar(docok).then(function(result) {
				res.send(result);
			}).catch(function(e) {
				res.send({doc: docok, msg: 'error, tente novamente.'});
			});
		}
	  }else{
	  	app.totalErros++;
	      res.send({msg:'doc invalido.'});
	  }
	}else{
		res.send('not found');		
	}
}
