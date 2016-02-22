
var casper = require('casper').create({
    // verbose: true,
    // logLevel: "debug"
});
var fs = require('fs');

casper.start('http://www.pbs.org/wgbh/frontline/watch/');

casper.then(function() {
    this.click('a.pagination__link.pagination__page.pagination__next');
});

casper.then(function() {
    this.capture('frontline.png', {
        top: 0,
        left: 0,
        width: 500,
        height: 400
    });
});

casper.then(function() {
	exit()
});

casper.run();