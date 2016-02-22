
var casper = require('casper').create({
    // verbose: true,
    // logLevel: "debug"
});
var fs = require('fs');

var i = 0;
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
    
    var recurscrape = function(that){
        // console.log("that: ", that)
        var page = that.getCurrentUrl()        
        // console.log('page:', page);

        that.capture(mydate+'/images/frontline-'+ i +'.png', {
            top: 0,
            left: 0,
            width: 500,
            height: 400
        });

        that.download(page, mydate+'/html/index-'+i+'.html')

        if (that.exists('a.pagination__link.pagination__page.pagination__next')){
            i++;
            that.click('a.pagination__link.pagination__page.pagination__next')
            casper.then(function(){
                // var nextpage = that.getCurrentUrl() 
                // console.log('nextpage:', nextpage);  
                return recurscrape(this);
            })    
        } else {
            return "recursive is done."
        }

    }

    recurscrape(this);

});

casper.then(function(msg) {
    // console.log("all done.")
    exit()
});

casper.run();
