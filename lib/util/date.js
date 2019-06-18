"use strict;";

module.exports = (timestamp=Date.now(), lang='pt-BR') =>  {

   let dateObj = new Date(timestamp);
	   
   return dateObj.toLocaleString(lang, {
       year: 'numeric',
       month: '2-digit',
       day: '2-digit',
       hour: '2-digit',
       minute:'2-digit',
       second:'2-digit'
   }).replace(/\//g, '-')
};

/*

console.log('formato pt-BR: ', Format(Date.now(), 'pt-BR'))
console.log('formato en-US: ', Format(Date.now(), 'en-US'))
console.log('formato en-GB: ', Format(Date.now(), 'en-GB'))

*/