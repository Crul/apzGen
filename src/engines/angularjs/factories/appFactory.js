define(
	[
		'src/engines/angularjs/aspects/angularjsHtmlAspect',
		'src/engines/angularjs/factories/appBootstrap',
		'src/engines/angularjs/fileFactories/appJs',
		'src/engines/angularjs/fileFactories/indexHtml'
	],
	function (angularjsHtmlAspect, appBootstrap, appJs, indexHtml) {
		var dis = {};
		dis.create = create;
		dis.dependentFeatures = [
			{ featureName: 'bootstrap' },
			{ featureName: 'kendoui' }
		];

		var requiredLibs = ['jquery', 'angularjs', 'angularjs.route'];
		function create(definition) {
			var app = require('util')._extend({}, definition);
			app.libs = requiredLibs;
			app.aspects = [angularjsHtmlAspect];
			initAngularjs(app);
			appBootstrap.initFeature(app, [appJs, indexHtml]);
			return app;
		}

		var angularjsDependencies = ['ngRoute'];
		function initAngularjs(app) {
			app.angularjs = { dependencies: angularjsDependencies };
			appBootstrap.initAngularjs(app, requiredLibs); // before initFeature because angularjs is needed for apzFiles
		}

		return dis;
	});