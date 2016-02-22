
var express = require('express');
var morgan = require('morgan')
// var bodyParser = require('body-parser')
// var routes = require('./routes/')//(io)
var sass = require('node-sass');
var sassMiddleware = require('node-sass-middleware')

var scrapeject = require('./frontline2')

var app = express();

require('./swigConfig')(app)

var server = app.listen(1400, '0.0.0.0', function() {
	console.log("server listening...")
} );

app.use(morgan('dev'));
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
app.use(
  sassMiddleware({
    src: __dirname + '/assets', //where the sass files are 
    dest: __dirname + '/public', //where css should go
    debug: true
  })
);
app.use(express.static(__dirname + '/public'));

app.use( '/', function(req, res){
	console.log("App active - testing.")
	var list = scrapeject.list();
	res.render('index',{frontlines: list});
});
