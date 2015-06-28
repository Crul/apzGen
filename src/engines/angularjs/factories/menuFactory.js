define(
	[
		'src/engines/angularjs/factories/helpers/angularjsFeatureHelper',
		'src/engines/angularjs/factories/menu/menuApzFilesFactory'
	],
	function (angularjsFeatureHelper, menuApzFilesFactory) {
		var dis = {};
		dis.create = create;

		var angularjsComponents = [{ isDefaultRoute: true }];

		function create(definition, app) {
			var menu = require('util')._extend({}, definition);
			menu.featureName = 'menu';
			menu.getApzFiles = menuApzFilesFactory.createApzFiles;
			angularjsFeatureHelper.initFeature(menu, angularjsComponents);
			menu.excludeMenuOptions = menu.angularjs.routes.slice(0);
			return menu;
		}

		return dis;
	});