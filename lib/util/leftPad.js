"use strict;";

module.exports = function (value, totalWidth, paddingChar) {
	let length = totalWidth - value.toString().length + 1;
	return Array(length).join(paddingChar || '0') + value;
};


//#exemplo.
// leftPad(1, 4); // 0001
// leftPad(12, 4); // 0012
// leftPad(123, 4); // 0123
// leftPad(1234, 4); // 1234
// leftPad(12345, 4); // 12345
