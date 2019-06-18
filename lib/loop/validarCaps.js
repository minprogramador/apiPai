"use strict;";

module.exports = async (totalAt) => {
	const Pai     = require('../pai/pai.js');
	const isset = require('../util/isset.js');

	const testCaps = async (xx) => {
		const pai  = new Pai();

		let dados = {
			nome: '',
			data: '',
			mae: '',
			cap: xx.solucao,
			cookie: xx.cookie
		};

		if(isset(xx) && !isset(xx.solucao)) {
			return {test: false, id: xx.id};
		}else{
			let teste = await pai.test(dados);

			if(isset(teste) && teste === 'oktest') {
				return {test: true, id: xx.id};
			}else if(isset(teste)) {
				if(teste === 'nada_encontrado') {
					return {test: 'nada_encontrado', id: xx.id};
				}else if(teste === 'reload') {
					return {test: 'reload', id: xx.id};
				}else if(teste === 'indefinido') {
					return {test: 'indefinido', id: xx.id};
				}else if(teste === 'fail') {
					return {test: 'fail', id: xx.id};
				}else{
					return {test: 'fail', id: xx.id};
				}
			}else{
				return {test: 'fail', id: xx.id};
			}
		}
	};

	if(isset(totalAt) && isset(totalAt.rows)) {

		if(totalAt.rows.length > 0) {

			const promises = totalAt.rows.map(async (d, idx) => {
				return await testCaps(d);
			});
			
			try {
				return await Promise.all(promises);
			}catch(e){
				return 'error';
			}
		}else{
			return false;
		}
	}else{
		return false;
	}

}

