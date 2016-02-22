
var casper = require('casper').create({
    // verbose: true,
    // logLevel: "debug"
});
var fs = require('fs');

var i = 0;

casper.start('http://www.pbs.org/wgbh/frontline/watch/').repeat(5, function(){
	
	this.capture('frontline-'+ i +'.png', {
        top: 0,
        left: 0,
        width: 500,
        height: 400
    });

    this.click('a.pagination__link.pagination__page.pagination__next');

    i++;

});

casper.then(function() {
	exit()
});

casper.run();