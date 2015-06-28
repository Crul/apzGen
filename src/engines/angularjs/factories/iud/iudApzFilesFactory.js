define(['src/core/apzFileFactory', 'src/engines/angularjs/templates/templateService'],
	function (apzFileFactory, templateService) {
		var dis = {};
		dis.createApzFiles = createApzFiles;

		function createApzFiles(iud) {
			// TODO angularjs files and routes			
			var iudJsFilePath = iud.featureName + '/' + iud.angularjs.routes[1].controller + '.js';
			var iudHtmlFilePath = iud.angularjs.routes[1].template + '.html';
			var listJsFilePath = iud.featureName + '/' + iud.angularjs.routes[0].controller + '.js';
			var listHtmlFilePath = iud.angularjs.routes[0].template + '.html';

			return [
				apzFileFactory.create(iudJsFilePath, templateService.js.iud, iud),
				apzFileFactory.create(iudHtmlFilePath, templateService.html.iud, iud, templateService.html.partials),
				apzFileFactory.create(listJsFilePath, templateService.js.list, iud),
				apzFileFactory.create(listHtmlFilePath, templateService.html.list, iud)
			];
		}

		return dis;
	});