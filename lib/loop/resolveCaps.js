"use strict;";

const resolveCapsPendentes = require('./resolveCapsPendentes.js');
const isset = require('../util/isset.js');

var goresolveCaps;
var statusresolveCaps = 'off';
var crudresolveCaps;
var configCap;

exports.getStatus = () => {
	return statusresolveCaps;
};

exports.setConfig = (crud) => {
	crudresolveCaps = crud;
}

exports.setConfigCap = (config) => {
	configCap = config;
}

const getConfig = () => {
	return crudresolveCaps;
}

exports.loop = (x) => {
	if(x === 'on' && statusresolveCaps === 'off') {
		statusresolveCaps = 'on';
		var i = 0;
		goresolveCaps = setInterval(async () => {
			if(typeof crudresolveCaps !== 'object') {
				console.log('falta o CRUD %s', typeof crudresolveCaps);
				console.log(getConfig());
			}else{

				let valresolvcaps = await resolveCaps();
				if(typeof valresolvcaps === 'string') {
					if(valresolvcaps === 'stop') {
						clearInterval(goresolveCaps);
					}
				}
				//console.log('aquiiii --->>> %s', valresolvcaps);
			}
//			console.log(i++);

		}, (5 * 1000));
	}else{
		if(statusresolveCaps === 'on') {
			statusresolveCaps = 'off';
			clearInterval(goresolveCaps);
		}
	}
};

const resolveCaps = async() => {	
	var capVerOkCount = 0;

	const msg = await crudresolveCaps.getCapVerificQuaseOk();

	if(isset(msg) && isset(msg.rows)) {
		capVerOkCount = parseInt(msg.rows.length);
	}

	if(capVerOkCount > 0) {

		const promises = msg.rows.map(async (payload, idx) => {
			
			let x = await resolveCapsPendentes(payload, configCap);

			if(isset(x) && isset(x.status)) {
				await crudresolveCaps.up(x, payload.id);
				return 'ok';
			}else if(isset(x)) {
				if(x === true){
					return 'ok';
				}else if(x === 'continue') {
					return 'continuar';
				}else if(x === false){
					return 'nada';
				}else{
					return 'diferente';
				}
			}else{
				return 'nada';
			}
		});

		let resAll = await Promise.all(promises);
		return resAll;
	}else{
		return 'stop';
	}
}
