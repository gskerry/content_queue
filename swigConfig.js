
var swig = require('swig')

module.exports = function(app){

	swig.setDefaults({ cache: false });
	app.engine('html', swig.renderFile);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'html');

}
