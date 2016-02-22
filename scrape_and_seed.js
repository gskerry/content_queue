var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/test';

var results = [];

var upsertDoc = function(db, ref, doc, callback) {
	db.collection('seed_2_tests').replaceOne( 
		{ href: ref },
		doc,
		{ upsert: true },
		function(err, result) {
			assert.equal(err, null);
			console.log("Inserted document: ", result);
			callback();
		}
	);
};

MongoClient.connect(url, function(err, db) {
	assert.equal(null, err);
	console.log("mongo connected.");
	var scrape_promise = new Promise(function(resolve, reject){

		fs.readFile('index2.html', 'utf8', function(err, data){
			if(err){ 
				reject(err); 
			} else {

				console.log("reading file...");
				var $ = cheerio.load(data);

				var hits = $('a.list__item').get().length
				console.log("hits: ", hits);

				$('a.list__item').each(function(i, el){
					console.log("entry # : ", i)
					tempObj = {}
					tempObj.dex = i;
					tempObj.title = $(this).find($('.list__copy.list-hed')).text();
					tempObj.date = $(this).find($('.list__copy.small-caps-copy')).text();
					tempObj.href = $(this)[0].attribs.href;
					tempObj.img = $(this).find($('.list__img')).children().attr('src')
					// console.log("tempObj: ", tempObj)

					console.log("upserting doc... (not really)");
					upsertDoc(db, tempObj.href, tempObj, function() {
						console.log("added doc.")
					});

				}); // close each

				resolve();
				
			} // close IF
		}); // close read
	}); // close promise

	scrape_promise.then(function(){
		console.log("closing db...");
		// db.close();	
	})

});

/*var list = function () {
  return _.clone(results);
};

module.exports = { list: list };*/