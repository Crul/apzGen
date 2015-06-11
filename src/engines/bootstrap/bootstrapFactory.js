define([], function () {
	var dis = {};
	dis.create = create;

	function create(definition) {
		var bootstrap = require('util')._extend({}, definition);
		bootstrap.libs = ['bootstrap'];
		bootstrap.renderPipeline = {
			view: ['src/engines/bootstrap/bootstrapRendererFactory']
		};
		return bootstrap;
	}

	return dis;
});