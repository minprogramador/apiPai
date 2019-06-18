const Curl = require('../Curl');
const isset = require('././isset.js');


module.exports = async (url='', cookie='', post='', ref='', proxy='', headers='') => {

	const curl = new Curl();

	if(!isset(url)) {
		return `\n#curl -> ERRROR ---> sete uma url (url, cookie, post, header, ref, proxy\n`;
	}

	curl.setUrl(url);

	if(isset(ref)) {
		curl.setRef(ref);
	}

	if(isset(cookie)) {
		curl.setCookie(cookie);
	}

	if(isset(post)) {
		curl.setPost(post);
	}

	if(isset(headers)) {
		curl.setHeaders(headers);		
	}

	if(isset(proxy)) {
		curl.setProxy(proxy);
	}
	
	try{
		return await curl.run();
	}catch(e){
		return {body: null, headers: null, msg: e};
	}

	// let a = curl.getConfig();
	// console.log(a);



// console.log(url);
// console.log(cookie);
// console.log(post);
// console.log(header);
// console.log(ref);
// console.log(proxy);

};