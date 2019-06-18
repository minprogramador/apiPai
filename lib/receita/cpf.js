"use strict;";

const Curl = require('../curl');
const clearXml = require('./clearXml.js');
const isset = require('../util/isset.js');

const receita = {};

receita.consultar = async function(doc, call) {
    var dadosReceita;
    try{
        dadosReceita = require('../../config/dadosReceita.json');
        if(!isset(dadosReceita.consultar.url)) {
            return {doc: doc, msg: 'ERROR, ConfigRec not found!', status: false};
        }
    }catch(e){
        return {doc: doc, msg: 'ERROR, ConfigRec not found!', status: false};
    }

	var urr = dadosReceita.consultar.url;
    urr = urr + doc;

    const curl = new Curl();
    curl.setProxy(dadosReceita.proxy);

    curl.setUrl(urr);
    var dados, body;
    try{
	    dados = await curl.run();
	    body = dados.body;
	}catch(e){
    	return {doc: doc, msg: 'indisponivel no momento.', status: false};
	}
    var msg    = '';
    var msgOk  = '';
    var msgsave = '';

    const myObject = dadosReceita.consultar.check;

    for (var i =0; i < myObject.length; i++) {
        try{
            if(body.includes(myObject[i].pergunta) === true) {
                msgOk = myObject[i].resposta;
                //console.log(msgOk);
                msg = myObject[i].pergunta;
                break;
            }
        }catch(e) {
            msg = 'indisponivel no momento.';
        }
    }


    msgsave = msg;

    if(msgOk === '') {
    	return {doc: doc, msg: 'indisponivel no momento.', status: false};
    }else if(msgOk === 'CPF invalido.') {
		return {doc: doc, msg: "CPF invalido.", status: false};
    }else if(msgOk === 'ok') {
        msgsave = msg;
		var json = clearXml(body);
		if(isset(json)) {
			if(json.mae === 'Array') {
				json.mae = '';
				json = false;
			}else if(json.mae.length < 5) {
				json.mae = '';
				json = false;
			}

    		if(json !== false) {
    			json.status = true;
    		}else{
    			json = {doc: doc, msg: "erro ao consultar doc.", status: false};
    		}
    		return json;
		}else{
	    	return {doc: doc, msg: 'indisponivel no momento.', status: false};
		}
    }else{
        msg = msgOk;
        return msg;
    }
}

module.exports = receita;

/*
//#exemplo
let doc = '11111111111';

receita.consultar(doc, function(r){
    var json = JSON.parse(r , null, 4);
    console.log(json);
});

*/



