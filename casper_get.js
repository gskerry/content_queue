
var casper = require('casper').create({
    // verbose: true,
    // logLevel: "debug"
});
var fs = require('fs');

var cb = function (){
    this.echo("I've waited for 2 seconds.");
}

casper.start('http://www.pbs.org/wgbh/frontline/watch/')

casper.then(function(){
    this.wait(2000, cb);
})

var dostuff = function(){
    var page = this.getCurrentUrl()
    console.log('page:', page);
}

casper.then(function(){
    
})

casper.run();