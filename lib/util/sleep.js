"use strict;";


const convertMileSec = function(x) {
	return (x * 1000);
};

const sleep = function (x) {

	x = convertMileSec(x);
	return new Promise(resolve => {
		setTimeout(() => {
			resolve(x);
		}, x);
	});
}

module.exports = async (sec) => {
	await sleep(sec);
};

