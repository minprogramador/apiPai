"use strict";

const Curl = require('../curl');
const Util = require('../util');
const configDb = require('../../config/dados2Cap.json');


var configCap = configDb.modulos.captcha;

module.exports = function(value) {
	
	const Utill = new Util();

	const curl = new Curl();

    configCap = Object.assign(configCap, value);

	const trataRes = function(r) {

	    const myObject = configDb.modulos.captcha.check;
        var msg    = '';
        var msgOk  = '';
        var msgsave = '';

	    for (var i =0; i < myObject.length; i++) {
	        try{
	            if(r.includes(myObject[i].pergunta) === true) {
	                msgOk = myObject[i].resposta;
	                msg = myObject[i].pergunta;
	                break;
	            }
	        }catch(e) {
	            msg = 'indefinido';
	        }
	    }

        if(msgOk === '') {
            msg = false;
            msgsave = msg;
        }else if(msgOk === 'ok') {
			let rr = r.split("|");
			msgsave = rr[1];
        }else{
            msg = msgOk;
            msgsave = msg;
        }

        return msgsave;
	};


	const send = async (img) => {
		var data = configDb.modulos.captcha.send;
		data.key = configDb.modulos.captcha.key;
		data.body = img;

		curl.setUrl(`${configDb.modulos.captcha.url}/in.php`);
		curl.setPost(data);

		var dados = await curl.run();
		dados = trataRes(dados.body);
		return dados;
	};

	const check = async (id) => {

		if(id === undefined) {
			console.log(`\n----------------------->`);
			console.log(`............erro sem id ............`);
			console.log(`\n<-----------------------`);
			process.exit(1);
		}

		let url = (`${configDb.modulos.captcha.url}/res.php?key=${configDb.modulos.captcha.key}&action=get&id=${id}`);
		curl.setUrl(url);

		try {
			let dados = await curl.run();
			let fildados = trataRes(dados.body);
			return {dados: fildados, id:id};
		}catch(e){
			return {dados: e, id:id}
		}
	};

	const verificar = async (id) => {

		if(id === undefined) {
			console.log(`\n----------------------->`);
			console.log(`............erro sem id ............`);
			console.log(`\n<-----------------------`);
			process.exit(1);
		}

		let url = (`${configDb.modulos.captcha.url}/res.php?key=${configDb.modulos.captcha.key}&action=get&id=${id}`);
		curl.setUrl(url);

		try {
			let dados = await curl.run();
			let fildados = trataRes(dados.body);
			return {solucao: fildados, key:id};
		}catch(e){
			return {solucao: 'error', key:id}
		}
	};


	return {verificar, send, check, Util: Util};
};