define(['src/engines/angularjs/aspects/angularjsHtmlAspect', 'src/engines/angularjs/factories/app/appHelper'],
	function (angularjsHtmlAspect, appHelper) {
		var dis = {};
		dis.create = create;
		dis.dependentFeatures = [
			{ featureName: 'bootstrap' }, // TODO move to ditwuit feature
			{ featureName: 'kendoui' }
		];

		var requiredLibs = ['jquery', 'angularjs', 'angularjs.route'];
		var angularjsDependencies = ['ngRoute'];
		function create(definition) {
			var app = require('util')._extend({}, definition);
			app.aspects = [angularjsHtmlAspect];
			appHelper.initFeature(app, requiredLibs);
			app.angularjs = appHelper.getAngularjs(app, angularjsDependencies);
			return app;
		}

		return dis;
	});