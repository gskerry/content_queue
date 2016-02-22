
var casper = require('casper').create({
    // verbose: true,
    // logLevel: "debug"
});

var d = new Date();
var yr = d.getFullYear();
var month = d.getMonth();
var day = d.getDate();
var hrs = d.getHours();
var mins = d.getMinutes();

var mydate = yr+"-"+month+"-"+day+"--"+hrs+mins
console.log(mydate);

casper.start('http://www.pbs.org/wgbh/frontline/watch/')

casper.then(function(){
    this.echo(mydate)
})

casper.then(function() {
    exit()
});

casper.run();