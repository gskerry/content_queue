var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/test';


var upsert_promise = function(db, ref, doc) {

	return new Promise(function(resolve, reject){
		db.collection('seed_2_tests').replaceOne( 
			{ href: ref },
			doc,
			{ upsert: true },
			function(err, result) {
				if(err){
					reject(err)
				} else {
					console.log("resolved. doc inserted.");	
					resolve(result)	
				} //close if
			} // close replace cb
		); // close mongo.replace
	}) // close promise
}; // close upsert_promise

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

			var promise_ray = complete_results.map( (doc) => { return upsert_promise(db, doc.ref, doc)} )
			console.log("promise_ray[0]: ", promise_ray[0])

			Promise.all(promise_ray)
			.then(function(){
					console.log("close db here...")
					db.close();
				}
			)

		});

	})
	.then(function(){
		console.log("close db here...")
		db.close();
	})


/*var list = function () {
  return _.clone(results);
};

module.exports = { list: list };*/

