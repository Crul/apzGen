define([], function () {
	var dis = {};
	dis.create = create;

	function create(definition) {
		var kendoui = require('util')._extend({}, definition);
		kendoui.libs = ['kendoui'];
		kendoui.renderPipeline = {
			view: ['src/engines/kendoui/kendouiRendererFactory']
		};
		return kendoui;
	}

	return dis;
});