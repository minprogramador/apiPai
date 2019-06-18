"use strict;";

const sqlite  = require('../sqlite');

let config = {
	tabela: 'capsnovo',
	file: 'database.sqlite'
};

let crud = new sqlite(config);

setTimeout(async _ => {
	let sqlinit1 = `
	CREATE TABLE IF NOT EXISTS captchas (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		cookie text,
		img text,
		key text,
	    solucao text, 
	    start text, 
	    count INTEGER, 
	    status INTEGER
	);
	`;
	const inst = await crud.install(sqlinit1);

	console.log(inst);
},1);