
var casper = require('casper').create({
    // verbose: true,
    // logLevel: "debug"
});
var fs = require('fs');

var dostuff = function(){
    var page = this.getCurrentUrl()
    console.log('page:', page);
}

casper.start('http://www.pbs.org/wgbh/frontline/watch/')

casper.then(function(){
    this.wait(2000, function() {
        this.echo("I've waited for 2 seconds.");
        if (this.exists('#pbs-modal-overlay'))
        this.click('#pbs-close-popup');
    });
})

casper.then(function(){
    dostuff();
})

casper.run();