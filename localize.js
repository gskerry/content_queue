var fs = require('fs');
var request = require('request');

request('http://www.pbs.org/wgbh/pages/frontline/view/', function (error, response, html) {


// *********************
// Analyze raw html
// *********************

	// console.log(response);
	// console.log(html);

	fs.appendFile('index.html', html, function (err) {
		if (err) console.log(err);
		console.log('yanked!');
	});

}) // close REQUEST call