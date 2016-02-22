var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var _ = require('underscore');

var results_ray = [];

request('http://www.pbs.org/wgbh/pages/frontline/view/', function (error, response, html) {
	if (!error && response.statusCode == 200) {
		
		// console.log(html);
		var $ = cheerio.load(html);
		
		var domain = 'http://www.pbs.org'



// *********************
// test from cheerio doc
// *********************

	    
/*		
		$('div.list__copy.list-hed').each(function(i, element){
	    	var tempObj = {};
	    	var a = $(this);
	    	tempObj.dex = i;
	    	tempObj.att = a[0].attribs;
	    	console.log(tempObj);
	    	// console.log(a[0].attribs);
	    })
*/



// ************************************
// Test DOM traverse (from client-side)
// ************************************

/*	    
		console.log("ID: ",$('div.sh')[177].attribs.c);
	    console.log("TITLE: ",$('div.sh')[177].children[1].attribs.title);		
		console.log("LENGTH: ",$('div.sh')[177].children[0].children[0].data);

	    var domain = 'http://www.pbs.org'
	    var yuarel = domain.concat($('div.sh')[177].attribs.url)
		console.log("URL: ",yuarel);

		console.log("DATE: ",$('div.sh')[177].children[3].children[0].data);
	    
		var img = domain.concat($('div.sh')[177].children[1].children[0].attribs.src);
		console.log("img: ",img);
*/
		


// **************************************************
// Test cheerio object traversal simple property pull
// (console)
// **************************************************

/*
		$('div.sh').each(function(i, element){
			console.log("#: ",i);
			var a = $(this)[0];
			// console.log(a);
			console.log("ID: ",a.attribs.c);
			console.log("TITLE: ",a.children[1].attribs.title);
			console.log("LENGTH: ",a.children[0].children[0].data);

			var yuarel = domain.concat(a.attribs.url)
			console.log("URL: ",yuarel);

			console.log("DATE: ",a.children[3].children[0].data);

			var img = domain.concat(a.children[1].children[0].attribs.src);
			console.log("img: ",img)
		})
*/


// **************************************************
// Robust method (adapts to changes in DOM structure)
// Client DOM testing
// **************************************************

/*		var test_obj = $('div.sh')[144]
		// console.log(test_obj);
		var kids = test_obj.children;
		var chilength = test_obj.children.length
		console.log(chilength);
		
		// var id;
		
		var title;
		var length;
		// var url;
		var yuarel = domain.concat(test_obj.attribs.url)
			
		var date;
		var img;

		for(var i=0; i<chilength;i++){
			var current = kids[i]
			// console.log(current);
			// console.log(current.name);
			// console.log(current.attribs.class);

			if(current.name === 'a' && current.attribs.class === 'title'){
				title = current.attribs.title
			}
			if(current.name === 'span' && current.attribs.class === 'len'){
				length = current.children[0].data;
			}

			if(current.name === 'span' && current.attribs.class === 'dat'){
				date = current.children[0].data;
			}
			if(current.name === 'span' && current.attribs.class === 'dsc'){
				dsc = current.children[0].data;
			}
			if(current.name === 'a' && current.attribs.class === undefined){
				img = domain.concat(current.children[0].attribs.src);
			}

		}

		console.log("ID: ",test_obj.attribs.c);
		console.log("title: ",title);
		console.log("date: ",date);		
		console.log("description: ",dsc);
		console.log("length: ",length);
		console.log("URL: ",yuarel);
		console.log("img_path: ",img);*/

	    // console.log(results_ray);



// **************************************************
// Convert robust model to cheerio object structure
// **************************************************

/*		$('div.sh').each(function(i, element){
			var a = $(this)[0];
			var kids = a.children;
			var chilength = a.children.length
			// console.log(chilength);

			var title;
			var date;
			var length;
			var yuarel = domain.concat(a.attribs.url)
			var img;


			for(var j=0; j<chilength;j++){
				var current = kids[j]
				// console.log(current);
				// console.log(current.name);
				// console.log(current.attribs.class);

				if(current.name === 'a' && current.attribs.class === 'title'){
					title = current.attribs.title
				}
				if(current.name === 'span' && current.attribs.class === 'len'){
					length = current.children[0].data;
				}

				if(current.name === 'span' && current.attribs.class === 'dat'){
					date = current.children[0].data;
				}
				if(current.name === 'span' && current.attribs.class === 'dsc'){
					dsc = current.children[0].data;
				}
				if(current.name === 'a' && current.attribs.class === undefined){
					img = domain.concat(current.children[0].attribs.src);
				}

			}

			console.log("#: ",i);
			console.log("ID: ",a.attribs.c);
			console.log("title: ",title);
			console.log("date: ",date);		
			console.log("description: ",dsc);
			console.log("length: ",length);
			console.log("URL: ",yuarel);
			console.log("img_path: ",img);

		})*/


// **************************************************
// clean up... push to array. 
// **************************************************

		$('div.list__item').each(function(i, element){
			var a = $(this)[0];
			// console.log("a: ", a);
			var kids = a.children;
			var chilength = a.children.length

			var tempObj = {
				'#': i,
				ID: a.attribs.c,
				title: null,
				date: null,
				desc: null,
				length: null,
				url: domain.concat(a.attribs.url),
				img_path: null
			}

			// console.log("tempObj: ", tempObj)

			for(var j=0; j<chilength;j++){
				var current = kids[j]

				if(current.name === 'a' && current.attribs.class === 'title'){
					tempObj.title = current.attribs.title
				}
				if(current.name === 'span' && current.attribs.class === 'len'){
					tempObj.length = current.children[0].data;
				}

				if(current.name === 'span' && current.attribs.class === 'dat'){
					tempObj.date = current.children[0].data;
				}
				if(current.name === 'span' && current.attribs.class === 'dsc'){
					tempObj.desc = current.children[0].data;
				}
				if(current.name === 'a' && current.attribs.class === undefined){
					tempObj.img_path = domain.concat(current.children[0].attribs.src);
				}

			}

			results_ray.push(tempObj);

		})

		console.log(results_ray);
		// return results_ray;

/*		console.log("Processing");
		var wstream = fs.createWriteStream('save.txt');
		wstream.write(results_ray);
		wstream.end();
*/

// ***********
	} // close IF
}); // close request
// ***********


var list = function () {
  return _.clone(results_ray);
};
// console.log("list: ",list);
module.exports = { list: list };


