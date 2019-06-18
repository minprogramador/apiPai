"use strict";

const Curl = require('../curl');
const Util = require('../util');
const isset = require('../util/isset.js');
const dadosPai = require('../../config/dadosPai.json');


module.exports = async () => {
    const Utill = new Util();
    const curl = new Curl();

    curl.setUrl(dadosPai.getCaptcha.url);
    curl.setProxy(dadosPai.proxy);
    curl.setCookie('');

    var dados;
    try{
	    dados = await curl.run();
	}catch(e) {
		dados = false;
	}

	if(!isset(dados)) {
		return false;
	}else if(isset(dados.headers) && isset(dados.body)) {
        let cookie = Utill.getCookie(dados.headers);
        let img    = Utill.getImg(dados.body);
        //console.log(cookie);
        return {img: img, cookie: cookie};
	}else{
		return false;
	}
};