#!/usr/bin/env node

const chalk = require('chalk');
const fs = require('fs');
const util = require('util');
const format = util.format;

const exec = require('child_process').exec;

var npmInit = 'npm init -f';

var devDeps = [
'babel-core',
'babel-loader',
'babel-preset-es2015',
'babel-preset-react',
'css-loader',
'file-loader',
'node-sass',
'open-browser-webpack-plugin',
'sass-loader',
'source-map-loader',
'style-loader',
'url-loader',
'webpack',
'webpack-dev-server'
];

var installDevDeps = format('npm install --save %s', devDeps.join(" "));

var deps = [
'react',
'react-dom'
]
var installDeps = format('npm install --save %s', deps.join(" "))

const args = process.argv;

const log = console.log;


function success(msg) {
	log(chalk.green(msg));
}

function makeDir(path, mask, cb) {
	// allow mask to be optional
	if (typeof mask == 'function') {
        cb = mask;
        mask = 0777;
    }
    fs.mkdir(path, mask, (err) => {
    	if (err) {
    		if (err.code == 'EEXIST'){
    			cb(null);
    		}
    		else {
    			cb(err);
    		}
    	}else {
    		cb(null);
    	}
    });

}
function makeDirectory(folderName) {
	makeDir(__dirname + folderName, (err) => {
		if(err) {
			log(chalk.yellow(error));
		} else {
			success(format('folder %s made in %s', folderName, __dirname));
		}
	});
}
function runCommand(command) {
	exec(command, (error, stdout, stderr) => {
		if (error){
			log('error', error);
		}
		if (stdout) {
			success(stdout);
		}
		if (stderr) {
			log(chalk.orange(stderr));
		}
	});
}


makeDirectory('src');

runCommand(npmInit);

runCommand(installDevDeps);

runCommand(installDeps);
