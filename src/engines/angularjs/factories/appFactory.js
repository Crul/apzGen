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
			app.path = '';
			app.featureName = app.appName || app.featureName || 'apzApp';
			
			app.apzFiles = getApzFiles(app);
			app.libs = getThirdPartyLibs(app, requiredLibs);
			
			app.angularjs = app.angularjs || {};
			app.angularjs.dependencies = angularjsDependencies;
			app.angularjs.factories = createFactories(app, features);
			app.angularjs.routes = createRoutes(app, features);
			app.angularjs.controllers = createControllers(app, features);

			return app;
		}

		function getThirdPartyLibs(app, requiredLibs) {
			var libs = [];
			requiredLibs.concat(app.libs || []).forEach(addLib);
			return libs;

			function addLib(requiredLib) {
				if (libs.indexOf(requiredLib) < 0)
					libs.push(requiredLib);
			}
		}

		function setFactories(app, factories) {
			app.angularjs = app.angularjs || {};
			app.angularjs.factories = (app.angularjs.factories || []).concat(factories);
		}

		function createFactories(app, features) {
			return requiredFactories
				.concat(app.angularjs.factories || [])
				.concat(factoryFactory.createFactories(features));
		}

		function createRoutes(app, features) {
			return (app.angularjs.routes || [])
				.concat(routeFactory.createRoutes(features));
		}

		function createControllers(app, features) {
			return (app.angularjs.controllers || [])
				.concat(controllersFactory.createControllers(features));
		}
		
		function getApzFiles(app){
			return (app.apzFiles || []).concat(homeApzFiles);
		}

		return dis;
	});