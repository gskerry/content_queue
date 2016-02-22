var fs = require('fs');

var path = 'today'

var files = fs.readdirSync(path)

// console.log(files);

console.log("typeof files: ",typeof files);

files.map(function(file){
	console.log("file: ", file)
})