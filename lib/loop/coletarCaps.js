"use strict;";

const resolveCaps = require('../loop/resolveCaps.js');
const isset  = require('../util/isset.js');
const Pai    = require('../pai/pai.js');

var gocoletarCaps;
var statuscoletarCaps = 'off';
var crudcoletarCaps;

const pai  = new Pai();

exports.getStatus = () => {
	return statuscoletarCaps;
};

exports.setConfig = (crud) => {
	crudcoletarCaps = crud;
	resolveCaps.setConfig(crud);
}

exports.setConfigCap = (config) => {
	resolveCaps.setConfigCap(config);
}

const getConfig = () => {
	return crudcoletarCaps;
}

exports.loop = (x) => {

	if(x === 'on' && statuscoletarCaps === 'off') {
		statuscoletarCaps = 'on';
		var i = 0;
		gocoletarCaps = setInterval(async () => {
			if(typeof crudcoletarCaps !== 'object') {
				console.log('falta o CRUD %s', typeof crudcoletarCaps);
				console.log(getConfig());
			}else{
				let valcapsok = await coletarCaps();
				if(typeof valcapsok === 'string') {
					if(valcapsok === 'stop') {
						console.log('valcapsok parado, ativou resolveCaps. ->');
						clearInterval(gocoletarCaps);
						
						resolveCaps.loop('on');
					}
				}
				console.log('r: valcapok --> %s lin 49 ~ coletarCaps.js',valcapsok);
			}
			console.log(i++);

		}, (5 * 1000));
	}else{
		if(statuscoletarCaps === 'on') {
			statuscoletarCaps = 'off';
			clearInterval(gocoletarCaps);
			resolveCaps.loop('off');
		}
	}
};


const verificaRetorno = (dadoscps) => {
	if(isset(dadoscps) && isset(dadoscps.cookie)) {
		return true;
	}else{
		return false;
	}
};

const coletarCaps = async() => {	

	var dadoscps = '';
	var tt = 0;

	const totalAt = await crudcoletarCaps.getporStatus(1);
	var totalAtcount;
	if(isset(totalAt) && isset(totalAt.rows)) {
		totalAtcount = parseInt(totalAt.rows.length);
	}else{
		totalAtcount = parseInt(0);
	}

	if(totalAtcount >= 2) {
		return 'stop';
	}else{
		const totalAt2 = await crudcoletarCaps.getCapVerificQuaseOk();
		var totalAtcount2;

		if(isset(totalAt2) && isset(totalAt2.rows)) {
			totalAtcount2 = parseInt(totalAt2.rows.length);
		}else{
			totalAtcount2 = parseInt(0);
		}

		if(totalAtcount2 >= 2) {
			return 'stop';
		}else{
			try{
				dadoscps = await pai.getCaptcha();
				if(isset(dadoscps)) {
					if(verificaRetorno(dadoscps)) {
						try{
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
							let vai = await crudcoletarCaps.add(data);
							console.log('linha --------> 56');
							return true;

						}catch(e){
							console.log('linha --------> 59');
							return false;
						}
					}else{
						console.log('linha --------> 63');
						return false;
					}
				}else{
					console.log('linha --------> 69');
					return false;
				}
			}catch(e){
				console.log(`rolou um erro no cath, 74..`);
				return false;
			}

		}
	}

};
