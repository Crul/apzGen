define(
	[
		'src/system/logger',
		'src/system/fsService',
		'src/engines/angularjs/factories/appBootstrapFactory'
	],
	function (logger, fsService, appBootstrapFactory) {
		var dis = {};
		dis.create = create;

		var requiredLibs = [
			'jquery',
			'angularjs',
			'angularjs.route',
			'kendo',
			'lib/angular-local-storage.min.js'
		];
		var angularjsDependencies = ['ngRoute', 'LocalStorageModule', 'kendo.directives'];
		var homeApzFiles = [
			{ fileType: 'class', fileName: 'app' },
			{ fileType: 'view', fileName: 'index', renderer: 'index' }
		];

		function create(definition) {
			var app = require('util')._extend({}, definition);
			app.featureName = app.appName || app.featureName || 'apzApp';

			app.apzFiles = getApzFiles(app);
			app.libs = getThirdPartyLibs(app, requiredLibs);

			app.angularjs = app.angularjs || {};
			app.angularjs.dependencies = angularjsDependencies;
			app.angularjs.factories = initElements('factories', app);
			app.angularjs.controllers = initElements('controllers', app);
			app.angularjs.routes = initElements('routes', app).map(fsService.addStartSlash);

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

		function initElements(elementObject, app) {
			return (app.angularjs[elementObject] || [])
				.concat(appBootstrapFactory.initElements(elementObject, app.features));
		}

		function getApzFiles(app) {
			return (app.apzFiles || []).concat(homeApzFiles);
		}

		return dis;
	});