var casper = require('casper').create({

    verbose: true,
    logLevel: "debug"

});

casper.start('http://www.google.com')


casper.then(function(){

	var start_point = 0;

	var recursive_func = function(input){

		if(input < 10){
			console.log(input)
			return recursive_func(input + 1);
		} else {
			return input
		}

	}

	recursive_func(start_point);

})


casper.then(function() {
	console.log("all done.")
    exit()
});


casper.run();