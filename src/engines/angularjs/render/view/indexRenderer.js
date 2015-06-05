define(['src/render/view/html/html5PageRenderer'],
	function (html5PageRenderer) {
		var dis = require('util')._extend({}, html5PageRenderer);
		dis.render = render;

		function render(apzFile) {
			var app = apzFile.feature;
			var appName = app.featureName;

			var title = app.title || appName || 'angularjsApp';
			var htmlAttributes = "ng-app='" + appName + "'";
			var body = renderBody(title);
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

		function renderBody(title) {
			return dis.renderTag('h1', title) + dis.renderTag('div', ' ', 'ng-view');
		}

		function getFiles(app) {
			return (app.angularjs.factories || [])
				.concat(app.angularjs.controllers || [])
				.concat(app.apzFiles || []);
		}

		return dis;
	});