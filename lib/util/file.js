const fs = require('fs');

const file = {};

file.path = function(doc) {
	return `.cache/${doc}.json`;
};

// const content = `{ dados:
//    { titulo: '146811140337',
//      nome: 'AMANDA JADILANIE SOUZA DE PAULA',
//      data: '06/08/1993',
//      mae: 'EDILMAR DE SOUZA TOMAZ',
//      pai: 'ARNUNCIO GOMES DE PAULA' } }`

file.find = function(doc) {
	let path = file.path(doc);

	try {
		return fs.readFileSync(path, 'utf8')
	} catch (err) {
		return false;
	}
}

file.save = function(body, doc) {
	if(typeof body === 'object') {
		body = JSON.stringify(body);
	}
	let path = file.path(doc);

	try {
		fs.writeFileSync(path, body);
		return true;
	} catch (err) {
		return false;
	}
}

module.exports = file;

// let doc = '04892693545';

// let x = file.find(doc);
// console.log(x);

// let s = bd.save(content, doc);
// console.log(s);


//console.log(JSON.stringify(x, null, 4));

//console.log(JSON.stringify(x));

//#grava arquivo.
