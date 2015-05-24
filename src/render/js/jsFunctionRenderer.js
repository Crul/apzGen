define(['src/render/js/jsFileRenderer'], 
	function (jsFileRenderer){
		var dis = {};
		dis.render = render;
		dis.getFilename = jsFileRenderer.getFilename; 
			
		var template = 'function /*{name}*/(/*{parameters}*/){\n' +
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