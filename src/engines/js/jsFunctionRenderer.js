define(['src/engines/js/jsFileRenderer'], 
	function (jsFileRenderer){
		var dis = require('util')._extend({}, jsFileRenderer);
		dis.render = render;; 
			
		var template = '' + 
			'function /*{name}*/(/*{parameters}*/){\n' +
				'//{body}\n' +
			'}';
		
		function render(name, body, parameters){
			var data = { 
				name: name,
				body: body,
				parameters: (parameters || []).join(', ')
			};
			return jsFileRenderer.render(template.toString(), data);
		}
			
		return dis;
	});