
var casper = require('casper').create({
    // verbose: true,
    // logLevel: "debug"
});

var fs = require('fs');
var assert = require('assert');

var request = require('request');
var cheerio = require('cheerio');

var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/test';

var i = 0;
var d = new Date();
var yr = d.getFullYear();
var month = d.getMonth();
var day = d.getDate();
var hrs = d.getHours();
var mins = d.getMinutes();

var datepath = yr+"-"+month+"-"+day+"--"+hrs+mins
console.log(datepath);

var outer_ray = [];

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

var scrape_promise_too = function(file){
    return new Promise(function(resolve, reject){

        fs.readFile(path+'/'+file, 'utf8', function(err, data){
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

casper.on('error', function(msg){
    console.log("error: ",msg)
})

casper.start('http://www.pbs.org/wgbh/frontline/watch/')

casper.then(function(){
    this.wait(2000, function() {
        this.echo("I've waited for 2 seconds.");
        if (this.exists('#pbs-modal-overlay')){
            console.log("PopUp Detected.")
            this.click('.closeBtn');    
        }
        
    });
}).repeat(5, function(){
    
    if (this.exists('#pbs-modal-overlay')){
            console.log("PopUp Detected.")
            this.click('.closeBtn');
    }

    var page = this.getCurrentUrl()
    console.log('page:', page);

    this.capture(datepath+'/frontline-'+ i +'.png', {
        top: 0,
        left: 0,
        width: 500,
        height: 400
    });

    var code = this.getHTML()
    // console.log("code: ",code)

    this.download(page, datepath+'/index-'+i+'.html')

    this.click('a.pagination__link.pagination__page.pagination__next');

    i++;

});

casper.then(function() {
    
    var files = fs.readdirSync(datepath)
    // console.log(files);

    var outer_promise_ray = files.map(scrape_promise_too);
    console.log("outer_promise_ray: ",outer_promise_ray);

    Promise.all(outer_promise_ray)
        .then(function(results){
            // console.log("outer_promise_ray results: ",results)
            // console.log("outer_ray: ",outer_rsay)
            console.log("outer_ray sample: ",outer_ray[0])

            MongoClient.connect(url, function(err, db) {
                assert.equal(null, err);

                var inner_promise_ray = outer_ray.map( function(doc){ return upsert_promise(db, doc.ref, doc)} )
                console.log("inner_promise_ray sample: ", inner_promise_ray[0])

                Promise.all(inner_promise_ray)
                .then(function(){
                        console.log("close db here...")
                        db.close();
                    }
                )
            });

            var storeStr = JSON.stringify(outer_ray)
            fs. appendFile('frontlines_ALL.json', storeStr, 'utf8', function(err){
                if (err) throw err;
                console.log("data appended to file");
            });
        })

});

casper.then(function() {
    exit()
});

casper.run();
