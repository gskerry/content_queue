/*
var execFile = require('child_process').execFile;

var child = execFile('node', ['--version'], (error, stdout, stderr) => {
  if (error) {
    throw error;
  }
  console.log(stdout);
});
*/

// ***********
// ***********

/*
var execFile = require('child_process').execFile;

var child = execFile('casperjs', ['--version'], (error, stdout, stderr) => {
  if (error) {
    throw error;
  }
  console.log(stdout);
});
*/

// O.K.

/*
var execFile = require('child_process').execFile;

var child = execFile('casperjs', ['scrape_traverse.js'], (error, stdout, stderr) => {
  if (error) {
    throw error;
  }
  console.log(stdout);
});
*/

// ENOENT error


// ***********
// SPAWN
// ***********

/*
var spawn = require('child_process').spawn;

var lilcasper = spawn('casperjs', ['--version'])

lilcasper.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

lilcasper.stderr.on('data', (data) => {
  console.log(`stderr: ${data}`);
});

lilcasper.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
*/

// lilcasper.on('exit', (code) => {
//   console.log(`child process exited with code ${code}`);
// });

// O.K.

// ***********

var spawn = require('child_process').spawn;

var lilcasper = spawn('casperjs', ['scrape_traverse.js'])

lilcasper.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

lilcasper.stderr.on('data', (data) => {
  console.log(`stderr: ${data}`);
});

lilcasper.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});

