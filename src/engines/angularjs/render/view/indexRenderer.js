define(['src/engines/html/html5PageRenderer'], 
	function (html5PageRenderer){
		var dis = require('util')._extend({}, html5PageRenderer);
		dis.render = render;
		
		function render(feature){
			var title = feature.title || feature.name || 'angularjsApp';
			
			var body = html5PageRenderer.renderTag('h1', title)
				+ html5PageRenderer.renderTag('div', ' ', 'ng-view');
			
			var files = (feature.angularjs.factories || [])
				.concat(feature.fileDefinitions || []);
			 
			var data = {
				title: title,
				htmlAttributes: "ng-app='" + feature.name + "'",
				body: body,
				libs: feature.libs,
				files: files
			};
			
			return html5PageRenderer.render(data);
		}
		
		return dis;
	});