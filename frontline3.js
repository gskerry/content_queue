var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var _ = require('underscore');

var results = [];

// request('http://www.pbs.org/wgbh/pages/frontline/view/', function (error, response, html) {
// 	if (!error && response.statusCode == 200) {
		
// 		// console.log(html);
// 		var $ = cheerio.load(html);
		
// 		// var domain = 'http://www.pbs.org'

// 	// ***********
// 	} // close IF
// }); // close request
// 	// ***********


fs.readFile('index.html', 'utf8', function(err, data){
	if (!err) {

		var $ = cheerio.load(data);

		$('a.list__item').each(function(i, el){
			tempObj = {}
			tempObj.dex = i;

			// results[i] = el
			tempObj.href = el.attribs.href;
			tempObj.img = el.children[1].children[1].children[1].attribs.src;
			tempObj.huh = el.children[1].children[3].children[0]; 
			
			results[i] = tempObj
		});

		console.log("results: ",results[0])
		
		
	} // close IF
}); // close read

var list = function () {
  return _.clone(results);
};

module.exports = { list: list };

