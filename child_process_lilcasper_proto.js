
var spawn_promise = function(){
	return new Promise(function(resolve, reject){

		var spawn = require('child_process').spawn;

		var lilcasper = spawn('casperjs', ['--version'])

		lilcasper.stdout.on('data', (data) => {
		  console.log(`stdout: ${data}`);
		});

		lilcasper.stderr.on('data', (data) => {
		  console.log(`stderr: ${data}`);
		  reject(data)
		});

		lilcasper.on('close', (code) => {
		  console.log(`child process exited with code ${code}`);
		  resolve(code);
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