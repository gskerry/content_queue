
var date = "";

var spawn_promise = function(){
	return new Promise(function(resolve, reject){

		var spawn = require('child_process').spawn;

		var lilcasper = spawn('casperjs', ['scrape_traverse.js'])

		lilcasper.stdout.on('data', (data) => {
		  console.log("typeof data: ",typeof data)
		  console.log("data: ",data)
		  console.log(`stdout: ${data}`);
		  date = data.toString();
		});

		lilcasper.stderr.on('data', (data) => {
		  console.log(`stderr: ${data}`);
		  reject(data)
		});

		lilcasper.on('close', (code) => {
		  console.log(`child process exited with code ${code}`);
		  resolve(date);
		});

	});
};


spawn_promise()
	.then(function(result){
		console.log("promise resolved: ",result)
	})
	.catch(function(error){
		console.log("promise catch error: ", error)	
	})