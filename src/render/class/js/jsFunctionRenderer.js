// TODO move to jsHelper
define(['src/render/class/js/jsFileRenderer'],
	function (jsFileRenderer) {
		var dis = require('util')._extend({}, jsFileRenderer);
		dis.render = render;

		var template = '' +
			'function /*{functionName}*/(/*{parameters}*/) {\n' +
			'//{body}\n' +
			'}';

		function render(functionName, body, parameters) {
			if (parameters && !Array.isArray(parameters))
				parameters = [parameters];

			body = (body || '')
				.replace(/^/, '\t') 					// indent first line
				.replace(/\n/g, '\n\t') 				// indent non first lines
				.replace(/\n([ \t]*)(;*)$/mg, '')		// remove emtpy lines and alone ;
				.replace(/\{;/g, '\{')  				// remove {;
				.replace(/(\n)([ \t]*)\};/g, '$1$2\}'); // remove };
				
			var data = {
				functionName: functionName,
				body: body,
				parameters: (parameters || []).join(', ')
			};

			return jsFileRenderer.render(template, data);
		}

		return dis;
	});