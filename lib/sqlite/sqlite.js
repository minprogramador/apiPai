"use strict";

var sqlinit = `
CREATE TABLE user (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
    name text, 
    email text UNIQUE, 
    password text, 
    CONSTRAINT email_unique UNIQUE (email)
);`;

var configdb = {
	tabela: null,
	file: 'db.sqlite'
};

var db;

exports.getBd = function() {
	return db;
}
module.exports = function(value) {

	configdb = Object.assign(configdb, value);

	db = require("./database.js")(configdb.file);

	const install = function(nsql='') {
		if(nsql !== '') {
			sqlinit = nsql;
		}

		return new Promise(function (resolve, reject) {
		    db.run(sqlinit, (err) => {
		        if (err) {
		        	reject({'error':err});
		        }else{
		        	resolve({msg: 'database criada com sucesso!'});
		        }
		    });
		});
	};

	const getporStatus = function(status) {
		let sql = `select * from ${configdb.tabela} where status= ?`;
		return new Promise(function (resolve, reject) {
			db.all(sql, [status], (err, rows) => {
				if (err) {
					reject({'error': err});
				} else {
			        resolve({statement: this, rows: rows});
				}
			});
		});
	};

	const getCapVerificQuaseOk = function() {
		let sql = `select * from ${configdb.tabela} where status IN(2,3)`;
		return new Promise(function (resolve, reject) {
			db.all(sql, [], (err, rows) => {
				if (err) {
					reject({'error': err});
				} else {
			        resolve({statement: this, rows: rows});
				}
			});
		});
	};


	const getCapVerific = function() {
		let sql = `select * from ${configdb.tabela} where solucao !='' and status IN(1,3)`;
		return new Promise(function (resolve, reject) {
			db.all(sql, [], (err, rows) => {
				if (err) {
					reject({'error': err});
				} else {
			        resolve({statement: this, rows: rows});
				}
			});
		});
	};

	
	const getAll = function() {
		let sql = `select * from ${configdb.tabela}`;
		return new Promise(function (resolve, reject) {
			db.all(sql, [], (err, rows) => {
				if (err) {
					reject({'error': err});
				} else {
			        resolve({statement: this, rows: rows});
				}
			});
		});
	};

	const getId = function(id) {
		let sql = `select * from ${configdb.tabela} where id = ?`;
	    let params = [id];

		return new Promise(function (resolve, reject) {
			db.get(sql, params, (err, rows) => {
				if (err) {
					reject({'error': err});
				} else {
			        resolve({statement: this, rows: rows});
				}
			});
		});
	};

	const add = function(data) {
		let keys = Object.keys(data).join(', ');
		let vals = Object.values(data);

		let valn = new Array(vals.length).join( '?,');

	    let sql =`INSERT INTO ${configdb.tabela} (${keys}) VALUES (${valn}?)`;

		return new Promise(function (resolve, reject) {
			db.run(sql, vals, (err, result) => {
				if (err) {
					reject({'error': err});
				} else {
			        resolve({
			            "message": "success",
			            "data": data
	    			});
				}
			});
		});
	};

	const count = function(id) {

		let sql = `UPDATE ${configdb.tabela} set count=count+1 WHERE id=${id}`;

		return new Promise(function (resolve, reject) {
			db.run(sql, [], (err, result) => {
				if (err) {
					reject({'error': err});
				} else {
			        resolve({
			            message: "success",
			            changes: db.changes
			        });
				}
			});
		});
	};

	const up = function(data, id) {

		let keys = Object.keys(data);
		let vals = Object.values(data);
		//vals.push(id);

		const rebels = keys.map(function (pilot) {
			return `${pilot} = COALESCE(?,${pilot})`;
		});
		let keysload = rebels.join(', ');

		let sql = `UPDATE ${configdb.tabela} set ${keysload} WHERE id =${id}`;
		let params = vals;
		// console.log(sql);
		// console.log(params);
		return new Promise(function (resolve, reject) {
			db.run(sql, params, (err, result) => {
				if (err) {
					reject({'error': err});
				} else {
			        resolve({
			            message: "success",
			            data: data,
			            changes: db.changes
			        });
				}
			});
		});
	};

	const del = function(id){
		let sql = `DELETE FROM ${configdb.tabela} WHERE id = ?`;

		return new Promise(function (resolve, reject) {
			db.run(sql, id, function (err, result) {
		        if (err){
		        	reject({"error": err.message});
		        }else{
			        resolve({"message":"deleted", changes: db.changes});
		    	}
		    });
	    });
	};

	const getConfig = function() {
		return configdb;
	};


	return { install, getConfig, getAll, getId, add, up, del, getporStatus, getCapVerific,getCapVerificQuaseOk, count }
}

