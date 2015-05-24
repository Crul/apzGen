var requirejs = require('requirejs');
requirejs(['src/apzGen'], function(apzGen){
	apzGen.generate();
});