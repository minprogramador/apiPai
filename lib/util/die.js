"use strict;";

module.exports = (str) =>  {

	if(typeof str === 'boolean') {
		console.log(`-->debug: ${str}\n--> die.`);
	}else if(str) {
		if(typeof str === 'object') {
			console.log('->debug: %O\n-> die;', str);
		}else{
			console.log('-->debug: %s\n--> die.', str);
		}
	}
//	console.log(typeof str);
	process.exit(1);
};

// console.log('hello world');
// // Prints: hello world, to stdout
// console.log('hello %s', 'world');
// // Prints: hello world, to stdout
// console.error(new Error('Whoops, something bad happened'));
// // Prints: [Error: Whoops, something bad happened], to stderr

// const name = 'Will Robinson';
// console.warn(`Danger ${name}! Danger!`);
// // Prints: Danger Will Robinson! Danger!, to stderr