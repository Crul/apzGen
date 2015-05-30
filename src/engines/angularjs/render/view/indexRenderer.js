define(['src/render/view/html/html5PageRenderer'],
	function (html5PageRenderer) {
		var dis = require('util')._extend({}, html5PageRenderer);
		dis.render = render;

		function render(app) {
			var appName = app.featureName;
			var title = app.title || appName || 'angularjsApp';
			var htmlAttributes = "ng-app='" + appName + "'";
			var body = dis.renderTag('h1', title);
			body += dis.renderTag('div', ' ', 'ng-view');
			var libs = app.libs;
			var files = getFiles(app);

			var data = {
				title: title,
				htmlAttributes: htmlAttributes,
				body: body,
				libs: libs,
				files: files
			};

			return html5PageRenderer.render(data);
		}

		function getFiles(app) {
			return (app.angularjs.factories || [])
				.concat(app.angularjs.controllers || [])
				.concat(app.apzFiles || []);
		}

		return dis;
	});