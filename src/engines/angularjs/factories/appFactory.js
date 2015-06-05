define(
	[
		'src/system/logger',
		'src/system/fsService',
		'src/engines/angularjs/factories/angularjsElementFactory'
	],
	function (logger, fsService, angularjsElementFactory) {
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
			app.angularjs.factories = createElements('factories', app);
			app.angularjs.controllers = createElements('controllers', app);
			app.angularjs.routes = createElements('routes', app).map(fsService.addStartSlash);

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

		function createElements(elementObject, app) {
			return (app.angularjs[elementObject] || [])
				.concat(angularjsElementFactory.createElements(elementObject, app.features));
		}

		function getApzFiles(app) {
			return (app.apzFiles || []).concat(homeApzFiles);
		}

		return dis;
	});