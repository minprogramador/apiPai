"use strict";
const fs   = require('fs');
const Util = function () {};


Util.prototype.strippedString = function(str) {
	return str.replace(/(<([^>]+)>)/ig,"");
};

Util.prototype.xss = function(str) {
    str = util.addslashes(str);
    str = util.strippedString(str);
    str = escape(str);
    return str;
}

Util.prototype.addslashes = function(str) {
    str = str.replace(/\\/g, '\\\\');
    str = str.replace(/\'/g, '\\\'');
    str = str.replace(/\"/g, '\\"');
    str = str.replace(/\0/g, '\\0');
    return str;
};

Util.prototype.valCpf = function(doc) {
    console.log(`debug:\n${doc}\n\n\n`);
	return /^(([0-9]{11}))$/.test(doc);
};


Util.prototype.convertMileSec = function(x) {
	return (x * 1000);
}

Util.prototype.sleep = function (x) {
	x = this.convertMileSec(x);
	return new Promise(resolve => {
		setTimeout(() => {
			resolve(x);
		}, x);
	});
};

Util.prototype.log = function (msg='?') {
  console.log(msg);
};

Util.prototype.getCookie = (headers) => {
	
	if(typeof headers['set-cookie'] === 'object')
	{
		var i,ARRcookies=headers['set-cookie'];
		var ccoks = '';
		for (i=0;i<ARRcookies.length;i++)
	    {
	    	if(ARRcookies[i].includes(';'))
	    	{
	    		var cclimpo = ARRcookies[i].split(";");
	    		cclimpo = cclimpo[0];
	    		ccoks += ` ${cclimpo};`;
	    	}
	     }

	     if(ccoks === '') {
	     	ccoks = false;
	     }else{
	     	ccoks = ccoks.trim();
	     }

	     return ccoks;
	}else{
		return false;
	}
};


Util.prototype.getImg = (body) => {
	let img = Buffer.from(body, 'binary').toString('base64');
	return `data:image/png;base64,${img}`;
}

Util.prototype.checkType = (headers) => {
	try{
		if(headers['content-type'] !== 'image/png') {
			return false;
		}else{
			return true;
		}
	}catch(e) {
		return false;
	}
};

Util.prototype.trataRes = function(r) {
	if(r.indexOf('OK|') > -1) {
		let rr = r.split("|");
		return rr[1];
	}else if(r.indexOf('ERROR_CAPTCHA_UNSOLVABLE') > -1) {
		return 'error';
	}
	return false;
};

Util.prototype.Fail = () => {
    return new Promise((resolve, reject) => {
		setTimeout(() => {
			reject('errou');
		}, 1000);
    });
};

Util.prototype.msToTime = (duration) => {
	var milliseconds = parseInt((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

	hours = (hours < 10) ? "0" + hours : hours;
	minutes = (minutes < 10) ? "0" + minutes : minutes;
	seconds = (seconds < 10) ? "0" + seconds : seconds;

	return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
};

Util.prototype.save = function(data, arquivo) {
	return new Promise((resolve, reject) => {
		fs.writeFile(arquivo, data, (err) => {
			if (err){
				reject(err);
			}else{
		  		resolve("Successfully Written to File.");
			}
		});
	});
}

// Util.prototype.now = () => {
// 	return new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
// };

Util.prototype.now = () => {
	return new Date().toLocaleString("pt-BR",{timeZone:"America/Sao_Paulo"});
}

module.exports = Util;
