define(['src/engines/angularjs/fileFactories/menuJs', 'src/engines/angularjs/fileFactories/menuHtml'],
	function (menuJs, menuHtml) {
		var dis = {};
		dis.create = create;

		function create(definition, app) {
			var menu = require('util')._extend({}, definition);
			var featureName = menu.featureName || 'menu';
			menu.apzFiles = getApzFiles(menu);
			menu.angularjs = initAngularjs(featureName);
			menu.excludeMenuOptions = menu.angularjs.routes.slice(0);
			return menu;
		}

		function getApzFiles(menu) {
			return [menuJs.create(menu), menuHtml.create(menu)];
		}

		function initAngularjs(featureName) {
			var angularjs = {};
			angularjs.controllers = [featureName];
			// TODO: angularjsRouteFactory
			angularjs.routes = [{
				isDefault: true,
				path: featureName,
				controller: featureName,
				template: featureName + '/' + featureName
			}];
			return angularjs;
		}

		return dis;
	});