"use strict;";

const ColetarCaps    = require('../lib/loop/coletarCaps.js');
const RunValidarCaps = require('../lib/loop/runValidarCaps.js');
const ResolveCaps    = require('../lib/loop/resolveCaps.js');
const dados2Cap      =  require('../config/dados2Cap.json');

var bd;

exports.setConfig = (crud) => {
    setTimeout(() => {
        bd = crud;
    }, 100);
}

let configCap = {key: dados2Cap.modulos.captcha.key};

setTimeout(() => {

    RunValidarCaps.setConfig(bd);
    ColetarCaps.setConfig(bd);
    ResolveCaps.setConfig(bd);
    ResolveCaps.setConfigCap(configCap);

}, 500);


const logStatus = () => {
    let objStats = {
        'Validar Caps': RunValidarCaps.getStatus(),
        'Resolve Caps': ResolveCaps.getStatus(),
        'Coletar Caps': ColetarCaps.getStatus(),
    };
    return objStats;
};

const run = async () => {

    RunValidarCaps.loop('on');
    let vaiValidador = await RunValidarCaps.getStatus();
    if(typeof vaiValidador === 'string'){
        if(vaiValidador !== 'on'){
//            console.log('debug imediate 44 ~ %s', vaiValidador);
        }
    }else{
  //      console.log('debug imediate 47 ~ %s', vaiValidador);        
    }
};

exports.logStatus = logStatus;
exports.run = run;







