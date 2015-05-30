define(['src/render/html/html5PageRenderer'],
	function (html5PageRenderer) {
		var dis = require('util')._extend({}, html5PageRenderer);
		dis.render = render;

		function render(app) {
			var appName = app.featureName;
			var title = app.title || appName || 'angularjsApp';

			var body = dis.renderTag('h1', title)
				+ dis.renderTag('div', ' ', 'ng-view');

			var files = (app.angularjs.factories || [])
				.concat(app.angularjs.controllers || [])
				.concat(app.apzFiles || []);

			var data = {
				title: title,
				htmlAttributes: "ng-app='" + appName + "'",
				body: body,
				libs: app.libs,
				files: files
			};

			return html5PageRenderer.render(data);
		}
		

		return dis;
	});