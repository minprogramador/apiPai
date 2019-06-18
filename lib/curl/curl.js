"use strict";

const request = require('request');

let headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'User-Agent': 'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0)'
};

var configCurl = {
    options: {
        method: 'GET',
        url: null,
        proxy: null,
        headers: headers,
        rejectUnauthorized: false,
        encoding: 'binary',
        timeout: 10000
    }
};

module.exports = function(value) {

    configCurl = Object.assign(configCurl, value);

    const setUrl = url => {
        configCurl.options.url = url;
    };

    const setPost = payload => {
        configCurl.options.method = 'POST';
        configCurl.options.form = payload;
    };

    const setHeaders = payload => {
        configCurl.options.headers = Object.assign(configCurl.options.headers, payload);
    }

    const setProxy = proxy => {
        configCurl.options.proxy = proxy;
    };

    const getProxy = _ => {
        return configCurl.options.proxy;
    };

    const setCookie = cookie => {
        configCurl.options.headers['Cookie'] = cookie;
    };

    const getCookie = _ => {
        try{
            return configCurl.options.headers['Cookie'];
        }catch(e){
            return false;
        }
    };

    const setRef = ref => {
        configCurl.options.headers['Referer'] = ref;
    };

    const getRef = _ => {
        return configCurl.options.headers['Referer'];
    };

    const get = async () => {
        console.log(await exec());
    }

    const getOpts = () => {
        return configCurl.options;
    };

    const getConfig = function() {
        return configCurl;
    };

    const exec = function (options) {
        return new Promise((resolve, reject) => {
            request(options, (error, response, body) => {
                if(error) {
                    reject({err: error});
                }else{
                    resolve({body:body, headers: response.headers});
                }
            });
        });
    };

    const run = async (debug=false) => {
//        console.log(getOpts());
        try {
            let res = await exec(getOpts());
            return res;
        }catch(e) {
            return false;
        }
    };

    return { setUrl, setProxy, getProxy, setCookie, getCookie, setRef, getRef, setPost, setHeaders, getOpts, run, getConfig }
};

