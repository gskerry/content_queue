
var casper = require('casper').create({

    verbose: true,
    logLevel: "debug"

});

casper.start('http://www.google.com')


casper.then(function(){

	var start_point = 0;

	var recursive_func = function(input, that){

		if(input < 10){
			console.log(input)
			var page = that.getCurrentUrl()
			console.log("page: ",page)
			return recursive_func(input + 1, that);
		} else {
			return input
		}

	}

	recursive_func(start_point, this);

})


casper.then(function() {
	console.log("all done.")
    exit()
});


casper.run();