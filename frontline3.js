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

		$('a.list__item').each(function(i, el){
			tempObj = {}
			tempObj.dex = i;

			tempObj.title = $(this).find($('.list__copy.list-hed')).text();
			tempObj.date = $(this).find($('.list__copy.small-caps-copy')).text();
			tempObj.href = $(this)[0].attribs.href;
			tempObj.img = $(this).find($('.list__img')).children().attr('src')
			
			results[i] = tempObj
		});

		console.log("results: ",results[0])
		
		
	} // close IF
}); // close read

var list = function () {
  return _.clone(results);
};

module.exports = { list: list };

