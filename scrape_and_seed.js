var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/test';

var upsertDoc = function(db, ref, doc, callback) {
	db.collection('seed_2_tests').replaceOne( 
		{ href: ref },
		doc,
		{ upsert: true },
		function(err, result) {
			assert.equal(err, null);
			// console.log("Inserted document: ", result);
			console.log("document Inserted.");
			callback();
		}
	);
};

var scrape_promise = new Promise(function(resolve, reject){

	fs.readFile('index2.html', 'utf8', function(err, data){
		if(err){ 
			reject(err) 
		} else {

			var results = [];

			var $ = cheerio.load(data);

			var hits = $('a.list__item').get().length
			console.log("hits: ", hits);

			$('a.list__item').each(function(i, el){
				tempObj = {}
				tempObj.dex = i;
				tempObj.title = $(this).find($('.list__copy.list-hed')).text();
				tempObj.date = $(this).find($('.list__copy.small-caps-copy')).text();
				tempObj.href = $(this)[0].attribs.href;
				tempObj.img = $(this).find($('.list__img')).children().attr('src')

				results[i] = tempObj
			});
			console.log("first promise resolved.")
			resolve(results);
			// console.log("results: ",results[0])

		} // close IF
	}); // close read

}); // close promise

scrape_promise
	.then(function(complete_results){

		// console.log("complete_results: ", complete_results)
		console.log("complete_results sample: ", complete_results[0])
		
		MongoClient.connect(url, function(err, db) {
			assert.equal(null, err);

			console.log("upsert here. ")

			complete_results.forEach((doc) => {
				upsertDoc (db, doc.ref, doc, function(){
					console.log("added doc.")
				})
			})
		});

		// var storeStr = JSON.stringify(complete_results)
		// fs.	appendFile('frontlines4.json', storeStr, 'utf8', (err) => {
		// 	if (err) throw err;
		// 	console.log("data appended to file");
		// });

	})
	.then(function(){
		console.log("close db here...")
		db.close();
	})

/*var list = function () {
  return _.clone(results);
};

module.exports = { list: list };*/