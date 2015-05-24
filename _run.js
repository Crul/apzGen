var requirejs = require('requirejs');
requirejs(['src/apzGen'], function(apzGen){
	console.log('');
	apzGen.generate();
});