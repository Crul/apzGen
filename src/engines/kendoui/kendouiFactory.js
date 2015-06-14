define(['src/engines/kendoui/kendouiHtmlAspect'],
	function (kendouiHtmlAspect) {
		var dis = {};
		dis.create = create;

		function create(definition) {
			var kendoui = require('util')._extend({}, definition);
			kendoui.libs = ['kendoui'];
			kendoui.aspects = [kendouiHtmlAspect];
			kendoui.angularjs = {
				dependencies: ['kendo.directives']
			};
			return kendoui;
		}

		return dis;
	});