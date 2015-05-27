define(
	[
		'src/engines/angularjs/factories/app/factoryFactory',
		'src/engines/angularjs/factories/app/controllerFactory',
		'src/engines/angularjs/factories/app/routeFactory'
	],
	function (factoryFactory, controllersFactory, routeFactory) {
		var dis = {};
		dis.create = create;

		var requiredLibs = ['jquery', 'angularjs', 'angularjs.route'];
		var homeApzFiles = [
			{ fileType: 'class', path: '', fileName: 'app' },
			{ fileType: 'view', path: '', fileName: 'app', renderer: 'index' }
		];

		function create(definition, features) {
			var app = require('util')._extend({}, definition);
			app.featureName = app.appName || app.featureName || 'apzApp';
			app.path = '';
			app.angularjs = app.angularjs || {};
			app.angularjs.dependencies = ['ngRoute'];
			
			setThirdPartyLibs(app, requiredLibs);
			
			app.angularjs.factories = (app.angularjs.factories || [])
				.concat(factoryFactory.createFactories(features));
				
			app.angularjs.routes = (app.angularjs.routes || [])
				.concat(routeFactory.createRoutes(features));
				
			app.angularjs.controllers = (app.angularjs.controllers || [])
				.concat(controllersFactory.createControllers(features));

			app.apzFiles = (app.apzFiles || []).concat(homeApzFiles);
			return app;
		}
		
		function setThirdPartyLibs(app, requiredLibs) {
			var libs = requiredLibs.filter(function (requiredLib) {
				return app.libs.indexOf(requiredLib) < 0;
			});
			app.libs = libs.concat(app.libs || []);
		}

		return dis;
	});