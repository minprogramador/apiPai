"use strict";

const isset = require('../util/isset.js');
const Curl = require('../curl');
const dadosPai = require('../../config/dadosPai.json');
const filtroRes = require('./filtroConsulta.js');

module.exports = async (dados) => {
    const curl = new Curl();
    curl.setProxy(dadosPai.proxy);
	

    dadosPai.consultar.headers['Cookie'] = dados.cookie;
    dadosPai.consultar.payload['nome']   = dados.nome;
    dadosPai.consultar.payload['dataNascimento'] = dados.data;
    dadosPai.consultar.payload['nomeMae'] = dados.mae;
    dadosPai.consultar.payload['captcha'] = dados.cap;
    
    curl.setUrl(dadosPai.consultar.url);
    curl.setPost(dadosPai.consultar.payload);
    curl.setHeaders(dadosPai.consultar.headers);

    let xx = await curl.run('true');
    var msg    = '';
    var msgOk  = '';
    var msgsave = '';
    let body   = xx.body;

    if(body === undefined) {
        msg = 'fail';
    }else {
        const myObject = dadosPai.consultar.check;

        for (var i =0; i < myObject.length; i++) {
            try{
                if(body.includes(myObject[i].pergunta) === true) {
                    msgOk = myObject[i].resposta;
                    msg = myObject[i].pergunta;
                    break;
                }
            }catch(e) {
                msg = 'indefinido';
            }
        }
    }

    msgsave = msg;

    if(msgOk === '') {
        msg = `indefinido`;
        msgsave = msg;
    }else if(msgOk === 'oktest') {
        return 'oktest';
    }
    else if(msgOk === 'ok') {
        msgsave = msg;
        msg = filtroRes(body, dados.doc);
    }else{
        msg = msgOk;
        msgsave = msg;
    }


    return msg;
};