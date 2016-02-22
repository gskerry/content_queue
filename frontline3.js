var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/test';

var results = [];

var insertDocument = function(db, array, callback) {
	db.collection('seed_2_tests').insertMany( 
		array,
		function(err, result) {
			assert.equal(err, null);
			console.log("Inserted documents: ", results);
			callback();
		}
	);
};

var scrape_promise = new Promise(function(resolve, reject){

	fs.readFile('index.html', 'utf8', function(err, data){
		if(err){ 
			reject(err) 
		} else {

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
			resolve(results);
			// console.log("results: ",results[0])

		} // close IF
	}); // close read

});

scrape_promise.then(function(complete_results){

	// console.log("complete_results: ", complete_results)
	
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		insertDocument(db, complete_results, function() {
			db.close();
		});
	});

})

/*var list = function () {
  return _.clone(results);
};

module.exports = { list: list };*/