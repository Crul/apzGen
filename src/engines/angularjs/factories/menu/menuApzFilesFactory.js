define(
	[
		'src/core/apzFileFactory',
		'src/engines/angularjs/templates/templateService',
		'src/engines/angularjs/factories/menu/menuJs'
	],
	function (apzFileFactory, templateService, menuJs) {
		var dis = {};
		dis.createApzFiles = createApzFiles;

		function createApzFiles(menu, app) {
			var menuJsModel = menuJs.getModel(menu, app);
			return [
				apzFileFactory.create('menu/menu.js', templateService.js.menu, menuJsModel),
				apzFileFactory.create('menu/menu.html', templateService.html.menu)
			];
		}

		return dis;
	});