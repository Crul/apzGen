define(
	[
		'src/system/logger',
		'src/system/fsService',
		'src/engines/angularjs/factories/appBootstrap'
	],
	function (logger, fsService, appBootstrap) {
		var dis = {};
		dis.create = create;
		dis.dependentFeatures = { featureName: 'bootstrap' };

		var requiredLibs = ['jquery', 'angularjs', 'angularjs.route', 'lib/angular-local-storage.min.js'];
		var angularjsDependencies = ['ngRoute', 'LocalStorageModule', 'kendo.directives'];
		var homeApzFiles = [
			{ fileType: 'class', fileName: 'app' },
			{ fileType: 'view', fileName: 'index', renderer: 'index' }
		];

		function create(definition) {
			var app = require('util')._extend({}, definition);
			initFeature(app);
			initRenderPipeline(app);
			initAngularjs(app);
			return app;

			function initFeature() {
				app.featureName = app.appName || app.featureName || 'apzApp';
				app.apzFiles = appBootstrap.getApzFiles(app, homeApzFiles);
				app.libs = appBootstrap.getThirdPartyLibs(app, requiredLibs);
			}

			function initRenderPipeline() {
				initAppElement('renderPipeline', 'view');
				initAppElement('renderPipeline', 'class');
				appBootstrap.setRenderPipeline(app.renderPipeline);
			}

			function initAngularjs() {
				var angularjsElements = ['routes', 'config', 'factories', 'controllers'];
				angularjsElements.forEach(initAngularjsElement);
				app.angularjs.routes = app.angularjs.routes.map(fsService.addStartSlash);
				app.angularjs.dependencies = angularjsDependencies;
				
				function initAngularjsElement(elementsName) {
					return initAppElement('angularjs', elementsName);
				}
			}

			function initAppElement(baseName, elementsName) {
				app[baseName] = app[baseName] || {};
				app[baseName][elementsName] = appBootstrap.initElements(baseName + '.' + elementsName, app);
			}
		}

		return dis;
	});