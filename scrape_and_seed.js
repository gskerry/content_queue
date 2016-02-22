
var fs = require('fs');
var assert = require('assert');
// var exec = require('child_process').exec
var spawn = require('child_process').spawn;

var request = require('request');
var cheerio = require('cheerio');

var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/test';

var datepath = "";
// var datepath = "2016-1-21--2050";

var outer_ray = [];

// **********
// promises
// **********

var casper_promise = function(){
	return new Promise(function(resolve, reject){

		var spawn = require('child_process').spawn;

		var lilcasper = spawn('casperjs', ['casper_get.js'])

		lilcasper.stdout.on('data', (data) => {
		  console.log("typeof data: ",typeof data)
		  console.log("data: ",data)
		  console.log(`stdout: ${data}`);
		  var parseData = data.toString().split('\n')
		  datepath = parseData[0];
		});

		lilcasper.stderr.on('data', (data) => {
		  console.log(`stderr: ${data}`);
		  reject(data)
		});

		lilcasper.on('close', (code) => {
		  console.log(`child process exited with code ${code}`);
		  resolve(datepath);
		});

		// resolve("done.")

	});
};

var upsert_promise = function(db, ref, doc) {
	return new Promise(function(resolve, reject){

		/* 
		console.log("looking for href: "+ ref+" ...")
		var cursor = db.collection('seed_2_tests').find({ "href" : ref });
		
		cursor.each(function(err, doc) {
			assert.equal(err, null);
			
			if (doc != null) {
				console.log("found matching doc.")
				console.log(doc);
			} else {
				console.log(err);
			}
		}); 
		*/

		db.collection('seed_2_tests').replaceOne( 
			{ "href" : ref },
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


var scrape_promise_too = function(file){
	return new Promise(function(resolve, reject){

		fs.readFile('scrapes/'+datepath+'/html/'+file, 'utf8', function(err, data){
			if(err){ 
				reject(err) 
			} else {

				// var results = [];

				var $ = cheerio.load(data);

				var hits = $('a.list__item').get().length
				console.log("hits: ", hits);

				$('a.list__item').each(function(i, el){
					tempObj = {}
					// tempObj.dex = i;
					tempObj.title = $(this).find($('.list__copy.list-hed')).text();
					tempObj.date = $(this).find($('.list__copy.small-caps-copy')).text();
					tempObj.href = $(this)[0].attribs.href;
					tempObj.img = $(this).find($('.list__img')).children().attr('src')

					// results[i] = tempObj
					outer_ray.push(tempObj)
				});
				// console.log("first promise resolved.")
				// resolve(results);
				// resolve(outer_ray);
				resolve();

			} // close IF
		}); // close read

	}); //close promise
} // close fnc


// **************
// process chain
// **************


casper_promise()
	.then(function(result){

		console.log("casper promise gives : ",result)

		var files = fs.readdirSync('scrapes/'+datepath+'/html')
		console.log(files);

		var outer_promise_ray = files.map(scrape_promise_too);
		console.log("outer_promise_ray: ",outer_promise_ray);

		Promise.all(outer_promise_ray)
			.then(function(results){
				// console.log("outer_promise_ray results: ",results)
				// console.log("outer_ray: ",outer_ray)
				console.log("outer_ray sample: ",outer_ray[0])

				MongoClient.connect(url, function(err, db) {
					assert.equal(null, err);

					var inner_promise_ray = outer_ray.map( (doc) => { return upsert_promise(db, doc.href, doc)} )
					console.log("inner_promise_ray sample: ", inner_promise_ray[0])

					Promise.all(inner_promise_ray)
					.then(function(){
							console.log("close db here...")
							db.close();
						}
					)
				});

				var storeStr = JSON.stringify(outer_ray)
				fs.	appendFile('scrapes/'+datepath+'/frontlines_ALL.json', storeStr, 'utf8', (err) => {
					if (err) throw err;
					console.log("data appended to file");
				});
			})

	})
	.catch(function(error){
		console.log("promise catch error: ", error)	
	})

