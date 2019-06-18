"use strict";

const isset = require('../util/isset.js');


module.exports = function(text, doc) {

	if(!isset(text)) {
		return false;
	}

	text = text.replace(/(\r\n|\n|\r|\t|<b>|<\/b>)/gm, '');
	let regex  = text.match(/<td.align=\'left\'>(.*?)\b<\/td>/g);

	let result = regex.map(function(val) {
	    return val.replace(/<[^>]*>/g, '');
	});
	if(isset(result) && isset(result[4])) {
		let dados = {
		    'doc': doc,
		    'titulo': result[0],
		    'nome': result[1],
		    'data': result[2],
		    'mae': result[3],
		    'pai': result[4]
		};
		return dados;
	}else{
		return false;
	}
};