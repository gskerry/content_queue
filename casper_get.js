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

var traverse_promise = function(){
    console.log("traverse_promise called.")
    return new Promise(function(resolve, reject){

        casper.on("error", function(){
            console.log("casper error: ",error)
            reject(error)
        });

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

            this.capture(mydate+'/frontline-'+ i +'.png', {
                top: 0,
                left: 0,
                width: 500,
                height: 400
            });

            var code = this.getHTML()

            this.download(page, mydate+'/index-'+i+'.html')

            this.click('a.pagination__link.pagination__page.pagination__next');

            i++;

        });

        casper.then(function() {
            resolve();
            exit();
        });

        casper.run();
    }); // close promise
} // close traverse_promise


traverse_promise.then(function(){
    console.log("all done.")
})