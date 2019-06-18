"use strict;";


// parte 3!
// 	let x = await resolveCapsPendentes(payload, configCap);
// 							//#returns..
// 							//true 				== dados validos == tudo okk.
// 							//object 			== salvar no banco de dados.
// 							//false 			== nenhum retorno, nada a fazer !!! --- status = 4
// 							//continue 		== continuar loop, atraz da solucao.


module.exports = async (payload, configCap) => {

	const captcha = require('../captcha/captcha.js');
	const isset   = require('../util/isset.js');
	const die     = require('../util/die.js');

	const Cap  = new captcha(configCap);

	const resCapsp1 = (payload) => {
		if(isset(payload) && isset(payload.solucao) && isset(payload.key)) {
			if(isset(payload.status === 4)) {
				return false;
			}else if(payload.solucao === 'error') {
				payload.status = 4;
				return payload;
			}else if(payload.status !== 1) {
				payload.status = 1;
				return payload;
			}else {
				return true;
			}
		}else{
			return false;
		}
	};

	const resCapsp2 = async (payload) => {
		if(isset(payload) && isset(payload.key) && !isset(payload.solucao)) {
			try{
				let rescheck = await Cap.verificar(payload.key);
				if(isset(rescheck)) {
					if(rescheck.solucao === 'error') {
						payload.status = 4;
					}else if(rescheck.solucao.length > 1){
						payload.status = 1;
					}
				}
				return Object.assign(payload, rescheck);
			}catch(e) {
				return payload;
			}
		}else{
			return false;
		}
	};

	const resCapsp3 = async (payload) => {
			if(isset(payload) && isset(payload.img) && !isset(payload.key)) {
				try {
					let nkeycap = await Cap.send(payload.img);
					if(isset(nkeycap)) {
						if(nkeycap === 'error') {
							payload.status = 4;
						}else if(nkeycap.length > 1){
							payload.status = 3;
						}
					}
					return Object.assign(payload, {key: nkeycap});
				}catch(e) {
					return 'error_send';
				}
			}else{
				return false;
			}
	};
	
	let etapa1 = resCapsp1(payload);

	if(etapa1) {
		return etapa1;
	}else{
		try {
			let etapa2 = await resCapsp2(payload);
			let etapa3 = await resCapsp3(payload);
			if(etapa2) {
				if(isset(etapa2.solucao === false)) {
					return 'continue';
				}else{
					return etapa2;
				}
			}else if(etapa3) {
				return etapa3;
			}else{
				return false;
			}
		}catch(e){
			return 'error';
		}
	}
};















