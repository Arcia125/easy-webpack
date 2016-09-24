#!/usr/bin/env node

const chalk = require('chalk');
const fs = require('fs');
const util = require('util');
const path = require('path');

const format = util.format;
const exec = require('child_process').exec;

const args = process.argv;
const log = console.log;
const cd = process.cwd();


// npm dev dependencies
let devDeps = [
'babel-core',
'babel-loader',
'babel-preset-es2015',
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


// npm dependencies
let deps = [
];

// commands
let npmInit = 'npm init -f';
let gitInit = 'git init';
let installDevDeps = format('npm install --save-dev %s', devDeps.join(" "));
let installDeps = format('npm install --save %s', deps.join(" "));

let commands = [installDevDeps, installDeps, gitInit];

function success(msg) {
	log(chalk.green(msg));
}

function makeDir(filepath, mask, cb) {
	// allow mask to be optional
	if (typeof mask == 'function') {
        cb = mask;
        mask = 0777;
    }
    //make the directory
    fs.mkdir(filepath, mask, (err) => {
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
	makeDir(path.join(cd, folderName), (err) => {
		if(err) {
			log(chalk.yellow(error));
		} else {
			success(format('folder %s made in %s', folderName, cd));
		}
	});
}

function initCommand(command, callback) {
	exec(command, {cwd: cd}, (error, stdout, stderr) => {
		if (error) {
			log('error with init: ', error);
			process.exit(1);
		}
		if (stdout) {
			success(stdout);
			callback();
		}
		if (stderr) {
			log(chalk.red(stderr));
		}
	});
}

function runCommand(command) {
	exec(command, {cwd: cd}, (error, stdout, stderr) => {
		if (error){
			log('error', error);
		}
		if (stdout) {
			success(stdout);
		}
		if (stderr) {
			log(chalk.red(stderr));
		}
	});
}

function runAllCommands() {
	commands.forEach(runCommand);
}

function firstCommit() {
	runCommand(gitCommit);
}
function copyFile(source, target, cb) {
  let cbCalled = false;

  let rd = fs.createReadStream(source);
  rd.on("error", function(err) {
    done(err);
  });
  let wr = fs.createWriteStream(target);
  wr.on("error", function(err) {
    done(err);
  });
  wr.on("close", function(ex) {
    done();
  });
  rd.pipe(wr);

  function done(err) {
    if (!cbCalled) {
      cb(err);
      cbCalled = true;
    }
  }
}




initCommand(npmInit, runAllCommands);

makeDirectory('src');

copyFile(path.join(__dirname, 'webpack.config.js'), path.join(cd, 'webpack.config.js'), (err) => {
	if (err) {
		log(err);
	}
});
