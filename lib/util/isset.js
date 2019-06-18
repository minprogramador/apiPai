"use strict;";

//modulo isset.js

/*
typeof ->
	function
	undefined
	boolean
	object
	string
	number
*/

module.exports = (str) =>  {
	if(str) {
		if(typeof str === 'object') {
			if(Object.keys(str).length === 0) {
				return false;
			}else{
				return true;
			}
		}else if(typeof str === 'function') {
			return false;
			console.log(`\n---> debug isset, ta tentando validar uma funcao ???\n`);
		}else{
			return true;
		}
	}else{
		return false;
	}
};