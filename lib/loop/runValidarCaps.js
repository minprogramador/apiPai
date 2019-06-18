"use strict;";

const isset = require('../util/isset.js');
const validarCaps = require('./validarCaps.js');
const coletarCaps = require('../loop/coletarCaps.js');

var govalidarCaps;
var statusvalidarCaps = 'off';
var crudrunval;

exports.getStatus = () => {
	return statusvalidarCaps;
};

exports.setConfig = (crud) => {
	crudrunval = crud;
	coletarCaps.setConfig(crud);
}

const getConfig = () => {
	return crudrunval;
}

exports.loop = (x) => {
	if(x === 'on' && statusvalidarCaps === 'off') {
		statusvalidarCaps = 'on';
		var i = 0;
		govalidarCaps = setInterval(async () => {
			if(typeof crudrunval !== 'object') {
				console.log('falta o CRUD %s', typeof crudrunval);
				console.log(getConfig());
			}else{

				let valcapsok = await validar_caps();
				if(typeof valcapsok === 'string') {
					if(valcapsok === 'runColetorCaps') {
						if(coletarCaps.getStatus() === 'off'){
							coletarCaps.loop('on');
						}
					}else if(valcapsok === 'reload') {
						if(coletarCaps.getStatus() === 'off'){
							coletarCaps.loop('on');
						}
					}else{
						console.log('é string, rodar denovo o coletarCaps...');
						if(coletarCaps.getStatus() === 'off'){
							coletarCaps.loop('on');
						}
					}
				}else if(typeof valcapsok === 'object'){
					if(valcapsok.length < 2){
						console.log('é obj, menor que 2... rodando coletor.');
						if(coletarCaps.getStatus() === 'off'){
							coletarCaps.loop('on');
						}
					}else{
						if(coletarCaps.getStatus() === 'on'){
							coletarCaps.loop('off');
							console.log('desativou coletar -> 61, runValidarcaps.js');
						}
						console.log('total de %s, ', valcapsok.length);
					}
				}
				//console.log('aquiiii --->>> %s', valcapsok);
				//console.log(typeof valcapsok);



			}
		//	console.log(i++);

		}, (90 * 1000));
	}else{
		if(statusvalidarCaps === 'on') {
			statusvalidarCaps = 'off';
			clearInterval(govalidarCaps);
		}
	}
};


const validar_caps = async() => {

		const totalAt = await crudrunval.getCapVerific();
		if(isset(totalAt)) {
			let valCaps = await validarCaps(totalAt);

			if(isset(valCaps)) {

				if(typeof valCaps !== 'object') {
					console.log('Ops, nao tem obj, validarCpas ---> %s', valCaps);
					return false;
				}else{

					let resAllvalCaps =  valCaps.map(async (d, idx) => {
						if(d.test === 'reload') {
							let uppcas = await crudrunval.up({status:4}, d.id);
							return `reload - ${d.id}`;
						}else if(d.test === true) {
							return `okk - ${d.id}`;
						}else if(d.test === 'fail') {
							return `fail - ${d.id}`;
						}else if(d.test === 'nada_encontrado') {
							return `nada_encontrado - ${d.id}`;
						}else if(d.test === 'indefinido') {
							return `indefinido - ${d.id}`;
						}else{
							return `else - ${d.id}`;
						}
					});

					try{
						return await Promise.all(resAllvalCaps);
					}catch(e){
						return false;
					}
				}

			}else{
				return 'runColetorCaps';
			}

		}else{
			return `nao tem captchas para ser testado`;
		}

};

/*
//#returns..
ok 				== fez update no bd/ou == true..
stop 			== nao tem o que resolver.
nada 			== ??
continuar == continuar loop.
nada 			== x = false

//ficar no loop ate dar stop.
*/
