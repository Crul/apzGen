define(
	[
		'src/engines/angularjs/factories/app/factoryFactory',
		'src/engines/angularjs/factories/app/controllerFactory',
		'src/engines/angularjs/factories/app/routeFactory'
	],
	function (factoryFactory, controllersFactory, routeFactory) {
		var dis = {};
		dis.create = create;
		dis.setFactories = setFactories;

		var angularjsDependencies = ['ngRoute', 'LocalStorageModule', 'kendo.directives'];
		var requiredFactories = ['seedwork/services/context.js'];
		var requiredLibs = [
			'jquery',
			'angularjs',
			'angularjs.route',
			'kendo',
			'lib/angular-local-storage.min.js',
		];
		
		var homeApzFiles = [
			{ fileType: 'class', path: '', fileName: 'app' },
			{ fileType: 'view', path: '', fileName: 'app', renderer: 'index' }
		];

		function create(definition, features) {
			var app = require('util')._extend({}, definition);
			app.featureName = app.appName || app.featureName || 'apzApp';
			app.path = '';
			app.angularjs = app.angularjs || {};
			app.angularjs.dependencies = angularjsDependencies;

			setThirdPartyLibs(app, requiredLibs);

			app.angularjs.factories = requiredFactories
				.concat(app.angularjs.factories || [])
				.concat(factoryFactory.createFactories(features));

			app.angularjs.routes = (app.angularjs.routes || [])
				.concat(routeFactory.createRoutes(features));

			app.angularjs.controllers = (app.angularjs.controllers || [])
				.concat(controllersFactory.createControllers(features));

			app.apzFiles = (app.apzFiles || []).concat(homeApzFiles);
			return app;
		}

		function setThirdPartyLibs(app, requiredLibs) {
			var libs = [];
			requiredLibs.concat(app.libs || []).forEach(addLib);
			app.libs = libs;

			function addLib(requiredLib) {
				if (libs.indexOf(requiredLib) < 0)
					libs.push(requiredLib);
			}
		}

		function setFactories(app, factories) {
			app.angularjs = app.angularjs || {};
			app.angularjs.factories = (app.angularjs.factories || []).concat(factories);
		}

		return dis;
	});