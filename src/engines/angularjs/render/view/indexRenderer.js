define(['src/system/utils', 'src/engines/html/html5PageRenderer'],
	function (utils, html5PageRenderer) {
		var dis = require('util')._extend({}, html5PageRenderer);
		dis.render = render;

		function render(apzFile) {
			var app = apzFile.feature;
			var appName = app.featureName;

			var title = app.title || appName || 'angularjsApp';
			var htmlAttributes = dis.renderAttr('ng-app', appName);
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
			var files = (app.angularjs.factories || [])
				.concat(app.angularjs.controllers || [])
				.concat(app.apzFiles || []);

			app.features.forEach(concatFeatureApzFiles);
			function concatFeatureApzFiles(feature) {
				var apzFilePaths = (feature.apzFiles || []);
				files = files.concat(apzFilePaths);
			}
			
			return utils.arrays.distinct(files);
		}

		return dis;
	});