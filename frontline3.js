var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var _ = require('underscore');

var results = [];

fs.readFile('index.html', 'utf8', function(err, data){
	if (!err) {

		var $ = cheerio.load(data);

		var howmanyhits = $('a.list__item').get().length
		console.log("howmanyhits: ", howmanyhits);
		var testcase = $('a.list__item').first();
		var testcase = $('a.list__item').get(0);
		console.log("typeof testcase: ", typeof testcase);
		console.log("testcase: ", testcase);

		$('a.list__item').each(function(i, el){
			tempObj = {}
			tempObj.dex = i;

			// results[i] = $(this).eq(0);
			tempObj.href = $(this).attribs.href;
			tempObj.href = $(this)[0].attribs.href;
			tempObj.img = $(this)[0].children[1].children[1].children[1].attribs.src;
			tempObj.huh = $(this)[0].children[1].children[3].children[0].text(); 
			
			results[i] = tempObj
		});

		console.log("results: ",results[0])
		
		
	} // close IF
}); // close read

var list = function () {
  return _.clone(results);
};

module.exports = { list: list };

