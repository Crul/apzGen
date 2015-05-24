define(['src/render/html/html5PageRenderer'], 
	function (html5PageRenderer){
		var dis = require('util')._extend({}, html5PageRenderer);
		dis.render = render;
		
		function render(definition){
			var title = definition.title || definition.name || 'angularjsApp';
			var body = html5PageRenderer.renderTag('h1', title)
				+ html5PageRenderer.renderTag('div', '', 'ng-view');
			
			var data = {
				title: title,
				bodyAttributes: "ng-app='" + definition.name + "'",
				body: body,
				libs: definition.libs,
				files: definition.files
			};
			
			return html5PageRenderer.render(data);
		}
		
		return dis;
	});