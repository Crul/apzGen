define(
	[
		'src/core/apzFileFactory',
		'src/engines/angularjs/templates/templateService',
		'src/engines/angularjs/factories/app/appJs',
		'src/engines/angularjs/factories/app/indexHtml'
	],
	function (apzFileFactory, templateService, appJs, indexHtml) {
		var dis = {};
		dis.createApzFiles = createApzFiles;

		function createApzFiles(app) {
			var htmlModel = indexHtml.getModel(app);
			var jsModel = appJs.getModel(app);
			return [
				apzFileFactory.create('app.js', templateService.js.app, jsModel),
				apzFileFactory.create('index.html', templateService.html.index, htmlModel)
			];
		}

		return dis;
	});