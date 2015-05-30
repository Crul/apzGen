define(['src/render/class/js/jsFileRenderer'],
	function (jsFileRenderer) {
		var dis = require('util')._extend({}, jsFileRenderer);
		dis.render = render;;

		var template = '' +
			'function /*{functionName}*/(/*{parameters}*/){\n' +
			'//{body}\n' +
			'}';

		function render(functionName, body, parameters) {
			var data = {
				functionName: functionName,
				body: body,
				parameters: (parameters || []).join(', ')
			};
			return jsFileRenderer.render(template.toString(), data);
		}

		return dis;
	});