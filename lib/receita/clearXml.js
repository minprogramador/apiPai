"use strict;";

module.exports = (retorno) => {
//	console.log(retorno);
	if(typeof retorno !== 'string') {
		return false;
	}

	retorno = retorno.trim();
	if(!retorno.includes('<dados>')){
		return false;
	}
	if(!retorno.includes('<cpf>')){
		return false;
	}
	retorno = retorno.split('\n');
	let result = retorno.map(function(val) {
		val = val.trim();
		let k = val.replace(/<(.*)>(.*)<(.*)/g, '$1');
		let base = val.replace(/<.*>(.*)<\/.*>/g, '$1');
		if(/<.*>(.*)<\/.*>/g.test(val)) {
			return `"${k}": "${base}"`;
		}
	});

	let f = result.join(',');

	let rult = f.substring(1,(f.length)-1);
	let json = `{${rult}}`;
	try{
		return JSON.parse(json);
	}catch(e){
		return false;
	}
}

// let vai = clearXml(retorno);
// console.log(vai);



