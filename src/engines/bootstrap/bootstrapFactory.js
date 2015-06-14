define(['src/engines/bootstrap/bootstrapHtmlAspect'],
	function (bootstrapHtmlAspect) {
		var dis = {};
		dis.create = create;

		function create(definition) {
			var bootstrap = require('util')._extend({}, definition);
			bootstrap.libs = ['bootstrap'];
			bootstrap.aspects = [bootstrapHtmlAspect];
			return bootstrap;
		}

		return dis;
	});